import React, { useState } from 'react';
import { Search, Heart, Star, ArrowRight, TrendingUp, Percent, Award, Menu } from 'lucide-react';

const LandingPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'food', name: 'Pet Food', icon: '🍖', count: 128 },
    { id: 'toys', name: 'Toys', icon: '🪀', count: 95 },
    { id: 'care', name: 'Healthcare', icon: '💊', count: 76 },
    { id: 'grooming', name: 'Grooming', icon: '✨', count: 43 },
    { id: 'beds', name: 'Beds', icon: '🛏️', count: 51 },
  ];

  const featuredProducts = [
    { id: 1, name: 'Premium Dog Food', price: 49.99, rating: 4.8, reviews: 235, discount: 20, image: '/api/placeholder/200/200' },
    { id: 2, name: 'Cat Play Tower', price: 89.99, rating: 4.9, reviews: 189, image: '/api/placeholder/200/200' },
    { id: 3, name: 'Pet Grooming Kit', price: 34.99, rating: 4.7, reviews: 156, discount: 15, image: '/api/placeholder/200/200' },
  ];

  const trendingProducts = [
    { id: 4, name: 'Interactive Pet Toy', price: 19.99, rating: 4.6, reviews: 142, image: '/api/placeholder/200/200' },
    { id: 5, name: 'Organic Cat Food', price: 29.99, rating: 4.8, reviews: 198, discount: 10, image: '/api/placeholder/200/200' },
    { id: 6, name: 'Pet Carrier', price: 45.99, rating: 4.7, reviews: 167, image: '/api/placeholder/200/200' },
  ];

  const ProductCard = ({ product }) => (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full aspect-square object-cover rounded-t-xl"
        />
        {product.discount && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            -{product.discount}%
          </div>
        )}
        <button className="absolute top-2 left-2 p-1.5 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow">
          <Heart className="w-4 h-4 text-gray-400 hover:text-red-500" />
        </button>
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-1">{product.name}</h3>
        <div className="flex items-center mb-2">
          <Star className="w-3 h-3 text-yellow-400 fill-current" />
          <span className="ml-1 text-xs font-medium">{product.rating}</span>
          <span className="mx-1 text-gray-300">•</span>
          <span className="text-xs text-gray-500">{product.reviews} reviews</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            {product.discount ? (
              <div className="flex items-center gap-1">
                <span className="text-sm font-bold text-gray-900">
                  ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                </span>
                <span className="text-xs text-gray-500 line-through">${product.price}</span>
              </div>
            ) : (
              <span className="text-sm font-bold text-gray-900">${product.price}</span>
            )}
          </div>
          <button className="p-1.5 bg-yellow-400 rounded-full text-white hover:bg-yellow-500 transition-colors">
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Made smaller and more compact for mobile */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Menu className="w-5 h-5 text-gray-600" />
              <h1 className="text-lg font-bold text-gray-800">PetDoc</h1>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Search className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full px-4 py-2 text-sm bg-gray-100 rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
        </div>
      </header>

      <main className="px-4 py-4">
        {/* Featured Section - Simplified for mobile */}
        <section className="mb-6">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-4 text-white">
            <h2 className="text-lg font-bold mb-1">20% Off First Purchase</h2>
            <p className="text-sm mb-3 opacity-90">Use code WELCOME20</p>
            <button className="bg-white text-yellow-500 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors">
              Shop Now
            </button>
          </div>
        </section>

        {/* Categories - Horizontal scrollable for mobile */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-800">Categories</h2>
            <button className="text-yellow-500 text-sm font-medium flex items-center gap-1">
              All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex-none w-24 p-3 rounded-xl flex flex-col items-center justify-center transition-all snap-start ${
                  activeCategory === category.id
                    ? 'bg-yellow-400 text-white'
                    : 'bg-white hover:bg-yellow-50'
                }`}
              >
                <span className="text-xl mb-1">{category.icon}</span>
                <span className="text-xs font-medium">{category.name}</span>
                <span className="text-xs opacity-75">{category.count}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Featured Products - Grid optimized for mobile */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-yellow-500" />
            <h2 className="text-lg font-bold text-gray-800">Featured</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Special Offers - Stacked for mobile */}
        <section className="mb-6 space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <Percent className="w-5 h-5 text-yellow-500" />
            <h2 className="text-lg font-bold text-gray-800">Special Offers</h2>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
            <h3 className="text-lg font-bold mb-1">Free Delivery</h3>
            <p className="text-sm mb-3 opacity-90">On orders above $50</p>
            <button className="bg-white text-blue-500 px-4 py-1.5 rounded-lg text-sm font-semibold">
              Learn More
            </button>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white">
            <h3 className="text-lg font-bold mb-1">Loyalty Rewards</h3>
            <p className="text-sm mb-3 opacity-90">Earn points on purchases</p>
            <button className="bg-white text-purple-500 px-4 py-1.5 rounded-lg text-sm font-semibold">
              Join Now
            </button>
          </div>
        </section>

        {/* Trending Products */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-5 h-5 text-yellow-500" />
            <h2 className="text-lg font-bold text-gray-800">Trending Now</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {trendingProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;