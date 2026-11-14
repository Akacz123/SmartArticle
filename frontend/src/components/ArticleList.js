import React, { useState, useEffect } from 'react';
import ArticleCard from './ArticleCard';

const API = 'http://localhost:5000/api';

function ArticleList({ onReadArticle }) {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Wszystkie');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [selectedCategory, search]);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API}/articles/categories`);
      if (res.ok) {
        const data = await res.json();
        setCategories(['Wszystkie', ...data]);
      }
    } catch {
    }
  };

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory && selectedCategory !== 'Wszystkie') {
        params.append('category', selectedCategory);
      }
      if (search.trim()) {
        params.append('search', search.trim());
      }

      const res = await fetch(`${API}/articles?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setArticles(data);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="articles-container">
      <div className="filter-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Szukaj artykułów..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          {search && (
            <button className="clear-search-btn" onClick={() => setSearch('')}>✕</button>
          )}
        </div>

        <div className="category-chips">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`chip ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading-state">Ładowanie artykułów...</div>
      ) : articles.length === 0 ? (
        <div className="empty-state">Brak artykułów dla wybranych kryteriów.</div>
      ) : (
        <div className="articles-grid">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              onRead={onReadArticle}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ArticleList;
