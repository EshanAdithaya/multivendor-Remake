// src/App.js
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ShopListing from './pages/ShopListing';
import ShopDetail from './pages/ShopDetail';
import OrderDetailsScreen from './pages/OrderDetailsScreen';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<ShopListing />} />
          <Route path="/test" element={<ShopListing />} />
          <Route path="/aa" element={<OrderDetailsScreen />} />
          <Route path="/shop/:id" element={<ShopDetail />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;