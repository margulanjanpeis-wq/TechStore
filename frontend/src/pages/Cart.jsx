import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import './Cart.css';

function Cart() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { cartItems, fetchCart, removeFromCart, getTotalPrice, loading } = useCartStore();
  const [removing, setRemoving] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchCart();
  }, [isAuthenticated, navigate, fetchCart]);

  const handleRemove = async (itemId) => {
    setRemoving(itemId);
    await removeFromCart(itemId);
    setRemoving(null);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (loading) return <div className="loading">Жүктелуде...</div>;

  return (
    <div className="cart-page">
      <div className="container">
        <h1>Себет</h1>
        
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <p>Себет бос</p>
            <button onClick={() => navigate('/products')} className="btn-primary">
              Тауарларды көру
            </button>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="item-image">
                    <img src={item.product.image_url || '/placeholder.png'} alt={item.product.name} />
                  </div>
                  <div className="item-details">
                    <h3>{item.product.name}</h3>
                    <p className="brand">{item.product.brand}</p>
                    <p className="price">{parseFloat(item.product.price).toLocaleString()} ₸</p>
                  </div>
                  <div className="item-quantity">
                    <span>Саны: {item.quantity}</span>
                  </div>
                  <div className="item-total">
                    <p className="total-price">
                      {(parseFloat(item.product.price) * item.quantity).toLocaleString()} ₸
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="btn-remove"
                    disabled={removing === item.id}
                  >
                    {removing === item.id ? '...' : '✕'}
                  </button>
                </div>
              ))}
            </div>
            
            <div className="cart-summary">
              <h2>Тапсырыс</h2>
              <div className="summary-row">
                <span>Тауарлар саны:</span>
                <span>{cartItems.length}</span>
              </div>
              <div className="summary-row">
                <span>Жалпы сома:</span>
                <span className="total">{getTotalPrice().toLocaleString()} ₸</span>
              </div>
              <button onClick={handleCheckout} className="btn-primary">
                Тапсырыс беру
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
