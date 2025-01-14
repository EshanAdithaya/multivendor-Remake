import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import Cookies from 'js-cookie';

const API_REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;

// Enhanced auth checking utilities
export const checkAuth = () => {
  console.log('🔒 Starting authentication check...');
  const token = localStorage.getItem('accessToken');
  
  if (!token) {
    console.warn('❌ No access token found in localStorage');
    return false;
  }
  
  try {
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      console.warn('❌ Invalid token format - expected 3 parts, got:', tokenParts.length);
      return false;
    }
    
    const payload = JSON.parse(atob(tokenParts[1]));
    console.log('🔍 Token payload:', { ...payload, exp: new Date(payload.exp * 1000) });
    
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      console.warn('⏰ Token expired at:', new Date(payload.exp * 1000));
      localStorage.removeItem('accessToken');
      return false;
    }
    
    console.log('✅ User is authenticated');
    return true;
  } catch (error) {
    console.error('❌ Error validating token:', error);
    return false;
  }
};

export const saveCurrentUrl = () => {
  const currentPath = window.location.pathname + window.location.search;
  console.log('💾 Saving redirect URL:', currentPath);
  Cookies.set('redirectUrl', currentPath, { expires: 1 });
};

const informAndRedirectToLogin = (navigate) => {
  console.log('🔄 Redirecting to login...');
  alert('Please log in to continue shopping');
  saveCurrentUrl();
  navigate('/login');
};

export const useAddToCart = () => {
  const [addingToCart, setAddingToCart] = useState(false);
  const navigate = useNavigate();

  const checkExistingCart = async (shopId, token) => {
    console.log('🔍 Checking existing cart for shop:', shopId);
    try {
      const url = `${API_REACT_APP_BASE_URL}/api/carts/shop/${shopId}`;
      console.log('📡 Making request to:', url);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('📥 Cart check response status:', response.status);
      
      if (response.status === 404) {
        console.log('ℹ️ No existing cart found');
        return null;
      }
      
      if (!response.ok) {
        throw new Error(`Failed to check cart: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📦 Existing cart data:', data);
      return data;
    } catch (error) {
      console.error('❌ Error checking existing cart:', error);
      throw error;
    }
  };

  const updateExistingCart = async (shopId, variations, token) => {
    console.log('🔄 Updating cart for shop:', shopId);
    console.log('📦 Variations to update:', variations);
    
    try {
      const url = `${API_REACT_APP_BASE_URL}/api/carts`;
      console.log('📡 Making PATCH request to:', url);
      
      const payload = {
        shopId: shopId,
        updatedVariations: variations.map(v => ({
          variationId: v.variationId,
          quantity: v.quantity
        }))
      };
      
      console.log('📤 Update payload:', payload);
      
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      console.log('📥 Update response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to update cart: ${errorData.message || response.status}`);
      }

      const data = await response.json();
      console.log('✅ Cart updated successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Error updating cart:', error);
      throw error;
    }
  };

  const createNewCart = async (product, quantity, token) => {
    console.log('🛍️ Creating new cart for product:', product.id);
    try {
      if (!product.variations || product.variations.length === 0) {
        throw new Error('Product has no variations');
      }

      // Handle multiple variations if they exist
      const variations = product.variations.map(variation => ({
        variationId: variation.id,
        quantity: quantity,
        price: variation.price,
        name: product.name,
        imageUrl: variation.imageUrl || product.imageUrl,
        // Add any additional variation-specific properties
        size: variation.size,
        color: variation.color,
        material: variation.material,
        sku: variation.sku,
        weight: variation.weight
      }));

      const cartData = {
        shopId: product.__shop__.id,
        productVariations: variations
      };

      console.log('📤 Create cart payload:', cartData);
      
      const response = await fetch(`${API_REACT_APP_BASE_URL}/api/carts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(cartData)
      });

      console.log('📥 Create cart response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to create cart: ${errorData.message || response.status}`);
      }

      const data = await response.json();
      console.log('✅ Cart created successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Error creating cart:', error);
      throw error;
    }
  };

  const addToCart = async (product, quantity = 1) => {
    console.log('🛒 Starting add to cart process');
    console.log('📦 Product:', product);
    console.log('🔢 Quantity:', quantity);
    
    const isAuthenticated = checkAuth();
    
    if (!isAuthenticated) {
      console.log('❌ User not authenticated');
      informAndRedirectToLogin(navigate);
      return false;
    }

    setAddingToCart(true);
    const token = localStorage.getItem('accessToken');

    try {
      const existingCart = await checkExistingCart(product.__shop__.id, token);
      
      if (existingCart) {
        console.log('🛍️ Found existing cart, preparing update...');
        
        // Handle multiple variations
        const updatedVariations = product.variations.map(variation => {
          const existingItem = existingCart.cartItems?.find(
            item => item.productVariation.id === variation.id
          );
          
          return {
            variationId: variation.id,
            quantity: existingItem ? existingItem.quantity + quantity : quantity
          };
        });

        await updateExistingCart(product.__shop__.id, updatedVariations, token);
      } else {
        console.log('🆕 No existing cart, creating new one...');
        await createNewCart(product, quantity, token);
      }

      console.log('✅ Cart operation completed successfully');
      alert('Product added to cart!');
      return true;

    } catch (error) {
      console.error('❌ Cart operation failed:', error);
      if (error.message.includes('401')) {
        console.log('🔒 Authentication error, redirecting to login...');
        informAndRedirectToLogin(navigate);
      } else {
        alert('Failed to add to cart. Please try again.');
      }
      return false;
    } finally {
      setAddingToCart(false);
    }
  };

  return { addToCart, addingToCart };
};

export const AddToCartButton = ({ product, className = "" }) => {
  const { addToCart, addingToCart } = useAddToCart();

  const handleClick = async () => {
    console.log('🖱️ Add to cart button clicked');
    console.log('📦 Product details:', {
      id: product.id,
      name: product.name,
      shopId: product.__shop__?.id,
      variations: product.variations?.length
    });
    
    await addToCart(product);
  };

  return (
    <button
      onClick={handleClick}
      disabled={addingToCart}
      className={`p-2 bg-yellow-400 rounded-full shadow-lg hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      <ShoppingCart className="w-5 h-5 text-white" />
    </button>
  );
};