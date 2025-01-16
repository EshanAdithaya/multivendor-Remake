import React, { useState, useEffect } from 'react';
import { Menu, Home, ShoppingBag, User, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import ShoppingCart from '../pages/ShoppingCart';

const API_REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;

const NavigationWithMenus = () => {
  const [isLeftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [isShoppingCartOpen, setShoppingCartOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    window.location.href = "https://multivendor-remake.vercel.app/login";
  };

  // Fetch cart items count
  useEffect(() => {
    const fetchCartItemCount = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setCartItemCount(0);
        return;
      }

      try {
        const response = await fetch(`${API_REACT_APP_BASE_URL}/api/carts/user`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': '*/*'
          }
        });

        if (response.ok) {
          const carts = await response.json();
          const totalItems = carts.reduce((total, cart) => 
            total + cart.cartItems.reduce((sum, item) => sum + item.quantity, 0), 
          0);
          setCartItemCount(totalItems);
        } else {
          setCartItemCount(0);
        }
      } catch (error) {
        console.error('Error fetching cart items:', error);
        setCartItemCount(0);
      }
    };

    // Fetch on initial load and when cart opens
    fetchCartItemCount();

    // Set up interval to periodically check cart items
    const intervalId = setInterval(fetchCartItemCount, 60000); // Every minute

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [isShoppingCartOpen]);

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
    <div className="relative">
      {/* Left Sliding Sidebar */}
      <div
        className={`fixed top-12 left-0 h-[calc(100%-48px)] w-64 bg-white transform transition-transform duration-300 ease-in-out z-40 ${
          isLeftSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } shadow-lg`}
      >
        <div className="h-full flex flex-col">
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setLeftSidebarOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full ml-auto"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <nav className="px-4 py-6">
              {leftMenuItems.map((item, index) => (
                <button
                  key={index}
                  className={`w-full text-left py-3 px-2 rounded-lg font-medium transition-colors duration-200 ${
                    location.pathname === item.path
                      ? 'bg-red-50 text-yellow-600'
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
      </div>

      {/* Right Sliding Sidebar */}
      <div
        className={`fixed top-12 right-0 h-[calc(100%-48px)] w-64 bg-white transform transition-transform duration-300 ease-in-out z-40 ${
          isRightSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        } shadow-lg`}
      >
        <div className="h-full flex flex-col">
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setRightSidebarOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full ml-auto"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="bg-white">
            <div className="px-6 py-4 space-y-3 border-b border-gray-100">
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

          <div className="flex-1 overflow-y-auto">
            <nav className="px-4 py-6">
              {rightMenuItems.map((item, index) => (
                <button
                  key={index}
                  className={`w-full text-left py-3 px-2 rounded-lg font-medium transition-colors duration-200 ${
                    location.pathname === item.path
                      ? 'bg-red-50 text-yellow-600'
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
      </div>

      {/* Shopping Cart Overlay */}
      {isShoppingCartOpen && (
        <div className="fixed inset-x-0 top-12 bottom-0 bg-white z-40">
          <div className="h-full flex flex-col">
            <div className="px-4 py-3 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-xl font-semibold">Shopping Cart</span>
                <button 
                  onClick={handleCloseShoppingCart}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <ShoppingCart onClose={handleCloseShoppingCart} />
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t py-4 px-6 flex items-center justify-between z-40">
        <button
          onClick={toggleLeftSidebar}
          className={`transform transition-colors duration-200 ${
            isLeftSidebarOpen ? 'text-yellow-500' : 'text-gray-500'
          }`}
        >
          <Menu className="w-6 h-6" />
        </button>
        <button 
          onClick={() => handleNavigation('/')}
          className={`transform transition-colors duration-200 ${
            location.pathname === '/' && !isShoppingCartOpen ? 'text-yellow-500' : 'text-gray-500'
          }`}
        >
          <Home className="w-6 h-6" />
        </button>
        <button 
          onClick={toggleShoppingCart}
          className={`relative transform transition-colors duration-200 ${
            isShoppingCartOpen ? 'text-yellow-500' : 'text-gray-500'
          }`}
        >
          <ShoppingBag className="w-6 h-6" />
          {cartItemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartItemCount > 99 ? '99+' : cartItemCount}
            </span>
          )}
        </button>
        <button 
          onClick={toggleRightSidebar}
          className={`transform transition-colors duration-200 ${
            isRightSidebarOpen ? 'text-yellow-500' : 'text-gray-500'
          }`}
        >
          <User className="w-6 h-6" />
        </button>
      </nav>

      {/* Overlay */}
      {(isLeftSidebarOpen || isRightSidebarOpen) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 z-30"
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