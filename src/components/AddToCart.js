import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import Cookies from 'js-cookie';

const API_REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL ;

// Auth checking utilities
export const checkAuth = () => {
  console.log('Checking authentication status...');
  const token = localStorage.getItem('accessToken');
  
  if (!token) {
    console.log('No access token found - user is not authenticated');
    return false;
  }
  
  try {
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      console.log('Invalid token format');
      return false;
    }
    
    const payload = JSON.parse(atob(tokenParts[1]));
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      console.log('Token has expired');
      localStorage.removeItem('accessToken');
      return false;
    }
    
    console.log('User is authenticated');
    return true;
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
};

export const saveCurrentUrl = () => {
  const currentPath = window.location.pathname + window.location.search;
  console.log('Saving current URL for redirect:', currentPath);
  Cookies.set('redirectUrl', currentPath, { expires: 1 });
};

const informAndRedirectToLogin = (navigate) => {
  alert('You are not authenticated. Redirecting to login page...');
  saveCurrentUrl();
  navigate('/login');
};

export const useAddToCart = () => {
  const [addingToCart, setAddingToCart] = useState(false);
  const navigate = useNavigate();

  const checkExistingCart = async (shopId, token) => {
    try {
      const response = await fetch(`${API_REACT_APP_BASE_URL}/api/carts/shop/${shopId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Error checking existing cart:', error);
      return null;
    }
  };

  const updateExistingCart = async (shopId, variationId, quantity, token) => {
    try {
      const response = await fetch(`${API_REACT_APP_BASE_URL}/api/carts`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          shopId: shopId,
          updatedVariations: [{
            variationId: variationId,
            quantity: quantity
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update cart');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating cart:', error);
      throw error;
    }
  };

  const createNewCart = async (product, quantity, token) => {
    try {
      if (!product.variations || product.variations.length === 0) {
        throw new Error('Product configuration is invalid');
      }

      const variation = product.variations[0];
      
      if (!product.__shop__?.id) {
        throw new Error('Product shop information is missing');
      }

      const cartData = {
        productId: product.id,
        quantity: 1,
        shopId: product.__shop__.id,
        price: product.price,
        name: product.name,
        description: product.description,
        imageUrl: product.imageUrl,
        categoryId: product.category?.id,
        productGroupId: product.productGroup?.id,
        manufacturerId: product.manufacturer?.id,
        productVariations: [
          {
            variationId: variation.id,
            quantity: quantity,
            price: variation.price,
            name: product.name,
            imageUrl: variation.imageUrl || product.imageUrl
          }
        ]
      };

      const response = await fetch(`${API_REACT_APP_BASE_URL}/api/carts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(cartData)
      });

      if (!response.ok) {
        throw new Error('Failed to create cart');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating cart:', error);
      throw error;
    }
  };

  const addToCart = async (product, quantity = 1) => {
    console.log('Starting add to cart process for product:', product.id);
    
    const isAuthenticated = checkAuth();
    
    if (!isAuthenticated) {
      console.log('User not authenticated, informing user and redirecting to login');
      informAndRedirectToLogin(navigate);
      return false;
    }

    setAddingToCart(true);
    const token = localStorage.getItem('accessToken');

    try {
      // Check if a cart exists for this shop
      const existingCart = await checkExistingCart(product.__shop__.id, token);
      
      if (existingCart) {
        console.log('Existing cart found, updating...');
        // Check if variation already exists in cart
        const existingVariation = existingCart.cartItems.find(
          item => item.productVariation.id === product.variations[0].id
        );
        
        if (existingVariation) {
          // Update existing variation quantity
          const newQuantity = existingVariation.quantity + quantity;
          await updateExistingCart(
            product.__shop__.id,
            product.variations[0].id,
            newQuantity,
            token
          );
        } else {
          // Add new variation to existing cart
          await updateExistingCart(
            product.__shop__.id,
            product.variations[0].id,
            quantity,
            token
          );
        }
      } else {
        console.log('No existing cart, creating new cart...');
        await createNewCart(product, quantity, token);
      }

      console.log('Cart operation successful');
      alert('Product added to cart successfully!');
      return true;

    } catch (error) {
      console.error('Error in addToCart:', error);
      alert('Failed to add product to cart. Please try again.');
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
    console.log('Add to cart button clicked for product:', product.id);
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