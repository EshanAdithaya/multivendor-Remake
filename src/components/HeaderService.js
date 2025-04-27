// components/HeaderService.js
import React, { useState, useEffect, useContext, createContext } from 'react';
import HeaderDropdown from './HeaderDropdown';
import { useCart, makeAuthenticatedRequest } from './CartContext';

// Create a context for the header service
const HeaderServiceContext = createContext(null);

// Provider component for HeaderService
export const HeaderServiceProvider = ({ children }) => {
  const headerService = HeaderService();
  
  return (
    <HeaderServiceContext.Provider value={headerService}>
      {children}
    </HeaderServiceContext.Provider>
  );
};

// Custom hook to use the header service
export const useHeaderService = () => {
  const context = useContext(HeaderServiceContext);
  if (!context) {
    throw new Error('useHeaderService must be used within HeaderServiceProvider');
  }
  return context;
};

// HeaderService handles fetching counts for addresses, wishlist, orders, and cart
const HeaderService = () => {
  const { cartCount } = useCart(); // Get cart count from CartContext
  const [counts, setCounts] = useState({
    wishlist: 0,
    orders: 0,
    cart: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Sync cart count from CartContext
  useEffect(() => {
    setCounts(prev => ({
      ...prev,
      cart: cartCount
    }));
  }, [cartCount]);
  
  // Cache for webhook data to avoid unnecessary re-fetching
  const [webhookCache, setWebhookCache] = useState({
    wishlist: null,
    orders: null,
    lastFetched: null
  });

  // Fetch wishlist and orders counts from respective webhooks
  const fetchCounts = async () => {
    setLoading(true);
    
    try {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        setCounts(prev => ({
          ...prev,
          wishlist: 0,
          orders: 0
        }));
        setLoading(false);
        return;
      }
      
      // Check if we should use cached data (less than 30 seconds old)
      const now = Date.now();
      const cacheAge = webhookCache.lastFetched ? now - webhookCache.lastFetched : Infinity;
      const useCachedData = cacheAge < 30 * 1000; // 30 seconds in milliseconds
      
      if (useCachedData && webhookCache.wishlist && webhookCache.orders) {
        // Use cached counts
        setCounts(prev => ({
          ...prev,
          // Fix: Safely access nested properties with optional chaining and nullish coalescing
          wishlist: webhookCache.wishlist?.data?.wishlistCount || 0,
          orders: webhookCache.orders?.data?.orderCount || 0
        }));
        setLoading(false);
        return;
      }
      
      // Fetch wishlist and orders data in parallel
      try {
        const [wishlistResponse, ordersResponse] = await Promise.all([
          makeAuthenticatedRequest('/api/webhooks/wishlist'),
          makeAuthenticatedRequest('/api/webhooks/orders')
        ]);
        
        const wishlistData = await wishlistResponse.json();
        const ordersData = await ordersResponse.json();
        
        // Update cache
        setWebhookCache({
          wishlist: wishlistData,
          orders: ordersData,
          lastFetched: now
        });
        
        // Extract counts from webhook data
        // Fix: Safely access nested properties
        const wishlistCount = wishlistData?.data?.wishlistCount || 0;
        const ordersCount = ordersData?.data?.orderCount || 0;
        
        setCounts(prev => ({
          ...prev,
          wishlist: wishlistCount,
          orders: ordersCount
        }));
      } catch (apiError) {
        console.error('API error fetching counts:', apiError);
        // Keep the existing counts on error
      }
    } catch (error) {
      console.error('Error fetching counts:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Force refresh a specific count type (wishlist, orders)
  const refreshCount = async (type) => {
    if (!type || !['wishlist', 'orders'].includes(type)) {
      console.warn('Invalid count type to refresh');
      return;
    }
    
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;
      
      const response = await makeAuthenticatedRequest(`/api/webhooks/${type}`);
      const data = await response.json();
      
      // Update the specific cache item
      setWebhookCache(prev => ({
        ...prev,
        [type]: data,
        lastFetched: Date.now()
      }));
      
      // Update the specific count based on type
      if (type === 'wishlist') {
        setCounts(prev => ({
          ...prev,
          // Fix: Safely access nested properties
          wishlist: data?.data?.wishlistCount || 0
        }));
      } else if (type === 'orders') {
        setCounts(prev => ({
          ...prev,
          // Fix: Safely access nested properties
          orders: data?.data?.orderCount || 0
        }));
      }
    } catch (error) {
      console.error(`Error refreshing ${type} count:`, error);
    }
  };

  // Effect to fetch counts on mount
  useEffect(() => {
    fetchCounts();
    
    // Setup interval to refresh counts periodically (every 60 seconds)
    const intervalId = setInterval(fetchCounts, 60 * 1000);
    
    // Clear interval on unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures this only runs once on mount

  // Get data for a specific type using webhook endpoint
  const getWebhookData = async (type) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      if (!token) return null;
      
      // Check if we have recently cached data
      const now = Date.now();
      const cacheAge = webhookCache.lastFetched ? now - webhookCache.lastFetched : Infinity;
      const useCachedData = cacheAge < 30 * 1000 && webhookCache[type]; // 30 seconds cache
      
      if (useCachedData) {
        return webhookCache[type];
      }
      
      // Fetch fresh data
      const response = await makeAuthenticatedRequest(`/api/webhooks/${type}`);
      const data = await response.json();
      
      // Update just this part of the cache
      setWebhookCache(prev => ({
        ...prev,
        [type]: data,
        lastFetched: now
      }));
      
      return data;
    } catch (error) {
      console.error(`Error fetching ${type} data:`, error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Render functions for different dropdown types
  const renderAddressItem = (address) => (
    <>
      <p className="font-medium text-sm">
        {address.customer?.firstName || ''} {address.customer?.lastName || ''}
      </p>
      <p className="text-xs text-gray-600 mt-1">{address.street}</p>
      <p className="text-xs text-gray-600">{address.city}, {address.state} {address.postalCode}</p>
      <p className="text-xs text-gray-600">{address.country}</p>
    </>
  );

  const renderWishlistItem = (item) => (
    <>
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden">
          <img 
            src={item.product?.imageUrl || '/api/placeholder/40/40'} 
            alt={item.productName || 'Product'} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">{item.productName || item.product?.name || 'Product'}</p>
          <p className="text-xs text-gray-600">
            ${item.product?.price?.toFixed(2) || '0.00'}
          </p>
        </div>
      </div>
    </>
  );

  const renderOrderItem = (order) => (
    <>
      <div className="flex justify-between">
        <p className="text-sm font-medium">Order #{order.uniqueOrderId || order.id}</p>
        <p className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
          {order.status}
        </p>
      </div>
      <p className="text-xs text-gray-600 mt-1">
        Date: {new Date(order.createdAt).toLocaleDateString()}
      </p>
      <p className="text-xs font-medium text-gray-800 mt-1">
        Total: ${parseFloat(order.totalAmount).toFixed(2)}
      </p>
    </>
  );

  const renderCartItem = (item) => (
    <>
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden">
          <img 
            src={item.productVariation?.imageUrl || '/api/placeholder/40/40'} 
            alt={item.productVariation?.name || 'Product'} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">{item.productVariation?.name || 'Product'}</p>
          <div className="flex justify-between">
            <p className="text-xs text-gray-600">
              Qty: {item.quantity}
            </p>
            <p className="text-xs font-medium">
              ${(parseFloat(item.price) * item.quantity).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </>
  );

// This is now a proper React component (starts with uppercase)
const WebhookDropdown = ({ type, icon, label, managePath, renderFunction }) => {
  const [data, setData] = useState(null);
  const [dropdownLoading, setDropdownLoading] = useState(false);
  
  const fetchDropdownData = async () => {
    setDropdownLoading(true);
    try {
      const webhookData = await getWebhookData(type);
      if (webhookData?.success && webhookData?.data) {
        // Extract items array based on type
        let items = [];
        if (type === 'wishlist' && webhookData.data.items) {
          items = webhookData.data.items;
        } else if (type === 'orders' && webhookData.data.orders) {
          items = webhookData.data.orders;
        } else if (type === 'cart' && webhookData.data.carts) {
          // Flatten cart items from all carts
          items = webhookData.data.carts.flatMap(cart => 
            (cart.cartItems || []).map(item => ({
              ...item,
              shopId: cart.shopId,
              shopName: cart.shopName
            }))
          );
        }
        setData(items);
      }
    } catch (err) {
      console.error(`Error fetching ${type} data:`, err);
    } finally {
      setDropdownLoading(false);
    }
  };
  
  return (
    <HeaderDropdown
      type={type}
      icon={icon}
      count={counts[type] || 0}
      label={label}
      managePath={managePath}
      renderItem={renderFunction}
      authToken={localStorage.getItem('accessToken')}
      customFetch={fetchDropdownData}
      customData={data}
      customLoading={dropdownLoading}
    />
  );
};

return {
  counts,
  loading,
  error,
  refreshCounts: fetchCounts,
  refreshCount,
  
  // Components for use in the header
  AddressDropdown: () => (
    <HeaderDropdown
      type="address"
      icon={
        <img 
          src="https://pawsome-testing.sgp1.digitaloceanspaces.com/Application_CDN_Assets/landing_page_pure_address.png" 
          alt="Location" 
          className="w-5 h-5" 
        />
      }
      label="Addresses"
      fetchUrl="https://pawsome.soluzent.com/api/orders/addresses"
      managePath="/address"
      renderItem={renderAddressItem}
      authToken={localStorage.getItem('accessToken')}
    />
  ),
  
  // Use the WebhookDropdown component instead of the function
  WishlistDropdown: () => (
    <WebhookDropdown
      type="wishlist"
      icon={<img 
        src="https://pawsome-testing.sgp1.digitaloceanspaces.com/Application_CDN_Assets/landing_page_wishlist.png" 
        alt="Wishlist" 
        className="w-5 h-5" 
      />}
      label="Wishlist"
      managePath="/wishlists"
      renderFunction={renderWishlistItem}
    />
  ),
  
  OrdersDropdown: () => (
    <WebhookDropdown
      type="orders"
      icon={<img 
        src="https://pawsome-testing.sgp1.digitaloceanspaces.com/Application_CDN_Assets/landing_page_orders.png" 
        alt="Orders" 
        className="w-5 h-5" 
      />}
      label="Orders"
      managePath="/my-order"
      renderFunction={renderOrderItem}
    />
  ),
  
  CartDropdown: () => (
    <WebhookDropdown
      type="cart"
      icon={<img 
        src="https://pawsome-testing.sgp1.digitaloceanspaces.com/Application_CDN_Assets/landing_page_cart.png" 
        alt="Cart" 
        className="w-5 h-5" 
      />}
      label="Cart"
      managePath="/cart"
      renderFunction={renderCartItem}
    />
  )
};
};

export default HeaderService;