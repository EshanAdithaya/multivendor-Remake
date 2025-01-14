import React from 'react';
import { ShoppingCart, Heart, Clock } from 'lucide-react';

const ProductCard = ({ 
  product, 
  isFlashSale = false, 
  saleEndsAt = null,
  discount = null 
}) => {
  const formatPrice = (price) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return numPrice.toFixed(2);
  };

  const calculateDiscountedPrice = (originalPrice) => {
    if (!discount) return originalPrice;
    const numPrice = typeof originalPrice === 'string' ? parseFloat(originalPrice) : originalPrice;
    return (numPrice * (1 - discount / 100)).toFixed(2);
  };

  const getTimeRemaining = (endTime) => {
    if (!endTime) return null;
    const total = Date.parse(endTime) - Date.parse(new Date());
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="relative bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Wishlist Button */}
      <button className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm z-10">
        <Heart className="w-5 h-5 text-gray-400" />
      </button>

      {/* Sale Badge */}
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
          src={product.imageUrl || '/api/placeholder/400/400'}
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
        {/* Shop Info - for multivendor */}
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

        {/* Product Name */}
        <h3 className="font-medium text-sm mb-1 line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>

        {/* Pricing */}
        <div className="flex items-baseline gap-2 mb-2">
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
        </div>

        {/* Stock and Sold Info */}
        <div className="mb-3">
          {isFlashSale && product.stockQuantity > 0 && (
            <div className="w-full bg-gray-200 h-2 rounded-full mb-1">
              <div 
                className="bg-red-500 h-2 rounded-full"
                style={{ width: `${Math.min((product.stockQuantity / 100) * 100, 100)}%` }}
              />
            </div>
          )}
          <div className="flex justify-between text-xs text-gray-500">
            <span>{product.stockQuantity} left</span>
            {isFlashSale && <span>100 sold</span>}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button 
          className={`w-full py-2 rounded-full text-sm font-medium flex items-center justify-center gap-2
            ${product.isActive && product.stockQuantity > 0
              ? 'bg-red-500 text-white active:bg-red-600'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          disabled={!product.isActive || product.stockQuantity === 0}
        >
          <ShoppingCart className="w-4 h-4" />
          {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;