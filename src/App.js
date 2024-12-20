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
          <Route path='/Profile' element={<ProfilePage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;