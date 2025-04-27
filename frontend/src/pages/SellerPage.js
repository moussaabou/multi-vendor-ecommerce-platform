// src/pages/SellerPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductList.css';
import './SellerPage.css';

function SellerPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userType = localStorage.getItem('userType');
    const userId = localStorage.getItem('userId');

    if (userType !== 'seller' || !userId) {
      navigate('/login');
      return;
    }

    fetch(`/api/seller-products/${userId}/`)
      .then((res) => {
        if (!res.ok) throw new Error('فشل في جلب المنتجات');
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('حدث خطأ أثناء تحميل المنتجات');
        setLoading(false);
        console.error('خطأ:', err);
      });
  }, [navigate]);

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="seller-page">
      <h2>مرحباً بك في صفحة البائع!</h2>
      <button className="add-btn" onClick={() => navigate('/add-product')}>إضافة منتج جديد</button>

      {loading ? (
        <p>جاري تحميل المنتجات...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <>
          <h3>منتجاتك:</h3>
          <div className="product-list">
            {products.length === 0 ? (
              <p>لا توجد منتجات حتى الآن.</p>
            ) : (
              products.map((product) => (
                <div key={product.id} className="product-card" onClick={() => handleProductClick(product.id)}>
                  <img
                    src={product.images[0] || '/placeholder.jpg'}
                    alt={product.name}
                    className="product-image"
                  />
                  <div className="product-details">
                    <h4>{product.name}</h4>
                    <p className="price">{product.price} د.ج</p>
                    <p className="category">{product.category}</p>
                    <p className="description">{product.description.slice(0, 60)}...</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default SellerPage;
