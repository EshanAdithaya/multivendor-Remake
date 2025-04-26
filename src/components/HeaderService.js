import React, { useState, useEffect, useContext, createContext } from 'react';
import HeaderDropdown from './HeaderDropdown';

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
  const [counts, setCounts] = useState({
    wishlist: 0,
    orders: 0,
    cart: 0
  });
  const [loading, setLoading] = useState(false);
  
  // Cache for webhook data to avoid unnecessary re-fetching
  const [webhookCache, setWebhookCache] = useState({
    wishlist: null,
    orders: null,
    cart: null,
    lastFetched: null
  });

  // Helper function to fetch from webhook endpoints
  const fetchWebhook = async (endpoint, token) => {
    try {
      const response = await fetch(`https://pawsome.soluzent.com/api/webhooks/${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching webhook data for ${endpoint}:`, error);
      return null;
    }
  };

  // Fetch all counts from respective webhooks
  const fetchCounts = async () => {
    setLoading(true);
    
    try {
      const accessToken = localStorage.getItem('accessToken');
      
      if (!accessToken) {
        setCounts({ wishlist: 0, orders: 0, cart: 0 });
        setLoading(false);
        return;
      }
      
      // Check if we should use cached data (less than 2 minutes old)
      const now = Date.now();
      const cacheAge = webhookCache.lastFetched ? now - webhookCache.lastFetched : Infinity;
      const useCachedData = cacheAge < 2 * 60 * 1000; // 2 minutes in milliseconds
      
      if (useCachedData && webhookCache.wishlist && webhookCache.orders && webhookCache.cart) {
        // Use cached counts
        setCounts({
          wishlist: webhookCache.wishlist.data.wishlistCount || 0,
          orders: webhookCache.orders.data.orderCount || 0,
          cart: webhookCache.cart.data.carts.reduce((total, cart) => 
            total + (cart.totalItems || 0), 0)
        });
        setLoading(false);
        return;
      }
      
      // Fetch all webhook data in parallel
      const [wishlistData, ordersData, cartData] = await Promise.all([
        fetchWebhook('wishlist', accessToken),
        fetchWebhook('orders', accessToken),
        fetchWebhook('cart', accessToken)
      ]);
      
      // Update cache
      setWebhookCache({
        wishlist: wishlistData,
        orders: ordersData,
        cart: cartData,
        lastFetched: now
      });
      
      // Extract counts from webhook data
      const wishlistCount = wishlistData?.data?.wishlistCount || 0;
      const ordersCount = ordersData?.data?.orderCount || 0;
      
      // Calculate total cart items from all carts
      let cartCount = 0;
      if (cartData?.data?.carts && Array.isArray(cartData.data.carts)) {
        cartCount = cartData.data.carts.reduce((total, cart) => 
          total + (cart.totalItems || 0), 0);
      }
      
      setCounts({
        wishlist: wishlistCount,
        orders: ordersCount,
        cart: cartCount
      });
    } catch (error) {
      console.error('Error fetching counts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch counts on mount and periodically
  useEffect(() => {
    // Initial fetch
    fetchCounts();
    
    // Setup interval to refresh counts periodically (every 5 minutes)
    const intervalId = setInterval(fetchCounts, 5 * 60 * 1000);
    
    // Clear interval on unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures this only runs once on mount

  // Get data for a specific type, using cache if available
  const getWebhookData = async (type) => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return null;
    
    // Check if we have recently cached data
    const now = Date.now();
    const cacheAge = webhookCache.lastFetched ? now - webhookCache.lastFetched : Infinity;
    const useCachedData = cacheAge < 2 * 60 * 1000 && webhookCache[type]; // 2 minutes cache
    
    if (useCachedData) {
      return webhookCache[type];
    }
    
    // Fetch fresh data
    const data = await fetchWebhook(type, accessToken);
    
    // Update just this part of the cache
    setWebhookCache(prev => ({
      ...prev,
      [type]: data,
      lastFetched: now
    }));
    
    return data;
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
          <p className="text-sm font-medium">{item.productName || 'Product'}</p>
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

  // Custom dropdown for webhooks data
  const WebhookDropdown = ({ type, icon, label, count, managePath, renderFunction }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    
    const fetchData = async () => {
      if (loading) return; // Prevent multiple simultaneous fetches
      
      setLoading(true);
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
      } catch (error) {
        console.error(`Error fetching ${type} data:`, error);
      } finally {
        setLoading(false);
        setIsInitialized(true);
      }
    };
    
    // Use useEffect to handle data fetching logic
    useEffect(() => {
      // Only fetch on initial render, then let dropdown handle subsequent fetches
      if (!isInitialized) {
        fetchData();
      }
    }, [isInitialized]); // Only fetch when isInitialized changes
    
    return (
      <HeaderDropdown
        type={type}
        icon={icon}
        count={count}
        label={label}
        managePath={managePath}
        renderItem={renderFunction}
        authToken={localStorage.getItem('accessToken')}
        customFetch={fetchData}
        customData={data}
        customLoading={loading}
      />
    );
  };

  return {
    counts,
    loading,
    refreshCounts: fetchCounts,
    
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
    
    WishlistDropdown: () => (
      <WebhookDropdown
        type="wishlist"
        icon={
          <img 
            src="https://pawsome-testing.sgp1.digitaloceanspaces.com/Application_CDN_Assets/landing_page_wishlist.png" 
            alt="Wishlist" 
            className="w-5 h-5" 
          />
        }
        count={counts.wishlist}
        label="Wishlist"
        managePath="/wishlists"
        renderFunction={renderWishlistItem}
      />
    ),
    
    OrdersDropdown: () => (
      <WebhookDropdown
        type="orders"
        icon={
          <img 
            src="https://pawsome-testing.sgp1.digitaloceanspaces.com/Application_CDN_Assets/landing_page_orders.png" 
            alt="Orders" 
            className="w-5 h-5" 
          />
        }
        count={counts.orders}
        label="Orders"
        managePath="/my-order"
        renderFunction={renderOrderItem}
      />
    ),
    
    CartDropdown: () => (
      <WebhookDropdown
        type="cart"
        icon={
          <img 
            src="https://pawsome-testing.sgp1.digitaloceanspaces.com/Application_CDN_Assets/landing_page_cart.png" 
            alt="Cart" 
            className="w-5 h-5" 
          />
        }
        count={counts.cart}
        label="Cart"
        managePath="/cart"
        renderFunction={renderCartItem}
      />
    )
  };
};

export default HeaderService;