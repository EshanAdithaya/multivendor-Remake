// src/App.js
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OrderDetailsScreen from './pages/OrderDetailsScreen';
import Layout from './components/Layout';
import PromotionsPage from './pages/PromotionsPage';
import FlashSalesPage from './pages/FlashSalesPage';
import FAQPage from './pages/FAQPage';
import RefundPolicyPage from './pages/RefundPolicyPage';
import TermsAndConditionsPage from './pages/TermsAndConditionsPage';
import ProfilePage from './pages/ProfilePage';
import MyOrdersScreen from './pages/MyOrdersScreen';
import WishlistPage from './pages/WishlistPage';
import ContactPage from './pages/ContactPage';
import ManufacturersPage from './pages/ManufacturersPage';
import AuthorsPage from './pages/AuthorsPage';
import RefundsScreen from './pages/RefundsScreen';
import ProductDetail from './pages/ProductDetail';
import PasswordChangeScreen from './pages/dashboard/PasswordChangeScreen';
import MyCardScreen from './pages/dashboard/MyCardsScreen';
import QuestionsPage from './pages/QuestionsPage';
import CheckoutPage from './pages/CheckoutPage';
import LandingPage from './pages/LandingPage';
import ShopsList from './pages/ShopsList';
import Signup from './Signup';
import Login from './Login';
import ShopDetails from './pages/ShopDetails';
import AddressManagement from './pages/AddressManagement';
import ProtectedRoute from './components/ProtectedRoute';
import ShoppingCart from './pages/ShoppingCart';
import OrderSuccess from './components/OrderSuccess';
import { HeaderServiceProvider } from './components/HeaderService';
import { CartProvider } from './components/CartContext';
import TokenExtractor from './pages/TokenExtractor';

/**
 * Main App component with proper provider nesting
 * HeaderServiceProvider needs to be outside Router but inside CartProvider
 * to ensure proper service communication
 */
function App() {
  return (
    <CartProvider>
      <HeaderServiceProvider>
        <Router>
          <Layout>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/productDetails" element={<ProductDetail />} />
              <Route path="/shopShow" element={<ShopDetails />} />
              <Route path='/offers' element={<PromotionsPage />} />
              <Route path='/refund-policy' element={<RefundPolicyPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/manufacturers" element={<ManufacturersPage />} />
              <Route path="/authors" element={<AuthorsPage />} />
              <Route path="/shops" element={<ShopsList />} />
              <Route path='/flash-sale' element={<FlashSalesPage />} />
              <Route path='/faq' element={<FAQPage />} />
              <Route path='/terms' element={<TermsAndConditionsPage />} />
              <Route path='/order-success' element={<OrderSuccess />} />
              <Route path='/login-request' element={<TokenExtractor />} />
           

              {/* Protected routes (right side nav bar) */}
              <Route path='/Profile' element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              <Route path='/my-order' element={
                <ProtectedRoute>
                  <MyOrdersScreen />
                </ProtectedRoute>
              } />
              <Route path='/wishlists' element={
                <ProtectedRoute>
                  <WishlistPage />
                </ProtectedRoute>
              } />
              <Route path='/change-password' element={
                <ProtectedRoute>
                  <PasswordChangeScreen />
                </ProtectedRoute>
              } />
              <Route path='/cards' element={
                <ProtectedRoute>
                  <MyCardScreen />
                </ProtectedRoute>
              } />
              
              <Route path='/questions' element={
                <ProtectedRoute>
                  <QuestionsPage />
                </ProtectedRoute>
              } />
              <Route path='/checkout' element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              } />
              <Route path="/refunds" element={
                <ProtectedRoute>
                  <RefundsScreen />
                </ProtectedRoute>
              } />
              
              <Route path="/address" element={
                <ProtectedRoute>
                  <AddressManagement />
                </ProtectedRoute>
              } />
              <Route path="/order-details" element={
                <ProtectedRoute>
                  <OrderDetailsScreen />
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<div>Page not found</div>} />
            </Routes>
          </Layout>
        </Router>
      </HeaderServiceProvider>
    </CartProvider>
  );
}

export default App;