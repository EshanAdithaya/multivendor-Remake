import React from 'react';

const SidebarMenu = () => {
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

  return (
    <div className="min-h-screen bg-white flex flex-col">
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

      {/* Bottom Navigation */}
      <div className="border-t border-gray-200 bg-white p-4">
        <div className="max-w-screen-xl mx-auto flex justify-between items-center">
          <button className="text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <button className="text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </button>
          <button className="text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </button>
          <button className="text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SidebarMenu;