import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package } from 'lucide-react';
import Cookies from 'js-cookie';

// Enhanced auth checking utilities
export const checkAuth = () => {
  console.log('Checking authentication status...');
  const token = localStorage.getItem('accessToken');
  
  if (!token) {
    console.log('No access token found - user is not authenticated');
    return false;
  }
  
  try {
    // Add basic token validation
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      console.log('Invalid token format');
      return false;
    }
    
    // Check token expiration if present in payload
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

export const useAddToCart = () => {
  const [addingToCart, setAddingToCart] = useState(false);
  const navigate = useNavigate();

  const addToCart = async (product, quantity = 1) => {
    console.log('Starting add to cart process for product:', product.id);
    
    const isAuthenticated = checkAuth();
    
    if (!isAuthenticated) {
      console.log('User not authenticated, redirecting to login');
      saveCurrentUrl();
      navigate('/login');
      return false;
    }

    setAddingToCart(true);
    console.log('Setting addingToCart state to true');

    try {
      console.log('Preparing cart data...');
      
      if (!product.variations || product.variations.length === 0) {
        console.error('Product variations not found');
        throw new Error('Product configuration is invalid');
      }

      const variation = product.variations[0];
      
      if (!product.__shop__?.id) {
        console.error('Shop information not found');
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

      console.log('Cart data prepared:', cartData);

      const token = localStorage.getItem('accessToken');
      console.log('Sending request to add to cart...');
      
      const response = await fetch('https://ppabanckend.adaptable.app/api/carts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(cartData)
      });

      if (!response.ok) {
        console.error('Server response not OK:', response.status);
        throw new Error('Failed to add to cart');
      }

      console.log('Product successfully added to cart');
      alert('Product added to cart successfully!');
      return true;

    } catch (error) {
      console.error('Error in addToCart:', error);
      alert('Failed to add product to cart. Please try again.');
      return false;
    } finally {
      console.log('Setting addingToCart state to false');
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
      <Package className="w-5 h-5 text-white" />
    </button>
  );
};