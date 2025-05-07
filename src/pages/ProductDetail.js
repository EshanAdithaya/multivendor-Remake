import React, { useState, useEffect, useRef } from 'react';
import { Heart, ChevronRight, Minus, Plus } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ProductReviews from '../components/ProductReviews';
import Lottie from 'lottie-web';
import addedToCartAnimation from '../Assets/animations/cutedog.json';
import loaderAnimation from '../Assets/animations/loading.json';
import { checkAuth, getAuthHeader, redirectToLogin } from '../utils/cartUtils';

const API_REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;

const ProductDetail = () => {
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState(null);
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [isPopupMounted, setIsPopupMounted] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const lottieContainer = useRef(null);
  const addedToCartAnimationRef = useRef(null);
  const loaderContainer = useRef(null);

  // Add this new useEffect to scroll to top when page loads or product changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [location.search]); // Dependency on location.search to run when the product ID changes

  // Check wishlist status
  const checkWishlistStatus = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token || !product) return;

      const response = await fetch(`${API_REACT_APP_BASE_URL}/api/wishlist/my-wishlist`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
      });
      
      if (response.ok) {
        const wishlist = await response.json();
        setIsLiked(wishlist.some(item => item.product.id === product.id));
      }
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  };

  // Handle wishlist toggle
  const handleWishlistToggle = async (e) => {
    e.stopPropagation();
    const token = localStorage.getItem('accessToken');
    if (!token) {
      redirectToLogin(navigate);
      return;
    }

    setIsWishlistLoading(true);
    try {
      if (isLiked) {
        // Remove from wishlist
        const response = await fetch(
          `${API_REACT_APP_BASE_URL}/api/wishlist/product/${product.id}`,
          {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
            },
          }
        );

        if (!response.ok) throw new Error('Failed to remove from wishlist');
      } else {
        // Add to wishlist
        const response = await fetch(`${API_REACT_APP_BASE_URL}/api/wishlist`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            productId: product.id,
            shopId: product.__shop__?.id
          }),
        });

        if (!response.ok) throw new Error('Failed to add to wishlist');
      }

      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error updating wishlist:', error);
      alert('Failed to update wishlist');
    } finally {
      setIsWishlistLoading(false);
    }
  };

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      const params = new URLSearchParams(location.search);
      const productId = params.get('key');
      if (!productId) return;
      
      try {
        const response = await fetch(`${API_REACT_APP_BASE_URL}/api/products/${productId}`);
        if (!response.ok) throw new Error('Product not found');
        const data = await response.json();
        
        // If there's only one variation, select it by default
        if (data.variations?.length === 1) {
          setSelectedVariation(data.variations[0]);
        }
        setProduct(data);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      }
    };
    
    fetchProduct();
  }, [location]);

  // Check wishlist status when product is loaded
  useEffect(() => {
    if (product) {
      checkWishlistStatus();
    }
  }, [product]);

  // Lottie animation for added to cart popup
  useEffect(() => {
    if (isPopupMounted && lottieContainer.current) {
      addedToCartAnimationRef.current = Lottie.loadAnimation({
        container: lottieContainer.current,
        renderer: 'svg',
        loop: false,
        autoplay: true,
        animationData: addedToCartAnimation
      });

      return () => {
        if (addedToCartAnimationRef.current) {
          addedToCartAnimationRef.current.destroy();
        }
      };
    }
  }, [isPopupMounted]);

  // Lottie animation for loading screen
  useEffect(() => {
    if (isLoading && loaderContainer.current) {
      const loaderAnimationInstance = Lottie.loadAnimation({
        container: loaderContainer.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: loaderAnimation
      });

      return () => {
        if (loaderAnimationInstance) {
          loaderAnimationInstance.destroy();
        }
      };
    }
  }, [isLoading]);

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!selectedVariation) {
      alert('Please select a variation');
      return;
    }

    // Check auth first
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
      redirectToLogin(navigate);
      return;
    }

    setIsLoading(true);
    try {
      const shopId = product.__shop__?.id;
      if (!shopId) {
        throw new Error('Shop information not found');
      }

      // Step 1: Check if there's an existing cart for this shop
      const userCartsResponse = await fetch(
        `${API_REACT_APP_BASE_URL}/api/carts/user`,
        { headers: getAuthHeader() }
      );

      let existingCart = null;
      if (userCartsResponse.ok) {
        const userCarts = await userCartsResponse.json();
        existingCart = userCarts.find(cart => cart.shop.id === shopId);
      }

      // Step 2: Based on whether cart exists, create or update
      if (!existingCart) {
        // Create new cart for this shop
        const createResponse = await fetch(
          `${API_REACT_APP_BASE_URL}/api/carts`,
          {
            method: 'POST',
            headers: getAuthHeader(),
            body: JSON.stringify({
              shopId: shopId,
              productVariations: [{
                variationId: selectedVariation.id,
                quantity: quantity
              }]
            })
          }
        );

        if (!createResponse.ok) {
          const errorData = await createResponse.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to create cart');
        }
      } else {
        // Update existing cart
        const existingItem = existingCart.cartItems.find(
          item => item.productVariation.id === selectedVariation.id
        );
        
        const updatedQuantity = existingItem 
          ? existingItem.quantity + quantity 
          : quantity;

        const updateResponse = await fetch(
          `${API_REACT_APP_BASE_URL}/api/carts`,
          {
            method: 'PATCH',
            headers: getAuthHeader(),
            body: JSON.stringify({
              shopId: shopId,
              updatedVariations: [{
                variationId: selectedVariation.id,
                quantity: updatedQuantity
              }]
            })
          }
        );

        if (!updateResponse.ok) {
          const errorData = await updateResponse.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to update cart');
        }
      }

      // Show success popup
      setIsPopupMounted(true);
      setTimeout(() => setIsPopupVisible(true), 50);
      
      // Auto hide after 3 seconds
      setTimeout(() => {
        handleClosePopup();
      }, 3000);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert(error.message || 'Failed to add to cart');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
    setTimeout(() => setIsPopupMounted(false), 300); // Wait for fade out animation
  };

  // Helper functions
  const getVariationDisplayText = (variation) => {
    const attributes = [];
    if (variation.size) attributes.push(variation.size);
    if (variation.weight) attributes.push(`${variation.weight}g`);
    if (variation.color) attributes.push(variation.color);
    if (variation.material) attributes.push(variation.material);
    return attributes.join(' - ') || 'Standard';
  };

  const formatPrice = (price) => {
    if (price == null) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div ref={loaderContainer} className="w-32 h-32"></div>
      </div>
    );
  }

  const images = [
    selectedVariation?.imageUrl || product.imageUrl || '/api/placeholder/400/400',
    '/api/placeholder/400/400'
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white relative">
      {/* Added to Cart Popup */}
      {isPopupMounted && (
        <div 
          className={`fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-black/50 transition-opacity duration-300 ${
            isPopupVisible ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={handleClosePopup}
        >
          <div 
            className={`bg-white rounded-lg shadow-lg p-6 text-center relative transform transition-all duration-300 ${
              isPopupVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={handleClosePopup}
              className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
            >
              <span className="text-gray-500 text-xl">&times;</span>
            </button>
            <div ref={lottieContainer} className="w-32 h-32 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold">Added to Cart</h3>
            <p className="text-gray-600">Your item has been successfully added to the cart.</p>
          </div>
        </div>
      )}

      <Header />

      <div className="relative px-4 mb-4">
        <img
          src={images[selectedImage]}
          alt={product.name}
          className="w-full aspect-square object-cover rounded-lg"
        />
        <div className="absolute right-6 top-1/2 bg-white rounded-full p-2 shadow-md">
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>

      <div className="flex gap-4 px-4 mb-6 overflow-x-auto">
        {images.map((img, index) => (
          <button
            key={index}
            className={`border-2 rounded-lg p-1 flex-shrink-0 ${
              selectedImage === index ? 'border-yellow-400' : 'border-gray-200'
            }`}
            onClick={() => setSelectedImage(index)}
          >
            <img src={img} alt={`${product.name} ${index + 1}`} className="w-20 h-20 object-cover" />
          </button>
        ))}
      </div>

      <div className="px-4 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">{product.name}</h1>
          <button
            className={`p-2 rounded-full ${isLiked ? 'text-yellow-400' : 'text-gray-400'}`}
            onClick={handleWishlistToggle}
            disabled={isWishlistLoading}
          >
            {isWishlistLoading ? (
              <div className="w-6 h-6 border-2 border-gray-300 border-t-yellow-400 rounded-full animate-spin" />
            ) : (
              <Heart className="w-6 h-6" fill={isLiked ? "currentColor" : "none"} />
            )}
          </button>
        </div>

        {product.__shop__?.rating && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-yellow-400 text-white px-2 py-1 rounded">
              <span>{product.__shop__.rating}</span>
              <span>★</span>
            </div>
          </div>
        )}

        <p className="text-gray-600">{product.description}</p>

        {/* Variations */}
        {product.variations && product.variations.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium">Select Option</h3>
            <div className="space-y-2">
              {product.variations.map((variation) => (
                <button
                  key={variation.id}
                  onClick={() => setSelectedVariation(variation)}
                  className={`w-full p-3 rounded-lg border text-left
                    ${selectedVariation?.id === variation.id 
                      ? 'border-yellow-400 bg-yellow-50'
                      : 'border-gray-200 hover:border-yellow-400'
                    }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{getVariationDisplayText(variation)}</div>
                      <div className="text-sm text-gray-500">
                        SKU: {variation.sku} • Stock: {variation.stockQuantity}
                      </div>
                    </div>
                    <div className="text-yellow-500 font-bold">
                      {formatPrice(variation.price)}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity Selector */}
        <div className="flex items-center justify-between bg-yellow-400 rounded-lg p-2">
          <button 
            className="p-2 text-white" 
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <Minus className="w-5 h-5" />
          </button>
          <span className="text-white font-medium">{quantity}</span>
          <button 
            className="p-2 text-white"
            onClick={() => selectedVariation && quantity < selectedVariation.stockQuantity && setQuantity(quantity + 1)}
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center text-sm text-gray-600">
          {selectedVariation 
            ? `${selectedVariation.stockQuantity} pieces available`
            : 'Select an option'
          }
        </div>

        {/* Add to Cart Button */}
        <button
          className={`w-full py-3 rounded-lg font-medium
            ${selectedVariation?.stockQuantity > 0 && !isLoading
              ? 'bg-yellow-400 text-white hover:bg-yellow-500'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          disabled={!selectedVariation || selectedVariation.stockQuantity === 0 || isLoading}
          onClick={handleAddToCart}
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
          ) : (
            !selectedVariation
              ? 'Select Option'
              : selectedVariation.stockQuantity === 0
                ? 'Out of Stock'
                : 'Add to Cart'
          )}
        </button>

        {/* Shop Details */}
        {product.__shop__ && (
          <div className="space-y-4 pt-4">
            <div>
              <span className="font-medium">Seller</span>
              <div className="mt-2">
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                  {product.__shop__.name}
                </span>
              </div>
            </div>

            <div className="pb-6">
              <h2 className="font-medium mb-2">Shop Details</h2>
              <div className="text-gray-600 space-y-2">
                <p>{product.__shop__.description}</p>
                <p>{product.__shop__.address}</p>
                <p>{product.__shop__.city}, {product.__shop__.state}</p>
                <p>Contact: {product.__shop__.email}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="px-4 mb-20">
        <ProductReviews productId={product.id} />
      </div>
    </div>
  );
};

export default ProductDetail;