import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaWhatsapp, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import './Footer.css';

const Footer = ({ language }) => {
  const currentYear = new Date().getFullYear();

  const translations = {
    ar: {
      description: 'منصة متكاملة لبيع وشراء المنتجات المستعملة بكل سهولة وأمان',
      quickLinks: 'روابط سريعة',
      home: 'الرئيسية',
      sellers: 'البائعين',
      registerSeller: 'تسجيل كبائع',
      login: 'تسجيل الدخول',
      contactUs: 'تواصل معنا',
      newsletter: 'القائمة البريدية',
      newsletterDesc: 'اشترك في النشرة البريدية للحصول على آخر العروض',
      email: 'البريد الإلكتروني',
      subscribe: 'اشتراك',
      rights: 'جميع الحقوق محفوظة',
      privacy: 'سياسة الخصوصية',
      terms: 'الشروط والأحكام',
      about: 'من نحن'
    },
    en: {
      description: 'Your trusted platform for buying and selling used products easily and safely',
      quickLinks: 'Quick Links',
      home: 'Home',
      sellers: 'Sellers',
      registerSeller: 'Register as Seller',
      login: 'Login',
      contactUs: 'Contact Us',
      newsletter: 'Newsletter',
      newsletterDesc: 'Subscribe to our newsletter for the latest offers',
      email: 'Email',
      subscribe: 'Subscribe',
      rights: 'All rights reserved',
      privacy: 'Privacy Policy',
      terms: 'Terms & Conditions',
      about: 'About Us'
    },
    fr: {
      description: 'Votre plateforme de confiance pour acheter et vendre des produits d\'occasion facilement et en toute sécurité',
      quickLinks: 'Liens Rapides',
      home: 'Accueil',
      sellers: 'Vendeurs',
      registerSeller: 'S\'inscrire comme vendeur',
      login: 'Connexion',
      contactUs: 'Contactez-nous',
      newsletter: 'Newsletter',
      newsletterDesc: 'Abonnez-vous à notre newsletter pour les dernières offres',
      email: 'Email',
      subscribe: 'S\'abonner',
      rights: 'Tous droits réservés',
      privacy: 'Politique de confidentialité',
      terms: 'Conditions générales',
      about: 'À propos'
    }
  };

  const t = translations[language];

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>USEDSHOP</h3>
          <p>{t.description}</p>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a>
            <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer">
              <FaWhatsapp />
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h4>{t.quickLinks}</h4>
          <ul>
            <li><Link to="/">{t.home}</Link></li>
            <li><Link to="/all-sellers">{t.sellers}</Link></li>
            <li><Link to="/register-seller">{t.registerSeller}</Link></li>
            <li><Link to="/login">{t.login}</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>{t.contactUs}</h4>
          <ul className="contact-info">
            <li>
              <FaPhone />
              <span>+213 123 456 789</span>
            </li>
            <li>
              <FaEnvelope />
              <span>info@usedshop.com</span>
            </li>
            <li>
              <FaMapMarkerAlt />
              <span>Algérie</span>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>{t.newsletter}</h4>
          <p>{t.newsletterDesc}</p>
          <form className="newsletter-form">
            <input type="email" placeholder={t.email} />
            <button type="submit">{t.subscribe}</button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} USEDSHOP - {t.rights}</p>
        <div className="footer-links">
          <Link to="/privacy">{t.privacy}</Link>
          <Link to="/terms">{t.terms}</Link>
          <Link to="/about">{t.about}</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 