import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from './photo/logo.png';

const Navbar = () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userType = localStorage.getItem('userType');
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  const [profilePic, setProfilePic] = useState('');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [isMenuOpen, setIsMenuOpen] = useState(false); // حالة لفتح/إغلاق قائمة الهامبرغر

  // تعيين الثيم على الـ HTML root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // جلب صورة البائع إذا كان مسجلًا
  useEffect(() => {
    if (isAuthenticated && userType === 'seller') {
      fetch(`/api/seller-profile/${userId}/`)
        .then(res => res.json())
        .then(data => {
          if (data.profile_picture) {
            setProfilePic(data.profile_picture);
          }
        })
        .catch(err => console.log('فشل في جلب الصورة:', err));
    }
  }, [isAuthenticated, userType, userId]);

  // تسجيل الخروج
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // تبديل الثيم
  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // تبديل حالة قائمة الهامبرغر
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      {/* الجهة اليسرى */}
      <div className="navbar-left">
        <Link to="/" className="nav-logo">
          <img 
            src={logo} 
            alt="الشعار" 
            className="logo-image"
          />
        </Link>
        <Link className="nav-link hide-on-mobile" to="/">المنتجات</Link>
        <Link className="nav-link hide-on-mobile" to="/all-sellers">جميع البائعين</Link>
      </div>

      {/* زر قائمة الهامبرغر (يظهر على الشاشات الصغيرة فقط) */}
      <button className="hamburger-menu" onClick={toggleMenu} aria-label="Toggle navigation">
        <span className="hamburger-icon"></span>
        <span className="hamburger-icon"></span>
        <span className="hamburger-icon"></span>
      </button>

      {/* الجهة اليمنى والقائمة المنسدلة */}
      <div className={`navbar-right ${isMenuOpen ? 'open' : ''}`}>
        {/* الروابط التي تظهر في القائمة المنسدلة على الجوال */}
        <Link className="nav-link show-on-mobile" to="/" onClick={toggleMenu}>المنتجات</Link>
        <Link className="nav-link show-on-mobile" to="/all-sellers" onClick={toggleMenu}>جميع البائعين</Link>

        {/* المستخدم غير مسجل */}
        {!isAuthenticated && (
          <>
            <Link className="nav-link" to="/login" onClick={toggleMenu}>تسجيل الدخول</Link>
            <Link className="nav-link" to="/register-seller" onClick={toggleMenu}>تسجيل كبائع</Link>
          </>
        )}
        {/* الأدمن */}
        {isAuthenticated && userType === 'admin' && (
          <>
            <Link className="nav-link" to="/admin" onClick={toggleMenu}>لوحة الأدمن</Link>
            <button className="logout-btn" onClick={() => { handleLogout(); toggleMenu(); }}>تسجيل الخروج</button>
          </>
        )}

        {/* البائع */}
        {isAuthenticated && userType === 'seller' && (
          <>
            {profilePic && (
              <img 
                src={profilePic} 
                alt="صورة البائع" 
                className="seller-avatar"
                onClick={() => { navigate(`/seller-profile-page/${userId}`); toggleMenu(); }}
                style={{ cursor: 'pointer' }}
              />
            )}
            <Link className="nav-link" to="/seller" onClick={toggleMenu}>لوحة البائع</Link>
            <Link className="nav-link" to="/add-product" onClick={toggleMenu}>إضافة منتج</Link>
            <button className="logout-btn" onClick={() => { handleLogout(); toggleMenu(); }}>تسجيل الخروج</button>
          </>
        )}
        {/* زر تغيير الوضع */}
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? 'الوضع الليلي 🌙' : 'الوضع النهاري ☀️'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;