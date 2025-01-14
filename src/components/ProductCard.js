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
  const [selectedVariation, setSelectedVariation] = useState(
    product.variations?.length > 0 ? product.variations[0] : null
  );
  const [showVariations, setShowVariations] = useState(false);

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

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    setIsLoading(true);
    try {
      const cartItem = {
        ...product,
        ...selectedVariation,
        shop: product.__shop__ || null  // Include shop information
      };
      const result = await handleCartOperation(cartItem);
      if (!result.success) {
        alert(result.error);
      } else {
        alert('Added to cart successfully');
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
    setShowVariations(false);
  };

  // If no variations or no selected variation, don't render anything
  if (!product.variations?.length || !selectedVariation) return null;

  return (
    <div 
      className="relative bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer"
      onClick={onNavigate}
    >
      <button 
        className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <Heart className="w-5 h-5 text-gray-400" />
      </button>

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

      <div className="relative aspect-square">
        <img
          src={selectedVariation.imageUrl || product.imageUrl || '/api/placeholder/400/400'}
          alt={`${product.name} ${[selectedVariation.size, selectedVariation.color, selectedVariation.material].filter(Boolean).join(', ')}`}
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

      <div className="p-3">
        {product.__shop__ && (
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
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
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-400">{product.__shop__.name}</span>
              {product.__shop__.rating && (
                <span className="text-xs text-yellow-400">★ {product.__shop__.rating}</span>
              )}
            </div>
          </div>
        )}

        <h3 className="font-medium text-sm mb-1 line-clamp-2 min-h-[2.5rem]">
          {product.name}
          {product.description && (
            <span className="text-gray-400 text-xs ml-1">
              - {product.description}
            </span>
          )}
          <span className="text-gray-400">
            {' - '}
            {[
              selectedVariation.size,
              selectedVariation.color,
              selectedVariation.material
            ].filter(Boolean).join(', ')}
          </span>
        </h3>

        <div className="flex items-baseline gap-2 mb-2">
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

        {/* Variation Selector */}
        <div className="mb-3">
          <button
            className="w-full py-2 px-3 rounded-md border border-gray-100 text-sm flex items-center justify-between"
            onClick={(e) => {
              e.stopPropagation();
              setShowVariations(!showVariations);
            }}
          >
            <span>Select Variation</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showVariations ? 'rotate-180' : ''}`} />
          </button>
          
          {showVariations && (
            <div className="absolute left-0 right-0 mt-1 mx-3 bg-white border border-gray-100 rounded-md shadow-lg z-20 max-h-48 overflow-y-auto">
              {product.variations.map((variation, index) => (
                <button
                  key={variation.id || index}
                  className={`w-full p-2 text-left hover:bg-gray-100 ${
                    selectedVariation.id === variation.id ? 'bg-gray-100' : ''
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

        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-400">
            <span>{selectedVariation.stockQuantity} left</span>
            <span>SKU: {selectedVariation.sku}</span>
            {isFlashSale && <span>100 sold</span>}
          </div>
        </div>

        <button 
          className={`w-full py-2 rounded-full text-sm font-medium flex items-center justify-center gap-2
            ${isLoading ? 'bg-gray-100 cursor-not-allowed' :
              selectedVariation.isActive && selectedVariation.stockQuantity > 0
                ? 'bg-yellow-400 text-white active:bg-yellow-500'
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