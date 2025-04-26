import React, { useState, useEffect } from 'react';

// Import the service and dropdown components
import HeaderService from './HeaderService';
import HeaderDropdown from './HeaderDropdown';

/**
 * HeaderBar component that displays navigation items in the app header
 * Renders address, wishlist, orders, and cart dropdowns from HeaderService
 */
export const HeaderBar = () => {
  // Get all the dropdown components and services from HeaderService
  const headerService = HeaderService();
  const { 
    AddressDropdown, 
    WishlistDropdown, 
    OrdersDropdown, 
    CartDropdown,
    counts,
    refreshCounts
  } = headerService;

  // Fetch counts on component mount
  useEffect(() => {
    refreshCounts();
    
    // Set up interval to refresh counts periodically (every 2 minutes)
    const intervalId = setInterval(() => {
      refreshCounts();
    }, 2 * 60 * 1000);
    
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