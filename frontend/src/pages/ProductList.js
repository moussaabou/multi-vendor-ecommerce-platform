import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductList.css'; // لتنسيق الصفحة

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/products/')
      .then((res) => {
        if (!res.ok) throw new Error("فشل في جلب المنتجات");
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("خطأ في جلب المنتجات:", err);
        setLoading(false);
      });
  }, []);

  const handleProductClick = (id) => {
    navigate(`/product/${id}`); // عند الضغط نذهب لصفحة تفاصيل المنتج
  };

  return (
    <div className="App">
      <h1>قائمة المنتجات</h1>

      {loading ? (
        <p>جاري التحميل...</p>
      ) : products.length === 0 ? (
        <p>لا توجد منتجات متاحة حالياً</p>
      ) : (
        <ul className="product-list">
          {products.map((product) => (
            <li 
              key={product.id} 
              className="product-item" 
              onClick={() => handleProductClick(product.id)}
            >
              <img 
                src={product.images?.[0]} 
                alt={product.name} 
                className="product-image" 
              />
              <div className="product-info">
                <h3>{product.name}</h3>
                <p>{product.price} د.ج</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ProductList;
