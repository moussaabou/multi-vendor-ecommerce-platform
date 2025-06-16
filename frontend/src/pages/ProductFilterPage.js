import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductList.css';

const ProductFilterPage = () => {
  const [category, setCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortPrice, setSortPrice] = useState(''); // 'asc' أو 'desc' أو ''
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // جلب المنتجات مع الفلاتر
  useEffect(() => {
    setLoading(true);
    let url = '/api/filter-products/?';

    if (category) url += `category=${encodeURIComponent(category)}&`;
    if (minPrice) url += `min_price=${minPrice}&`;
    if (maxPrice) url += `max_price=${maxPrice}&`;
    if (sortPrice) url += `sort_price=${sortPrice}&`;

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('فشل في جلب المنتجات');
        return res.json();
      })
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setProducts([]);
        setLoading(false);
      });
  }, [category, minPrice, maxPrice, sortPrice]);

  // فلترة إضافية حسب البحث بالاسم فقط (اختياري لو API فلتر جيد)
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="App">
      <h1>تصفية المنتجات حسب النوع والسعر والبحث</h1>

      <div style={{ marginBottom: '15px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {/* تصنيف النوع */}
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          style={{ padding: '8px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc' }}
        >
          <option value="">اختر نوع المنتج</option>
          <option value="هاتف">هاتف</option>
          <option value="إلكترونيات">إلكترونيات</option>
          <option value="غيارات سيارات">غيارات سيارات</option>
          <option value="حاسوب">حاسوب</option>
        </select>

        {/* البحث */}
        <input
          type="search"
          placeholder="ابحث عن منتج..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ padding: '8px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc', flex: '1' }}
        />

        {/* أقل سعر */}
        <input
          type="number"
          placeholder="أقل سعر"
          value={minPrice}
          onChange={e => setMinPrice(e.target.value)}
          style={{ padding: '8px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc', width: '100px' }}
          min="0"
        />

        {/* أعلى سعر */}
        <input
          type="number"
          placeholder="أعلى سعر"
          value={maxPrice}
          onChange={e => setMaxPrice(e.target.value)}
          style={{ padding: '8px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc', width: '100px' }}
          min="0"
        />

        {/* ترتيب السعر */}
        <select
          value={sortPrice}
          onChange={e => setSortPrice(e.target.value)}
          style={{ padding: '8px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc' }}
        >
          <option value="">ترتيب السعر</option>
          <option value="asc">من الأقل إلى الأعلى</option>
          <option value="desc">من الأعلى إلى الأقل</option>
        </select>
      </div>

      {loading ? (
        <p>جاري التحميل...</p>
      ) : filteredProducts.length === 0 ? (
        <p>لا توجد منتجات مطابقة.</p>
      ) : (
        <ul className="product-list">
          {filteredProducts.map(product => (
            <li
              key={product.id}
              className="product-item"
              onClick={() => handleProductClick(product.id)}
              style={{ cursor: 'pointer' }}
              title={`عرض تفاصيل ${product.name}`}
            >
              <img
                src={product.images?.[0]}
                alt={product.name}
                className="product-image"
                style={{ width: '100%', borderRadius: '10px' }}
              />
              <div className="product-info">
                <h3>{product.name}</h3>
                <p>{product.price} د.ج</p>
                <p style={{ color: '#777', fontSize: '14px' }}>البائع: {product.seller}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductFilterPage;
