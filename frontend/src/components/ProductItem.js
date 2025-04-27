// src/components/ProductItem.js

import React from 'react';

function ProductItem({ product }) {
  return (
    <li className="product-item">
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <p>التصنيف: {product.category}</p>
      <p>البائع: {product.seller}</p>
    </li>
  );
}

export default ProductItem;
