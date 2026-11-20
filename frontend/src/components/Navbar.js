import React from 'react';

function Navbar({ user, activeTab, onSelectTab, onOpenProfile, onLogout }) {
  const initial = user?.username ? user.username.charAt(0).toUpperCase() : 'U';

  return (
    <header className="header">
      <div className="header-left">
        <div className="logo" onClick={() => onSelectTab('articles')}>
          <div className="logo-badge">SA</div>
          <span className="logo-text">Smart Article</span>
        </div>
        <nav className="nav-links">
          <button
            className={`nav-link ${activeTab === 'articles' ? 'active' : ''}`}
            onClick={() => onSelectTab('articles')}
          >
            Artykuły
          </button>
          <button
            className={`nav-link ${activeTab === 'recommendations' ? 'active' : ''}`}
            onClick={() => onSelectTab('recommendations')}
          >
            Rekomendacje
          </button>
          <button
            className={`nav-link ${activeTab === 'intelligence' ? 'active' : ''}`}
            onClick={() => onSelectTab('intelligence')}
          >
            Predykcje i Analityka
          </button>
          <button
            className={`nav-link ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => onSelectTab('history')}
          >
            Historia
          </button>
        </nav>
      </div>

      <div className="header-right">
        <button
          className={`avatar-btn ${activeTab === 'profile' ? 'active-avatar' : ''}`}
          onClick={onOpenProfile}
          title="Profil i ustawienia konta"
        >
          <span className="avatar-circle">{initial}</span>
          <span className="avatar-name">{user.username}</span>
        </button>
        <button onClick={onLogout} className="btn btn-outline btn-sm">
          Wyloguj
        </button>
      </div>
    </header>
  );
}

export default Navbar;
