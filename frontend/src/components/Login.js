import React, { useState } from 'react';

const API = 'http://localhost:5000/api/auth';

function Login({ onAuth }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`${API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Błąd logowania');
        return;
      }

      const data = await res.json();
      onAuth(data);
    } catch {
      setError('Nie można połączyć się z serwerem');
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Logowanie</h2>
      {error && <div className="error">{error}</div>}
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
        <label>Hasło</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary btn-full">Zaloguj się</button>
    </form>
  );
}

export default Login;
