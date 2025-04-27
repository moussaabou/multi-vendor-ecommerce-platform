import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // حالة التحميل
  const [error, setError] = useState(''); // لتخزين رسائل الخطأ

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);  // تفعيل حالة التحميل
    setError(''); // إفراغ رسالة الخطأ عند محاولة تسجيل الدخول جديدة

    fetch('/api/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => {
        setLoading(false);  // إيقاف حالة التحميل
        if (!res.ok) throw new Error('فشل تسجيل الدخول');
        return res.json();
      })
      .then((data) => {
        if (data.role === 'admin' || data.role === 'seller') {
          // تخزين معلومات الدخول
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('userType', data.role);
          localStorage.setItem('userId', data.id); // تأكد أن الـ API ترجع id

          // توجيه حسب نوع المستخدم
          navigate(data.role === 'admin' ? '/admin' : '/seller');
        } else {
          setError('مستخدم غير معروف');
        }
      })
      .catch((error) => {
        setError('معلومات الدخول غير صحيحة');
        console.error(error);
      });
  };

  return (
    <div className="login-container">
      <h2>تسجيل الدخول</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="الإيميل"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'جاري تسجيل الدخول...' : 'دخول'}
        </button>
      </form>
      
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default LoginPage;
