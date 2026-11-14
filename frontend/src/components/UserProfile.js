import React, { useState, useEffect } from 'react';

const API = 'http://localhost:5000/api';

function UserProfile({ user, onBack, onReadArticle, onUserUpdated }) {
  const [profile, setProfile] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState('overview');

  const [newUsername, setNewUsername] = useState(user?.username || '');
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, [user.id]);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const [profileRes, activitiesRes] = await Promise.all([
        fetch(`${API}/users/${user.id}/profile`),
        fetch(`${API}/activity/user/${user.id}`)
      ]);

      if (profileRes.ok) {
        const pData = await profileRes.json();
        setProfile(pData);
        setNewUsername(pData.username);
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

  const handleUpdateUsername = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');

    if (!newUsername.trim() || newUsername.trim().length < 3) {
      setProfileError('Nazwa użytkownika musi mieć co najmniej 3 znaki.');
      return;
    }

    setSavingProfile(true);
    try {
      const res = await fetch(`${API}/users/${user.id}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: newUsername.trim() })
      });

      const data = await res.json();
      if (!res.ok) {
        setProfileError(data.message || 'Wystąpił błąd podczas zmiany nazwy użytkownika.');
      } else {
        setProfileSuccess('Nazwa użytkownika została zaktualizowana.');
        if (onUserUpdated) {
          onUserUpdated(data);
        }
        fetchProfileData();
      }
    } catch {
      setProfileError('Błąd połączenia z serwerem.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword.length < 6) {
      setPasswordError('Nowe hasło musi zawierać co najmniej 6 znaków.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Podane nowe hasła nie są identyczne.');
      return;
    }

    setSavingPassword(true);
    try {
      const res = await fetch(`${API}/users/${user.id}/change-password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setPasswordError(data.message || 'Wystąpił błąd podczas zmiany hasła.');
      } else {
        setPasswordSuccess('Hasło zostało pomyślnie zmienione.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch {
      setPasswordError('Błąd połączenia z serwerem.');
    } finally {
      setSavingPassword(false);
    }
  };

  const formatSeconds = (sec) => {
    if (!sec) return '0 s';
    if (sec < 60) return `${sec} s`;
    const mins = Math.floor(sec / 60);
    const remSec = sec % 60;
    return `${mins} min ${remSec > 0 ? remSec + ' s' : ''}`;
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <span>Ładowanie profilu konta...</span>
      </div>
    );
  }

  const initial = profile?.username ? profile.username.charAt(0).toUpperCase() : 'U';

  return (
    <div className="profile-container">
      <div className="profile-header-card">
        <div className="profile-avatar-large">{initial}</div>
        <div className="profile-info">
          <h2>{profile?.username}</h2>
          <p className="profile-email">{profile?.email}</p>
          <p className="profile-date">
            Data rejestracji: {new Date(profile?.createdAt || Date.now()).toLocaleDateString('pl-PL')}
          </p>
        </div>
        <button className="btn btn-secondary btn-sm profile-back-btn" onClick={onBack}>
          ← Wróć do artykułów
        </button>
      </div>

      <div className="profile-tabs">
        <button
          className={`tab-btn ${activeSubTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('overview')}
        >
          Przegląd i statystyki
        </button>
        <button
          className={`tab-btn ${activeSubTab === 'edit' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('edit')}
        >
          Edycja profilu
        </button>
        <button
          className={`tab-btn ${activeSubTab === 'password' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('password')}
        >
          Zmiana hasła
        </button>
      </div>

      {activeSubTab === 'overview' && (
        <div className="tab-pane">
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-label">Przeczytane artykuły</span>
              <span className="stat-value">{profile?.stats?.totalArticlesRead || 0}</span>
              <span className="stat-sub">unikalne pozycje</span>
            </div>

            <div className="stat-card">
              <span className="stat-label">Łączny czas czytania</span>
              <span className="stat-value">{formatSeconds(profile?.stats?.totalReadTimeSeconds)}</span>
              <span className="stat-sub">aktywny czas w aplikacji</span>
            </div>

            <div className="stat-card">
              <span className="stat-label">Średnia ocen</span>
              <span className="stat-value">{profile?.stats?.averageRating ? `${profile.stats.averageRating} / 5` : 'Brak ocen'}</span>
              <span className="stat-sub">wystawione gwiazdki</span>
            </div>
          </div>

          <div className="profile-section">
            <h3 className="section-title">Preferowane kategorie tematyczne</h3>
            {profile?.stats?.topCategories?.length > 0 ? (
              <div className="category-stats-list">
                {profile.stats.topCategories.map((c) => (
                  <div key={c.category} className="category-stat-pill">
                    <span className="cat-name">{c.category}</span>
                    <span className="cat-count">{c.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-state-text">Brak historii czytania kategorii.</p>
            )}
          </div>

          <div className="profile-section">
            <h3 className="section-title">Ostatnio czytane</h3>
            {recentActivities.length === 0 ? (
              <p className="empty-state-text">Brak aktywności. Rozpocznij czytanie artykułów.</p>
            ) : (
              <div className="activity-list">
                {recentActivities.map((act) => (
                  <div key={act.id} className="activity-item">
                    <div className="activity-main">
                      <div className="activity-header">
                        <span className="card-category-inline">{act.category}</span>
                        {act.isRecommendation && (
                          <span className="ml-badge-small">Rekomendacja ML</span>
                        )}
                      </div>
                      <h4
                        className="activity-title"
                        onClick={() => onReadArticle(act.articleId, act.isRecommendation)}
                      >
                        {act.articleTitle}
                      </h4>
                      <div className="activity-meta">
                        <span>Czas: {formatSeconds(act.timeSpentSeconds)}</span>
                        {act.rating && <span>Ocena: {act.rating}/5</span>}
                        {act.recommendationFeedback && (
                          <span>Trafność: {act.recommendationFeedback === 1 ? 'Trafna' : 'Nietrafna'}</span>
                        )}
                        <span>{new Date(act.viewedAt).toLocaleDateString('pl-PL')}</span>
                      </div>
                    </div>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => onReadArticle(act.articleId, act.isRecommendation)}
                    >
                      Otwórz
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeSubTab === 'edit' && (
        <div className="tab-pane">
          <div className="profile-section settings-box">
            <h3 className="section-title">Zmiana nazwy użytkownika</h3>
            <p className="section-desc">
              Twój nick jest widoczny w nagłówku oraz używany do identyfikacji konta.
            </p>

            {profileError && <div className="alert-box alert-error">{profileError}</div>}
            {profileSuccess && <div className="alert-box alert-success">{profileSuccess}</div>}

            <form onSubmit={handleUpdateUsername} className="settings-form">
              <div className="form-group">
                <label>Adres e-mail (nieedytowalny)</label>
                <input
                  type="text"
                  value={profile?.email || ''}
                  disabled
                  className="input-disabled"
                />
              </div>

              <div className="form-group">
                <label>Nowa nazwa użytkownika (nick)</label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  minLength={3}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={savingProfile || newUsername === profile?.username}
              >
                {savingProfile ? 'Zapisywanie...' : 'Zapisz nową nazwę'}
              </button>
            </form>
          </div>
        </div>
      )}

      {activeSubTab === 'password' && (
        <div className="tab-pane">
          <div className="profile-section settings-box">
            <h3 className="section-title">Zaktualizuj hasło do konta</h3>
            <p className="section-desc">
              Wprowadź swoje obecne hasło, a następnie zdefiniuj nowe (minimum 6 znaków).
            </p>

            {passwordError && <div className="alert-box alert-error">{passwordError}</div>}
            {passwordSuccess && <div className="alert-box alert-success">{passwordSuccess}</div>}

            <form onSubmit={handleChangePassword} className="settings-form">
              <div className="form-group">
                <label>Aktualne hasło</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Nowe hasło (min. 6 znaków)</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  minLength={6}
                  required
                />
              </div>

              <div className="form-group">
                <label>Powtórz nowe hasło</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength={6}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={savingPassword}
              >
                {savingPassword ? 'Aktualizowanie hasła...' : 'Zmień hasło'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfile;
