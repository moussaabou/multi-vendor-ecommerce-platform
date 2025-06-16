// src/pages/SellerPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaSpinner } from 'react-icons/fa';
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

    fetchProducts(userId);
  }, [navigate]);

  const fetchProducts = async (userId) => {
    try {
      const response = await fetch(`/api/seller-products/${userId}/`);
      if (!response.ok) throw new Error('فشل في جلب المنتجات');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError('حدث خطأ أثناء تحميل المنتجات');
      console.error('خطأ:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="seller-page">
      <h2>مرحباً بك في صفحة البائع!</h2>
      <button className="add-btn" onClick={() => navigate('/add-product')}>
        <FaPlus style={{ marginLeft: '8px' }} />
        إضافة منتج جديد
      </button>

      {loading ? (
        <div className="loading">
          <FaSpinner className="spinner" />
          جاري تحميل المنتجات...
        </div>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <>
          <h3>منتجاتك:</h3>
          <div className="product-list">
            {products.length === 0 ? (
              <p className="no-products">لا توجد منتجات حتى الآن.</p>
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
