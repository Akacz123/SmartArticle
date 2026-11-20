import React, { useState, useEffect } from 'react';
import ArticleCard from './ArticleCard';

const API = 'http://localhost:5000/api';

function ArticleList({ onReadArticle }) {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Wszystkie');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [selectedCategory, search, page]);

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
      params.append('page', page.toString());
      params.append('pageSize', pageSize.toString());

      const res = await fetch(`${API}/articles?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setArticles(data.items || []);
        setTotalPages(data.totalPages || 1);
        setTotalItems(data.totalItems || 0);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setPage(1);
  };

  const handleSearchChange = (val) => {
    setSearch(val);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
        setSyncMessage(`Zaktualizowano bazę. Dodano ${data.added} nowych artykułów (łącznie w repozytorium: ${data.total}).`);
        fetchArticles();
        fetchCategories();
      } else {
        setSyncMessage('Nie udało się pobrać nowych artykułów.');
      }
    } catch {
      setSyncMessage('Błąd połączenia z serwerem podczas synchronizacji.');
    } finally {
      setSyncing(false);
      setTimeout(() => setSyncMessage(''), 4500);
    }
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 5;
    let startPage = Math.max(1, page - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    if (startPage > 1) {
      buttons.push(
        <button key={1} className="page-btn" onClick={() => handlePageChange(1)}>
          1
        </button>
      );
      if (startPage > 2) {
        buttons.push(<span key="dots-start" className="page-dots">...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          className={`page-btn ${page === i ? 'page-active' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(<span key="dots-end" className="page-dots">...</span>);
      }
      buttons.push(
        <button key={totalPages} className="page-btn" onClick={() => handlePageChange(totalPages)}>
          {totalPages}
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className="articles-container">
      <div className="articles-header-bar">
        <div>
          <h1 className="page-heading">Baza wiedzy i artykułów</h1>
          <p className="page-subheading">
            Dostępnych pozycji: <strong>{totalItems}</strong> {totalPages > 1 && `(Strona ${page} z ${totalPages})`}
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
            placeholder="Szukaj artykułów według słów kluczowych..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="search-input"
          />
          {search && (
            <button className="clear-search-btn" onClick={() => handleSearchChange('')}>✕</button>
          )}
        </div>

        <div className="category-chips">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`chip ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => handleCategoryChange(cat)}
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
        <>
          <div className="articles-grid">
            {articles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onRead={onReadArticle}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination-bar">
              <button
                className="page-nav-btn"
                disabled={page <= 1}
                onClick={() => handlePageChange(page - 1)}
              >
                ← Poprzednia
              </button>

              <div className="page-numbers">
                {renderPaginationButtons()}
              </div>

              <button
                className="page-nav-btn"
                disabled={page >= totalPages}
                onClick={() => handlePageChange(page + 1)}
              >
                Następna →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ArticleList;
