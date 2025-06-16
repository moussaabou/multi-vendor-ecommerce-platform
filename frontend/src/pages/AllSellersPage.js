import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AllSellersPage.css';

function AllSellersPage() {
  const [sellers, setSellers] = useState([]);
  const [filteredSellers, setFilteredSellers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/sellers/')
      .then((res) => res.json())
      .then((data) => {
        setSellers(data);
        setFilteredSellers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('حدث خطأ أثناء جلب بيانات البائعين:', err);
        setLoading(false);
      });
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    const results = sellers.filter(
      (s) =>
        s.name.toLowerCase().includes(value) ||
        s.email.toLowerCase().includes(value)
    );
    setFilteredSellers(results);
  };

  const viewProducts = (sellerId) => {
    navigate(`/seller-products/${sellerId}`);
  };

  return (
    <div className="all-sellers-page">
      <div className="container">
        <h2>📋 قائمة جميع البائعين</h2>

        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="🔍 بحث عن اسم أو بريد البائع..."
          className="search-input"
        />

        {loading ? (
          <p className="loading-msg">⏳ جاري التحميل...</p>
        ) : (
          <div className="sellers-list">
            <p className="summary">إجمالي البائعين: {filteredSellers.length}</p>
            {filteredSellers.length === 0 ? (
              <p className="no-results">❌ لا يوجد نتائج مطابقة.</p>
            ) : (
              <ul>
                {filteredSellers.map((seller) => (
                  <li key={seller.id} className="seller-card">
                    <h3>{seller.name} {seller.surname}</h3>
                    <p>📧 {seller.email}</p>
                    <p>📞 {seller.phone_number}</p>
                    <p>🏠 {seller.address}</p>
                    <p>🎂 {seller.birth_date}</p>
                    <button onClick={() => viewProducts(seller.id)} className="view-btn">
                      👀 عرض المنتجات
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AllSellersPage;
