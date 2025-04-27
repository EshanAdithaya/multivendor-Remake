// components/HeaderService.js
import React, { useState, useEffect, useContext, createContext, useCallback } from 'react';
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
      cart: cartCount || 0
    }));
  }, [cartCount]);
  
  // Cache for webhook data to avoid unnecessary re-fetching
  const [webhookCache, setWebhookCache] = useState({
    wishlist: { data: { wishlistCount: 0, items: [] } },
    orders: { data: { orderCount: 0, orders: [] } },
    lastFetched: null
  });

  // Fetch wishlist and orders counts - wrapped in useCallback for better reference stability
  const fetchCounts = useCallback(async () => {
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
          // Safely access nested properties with explicit fallbacks
          wishlist: webhookCache.wishlist?.data?.wishlistCount || 0,
          orders: webhookCache.orders?.data?.orderCount || 0
        }));
        setLoading(false);
        return;
      }
      
      // Fetch wishlist and orders data with proper error handling
      let wishlistData = { data: { wishlistCount: 0, items: [] } };
      let ordersData = { data: { orderCount: 0, orders: [] } };
      
      try {
        // Fetch wishlist 
        const wishlistResponse = await makeAuthenticatedRequest('/api/webhooks/wishlist');
        if (wishlistResponse.ok) {
          wishlistData = await wishlistResponse.json();
        }
      } catch (wishlistError) {
        console.error('Error fetching wishlist:', wishlistError);
        // Continue with default empty data
      }
      
      try {
        // Fetch orders
        const ordersResponse = await makeAuthenticatedRequest('/api/webhooks/orders');
        if (ordersResponse.ok) {
          ordersData = await ordersResponse.json();
        }
      } catch (ordersError) {
        console.error('Error fetching orders:', ordersError);
        // Continue with default empty data
      }
      
      // Update cache even if some requests failed
      setWebhookCache({
        wishlist: wishlistData,
        orders: ordersData,
        lastFetched: now
      });
      
      // Extract counts from webhook data with explicit fallbacks
      const wishlistCount = wishlistData?.data?.wishlistCount || 0;
      const ordersCount = ordersData?.data?.orderCount || 0;
      
      setCounts(prev => ({
        ...prev,
        wishlist: wishlistCount,
        orders: ordersCount
      }));
    } catch (error) {
      console.error('Error in fetchCounts:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [webhookCache]);

  // Force refresh a specific count type (wishlist, orders)
  const refreshCount = useCallback(async (type) => {
    if (!type || !['wishlist', 'orders'].includes(type)) {
      console.warn('Invalid count type to refresh');
      return;
    }
    
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;
      
      const response = await makeAuthenticatedRequest(`/api/webhooks/${type}`);
      if (!response.ok) {
        console.warn(`API returned status ${response.status} for ${type}`);
        return;
      }
      
      const data = await response.json();
      
      // Update the specific cache item
      setWebhookCache(prev => ({
        ...prev,
        [type]: data,
        lastFetched: Date.now()
      }));
      
      // Update the specific count based on type with explicit fallbacks
      if (type === 'wishlist') {
        setCounts(prev => ({
          ...prev,
          wishlist: data?.data?.wishlistCount || 0
        }));
      } else if (type === 'orders') {
        setCounts(prev => ({
          ...prev,
          orders: data?.data?.orderCount || 0
        }));
      }
    } catch (error) {
      console.error(`Error refreshing ${type} count:`, error);
    }
  }, []);

  // Effect to fetch counts on mount
  useEffect(() => {
    fetchCounts();
    
    // Setup interval to refresh counts periodically (every 60 seconds)
    const intervalId = setInterval(fetchCounts, 60 * 1000);
    
    // Clear interval on unmount
    return () => clearInterval(intervalId);
  }, [fetchCounts]); // Dependency on fetchCounts is OK because it's wrapped in useCallback

  // Get data for a specific type using webhook endpoint - wrapped in useCallback
  const getWebhookData = useCallback(async (type) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      if (!token) return { data: { items: [] } }; // Return a safe default
      
      // Check if we have recently cached data
      const now = Date.now();
      const cacheAge = webhookCache.lastFetched ? now - webhookCache.lastFetched : Infinity;
      const useCachedData = cacheAge < 30 * 1000 && webhookCache[type]; // 30 seconds cache
      
      if (useCachedData) {
        return webhookCache[type];
      }
      
      // Fetch fresh data
      try {
        const response = await makeAuthenticatedRequest(`/api/webhooks/${type}`);
        if (!response.ok) {
          console.warn(`API returned status ${response.status} for ${type}`);
          return { data: { items: [] } }; // Return safe default on error
        }
        
        const data = await response.json();
        
        // Update just this part of the cache
        setWebhookCache(prev => ({
          ...prev,
          [type]: data,
          lastFetched: now
        }));
        
        return data;
      } catch (apiError) {
        console.error(`API error fetching ${type} data:`, apiError);
        return { data: { items: [] } }; // Return safe default on error
      }
    } catch (error) {
      console.error(`Error in getWebhookData for ${type}:`, error);
      return { data: { items: [] } }; // Return safe default
    } finally {
      setLoading(false);
    }
  }, [webhookCache]);

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
              ${(parseFloat(item.price || 0) * (item.quantity || 1)).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </>
  );

  // Properly define WebhookDropdown as a memoized function to maintain stability
  const WebhookDropdown = React.memo(({ type, icon, label, managePath, renderFunction }) => {
    const [data, setData] = useState(null);
    const [dropdownLoading, setDropdownLoading] = useState(false);
    
    const fetchDropdownData = async () => {
      setDropdownLoading(true);
      try {
        const webhookData = await getWebhookData(type);
        if (webhookData?.success && webhookData?.data) {
          // Extract items array based on type with proper fallbacks
          let items = [];
          if (type === 'wishlist' && Array.isArray(webhookData.data.items)) {
            items = webhookData.data.items;
          } else if (type === 'orders' && Array.isArray(webhookData.data.orders)) {
            items = webhookData.data.orders;
          } else if (type === 'cart' && Array.isArray(webhookData.data.carts)) {
            // Flatten cart items from all carts
            items = webhookData.data.carts.flatMap(cart => 
              (Array.isArray(cart.cartItems) ? cart.cartItems : []).map(item => ({
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
        setData([]); // Set safe default on error
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
  });

  return {
    counts,
    loading,
    error,
    refreshCounts: fetchCounts,
    refreshCount,
    
    // Components for use in the header
    AddressDropdown: React.memo(() => (
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
    )),
    
    // Use the WebhookDropdown component for wishlist, orders, and cart
    WishlistDropdown: React.memo(() => (
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
    )),
    
    OrdersDropdown: React.memo(() => (
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
    )),
    
    CartDropdown: React.memo(() => (
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
    ))
  };
};

export default HeaderService;