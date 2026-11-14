import React, { useState, useEffect } from 'react';

const API = 'http://localhost:5000/api';

function UserProfile({ userId, onBack, onReadArticle }) {
  const [profile, setProfile] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfileData();
  }, [userId]);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const [profileRes, activitiesRes] = await Promise.all([
        fetch(`${API}/users/${userId}/profile`),
        fetch(`${API}/activity/user/${userId}`)
      ]);

      if (profileRes.ok) {
        const pData = await profileRes.json();
        setProfile(pData);
      }

      if (activitiesRes.ok) {
        const aData = await activitiesRes.json();
        setRecentActivities(aData);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const formatSeconds = (sec) => {
    if (!sec) return '0 sek';
    if (sec < 60) return `${sec} sek`;
    const mins = Math.floor(sec / 60);
    const remSec = sec % 60;
    return `${mins} min ${remSec > 0 ? remSec + ' sek' : ''}`;
  };

  if (loading) {
    return <div className="loading-state">Ładowanie profilu użytkownika...</div>;
  }

  if (!profile) {
    return (
      <div className="profile-container">
        <button className="btn btn-secondary btn-sm" onClick={onBack}>← Wróć</button>
        <p className="empty-state">Nie udało się pobrać danych profilu.</p>
      </div>
    );
  }

  const initial = profile.username ? profile.username.charAt(0).toUpperCase() : 'U';

  return (
    <div className="profile-container">
      <div className="profile-header-card">
        <div className="profile-avatar-large">{initial}</div>
        <div className="profile-info">
          <h2>{profile.username}</h2>
          <p className="profile-email">✉️ {profile.email}</p>
          <p className="profile-date">
            📅 Członek od: {new Date(profile.createdAt).toLocaleDateString('pl-PL')}
          </p>
        </div>
        <button className="btn btn-secondary btn-sm profile-back-btn" onClick={onBack}>
          ← Wróć do artykułów
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-icon">📚</span>
          <span className="stat-value">{profile.stats?.totalArticlesRead || 0}</span>
          <span className="stat-label">Przeczytane artykuły</span>
        </div>

        <div className="stat-card">
          <span className="stat-icon">⏳</span>
          <span className="stat-value">{formatSeconds(profile.stats?.totalReadTimeSeconds)}</span>
          <span className="stat-label">Spędzony czas na czytaniu</span>
        </div>

        <div className="stat-card">
          <span className="stat-icon">⭐</span>
          <span className="stat-value">{profile.stats?.averageRating || 0} / 5</span>
          <span className="stat-label">Średnia wystawionych ocen</span>
        </div>
      </div>

      <div className="profile-section">
        <h3>Twoje ulubione kategorie</h3>
        {profile.stats?.topCategories?.length > 0 ? (
          <div className="category-stats-list">
            {profile.stats.topCategories.map((c) => (
              <div key={c.category} className="category-stat-pill">
                <span className="cat-name">{c.category}</span>
                <span className="cat-count">{c.count} art.</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-state-text">Brak historii czytania kategorii.</p>
        )}
      </div>

      <div className="profile-section">
        <h3>Ostatnio czytane artykuły</h3>
        {recentActivities.length === 0 ? (
          <p className="empty-state-text">Nie przeczytałeś jeszcze żadnego artykułu.</p>
        ) : (
          <div className="activity-list">
            {recentActivities.map((act) => (
              <div key={act.id} className="activity-item">
                <div className="activity-main">
                  <span className="card-category">{act.category}</span>
                  <h4 className="activity-title" onClick={() => onReadArticle(act.articleId, act.isRecommendation)}>
                    {act.articleTitle}
                  </h4>
                  <div className="activity-meta">
                    <span>⏱️ Czas: {formatSeconds(act.timeSpentSeconds)}</span>
                    {act.rating && <span>⭐ Ocena: {act.rating}/5</span>}
                    {act.isRecommendation && (
                      <span className="activity-rec-badge">
                        ✨ Rekomendacja {act.recommendationFeedback === 1 ? '(Trafna)' : act.recommendationFeedback === -1 ? '(Nietrafna)' : ''}
                      </span>
                    )}
                    <span className="activity-date">
                      {new Date(act.viewedAt).toLocaleDateString('pl-PL')}
                    </span>
                  </div>
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => onReadArticle(act.articleId, act.isRecommendation)}
                >
                  Czytaj ponownie
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
