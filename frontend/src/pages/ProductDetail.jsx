import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import './ProductDetail.css';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState('');
  
  const { isAuthenticated } = useAuthStore();
  const { addToCart } = useCartStore();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/api/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Тауарды жүктеу қатесі:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setAdding(true);
    const result = await addToCart(product.id, 1);
    
    if (result.success) {
      setMessage('Себетке қосылды!');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage(result.error);
    }
    
    setAdding(false);
  };

  if (loading) return <div className="loading">Жүктелуде...</div>;
  if (!product) return <div className="loading">Тауар табылмады</div>;

  return (
    <div className="product-detail-page">
      <div className="container">
        {message && <div className="success">{message}</div>}
        
        <div className="product-detail">
          <div className="product-image-large">
            <img
              src={product.image_url || `https://source.unsplash.com/600x400/?${encodeURIComponent(product.name)}`}
              alt={product.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://placehold.co/600x400/1a1a2e/ffffff?text=${encodeURIComponent(product.name.slice(0,20))}`;
              }}
            />
          </div>
          
          <div className="product-info">
            <h1>{product.name}</h1>
            <p className="brand">{product.brand}</p>
            
            <div className="price-section">
              <p className="price">{parseFloat(product.price).toLocaleString()} ₸</p>
              <span className={`stock ${product.stock_quantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
                {product.stock_quantity > 0 ? `Қоймада бар (${product.stock_quantity})` : 'Қоймада жоқ'}
              </span>
            </div>
            
            <div className="description">
              <h3>Сипаттама</h3>
              <p>{product.description || 'Сипаттама жоқ'}</p>
            </div>
            
            {product.specifications && (
              <div className="specifications">
                <h3>Сипаттамалары</h3>
                <ul>
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <li key={key}>
                      <strong>{key}:</strong> {value}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="actions">
              <button
                onClick={handleAddToCart}
                className="btn-primary"
                disabled={adding || product.stock_quantity === 0}
              >
                {adding ? 'Қосылуда...' : 'Себетке қосу'}
              </button>
              <button onClick={() => navigate('/products')} className="btn-secondary">
                Артқа
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
