import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import './LoginPage.css';

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    fetch('/api/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => {
        setLoading(false);
        if (!res.ok) throw new Error('فشل تسجيل الدخول');
        return res.json();
      })
      .then((data) => {
        if (data.role === 'admin' || data.role === 'seller') {
          // تخزين معلومات الدخول
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('userType', data.role);
          localStorage.setItem('userId', data.id);

          // إن كان بائعًا، خزّن معلوماته بالكامل
          if (data.role === 'seller') {
            localStorage.setItem('sellerData', JSON.stringify({
              name: data.name,
              surname: data.surname,
              phone_number: data.phone_number,
              email: data.email,
              address: data.address,
              birth_date: data.birth_date,
              profile_picture: data.profile_picture,
            }));
          }

          // التوجيه حسب نوع المستخدم
          navigate(data.role === 'admin' ? '/admin' : '/seller');
        } else {
          setError('مستخدم غير معروف');
        }
      })
      .catch((error) => {
        setLoading(false);
        setError('معلومات الدخول غير صحيحة');
        console.error(error);
      });
  };

  return (
    <div className="login-container">
      <h2>تسجيل الدخول</h2>
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <input
            type="email"
            placeholder="الإيميل"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="input-icon">
            <FaEnvelope />
          </div>
        </div>
        
        <div className="input-group">
          <input
            type="password"
            placeholder="كلمة المرور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="input-icon">
            <FaLock />
          </div>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'جاري تسجيل الدخول...' : 'دخول'}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default LoginPage;
