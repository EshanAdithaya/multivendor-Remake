import React, { useState } from 'react';
import { Heart, ChevronRight, Minus, Plus } from 'lucide-react';
import Header from '../components/Header';
// import Navbar from '../components/Navbar';

const ProductDetail = () => {
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const images = [
    '/api/placeholder/400/400',
    '/api/placeholder/400/400'
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header Logo */}
      {/* <div className="p-4 flex justify-between items-center">
        <img src="/api/placeholder/40/40" alt="PetDoc" className="h-10" />
        <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-sm">
          20%
        </div>
      </div> */}
      <Header />

      {/* Main Product Image */}
      <div className="relative px-4 mb-4">
        <img
          src={images[selectedImage]}
          alt="Product"
          className="w-full aspect-square object-cover rounded-lg"
        />
        <div className="absolute right-6 top-1/2 bg-white rounded-full p-2 shadow-md">
          <ChevronRight className="w-5 h-5" />
        </div>
        <div className="absolute -right-2 bottom-4 bg-yellow-400 p-2 rounded">
          🦴
        </div>
      </div>

      {/* Image Thumbnails */}
      <div className="flex gap-4 px-4 mb-6">
        {images.map((img, index) => (
          <button
            key={index}
            className={`border-2 rounded-lg p-1 ${
              selectedImage === index ? 'border-yellow-400' : 'border-gray-200'
            }`}
            onClick={() => setSelectedImage(index)}
          >
            <img src={img} alt={`Thumbnail ${index + 1}`} className="w-20 h-20 object-cover" />
          </button>
        ))}
      </div>

      {/* Product Info */}
      <div className="px-4 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Sticks</h1>
          <button
            className={`p-2 rounded-full ${isLiked ? 'text-yellow-400' : 'text-gray-400'}`}
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart className="w-6 h-6" fill={isLiked ? "currentColor" : "none"} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">1lb</span>
          <div className="flex items-center gap-1 bg-yellow-400 text-white px-2 py-1 rounded">
            <span>4.67</span>
            <span>★</span>
          </div>
        </div>

        <p className="text-gray-600">
          Dolor sit amet consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.g...
        </p>

        <button className="text-yellow-500">Read more</button>

        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-yellow-500">$1.60</span>
          <span className="text-gray-400 line-through">$2.00</span>
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center justify-between bg-yellow-400 rounded-lg p-2">
          <button 
            className="p-2 text-white" 
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <Minus className="w-5 h-5" />
          </button>
          <span className="text-white font-medium">{quantity}</span>
          <button 
            className="p-2 text-white"
            onClick={() => setQuantity(quantity + 1)}
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <p className="text-gray-600 text-center">18 pieces available</p>

        {/* Categories and Sellers */}
        <div className="space-y-4">
          <div>
            <span className="font-medium">Categories</span>
            <div className="flex gap-2 mt-2">
              <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">food and snacks</span>
              <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">pet</span>
            </div>
          </div>
          
          <div>
            <span className="font-medium">Sellers</span>
            <div className="mt-2">
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                Pet shop 1
              </span>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="pb-6">
          <h2 className="font-medium mb-2">Details</h2>
          <p className="text-gray-600">
            Dolor sit amet consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat..
          </p>
        </div>
      </div>
      {/* <Navbar /> */}
    </div>
  );
};

export default ProductDetail; 