import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Mail, Globe, Star } from 'lucide-react';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import Lottie from 'react-lottie';
import loaderAnimation from '../Assets/animations/loading.json'; // Adjust path as needed
import notFoundAnimation from '../Assets/animations/not_found.json'; // Adjust path as needed

const API_REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;

const ShopDetails = () => {
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loaderAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  const notFoundOptions = {
    loop: true,
    autoplay: true,
    animationData: notFoundAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const shopId = params.get('token');
        if (!shopId) throw new Error('Shop ID is missing');
        
        const [shopResponse, productsResponse] = await Promise.all([
          fetch(`${API_REACT_APP_BASE_URL}/api/shops/${shopId}`),
          fetch(`${API_REACT_APP_BASE_URL}/api/products/get-all-with-filters?shopId=${shopId}`)
        ]);

        if (!shopResponse.ok || !productsResponse.ok) 
          throw new Error('Failed to fetch data');

        const [shopData, productsData] = await Promise.all([
          shopResponse.json(),
          productsResponse.json()
        ]);

        setShop(shopData);
        setProducts(productsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleNavigateToProduct = (productId) => {
    navigate(`/productDetails?key=${productId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Lottie options={defaultOptions} height={100} width={100} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-xl font-semibold text-red-600 mb-2">Error: {error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-red-500 text-white rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Shop Header */}
      <div className="relative">
        <div className="h-40 bg-gradient-to-r from-blue-500 to-blue-600"></div>
        <div className="absolute -bottom-16 left-4 bg-white p-2 rounded-xl shadow-lg">
          <img
            src={shop.logoUrl || '/api/placeholder/80/80'}
            alt={shop.name}
            className="w-28 h-28 rounded-lg object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/api/placeholder/80/80';
            }}
          />
        </div>
      </div>

      {/* Shop Details */}
      <div className="px-4 mt-20">
        <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-bold text-gray-900">{shop.name}</h1>
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="text-lg font-semibold">{shop.rating || 0}</span>
              <span className="text-sm text-gray-500">({shop.totalReviews || 0})</span>
            </div>
          </div>

          <p className="text-gray-600 mt-2">{shop.description}</p>

          <div className="mt-4 space-y-2">
            <div className="flex items-start gap-2">
              <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
              <p className="text-gray-600">
                {`${shop.streetAddress}, ${shop.city}, ${shop.state}, ${shop.zip}`}
              </p>
            </div>

            {shop.phoneNumber && (
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-gray-400" />
                <a href={`tel:${shop.phoneNumber}`} className="text-gray-600">
                  {shop.phoneNumber}
                </a>
              </div>
            )}

            {shop.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-gray-400" />
                <a href={`mailto:${shop.email}`} className="text-gray-600 break-all">
                  {shop.email}
                </a>
              </div>
            )}

            {shop.website && (
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-gray-400" />
                <a href={shop.website} target="_blank" rel="noopener noreferrer" 
                   className="text-blue-600 break-all">
                  Visit Website
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Products Section */}
        <div className="mb-20">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900">Products ({products.length})</h2>
          </div>

          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Lottie options={notFoundOptions} height={150} width={150} />
              <p className="text-gray-500 mt-4">No products available</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onNavigate={() => handleNavigateToProduct(product.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopDetails;