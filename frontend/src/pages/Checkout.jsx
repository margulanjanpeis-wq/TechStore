import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import api from '../api/axios';
import './Checkout.css';

// Карта нөмірін форматтау: 1234567890123456 → 1234 5678 9012 3456
const fmtCard = (v) =>
  v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

// Мерзімді форматтау: 1224 → 12/24
const fmtExpiry = (v) => {
  const d = v.replace(/\D/g, '').slice(0, 4);
  return d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d;
};

// Карта типін анықтау
const cardType = (n) => {
  const num = n.replace(/\s/g, '');
  if (/^4/.test(num))        return { name: 'Visa',       icon: '💳' };
  if (/^5[1-5]/.test(num))   return { name: 'Mastercard', icon: '💳' };
  if (/^9[0-9]/.test(num))   return { name: 'Kaspi',      icon: '🟡' };
  return { name: '', icon: '💳' };
};

export default function Checkout() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const { cartItems, fetchCart, getTotalPrice, clearCart } = useCartStore();

  // Жеткізу формасы
  const [addr, setAddr] = useState({
    full_name: '', email: '', phone: '', city: '', street: '', apt: '',
  });

  // Карта формасы
  const [card, setCard] = useState({
    number: '', holder: '', expiry: '', cvv: '',
  });
  const [cvvVisible, setCvvVisible] = useState(false);
  const [cardErrors, setCardErrors] = useState({});

  // Жеткізу
  const [delivery, setDelivery] = useState('courier');

  // UI state
  const [loading,  setLoading]  = useState(false);
  const [apiError, setApiError] = useState('');
  const [receipt,  setReceipt]  = useState(null); // чек деректері

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    fetchCart();
  }, [isAuthenticated, navigate, fetchCart]);

  useEffect(() => {
    if (user) setAddr((p) => ({
      ...p,
      full_name: user.full_name || '',
      email:     user.email     || '',
      phone:     user.phone     || '',
      street:    user.address   || '',
    }));
  }, [user]);

  const handleAddr = (e) => setAddr({ ...addr, [e.target.name]: e.target.value });
  const handleCard = (e) => {
    const { name, value } = e.target;
    let v = value;
    if (name === 'number') v = fmtCard(value);
    if (name === 'expiry') v = fmtExpiry(value);
    if (name === 'cvv')    v = value.replace(/\D/g, '').slice(0, 4);
    setCard({ ...card, [name]: v });
    setCardErrors({ ...cardErrors, [name]: '' });
  };

  const total        = getTotalPrice();
  const deliveryCost = delivery === 'pickup' ? 0 : total >= 50000 ? 0 : 2500;
  const grandTotal   = total + deliveryCost;

  // Карта валидациясы
  const validateCard = () => {
    const errs = {};
    const num = card.number.replace(/\s/g, '');
    if (num.length < 16)          errs.number = 'Карта нөмірі 16 цифр болуы керек';
    if (!card.holder.trim())      errs.holder = 'Карта иесінің атын енгізіңіз';
    const [mm, yy] = card.expiry.split('/');
    if (!mm || !yy || mm > 12 || mm < 1) errs.expiry = 'Жарамды мерзімді енгізіңіз';
    if (card.cvv.length < 3)      errs.cvv = 'CVV 3–4 цифр';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    // Карта валидациясы
    const errs = validateCard();
    if (Object.keys(errs).length) { setCardErrors(errs); return; }

    if (!addr.city.trim() || !addr.street.trim()) {
      setApiError('Қала мен мекенжайды толтырыңыз');
      return;
    }

    setLoading(true);
    try {
      const address = `${addr.city}, ${addr.street}${addr.apt ? ', пәтер ' + addr.apt : ''}`;
      const res = await api.post('/api/orders', {
        shipping_address: address,
        payment_method:   'card',
      });

      // Чек деректерін жасау
      setReceipt({
        orderId:    res.data.id,
        date:       new Date().toLocaleString('kk-KZ'),
        items:      cartItems,
        total,
        deliveryCost,
        grandTotal,
        address,
        cardMask:   '**** **** **** ' + card.number.replace(/\s/g, '').slice(-4),
        cardHolder: card.holder.toUpperCase(),
        delivery,
        customer:   addr.full_name || user?.username,
        email:      addr.email || user?.email,
      });

      clearCart?.();
    } catch (err) {
      setApiError(err.response?.data?.detail || 'Қате орын алды. Қайталап көріңіз.');
    } finally {
      setLoading(false);
    }
  };

  // ══════════════════════════════════════════════════════════════
  // ЧЕК БЕТІ
  // ══════════════════════════════════════════════════════════════
  if (receipt) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="receipt-wrap">
            {/* Чек */}
            <div className="receipt" id="receipt-print">
              <div className="receipt-header">
                <div className="receipt-logo">⚡ TechStore</div>
                <div className="receipt-badge">✓ Төлем сәтті өтті</div>
              </div>

              <div className="receipt-meta">
                <div className="receipt-meta-row">
                  <span>Тапсырыс №</span>
                  <strong>#{receipt.orderId}</strong>
                </div>
                <div className="receipt-meta-row">
                  <span>Күні</span>
                  <strong>{receipt.date}</strong>
                </div>
                <div className="receipt-meta-row">
                  <span>Клиент</span>
                  <strong>{receipt.customer}</strong>
                </div>
                <div className="receipt-meta-row">
                  <span>Email</span>
                  <strong>{receipt.email}</strong>
                </div>
              </div>

              <div className="receipt-divider">- - - - - - - - - - - - - - - - - - - -</div>

              {/* Өнімдер */}
              <div className="receipt-items">
                <div className="receipt-items-head">
                  <span>Тауар</span>
                  <span>Саны</span>
                  <span>Сома</span>
                </div>
                {receipt.items.map((item) => (
                  <div key={item.id} className="receipt-item">
                    <span className="receipt-item-name">{item.product?.name}</span>
                    <span className="receipt-item-qty">× {item.quantity}</span>
                    <span className="receipt-item-price">
                      {(parseFloat(item.product?.price || 0) * item.quantity).toLocaleString()} ₸
                    </span>
                  </div>
                ))}
              </div>

              <div className="receipt-divider">- - - - - - - - - - - - - - - - - - - -</div>

              {/* Жиынтық */}
              <div className="receipt-totals">
                <div className="receipt-total-row">
                  <span>Тауарлар</span>
                  <span>{receipt.total.toLocaleString()} ₸</span>
                </div>
                <div className="receipt-total-row">
                  <span>Жеткізу</span>
                  <span>{receipt.deliveryCost === 0 ? 'Тегін' : receipt.deliveryCost.toLocaleString() + ' ₸'}</span>
                </div>
                <div className="receipt-grand">
                  <span>ЖАЛПЫ СОМА</span>
                  <span>{receipt.grandTotal.toLocaleString()} ₸</span>
                </div>
              </div>

              <div className="receipt-divider">- - - - - - - - - - - - - - - - - - - -</div>

              {/* Төлем */}
              <div className="receipt-payment">
                <div className="receipt-total-row">
                  <span>Төлем әдісі</span>
                  <span>💳 Банк картасы</span>
                </div>
                <div className="receipt-total-row">
                  <span>Карта</span>
                  <span>{receipt.cardMask}</span>
                </div>
                <div className="receipt-total-row">
                  <span>Карта иесі</span>
                  <span>{receipt.cardHolder}</span>
                </div>
                <div className="receipt-total-row">
                  <span>Жеткізу</span>
                  <span>{receipt.delivery === 'courier' ? 'Курьермен' : receipt.delivery === 'express' ? 'Жедел' : 'Өзі алып кету'}</span>
                </div>
                <div className="receipt-total-row">
                  <span>Мекенжай</span>
                  <span>{receipt.address}</span>
                </div>
              </div>

              <div className="receipt-divider">- - - - - - - - - - - - - - - - - - - -</div>

              <div className="receipt-footer">
                <p>Сатып алғаныңызға рахмет! 🙏</p>
                <p>TechStore — Компьютер бөлшектері</p>
                <p>+7 (727) 123-45-67</p>
              </div>
            </div>

            {/* Батырмалар */}
            <div className="receipt-actions">
              <button className="btn btn-outline" onClick={() => window.print()}>
                🖨️ Басып шығару
              </button>
              <button className="btn btn-primary" onClick={() => navigate('/orders')}>
                📋 Тапсырыстарым
              </button>
              <button className="btn btn-ghost" onClick={() => navigate('/products')}>
                🛍️ Тауарларды шолу
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════
  // CHECKOUT ФОРМАСЫ
  // ══════════════════════════════════════════════════════════════
  const ct = cardType(card.number);

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="checkout-heading">
          <span>🛍️</span> Тапсырыс рәсімдеу
        </h1>
        <p className="checkout-sub">
          Барлық өрістерді толтырып, «Тапсырыс беру» батырмасын басыңыз
        </p>

        <form className="checkout-layout" onSubmit={handleSubmit}>

          {/* ── Сол жақ ── */}
          <div className="co-col-left">

            {/* 1. Жеткізу мекенжайы */}
            <div className="co-section">
              <div className="co-section-title">
                <span className="co-num">1</span> Жеткізу мекенжайы
              </div>
              <div className="co-row-2">
                <div className="co-field">
                  <label>Аты-жөні <span className="req">*</span></label>
                  <input name="full_name" value={addr.full_name} onChange={handleAddr}
                    placeholder="Толық аты-жөні" required />
                </div>
                <div className="co-field">
                  <label>Email</label>
                  <input name="email" type="email" value={addr.email} onChange={handleAddr}
                    placeholder="email@example.com" />
                </div>
              </div>
              <div className="co-field">
                <label>Телефон <span className="req">*</span></label>
                <input name="phone" value={addr.phone} onChange={handleAddr}
                  placeholder="+7 (___) ___-__-__" required />
              </div>
              <div className="co-row-2">
                <div className="co-field">
                  <label>Қала <span className="req">*</span></label>
                  <input name="city" value={addr.city} onChange={handleAddr}
                    placeholder="Алматы" required />
                </div>
                <div className="co-field">
                  <label>Пәтер / Кеңсе</label>
                  <input name="apt" value={addr.apt} onChange={handleAddr}
                    placeholder="Пәтер нөмірі" />
                </div>
              </div>
              <div className="co-field">
                <label>Мекенжай <span className="req">*</span></label>
                <input name="street" value={addr.street} onChange={handleAddr}
                  placeholder="Абай даңғылы, 150" required />
              </div>
            </div>

            {/* 2. Жеткізу әдісі */}
            <div className="co-section">
              <div className="co-section-title">
                <span className="co-num">2</span> Жеткізу әдісі
              </div>
              <div className="co-radio-group">
                {[
                  { id: 'courier', label: 'Курьермен жеткізу', sub: '1–3 жұмыс күні',    price: total >= 50000 ? 'Тегін' : '2 500 ₸' },
                  { id: 'express', label: 'Жедел жеткізу',     sub: 'Бүгін немесе ертең', price: '5 000 ₸' },
                  { id: 'pickup',  label: 'Өзі алып кету',     sub: 'Дүкеннен тегін',     price: 'Тегін' },
                ].map((d) => (
                  <label key={d.id} className={`co-radio-card ${delivery === d.id ? 'selected' : ''}`}>
                    <input type="radio" name="delivery" value={d.id}
                      checked={delivery === d.id} onChange={(e) => setDelivery(e.target.value)} />
                    <div className="co-radio-body">
                      <span className="co-radio-label">{d.label}</span>
                      <span className="co-radio-sub">{d.sub}</span>
                    </div>
                    <span className="co-radio-price">{d.price}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 3. Банк картасы */}
            <div className="co-section">
              <div className="co-section-title">
                <span className="co-num">3</span> Банк картасы
              </div>

              {/* Карта визуалы */}
              <div className="card-visual">
                <div className="card-visual-top">
                  <span className="card-chip">▬▬</span>
                  <span className="card-type-name">{ct.icon} {ct.name}</span>
                </div>
                <div className="card-visual-number">
                  {card.number || '•••• •••• •••• ••••'}
                </div>
                <div className="card-visual-bottom">
                  <div>
                    <div className="card-visual-label">КАРТА ИЕСІ</div>
                    <div className="card-visual-value">{card.holder || 'АТЫ ЖӨНІ'}</div>
                  </div>
                  <div>
                    <div className="card-visual-label">МЕРЗІМІ</div>
                    <div className="card-visual-value">{card.expiry || 'MM/YY'}</div>
                  </div>
                </div>
              </div>

              {/* Карта өрістері */}
              <div className="co-field" style={{ marginTop: 20 }}>
                <label>Карта нөмірі <span className="req">*</span></label>
                <input name="number" value={card.number} onChange={handleCard}
                  placeholder="1234 5678 9012 3456" maxLength={19}
                  className={cardErrors.number ? 'input-error' : ''} />
                {cardErrors.number && <span className="field-error">{cardErrors.number}</span>}
              </div>

              <div className="co-field">
                <label>Карта иесінің аты <span className="req">*</span></label>
                <input name="holder" value={card.holder} onChange={handleCard}
                  placeholder="IVAN IVANOV" style={{ textTransform: 'uppercase' }}
                  className={cardErrors.holder ? 'input-error' : ''} />
                {cardErrors.holder && <span className="field-error">{cardErrors.holder}</span>}
              </div>

              <div className="co-row-2">
                <div className="co-field">
                  <label>Жарамдылық мерзімі <span className="req">*</span></label>
                  <input name="expiry" value={card.expiry} onChange={handleCard}
                    placeholder="MM/YY" maxLength={5}
                    className={cardErrors.expiry ? 'input-error' : ''} />
                  {cardErrors.expiry && <span className="field-error">{cardErrors.expiry}</span>}
                </div>
                <div className="co-field">
                  <label>CVV / CVC <span className="req">*</span></label>
                  <div className="cvv-wrap">
                    <input name="cvv" value={card.cvv} onChange={handleCard}
                      type={cvvVisible ? 'text' : 'password'}
                      placeholder="•••" maxLength={4}
                      className={cardErrors.cvv ? 'input-error' : ''} />
                    <button type="button" className="cvv-toggle"
                      onClick={() => setCvvVisible((v) => !v)}>
                      {cvvVisible ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {cardErrors.cvv && <span className="field-error">{cardErrors.cvv}</span>}
                </div>
              </div>

              <div className="card-secure-note">
                🔒 Деректеріңіз SSL арқылы қорғалған
              </div>
            </div>
          </div>

          {/* ── Оң жақ: тапсырыс қорытындысы ── */}
          <div className="co-col-right">
            <div className="co-summary">
              <div className="co-section-title" style={{ marginBottom: 16 }}>
                <span className="co-check-icon">✓</span> Тапсырысты тексеру
              </div>

              <div className="co-items">
                {cartItems.map((item) => (
                  <div key={item.id} className="co-item">
                    <div className="co-item-img">
                      <img src={item.product?.image_url} alt={item.product?.name}
                        onError={(e) => { e.target.style.display = 'none'; }} />
                    </div>
                    <div className="co-item-info">
                      <p className="co-item-name">{item.product?.name}</p>
                      <span className="co-item-qty">× {item.quantity}</span>
                    </div>
                    <span className="co-item-price">
                      {(parseFloat(item.product?.price || 0) * item.quantity).toLocaleString()} ₸
                    </span>
                  </div>
                ))}
              </div>

              <div className="co-divider" />

              <div className="co-totals">
                <div className="co-total-row">
                  <span>Тауарлар ({cartItems.length})</span>
                  <span>{total.toLocaleString()} ₸</span>
                </div>
                <div className="co-total-row">
                  <span>Жеткізу</span>
                  <span className={deliveryCost === 0 ? 'co-free' : ''}>
                    {deliveryCost === 0 ? 'Тегін' : `${deliveryCost.toLocaleString()} ₸`}
                  </span>
                </div>
              </div>

              <div className="co-divider" />

              <div className="co-grand-total">
                <span>Жалпы сома</span>
                <span>{grandTotal.toLocaleString()} ₸</span>
              </div>

              {deliveryCost === 0 && total > 0 && (
                <div className="co-free-badge">🎉 Тегін жеткізу!</div>
              )}

              {apiError && <div className="co-error">⚠️ {apiError}</div>}

              <button type="submit" className="co-place-order"
                disabled={loading || cartItems.length === 0}>
                {loading ? '⏳ Өңделуде...' : `💳 Төлеу — ${grandTotal.toLocaleString()} ₸`}
              </button>

              <p className="co-terms">
                🔒 Қауіпсіз төлем · SSL шифрлау
              </p>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
