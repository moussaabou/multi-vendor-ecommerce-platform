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
import SellerProductsPage from './pages/SellerProductsPage'; // أعلى الملف


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>

        {/* -------------------- صفحات عامة (زائر) -------------------- */}
        <Route path="/" element={<ProductList />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register-seller" element={<RegisterSellerPage />} />
        <Route path="/all-sellers" element={<AllSellersPage />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/seller-products/:sellerId" element={<SellerProductsPage />} />

        {/* -------------------- صفحات البائع -------------------- */}
        <Route path="/seller" element={<SellerPage />} />
        <Route path="/add-product" element={<AddProductPage />} />
        <Route path="/edit-product/:id" element={<EditProduct />} />

        {/* -------------------- صفحات الأدمن -------------------- */}
        <Route path="/admin" element={<AdminPage />} />

      </Routes>
      </Router>
  );
}

export default App;
