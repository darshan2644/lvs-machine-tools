import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthContextProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import CategoriesPage from './pages/CategoriesPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CNC9AxisPage from './pages/CNC9AxisPage';
import BangleCNCPage from './pages/BangleCNCPage';
import CNCBangleCuttingPage from './pages/CNCBangleCuttingPage';
import CNCBangleFlatHalfRoundPage from './pages/CNCBangleFlatHalfRoundPage';
import CNCBangleMR5Page from './pages/CNCBangleMR5Page';
import BangleCuttingSemiAutoPage from './pages/BangleCuttingSemiAutoPage';
import CNCBangleCategoryPage from './pages/CNCBangleCategoryPage';
import ShoppingCartDemo from './pages/ShoppingCartDemo';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import CartPage from './pages/CartPage';
import MyOrdersPage from './pages/MyOrdersPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import QualityPage from './pages/QualityPage';
import InquiryPage from './pages/InquiryPage';
import EmailTestPage from './pages/EmailTestPage';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <AuthContextProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/cnc-9axis-machine" element={<CNC9AxisPage />} />
              <Route path="/bangle-cnc-cutting-machine" element={<BangleCNCPage />} />
              <Route path="/cnc-bangle-cutting-machine" element={<CNCBangleCuttingPage />} />
              <Route path="/cnc-bangle-flat-half-round" element={<CNCBangleFlatHalfRoundPage />} />
              <Route path="/cnc-bangle-mr5" element={<CNCBangleMR5Page />} />
              <Route path="/bangle-cutting-semi-auto" element={<BangleCuttingSemiAutoPage />} />
              <Route path="/cnc-bangle-category" element={<CNCBangleCategoryPage />} />
              <Route path="/cart-demo" element={<ShoppingCartDemo />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/my-orders" element={<MyOrdersPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/quality" element={<QualityPage />} />
              <Route path="/inquiry" element={<InquiryPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/email-test" element={<EmailTestPage />} />
              {/* Add more routes here later */}
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthContextProvider>
  );
}

export default App;
