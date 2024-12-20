import React from 'react';
import { Search, ShoppingBag } from 'lucide-react';
import Navbar from '../components/Navbar';

const ShopDetail = () => {
  const products = [
    {
      id: 1,
      name: 'Food name',
      weight: '1KG',
      originalPrice: 6.00,
      discountedPrice: 5.00,
      discount: 17,
      image: '/api/placeholder/400/300'
    },
    {
      id: 2,
      name: 'Food name',
      weight: '1KG',
      originalPrice: 6.00,
      discountedPrice: 5.00,
      discount: 17,
      image: '/api/placeholder/400/300'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Search Bar */}
      <div className="p-4 bg-gray-100 rounded-full mx-4 mt-4 flex items-center">
        <input
          type="text"
          placeholder="Search this shop"
          className="flex-1 bg-transparent outline-none text-gray-600"
        />
        <Search className="w-6 h-6 text-gray-500" />
      </div>

      {/* Shop Info */}
      <div className="p-4 flex items-center gap-4">
        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
          Logo
        </div>
        <div>
          <h1 className="text-xl font-bold">Shop 1</h1>
          <button className="text-gray-500">More Info</button>
        </div>
      </div>

      {/* Shop Banner */}
      <div className="mx-4 h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
        Shop Banner
      </div>

      {/* Product List */}
      <div className="p-4 space-y-4 flex-1">
        {products.map((product) => (
          <div key={product.id} className="bg-white p-4 rounded-lg shadow-sm relative">
            {/* Discount Badge */}
            <div className="absolute right-4 top-4 bg-gray-400 text-white px-2 py-1 rounded-full text-sm">
              {product.discount}%
            </div>

            {/* Product Image */}
            <div className="relative mb-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg"
              />
              <div className="absolute -right-2 -bottom-2 bg-yellow-400 p-2 rounded">
                🦴
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-gray-500">{product.weight}</p>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-gray-400 line-through mr-2">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                  <span className="text-lg font-bold">
                    ${product.discountedPrice.toFixed(2)}
                  </span>
                </div>
                <button className="flex items-center gap-2 text-black">
                  <ShoppingBag className="w-5 h-5" />
                  Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* <Navbar /> */}
    </div>
  );
};

export default ShopDetail;