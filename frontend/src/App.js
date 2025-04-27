import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import SellerPage from './pages/SellerPage';
import ProductList from './pages/ProductList';
import Navbar from './components/Navbar';
import RegisterSellerPage from './pages/RegisterSellerPage';
import AddProductPage from './pages/AddProductPage';
import AllSellersPage from './pages/AllSellersPage';
import ProductDetails from './pages/ProductDetails';
import EditProduct from './pages/EditProduct';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/all-sellers" element={<AllSellersPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/seller" element={<SellerPage />} />
        <Route path="/register-seller" element={<RegisterSellerPage />} />
        <Route path="/add-product" element={<AddProductPage />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/edit-product/:id" element={<EditProduct />} /> {/* ✅ جديد */}
      </Routes>
    </Router>
  );
}

export default App;
