import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaStar, FaMapMarkerAlt } from 'react-icons/fa';
import './AllSellers.css';

const AllSellers = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/sellers');
      setSellers(response.data);
      setError(null);
    } catch (err) {
      setError('حدث خطأ أثناء جلب بيانات البائعين');
      console.error('Error fetching sellers:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSellers = sellers.filter(seller =>
    seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    seller.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <FaStar
        key={index}
        className="rating-stars"
        style={{ opacity: index < rating ? 1 : 0.3 }}
      />
    ));
  };

  if (loading) {
    return (
      <div className="App">
        <h1>البائعين</h1>
        <div className="loading-text">جاري تحميل البائعين...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="App">
        <h1>البائعين</h1>
        <div className="error-state">
          <h3>عذراً!</h3>
          <p>{error}</p>
          <button className="retry-btn" onClick={fetchSellers}>
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <h1>البائعين</h1>
      
      <div className="search-section">
        <input
          type="text"
          className="search-input"
          placeholder="ابحث عن بائع..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredSellers.length === 0 ? (
        <div className="no-results-text">
          لم يتم العثور على بائعين
        </div>
      ) : (
        <div className="sellers-grid">
          {filteredSellers.map((seller) => (
            <div key={seller.id} className="seller-card">
              <img
                src={seller.image}
                alt={seller.name}
                className="seller-image"
              />
              <div className="seller-info">
                <h3 className="seller-name">{seller.name}</h3>
                
                <div className="seller-stats">
                  <div className="stat-item">
                    <div className="stat-value">{seller.productsCount}</div>
                    <div className="stat-label">المنتجات</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value">{seller.salesCount}</div>
                    <div className="stat-label">المبيعات</div>
                  </div>
                </div>

                <div className="seller-rating">
                  <div className="rating-value">{seller.rating}</div>
                  <div className="rating-stars">
                    {renderStars(seller.rating)}
                  </div>
                </div>

                <div className="seller-location">
                  <FaMapMarkerAlt />
                  <span>{seller.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllSellers; 