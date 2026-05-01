// TechStore Admin Panel
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import api from '../api/axios';
import './Admin.css';

// ── Helpers ───────────────────────────────────────────────────────────────────
const STATUS_CFG = {
  pending:    { label: 'Күтуде',       color: '#f59e0b', bg: '#fef3c7' },
  processing: { label: 'Өңделуде',     color: '#3b82f6', bg: '#dbeafe' },
  shipped:    { label: 'Жолда',        color: '#8b5cf6', bg: '#ede9fe' },
  delivered:  { label: 'Жеткізілді',   color: '#10b981', bg: '#d1fae5' },
  cancelled:  { label: 'Бас тартылды', color: '#ef4444', bg: '#fee2e2' },
};
const STATUS_FLOW = ['pending','processing','shipped','delivered'];
const fmt = (n) => Number(n).toLocaleString('ru-RU');

// ── Main component ────────────────────────────────────────────────────────────
export default function Admin() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const [tab, setTab] = useState('dashboard');

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (user && !user.is_admin) { navigate('/'); }
  }, [isAuthenticated, user, navigate]);

  const NAV = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'orders',    icon: '📦', label: 'Тапсырыстар' },
    { id: 'products',  icon: '🛍️', label: 'Өнімдер' },
    { id: 'categories',icon: '🗂️', label: 'Категориялар' },
    { id: 'users',     icon: '👥', label: 'Пайдаланушылар' },
  ];

  return (
    <div className="ap-wrap">
      {/* Sidebar */}
      <aside className="ap-sidebar">
        <div className="ap-brand">
          <span className="ap-brand-icon">⚡</span>
          <div>
            <div className="ap-brand-name">TechStore</div>
            <div className="ap-brand-sub">Admin панелі</div>
          </div>
        </div>
        <nav className="ap-nav">
          {NAV.map((n) => (
            <button key={n.id}
              className={`ap-nav-item ${tab === n.id ? 'active' : ''}`}
              onClick={() => setTab(n.id)}>
              <span>{n.icon}</span> {n.label}
            </button>
          ))}
        </nav>
        <div className="ap-sidebar-footer">
          <button className="ap-nav-item" onClick={() => navigate('/')}>
            <span>🏠</span> Сайтқа оралу
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="ap-main">
        {tab === 'dashboard'  && <Dashboard />}
        {tab === 'orders'     && <Orders />}
        {tab === 'products'   && <Products />}
        {tab === 'categories' && <Categories />}
        {tab === 'users'      && <Users />}
      </main>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// 1. DASHBOARD
// ══════════════════════════════════════════════════════════════
function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/admin/dashboard')
      .then(r => setData(r.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  const STATS = [
    { label: 'Жалпы тапсырыс', value: data.total_orders,              icon: '📦', color: '#3b82f6' },
    { label: 'Жалпы табыс',    value: fmt(data.total_revenue) + ' ₸', icon: '💰', color: '#10b981' },
    { label: 'Пайдаланушылар', value: data.total_users,               icon: '👥', color: '#8b5cf6' },
    { label: 'Өнімдер',        value: data.total_products,            icon: '🛍️', color: '#f59e0b' },
    { label: 'Орташа чек',     value: fmt(Math.round(data.avg_order)) + ' ₸', icon: '📈', color: '#ef4444' },
  ];

  const maxRevenue = Math.max(...data.daily_sales.map(d => d.revenue), 1);

  return (
    <div className="ap-section">
      <h2 className="ap-title">📊 Dashboard</h2>

      {/* Stats */}
      <div className="ap-stats-grid">
        {STATS.map((s) => (
          <div key={s.label} className="ap-stat" style={{ borderTop: `3px solid ${s.color}` }}>
            <div className="ap-stat-icon">{s.icon}</div>
            <div className="ap-stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="ap-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Status breakdown */}
      <div className="ap-card" style={{ marginBottom: 24 }}>
        <h3 className="ap-card-title">Тапсырыс статустары</h3>
        <div className="ap-status-row">
          {Object.entries(STATUS_CFG).map(([key, cfg]) => (
            <div key={key} className="ap-status-chip"
              style={{ background: cfg.bg, color: cfg.color }}>
              <strong>{data.status_counts[key] || 0}</strong>
              <span>{cfg.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="ap-two-col">
        {/* Bar chart */}
        <div className="ap-card">
          <h3 className="ap-card-title">Соңғы 7 күн (табыс)</h3>
          <div className="ap-chart">
            {data.daily_sales.map((d) => (
              <div key={d.date} className="ap-bar-wrap">
                <div className="ap-bar-label">{fmt(Math.round(d.revenue / 1000))}к</div>
                <div className="ap-bar-outer">
                  <div className="ap-bar-inner"
                    style={{ height: `${(d.revenue / maxRevenue) * 100}%` }} />
                </div>
                <div className="ap-bar-date">{d.date.slice(5)}</div>
                <div className="ap-bar-orders">{d.orders} тап.</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top products */}
        <div className="ap-card">
          <h3 className="ap-card-title">🏆 Ең көп сатылған</h3>
          <div className="ap-top-list">
            {data.top_products.map((p, i) => (
              <div key={i} className="ap-top-item">
                <span className="ap-top-rank">#{i + 1}</span>
                <div className="ap-top-info">
                  <div className="ap-top-name">{p.name}</div>
                  <div className="ap-top-sub">{p.brand} · {p.sold} дана</div>
                </div>
                <div className="ap-top-rev">{fmt(Math.round(p.revenue))} ₸</div>
              </div>
            ))}
            {data.top_products.length === 0 && <p className="ap-empty-sm">Деректер жоқ</p>}
          </div>
        </div>
      </div>

      {/* Top categories */}
      <div className="ap-card">
        <h3 className="ap-card-title">📂 Категория бойынша табыс</h3>
        <div className="ap-cat-bars">
          {data.top_categories.map((c, i) => {
            const maxCat = Math.max(...data.top_categories.map(x => x.revenue), 1);
            return (
              <div key={i} className="ap-cat-bar-row">
                <div className="ap-cat-bar-name">{c.name}</div>
                <div className="ap-cat-bar-track">
                  <div className="ap-cat-bar-fill"
                    style={{ width: `${(c.revenue / maxCat) * 100}%` }} />
                </div>
                <div className="ap-cat-bar-val">{fmt(Math.round(c.revenue))} ₸</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Low stock + Slow categories */}
      <div className="ap-two-col">
        {/* Low stock alert */}
        <div className="ap-card">
          <h3 className="ap-card-title">⚠️ Аз қалған өнімдер (≤5 дана)</h3>
          {data.low_stock && data.low_stock.length > 0 ? (
            <div className="ap-top-list">
              {data.low_stock.map((p, i) => (
                <div key={i} className="ap-top-item">
                  <span className={`ap-stock-badge ${p.stock === 0 ? 'zero' : 'low'}`}>
                    {p.stock === 0 ? '❌ 0' : `⚠️ ${p.stock}`}
                  </span>
                  <div className="ap-top-info">
                    <div className="ap-top-name">{p.name}</div>
                    <div className="ap-top-sub">{p.brand}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="ap-empty-sm">✅ Барлық өнімдер жеткілікті</p>
          )}
        </div>

        {/* Slow categories */}
        <div className="ap-card">
          <h3 className="ap-card-title">📉 Сатылмай жатқан категориялар</h3>
          {data.slow_categories && data.slow_categories.length > 0 ? (
            <div className="ap-top-list">
              {data.slow_categories.map((c, i) => (
                <div key={i} className="ap-top-item">
                  <span style={{ fontSize: 20 }}>📦</span>
                  <div className="ap-top-info">
                    <div className="ap-top-name">{c.name}</div>
                    <div className="ap-top-sub">Тапсырыс жоқ</div>
                  </div>
                  <span style={{ fontSize: 12, color: '#ef4444', fontWeight: 600 }}>0 ₸</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="ap-empty-sm">✅ Барлық категориялар сатылуда</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// 2. ORDERS
// ══════════════════════════════════════════════════════════════
function Orders() {
  const [orders,   setOrders]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState('all');
  const [search,   setSearch]   = useState('');
  const [updating, setUpdating] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    api.get('/api/admin/orders').then(r => setOrders(r.data)).finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id, s) => {
    setUpdating(id);
    await api.put(`/api/admin/orders/${id}/status`, { status: s });
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: s } : o));
    setUpdating(null);
  };

  const filtered = orders.filter(o => {
    const mf = filter === 'all' || o.status === filter;
    const ms = !search || String(o.id).includes(search) ||
      o.customer?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      o.customer?.username?.toLowerCase().includes(search.toLowerCase()) ||
      o.shipping_address?.toLowerCase().includes(search.toLowerCase());
    return mf && ms;
  });

  if (loading) return <Loader />;

  return (
    <div className="ap-section">
      <div className="ap-section-header">
        <h2 className="ap-title">📦 Тапсырыстар ({orders.length})</h2>
        <button className="ap-btn ap-btn-ghost" onClick={load}>🔄 Жаңарту</button>
      </div>

      <div className="ap-toolbar">
        <div className="ap-filter-tabs">
          {['all', ...Object.keys(STATUS_CFG)].map(s => (
            <button key={s}
              className={`ap-ftab ${filter === s ? 'active' : ''}`}
              onClick={() => setFilter(s)}>
              {s === 'all' ? `Барлығы (${orders.length})` : `${STATUS_CFG[s].label} (${orders.filter(o => o.status === s).length})`}
            </button>
          ))}
        </div>
        <input className="ap-search" placeholder="🔍 Іздеу..."
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {filtered.length === 0 ? <Empty /> : (
        <div className="ap-table-wrap">
          <table className="ap-table">
            <thead>
              <tr>
                <th>№</th><th>Клиент</th><th>Мекенжай</th>
                <th>Сома</th><th>Статус</th><th>Күні</th><th>Әрекет</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => {
                const cfg = STATUS_CFG[o.status] || STATUS_CFG.pending;
                const idx = STATUS_FLOW.indexOf(o.status);
                const next = STATUS_FLOW[idx + 1];
                return (
                  <>
                    <tr key={o.id} className="ap-tr" onClick={() => setExpanded(expanded === o.id ? null : o.id)}>
                      <td><strong>#{o.id}</strong></td>
                      <td>
                        <div className="ap-user-cell">
                          <div className="ap-user-avatar">{(o.customer?.username || '?')[0].toUpperCase()}</div>
                          <div>
                            <div className="ap-user-name">{o.customer?.full_name || o.customer?.username}</div>
                            <div className="ap-user-email">{o.customer?.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="ap-addr">{o.shipping_address}</td>
                      <td><strong>{fmt(o.total_amount)} ₸</strong></td>
                      <td>
                        <span className="ap-badge" style={{ color: cfg.color, background: cfg.bg }}>
                          {cfg.label}
                        </span>
                      </td>
                      <td className="ap-date">{o.created_at ? new Date(o.created_at).toLocaleDateString('kk-KZ') : '—'}</td>
                      <td onClick={e => e.stopPropagation()}>
                        <div className="ap-actions">
                          {next && o.status !== 'cancelled' && (
                            <button className="ap-btn ap-btn-primary ap-btn-sm"
                              disabled={updating === o.id}
                              onClick={() => updateStatus(o.id, next)}
                              style={{ background: STATUS_CFG[next].color }}>
                              → {STATUS_CFG[next].label}
                            </button>
                          )}
                          {o.status !== 'cancelled' && o.status !== 'delivered' && (
                            <button className="ap-btn ap-btn-danger ap-btn-sm"
                              disabled={updating === o.id}
                              onClick={() => updateStatus(o.id, 'cancelled')}>✕</button>
                          )}
                        </div>
                      </td>
                    </tr>
                    {expanded === o.id && (
                      <tr key={`${o.id}-detail`} className="ap-tr-detail">
                        <td colSpan={7}>
                          <div className="ap-order-detail">
                            <div className="ap-detail-info">
                              <span>📞 {o.customer?.phone || '—'}</span>
                              <span>💳 {o.payment_method} · {o.payment_status === 'paid' ? '✅ Төленді' : '⏳ Күтуде'}</span>
                            </div>
                            <div className="ap-detail-items">
                              {o.items?.map((item, i) => (
                                <div key={i} className="ap-detail-item">
                                  {item.product_image && (
                                    <img src={item.product_image} alt={item.product_name}
                                      onError={e => e.target.style.display='none'} />
                                  )}
                                  <span>{item.product_name}</span>
                                  <span>× {item.quantity}</span>
                                  <span>{fmt(item.price * item.quantity)} ₸</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// 3. PRODUCTS
// ══════════════════════════════════════════════════════════════
const EMPTY_PRODUCT = { name:'', description:'', price:'', stock_quantity:'', brand:'', image_url:'', category_id:'', is_active:true, specifications:'' };

function Products() {
  const [products,    setProducts]    = useState([]);
  const [categories,  setCategories]  = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [modal,       setModal]       = useState(null);
  const [form,        setForm]        = useState(EMPTY_PRODUCT);
  const [saving,      setSaving]      = useState(false);
  const [search,      setSearch]      = useState('');
  const [catFilter,   setCatFilter]   = useState('all');
  const [specError,   setSpecError]   = useState('');

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([
      api.get('/api/admin/products'),
      api.get('/api/categories'),
    ]).then(([p, c]) => { setProducts(p.data); setCategories(c.data); })
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  const openAdd  = () => {
    setForm(EMPTY_PRODUCT);
    setSpecError('');
    setModal('add');
  };
  const openEdit = (p) => {
    setForm({
      ...p,
      price: String(p.price),
      stock_quantity: String(p.stock_quantity),
      category_id: String(p.category_id),
      // specifications-ті JSON string-ке айналдыру
      specifications: p.specifications ? JSON.stringify(p.specifications, null, 2) : '',
    });
    setSpecError('');
    setModal(p);
  };

  const save = async (e) => {
    e.preventDefault();
    setSpecError('');

    // specifications JSON валидациясы
    let specsObj = null;
    if (form.specifications && form.specifications.trim()) {
      try {
        specsObj = JSON.parse(form.specifications);
      } catch {
        setSpecError('JSON форматы қате. Мысал: {"rating": 4.5, "max_weight": "155kg"}');
        return;
      }
    }

    setSaving(true);
    const body = {
      ...form,
      price: parseFloat(form.price),
      stock_quantity: parseInt(form.stock_quantity),
      category_id: parseInt(form.category_id),
      specifications: specsObj,
    };
    try {
      if (modal === 'add') {
        await api.post('/api/admin/products', body);
      } else {
        await api.put(`/api/admin/products/${modal.id}`, body);
      }
      setModal(null);
      load();
    } catch (err) {
      alert(err.response?.data?.detail || 'Қате');
    } finally {
      setSaving(false);
    }
  };

  const del = async (id) => {
    if (!confirm('Өнімді өшіру?')) return;
    await api.delete(`/api/admin/products/${id}`);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const filtered = products.filter(p => {
    const ms = !search || p.name.toLowerCase().includes(search.toLowerCase()) || (p.brand || '').toLowerCase().includes(search.toLowerCase());
    const mc = catFilter === 'all' || String(p.category_id) === catFilter;
    return ms && mc;
  });

  if (loading) return <Loader />;

  return (
    <div className="ap-section">
      <div className="ap-section-header">
        <h2 className="ap-title">🛍️ Өнімдер ({products.length})</h2>
        <button className="ap-btn ap-btn-primary" onClick={openAdd}>➕ Жаңа өнім</button>
      </div>

      <div className="ap-toolbar">
        <input className="ap-search" placeholder="🔍 Атауы немесе бренд..."
          value={search} onChange={e => setSearch(e.target.value)} />
        <select className="ap-select" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
          <option value="all">Барлық категориялар</option>
          {categories.map(c => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
        </select>
      </div>

      <div className="ap-table-wrap">
        <table className="ap-table">
          <thead>
            <tr><th>Сурет</th><th>Атауы</th><th>Категория</th><th>Баға</th><th>Қалдық</th><th>Статус</th><th>Әрекет</th></tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} className="ap-tr">
                <td>
                  <div className="ap-prod-img">
                    {p.image_url
                      ? <img src={p.image_url} alt={p.name} onError={e => e.target.style.display='none'} />
                      : <span>📦</span>}
                  </div>
                </td>
                <td>
                  <div className="ap-prod-name">{p.name}</div>
                  <div className="ap-prod-brand">{p.brand}</div>
                </td>
                <td>{categories.find(c => c.id === p.category_id)?.name || '—'}</td>
                <td><strong>{fmt(p.price)} ₸</strong></td>
                <td>
                  <span className={`ap-stock ${p.stock_quantity > 0 ? 'in' : 'out'}`}>
                    {p.stock_quantity > 0 ? `${p.stock_quantity} дана` : 'Таусылды'}
                  </span>
                </td>
                <td>
                  <span className={`ap-badge ${p.is_active ? 'active' : 'inactive'}`}>
                    {p.is_active ? 'Белсенді' : 'Жасырын'}
                  </span>
                </td>
                <td>
                  <div className="ap-actions">
                    <button className="ap-btn ap-btn-ghost ap-btn-sm" onClick={() => openEdit(p)}>✏️</button>
                    <button className="ap-btn ap-btn-danger ap-btn-sm" onClick={() => del(p.id)}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal !== null && (
        <div className="ap-modal-overlay" onClick={() => setModal(null)}>
          <div className="ap-modal" onClick={e => e.stopPropagation()}>
            <div className="ap-modal-header">
              <h3>{modal === 'add' ? '➕ Жаңа өнім' : '✏️ Өнімді өзгерту'}</h3>
              <button className="ap-modal-close" onClick={() => setModal(null)}>✕</button>
            </div>
            <form className="ap-modal-form" onSubmit={save}>
              <div className="ap-form-row">
                <div className="ap-form-field">
                  <label>Атауы *</label>
                  <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                </div>
                <div className="ap-form-field">
                  <label>Бренд</label>
                  <input value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} />
                </div>
              </div>
              <div className="ap-form-field">
                <label>Сипаттама</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={2} />
              </div>
              <div className="ap-form-row">
                <div className="ap-form-field">
                  <label>Баға (₸) *</label>
                  <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required min={0} />
                </div>
                <div className="ap-form-field">
                  <label>Қалдық *</label>
                  <input type="number" value={form.stock_quantity} onChange={e => setForm({...form, stock_quantity: e.target.value})} required min={0} />
                </div>
              </div>
              <div className="ap-form-row">
                <div className="ap-form-field">
                  <label>Категория *</label>
                  <select value={form.category_id} onChange={e => setForm({...form, category_id: e.target.value})} required>
                    <option value="">Таңдаңыз</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="ap-form-field">
                  <label>Статус</label>
                  <select value={form.is_active} onChange={e => setForm({...form, is_active: e.target.value === 'true'})}>
                    <option value="true">Белсенді</option>
                    <option value="false">Жасырын</option>
                  </select>
                </div>
              </div>
              <div className="ap-form-field">
                <label>Сурет URL</label>
                <input value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} placeholder="https://..." />
                {form.image_url && <img src={form.image_url} alt="preview" className="ap-img-preview" onError={e => e.target.style.display='none'} />}
              </div>
              <div className="ap-form-field">
                <label>Сипаттамалар (JSON)</label>
                <textarea
                  value={form.specifications}
                  onChange={e => { setForm({...form, specifications: e.target.value}); setSpecError(''); }}
                  rows={5}
                  placeholder={'{\n  "rating": 4.5,\n  "max_weight": "155kg",\n  "material": "PU Leather"\n}'}
                  style={{ fontFamily: 'monospace', fontSize: 13 }}
                />
                {specError && <span style={{ color: 'var(--danger)', fontSize: 12 }}>⚠️ {specError}</span>}
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  JSON форматында жазыңыз. Бос қалдырсаңыз өзгермейді.
                </span>
              </div>
              <div className="ap-modal-footer">
                <button type="button" className="ap-btn ap-btn-ghost" onClick={() => setModal(null)}>Бас тарту</button>
                <button type="submit" className="ap-btn ap-btn-primary" disabled={saving}>
                  {saving ? '⏳...' : modal === 'add' ? 'Қосу' : 'Сақтау'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// 4. CATEGORIES
// ══════════════════════════════════════════════════════════════
function Categories() {
  const [cats,    setCats]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(null);
  const [form,    setForm]    = useState({ name: '', description: '' });
  const [saving,  setSaving]  = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    api.get('/api/categories').then(r => setCats(r.data)).finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  const openAdd  = () => { setForm({ name: '', description: '' }); setModal('add'); };
  const openEdit = (c) => { setForm({ name: c.name, description: c.description || '' }); setModal(c); };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (modal === 'add') {
        await api.post('/api/admin/categories', form);
      } else {
        await api.put(`/api/admin/categories/${modal.id}`, form);
      }
      setModal(null);
      load();
    } catch (err) {
      alert(err.response?.data?.detail || 'Қате');
    } finally {
      setSaving(false);
    }
  };

  const del = async (id) => {
    if (!confirm('Категорияны өшіру? Өнімдер жоғалмайды.')) return;
    try {
      await api.delete(`/api/admin/categories/${id}`);
      setCats(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      alert(err.response?.data?.detail || 'Қате');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="ap-section">
      <div className="ap-section-header">
        <h2 className="ap-title">🗂️ Категориялар ({cats.length})</h2>
        <button className="ap-btn ap-btn-primary" onClick={openAdd}>➕ Жаңа категория</button>
      </div>

      <div className="ap-cat-grid">
        {cats.map(c => (
          <div key={c.id} className="ap-cat-card">
            <div className="ap-cat-card-body">
              <div className="ap-cat-name">{c.name}</div>
              <div className="ap-cat-desc">{c.description || '—'}</div>
            </div>
            <div className="ap-actions">
              <button className="ap-btn ap-btn-ghost ap-btn-sm" onClick={() => openEdit(c)}>✏️ Өзгерту</button>
              <button className="ap-btn ap-btn-danger ap-btn-sm" onClick={() => del(c.id)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>

      {modal !== null && (
        <div className="ap-modal-overlay" onClick={() => setModal(null)}>
          <div className="ap-modal ap-modal-sm" onClick={e => e.stopPropagation()}>
            <div className="ap-modal-header">
              <h3>{modal === 'add' ? '➕ Жаңа категория' : '✏️ Категорияны өзгерту'}</h3>
              <button className="ap-modal-close" onClick={() => setModal(null)}>✕</button>
            </div>
            <form className="ap-modal-form" onSubmit={save}>
              <div className="ap-form-field">
                <label>Атауы *</label>
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              </div>
              <div className="ap-form-field">
                <label>Сипаттама</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={2} />
              </div>
              <div className="ap-modal-footer">
                <button type="button" className="ap-btn ap-btn-ghost" onClick={() => setModal(null)}>Бас тарту</button>
                <button type="submit" className="ap-btn ap-btn-primary" disabled={saving}>
                  {saving ? '⏳...' : modal === 'add' ? 'Қосу' : 'Сақтау'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// 5. USERS
// ══════════════════════════════════════════════════════════════
function Users() {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [updating,setUpdating]= useState(null);

  const load = useCallback(() => {
    setLoading(true);
    api.get('/api/admin/users').then(r => setUsers(r.data)).finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  const updateRole = async (id, patch) => {
    setUpdating(id);
    try {
      await api.put(`/api/admin/users/${id}/role`, patch);
      setUsers(prev => prev.map(u => u.id === id ? { ...u, ...patch } : u));
    } catch (err) {
      alert(err.response?.data?.detail || 'Қате');
    } finally {
      setUpdating(null);
    }
  };

  const filtered = users.filter(u =>
    !search ||
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    (u.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Loader />;

  return (
    <div className="ap-section">
      <div className="ap-section-header">
        <h2 className="ap-title">👥 Пайдаланушылар ({users.length})</h2>
        <button className="ap-btn ap-btn-ghost" onClick={load}>🔄 Жаңарту</button>
      </div>

      <div className="ap-toolbar">
        <input className="ap-search" placeholder="🔍 Іздеу..."
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="ap-table-wrap">
        <table className="ap-table">
          <thead>
            <tr><th>Пайдаланушы</th><th>Email</th><th>Телефон</th><th>Тапсырыстар</th><th>Рөл</th><th>Статус</th><th>Тіркелген</th><th>Әрекет</th></tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id} className="ap-tr">
                <td>
                  <div className="ap-user-cell">
                    <div className="ap-user-avatar" style={{ background: u.is_admin ? '#7c3aed' : '#ff6b35' }}>
                      {(u.username || '?')[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="ap-user-name">{u.full_name || u.username}</div>
                      <div className="ap-user-email">@{u.username}</div>
                    </div>
                  </div>
                </td>
                <td className="ap-date">{u.email}</td>
                <td className="ap-date">{u.phone || '—'}</td>
                <td><strong>{u.order_count}</strong></td>
                <td>
                  <span className={`ap-badge ${u.is_admin ? 'admin' : 'user'}`}>
                    {u.is_admin ? '👑 Admin' : '👤 User'}
                  </span>
                </td>
                <td>
                  <span className={`ap-badge ${u.is_active ? 'active' : 'inactive'}`}>
                    {u.is_active ? '✅ Белсенді' : '🚫 Блок'}
                  </span>
                </td>
                <td className="ap-date">{u.created_at ? new Date(u.created_at).toLocaleDateString('kk-KZ') : '—'}</td>
                <td>
                  <div className="ap-actions">
                    <button className="ap-btn ap-btn-ghost ap-btn-sm"
                      disabled={updating === u.id}
                      onClick={() => updateRole(u.id, { is_admin: !u.is_admin })}
                      title={u.is_admin ? 'Admin рөлін алу' : 'Admin рөлін беру'}>
                      {u.is_admin ? '👤' : '👑'}
                    </button>
                    <button
                      className={`ap-btn ap-btn-sm ${u.is_active ? 'ap-btn-danger' : 'ap-btn-success'}`}
                      disabled={updating === u.id}
                      onClick={() => updateRole(u.id, { is_active: !u.is_active })}>
                      {u.is_active ? '🚫 Блок' : '✅ Ашу'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Shared components ─────────────────────────────────────────
function Loader() {
  return <div className="ap-loader"><div className="ap-spinner" />Жүктелуде...</div>;
}
function Empty() {
  return <div className="ap-empty">Деректер табылмады</div>;
}
