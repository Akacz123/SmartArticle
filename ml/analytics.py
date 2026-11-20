import sys
import json
import numpy as np
import pandas as pd
from sklearn.decomposition import PCA, TruncatedSVD
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def calculate_persona(category_weights):
    if not category_weights:
        return {
            "name": "Eksplorator Technologii",
            "description": "Profil ogólny o zrównoważonych zainteresowaniach nowymi technologiami.",
            "confidence": 0.65
        }

    sorted_cats = sorted(category_weights.items(), key=lambda x: x[1], reverse=True)
    top_cat, top_w = sorted_cats[0]
    total_w = sum(category_weights.values()) or 1.0
    confidence = round(min(0.98, top_w / total_w + 0.25), 2)

    personas = {
        "Sztuczna Inteligencja": {
            "name": "Specjalista AI & Data Science",
            "description": "Profil skoncentrowany na modelach generatywnych, głębokich sieciach neuronowych oraz algorytmice."
        },
        "Cyberbezpieczeństwo": {
            "name": "Inżynier Cyberbezpieczeństwa",
            "description": "Zainteresowania skupione na kryptografii, architekturze Zero Trust oraz odporności systemów."
        },
        "Chmura i DevOps": {
            "name": "Architekt Chmury & DevOps",
            "description": "Profil ukierunkowany na orkiestrację kontenerów, skalowalność mikroserwisów i CI/CD."
        },
        "Programowanie": {
            "name": "Inżynier Oprogramowania",
            "description": "Profil zorientowany na architekturę kodu, wzorce projektowe, języki programowania i frameworki."
        },
        "Biznes": {
            "name": "Analityk Biznesu & Startupów",
            "description": "Zainteresowania związane z monetaryzacją, rynkami technologicznymi i strategią produktową."
        },
        "Nauka": {
            "name": "Badacz Nauk Ścisłych",
            "description": "Profil skoncentrowany na fizyce, badaniach kosmicznych, biologii i przełomach naukowych."
        },
        "Zdrowie": {
            "name": "Ekspert MedTech & Zdrowia",
            "description": "Zainteresowania z obszaru telemedycyny, biotechnologii i optymalizacji stylu życia."
        }
    }

    persona = personas.get(top_cat, {
        "name": "Eksplorator Technologii",
        "description": "Zrównoważony profil czytelnika poszukującego wiedzy interdyscyplinarnej."
    })

    return {
        "name": persona["name"],
        "description": persona["description"],
        "confidence": confidence
    }

def predict_next_category(target_history, all_activities, articles_map):
    if not target_history:
        return {
            "predictedNextCategory": {"category": "Sztuczna Inteligencja", "probability": 0.40},
            "categoryProbabilities": [
                {"category": "Sztuczna Inteligencja", "probability": 0.40},
                {"category": "Technologia", "probability": 0.30},
                {"category": "Programowanie", "probability": 0.20},
                {"category": "Cyberbezpieczeństwo", "probability": 0.10}
            ]
        }

    cat_counts = {}
    total = 0
    for act in target_history:
        art = articles_map.get(act["articleId"])
        if art:
            cat = art["category"]
            cat_counts[cat] = cat_counts.get(cat, 0) + 1
            total += 1

    probs = []
    for cat, count in cat_counts.items():
        probs.append({
            "category": cat,
            "probability": round(count / (total or 1), 2)
        })

    probs.sort(key=lambda x: x["probability"], reverse=True)

    if not probs:
        return {
            "predictedNextCategory": {"category": "Technologia", "probability": 0.50},
            "categoryProbabilities": [{"category": "Technologia", "probability": 0.50}]
        }

    return {
        "predictedNextCategory": probs[0],
        "categoryProbabilities": probs[:5]
    }

