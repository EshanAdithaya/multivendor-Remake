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
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [featuredLoading, setFeaturedLoading] = useState(false);
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

  // Fetch featured products
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      if (!product) return;
      
      setFeaturedLoading(true);
      try {
        // Fetch products from the same category or shop
        const categoryParam = product.category?.id ? `categoryId=${product.category.id}` : '';
        const shopParam = product.__shop__?.id ? `shopId=${product.__shop__.id}` : '';
        
        // Prioritize same category, fallback to same shop
        const queryParam = categoryParam || shopParam;
        const response = await fetch(`${API_REACT_APP_BASE_URL}/api/products/get-all-with-filters?${queryParam}&limit=10`);
        
        if (response.ok) {
          const data = await response.json();
          // Filter out current product and only include products with variations
          const filtered = data
            .filter(p => p.id !== product.id && p.variations?.length > 0)
            .slice(0, 8); // Limit to 8 products for better mobile experience
          setFeaturedProducts(filtered);
        }
      } catch (error) {
        console.error('Failed to fetch featured products:', error);
      } finally {
        setFeaturedLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, [product]);

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
    if (variation.name) attributes.push(variation.name);
    if (variation.size) attributes.push(variation.size);
    if (variation.weight) attributes.push(`${variation.weight}g`);
    if (variation.color) attributes.push(variation.color);
    if (variation.material) attributes.push(variation.material);
    if (variation.flavour) attributes.push(variation.flavour);
    if (variation.fragrance) attributes.push(variation.fragrance);
    if (variation.capacity) attributes.push(variation.capacity);
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

        {/* Enhanced Variations Selection */}
        {product.variations && product.variations.length > 0 && (
          <div className="bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 rounded-2xl p-4 shadow-lg border-2 border-orange-200">
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent mb-2">
                🎁 Choose Your Perfect Option
              </h3>
              <p className="text-sm text-gray-600">Select the variation that's best for your pet</p>
            </div>
            
            <div className="space-y-3">
              {product.variations.map((variation, index) => (
                <div
                  key={variation.id}
                  className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer
                    ${selectedVariation?.id === variation.id 
                      ? 'border-orange-400 bg-gradient-to-r from-orange-100 via-yellow-100 to-amber-100 shadow-lg scale-[1.02]'
                      : 'border-orange-200 bg-white hover:border-orange-300 hover:shadow-md'
                    }`}
                  onClick={() => setSelectedVariation(variation)}
                >
                  {/* Selection Indicator */}
                  {selectedVariation?.id === variation.id && (
                    <div className="absolute top-3 right-3 w-6 h-6 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center shadow-md">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  )}
                  
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        {/* Main Variation Title */}
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">
                            {variation.color ? '🎨' : variation.size ? '📏' : variation.flavour ? '🍖' : variation.fragrance ? '🌸' : '🐾'}
                          </span>
                          <h4 className="font-bold text-gray-900 text-base">
                            {getVariationDisplayText(variation)}
                          </h4>
                        </div>
                        
                        {/* Variation Details Grid */}
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          {variation.size && (
                            <div className="flex items-center gap-1">
                              <span className="text-xs">📏</span>
                              <span className="text-xs font-medium text-gray-700">Size: {variation.size}</span>
                            </div>
                          )}
                          {variation.weight && (
                            <div className="flex items-center gap-1">
                              <span className="text-xs">⚖️</span>
                              <span className="text-xs font-medium text-gray-700">Weight: {variation.weight}g</span>
                            </div>
                          )}
                          {variation.color && (
                            <div className="flex items-center gap-1">
                              <span className="text-xs">🎨</span>
                              <span className="text-xs font-medium text-gray-700">Color: {variation.color}</span>
                            </div>
                          )}
                          {variation.flavour && (
                            <div className="flex items-center gap-1">
                              <span className="text-xs">🍖</span>
                              <span className="text-xs font-medium text-gray-700">Flavor: {variation.flavour}</span>
                            </div>
                          )}
                          {variation.fragrance && (
                            <div className="flex items-center gap-1">
                              <span className="text-xs">🌸</span>
                              <span className="text-xs font-medium text-gray-700">Scent: {variation.fragrance}</span>
                            </div>
                          )}
                          {variation.capacity && (
                            <div className="flex items-center gap-1">
                              <span className="text-xs">🥤</span>
                              <span className="text-xs font-medium text-gray-700">Capacity: {variation.capacity}</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Stock and SKU */}
                        <div className="flex items-center gap-4">
                          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            variation.stockQuantity > 10 
                              ? 'bg-green-100 text-green-700' 
                              : variation.stockQuantity > 0 
                                ? 'bg-yellow-100 text-yellow-700' 
                                : 'bg-red-100 text-red-700'
                          }`}>
                            <span>📦</span>
                            <span>
                              {variation.stockQuantity > 10 
                                ? 'In Stock' 
                                : variation.stockQuantity > 0 
                                  ? `Only ${variation.stockQuantity} left` 
                                  : 'Out of Stock'
                              }
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">SKU: {variation.sku}</span>
                        </div>
                      </div>
                      
                      {/* Price Tag */}
                      <div className="ml-3 flex-shrink-0">
                        <div className={`px-4 py-3 rounded-xl font-bold text-white shadow-lg ${
                          selectedVariation?.id === variation.id
                            ? 'bg-gradient-to-r from-orange-500 to-yellow-500 scale-110'
                            : 'bg-gradient-to-r from-gray-400 to-gray-500'
                        } transition-all duration-300`}>
                          <div className="text-center">
                            <div className="text-lg">{formatPrice(variation.price)}</div>
                            {variation.stockQuantity === 0 && (
                              <div className="text-xs opacity-75">Unavailable</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Selection Call to Action */}
                    {selectedVariation?.id === variation.id && (
                      <div className="mt-3 p-3 bg-white/80 rounded-xl border border-orange-200">
                        <div className="flex items-center justify-center gap-2 text-orange-600">
                          <span className="text-sm">✓</span>
                          <span className="text-sm font-semibold">Perfect choice for your pet!</span>
                          <span className="text-sm">🐾</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Selection Summary */}
            {!selectedVariation && (
              <div className="mt-4 p-3 bg-white/60 rounded-xl border border-orange-200 text-center">
                <p className="text-sm text-gray-600">👆 Please select an option above to continue</p>
              </div>
            )}
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
          <div 
            onClick={() => navigate(`/shopShow?token=${product.__shop__.id}`)}
            className="bg-white rounded-2xl p-4 shadow-lg border border-orange-100 cursor-pointer hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 hover:border-orange-200"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                🏪 Sold by
              </h3>
              <ChevronRight className="w-4 h-4 text-orange-500" />
            </div>
            
            <div className="flex items-center gap-3 mb-3">
              {product.__shop__.logoUrl ? (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 via-yellow-400 to-amber-400 p-0.5 shadow-md flex-shrink-0">
                  <div className="w-full h-full rounded-xl bg-white flex items-center justify-center overflow-hidden">
                    <img
                      src={product.__shop__.logoUrl}
                      alt={product.__shop__.name}
                      className="w-6 h-6 object-contain"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <div className="text-lg" style={{ display: 'none' }}>🏪</div>
                  </div>
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 via-yellow-400 to-amber-400 flex items-center justify-center text-lg shadow-md flex-shrink-0">
                  🏪
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-900 text-base truncate">{product.__shop__.name}</h4>
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  <span>📍</span>
                  {product.__shop__.city && product.__shop__.state 
                    ? `${product.__shop__.city}, ${product.__shop__.state}`
                    : 'Location not specified'
                  }
                </p>
              </div>
            </div>

            {product.__shop__.description && (
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-3 border border-orange-100 mb-3">
                <p className="text-gray-700 text-xs leading-relaxed line-clamp-2">{product.__shop__.description}</p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-600">Tap to visit shop</span>
              <div className="px-3 py-1.5 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-lg border border-orange-200">
                <span className="text-xs font-bold text-orange-700">View Shop</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <div className="px-4 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-orange-100">
            <h3 className="text-base font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent mb-4 flex items-center gap-2">
              ⭐ You might also like
            </h3>
            
            {featuredLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-orange-500 border-t-transparent"></div>
              </div>
            ) : (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {featuredProducts.map((featuredProduct) => (
                  <div key={featuredProduct.id} className="flex-shrink-0 w-36">
                    <div 
                      onClick={() => navigate(`/productDetails?key=${featuredProduct.id}`)}
                      className="cursor-pointer"
                    >
                      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
                        {/* Product Image */}
                        <div className="relative">
                          <img
                            src={featuredProduct.imageUrls?.[0] || '/api/placeholder/150/150'}
                            alt={featuredProduct.name}
                            className="w-full h-24 object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/api/placeholder/150/150';
                            }}
                          />
                          {featuredProduct.__shop__ && (
                            <div className="absolute top-1 right-1 bg-white/90 rounded-full p-1">
                              <img
                                src={featuredProduct.__shop__.logoUrl || '/api/placeholder/20/20'}
                                alt={featuredProduct.__shop__.name}
                                className="w-4 h-4 rounded-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            </div>
                          )}
                        </div>
                        
                        {/* Product Info */}
                        <div className="p-2">
                          <h4 className="text-xs font-medium text-gray-900 line-clamp-2 mb-1">
                            {featuredProduct.name}
                          </h4>
                          
                          {featuredProduct.variations && featuredProduct.variations.length > 0 && (
                            <div className="text-xs font-bold text-orange-600">
                              ${Math.min(...featuredProduct.variations.map(v => v.price)).toFixed(2)}
                              {featuredProduct.variations.length > 1 && (
                                <span className="text-gray-500 font-normal"> +</span>
                              )}
                            </div>
                          )}
                          
                          {featuredProduct.__shop__ && (
                            <p className="text-xs text-gray-500 truncate mt-1">
                              {featuredProduct.__shop__.name}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="px-4 mb-20">
        <ProductReviews productId={product.id} />
      </div>
    </div>
  );
};

export default ProductDetail;