import React, { useState } from 'react';
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
  const [showVariations, setShowVariations] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState(null);

  const formatPrice = (price) => {
    if (price == null) return '0.00';
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return numPrice.toFixed(2);
  };

  const calculateDiscountedPrice = (price) => {
    if (price == null) return '0.00';
    if (!discount) return price.toFixed(2);
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

  // Get min and max prices from variations
  const getPriceRange = () => {
    if (!product.variations || product.variations.length === 0) {
      return { min: product.price, max: product.price };
    }
    
    const prices = product.variations
      .filter(v => v.isActive && v.stockQuantity > 0)
      .map(v => parseFloat(v.price));
    
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  };

  // Get total stock quantity from all variations
  const getTotalStock = () => {
    if (!product.variations || product.variations.length === 0) {
      return product.stockQuantity;
    }
    return product.variations
      .filter(v => v.isActive)
      .reduce((total, v) => total + (parseInt(v.stockQuantity) || 0), 0);
  };

  const handleAddToCart = async (e, variation = null) => {
    e.stopPropagation();
    setIsLoading(true);
    try {
      const productToAdd = variation ? { ...product, ...variation } : product;
      const result = await handleCartOperation(productToAdd);
      if (!result.success) {
        alert(result.error);
      } else {
        alert('Added to cart successfully');
        setShowVariations(false);
      }
    } catch (error) {
      alert('Failed to add to cart');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVariationClick = (e, variation) => {
    e.stopPropagation();
    setSelectedVariation(variation);
  };

  const toggleVariations = (e) => {
    e.stopPropagation();
    setShowVariations(!showVariations);
  };

  const { min: minPrice, max: maxPrice } = getPriceRange();
  const totalStock = getTotalStock();
  const hasVariations = product.variations && product.variations.length > 0;

  return (
    <div 
      className="relative bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer"
      onClick={onNavigate}
    >
      {/* Wishlist Button */}
      <button 
        className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <Heart className="w-5 h-5 text-gray-400" />
      </button>

      {/* Flash Sale Badge */}
      {isFlashSale && (
        <div className="absolute top-2 left-2 z-10">
          <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
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

      {/* Image Container */}
      <div className="relative aspect-square">
        <img
          src={selectedVariation?.imageUrl || product.imageUrl || '/api/placeholder/400/400'}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {product.status && (
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
            {product.status}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3">
        {product.__shop__ && (
          <div className="flex items-center gap-2 mb-2">
            <img
              src={product.__shop__.logoUrl || '/api/placeholder/20/20'}
              alt={product.__shop__.name}
              className="w-4 h-4 rounded-full"
            />
            <span className="text-xs text-gray-500">{product.__shop__.name}</span>
          </div>
        )}

        <h3 className="font-medium text-sm mb-1 line-clamp-2 min-h-[2.5rem]">
          {product.name}
          {selectedVariation && (
            <span className="text-gray-500">
              {' - '}
              {[
                selectedVariation.size,
                selectedVariation.color,
                selectedVariation.material
              ].filter(Boolean).join(', ')}
            </span>
          )}
        </h3>

        <div className="flex items-baseline gap-2 mb-2">
          {hasVariations ? (
            <span className="text-lg font-bold text-red-500">
              ${isFlashSale ? calculateDiscountedPrice(minPrice) : formatPrice(minPrice)}
              {minPrice !== maxPrice && ` - $${isFlashSale ? calculateDiscountedPrice(maxPrice) : formatPrice(maxPrice)}`}
            </span>
          ) : (
            <>
              <span className="text-lg font-bold text-red-500">
                ${isFlashSale ? calculateDiscountedPrice(product.price) : formatPrice(product.price)}
              </span>
              {isFlashSale && (
                <>
                  <span className="text-sm text-gray-400 line-through">
                    ${formatPrice(product.price)}
                  </span>
                  <span className="text-xs text-red-500 font-medium">
                    -{discount}%
                  </span>
                </>
              )}
            </>
          )}
        </div>

        <div className="mb-3">
          {isFlashSale && totalStock > 0 && (
            <div className="w-full bg-gray-200 h-2 rounded-full mb-1">
              <div 
                className="bg-red-500 h-2 rounded-full"
                style={{ width: `${Math.min((totalStock / 100) * 100, 100)}%` }}
              />
            </div>
          )}
          <div className="flex justify-between text-xs text-gray-500">
            <span>{totalStock} left</span>
            {isFlashSale && <span>100 sold</span>}
          </div>
        </div>

        {/* Variations Section */}
        {hasVariations && (
          <div className="mb-3">
            <button
              className="w-full py-2 px-3 rounded-md border border-gray-200 text-sm flex items-center justify-between"
              onClick={toggleVariations}
            >
              <span>{selectedVariation ? 'Selected Variation' : 'Select Variation'}</span>
              <ChevronDown className={`w-4 h-4 transform transition-transform ${showVariations ? 'rotate-180' : ''}`} />
            </button>

            {showVariations && (
              <div className="mt-2 border border-gray-200 rounded-md max-h-48 overflow-y-auto">
                {product.variations.map((variation, index) => (
                  <div
                    key={index}
                    className={`p-2 border-b last:border-b-0 cursor-pointer hover:bg-gray-50 ${
                      selectedVariation === variation ? 'bg-gray-50' : ''
                    }`}
                    onClick={(e) => handleVariationClick(e, variation)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm">
                          {[variation.size, variation.color, variation.material]
                            .filter(Boolean)
                            .join(', ')}
                        </div>
                        <div className="text-xs text-gray-500">
                          Stock: {variation.stockQuantity}
                        </div>
                      </div>
                      <div className="text-sm font-medium">
                        ${formatPrice(variation.price)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <button 
          className={`w-full py-2 rounded-full text-sm font-medium flex items-center justify-center gap-2
            ${isLoading ? 'bg-gray-300 cursor-not-allowed' :
              (hasVariations ? selectedVariation?.isActive && selectedVariation?.stockQuantity > 0 : 
                product.isActive && totalStock > 0)
                ? 'bg-red-500 text-white active:bg-red-600'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          disabled={isLoading || 
            (hasVariations ? !selectedVariation || !selectedVariation.isActive || selectedVariation.stockQuantity === 0 
              : !product.isActive || totalStock === 0)}
          onClick={(e) => handleAddToCart(e, selectedVariation)}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              {hasVariations && !selectedVariation ? 'Select Variation' :
                totalStock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;