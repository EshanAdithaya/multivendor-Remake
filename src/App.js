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

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<ShopListing />} />
          <Route path="/test" element={<ShopListing />} />
          <Route path="/aa" element={<OrderDetailsScreen />} />
          <Route path="/shop/:id" element={<ShopDetail />} />
          <Route path='/offers' element={<PromotionsPage />} />
          <Route path='/flash-sale' element={<FlashSalesPage />} />
          <Route path='/faq' element={<FAQPage />} />
          <Route path='/refund-policy' element={<RefundPolicyPage />} />
          <Route path='/terms' element={<TermsAndConditionsPage />} />
          

          {/* right side nav bar */}
          <Route path='/Profile' element={<ProfilePage />} />
          <Route path='/my-order' element={<MyOrdersScreen />} />
          <Route path='/my-order' element={<WishlistPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;