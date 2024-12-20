import React from 'react';
import { Star } from 'lucide-react';

const WishlistPage = () => {
  const wishlistItems = [
    {
      id: 1,
      name: "Sticks",
      shop: "Pet Shop 1",
      rating: 3.33,
      price: 0.60,
      image: "/api/placeholder/80/80"
    },
    {
      id: 2,
      name: "Sticks",
      shop: "Pet Shop 1",
      rating: 3.33,
      price: 0.60,
      image: "/api/placeholder/80/80"
    },
    {
      id: 3,
      name: "Sticks",
      shop: "Pet Shop 1",
      rating: 3.33,
      price: 0.60,
      image: "/api/placeholder/80/80"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header with Logo */}
      <div className="p-4 border-b">
        <img src="/api/placeholder/40/40" alt="PetDoc Logo" className="w-10 h-10" />
      </div>

      {/* Wishlist Title */}
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
      </div>

      {/* Wishlist Items */}
      <div className="px-4 space-y-4">
        {wishlistItems.map((item) => (
          <div 
            key={item.id} 
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex items-start space-x-4">
              {/* Product Image */}
              <div className="border rounded-lg p-2 w-20 h-20 flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>

              {/* Product Details */}
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900">{item.name}</h2>
                <p className="text-gray-600 mt-1">{item.shop}</p>
                
                {/* Rating */}
                <div className="mt-2 inline-flex items-center px-3 py-1 bg-yellow-400 rounded-lg">
                  <span className="text-white font-medium">{item.rating}</span>
                  <Star className="w-4 h-4 ml-1 text-white fill-white" />
                </div>

                {/* Price */}
                <p className="text-xl font-semibold mt-2">${item.price.toFixed(2)}</p>

                {/* Action Buttons */}
                <div className="flex mt-2 space-x-4">
                  <button className="text-yellow-400 font-semibold hover:text-yellow-500 transition-colors">
                    Add to Cart
                  </button>
                  <div className="w-px bg-gray-200"></div>
                  <button className="text-red-500 font-semibold hover:text-red-600 transition-colors">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;