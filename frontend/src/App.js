import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import SellerPage from './pages/SellerPage';
import ProductList from './pages/ProductList';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import RegisterSellerPage from './pages/RegisterSellerPage';
import AddProductPage from './pages/AddProductPage';
import AllSellersPage from './pages/AllSellersPage';
import ProductDetails from './pages/ProductDetails';
import EditProduct from './pages/EditProduct';
import SellerProductsPage from './pages/SellerProductsPage';
import SellerProfilePage from './pages/SellerProfilePage';
import ProductFilterPage from './pages/ProductFilterPage';
import Homepage from './pages/Homepage';

function App() {
  const [language, setLanguage] = React.useState(localStorage.getItem('language') || 'ar');

  return (
    <Router>
      <div className="app">
        <Navbar language={language} setLanguage={setLanguage} />
        <main className="main-content">
          <Routes>
            {/* -------------------- صفحات عامة (زائر) -------------------- */}
            <Route path="/" element={<Homepage language={language} setLanguage={setLanguage} />} />
            <Route path="/ProductList" element={<ProductList language={language} />} />
            <Route path="/login" element={<LoginPage language={language} />} />
            <Route path="/register-seller" element={<RegisterSellerPage language={language} />} />
            <Route path="/all-sellers" element={<AllSellersPage language={language} />} />
            <Route path="/product/:id" element={<ProductDetails language={language} />} />
            <Route path="/seller-products/:sellerId" element={<SellerProductsPage language={language} />} />
            <Route path="/filter-products" element={<ProductFilterPage language={language} />} />

            {/* -------------------- صفحات البائع -------------------- */}
            <Route path="/seller" element={<SellerPage language={language} />} />
            <Route path="/add-product" element={<AddProductPage language={language} />} />
            <Route path="/edit-product/:id" element={<EditProduct language={language} />} />
            <Route path="/seller-profile-page/:id" element={<SellerProfilePage language={language} />} />

            {/* -------------------- صفحات الأدمن -------------------- */}
            <Route path="/admin" element={<AdminPage language={language} />} />
          </Routes>
        </main>
        <Footer language={language} />
      </div>
    </Router>
  );
}

export default App;
