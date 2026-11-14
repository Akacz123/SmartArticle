import React, { useState, useEffect } from 'react';

const API = 'http://localhost:5000/api';

function ActivityHistory({ userId, onReadArticle }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, [userId]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/activity/user/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setActivities(data);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const formatSeconds = (sec) => {
    if (!sec) return '0 s';
    if (sec < 60) return `${sec} s`;
    const mins = Math.floor(sec / 60);
    const remSec = sec % 60;
    return `${mins} min ${remSec > 0 ? remSec + ' s' : ''}`;
  };

  return (
    <div className="history-container">
      <div className="section-intro">
        <h1 className="page-heading">Historia aktywności</h1>
        <p className="page-subheading">
          Zestawienie artykułów, czas spędzony na lekturze oraz wystawione oceny jakości i trafności rekomendacji.
        </p>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <span>Ładowanie historii...</span>
        </div>
      ) : activities.length === 0 ? (
        <div className="empty-state">
          Brak historii czytania. Przejdź do zakładki Artykuły, aby rozpocząć lekturę.
        </div>
      ) : (
        <div className="history-table-wrapper">
          <table className="history-table">
            <thead>
              <tr>
                <th>Artykuł</th>
                <th>Kategoria</th>
                <th>Czas czytania</th>
                <th>Ocena</th>
                <th>Źródło</th>
                <th>Data</th>
                <th>Akcja</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((item) => (
                <tr key={item.id}>
                  <td className="table-title">{item.articleTitle}</td>
                  <td>
                    <span className="card-category-inline">{item.category}</span>
                  </td>
                  <td>{formatSeconds(item.timeSpentSeconds)}</td>
                  <td>{item.rating ? `${item.rating} / 5` : '—'}</td>
                  <td>
                    {item.isRecommendation ? (
                      <span className="ml-badge-small">Rekomendacja</span>
                    ) : (
                      <span className="badge-standard">Katalog</span>
                    )}
                  </td>
                  <td>{new Date(item.viewedAt).toLocaleDateString('pl-PL')}</td>
                  <td>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => onReadArticle(item.articleId, item.isRecommendation)}
                    >
                      Otwórz
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ActivityHistory;
