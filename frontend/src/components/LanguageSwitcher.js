import React from 'react';
import './LanguageSwitcher.css';

const LanguageSwitcher = ({ currentLanguage, onLanguageChange }) => {
  return (
    <div className="language-switcher">
      <button
        className={`lang-btn ${currentLanguage === 'ar' ? 'active' : ''}`}
        onClick={() => onLanguageChange('ar')}
      >
        العربية
      </button>
      <button
        className={`lang-btn ${currentLanguage === 'en' ? 'active' : ''}`}
        onClick={() => onLanguageChange('en')}
      >
        English
      </button>
    </div>
  );
};

export default LanguageSwitcher; 