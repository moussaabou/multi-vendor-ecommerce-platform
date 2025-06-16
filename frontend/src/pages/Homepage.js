import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCar, FaMobileAlt, FaLaptop, FaTools, FaArrowRight, FaSearch, FaUserPlus, FaStar, FaShieldAlt, FaTruck, FaHeadset, FaShoppingBag } from 'react-icons/fa';
import './Homepage.css';

const Homepage = ({ language, setLanguage }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    console.log('Homepage mounted');
    setIsVisible(true);
  }, []);

  const handleImageError = () => {
    console.log('Image failed to load');
    setImageError(true);
  };

  const translations = {
    ar: {
      welcome: 'مرحباً بك في USEDSHOP',
      subtitle: 'منصة متكاملة لبيع وشراء المنتجات المستعملة في الجزائر',
      registerSeller: 'سجل كبائع',
      browseProducts: 'تصفح المنتجات',
      categories: 'تصفح حسب الفئة',
      cars: 'السيارات',
      carsDesc: 'سيارات مستعملة بأسعار منافسة',
      phones: 'الهواتف',
      phonesDesc: 'هواتف ذكية وأجهزة محمولة',
      computers: 'الحواسيب',
      computersDesc: 'حواسيب محمولة وطاولة',
      spareParts: 'قطع الغيار',
      sparePartsDesc: 'قطع غيار سيارات وإلكترونيات',
      whyChoose: 'لماذا تختار USEDSHOP؟',
      secure: 'آمن وموثوق',
      secureDesc: 'جميع البائعين موثقين ومراجعة المنتجات قبل البيع',
      prices: 'أسعار منافسة',
      pricesDesc: 'أفضل الأسعار في السوق مع إمكانية المساومة',
      delivery: 'توصيل سريع',
      deliveryDesc: 'خدمة توصيل لجميع أنحاء الجزائر',
      support: 'دعم متواصل',
      supportDesc: 'فريق الدعم متاح على مدار الساعة',
      startSelling: 'ابدأ بيع منتجاتك المستعملة اليوم',
      startSellingDesc: 'سجل كبائع وابدأ في عرض منتجاتك للبيع بكل سهولة',
      registerNow: 'سجل الآن'
    },
    en: {
      welcome: 'Welcome to USEDSHOP',
      subtitle: 'Your trusted platform for buying and selling used products in Algeria',
      registerSeller: 'Register as Seller',
      browseProducts: 'Browse Products',
      categories: 'Browse by Category',
      cars: 'Cars',
      carsDesc: 'Used cars at competitive prices',
      phones: 'Phones',
      phonesDesc: 'Smartphones and mobile devices',
      computers: 'Computers',
      computersDesc: 'Laptops and desktops',
      spareParts: 'Spare Parts',
      sparePartsDesc: 'Car and electronics spare parts',
      whyChoose: 'Why Choose USEDSHOP?',
      secure: 'Secure & Reliable',
      secureDesc: 'All sellers are verified and products are inspected',
      prices: 'Competitive Prices',
      pricesDesc: 'Best market prices with room for negotiation',
      delivery: 'Fast Delivery',
      deliveryDesc: 'Delivery service across Algeria',
      support: '24/7 Support',
      supportDesc: 'Our support team is always available',
      startSelling: 'Start Selling Your Used Products Today',
      startSellingDesc: 'Register as a seller and start listing your products easily',
      registerNow: 'Register Now'
    },
    fr: {
      welcome: 'Bienvenue sur USEDSHOP',
      subtitle: 'Votre plateforme de confiance pour acheter et vendre des produits d\'occasion en Algérie',
      registerSeller: 'S\'inscrire comme vendeur',
      browseProducts: 'Parcourir les produits',
      categories: 'Parcourir par catégorie',
      cars: 'Voitures',
      carsDesc: 'Voitures d\'occasion à prix compétitifs',
      phones: 'Téléphones',
      phonesDesc: 'Smartphones et appareils mobiles',
      computers: 'Ordinateurs',
      computersDesc: 'Ordinateurs portables et de bureau',
      spareParts: 'Pièces détachées',
      sparePartsDesc: 'Pièces détachées pour voitures et électronique',
      whyChoose: 'Pourquoi choisir USEDSHOP?',
      secure: 'Sécurisé & Fiable',
      secureDesc: 'Tous les vendeurs sont vérifiés et les produits sont inspectés',
      prices: 'Prix compétitifs',
      pricesDesc: 'Meilleurs prix du marché avec possibilité de négociation',
      delivery: 'Livraison rapide',
      deliveryDesc: 'Service de livraison dans toute l\'Algérie',
      support: 'Support 24/7',
      supportDesc: 'Notre équipe de support est toujours disponible',
      startSelling: 'Commencez à vendre vos produits d\'occasion aujourd\'hui',
      startSellingDesc: 'Inscrivez-vous comme vendeur et commencez à lister vos produits facilement',
      registerNow: 'S\'inscrire maintenant'
    }
  };

  const t = translations[language];

  console.log('Current language:', language);
  console.log('Is visible:', isVisible);

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className={`hero ${isVisible ? 'visible' : ''}`}>
        <div className="hero-content">
          <h1>{t.welcome}</h1>
          <p>{t.subtitle}</p>
          <div className="hero-buttons">
            <Link to="/register-seller" className="btn btn-primary">
              <FaUserPlus /> {t.registerSeller}
            </Link>
            <Link to="/ProductList" className="btn btn-secondary">
              <FaSearch /> {t.browseProducts}
            </Link>
          </div>
        </div>
        <div className="hero-image">
          {!imageError ? (
            <img 
              src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
              alt="USEDSHOP - Online Marketplace"
              onError={handleImageError}
            />
          ) : (
            <div className="hero-image-placeholder">
              <FaShoppingBag size={100} />
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className={`categories ${isVisible ? 'visible' : ''}`}>
        <h2>{t.categories}</h2>
        <div className="categories-grid">
          <div className="category-card">
            <FaCar className="category-icon" />
            <h3>{t.cars}</h3>
            <p>{t.carsDesc}</p>
            <Link to="/ProductList?category=cars" className="category-link">
              {t.browseProducts} <FaArrowRight />
            </Link>
          </div>
          <div className="category-card">
            <FaMobileAlt className="category-icon" />
            <h3>{t.phones}</h3>
            <p>{t.phonesDesc}</p>
            <Link to="/ProductList?category=phones" className="category-link">
              {t.browseProducts} <FaArrowRight />
            </Link>
          </div>
          <div className="category-card">
            <FaLaptop className="category-icon" />
            <h3>{t.computers}</h3>
            <p>{t.computersDesc}</p>
            <Link to="/ProductList?category=computers" className="category-link">
              {t.browseProducts} <FaArrowRight />
            </Link>
          </div>
          <div className="category-card">
            <FaTools className="category-icon" />
            <h3>{t.spareParts}</h3>
            <p>{t.sparePartsDesc}</p>
            <Link to="/ProductList?category=spare-parts" className="category-link">
              {t.browseProducts} <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`features ${isVisible ? 'visible' : ''}`}>
        <h2>{t.whyChoose}</h2>
        <div className="features-grid">
          <div className="feature-card">
            <FaShieldAlt className="feature-icon" />
            <h3>{t.secure}</h3>
            <p>{t.secureDesc}</p>
          </div>
          <div className="feature-card">
            <FaStar className="feature-icon" />
            <h3>{t.prices}</h3>
            <p>{t.pricesDesc}</p>
          </div>
          <div className="feature-card">
            <FaTruck className="feature-icon" />
            <h3>{t.delivery}</h3>
            <p>{t.deliveryDesc}</p>
          </div>
          <div className="feature-card">
            <FaHeadset className="feature-icon" />
            <h3>{t.support}</h3>
            <p>{t.supportDesc}</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`cta ${isVisible ? 'visible' : ''}`}>
        <div className="cta-content">
          <h2>{t.startSelling}</h2>
          <p>{t.startSellingDesc}</p>
          <Link to="/register-seller" className="btn btn-primary">
            {t.registerNow} <FaArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
