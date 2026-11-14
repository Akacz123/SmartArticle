import React, { useState, useEffect } from 'react';
import ArticleCard from './ArticleCard';

const API = 'http://localhost:5000/api';

function RecommendationsView({ userId, onReadArticle }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackNotice, setFeedbackNotice] = useState('');

  useEffect(() => {
    fetchRecommendations();
  }, [userId]);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/recommendations/${userId}?limit=9`);
      if (res.ok) {
        const data = await res.json();
        setRecommendations(data);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (articleId, feedback) => {
    try {
      const res = await fetch(`${API}/recommendations/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          articleId,
          feedback
        })
      });

      if (res.ok) {
        setFeedbackNotice(feedback === 1 ? 'Dziękujemy za ocenę: Rekomendacja oznaczona jako trafna.' : 'Dziękujemy za ocenę: Rekomendacja oznaczona jako nietrafna.');
        setTimeout(() => setFeedbackNotice(''), 3500);
      }
    } catch {
    }
  };

  return (
    <div className="recommendations-container">
      <div className="section-intro">
        <h1 className="page-heading">Rekomendacje personalizowane</h1>
        <p className="page-subheading">
          Model uczenia maszynowego analizuje Twoją historię czytania, czas spędzony na artykułach oraz oceny,
          wykorzystując Collaborative Filtering, algorytm KNN oraz redukcję wymiarowości PCA.
        </p>
      </div>

      {feedbackNotice && (
        <div className="alert-box alert-success">{feedbackNotice}</div>
      )}

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <span>Obliczanie macierzy preferencji i generowanie rekomendacji...</span>
        </div>
      ) : recommendations.length === 0 ? (
        <div className="empty-state">
          Brak dostępnych rekomendacji. Przeczytaj kilka artykułów z bazy, aby model mógł nauczyć się Twoich preferencji.
        </div>
      ) : (
        <div className="articles-grid">
          {recommendations.map((rec) => (
            <ArticleCard
              key={rec.articleId}
              article={{
                id: rec.articleId,
                title: rec.title,
                summary: rec.summary,
                category: rec.category,
                readTimeMinutes: rec.readTimeMinutes,
                imageUrl: rec.imageUrl
              }}
              isRecommendation={true}
              recommendationReason={rec.reason}
              recommendationScore={rec.score}
              onRead={() => onReadArticle(rec.articleId, true)}
              onFeedback={handleFeedback}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default RecommendationsView;
