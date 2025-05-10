import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWishlistService } from './WishlistService';

/**
 * WishlistButton component for adding/removing products from wishlist
 * 
 * @param {Object} props - Component props
 * @param {Object} props.product - The product object
 * @param {string} props.className - Additional CSS classes to apply
 * @returns {React.ReactElement} Wishlist button component
 */
const WishlistButton = ({ product, className = "" }) => {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const wishlistService = useWishlistService();
  
  // Check if product is in wishlist on mount
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!product || !product.id) return;
      
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) return;
        
        const inWishlist = await wishlistService.isInWishlist(product.id);
        setIsInWishlist(inWishlist);
      } catch (error) {
        console.error('Error checking wishlist status:', error);
      }
    };
    
    checkWishlistStatus();
  }, [product, wishlistService]);
  
  // Handle toggling wishlist status
  const handleToggleWishlist = async (e) => {
    e.stopPropagation(); // Prevent navigation to product page
    
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/protected_route');
      return;
    }
    
    if (!product || !product.id) return;
    
    setIsLoading(true);
    try {
      const shopId = product.__shop__?.id || product.shopId;
      if (!shopId) {
        console.error('Shop ID not found on product:', product);
        return;
      }
      
      const result = await wishlistService.toggleWishlist(product.id, shopId);
      
      if (result.success) {
        setIsInWishlist(!isInWishlist);
      } else {
        console.error('Failed to toggle wishlist:', result.error);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <button
      onClick={handleToggleWishlist}
      disabled={isLoading}
      className={`p-2 rounded-full ${isInWishlist ? 'text-yellow-400' : 'text-gray-400'} ${className}`}
      aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-gray-300 border-t-yellow-400 rounded-full animate-spin" />
      ) : (
        <Heart className="w-5 h-5" fill={isInWishlist ? "currentColor" : "none"} />
      )}
    </button>
  );
};

export default WishlistButton;