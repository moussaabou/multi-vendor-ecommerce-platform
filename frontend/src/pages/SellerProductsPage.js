import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SearchComponent from '../components/SearchComponent'; // استيراد مكون البحث
import './SellerProductsPage.css';

function SellerProductsPage() {
  const { sellerId } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sellerInfo, setSellerInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); // لحفظ قيمة البحث

  useEffect(() => {
    // جلب بيانات البائع والمنتجات
    fetch(`/api/get-seller-products/${sellerId}/`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
        setFilteredProducts(data.products || []);
        setSellerInfo(data.seller_info || {});
        setLoading(false);
      })
      .catch((err) => {
        console.error('خطأ أثناء جلب البيانات:', err);
        setLoading(false);
      });
  }, [sellerId]);

  const handleProductClick = (id) => {
    navigate(`/product/${id}`); // عند الضغط نذهب لصفحة تفاصيل المنتج
  };

  // دالة لتصفية المنتجات بناءً على البحث
  useEffect(() => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm) // تصفية المنتجات بالاسم
    );
    setFilteredProducts(filtered); // تحديث المنتجات المصفاة
  }, [searchTerm, products]); // تتنفذ كلما تغيرت القيمة

  return (
    <div className="seller-products-page">
      <div className="container">
        <h2>🛒 منتجات البائع: {sellerInfo.name || `#${sellerId}`}</h2>

        {/* استخدام مكون البحث */}
        <SearchComponent searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        {/* عرض معلومات البائع */}
        <div className="seller-info">
          <div className="seller-image">
            <img
              src={sellerInfo.profile_picture || '/default-profile.png'}
              alt={sellerInfo.name}
              className="profile-img"
            />
          </div>
          <div className="seller-details">
            <h3>{sellerInfo.name} {sellerInfo.surname}</h3>
            <p>📧 البريد الإلكتروني: {sellerInfo.email}</p>
            <p>📞 رقم الهاتف: {sellerInfo.phone_number}</p>
            <p>🏠 العنوان: {sellerInfo.address}</p>
            <p>🎂 تاريخ الميلاد: {sellerInfo.birth_date}</p>
          </div>
        </div>

        {/* عرض المنتجات */}
        {loading ? (
          <p>⏳ جاري التحميل...</p>
        ) : filteredProducts.length === 0 ? (
          <p>❌ لا توجد منتجات لهذا البائع.</p>
        ) : (
          <ul className="product-list">
            {filteredProducts.map((product) => (
              <li key={product.id} className="product-card">
                <h3>{product.name}</h3>
                <p>💵 السعر: {product.price} دج</p>
                <p>📝 {product.description}</p>

                {/* عرض الصورة الأولى للمنتج */}
                {product.images?.length > 0 && (
                  <div className="product-images">
                    <img
                      src={product.images[0]}
                      alt={`${product.name}-image`}
                      className="product-image"
                    />
                  </div>
                )}

                {/* عند الضغط على المنتج، انتقل لصفحة التفاصيل */}
                <button
                  className="view-details-btn"
                  onClick={() => handleProductClick(product.id)}
                >
                  🛍️ عرض التفاصيل
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default SellerProductsPage;
