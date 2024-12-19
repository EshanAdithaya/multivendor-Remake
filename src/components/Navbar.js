import React, { useState } from 'react';
import { Menu, Home, ShoppingBag, User } from 'lucide-react';

const NavigationWithSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    'Shops',
    'Offers',
    'Contact',
    'Flash Sale',
    'Manufacturers/Publishers',
    'Authors',
    'FAQ',
    'Terms & Conditions',
    'Customer Refund Policy',
    'Vendor Refund Policy'
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Sliding Sidebar */}
      <div 
        className={`fixed top-0 left-0 h-full w-64 bg-white transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo Header */}
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center">
            <img 
              src="/api/placeholder/40/40" 
              alt="PetDoc Logo" 
              className="h-10"
            />
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-grow">
          <nav className="px-4 py-6">
            {menuItems.map((item, index) => (
              <button
                key={index}
                className="w-full text-left py-3 text-gray-800 font-medium hover:bg-gray-50 focus:outline-none"
              >
                {item}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t py-4 px-6 flex items-center justify-between">
        <button 
          onClick={toggleSidebar}
          className={`transform transition-colors duration-200 ${
            isSidebarOpen ? 'text-blue-500' : 'text-gray-500'
          }`}
        >
          <Menu className="w-6 h-6" />
        </button>
        <Home className="w-6 h-6 text-gray-500" />
        <ShoppingBag className="w-6 h-6 text-gray-500" />
        <User className="w-6 h-6 text-gray-500" />
      </nav>

      {/* Overlay */}
      {isSidebarOpen && (
        <div 
        //   className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default NavigationWithSidebar;