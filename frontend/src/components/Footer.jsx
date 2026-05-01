import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <>
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">

            {/* ── Сілтемелер ─────────────────────────────────────────── */}
            <div className="footer-col">
              <h4 className="footer-title">СІЛТЕМЕЛЕР</h4>
              <ul className="footer-links">
                <li><Link to="/products">Барлық тауарлар</Link></li>
                <li><Link to="/products?category=1">Ноутбуктар</Link></li>
                <li><Link to="/products?category=2">Процессорлар</Link></li>
                <li><Link to="/products?category=6">Видеокарталар</Link></li>
                <li><Link to="/products?category=3">Мониторлар</Link></li>
                <li><Link to="/products?category=4">Аксессуарлар</Link></li>
                <li><Link to="/products?category=5">Жад құрылғылары</Link></li>
                <li><Link to="/">Жиі қойылатын сұрақтар</Link></li>
                <li><Link to="/">Қызмет көрсету шарттары</Link></li>
              </ul>
            </div>

            {/* ── Байланыс ───────────────────────────────────────────── */}
            <div className="footer-col">
              <h4 className="footer-title">БІЗБЕН ХАБАРЛАСЫҢЫЗ</h4>
              <ul className="footer-contacts">
                <li>
                  <span className="contact-label">Филиал дүкенінің нөмірі:</span>
                  <span>7000-1311 (Алматы қ.), 7000-0090 (Компьютерлік сауда орталығы)</span>
                </li>
                <li>
                  <span className="contact-label">Электрондық поштаның адресі:</span>
                  <a href="mailto:info@techstore.kz">info@techstore.kz</a>
                </li>
                <li>
                  <span className="contact-label">Жеткізу нөмірі:</span>
                  <span>+7 (727) 123-45-67</span>
                </li>
                <li>
                  <span className="contact-label">Жұмыс уақыты:</span>
                  <span>Дүйсенбі–Жексенбі: 09:00–21:00</span>
                </li>
              </ul>
            </div>

            {/* ── Әлеуметтік арналар ────────────────────────────────── */}
            <div className="footer-col">
              <h4 className="footer-title">ӘЛЕУМЕТТІК АРНАЛАР</h4>
              <ul className="footer-social-list">
                <li>
                  <a href="https://youtube.com" target="_blank" rel="noreferrer" className="social-item youtube">
                    <span className="social-icon">▶</span>
                    <span>TechStore YouTube</span>
                  </a>
                </li>
                <li>
                  <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-item facebook">
                    <span className="social-icon">f</span>
                    <span>TechStore дүкені</span>
                  </a>
                </li>
                <li>
                  <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-item instagram">
                    <span className="social-icon">📷</span>
                    <span>TechStore_қазақстан</span>
                  </a>
                </li>
                <li>
                  <a href="https://t.me/techstore" target="_blank" rel="noreferrer" className="social-item telegram">
                    <span className="social-icon">✈</span>
                    <span>Telegram канал</span>
                  </a>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* ── Bottom bar ─────────────────────────────────────────────── */}
        <div className="footer-bottom">
          <div className="container">
            <p>
              2025 © «TechStore». TechStore логотипі мен сәйкестігі Қазақстанның авторлық құқық туралы заңымен қорғалған.
            </p>
            <div className="footer-bottom-social">
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="bottom-social-btn youtube">▶</a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="bottom-social-btn facebook">f</a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="bottom-social-btn instagram">📷</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ── Scroll to top button ────────────────────────────────────── */}
      {showTop && (
        <button className="scroll-top-btn" onClick={scrollTop} title="Жоғары">
          ↑
        </button>
      )}
    </>
  );
}
