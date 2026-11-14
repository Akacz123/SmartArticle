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
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <span>Ładowanie artykułu...</span>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="reader-container">
        <button className="btn btn-secondary btn-sm" onClick={onBack}>← Wróć do artykułów</button>
        <p className="empty-state">Nie znaleziono wybranego artykułu.</p>
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
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          Czas lektury: <strong>{secondsSpent}s</strong>
        </div>
      </div>

      <article className="reader-content">
        <div className="reader-meta">
          <span className="card-category cat-tech">{article.category}</span>
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
          <div className="reader-image-wrap">
            <img src={article.imageUrl} alt={article.title} className="reader-hero-image" />
          </div>
        )}

        <div className="reader-body">
          {article.content.split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </article>

      <section className="reader-feedback-box">
        <div className="feedback-section">
          <h4>Oceń jakość treści:</h4>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className={`star-btn ${rating >= star ? 'star-active' : ''}`}
                onClick={() => handleRatingChange(star)}
                title={`Ocena: ${star}/5`}
              >
                ★
              </button>
            ))}
            {rating && <span className="rating-label">{rating} / 5</span>}
          </div>
        </div>

        {isRecommendation && (
          <div className="feedback-section ml-eval">
            <h4>Trafność rekomendacji algorytmu:</h4>
            <div className="ml-feedback-buttons">
              <button
                className={`btn btn-sm ${recommendationFeedback === 1 ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => handleFeedbackChange(1)}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                </svg>
                Trafna
              </button>
              <button
                className={`btn btn-sm ${recommendationFeedback === -1 ? 'btn-danger' : 'btn-outline'}`}
                onClick={() => handleFeedbackChange(-1)}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"></path>
                </svg>
                Nietrafna
              </button>
            </div>
          </div>
        )}

        {savedNotice && (
          <div className="feedback-saved-notice">
            Zapisano Twoją opinię w bazie danych.
          </div>
        )}
      </section>
    </div>
  );
}

export default ArticleReader;
