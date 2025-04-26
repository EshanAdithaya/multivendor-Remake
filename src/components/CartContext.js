// components/CartContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const API_REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;

const CartContext = createContext();

export const makeAuthenticatedRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const defaultOptions = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': '*/*',
      'Content-Type': 'application/json'
    }
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...(options.headers || {})
    }
  };

  const fullUrl = endpoint.startsWith('http') 
    ? endpoint 
    : `${API_REACT_APP_BASE_URL}${endpoint}`;

  return fetch(fullUrl, mergedOptions);
};

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  // Fetch cart count directly
  const fetchCartCount = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setCartCount(0);
        return;
      }

      // Try to use the webhook endpoint for consistent data
      try {
        const response = await makeAuthenticatedRequest('/api/webhooks/cart');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            // Calculate total quantity across all carts
            const totalItems = data.data.carts.reduce((total, cart) => 
              total + (cart.totalItems || 0), 0);
            setCartCount(totalItems);
          }
        }
      } catch (webhookError) {
        console.warn('Error fetching cart from webhook, falling back to direct API:', webhookError);
        
        // Fallback to direct cart API
        const cartsResponse = await makeAuthenticatedRequest('/api/carts/user');
        if (cartsResponse.ok) {
          const carts = await cartsResponse.json();
          // Calculate total quantity across all carts and their items
          const totalItems = carts.reduce((total, cart) => 
            total + cart.cartItems.reduce((sum, item) => sum + item.quantity, 0), 0);
          setCartCount(totalItems);
        }
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
      setCartCount(0);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchCartCount();
    
    // Set up interval to refresh cart count (every 60 seconds)
    const intervalId = setInterval(fetchCartCount, 60 * 1000);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <CartContext.Provider value={{ 
      cartCount, 
      setCartCount, 
      refreshCart: fetchCartCount,
      makeAuthenticatedRequest 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};