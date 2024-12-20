// src/components/Layout.jsx
import React from 'react';
import NavigationWithSidebar from './Navbar';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();
  
  // Add routes where you don't want the navigation to appear
  const routesWithoutNav = ['/login', '/register'];
  
  const shouldShowNav = !routesWithoutNav.includes(location.pathname);

  return (
    <div className="pb-20"> {/* Add padding bottom to account for fixed bottom nav */}
      {children}
      {shouldShowNav && <NavigationWithSidebar />}
    </div>
  );
};

export default Layout;