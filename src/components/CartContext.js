import React, { createContext, useContext, useEffect, useState } from 'react';

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

  return fetch(`${API_REACT_APP_BASE_URL}${endpoint}`, mergedOptions);
};

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          setCartCount(0);
          return;
        }

        try {
          const response = await makeAuthenticatedRequest('/api/carts/user');
          
          if (response.ok) {
            const carts = await response.json();
            // Calculate total quantity across all carts and their items
            const totalItems = carts.reduce((total, cart) => 
              total + cart.cartItems.reduce((sum, item) => sum + item.quantity, 0), 
            0);
            setCartCount(totalItems);
          } else {
            setCartCount(0);
          }
        } catch (error) {
          console.error('Error fetching cart items:', error);
          setCartCount(0);
        }
      } catch (error) {
        console.error('Error fetching cart items:', error);
        setCartCount(0);
      }
    };

    // Execute fetchCartCount only once when component mounts
    fetchCartCount();
    
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <CartContext.Provider value={{ cartCount, makeAuthenticatedRequest }}>
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





// import React, { createContext, useContext, useEffect, useState } from 'react';

// const API_REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
// const CART_POLLING_INTERVAL = 2000; // 2 seconds

// const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//   const [cartCount, setCartCount] = useState(0);

//   useEffect(() => {
//     const fetchCartCount = async () => {
//       try {
//         const token = localStorage.getItem('accessToken');
//         if (!token) {
//           setCartCount(0);
//           return;
//         }

//         const response = await fetch(${API_REACT_APP_BASE_URL}/api/carts/user, {
//           headers: {
//             'Authorization': Bearer ${token},
//             'Accept': '/'
//           }
//         });

//         if (response.ok) {
//           const carts = await response.json();
//           // Calculate total quantity across all carts and their items
//           const totalItems = carts.reduce((total, cart) => 
//             total + cart.cartItems.reduce((sum, item) => sum + item.quantity, 0), 
//           0);
//           setCartCount(totalItems);
//         } else {
//           setCartCount(0);
//         }
//       } catch (error) {
//         console.error('Error fetching cart items:', error);
//         setCartCount(0);
//       }
//     };

//     // Initial fetch
//     fetchCartCount();

//     // Set up polling interval
//     const intervalId = setInterval(fetchCartCount, CART_POLLING_INTERVAL);

//     // Cleanup on unmount
//     return () => clearInterval(intervalId);
//   }, []);

//   return (
//     <CartContext.Provider value={{ cartCount }}>
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return context;
// };



