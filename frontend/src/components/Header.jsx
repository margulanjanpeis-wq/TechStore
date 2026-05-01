import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useCartStore from '../store/cartStore';
import './Header.css';

function Header() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { cartItems } = useCartStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Сыртқа басқанда жабу
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Бет өзгергенде жабу
  useEffect(() => {
    setDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) navigate(`/products?search=${encodeURIComponent(q)}`);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="header">
      {/* Top bar */}
      <div className="header-topbar">
        <div className="container">
          <span>📦 Тегін жеткізу 50,000 ₸ жоғары тапсырыстарда</span>
          <span>📞 +7 (727) 123-45-67</span>
        </div>
      </div>

      {/* Main header */}
      <div className="header-main">
        <div className="container">
          {/* Logo */}
          <Link to="/" className="logo">
            <div className="logo-icon">⚡</div>
            <div className="logo-text">
              <span className="logo-name">TechStore</span>
              <span className="logo-tagline">Компьютер бөлшектері</span>
            </div>
          </Link>

          {/* Search */}
          <form className="header-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Тауар іздеу..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="search-btn" type="submit">🔍</button>
          </form>

          {/* Actions */}
          <div className="header-actions">
            {isAuthenticated ? (
              <>
                <Link to="/cart" className="action-btn cart-btn">
                  <span className="action-icon">🛒</span>
                  <span className="action-label">Себет</span>
                  {cartItems.length > 0 && (
                    <span className="cart-badge">{cartItems.length}</span>
                  )}
                </Link>

                {/* User dropdown — click-based */}
                <div className="user-menu" ref={dropdownRef}>
                  <button
                    className={`user-btn ${dropdownOpen ? 'active' : ''}`}
                    onClick={() => setDropdownOpen((prev) => !prev)}
                  >
                    <span className="user-avatar">
                      {user?.username?.[0]?.toUpperCase() || 'U'}
                    </span>
                    <span className="user-name">
                      {user?.full_name || user?.username || 'Пайдаланушы'}
                    </span>
                    <span className="user-chevron">{dropdownOpen ? '▲' : '▼'}</span>
                  </button>

                  {dropdownOpen && (
                    <div className="user-dropdown">
                      <div className="dropdown-header">
                        <span className="dropdown-avatar">
                          {user?.username?.[0]?.toUpperCase() || 'U'}
                        </span>
                        <div>
                          <div className="dropdown-name">
                            {user?.full_name || user?.username}
                          </div>
                          <div className="dropdown-email">{user?.email || ''}</div>
                        </div>
                      </div>
                      <div className="dropdown-divider" />
                      <Link to="/profile" className="dropdown-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                        Профайлым
                      </Link>
                      <Link to="/orders" className="dropdown-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>
                        Тапсырыстарым
                      </Link>
                      {user?.is_admin && (
                        <>
                          <div className="dropdown-divider" />
                          <Link to="/admin" className="dropdown-item dropdown-admin">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                            Admin панелі
                          </Link>
                        </>
                      )}
                      <div className="dropdown-divider" />
                      <button className="dropdown-item dropdown-logout" onClick={handleLogout}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                        Шығу
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/cart" className="action-btn cart-btn">
                  <span className="action-icon">🛒</span>
                  <span className="action-label">Себет</span>
                  {cartItems.length > 0 && (
                    <span className="cart-badge">{cartItems.length}</span>
                  )}
                </Link>
                <Link to="/login" className="btn btn-ghost btn-sm">Кіру</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Тіркелу</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Nav bar */}
      <nav className="header-nav">
        <div className="container">
          <Link to="/" className={isActive('/') ? 'active' : ''}>Басты бет</Link>
          <Link to="/products" className={isActive('/products') ? 'active' : ''}>Барлық тауарлар</Link>
          <Link to="/products?category=4">Ноутбуктар</Link>
          <Link to="/products?category=1">Видеокарталар</Link>
          <Link to="/products?category=3">Мониторлар</Link>
          <Link to="/products?category=5">Пернетақта</Link>
          <Link to="/products?category=6">Тышқан</Link>
          <Link to="/products?category=7">PlayStation</Link>
          <Link to="/products?category=8">Ойын орындықтары</Link>
          <Link to="/products?category=2">Дайын компьютер</Link>
        </div>
      </nav>
    </header>
  );
}

export default Header;
