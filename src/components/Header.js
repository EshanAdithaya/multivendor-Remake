import React from 'react';
import { useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';
import Logo from '../Assets/Images/image.png'; // Adjust the path according to your project structure

const Header = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="px-2 py-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <img 
              src={Logo} 
              alt="PetDoc Logo"
              className="h-8 w-auto" // Adjust size as needed
            /> 
            <a href={isHomePage ? '#' : '/'}> <h1><strong>PetDoc</strong></h1> </a> 
          </div>
          {isHomePage && (
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Search className="w-5 h-5 text-gray-500" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;