import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Completely reworked HeaderDropdown component with robust click handling
 */
const HeaderDropdown = ({ 
  type, 
  icon, 
  count = 0, 
  label, 
  fetchUrl, 
  managePath,
  renderItem,
  authToken,
  customFetch,
  customData,
  customLoading 
}) => {
  // State management
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 120, left: '50%' });
  
  // Navigation
  const navigate = useNavigate();
  
  // Critical refs for click management
  const dropdownRef = useRef(null);
  const dropdownButtonRef = useRef(null);
  
  // Helper function to safely fetch items
  const fetchItems = async () => {
    // If custom fetch function provided, use it
    if (customFetch) {
      customFetch();
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const accessToken = authToken || localStorage.getItem('accessToken');
      
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

  // Calculate dropdown position dynamically based on type
  const calculateDropdownPosition = () => {
    if (dropdownButtonRef.current) {
      const buttonRect = dropdownButtonRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      
      // Dynamic positioning based on dropdown type
      let leftPosition = '50%';
      let topOffset = 8;
      
      // Adjust position based on type to avoid overlap
      switch(type) {
        case 'address':
          leftPosition = '25%'; // Position left
          break;
        case 'wishlist':
          leftPosition = '40%'; // Slightly left of center
          break;
        case 'cart':
          leftPosition = '60%'; // Slightly right of center
          break;
        case 'orders':
          leftPosition = '75%'; // Position right
          break;
        default:
          leftPosition = '50%'; // Center for other types
      }
      
      // Ensure popup doesn't go off-screen on mobile
      if (viewportWidth < 768) {
        const dropdownWidth = 250; // Approximate dropdown width
        const buttonCenter = buttonRect.left + buttonRect.width / 2;
        
        // Calculate actual left position as pixels
        let actualLeft;
        switch(leftPosition) {
          case '25%':
            actualLeft = buttonCenter - dropdownWidth * 0.75;
            break;
          case '40%':
            actualLeft = buttonCenter - dropdownWidth * 0.6;
            break;
          case '60%':
            actualLeft = buttonCenter - dropdownWidth * 0.4;
            break;
          case '75%':
            actualLeft = buttonCenter - dropdownWidth * 0.25;
            break;
          default:
            actualLeft = buttonCenter - dropdownWidth * 0.5;
        }
        
        // Prevent overflow on left side
        if (actualLeft < 10) {
          leftPosition = '10px';
        }
        // Prevent overflow on right side
        else if (actualLeft + dropdownWidth > viewportWidth - 10) {
          leftPosition = `${viewportWidth - dropdownWidth - 10}px`;
        } else {
          leftPosition = `${actualLeft}px`;
        }
      }
      
      setDropdownPosition({
        top: buttonRect.bottom + topOffset,
        left: leftPosition
      });
    }
  };

  // Handle opening the dropdown
  const handleOpenDropdown = (e) => {
    // Critical: Stop event propagation to prevent immediate closing
    e.stopPropagation();
    
    // Calculate position before opening
    calculateDropdownPosition();
    
    // Only fetch items when opening the dropdown
    if (!isOpen) {
      fetchItems();
    }
    
    // Toggle the open state
    setIsOpen(!isOpen);
  };

  // Handle clicking on an item 
  const handleItemClick = (e, item) => {
    // Critical: Stop event propagation
    e.stopPropagation();
    
    // Keep the dropdown open when clicking an item (optional)
    // setIsOpen(false);
    
    // Navigate based on item type
    if (type === 'address') {
      // Maybe select this address
    } else if (type === 'wishlist') {
      navigate(`/productDetails?key=${item.product?.id || item.productId}`);
    } else if (type === 'order' || type === 'orders') {
      navigate(`/order-details?token=${item.id}`);
    } else if (type === 'cart') {
      navigate(`/productDetails?key=${item.productVariation?.productId}`);
    }
  };

  // Handle manage button click
  const handleManageClick = (e) => {
    // Critical: Stop event propagation
    e.stopPropagation();
    
    // Close dropdown
    setIsOpen(false);
    
    // Navigate to management page
    navigate(managePath);
  };

  // Handle clicks outside the dropdown
  useEffect(() => {
    // Only add listener when dropdown is open
    if (!isOpen) return;
    
    const handleClickOutside = (event) => {
      // Check if click is outside both the dropdown AND the trigger button
      const isOutsideDropdown = dropdownRef.current && !dropdownRef.current.contains(event.target);
      const isOutsideButton = dropdownButtonRef.current && !dropdownButtonRef.current.contains(event.target);
      
      if (isOutsideDropdown && isOutsideButton) {
        setIsOpen(false);
      }
    };
    
    // Add the event listener with capture phase to ensure it runs before other handlers
    document.addEventListener('mousedown', handleClickOutside, true);
    
    // Clean up
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, [isOpen]);

  // Determine which data source to use (webhook or legacy)
  const isLoadingData = customLoading !== undefined ? customLoading : loading;
  const itemsToDisplay = customData !== undefined ? customData : items;

  return (
    <div className="relative overflow-visible">
      {/* Dropdown Trigger Button */}
      <div 
        ref={dropdownButtonRef}
        className="flex flex-col items-center cursor-pointer" 
        onClick={handleOpenDropdown}
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
      
      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          ref={dropdownRef}
          className="fixed bg-white rounded-lg shadow-xl border border-gray-200 w-64 max-w-[90vw] min-w-[250px]"
          style={{
            position: 'fixed',
            zIndex: 9999,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            left: dropdownPosition.left,
            top: dropdownPosition.top,
            transform: dropdownPosition.left.includes('px') ? 'none' : 'translateX(-50%)'
          }}
          onClick={(e) => e.stopPropagation()} // Critical: prevent clicks from bubbling
        >
          <div className="p-3 border-b border-gray-100">
            <h3 className="text-sm font-semibold">My {label}</h3>
          </div>
          
          <div className="max-h-60 overflow-y-auto">
            {isLoadingData ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : error ? (
              <div className="p-4 text-center text-red-500">{error}</div>
            ) : itemsToDisplay?.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No {label.toLowerCase()} found</div>
            ) : (
              (itemsToDisplay || []).map((item, index) => (
                <div 
                  key={item.id || `${type}-item-${index}`} 
                  className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                  onClick={(e) => handleItemClick(e, item)}
                >
                  {renderItem(item)}
                </div>
              ))
            )}
          </div>
          
          <div className="p-3 border-t border-gray-100">
            <button 
              className="w-full py-2 bg-yellow-500 text-white rounded-lg text-sm font-medium"
              onClick={handleManageClick}
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