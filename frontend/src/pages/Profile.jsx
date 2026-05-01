import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import './Profile.css';

function Profile() {
  const navigate = useNavigate();
  const { isAuthenticated, user, fetchProfile, updateProfile, updatePassword } = useAuthStore();

  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success'|'error', text }

  // Profile form state
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
  });

  // Password form state
  const [pwForm, setPwForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchProfile().then((data) => {
      if (data) {
        setForm({
          full_name: data.full_name || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
        });
      }
      setLoading(false);
    });
  }, [isAuthenticated, navigate, fetchProfile]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const result = await updateProfile(form);
    setSaving(false);
    if (result.success) {
      showMessage('success', 'Профайл сәтті жаңартылды!');
    } else {
      showMessage('error', result.error || 'Қате орын алды');
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (pwForm.new_password !== pwForm.confirm_password) {
      showMessage('error', 'Жаңа парольдер сәйкес келмейді');
      return;
    }
    if (pwForm.new_password.length < 6) {
      showMessage('error', 'Жаңа пароль кемінде 6 таңба болуы керек');
      return;
    }
    setSaving(true);
    const result = await updatePassword(pwForm.current_password, pwForm.new_password);
    setSaving(false);
    if (result.success) {
      showMessage('success', 'Пароль сәтті өзгертілді!');
      setPwForm({ current_password: '', new_password: '', confirm_password: '' });
    } else {
      showMessage('error', result.error || 'Қате орын алды');
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="spinner" />
        <p>Жүктелуде...</p>
      </div>
    );
  }

  const avatarLetter = user?.username?.[0]?.toUpperCase() || 'U';

  return (
    <div className="profile-page">
      <div className="container">
        {/* Page header */}
        <div className="profile-header">
          <div className="profile-avatar-large">{avatarLetter}</div>
          <div className="profile-header-info">
            <h1>{user?.full_name || user?.username}</h1>
            <p className="profile-username">@{user?.username}</p>
            <p className="profile-email">{user?.email}</p>
          </div>
        </div>

        {/* Toast message */}
        {message && (
          <div className={`profile-toast profile-toast--${message.type}`}>
            {message.type === 'success' ? '✅' : '❌'} {message.text}
          </div>
        )}

        {/* Tabs */}
        <div className="profile-tabs">
          <button
            className={`profile-tab ${activeTab === 'info' ? 'active' : ''}`}
            onClick={() => setActiveTab('info')}
          >
            👤 Жеке ақпарат
          </button>
          <button
            className={`profile-tab ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => setActiveTab('password')}
          >
            🔒 Пароль өзгерту
          </button>
        </div>

        {/* Tab: Personal info */}
        {activeTab === 'info' && (
          <div className="profile-card">
            <h2>Жеке ақпарат</h2>
            <form onSubmit={handleProfileSave} className="profile-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Толық аты-жөні</label>
                  <input
                    type="text"
                    placeholder="Аты-жөніңізді енгізіңіз"
                    value={form.full_name}
                    onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Пайдаланушы аты</label>
                  <input
                    type="text"
                    value={user?.username || ''}
                    disabled
                    className="input-disabled"
                  />
                  <span className="form-hint">Пайдаланушы атын өзгерту мүмкін емес</span>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Телефон</label>
                  <input
                    type="tel"
                    placeholder="+7 (___) ___-__-__"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group form-group--full">
                <label>Жеткізу мекенжайы</label>
                <textarea
                  placeholder="Қала, көше, үй нөмірі..."
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-save" disabled={saving}>
                  {saving ? 'Сақталуда...' : '💾 Сақтау'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab: Password */}
        {activeTab === 'password' && (
          <div className="profile-card">
            <h2>Пароль өзгерту</h2>
            <form onSubmit={handlePasswordSave} className="profile-form">
              <div className="form-group">
                <label>Ағымдағы пароль</label>
                <input
                  type="password"
                  placeholder="Ағымдағы паролді енгізіңіз"
                  value={pwForm.current_password}
                  onChange={(e) => setPwForm({ ...pwForm, current_password: e.target.value })}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Жаңа пароль</label>
                  <input
                    type="password"
                    placeholder="Кемінде 6 таңба"
                    value={pwForm.new_password}
                    onChange={(e) => setPwForm({ ...pwForm, new_password: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Жаңа паролді растау</label>
                  <input
                    type="password"
                    placeholder="Паролді қайталаңыз"
                    value={pwForm.confirm_password}
                    onChange={(e) => setPwForm({ ...pwForm, confirm_password: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="password-tips">
                <p>🔐 Қауіпсіз пароль үшін:</p>
                <ul>
                  <li>Кемінде 8 таңба қолданыңыз</li>
                  <li>Бас және кіші әріптерді қосыңыз</li>
                  <li>Сан және арнайы таңба қосыңыз</li>
                </ul>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-save" disabled={saving}>
                  {saving ? 'Өзгертілуде...' : '🔒 Паролді өзгерту'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Account info card */}
        <div className="profile-card profile-card--info">
          <h3>Аккаунт туралы</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Тіркелген күні</span>
              <span className="info-value">
                {user?.created_at
                  ? new Date(user.created_at).toLocaleDateString('kk-KZ', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : '—'}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Аккаунт статусы</span>
              <span className="info-value status-active">✅ Белсенді</span>
            </div>
            <div className="info-item">
              <span className="info-label">Рөл</span>
              <span className="info-value">{user?.is_admin ? '👑 Администратор' : '👤 Пайдаланушы'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
