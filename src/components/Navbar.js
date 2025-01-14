import React, { useState } from 'react';
import { Menu, Home, ShoppingBag, User, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import ShoppingCart from '../pages/ShoppingCart'; // Adjust this import path as needed

const NavigationWithMenus = () => {
  const [isLeftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [isShoppingCartOpen, setShoppingCartOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    window.location.href = "https://multivendor-remake.vercel.app/login";
  };

  const leftMenuItems = [
    { name: 'Shops', path: '/shops' },
    { name: 'Offers', path: '/offers' },
    { name: 'Contact', path: '/contact' },
    { name: 'Flash Sale', path: '/flash-sale' },
    { name: 'Manufacturers/Publishers', path: '/manufacturers' },
    { name: 'Authors', path: '/authors' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Terms & Conditions', path: '/terms' },
    { name: 'Refund Policy', path: '/refund-policy' }
  ];

  const rightMenuItems = [
    { name: 'Profile', path: '/profile' },
    { name: 'My Orders', path: '/my-order' },
    { name: 'My Cards', path: '/cards' },
    { name: 'My Address', path: '/address' },
    { name: 'My Wishlists', path: '/wishlists' },
    { name: 'My Questions', path: '/questions' },
    { name: 'My Refunds', path: '/refunds' },
    { name: 'My Reports', path: '/reports' },
    { name: 'Checkout', path: '/checkout' },
    { name: 'Change Password', path: '/change-password' },
    { name: 'Logout', path: '#', onClick: handleLogout }
  ];

  const toggleLeftSidebar = () => {
    setLeftSidebarOpen(!isLeftSidebarOpen);
    if (isRightSidebarOpen) setRightSidebarOpen(false);
    if (isShoppingCartOpen) setShoppingCartOpen(false);
  };

  const toggleRightSidebar = () => {
    setRightSidebarOpen(!isRightSidebarOpen);
    if (isLeftSidebarOpen) setLeftSidebarOpen(false);
    if (isShoppingCartOpen) setShoppingCartOpen(false);
  };

  const toggleShoppingCart = () => {
    setShoppingCartOpen(!isShoppingCartOpen);
    if (isLeftSidebarOpen) setLeftSidebarOpen(false);
    if (isRightSidebarOpen) setRightSidebarOpen(false);
  };

  const handleCloseShoppingCart = () => {
    setShoppingCartOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setLeftSidebarOpen(false);
    setRightSidebarOpen(false);
    setShoppingCartOpen(false);
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Left Sliding Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white transform transition-transform duration-300 ease-in-out z-30 ${
          isLeftSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } shadow-lg`}
      >
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <img
              src="/api/placeholder/40/40"
              alt="Logo"
              className="h-10"
            />
            <button 
              onClick={() => setLeftSidebarOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>
        
        <div className="flex-grow overflow-y-auto">
          <nav className="px-4 py-6">
            {leftMenuItems.map((item, index) => (
              <button
                key={index}
                className={`w-full text-left py-3 px-2 rounded-lg font-medium transition-colors duration-200 ${
                  location.pathname === item.path
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-800 hover:bg-gray-50'
                }`}
                onClick={() => handleNavigation(item.path)}
              >
                {item.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Right Sliding Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white transform transition-transform duration-300 ease-in-out z-30 ${
          isRightSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        } shadow-lg`}
      >
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <img
              src="/api/placeholder/40/40"
              alt="Logo"
              className="h-10"
            />
            <button 
              onClick={() => setRightSidebarOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="bg-white mb-4">
          <div className="px-6 py-4 space-y-3">
            <div className="flex justify-between items-center text-gray-600">
              <span>Total Points</span>
              <span>0</span>
            </div>
            <div className="flex justify-between items-center text-gray-600">
              <span>Points Used</span>
              <span>0</span>
            </div>
            <div className="flex justify-between items-center text-gray-600">
              <span>Available Points</span>
              <span>0</span>
            </div>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto">
          <nav className="px-4 py-6">
            {rightMenuItems.map((item, index) => (
              <button
                key={index}
                className={`w-full text-left py-3 px-2 rounded-lg font-medium transition-colors duration-200 ${
                  location.pathname === item.path
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-800 hover:bg-gray-50'
                }`}
                onClick={() => {
                  if (item.onClick) {
                    item.onClick();
                  } else {
                    handleNavigation(item.path);
                  }
                }}
              >
                {item.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Full Screen Shopping Cart */}
      {isShoppingCartOpen && (
        <div className="fixed inset-0 bg-white z-40">
          <div className="h-full flex flex-col">
            <div className="border-b border-gray-200 p-4 flex justify-between items-center">
              <div className="flex items-center">
                <img
                  src="/api/placeholder/40/40"
                  alt="Logo"
                  className="h-10"
                />
                <span className="ml-3 text-xl font-semibold">Shopping Cart</span>
              </div>
              <button 
                onClick={handleCloseShoppingCart}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <ShoppingCart onClose={handleCloseShoppingCart} />
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t py-4 px-6 flex items-center justify-between z-20">
        <button
          onClick={toggleLeftSidebar}
          className={`transform transition-colors duration-200 ${
            isLeftSidebarOpen ? 'text-blue-500' : 'text-gray-500'
          }`}
        >
          <Menu className="w-6 h-6" />
        </button>
        <button onClick={() => handleNavigation('/')}>
          <Home className="w-6 h-6 text-gray-500 hover:text-blue-500" />
        </button>
        <button 
          onClick={toggleShoppingCart}
          className={`transform transition-colors duration-200 ${
            isShoppingCartOpen ? 'text-blue-500' : 'text-gray-500'
          }`}
        >
          <ShoppingBag className="w-6 h-6" />
        </button>
        <button 
          onClick={toggleRightSidebar}
          className={`transform transition-colors duration-200 ${
            isRightSidebarOpen ? 'text-blue-500' : 'text-gray-500'
          }`}
        >
          <User className="w-6 h-6" />
        </button>
      </nav>

      {/* Overlay (only for sidebars, not for shopping cart) */}
      {(isLeftSidebarOpen || isRightSidebarOpen) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 z-20"
          onClick={() => {
            setLeftSidebarOpen(false);
            setRightSidebarOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default NavigationWithMenus;