import { makeAuthenticatedRequest } from './CartContext';
import { useHeaderService } from './HeaderService';

/**
 * Wishlist service to handle wishlist operations with real-time updates
 * This hook provides functions for adding/removing items and syncing counts
 */
export const useWishlistService = () => {
  const headerService = useHeaderService();
  
  /**
   * Add a product to the wishlist
   * @param {string} productId - The ID of the product to add
   * @param {string} shopId - The ID of the shop the product belongs to
   * @returns {Promise<Object>} Result of the operation
   */
  const addToWishlist = async (productId, shopId) => {
    try {
      const response = await makeAuthenticatedRequest('/api/wishlist', {
        method: 'POST',
        body: JSON.stringify({
          productId,
          shopId
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add to wishlist');
      }
      
      const result = await response.json();
      
      // Refresh wishlist count - Fix: Use a try-catch to prevent errors
      try {
        if (headerService && typeof headerService.refreshCount === 'function') {
          await headerService.refreshCount('wishlist');
        }
      } catch (refreshError) {
        console.error('Error refreshing wishlist count:', refreshError);
      }
      
      return { success: true, data: result };
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return { success: false, error: error.message };
    }
  };
  
  /**
   * Remove a product from the wishlist
   * @param {string} productId - The ID of the product to remove
   * @returns {Promise<Object>} Result of the operation
   */
  const removeFromWishlist = async (productId) => {
    try {
      const response = await makeAuthenticatedRequest(`/api/wishlist/product/${productId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to remove from wishlist');
      }
      
      const result = await response.json();
      
      // Refresh wishlist count - Fix: Use a try-catch to prevent errors
      try {
        if (headerService && typeof headerService.refreshCount === 'function') {
          await headerService.refreshCount('wishlist');
        }
      } catch (refreshError) {
        console.error('Error refreshing wishlist count:', refreshError);
      }
      
      return { success: true, data: result };
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      return { success: false, error: error.message };
    }
  };
  
  /**
   * Check if a product is in the wishlist
   * @param {string} productId - The ID of the product to check
   * @returns {Promise<boolean>} True if the product is in the wishlist
   */
  const isInWishlist = async (productId) => {
    try {
      const response = await makeAuthenticatedRequest('/api/wishlist/my-wishlist');
      
      if (!response.ok) {
        return false;
      }
      
      const wishlist = await response.json();
      return Array.isArray(wishlist) && wishlist.some(item => 
        item.product && item.product.id === productId
      );
    } catch (error) {
      console.error('Error checking wishlist:', error);
      return false;
    }
  };
  
  /**
   * Toggle a product in the wishlist (add if not exists, remove if exists)
   * @param {string} productId - The ID of the product to toggle
   * @param {string} shopId - The ID of the shop the product belongs to
   * @returns {Promise<Object>} Result of the operation
   */
  const toggleWishlist = async (productId, shopId) => {
    const inWishlist = await isInWishlist(productId);
    
    if (inWishlist) {
      return removeFromWishlist(productId);
    } else {
      return addToWishlist(productId, shopId);
    }
  };
  
  return {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist
  };
};