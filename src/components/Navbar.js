import React, { useState } from 'react';
import { Menu, Home, ShoppingBag, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const NavigationWithMenus = () => {
  const [isLeftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setRightSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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

  const toggleLeftSidebar = () => {
    setLeftSidebarOpen(!isLeftSidebarOpen);
    if (isRightSidebarOpen) setRightSidebarOpen(false);
  };

  const toggleRightSidebar = () => {
    setRightSidebarOpen(!isRightSidebarOpen);
    if (isLeftSidebarOpen) setLeftSidebarOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setLeftSidebarOpen(false);
    setRightSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Left Sliding Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white transform transition-transform duration-300 ease-in-out z-30 ${
          isLeftSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center">
            <img
              src="/api/placeholder/40/40"
              alt="PetDoc Logo"
              className="h-10"
            />
          </div>
        </div>
        
        <div className="flex-grow">
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
        }`}
      >
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center">
            <img
              src="/api/placeholder/40/40"
              alt="PetDoc Logo"
              className="h-10"
            />
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

        <nav className="space-y-1">
          {[
            'Profile',
            'My Orders',
            'My Cards',
            'My Wishlists',
            'My Questions',
            'My Refunds',
            'My Reports',
            'Checkout',
            'Change Password',
            'Logout'
          ].map((item) => (
            <button
              key={item}
              className="w-full px-6 py-3 text-left text-gray-700 hover:bg-gray-50 focus:outline-none"
              onClick={() => handleNavigation(`/${item.toLowerCase().replace(' ', '-')}`)}
            >
              {item}
            </button>
          ))}
        </nav>
      </div>

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
        <button onClick={() => handleNavigation('/home')}>
          <Home className="w-6 h-6 text-gray-500 hover:text-blue-500" />
        </button>
        <button onClick={() => handleNavigation('/shop')}>
          <ShoppingBag className="w-6 h-6 text-gray-500 hover:text-blue-500" />
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

      {/* Overlay */}
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