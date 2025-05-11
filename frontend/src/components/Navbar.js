import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userType = localStorage.getItem('userType');
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  const [profilePic, setProfilePic] = useState('');

  useEffect(() => {
    if (isAuthenticated && userType === 'seller') {
      fetch(`/api/seller-profile/${userId}/`)
        .then(res => res.json())
        .then(data => setProfilePic(data.profile_picture))
        .catch(err => console.log('فشل في جلب الصورة:', err));
    }
  }, [isAuthenticated, userType, userId]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link className="nav-logo" to="/">المنتجات</Link>
        <Link className="nav-link" to="/all-sellers">جميع البائعين</Link>
      </div>
      <div className="navbar-right">
        {!isAuthenticated && (
          <>
            <Link className="nav-link" to="/login">تسجيل الدخول</Link>
            <Link to="/register-seller">تسجيل كبائع</Link>
          </>
        )}

        {isAuthenticated && userType === 'admin' && (
          <>
            <Link className="nav-link" to="/admin">لوحة الأدمن</Link>
            <button className="logout-btn" onClick={handleLogout}>تسجيل الخروج</button>
          </>
        )}

        {isAuthenticated && userType === 'seller' && (
          <>
              <img 
                    src={profilePic} 
                    alt="صورة البائع" 
                    className="seller-avatar"
                    onClick={() => navigate(`/seller-profile-page/${userId}`)}
                    style={{ cursor: 'pointer' }}
              />
            <Link className="nav-link" to="/seller">لوحة البائع</Link>
            <Link className="nav-link" to="/add-product">إضافة منتج</Link>
            <button className="logout-btn" onClick={handleLogout}>تسجيل الخروج</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