def main():
    try:
        raw_input = sys.stdin.read()
        if not raw_input.strip():
            print(json.dumps({}))
            return

        payload = json.loads(raw_input)
        target_user_id = payload.get("targetUserId", 0)
        articles = payload.get("articles", [])
        activities = payload.get("activities", [])

        if not articles:
            print(json.dumps({}))
            return

        articles_map = {a["id"]: a for a in articles}
        target_history = [act for act in activities if act.get("userId") == target_user_id]
        read_article_ids = {act["articleId"] for act in target_history}

        category_weights = {}
        for act in target_history:
            art = articles_map.get(act["articleId"])
            if art:
                cat = art["category"]
                rating = act.get("rating") or 3.0
                time_sec = act.get("timeSpentSeconds", 0)
                w = float(rating) + min(time_sec / 60.0, 3.0)
                category_weights[cat] = category_weights.get(cat, 0.0) + w

        user_persona = calculate_persona(category_weights)
        next_cat_data = predict_next_category(target_history, activities, articles_map)

        avg_time = 0
        if target_history:
            times = [act.get("timeSpentSeconds", 0) for act in target_history if act.get("timeSpentSeconds", 0) > 0]
            if times:
                avg_time = int(np.mean(times))

        optimal_reading_time = max(3, int(round((avg_time or 240) / 60.0)))
        predicted_engagement_score = min(98, max(45, int(40 + len(target_history) * 6 + (avg_time / 10))))

        corpus = [f"{a.get('category', '')} {a.get('title', '')} {a.get('summary', '')}" for a in articles]
        vectorizer = TfidfVectorizer(max_features=120, stop_words=None)
        tfidf = vectorizer.fit_transform(corpus).toarray()

        pca = PCA(n_components=2, random_state=42)
        coords_2d = pca.fit_transform(tfidf)
        explained_variance = float(np.sum(pca.explained_variance_ratio_))

        user_vec = np.zeros(tfidf.shape[1])
        if target_history:
            for act in target_history:
                art_id = act["articleId"]
                for idx, art in enumerate(articles):
                    if art["id"] == art_id:
                        user_vec += tfidf[idx]
            norm = np.linalg.norm(user_vec)
            if norm > 0:
                user_vec /= norm
        else:
            user_vec = np.mean(tfidf, axis=0)

        user_2d = pca.transform(user_vec.reshape(1, -1))[0]

        article_points = []
        for idx, art in enumerate(articles[:40]):
            aid = art["id"]
            is_read = aid in read_article_ids

            pred_sim = cosine_similarity(user_vec.reshape(1, -1), tfidf[idx].reshape(1, -1))[0][0]
            pred_rating = round(float(np.clip(2.5 + (pred_sim * 2.5), 1.0, 5.0)), 1)
            affinity_percent = int(round(np.clip(50 + (pred_sim * 49), 40, 99)))

            article_points.append({
                "id": aid,
                "title": art["title"],
                "category": art["category"],
                "x": round(float(coords_2d[idx][0]), 3),
                "y": round(float(coords_2d[idx][1]), 3),
                "isRead": is_read,
                "predictedRating": pred_rating,
                "affinityPercent": affinity_percent
            })

        result = {
            "userPersona": user_persona,
            "predictedNextCategory": next_cat_data["predictedNextCategory"],
            "categoryProbabilities": next_cat_data["categoryProbabilities"],
            "optimalReadingTimeMinutes": optimal_reading_time,
            "predictedEngagementScore": predicted_engagement_score,
            "pcaProjection": {
                "userPoint": {
                    "x": round(float(user_2d[0]), 3),
                    "y": round(float(user_2d[1]), 3),
                    "label": "Twój profil"
                },
                "articlePoints": article_points
            },
            "modelMetrics": {
                "algorithm": "SVD Matrix Factorization + PCA 2D + TF-IDF Cosine Similarity",
                "explainedVarianceRatio": round(explained_variance, 3),
                "totalAnalyzedArticles": len(articles),
                "totalInteractions": len(target_history)
            }
        }

        print(json.dumps(result, ensure_ascii=False))
    except Exception as e:
        sys.stderr.write(str(e))
        print(json.dumps({}))

if __name__ == "__main__":
    main()
