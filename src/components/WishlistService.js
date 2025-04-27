import { makeAuthenticatedRequest } from './CartContext';
import { useHeaderService } from './HeaderService';

/**
 * Properly implemented WishlistService with React hooks rules compliance
 * This hook provides functions for adding/removing items and syncing counts
 */
export const useWishlistService = () => {
  // Always call hooks unconditionally at the top level
  const headerService = useHeaderService();
  
  /**
   * Safely attempt to refresh counts without throwing errors
   */
  const safelyRefreshCounts = async () => {
    try {
      // First try to refresh just the wishlist count
      if (headerService && typeof headerService.refreshCount === 'function') {
        await headerService.refreshCount('wishlist');
      } 
      // Fall back to refreshing all counts if the specific refresh fails
      else if (headerService && typeof headerService.refreshCounts === 'function') {
        await headerService.refreshCounts();
      }
    } catch (error) {
      console.warn('Failed to refresh counts:', error);
      // Don't throw, just log the error
    }
  };
  
  /**
   * Add a product to the wishlist with robust error handling
   * @param {string} productId - The ID of the product to add
   * @param {string} shopId - The ID of the shop the product belongs to
   * @returns {Promise<Object>} Result of the operation
   */
  const addToWishlist = async (productId, shopId) => {
    if (!productId || !shopId) {
      console.error('Invalid parameters for addToWishlist:', { productId, shopId });
      return { success: false, error: 'Invalid product or shop ID' };
    }
    
    try {
      // Check if user is logged in
      const token = localStorage.getItem('accessToken');
      if (!token) {
        return { success: false, error: 'You need to login to add items to wishlist' };
      }

      // Make the API request
      const response = await makeAuthenticatedRequest('/api/wishlist', {
        method: 'POST',
        body: JSON.stringify({
          productId,
          shopId
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to add to wishlist: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Refresh counts safely
      await safelyRefreshCounts();
      
      return { success: true, data: result };
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return { success: false, error: error.message || 'Failed to add item to wishlist' };
    }
  };
  
  /**
   * Remove a product from the wishlist with enhanced error handling
   * @param {string} productId - The ID of the product to remove
   * @returns {Promise<Object>} Result of the operation
   */
  const removeFromWishlist = async (productId) => {
    if (!productId) {
      console.error('Invalid productId for removeFromWishlist:', productId);
      return { success: false, error: 'Invalid product ID' };
    }
    
    try {
      // Check if user is logged in
      const token = localStorage.getItem('accessToken');
      if (!token) {
        return { success: false, error: 'You need to login to remove items from wishlist' };
      }
      
      // Make the API request with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      try {
        const response = await makeAuthenticatedRequest(`/api/wishlist/product/${productId}`, {
          method: 'DELETE',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Failed to remove from wishlist: ${response.status}`);
        }
        
        const result = await response.json();
        
        // Refresh counts safely
        await safelyRefreshCounts();
        
        return { success: true, data: result };
      } catch (fetchError) {
        clearTimeout(timeoutId);
        if (fetchError.name === 'AbortError') {
          throw new Error('Request timed out. Please try again.');
        }
        throw fetchError;
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      return { success: false, error: error.message || 'Failed to remove item from wishlist' };
    }
  };
  
  /**
   * Check if a product is in the wishlist with improved error handling
   * @param {string} productId - The ID of the product to check
   * @returns {Promise<boolean>} True if the product is in the wishlist
   */
  const isInWishlist = async (productId) => {
    if (!productId) {
      console.error('Invalid productId for isInWishlist:', productId);
      return false;
    }
    
    try {
      // Check if user is logged in
      const token = localStorage.getItem('accessToken');
      if (!token) {
        return false;
      }
      
      // Make the API request with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      try {
        const response = await makeAuthenticatedRequest('/api/wishlist/my-wishlist', {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          console.warn('Failed to check wishlist status:', response.status);
          return false;
        }
        
        const wishlist = await response.json();
        
        if (!Array.isArray(wishlist)) {
          console.warn('Unexpected wishlist format:', wishlist);
          return false;
        }
        
        return wishlist.some(item => 
          item.product && item.product.id === productId
        );
      } catch (fetchError) {
        clearTimeout(timeoutId);
        if (fetchError.name === 'AbortError') {
          console.warn('Wishlist check timed out');
        }
        return false;
      }
    } catch (error) {
      console.error('Error checking wishlist:', error);
      return false; // Default to not in wishlist on any error
    }
  };
  
  /**
   * Toggle a product in the wishlist with comprehensive error handling
   * @param {string} productId - The ID of the product to toggle
   * @param {string} shopId - The ID of the shop the product belongs to
   * @returns {Promise<Object>} Result of the operation
   */
  const toggleWishlist = async (productId, shopId) => {
    if (!productId) {
      console.error('Invalid productId for toggleWishlist:', productId);
      return { success: false, error: 'Invalid product ID' };
    }
    
    try {
      // First check if product is in wishlist
      const inWishlist = await isInWishlist(productId);
      
      // Then perform the appropriate action
      if (inWishlist) {
        return removeFromWishlist(productId);
      } else {
        if (!shopId) {
          console.error('ShopId required for adding to wishlist');
          return { success: false, error: 'Shop ID is required to add to wishlist' };
        }
        return addToWishlist(productId, shopId);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      return { success: false, error: error.message || 'Failed to update wishlist' };
    }
  };
  
  return {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    // Expose the refresh function for direct use
    refreshWishlistCount: () => safelyRefreshCounts()
  };
};