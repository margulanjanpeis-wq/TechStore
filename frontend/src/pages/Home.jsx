import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import CategorySidebar from '../components/CategorySidebar';
import './Home.css';

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/products?limit=8')
      .then(r => setFeaturedProducts(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home">

      {/* ── Hero + Sidebar ─────────────────────────────────────────────── */}
      <div className="container">
        <div className="home-top">
          <CategorySidebar />

          <div className="hero-banner">
            <div className="hero-content">
              <span className="hero-badge">🔥 Жаңа тауарлар</span>
              <h1>Компьютер бөлшектері<br />және аксессуарлар</h1>
              <p>Ең жақсы бағамен сапалы техника.<br />Тез жеткізу, кепілдік бар.</p>
              <div className="hero-btns">
                <Link to="/products" className="btn btn-primary btn-lg">Тауарларды көру</Link>
                <Link to="/products?category=4" className="btn btn-outline btn-lg">Ноутбуктар</Link>
              </div>
            </div>
            <div className="hero-image">🖥️</div>
          </div>
        </div>
      </div>

      {/* ── Features ───────────────────────────────────────────────────── */}
      <div className="features-bar">
        <div className="container">
          <div className="features-grid">
            <div className="feature-item">
              <span>🚚</span>
              <div>
                <strong>Тегін жеткізу</strong>
                <p>50,000 ₸ жоғары</p>
              </div>
            </div>
            <div className="feature-item">
              <span>🔒</span>
              <div>
                <strong>Қауіпсіз төлем</strong>
                <p>100% қорғалған</p>
              </div>
            </div>
            <div className="feature-item">
              <span>↩️</span>
              <div>
                <strong>14 күн қайтару</strong>
                <p>Оңай қайтару</p>
              </div>
            </div>
            <div className="feature-item">
              <span>🎧</span>
              <div>
                <strong>24/7 қолдау</strong>
                <p>Кез келген уақытта</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Featured Products ───────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Танымал тауарлар</h2>
              <p className="section-subtitle">Ең көп сатылатын тауарлар</p>
            </div>
            <Link to="/products" className="btn btn-outline">Барлығын көру →</Link>
          </div>

          {loading ? (
            <div className="loading"><div className="spinner" />Жүктелуде...</div>
          ) : (
            <div className="product-grid">
              {featuredProducts.map((product) => (
                <Link key={product.id} to={`/products/${product.id}`} className="product-card">
                  <div className="product-img-wrap">
                    {product.image_url
                      ? <img
                          src={product.image_url}
                          alt={product.name}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://placehold.co/400x300/1a1a2e/ffffff?text=${encodeURIComponent(product.name.slice(0,15))}`;
                          }}
                        />
                      : <span className="product-placeholder">📦</span>
                    }
                    <span className="product-badge-new">Жаңа</span>
                  </div>
                  <div className="product-info">
                    <p className="product-brand">{product.brand}</p>
                    <h3 className="product-name">{product.name}</h3>
                    <div className="product-footer">
                      <span className="price">{parseFloat(product.price).toLocaleString()} ₸</span>
                      <span className={`badge ${product.stock_quantity > 0 ? 'badge-success' : 'badge-danger'}`}>
                        {product.stock_quantity > 0 ? 'Бар' : 'Жоқ'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Promo banner ───────────────────────────────────────────────── */}
      <section className="promo-section">
        <div className="container">
          <div className="promo-grid">
            <div className="promo-card promo-orange">
              <div>
                <h3>Ноутбуктар</h3>
                <p>849,999 ₸-дан бастап</p>
                <Link to="/products?category=4" className="btn btn-secondary btn-sm">Қарау</Link>
              </div>
              <span>💻</span>
            </div>
            <div className="promo-card promo-dark">
              <div>
                <h3>Видеокарталар</h3>
                <p>249,999 ₸-дан бастап</p>
                <Link to="/products?category=1" className="btn btn-primary btn-sm">Қарау</Link>
              </div>
              <span>🎮</span>
            </div>
            <div className="promo-card promo-blue">
              <div>
                <h3>Мониторлар</h3>
                <p>249,999 ₸-дан бастап</p>
                <Link to="/products?category=3" className="btn btn-secondary btn-sm">Қарау</Link>
              </div>
              <span>🖥️</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Home;
