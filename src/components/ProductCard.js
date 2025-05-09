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
      className="w-full bg-white rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
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
        
        {/* Wishlist Button */}
        <button 
          className={`absolute top-1 right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md z-10
            ${isWishlistLoading ? 'opacity-50' : 'hover:bg-gray-50'}`}
          onClick={(e) => {
            e.stopPropagation();
            onWishlistToggle?.();
          }}
          disabled={isWishlistLoading}
        >
          <Heart 
            className={`w-3 h-3 ${isInWishlist ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`}
          />
        </button>

        {/* Status Badge */}
        {product.status && (
          <div className="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-xs px-1.5 py-0.5 rounded">
            {product.status}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-2">
        <h3 className="text-xs font-medium line-clamp-2 mb-1 text-gray-800">
          {product.name}
        </h3>
        
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold text-gray-900">
            ${formatPrice(defaultVariation.price)}
          </span>
          
          {product.averageReview > 0 && (
            <div className="flex items-center text-xs text-gray-500">
              <span className="text-yellow-400">★</span>
              <span className="ml-0.5">{product.averageReview.toFixed(1)}</span>
              {product.reviews?.length > 0 && (
                <span className="ml-1">({product.reviews.length})</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompactProductCard;