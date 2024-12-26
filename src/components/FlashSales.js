import React from 'react';
import { Timer, TrendingUp } from 'lucide-react';

const FlashSales = ({ flashSaleProducts }) => {
  const calculateTimeLeft = (endsAt) => {
    const difference = new Date(endsAt) - new Date();
    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    return { hours, minutes };
  };

  if (!flashSaleProducts?.length) return null;

  return (
    <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-xl p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Timer className="w-6 h-6 text-white" />
          <h2 className="text-2xl font-bold text-white">Flash Sales</h2>
        </div>
        <button className="px-4 py-2 bg-white text-red-500 rounded-lg font-medium hover:bg-gray-50 transition-colors">
          View All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {flashSaleProducts.map(product => {
          const { hours, minutes } = calculateTimeLeft(product.flashSaleEndsAt);
          const discountPercentage = Math.round(
            ((product.originalPrice - product.price) / product.originalPrice) * 100
          );

          return (
            <div key={product.id} className="relative bg-white rounded-xl shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
              {/* Discount Badge */}
              <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-medium z-10">
                -{discountPercentage}%
              </div>
              
              {/* Timer Badge */}
              <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-lg text-sm font-medium flex items-center gap-1 z-10">
                <Timer className="w-4 h-4" />
                {hours}h {minutes}m
              </div>

              {/* Image Container */}
              <div className="relative pt-[100%]">
                <img
                  src={product.imageUrl || '/api/placeholder/400/400'}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={product.vendorLogo || '/api/placeholder/20/20'}
                    alt={product.vendorName}
                    className="w-5 h-5 rounded-full"
                  />
                  <span className="text-sm text-gray-600">{product.vendorName}</span>
                </div>
                
                <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                  {product.name}
                </h3>

                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg font-bold text-red-500">
                    ${product.price}
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    ${product.originalPrice}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      {product.soldCount} sold
                    </span>
                    <span className="text-gray-600">
                      {product.stockCount} left
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{
                        width: `${(product.soldCount / (product.soldCount + product.stockCount)) * 100}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FlashSales;