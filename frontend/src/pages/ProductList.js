// src/pages/ProductList.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchComponent from '../components/SearchComponent'; // تأكد من المسار الصحيح
import './ProductList.css';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
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
    navigate(`/product/${id}`);
  };

  const filteredProducts = products.filter((product) =>
    product.name?.toLowerCase().includes(searchTerm)
  );

  return (
    <div className="App">
      <h1>قائمة المنتجات</h1>

      {/* ✅ مكون البحث */}
      <SearchComponent searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {loading ? (
        <p>جاري التحميل...</p>
      ) : filteredProducts.length === 0 ? (
        <p>❌ لا توجد منتجات مطابقة.</p>
      ) : (
        <ul className="product-list">
          {filteredProducts.map((product) => (
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
