import React from 'react';

function Navbar({ user, activeTab, onSelectTab, onOpenProfile, onLogout }) {
  const initial = user?.username ? user.username.charAt(0).toUpperCase() : 'U';

  return (
    <header className="header">
      <div className="header-left">
        <div className="logo" onClick={() => onSelectTab('articles')}>
          <span className="logo-icon">📰</span>
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
            Dla Ciebie (ML)
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
          title="Szczegóły konta"
        >
          <span className="avatar-circle">{initial}</span>
          <span className="avatar-name">{user.username}</span>
        </button>
        <button onClick={onLogout} className="btn btn-secondary btn-sm">
          Wyloguj
        </button>
      </div>
    </header>
  );
}

export default Navbar;
