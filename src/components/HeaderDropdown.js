import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Generic HeaderDropdown component used for Addresses, Wishlist, Orders, and Cart
 * 
 * @param {Object} props - Component props
 * @param {string} props.type - The type of dropdown ('address', 'wishlist', 'order', or 'cart')
 * @param {React.ReactNode} props.icon - Icon to display in the dropdown button
 * @param {number} props.count - Number of items to display (e.g., wishlist count)
 * @param {string} props.label - Label for the dropdown (e.g., "Wishlist")
 * @param {string} props.fetchUrl - API URL to fetch items
 * @param {string} props.managePath - Path to navigate when "Manage" button is clicked
 * @param {Function} props.renderItem - Function to render each item in the dropdown
 */
const HeaderDropdown = ({ 
  type, 
  icon, 
  count = 0, 
  label, 
  fetchUrl, 
  managePath,
  renderItem 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  
  // Fetch items from API
  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const accessToken = localStorage.getItem('accessToken');
      
      if (!accessToken) {
        setError('You need to login to view your data');
        setLoading(false);
        return;
      }
      
      const response = await fetch(fetchUrl, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'accept': '*/*'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ${type}`);
      }
      
      const data = await response.json();
      
      // Handle different API response formats
      if (type === 'cart' && Array.isArray(data)) {
        // For cart, we need to extract cart items from all carts
        const allCartItems = [];
        
        data.forEach(cart => {
          if (cart.cartItems && Array.isArray(cart.cartItems)) {
            cart.cartItems.forEach(item => {
              // Add shop info to each cart item
              allCartItems.push({
                ...item,
                shop: cart.shop
              });
            });
          }
        });
        
        setItems(allCartItems);
      } else {
        setItems(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Error fetching items:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    // Only fetch items when opening the dropdown
    if (!isOpen) {
      fetchItems();
    }
    setIsOpen(!isOpen);
  };

  // Handle clicking on an item
  const handleItemClick = (item) => {
    setIsOpen(false);
    
    // Navigate or perform action based on type
    if (type === 'address') {
      // Maybe select this address
    } else if (type === 'wishlist') {
      navigate(`/product/${item.product?.id || item.productId}`);
    } else if (type === 'order') {
      navigate(`/order-details/${item.id}`);
    } else if (type === 'cart') {
      navigate(`/product/${item.productVariation?.productId}`);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <div 
        className="flex flex-col items-center cursor-pointer"
        onClick={toggleDropdown}
      >
        <div className="bg-yellow-500 w-20 h-12 rounded-xl flex items-center justify-center gap-1">
          {icon}
          {count > 0 && (
            <span className="text-white text-base font-medium ml-1">{count}</span>
          )}
          <ChevronRight 
            className={`w-4 h-4 text-white transform ${isOpen ? 'rotate-270' : 'rotate-90'} transition-transform`} 
          />
        </div>
        <div className="bg-white px-3 py-0.5 rounded-md -mt-3 text-center border border-yellow-500 z-10">
          <span className="text-xs font-medium text-yellow-500">{label}</span>
        </div>
      </div>
      
      {/* Dropdown Content */}
      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-white rounded-lg shadow-lg z-50 border border-gray-200">
          <div className="p-3 border-b border-gray-100">
            <h3 className="text-sm font-semibold">My {label}</h3>
          </div>
          
          <div className="max-h-60 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : error ? (
              <div className="p-4 text-center text-red-500">{error}</div>
            ) : items.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No {label.toLowerCase()} found</div>
            ) : (
              items.map((item, index) => (
                <div 
                  key={item.id || `${type}-item-${index}`} 
                  className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleItemClick(item)}
                >
                  {renderItem(item)}
                </div>
              ))
            )}
          </div>
          
          <div className="p-3 border-t border-gray-100">
            <button 
              className="w-full py-2 bg-yellow-500 text-white rounded-lg text-sm font-medium"
              onClick={() => {
                setIsOpen(false);
                navigate(managePath);
              }}
            >
              Manage {label}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderDropdown;