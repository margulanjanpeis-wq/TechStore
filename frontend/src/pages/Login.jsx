import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import './Auth.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const navigate = useNavigate();
  const login    = useAuthStore((s) => s.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(username, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">

        <div className="auth-logo">
          <div className="auth-logo-icon">⚡</div>
        </div>

        <h2>Кіру</h2>
        <p className="auth-subtitle">TechStore аккаунтыңызға кіріңіз</p>

        {error && (
          <div className="auth-error">
            <span>⚠️</span> {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>Пайдаланушы аты</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">👤</span>
              <input
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
                autoComplete="username"
              />
            </div>
          </div>

          <div className="auth-field">
            <label>Пароль</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">🔒</span>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                autoComplete="current-password"
              />
            </div>
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? '⏳ Кіруде...' : 'Кіру →'}
          </button>
        </form>

        <p className="auth-link">
          Аккаунт жоқ па?{' '}
          <Link to="/register">Тіркелу</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
