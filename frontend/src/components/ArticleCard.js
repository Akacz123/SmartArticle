import React from 'react';

function ArticleCard({ article, onRead, isRecommendation = false, recommendationReason, recommendationScore, onFeedback }) {
  return (
    <div className={`article-card ${isRecommendation ? 'card-recommendation' : ''}`}>
      {article.imageUrl && (
        <div className="card-image-wrap">
          <img src={article.imageUrl} alt={article.title} className="card-image" />
          <span className="card-category">{article.category}</span>
        </div>
      )}

      <div className="card-body">
        {!article.imageUrl && <span className="card-category">{article.category}</span>}

        {isRecommendation && (
          <div className="ml-badge-container">
            <span className="ml-badge">✨ Rekomendacja ML</span>
            {recommendationScore !== undefined && (
              <span className="ml-score">Dopasowanie: {Math.round(recommendationScore * 100)}%</span>
            )}
          </div>
        )}

        {recommendationReason && (
          <p className="recommendation-reason">{recommendationReason}</p>
        )}

        <h3 className="card-title">{article.title}</h3>
        <p className="card-summary">{article.summary}</p>

        <div className="card-footer">
          <span className="read-time">⏱️ {article.readTimeMinutes || 3} min czytania</span>
          <button className="btn btn-primary btn-sm" onClick={() => onRead(article.id || article.articleId, isRecommendation)}>
            Czytaj artykuł
          </button>
        </div>

        {isRecommendation && onFeedback && (
          <div className="card-feedback">
            <span className="feedback-label">Trafność:</span>
            <button
              className="feedback-btn positive"
              title="Trafna rekomendacja"
              onClick={(e) => {
                e.stopPropagation();
                onFeedback(article.articleId || article.id, 1);
              }}
            >
              👍 Trafna
            </button>
            <button
              className="feedback-btn negative"
              title="Nietrafna rekomendacja"
              onClick={(e) => {
                e.stopPropagation();
                onFeedback(article.articleId || article.id, -1);
              }}
            >
              👎 Nietrafna
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ArticleCard;
