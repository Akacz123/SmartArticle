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
      const res = await fetch(`${API}/recommendations/${userId}?limit=6`);
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
        setFeedbackNotice(feedback === 1 ? 'Dziękujemy! Oznaczono jako trafną.' : 'Dziękujemy! Uwzględnimy to w kolejnych rekomendacjach.');
        setTimeout(() => setFeedbackNotice(''), 3000);
      }
    } catch {
    }
  };

  return (
    <div className="recommendations-container">
      <div className="section-intro">
        <h2>Rekomendacje personalizowane dla Ciebie</h2>
        <p>
          Model ML analizuje historię przeczytanych artykułów, spędzony czas czytania oraz oceny,
          wykorzystując <strong>Collaborative Filtering</strong>, <strong>KNN</strong> oraz <strong>PCA</strong>.
        </p>
      </div>

      {feedbackNotice && (
        <div className="feedback-toast">{feedbackNotice}</div>
      )}

      {loading ? (
        <div className="loading-state">Obliczanie rekomendacji przez model ML...</div>
      ) : recommendations.length === 0 ? (
        <div className="empty-state">
          Brak rekomendacji. Przeczytaj kilka artykułów, aby model poznał Twoje preferencje!
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
