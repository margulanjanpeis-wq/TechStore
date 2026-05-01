import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import './Products.css';

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('category');   // "1" | null
  const searchQuery = searchParams.get('search') || ''; // "rtx" | ""

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Категориялар тізімін бір рет жүктейміз
        const categoriesRes = await api.get('/api/categories');
        setCategories(categoriesRes.data);

        // Іздеу режимі: барлық өнімдерді жүктеп, клиентте сүзгілейміз
        if (searchQuery) {
          const productsRes = await api.get('/api/products?limit=500');
          const q = searchQuery.toLowerCase();
          setProducts(
            productsRes.data.filter(
              (p) =>
                p.name.toLowerCase().includes(q) ||
                (p.brand && p.brand.toLowerCase().includes(q)) ||
                (p.description && p.description.toLowerCase().includes(q))
            )
          );
          return;
        }

        // Категория режимі: тек сол категорияның өнімдері
        if (categoryId) {
          const productsRes = await api.get(`/api/categories/${categoryId}/products`);
          setProducts(productsRes.data);
          return;
        }

        // Барлық өнімдер
        const productsRes = await api.get('/api/products?limit=500');
        setProducts(productsRes.data);
      } catch (error) {
        console.error('Деректерді жүктеу қатесі:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [categoryId, searchQuery]);

  if (loading) return <div className="loading">Жүктелуде...</div>;

  return (
    <div className="products-page">
      <div className="container">
        <aside className="sidebar">
          <h3>Санаттар</h3>
          <ul className="category-list">
            <li>
              <Link to="/products" className={!categoryId && !searchQuery ? 'active' : ''}>
                Барлығы
              </Link>
            </li>
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  to={`/products?category=${category.id}`}
                  className={categoryId === String(category.id) ? 'active' : ''}
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <main className="products-main">
          {searchQuery ? (
            <h1>
              «{searchQuery}» бойынша нәтижелер
              <span className="search-count"> — {products.length} тауар</span>
            </h1>
          ) : (
            <h1>Тауарлар</h1>
          )}

          {products.length === 0 ? (
            <div className="no-results">
              {searchQuery
                ? <p>🔍 «{searchQuery}» бойынша тауар табылмады</p>
                : <p>🔍 Бұл санатта тауар жоқ</p>
              }
              <Link to="/products" className="btn-back">Барлық тауарларға оралу</Link>
            </div>
          ) : (
            <div className="product-grid">
              {products.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="product-card"
                >
                  <div className="product-image">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://placehold.co/400x300/1a1a2e/ffffff?text=${encodeURIComponent(product.name.slice(0,15))}`;
                      }}
                    />
                  </div>
                  <h3>{product.name}</h3>
                  <p className="brand">{product.brand}</p>
                  <p className="price">{parseFloat(product.price).toLocaleString()} ₸</p>
                  <span className="stock">
                    {product.stock_quantity > 0 ? 'Қоймада бар' : 'Қоймада жоқ'}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Products;
