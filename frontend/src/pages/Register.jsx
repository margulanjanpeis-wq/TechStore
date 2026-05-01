import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import './Auth.css';

function Register() {
  const [formData, setFormData] = useState({
    username:  '',
    email:     '',
    password:  '',
    full_name: '',
  });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const register = useAuthStore((s) => s.register);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await register(formData);
    if (result.success) {
      navigate('/login');
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

        <h2>Тіркелу</h2>
        <p className="auth-subtitle">Жаңа аккаунт жасаңыз</p>

        {error && (
          <div className="auth-error">
            <span>⚠️</span> {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>Толық аты-жөні</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">✏️</span>
              <input
                type="text"
                name="full_name"
                placeholder="Аты-жөніңіз"
                value={formData.full_name}
                onChange={handleChange}
                disabled={loading}
                autoComplete="name"
              />
            </div>
          </div>

          <div className="auth-field">
            <label>Пайдаланушы аты</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">👤</span>
              <input
                type="text"
                name="username"
                placeholder="username"
                value={formData.username}
                onChange={handleChange}
                required
                disabled={loading}
                autoComplete="username"
              />
            </div>
          </div>

          <div className="auth-field">
            <label>Email</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">📧</span>
              <input
                type="email"
                name="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="auth-field">
            <label>Пароль</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">🔒</span>
              <input
                type="password"
                name="password"
                placeholder="Кемінде 6 таңба"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
                autoComplete="new-password"
              />
            </div>
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? '⏳ Тіркелуде...' : 'Тіркелу →'}
          </button>
        </form>

        <p className="auth-link">
          Аккаунт бар ма?{' '}
          <Link to="/login">Кіру</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
