import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const isHomePage = location.pathname === '/';

  const navItems = [
    { name: 'Home', link: '/', type: 'route' },
    { name: 'Services', link: '#services', type: 'hash' },
    { name: 'Projects', link: '/portfolio', type: 'route' },
    { name: 'About', link: '#about', type: 'hash' },
    { name: 'Team', link: '#team', type: 'hash' },
    { name: 'Contact', link: '#contact', type: 'hash' }
  ];

  const handleNavClick = (item) => {
    if (item.type === 'hash' && !isHomePage) {
      // If clicking a hash link while not on home page, navigate to home first
      window.location.href = `/${item.link}`;
    }
  };

  const NavLink = ({ item }) => {
    if (item.type === 'route') {
      return (
        <Link
          to={item.link}
          className={`text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium ${
            location.pathname === item.link ? 'text-blue-600' : ''
          }`}
        >
          {item.name}
        </Link>
      );
    }

    return (
      <a
        href={isHomePage ? item.link : `/${item.link}`}
        onClick={() => handleNavClick(item)}
        className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
      >
        {item.name}
      </a>
    );
  };

  const MobileNavLink = ({ item }) => {
    if (item.type === 'route') {
      return (
        <Link
          to={item.link}
          className={`block text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium ${
            location.pathname === item.link ? 'text-blue-600' : ''
          }`}
        >
          {item.name}
        </Link>
      );
    }

    return (
      <a
        href={isHomePage ? item.link : `/${item.link}`}
        onClick={() => handleNavClick(item)}
        className="block text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium"
      >
        {item.name}
      </a>
    );
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-lg' : 'bg-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              Cryste
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <NavLink key={item.name} item={item} />
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-blue-600 focus:outline-none"
            >
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <MobileNavLink key={item.name} item={item} />
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;