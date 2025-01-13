import React, { useState, useEffect } from 'react';
import { Heart, ChevronRight, Minus, Plus } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';

const API_BASE_URL = process.env.BASE_URL;

const ProductDetail = () => {
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState(null);
  const location = useLocation();
  
  useEffect(() => {
    const fetchProduct = async () => {
      const params = new URLSearchParams(location.search);
      const productId = params.get('key');
      if (!productId) return;
      
      try {
        const response = await fetch(`${API_BASE_URL}/api/products/${productId}`);
        if (!response.ok) throw new Error('Product not found');
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      }
    };
    
    fetchProduct();
  }, [location]);

  if (!product) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

  const images = [
    product.imageUrl || '/api/placeholder/400/400',
    '/api/placeholder/400/400'
  ];

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(product.price);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <div className="relative px-4 mb-4">
        <img
          src={images[selectedImage]}
          alt={product.name}
          className="w-full aspect-square object-cover rounded-lg"
        />
        <div className="absolute right-6 top-1/2 bg-white rounded-full p-2 shadow-md">
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>

      <div className="flex gap-4 px-4 mb-6">
        {images.map((img, index) => (
          <button
            key={index}
            className={`border-2 rounded-lg p-1 ${
              selectedImage === index ? 'border-yellow-400' : 'border-gray-200'
            }`}
            onClick={() => setSelectedImage(index)}
          >
            <img src={img} alt={`${product.name} ${index + 1}`} className="w-20 h-20 object-cover" />
          </button>
        ))}
      </div>

      <div className="px-4 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">{product.name}</h1>
          <button
            className={`p-2 rounded-full ${isLiked ? 'text-yellow-400' : 'text-gray-400'}`}
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart className="w-6 h-6" fill={isLiked ? "currentColor" : "none"} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">{product.weight}g</span>
          {product.__shop__?.rating && (
            <div className="flex items-center gap-1 bg-yellow-400 text-white px-2 py-1 rounded">
              <span>{product.__shop__.rating}</span>
              <span>★</span>
            </div>
          )}
        </div>

        <p className="text-gray-600">
          {product.description}
        </p>

        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-yellow-500">{formattedPrice}</span>
        </div>

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

        <p className="text-gray-600 text-center">{product.stockQuantity} pieces available</p>

        <div className="space-y-4">
          {product.__shop__ && (
            <div>
              <span className="font-medium">Seller</span>
              <div className="mt-2">
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                  {product.__shop__.name}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="pb-6">
          <h2 className="font-medium mb-2">Shop Details</h2>
          {product.__shop__ && (
            <div className="text-gray-600 space-y-2">
              <p>{product.__shop__.description}</p>
              <p>{product.__shop__.address}</p>
              <p>{product.__shop__.city}, {product.__shop__.state}</p>
              <p>Contact: {product.__shop__.email}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;