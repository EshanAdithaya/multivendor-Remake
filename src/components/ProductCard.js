import React, { useState, useEffect } from 'react';
import { ShoppingCart, Heart, Clock, ChevronDown } from 'lucide-react';
import { handleCartOperation } from '../utils/cartUtils';

const ProductCard = ({ 
  product, 
  isFlashSale = false, 
  saleEndsAt = null,
  discount = null,
  onNavigate
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState(
    product.variations?.length > 0 ? product.variations[0] : null
  );
  const [showVariations, setShowVariations] = useState(false);

  // Debug logs
  useEffect(() => {
    console.log('Product Data:', product);
    console.log('Selected Variation:', selectedVariation);
  }, [product, selectedVariation]);

  useEffect(() => {
    checkWishlistStatus();
  }, []);

  const checkWishlistStatus = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.log('No token found for wishlist check');
        return;
      }

      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/wishlist/my-wishlist`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': '*/*'
        },
      });
      
      if (response.ok) {
        const wishlist = await response.json();
        console.log('Wishlist data:', wishlist);
        setIsInWishlist(wishlist.some(item => item.product.id === product.id));
      } else {
        console.log('Failed to fetch wishlist:', response.status);
      }
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  };

  const handleWishlist = async (e) => {
    e.stopPropagation();
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('Please login to manage your wishlist');
      return;
    }

    setIsWishlistLoading(true);
    try {
      if (isInWishlist) {
        console.log('Removing from wishlist:', product.id);
        const response = await fetch(
          `${process.env.REACT_APP_BASE_URL}/api/wishlist/product/${product.id}`,
          {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': '*/*'
            },
          }
        );

        if (!response.ok) throw new Error('Failed to remove from wishlist');
        console.log('Successfully removed from wishlist');
      } else {
        console.log('Adding to wishlist:', {
          productId: product.id,
          shopId: product.__shop__?.id
        });
        
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/wishlist`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Accept': '*/*'
          },
          body: JSON.stringify({
            productId: product.id,
            shopId: product.__shop__?.id
          }),
        });

        if (!response.ok) throw new Error('Failed to add to wishlist');
        console.log('Successfully added to wishlist');
      }

      setIsInWishlist(!isInWishlist);
    } catch (error) {
      console.error('Error updating wishlist:', error);
      alert('Failed to update wishlist');
    } finally {
      setIsWishlistLoading(false);
    }
  };

  const formatPrice = (price) => {
    if (price == null) return '0.00';
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return numPrice.toFixed(2);
  };

  const calculateDiscountedPrice = (price) => {
    if (price == null) return '0.00';
    if (!discount) return formatPrice(price);
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return (numPrice * (1 - discount / 100)).toFixed(2);
  };

  const getTimeRemaining = (endTime) => {
    if (!endTime) return null;
    const total = Date.parse(endTime) - Date.parse(new Date());
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    return `${hours}h ${minutes}m`;
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    setIsLoading(true);
    console.log('Adding to cart:', {
      product: selectedVariation,
      shop: product.__shop__
    });

    try {
      const cartItem = {
        ...selectedVariation,
        name: product.name,
        shop: product.__shop__ || null
      };
      
      const result = await handleCartOperation(cartItem);
      console.log('Cart operation result:', result);
      
      if (!result.success) {
        alert(result.error);
      } else {
        alert('Added to cart successfully');
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('Failed to add to cart');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVariationClick = (e, variation) => {
    e.stopPropagation();
    console.log('Selected variation:', variation);
    setSelectedVariation(variation);
    setShowVariations(false);
  };

  if (!product.variations?.length || !selectedVariation) {
    console.log('Invalid product data:', { 
      hasVariations: !!product.variations?.length,
      selectedVariation 
    });
    return null;
  }

  return (
    <div 
      className="relative bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-300 overflow-hidden cursor-pointer"
      onClick={onNavigate}
    >
      {/* Wishlist Button */}
      <button 
        className={`absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow z-10 transition-all
          ${isWishlistLoading ? 'cursor-not-allowed opacity-70' : 'hover:bg-gray-50'}`}
        onClick={handleWishlist}
        disabled={isWishlistLoading}
      >
        {isWishlistLoading ? (
          <div className="w-4 h-4 border-2 border-gray-300 border-t-yellow-400 rounded-full animate-spin" />
        ) : (
          <Heart 
            className={`w-5 h-5 transition-colors ${
              isInWishlist ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'
            }`}
          />
        )}
      </button>

      {/* Flash Sale Badge */}
      {isFlashSale && (
        <div className="absolute top-2 left-2 z-10">
          <div className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Flash Sale
          </div>
          {saleEndsAt && (
            <div className="bg-black bg-opacity-70 text-white text-xs px-2 py-1 mt-1 rounded">
              {getTimeRemaining(saleEndsAt)}
            </div>
          )}
        </div>
      )}

      {/* Product Image */}
      <div className="relative aspect-square bg-gray-100">
        <img
          src={selectedVariation.imageUrl || product.imageUrl || '/api/placeholder/400/400'}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/api/placeholder/400/400';
          }}
        />
        {product.status && (
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
            {product.status}
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-4">
        {/* Shop Info */}
        {product.__shop__ && (
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 rounded-full overflow-hidden bg-gray-100">
              <img
                src={product.__shop__.logoUrl || '/api/placeholder/20/20'}
                alt={product.__shop__.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/api/placeholder/20/20';
                }}
              />
            </div>
            <span className="text-xs text-gray-500">{product.__shop__.name}</span>
            {product.__shop__.rating && (
              <span className="text-xs text-yellow-400">★ {product.__shop__.rating}</span>
            )}
          </div>
        )}

        {/* Product Name */}
        <h3 className="font-medium text-sm mb-2 line-clamp-2">
          {product.name}
          <span className="text-gray-500">
            {' - '}
            {[
              selectedVariation.size,
              selectedVariation.color,
              selectedVariation.material
            ].filter(Boolean).join(', ')}
          </span>
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-lg font-bold text-yellow-500">
            ${isFlashSale ? calculateDiscountedPrice(selectedVariation.price) : formatPrice(selectedVariation.price)}
          </span>
          {isFlashSale && (
            <>
              <span className="text-sm text-gray-400 line-through">
                ${formatPrice(selectedVariation.price)}
              </span>
              <span className="text-xs text-yellow-500 font-medium">
                -{discount}%
              </span>
            </>
          )}
        </div>

        {/* Variations Dropdown */}
        <div className="mb-3">
          <button
            className="w-full py-2 px-3 rounded border border-gray-200 text-sm flex items-center justify-between hover:bg-gray-50"
            onClick={(e) => {
              e.stopPropagation();
              setShowVariations(!showVariations);
            }}
          >
            <span>Select Variation</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showVariations ? 'rotate-180' : ''}`} />
          </button>
          
          {showVariations && (
            <div className="absolute left-0 right-0 mt-1 mx-4 bg-white border border-gray-200 rounded shadow-lg z-20 max-h-48 overflow-y-auto">
              {product.variations.map((variation, index) => (
                <button
                  key={variation.id || index}
                  className={`w-full p-2 text-left hover:bg-gray-50 ${
                    selectedVariation.id === variation.id ? 'bg-gray-50' : ''
                  }`}
                  onClick={(e) => handleVariationClick(e, variation)}
                >
                  <div className="flex justify-between items-center">
                    <span>
                      {[variation.size, variation.color, variation.material]
                        .filter(Boolean)
                        .join(', ')}
                    </span>
                    <span className="text-sm font-medium">
                      ${formatPrice(variation.price)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Stock: {variation.stockQuantity} · SKU: {variation.sku}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-400">
            <span>{selectedVariation.stockQuantity} left</span>
            <span>SKU: {selectedVariation.sku}</span>
            {isFlashSale && <span>100 sold</span>}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button 
          className={`w-full py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2
            ${isLoading ? 'bg-gray-100 cursor-not-allowed' :
              selectedVariation.isActive && selectedVariation.stockQuantity > 0
                ? 'bg-yellow-400 text-white hover:bg-yellow-500 active:bg-yellow-600'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          disabled={isLoading || !selectedVariation.isActive || selectedVariation.stockQuantity === 0}
          onClick={handleAddToCart}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              {selectedVariation.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;