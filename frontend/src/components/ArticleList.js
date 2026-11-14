import React, { useState, useEffect } from 'react';
import ArticleCard from './ArticleCard';

const API = 'http://localhost:5000/api';

function ArticleList({ onReadArticle }) {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Wszystkie');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');

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

  const handleSyncExternal = async () => {
    setSyncing(true);
    setSyncMessage('');
    try {
      const res = await fetch(`${API}/articles/sync-external`, {
        method: 'POST'
      });
      if (res.ok) {
        const data = await res.json();
        setSyncMessage(`Pobrano ${data.added} nowych artykułów (łącznie w bazie: ${data.total}).`);
        fetchArticles();
        fetchCategories();
      } else {
        setSyncMessage('Nie udało się pobrać nowych artykułów.');
      }
    } catch {
      setSyncMessage('Błąd połączenia z serwerem podczas synchronizacji.');
    } finally {
      setSyncing(false);
      setTimeout(() => setSyncMessage(''), 4000);
    }
  };

  return (
    <div className="articles-container">
      <div className="articles-header-bar">
        <div>
          <h1 className="page-heading">Baza wiedzy i artykułów</h1>
          <p className="page-subheading">
            Dostępnych artykułów: <strong>{articles.length}</strong>
          </p>
        </div>

        <button
          className="btn btn-secondary btn-sm sync-btn"
          onClick={handleSyncExternal}
          disabled={syncing}
        >
          <svg className={syncing ? 'spin-icon' : ''} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10"></polyline>
            <polyline points="1 20 1 14 7 14"></polyline>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
          </svg>
          {syncing ? 'Pobieranie z API...' : 'Pobierz nowe z sieci'}
        </button>
      </div>

      {syncMessage && (
        <div className="alert-box alert-info">{syncMessage}</div>
      )}

      <div className="filter-bar">
        <div className="search-box">
          <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Szukaj artykułów według tytułu lub treści..."
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
        <div className="loading-state">
          <div className="spinner"></div>
          <span>Ładowanie bazy artykułów...</span>
        </div>
      ) : articles.length === 0 ? (
        <div className="empty-state">
          Brak artykułów dla wybranych kryteriów wyszukiwania.
        </div>
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
