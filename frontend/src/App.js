import React, { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('login');

  const handleAuth = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setView('login');
  };

  if (user) {
    return (
      <div className="app">
        <header className="header">
          <h1>Smart Article</h1>
          <div className="user-info">
            <span>{user.username}</span>
            <button onClick={handleLogout} className="btn btn-secondary">Wyloguj</button>
          </div>
        </header>
        <main className="main">
          <p>Witaj, {user.username}! System rekomendacji artykułów wkrótce.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Smart Article</h1>
      </header>
      <main className="main">
        <div className="auth-toggle">
          <button
            className={`btn ${view === 'login' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setView('login')}
          >
            Logowanie
          </button>
          <button
            className={`btn ${view === 'register' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setView('register')}
          >
            Rejestracja
          </button>
        </div>
        {view === 'login' ? (
          <Login onAuth={handleAuth} />
        ) : (
          <Register onAuth={handleAuth} onSwitch={() => setView('login')} />
        )}
      </main>
    </div>
  );
}

export default App;
