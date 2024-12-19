import React from 'react';
import { Search, MapPin, Menu, Home, ShoppingBag, User } from 'lucide-react';

const ShopListing = () => {
  const categories = [
    { id: 1, name: 'Category 1', icon: '🍖' },
    { id: 2, name: 'Category 1', icon: '🍖' },
    { id: 3, name: 'Category 1', icon: '🍖' },
    { id: 4, name: 'Category 1', icon: '🍖' },
  ];

  const shops = [
    { id: 1, name: 'Shop name', address: 'Dolor sit amet consectetur adipiscing elit amet consectetur adipiscing elit' },
    { id: 2, name: 'Shop name', address: 'Dolor sit amet consectetur adipiscing elit amet consectetur adipiscing elit' },
    { id: 3, name: 'Shop name', address: 'Dolor sit amet consectetur adipiscing elit amet consectetur adipiscing elit' },
    { id: 4, name: 'Shop name', address: 'Dolor sit amet consectetur adipiscing elit amet consectetur adipiscing elit' },
    { id: 5, name: 'Shop name', address: 'Dolor sit amet consectetur adipiscing elit amet consectetur adipiscing elit' },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="p-4 flex items-center justify-between bg-white">
        <h1 className="text-2xl font-bold">Shops</h1>
        <Search className="w-6 h-6 text-gray-500" />
      </header>

      {/* Categories */}
      <div className="px-4 py-6 flex gap-4 overflow-x-auto">
        {categories.map((category) => (
          <div 
            key={category.id}
            className="flex flex-col items-center justify-center min-w-[100px] h-[100px] bg-gray-200 rounded-lg"
          >
            <span className="text-2xl mb-2">{category.icon}</span>
            <span className="text-sm text-gray-700">{category.name}</span>
          </div>
        ))}
      </div>

      {/* Shop Listings */}
      <div className="flex-1 overflow-y-auto px-4">
        {shops.map((shop) => (
          <div 
            key={shop.id}
            className="bg-white rounded-lg p-4 mb-4 flex items-start gap-4 shadow-sm"
          >
            <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center text-gray-400 text-sm">
              Logo
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold mb-2">{shop.name}</h2>
              <div className="flex items-start gap-2 text-gray-500">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{shop.address}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t py-4 px-6 flex items-center justify-between">
        <Menu className="w-6 h-6 text-gray-500" />
        <Home className="w-6 h-6 text-gray-500" />
        <ShoppingBag className="w-6 h-6 text-gray-500" />
        <User className="w-6 h-6 text-gray-500" />
      </nav>
    </div>
  );
};

export default ShopListing;