import React, { useState, useEffect, useRef } from 'react';

const API = 'http://localhost:5000/api';

function ArticleReader({ articleId, isRecommendation, userId, onBack }) {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [secondsSpent, setSecondsSpent] = useState(0);
  const [rating, setRating] = useState(null);
  const [recommendationFeedback, setRecommendationFeedback] = useState(null);
  const [savedNotice, setSavedNotice] = useState(false);

  const secondsRef = useRef(0);
  const ratingRef = useRef(null);
  const feedbackRef = useRef(null);

  useEffect(() => {
    fetchArticle();

    const interval = setInterval(() => {
      setSecondsSpent((prev) => {
        const next = prev + 1;
        secondsRef.current = next;
        return next;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      saveActivity(secondsRef.current, ratingRef.current, feedbackRef.current);
    };
  }, [articleId]);

  const fetchArticle = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/articles/${articleId}`);
      if (res.ok) {
        const data = await res.json();
        setArticle(data);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const saveActivity = async (seconds, currentRating, currentFeedback) => {
    if (!userId || !articleId) return;

    try {
      await fetch(`${API}/activity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          articleId: Number(articleId),
          timeSpentSeconds: seconds,
          rating: currentRating,
          isRecommendation: Boolean(isRecommendation),
          recommendationFeedback: currentFeedback
        })
      });
    } catch {
    }
  };

  const handleRatingChange = async (newRating) => {
    setRating(newRating);
    ratingRef.current = newRating;
    await saveActivity(secondsRef.current, newRating, feedbackRef.current);
    showNotice();
  };

  const handleFeedbackChange = async (feedbackVal) => {
    setRecommendationFeedback(feedbackVal);
    feedbackRef.current = feedbackVal;
    await saveActivity(secondsRef.current, ratingRef.current, feedbackVal);

    try {
      await fetch(`${API}/recommendations/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          articleId: Number(articleId),
          feedback: feedbackVal
        })
      });
    } catch {
    }

    showNotice();
  };

  const showNotice = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  if (loading) {
    return <div className="loading-state">Ładowanie artykułu...</div>;
  }

  if (!article) {
    return (
      <div className="reader-container">
        <button className="btn btn-secondary" onClick={onBack}>← Powrót do artykułów</button>
        <p className="empty-state">Nie znaleziono artykułu.</p>
      </div>
    );
  }

  return (
    <div className="reader-container">
      <div className="reader-header-bar">
        <button className="btn btn-secondary btn-sm" onClick={onBack}>
          ← Wróć do listy
        </button>
        <div className="reading-timer">
          ⏱️ Czas czytania: <strong>{secondsSpent}s</strong>
        </div>
      </div>

      <article className="reader-content">
        <div className="reader-meta">
          <span className="card-category">{article.category}</span>
          <span className="reader-date">
            {new Date(article.publishedAt).toLocaleDateString('pl-PL')}
          </span>
          <span className="reader-readtime">
            Szacowany czas: {article.readTimeMinutes} min
          </span>
        </div>

        <h1 className="reader-title">{article.title}</h1>
        <p className="reader-summary">{article.summary}</p>

        {article.imageUrl && (
          <img src={article.imageUrl} alt={article.title} className="reader-hero-image" />
        )}

        <div className="reader-body">
          {article.content.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </article>

      <section className="reader-feedback-box">
        <div className="feedback-section">
          <h4>Oceń ten artykuł:</h4>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className={`star-btn ${rating >= star ? 'star-active' : ''}`}
                onClick={() => handleRatingChange(star)}
              >
                ★
              </button>
            ))}
            {rating && <span className="rating-label">({rating}/5)</span>}
          </div>
        </div>

        {isRecommendation && (
          <div className="feedback-section ml-eval">
            <h4>Trafność rekomendacji ML:</h4>
            <div className="ml-feedback-buttons">
              <button
                className={`btn btn-sm ${recommendationFeedback === 1 ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => handleFeedbackChange(1)}
              >
                👍 Trafna rekomendacja
              </button>
              <button
                className={`btn btn-sm ${recommendationFeedback === -1 ? 'btn-danger' : 'btn-secondary'}`}
                onClick={() => handleFeedbackChange(-1)}
              >
                👎 Nietrafna rekomendacja
              </button>
            </div>
          </div>
        )}

        {savedNotice && (
          <div className="feedback-saved-notice">
            ✓ Zapisano Twoją opinię!
          </div>
        )}
      </section>
    </div>
  );
}

export default ArticleReader;
