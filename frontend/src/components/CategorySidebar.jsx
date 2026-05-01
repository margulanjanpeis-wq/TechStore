import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import './CategorySidebar.css';

// Әр категорияға icon және alt-санаттар
const CAT_META = {
  'Видеокарталар':      { icon: '🎮', sub: ['NVIDIA GeForce', 'AMD Radeon', 'RTX 40 серия', 'RX 7000 серия'] },
  'Дайын компьютер':   { icon: '🖥️', sub: ['Ойын компьютерлері', 'Бизнес компьютерлері', 'Мини ПК', 'Workstation'] },
  'Мониторлар':         { icon: '🖥',  sub: ['Ойын мониторлары', '4K мониторлар', 'OLED мониторлар', 'Ультракең'] },
  'Ноутбуктар':         { icon: '💻', sub: ['Ойын ноутбуктары', 'Бизнес ноутбуктары', 'MacBook', 'Ультрабуктар'] },
  'Пернетақта':         { icon: '⌨️', sub: ['Механикалық', 'Сымсыз', 'Compact 60%/65%', 'Мембраналық'] },
  'Тышқан':             { icon: '🖱️', sub: ['Сымсыз ойын', 'Сымды ойын', 'Кәсіби/Офис', 'Жеңіл тышқандар'] },
  'PlayStation':        { icon: '🎮', sub: ['PS5 консоль', 'PS5 контроллер', 'PS5 ойындары', 'VR & аксессуарлар'] },
  'Ойын орындықтары':  { icon: '🪑', sub: ['Флагмандық', 'Орта деңгей', 'Бюджеттік', 'Sim Racing'] },
};

const DEFAULT_META = { icon: '📦', sub: [] };

export default function CategorySidebar() {
  const [categories, setCategories] = useState([]);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    api.get('/api/categories')
      .then(r => setCategories(r.data))
      .catch(console.error);
  }, []);

  return (
    <div className="cat-sidebar">
      <div className="cat-sidebar-title">Барлық санаттар</div>
      <ul className="cat-list">
        {categories.map((cat) => {
          const meta = CAT_META[cat.name] || DEFAULT_META;
          return (
            <li
              key={cat.id}
              className={`cat-item ${hovered === cat.id ? 'active' : ''}`}
              onMouseEnter={() => setHovered(cat.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <Link to={`/products?category=${cat.id}`} className="cat-link">
                <span className="cat-icon">{meta.icon}</span>
                <span className="cat-name">{cat.name}</span>
                {meta.sub.length > 0 && <span className="cat-arrow">›</span>}
              </Link>

              {meta.sub.length > 0 && hovered === cat.id && (
                <div className="cat-dropdown">
                  {meta.sub.map((sub, j) => (
                    <Link
                      key={j}
                      to={`/products?category=${cat.id}`}
                      className="cat-sub-link"
                    >
                      {sub}
                    </Link>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
