// src/App.js
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ShopListing from './pages/ShopListing';
import ShopDetail from './pages/ShopDetail';
import OrderDetailsScreen from './pages/OrderDetailsScreen';
// import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ShopDetail/>} />
        <Route path="/test" element={<ShopListing />} />
        <Route path='/aa' element={<OrderDetailsScreen />} />
      </Routes>
    </Router>
  );
}

export default App;