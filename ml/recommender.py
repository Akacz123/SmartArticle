import sys
import json
import numpy as np
import pandas as pd
from sklearn.decomposition import TruncatedSVD, PCA
from sklearn.neighbors import NearestNeighbors
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer

def compute_interaction_weight(activity):
    base_rating = activity.get("rating")
    val = float(base_rating) if base_rating is not None else 3.0

    seconds = activity.get("timeSpentSeconds", 0)
    time_bonus = min(seconds / 60.0 * 0.5, 2.0)

    feedback = activity.get("recommendationFeedback")
    fb_val = 0.0
    if feedback == 1:
        fb_val = 1.0
    elif feedback == -1:
        fb_val = -1.0

    return max(0.5, val + time_bonus + fb_val)

def content_based_pca_recommendations(articles, target_history, limit):
    df_articles = pd.DataFrame(articles)
    if df_articles.empty:
        return []

    corpus = (df_articles["category"] + " " + df_articles["title"] + " " + df_articles["summary"]).tolist()
    vectorizer = TfidfVectorizer(max_features=100)
    tfidf_matrix = vectorizer.fit_transform(corpus).toarray()

    n_features = tfidf_matrix.shape[1]
    n_components = min(10, n_features, len(articles))

    if n_components > 1:
        pca = PCA(n_components=n_components)
        embeddings = pca.fit_transform(tfidf_matrix)
    else:
        embeddings = tfidf_matrix

    consumed_ids = {a["articleId"] for a in target_history}
    user_weights = {a["articleId"]: compute_interaction_weight(a) for a in target_history}

    article_id_to_idx = {art["id"]: idx for idx, art in enumerate(articles)}

    user_profile = np.zeros(embeddings.shape[1])
    total_w = 0.0

    for aid in consumed_ids:
        if aid in article_id_to_idx:
            idx = article_id_to_idx[aid]
            w = user_weights.get(aid, 1.0)
            user_profile += embeddings[idx] * w
            total_w += w

    if total_w > 0:
        user_profile /= total_w
    else:
        user_profile = np.mean(embeddings, axis=0)

    sims = cosine_similarity(user_profile.reshape(1, -1), embeddings)[0]

    recommendations = []
    for idx, art in enumerate(articles):
        aid = art["id"]
        if aid not in consumed_ids:
            score = float(sims[idx])
            recommendations.append({
                "articleId": aid,
                "score": round(score, 4),
                "reason": f"Dopasowane na podstawie tematyki: {art['category']}"
            })

    recommendations.sort(key=lambda x: x["score"], reverse=True)
    return recommendations[:limit]

def collaborative_filtering(target_user_id, articles, activities, limit):
    if not activities:
        return []

    df_act = pd.DataFrame(activities)
    df_act["weight"] = df_act.apply(compute_interaction_weight, axis=1)

    pivot = df_act.pivot_table(index="userId", columns="articleId", values="weight", fill_value=0.0)

    if target_user_id not in pivot.index:
        return []

    all_article_ids = [a["id"] for a in articles]
    for aid in all_article_ids:
        if aid not in pivot.columns:
            pivot[aid] = 0.0

    pivot = pivot[all_article_ids]

    user_ids = pivot.index.tolist()
    target_idx = user_ids.index(target_user_id)
    target_consumed = set(df_act[df_act["userId"] == target_user_id]["articleId"])

    n_users, n_items = pivot.shape

    scores = {}

    if n_users >= 3 and n_items >= 3:
        n_comp = min(3, n_users - 1, n_items)
        svd = TruncatedSVD(n_components=n_comp, random_state=42)
        reduced = svd.fit_transform(pivot.values)
        reconstructed = svd.inverse_transform(reduced)
        pred_ratings = reconstructed[target_idx]

        for aid_idx, aid in enumerate(all_article_ids):
            if aid not in target_consumed:
                scores[aid] = float(pred_ratings[aid_idx])

    if n_users >= 2:
        n_neighbors = min(5, n_users)
        knn = NearestNeighbors(metric="cosine", algorithm="brute", n_neighbors=n_neighbors)
        knn.fit(pivot.values)
        distances, indices = knn.kneighbors([pivot.values[target_idx]])

        similar_user_indices = indices[0][1:]
        similar_distances = distances[0][1:]

        for u_idx, dist in zip(similar_user_indices, similar_distances):
            similarity = 1.0 - dist
            if similarity > 0:
                other_ratings = pivot.values[u_idx]
                for aid_idx, aid in enumerate(all_article_ids):
                    if aid not in target_consumed and other_ratings[aid_idx] > 0:
                        scores[aid] = scores.get(aid, 0.0) + (other_ratings[aid_idx] * similarity)

    results = []
    article_dict = {a["id"]: a for a in articles}
    for aid, s in scores.items():
        art = article_dict.get(aid)
        if art:
            results.append({
                "articleId": aid,
                "score": round(float(s), 4),
                "reason": f"Popularne wśród czytelników o podobnych zainteresowaniach ({art['category']})"
            })

    results.sort(key=lambda x: x["score"], reverse=True)
    return results[:limit]

def main():
    try:
        raw_input = sys.stdin.read()
        if not raw_input.strip():
            print(json.dumps([]))
            return

        payload = json.loads(raw_input)
        target_user_id = payload.get("targetUserId", 0)
        articles = payload.get("articles", [])
        activities = payload.get("activities", [])
        limit = payload.get("limit", 6)

        target_history = [a for a in activities if a.get("userId") == target_user_id]

        if not target_history:
            top_articles = sorted(articles, key=lambda a: a.get("readTimeMinutes", 0), reverse=True)[:limit]
            res = [{
                "articleId": a["id"],
                "score": 1.0,
                "reason": f"Polecane na start w kategorii {a['category']}"
            } for a in top_articles]
            print(json.dumps(res, ensure_ascii=False))
            return

        cf_results = collaborative_filtering(target_user_id, articles, activities, limit)
        content_results = content_based_pca_recommendations(articles, target_history, limit)

        combined = {}

        for item in cf_results:
            aid = item["articleId"]
            combined[aid] = {
                "articleId": aid,
                "score": item["score"] * 0.6,
                "reason": item["reason"]
            }

        for item in content_results:
            aid = item["articleId"]
            if aid in combined:
                combined[aid]["score"] += item["score"] * 0.4
            else:
                combined[aid] = {
                    "articleId": aid,
                    "score": item["score"],
                    "reason": item["reason"]
                }

        final_list = list(combined.values())
        final_list.sort(key=lambda x: x["score"], reverse=True)

        if not final_list:
            top_articles = sorted(articles, key=lambda a: a.get("id", 0))[:limit]
            final_list = [{
                "articleId": a["id"],
                "score": 0.5,
                "reason": f"Popularny artykuł w kategorii {a['category']}"
            } for a in top_articles]

        print(json.dumps(final_list[:limit], ensure_ascii=False))
    except Exception as e:
        sys.stderr.write(str(e))
        print(json.dumps([]))

if __name__ == "__main__":
    main()
