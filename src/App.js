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
import CheckoutPage from './pages/CheckoutPage';
import LandingPage from './pages/LandingPage';
import ShopsList from './pages/ShopsList';
import Signup from './Signup';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          
          
          {/* <Route path="/" element={<LandingPage />} /> */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/test" element={<ShopListing />} />
          <Route path="/aa" element={<OrderDetailsScreen />} />
          
          <Route path='/offers' element={<PromotionsPage />} />
          
          
          <Route path='/refund-policy' element={<RefundPolicyPage />} />
          
          
          {/* left side nav bar ? */}
          <Route path="/contact" element={<ContactPage />} />
          {/* <Route path="/shops" element={<ShopsPage />} /> */}
          <Route path="/manufacturers" element={<ManufacturersPage />} />
          <Route path="/authors" element={<AuthorsPage />} />
          <Route path="/shops" element={<ShopsList />} />
          {/* <Route path="/shops" element={<ShopDetail />} /> */}
          <Route path='/flash-sale' element={<FlashSalesPage />} />
          <Route path='/faq' element={<FAQPage />} />
          <Route path='/terms' element={<TermsAndConditionsPage />} />
          

          {/* right side nav bar */}
          <Route path='/Profile' element={<ProfilePage />} />
          <Route path='/my-order' element={<MyOrdersScreen />} />
          <Route path='/wishlists' element={<WishlistPage />} />
          <Route path='/change-password' element={<PasswordChangeScreen />} />
          <Route path='/cards' element={<MyCardScreen />} />
          <Route path='/questions' element={<QuestionsPage />} />
          <Route path='/checkout' element={<CheckoutPage />} />
          <Route path="/refunds" element={<RefundsScreen />} />
          <Route path="/reports" element={<ReportsScreen />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;