import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminPage() {
  const navigate = useNavigate();
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true); // حالة التحميل
  const [error, setError] = useState(null); // لتخزين الأخطاء

  useEffect(() => {
    if (localStorage.getItem('userType') !== 'admin') {
      navigate('/login');
    } else {
      fetchSellers();
    }
  }, [navigate]);

  const fetchSellers = () => {
    setLoading(true);
    setError(null); // إفراغ أي أخطاء سابقة
    fetch('http://localhost:8000/api/sellers/')
      .then(res => {
        if (!res.ok) throw new Error('فشل في جلب البائعين');
        return res.json();
      })
      .then(data => {
        setSellers(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  const handleDelete = (sellerId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا البائع وجميع منتجاته؟')) {
      fetch(`http://localhost:8000/api/sellers/${sellerId}/`, {
        method: 'DELETE',
      })
      .then(res => {
        if (res.ok) {
          setSellers(prev => prev.filter(s => s.id !== sellerId));
          alert('تم حذف البائع مع جميع منتجاته.');
        } else {
          alert('حدث خطأ أثناء الحذف.');
        }
      })
      .catch(err => {
        alert('فشل في الاتصال بالخادم');
        console.error(err);
      });
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>مرحبا بك في لوحة تحكم الأدمن</h2>
      
      {loading ? (
        <p>جاري تحميل البائعين...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>خطأ: {error}</p>
      ) : (
        <>
          <h3>قائمة البائعين:</h3>
          <ul>
            {sellers.map((seller) => (
              <li key={seller.id} style={{ marginBottom: '10px' }}>
                <strong>{seller.username}</strong> - {seller.email}
                <button
                  onClick={() => handleDelete(seller.id)}
                  style={{ marginLeft: '10px', color: 'white', backgroundColor: 'red', border: 'none', padding: '5px 10px', cursor: 'pointer' }}
                >
                  حذف
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default AdminPage;
