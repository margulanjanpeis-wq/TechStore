import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import useAuthStore from '../store/authStore';
import './Orders.css';

function Orders() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await api.get('/api/orders');
        setOrders(response.data);
      } catch (error) {
        console.error('Тапсырыстарды жүктеу қатесі:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, navigate]);

  if (loading) return <div className="loading">Жүктелуде...</div>;

  return (
    <div className="orders-page">
      <div className="container">
        <h1>Менің тапсырыстарым</h1>
        
        {orders.length === 0 ? (
          <div className="empty-orders">
            <p>Тапсырыстар жоқ</p>
            <button onClick={() => navigate('/products')} className="btn-primary">
              Тауарларды көру
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div>
                    <h3>Тапсырыс #{order.id}</h3>
                    <p className="order-date">
                      {new Date(order.created_at).toLocaleDateString('kk-KZ')}
                    </p>
                  </div>
                  <div className="order-status">
                    <span className={`status ${order.status}`}>
                      {order.status === 'pending'    ? '⏳ Күтуде' :
                       order.status === 'processing' ? '🔄 Өңделуде' :
                       order.status === 'shipped'    ? '🚚 Жолда' :
                       order.status === 'delivered'  ? '✅ Жеткізілді' :
                       order.status === 'cancelled'  ? '❌ Бас тартылды' :
                       order.status}
                    </span>
                  </div>
                </div>
                
                <div className="order-details">
                  <p><strong>Жеткізу мекенжайы:</strong> {order.shipping_address}</p>
                  <p><strong>Төлем әдісі:</strong> {order.payment_method}</p>
                  <p><strong>Төлем статусы:</strong> {order.payment_status === 'pending' ? 'Күтуде' : 'Төленді'}</p>
                </div>
                
                {order.order_items && order.order_items.length > 0 && (
                  <div className="order-items">
                    <h4>Тауарлар:</h4>
                    {order.order_items.map((item) => (
                      <div key={item.id} className="order-item">
                        <span>{item.product?.name || 'Тауар'}</span>
                        <span>{item.quantity} дана × {parseFloat(item.price).toLocaleString()} ₸</span>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="order-total">
                  <strong>Жалпы сома:</strong>
                  <span className="total-amount">{parseFloat(order.total_amount).toLocaleString()} ₸</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;
