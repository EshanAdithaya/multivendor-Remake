import React, { useEffect } from 'react';
import { useHeaderService } from './HeaderService';

/**
 * HeaderBar component that displays navigation items in the app header
 * Uses the HeaderService to render dropdowns for address, wishlist, orders, and cart
 */
export const HeaderBar = () => {
  // Get all the dropdown components and services from HeaderService
  const { 
    AddressDropdown, 
    WishlistDropdown, 
    OrdersDropdown, 
    CartDropdown,
    refreshCounts
  } = useHeaderService();

  // Fetch counts on component mount and set up periodic refresh
  useEffect(() => {
    // Initial fetch
    refreshCounts();
    
    // Set up interval to refresh counts periodically (every 60 seconds)
    const intervalId = setInterval(() => {
      refreshCounts();
    }, 60 * 1000);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [refreshCounts]);

  return (
    <div className="flex justify-around px-2 -mt-3">
      <AddressDropdown />
      <WishlistDropdown />
      <OrdersDropdown />
      <CartDropdown />
    </div>
  );
};

export default HeaderBar;