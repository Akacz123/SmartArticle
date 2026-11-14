import React from 'react';

function ArticleCard({ article, onRead, isRecommendation = false, recommendationReason, recommendationScore, onFeedback }) {
  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'Sztuczna Inteligencja': return 'cat-ai';
      case 'Cyberbezpieczeństwo': return 'cat-sec';
      case 'Chmura i DevOps': return 'cat-cloud';
      case 'Programowanie': return 'cat-dev';
      case 'Nauka': return 'cat-sci';
      case 'Zdrowie': return 'cat-health';
      case 'Biznes': return 'cat-biz';
      default: return 'cat-tech';
    }
  };

  return (
    <div className={`article-card ${isRecommendation ? 'card-recommendation' : ''}`}>
      {article.imageUrl && (
        <div className="card-image-wrap">
          <img src={article.imageUrl} alt={article.title} className="card-image" loading="lazy" />
          <span className={`card-category ${getCategoryColor(article.category)}`}>
            {article.category}
          </span>
        </div>
      )}

      <div className="card-body">
        {!article.imageUrl && (
          <div className="card-category-standalone">
            <span className={`card-category ${getCategoryColor(article.category)}`}>
              {article.category}
            </span>
          </div>
        )}

        {isRecommendation && (
          <div className="ml-badge-container">
            <span className="ml-badge">Rekomendacja ML</span>
            {recommendationScore !== undefined && (
              <span className="ml-score">Dopasowanie: {Math.round(recommendationScore * 100)}%</span>
            )}
          </div>
        )}

        {recommendationReason && (
          <p className="recommendation-reason">{recommendationReason}</p>
        )}

        <h3 className="card-title" onClick={() => onRead(article.id || article.articleId, isRecommendation)}>
          {article.title}
        </h3>
        <p className="card-summary">{article.summary}</p>

        <div className="card-footer">
          <span className="read-time">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            {article.readTimeMinutes || 3} min czytania
          </span>
          <button className="btn btn-primary btn-sm" onClick={() => onRead(article.id || article.articleId, isRecommendation)}>
            Czytaj
          </button>
        </div>

        {isRecommendation && onFeedback && (
          <div className="card-feedback">
            <span className="feedback-label">Ocena trafności:</span>
            <button
              className="feedback-btn positive"
              title="Rekomendacja trafna"
              onClick={(e) => {
                e.stopPropagation();
                onFeedback(article.articleId || article.id, 1);
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
              </svg>
              Trafna
            </button>
            <button
              className="feedback-btn negative"
              title="Rekomendacja nietrafna"
              onClick={(e) => {
                e.stopPropagation();
                onFeedback(article.articleId || article.id, -1);
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"></path>
              </svg>
              Nietrafna
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ArticleCard;
