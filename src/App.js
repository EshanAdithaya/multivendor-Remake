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
import CategoryPage from './pages/CategoryPage';
import NotFoundPage from './components/NotFoundPage';
import MaintenanceMode from './components/MaintenanceMode';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentCancelPage from './pages/PaymentCancelPage';

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
          <Layout>          <Routes>
              {/* Public routes */}
              <Route path="/signupwildcard" element={<Signup />} />
              <Route path="/loginwildcard" element={<Login />} />
              <Route path="/maintenance" element={<MaintenanceMode />} />
              
              {/* Payment routes (public - Stripe redirects here) */}
              <Route path="/payment/success" element={<PaymentSuccessPage />} />
              <Route path="/payment/cancel" element={<PaymentCancelPage />} />
              
              {/* Protected routes - All other pages require authentication */}
              <Route path="/" element={
                <ProtectedRoute>
                  <LandingPage />
                </ProtectedRoute>
              } />
              <Route path="/productDetails" element={
                <ProtectedRoute>
                  <ProductDetail />
                </ProtectedRoute>
              } />
              <Route path="/shopShow" element={
                <ProtectedRoute>
                  <ShopDetails />
                </ProtectedRoute>
              } />
              <Route path='/offers' element={
                <ProtectedRoute>
                  <PromotionsPage />
                </ProtectedRoute>
              } />
              <Route path='/refund-policy' element={
                <ProtectedRoute>
                  <RefundPolicyPage />
                </ProtectedRoute>
              } />
              <Route path="/contact" element={
                <ProtectedRoute>
                  <ContactPage />
                </ProtectedRoute>
              } />
              <Route path="/manufacturers" element={
                <ProtectedRoute>
                  <ManufacturersPage />
                </ProtectedRoute>
              } />
              <Route path="/authors" element={
                <ProtectedRoute>
                  <AuthorsPage />
                </ProtectedRoute>
              } />
              <Route path="/shops" element={
                <ProtectedRoute>
                  <ShopsList />
                </ProtectedRoute>
              } />
              <Route path='/flash-sale' element={
                <ProtectedRoute>
                  <FlashSalesPage />
                </ProtectedRoute>
              } />
              <Route path='/faq' element={
                <ProtectedRoute>
                  <FAQPage />
                </ProtectedRoute>
              } />
              <Route path='/terms' element={
                <ProtectedRoute>
                  <TermsAndConditionsPage />
                </ProtectedRoute>
              } />
              <Route path='/order-success' element={
                <ProtectedRoute>
                  <OrderSuccess />
                </ProtectedRoute>
              } />              
              
              <Route path='/login-request' element={<TokenExtractor />} />
              <Route path="*" element={<NotFoundPage />} />
              <Route path="protected_route" element={<ProtectedRoute />} />

              <Route path="/category/:categorySlug" element={
                <ProtectedRoute>
                  <CategoryPage />
                </ProtectedRoute>
              } />
              <Route path="/category" element={
                <ProtectedRoute>
                  <CategoryPage />
                </ProtectedRoute>
              } />
           

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
              <Route path="/cart" element={
                <ProtectedRoute>
                  <ShoppingCart />
                </ProtectedRoute>
              } />
              <Route path="*" element={
                <ProtectedRoute>
                  <div>Page not found</div>
                </ProtectedRoute>
              } />
            </Routes>
          </Layout>
        </Router>
      </HeaderServiceProvider>
    </CartProvider>
  );
}

export default App;