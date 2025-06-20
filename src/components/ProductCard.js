import React from 'react';
import { Heart } from 'lucide-react';

const CompactProductCard = ({ 
  product,
  onNavigate,
  isWishlistLoading = false,
  isInWishlist = false,
  onWishlistToggle
}) => {
  // Get the first variation for display
  const defaultVariation = product.variations?.[0];
  if (!defaultVariation) return null;

  const formatPrice = (price) => {
    if (!price) return '0.00';
    return typeof price === 'string' ? parseFloat(price).toFixed(2) : price.toFixed(2);
  };
  return (
    <div 
      className="w-full bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 border border-gray-100"
      onClick={onNavigate}
    >
      {/* Image */}
      <div className="relative aspect-square">
        <img
          src={defaultVariation.imageUrl || product.imageUrl || '/api/placeholder/128/128'}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/api/placeholder/128/128';
          }}
        />
        
        {/* Gradient overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
        
        {/* Wishlist Button */}
        <button 
          className={`absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg z-10 transition-all duration-200
            ${isWishlistLoading ? 'opacity-50' : 'hover:bg-white hover:scale-110 active:scale-95'}`}
          onClick={(e) => {
            e.stopPropagation();
            onWishlistToggle?.();
          }}
          disabled={isWishlistLoading}
        >
          <Heart 
            className={`w-4 h-4 transition-colors duration-200 ${
              isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-500 hover:text-red-400'
            }`}
          />
        </button>

        {/* Status Badge */}
        {product.status && (
          <div className="absolute bottom-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-lg shadow-lg font-medium">
            {product.status}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="text-sm font-semibold line-clamp-2 mb-2 text-gray-800 leading-tight">
          {product.name}
        </h3>
        
        <div className="flex flex-col gap-1">
          <span className="text-lg font-bold text-orange-600">
            ${formatPrice(defaultVariation.price)}
          </span>
          
          {product.averageReview > 0 && (
            <div className="flex items-center text-xs bg-yellow-50 px-2 py-1 rounded-lg w-fit">
              <span className="text-yellow-500">⭐</span>
              <span className="ml-1 font-medium text-gray-700">{product.averageReview.toFixed(1)}</span>
              {product.reviews?.length > 0 && (
                <span className="ml-1 text-gray-500">({product.reviews.length})</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompactProductCard;