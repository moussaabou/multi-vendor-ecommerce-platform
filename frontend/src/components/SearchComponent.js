// src/components/SearchComponent.js
import React from 'react';
import './SearchComponent.css';


function SearchComponent({ searchTerm, setSearchTerm }) {
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="🔍 ابحث بالاسم أو البريد..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-input"
      />
    </div>
  );
}

export default SearchComponent;
