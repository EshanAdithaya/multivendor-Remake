import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Mail, Globe, Star } from 'lucide-react';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import Lottie from 'react-lottie';
import loaderAnimation from '../Assets/animations/loading.json';
import notFoundAnimation from '../Assets/animations/not_found.json';

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

        // Add shop data to each product
        const productsWithShop = productsData.map(product => ({
          ...product,
          __shop__: shopData
        }));

        setShop(shopData);
        setProducts(productsWithShop);
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

  // Count only products with variations
  const validProductCount = products.filter(product => product.variations?.length > 0).length;

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Shop Header */}
      <div className="relative">
        <img
          src={shop.coverImageUrl || '/api/placeholder/800/200'}
          alt="Shop Cover"
          className="w-full h-32 sm:h-48 object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/api/placeholder/800/200';
          }}
        />
        <div className="absolute -bottom-12 sm:-bottom-16 left-4 bg-white p-2 rounded-xl shadow-lg">
          <img
            src={shop.logoUrl || '/api/placeholder/80/80'}
            alt={shop.name}
            className="w-20 h-20 sm:w-28 sm:h-28 rounded-lg object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/api/placeholder/80/80';
            }}
          />
        </div>
      </div>

      {/* Shop Details */}
      <div className="px-4 mt-16 sm:mt-20 space-y-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{shop.name}</h1>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />
              <span className="text-base sm:text-lg font-semibold">{shop.rating || 0}</span>
              <span className="text-sm text-gray-500">({shop.totalReviews || 0})</span>
            </div>
          </div>

          <p className="text-gray-600 mt-2">{shop.description}</p>

          <div className="mt-4 space-y-2">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0 mt-1" />
              <p className="text-gray-600">
                {`${shop.streetAddress}, ${shop.city}, ${shop.state}, ${shop.zip}`}
              </p>
            </div>

            {shop.phoneNumber && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <a href={`tel:${shop.phoneNumber}`} className="text-gray-600">
                  {shop.phoneNumber}
                </a>
              </div>
            )}

            {shop.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <a href={`mailto:${shop.email}`} className="text-gray-600 break-all">
                  {shop.email}
                </a>
              </div>
            )}

            {shop.website && (
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <a href={shop.website} target="_blank" rel="noopener noreferrer" 
                   className="text-blue-600 break-all">
                  Visit Website
                </a>
              </div>
            )}
          </div>

          <div className="mt-4 sm:mt-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-3">Shop Statistics</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs sm:text-sm text-gray-500">Products</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{validProductCount}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs sm:text-sm text-gray-500">Reviews</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{shop.totalReviews || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="mb-20">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900">Products ({validProductCount})</h2>
          </div>

          {validProductCount === 0 ? (
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
    </main>
  );
};

export default ShopDetails;