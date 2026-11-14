import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Navbar from './components/Navbar';
import ArticleList from './components/ArticleList';
import ArticleReader from './components/ArticleReader';
import RecommendationsView from './components/RecommendationsView';
import UserProfile from './components/UserProfile';
import ActivityHistory from './components/ActivityHistory';
import './App.css';

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('smartarticle_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [authView, setAuthView] = useState('login');
  const [activeTab, setActiveTab] = useState('articles');
  const [readingArticle, setReadingArticle] = useState(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem('smartarticle_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('smartarticle_user');
    }
  }, [user]);

  const handleAuth = (userData) => {
    setUser(userData);
    setActiveTab('articles');
    setReadingArticle(null);
  };

  const handleUserUpdated = (updatedUser) => {
    setUser((prev) => {
      const merged = { ...prev, ...updatedUser };
      localStorage.setItem('smartarticle_user', JSON.stringify(merged));
      return merged;
    });
  };

  const handleLogout = () => {
    setUser(null);
    setAuthView('login');
    setActiveTab('articles');
    setReadingArticle(null);
  };

  const handleReadArticle = (articleId, isRecommendation = false) => {
    setReadingArticle({ id: articleId, isRecommendation });
    setActiveTab('reader');
  };

  const handleBackToArticles = () => {
    setReadingArticle(null);
    setActiveTab('articles');
  };

  const handleSelectTab = (tab) => {
    setReadingArticle(null);
    setActiveTab(tab);
  };

  const handleOpenProfile = () => {
    setReadingArticle(null);
    setActiveTab('profile');
  };

  if (!user) {
    return (
      <div className="auth-wrapper">
        <header className="auth-header">
          <div className="logo-center">
            <div className="auth-logo-badge">SA</div>
            <h1>Smart Article</h1>
            <p className="auth-subtitle">Inteligentny system rekomendacji artykułów</p>
          </div>
        </header>

        <main className="auth-main">
          <div className="auth-toggle">
            <button
              className={`btn ${authView === 'login' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setAuthView('login')}
            >
              Logowanie
            </button>
            <button
              className={`btn ${authView === 'register' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setAuthView('register')}
            >
              Rejestracja
            </button>
          </div>

          {authView === 'login' ? (
            <Login onAuth={handleAuth} />
          ) : (
            <Register onAuth={handleAuth} onSwitch={() => setAuthView('login')} />
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <Navbar
        user={user}
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onOpenProfile={handleOpenProfile}
        onLogout={handleLogout}
      />

      <main className="content-container">
        {activeTab === 'reader' && readingArticle && (
          <ArticleReader
            articleId={readingArticle.id}
            isRecommendation={readingArticle.isRecommendation}
            userId={user.id}
            onBack={handleBackToArticles}
          />
        )}

        {activeTab === 'articles' && (
          <ArticleList onReadArticle={handleReadArticle} />
        )}

        {activeTab === 'recommendations' && (
          <RecommendationsView
            userId={user.id}
            onReadArticle={handleReadArticle}
          />
        )}

        {activeTab === 'profile' && (
          <UserProfile
            user={user}
            onBack={handleBackToArticles}
            onReadArticle={handleReadArticle}
            onUserUpdated={handleUserUpdated}
          />
        )}

        {activeTab === 'history' && (
          <ActivityHistory
            userId={user.id}
            onReadArticle={handleReadArticle}
          />
        )}
      </main>
    </div>
  );
}

export default App;
