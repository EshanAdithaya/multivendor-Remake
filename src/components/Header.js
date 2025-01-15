import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Filter, X } from 'lucide-react';
import logo from '../Assets/Images/image.png';  // Add this import

const Header = ({ onSearchChange, onFilterClick }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearchValue('');
      onSearchChange('');
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearchChange(value);
  };

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="px-2 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="PetDoc Logo"
                className="h-8 w-8 object-contain"
              />
              <a href={isHomePage ? '#' : '/'}>
                <h1 className="font-bold">PetDoc</h1>
              </a>
            </div>
            {isHomePage && (
              <button 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                onClick={toggleSearch}
              >
                {showSearch ? (
                  <X className="w-5 h-5 text-gray-500" />
                ) : (
                  <Search className="w-5 h-5 text-gray-500" />
                )}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Overlay Search Bar */}
      <div
        className={`
          fixed left-0 right-0 bg-white shadow-md z-40
          transform transition-all duration-300 ease-in-out
          ${showSearch ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}
        `}
        style={{
          top: '48px' // Adjust this value to match your header height
        }}
      >
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 text-sm bg-gray-100 rounded-full pl-10 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                value={searchValue}
                onChange={handleSearchChange}
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
            <button 
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              onClick={onFilterClick}
            >
              <Filter className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;