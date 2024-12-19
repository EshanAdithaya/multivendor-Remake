import React from 'react';
import { Menu, Home, ShoppingBag, User } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white border-t py-4 px-6 flex items-center justify-between">
      <Menu className="w-6 h-6 text-gray-500" />
      <Home className="w-6 h-6 text-gray-500" />
      <ShoppingBag className="w-6 h-6 text-gray-500" />
      <User className="w-6 h-6 text-gray-500" />
    </nav>
  );
};

export default Navbar;
