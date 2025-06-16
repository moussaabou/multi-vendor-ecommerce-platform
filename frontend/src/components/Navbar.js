import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from './photo/logo.png';
import { FaShoppingBag, FaUsers, FaUserPlus, FaSignInAlt, FaSignOutAlt, FaSun, FaMoon, FaUserCircle, FaChevronDown } from 'react-icons/fa';
import { MdDashboard, MdAddCircle, MdLanguage, MdCategory } from 'react-icons/md';

const Navbar = ({ language, setLanguage }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userType = localStorage.getItem('userType');
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  const [profilePic, setProfilePic] = useState('');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showCategoriesMenu, setShowCategoriesMenu] = useState(false);

  // تعيين الثيم على الـ HTML root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // إضافة تأثير التمرير
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

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

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleLanguageMenu = () => {
    setShowLanguageMenu(!showLanguageMenu);
    setShowCategoriesMenu(false);
  };

  const toggleCategoriesMenu = () => {
    setShowCategoriesMenu(!showCategoriesMenu);
    setShowLanguageMenu(false);
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    setShowLanguageMenu(false);
    // هنا يمكنك إضافة منطق تغيير اللغة في التطبيق
  };

  const translations = {
    ar: {
      categories: 'التصنيفات',
      products: 'المنتجات',
      sellers: 'البائعين',
      login: 'تسجيل الدخول',
      registerSeller: 'تسجيل كبائع',
      adminPanel: 'لوحة الأدمن',
      sellerPanel: 'لوحة البائع',
      addProduct: 'إضافة منتج',
      logout: 'تسجيل الخروج',
      darkMode: 'الوضع الليلي',
      lightMode: 'الوضع النهاري',
      arabic: 'العربية',
      english: 'English',
      french: 'Français'
    },
    en: {
      categories: 'Categories',
      products: 'Products',
      sellers: 'Sellers',
      login: 'Login',
      registerSeller: 'Register as Seller',
      adminPanel: 'Admin Panel',
      sellerPanel: 'Seller Panel',
      addProduct: 'Add Product',
      logout: 'Logout',
      darkMode: 'Dark Mode',
      lightMode: 'Light Mode',
      arabic: 'العربية',
      english: 'English',
      french: 'Français'
    },
    fr: {
      categories: 'Catégories',
      products: 'Produits',
      sellers: 'Vendeurs',
      login: 'Connexion',
      registerSeller: 'S\'inscrire comme vendeur',
      adminPanel: 'Panneau Admin',
      sellerPanel: 'Panneau Vendeur',
      addProduct: 'Ajouter un produit',
      logout: 'Déconnexion',
      darkMode: 'Mode sombre',
      lightMode: 'Mode clair',
      arabic: 'العربية',
      english: 'English',
      french: 'Français'
    }
  };

  const t = translations[language];

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-left">
        <Link to="/" className="nav-logo">
          <img 
            src={logo} 
            alt="Logo" 
            className="logo-image"
          />
        </Link>
        <div className="categories-dropdown">
          <button className="categories-toggle" onClick={toggleCategoriesMenu}>
            <MdCategory className="nav-icon" />
            <span>{t.categories}</span>
            <FaChevronDown className={`nav-icon dropdown-icon ${showCategoriesMenu ? 'open' : ''}`} />
          </button>
          {showCategoriesMenu && (
            <div className="categories-menu">
              <Link to="/ProductList" className="category-item" onClick={() => setShowCategoriesMenu(false)}>
                <FaShoppingBag className="nav-icon" />
                <span>{t.products}</span>
              </Link>
              <Link to="/all-sellers" className="category-item" onClick={() => setShowCategoriesMenu(false)}>
                <FaUsers className="nav-icon" />
                <span>{t.sellers}</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      <button className={`hamburger-menu ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu} aria-label="Toggle navigation">
        <span className="hamburger-icon"></span>
        <span className="hamburger-icon"></span>
        <span className="hamburger-icon"></span>
      </button>

      <div className={`navbar-right ${isMenuOpen ? 'open' : ''}`}>
        {!isAuthenticated && (
          <>
            <Link className="nav-link" to="/login" onClick={toggleMenu}>
              <FaSignInAlt className="nav-icon" />
              <span>{t.login}</span>
            </Link>
            <Link className="nav-link" to="/register-seller" onClick={toggleMenu}>
              <FaUserPlus className="nav-icon" />
              <span>{t.registerSeller}</span>
            </Link>
          </>
        )}

        {isAuthenticated && userType === 'admin' && (
          <>
            <Link className="nav-link" to="/admin" onClick={toggleMenu}>
              <MdDashboard className="nav-icon" />
              <span>{t.adminPanel}</span>
            </Link>
            <button className="logout-btn" onClick={() => { handleLogout(); toggleMenu(); }}>
              <FaSignOutAlt className="nav-icon" />
              <span>{t.logout}</span>
            </button>
          </>
        )}

        {isAuthenticated && userType === 'seller' && (
          <>
            {profilePic ? (
              <img 
                src={profilePic} 
                alt="Seller Avatar" 
                className="seller-avatar"
                onClick={() => { navigate(`/seller-profile-page/${userId}`); toggleMenu(); }}
              />
            ) : (
              <FaUserCircle 
                className="seller-avatar-placeholder"
                onClick={() => { navigate(`/seller-profile-page/${userId}`); toggleMenu(); }}
              />
            )}
            <Link className="nav-link" to="/seller" onClick={toggleMenu}>
              <MdDashboard className="nav-icon" />
              <span>{t.sellerPanel}</span>
            </Link>
            <Link className="nav-link" to="/add-product" onClick={toggleMenu}>
              <MdAddCircle className="nav-icon" />
              <span>{t.addProduct}</span>
            </Link>
            <button className="logout-btn" onClick={() => { handleLogout(); toggleMenu(); }}>
              <FaSignOutAlt className="nav-icon" />
              <span>{t.logout}</span>
            </button>
          </>
        )}

        <div className="nav-controls">
          <div className="language-selector">
            <button className="language-toggle" onClick={toggleLanguageMenu}>
              <MdLanguage className="nav-icon" />
              <span>{language === 'ar' ? t.arabic : language === 'en' ? t.english : t.french}</span>
            </button>
            {showLanguageMenu && (
              <div className="language-menu">
                <button onClick={() => changeLanguage('ar')} className={language === 'ar' ? 'active' : ''}>
                  <span>العربية</span>
                </button>
                <button onClick={() => changeLanguage('en')} className={language === 'en' ? 'active' : ''}>
                  <span>English</span>
                </button>
                <button onClick={() => changeLanguage('fr')} className={language === 'fr' ? 'active' : ''}>
                  <span>Français</span>
                </button>
              </div>
            )}
          </div>

          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'light' ? (
              <>
                <FaMoon className="nav-icon" />
                <span>{t.darkMode}</span>
              </>
            ) : (
              <>
                <FaSun className="nav-icon" />
                <span>{t.lightMode}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;