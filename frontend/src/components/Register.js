import React, { useState } from 'react';

const API = 'http://localhost:5000/api/auth';

function Register({ onAuth, onSwitch }) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`${API}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Błąd rejestracji');
        return;
      }

      setSuccess('Konto utworzone! Możesz się zalogować.');
      setTimeout(() => onSwitch(), 1500);
    } catch {
      setError('Nie można połączyć się z serwerem');
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Rejestracja</h2>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Nazwa użytkownika</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          minLength={3}
          required
        />
      </div>
      <div className="form-group">
        <label>Hasło (min. 6 znaków)</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary btn-full">Zarejestruj się</button>
    </form>
  );
}

export default Register;
