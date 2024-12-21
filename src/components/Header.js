import React from 'react';
import { Search, Menu } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Menu className="w-5 h-5 text-gray-600" />
            <h1 className="text-lg font-bold text-gray-800">PetDoc</h1>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Search className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
      </div>
    </header>
  );
};

export default Header;