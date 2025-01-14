import React, { useState, useEffect } from 'react';
import { Heart, ChevronRight, Minus, Plus } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import ProductReviews from '../components/ProductReviews';

const API_REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;

const ProductDetail = () => {
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState(null);
  const [selectedVariation, setSelectedVariation] = useState(null);
  const location = useLocation();
  
  useEffect(() => {
    const fetchProduct = async () => {
      const params = new URLSearchParams(location.search);
      const productId = params.get('key');
      if (!productId) return;
      
      try {
        const response = await fetch(`${API_REACT_APP_BASE_URL}/api/products/${productId}`);
        if (!response.ok) throw new Error('Product not found');
        const data = await response.json();
        // If there's only one variation, select it by default
        if (data.variations?.length === 1) {
          setSelectedVariation(data.variations[0]);
        }
        setProduct(data);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      }
    };
    
    fetchProduct();
  }, [location]);

  if (!product) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

  const getVariationDisplayText = (variation) => {
    const attributes = [];
    if (variation.size) attributes.push(variation.size);
    if (variation.weight) attributes.push(`${variation.weight}g`);
    if (variation.color) attributes.push(variation.color);
    if (variation.material) attributes.push(variation.material);
    return attributes.join(' - ') || 'Standard';
  };

  const formatPrice = (price) => {
    if (price == null) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const images = [
    selectedVariation?.imageUrl || product.imageUrl || '/api/placeholder/400/400',
    '/api/placeholder/400/400'
  ];

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

      <div className="flex gap-4 px-4 mb-6 overflow-x-auto">
        {images.map((img, index) => (
          <button
            key={index}
            className={`border-2 rounded-lg p-1 flex-shrink-0 ${
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

        {product.__shop__?.rating && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-yellow-400 text-white px-2 py-1 rounded">
              <span>{product.__shop__.rating}</span>
              <span>★</span>
            </div>
          </div>
        )}

        <p className="text-gray-600">{product.description}</p>

        {/* Variations */}
        {product.variations && product.variations.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium">Select Option</h3>
            <div className="space-y-2">
              {product.variations.map((variation) => (
                <button
                  key={variation.id}
                  onClick={() => setSelectedVariation(variation)}
                  className={`w-full p-3 rounded-lg border text-left
                    ${selectedVariation?.id === variation.id 
                      ? 'border-yellow-400 bg-yellow-50'
                      : 'border-gray-200 hover:border-yellow-400'
                    }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{getVariationDisplayText(variation)}</div>
                      <div className="text-sm text-gray-500">
                        SKU: {variation.sku} • Stock: {variation.stockQuantity}
                      </div>
                    </div>
                    <div className="text-yellow-500 font-bold">
                      {formatPrice(variation.price)}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

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
            onClick={() => quantity < (selectedVariation?.stockQuantity || 0) && setQuantity(quantity + 1)}
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center text-sm text-gray-600">
          {selectedVariation 
            ? `${selectedVariation.stockQuantity} pieces available`
            : 'Select an option'
          }
        </div>

        {/* Add to Cart Button */}
        <button
          className={`w-full py-3 rounded-lg font-medium
            ${selectedVariation?.stockQuantity > 0
              ? 'bg-yellow-400 text-white hover:bg-yellow-500'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          disabled={!selectedVariation || selectedVariation.stockQuantity === 0}
        >
          {!selectedVariation
            ? 'Select Option'
            : selectedVariation.stockQuantity === 0
              ? 'Out of Stock'
              : 'Add to Cart'
          }
        </button>

        {/* Shop Details */}
        {product.__shop__ && (
          <div className="space-y-4 pt-4">
            <div>
              <span className="font-medium">Seller</span>
              <div className="mt-2">
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                  {product.__shop__.name}
                </span>
              </div>
            </div>

            <div className="pb-6">
              <h2 className="font-medium mb-2">Shop Details</h2>
              <div className="text-gray-600 space-y-2">
                <p>{product.__shop__.description}</p>
                <p>{product.__shop__.address}</p>
                <p>{product.__shop__.city}, {product.__shop__.state}</p>
                <p>Contact: {product.__shop__.email}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="px-4 mb-20">
  <ProductReviews productId={product.id} />
</div>
    </div>
  );
};

export default ProductDetail;