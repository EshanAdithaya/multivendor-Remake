// src/App.js
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ShopListing from './pages/ShopListing';
import ShopDetail from './pages/ShopDetail';
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
import ShopsPage from './pages/ShopsPage';
import ManufacturersPage from './pages/ManufacturersPage';
import AuthorsPage from './pages/AuthorsPage';
import ReportsScreen from './pages/ReportsScreen';
import RefundsScreen from './pages/RefundsScreen';
import PasswordChangeScreen from './pages/dashboard/PasswordChangeScreen';
import MyCardScreen from './pages/dashboard/MyCardsScreen';
import QuestionsPage from './pages/QuestionsPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          
          
          <Route path="/" element={<ShopListing />} />
          <Route path="/test" element={<ShopListing />} />
          <Route path="/aa" element={<OrderDetailsScreen />} />
          <Route path="/shops" element={<ShopDetail />} />
          <Route path='/offers' element={<PromotionsPage />} />
          <Route path='/flash-sale' element={<FlashSalesPage />} />
          <Route path='/faq' element={<FAQPage />} />
          <Route path='/refund-policy' element={<RefundPolicyPage />} />
          <Route path='/terms' element={<TermsAndConditionsPage />} />
          
          {/* left side nav bar ? */}
          <Route path="/contact" element={<ContactPage />} />
          {/* <Route path="/shops" element={<ShopsPage />} /> */}
          <Route path="/manufacturers" element={<ManufacturersPage />} />
          <Route path="/authors" element={<AuthorsPage />} />
          <Route path="/reports" element={<ReportsScreen />} />
          <Route path="/refunds" element={<RefundsScreen />} />
          

          {/* right side nav bar */}
          <Route path='/Profile' element={<ProfilePage />} />
          <Route path='/my-order' element={<MyOrdersScreen />} />
          <Route path='/wishlists' element={<WishlistPage />} />
          <Route path='/change-password' element={<PasswordChangeScreen />} />
          <Route path='/cards' element={<MyCardScreen />} />
          <Route path='/questions' element={<QuestionsPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;