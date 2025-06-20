import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Star } from 'lucide-react';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import Lottie from 'react-lottie';
import loaderAnimation from '../Assets/animations/loading.json';
import notFoundAnimation from '../Assets/animations/not_found.json';

const API_REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;

const ShopDetails = () => {
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredProducts, setFilteredProducts] = useState([]);
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

        // Extract unique categories
        const uniqueCategories = [...new Set(productsWithShop.map(product => product.category?.name).filter(Boolean))];
        setCategories(['All', ...uniqueCategories]);

        setShop(shopData);
        setProducts(productsWithShop);
        setFilteredProducts(productsWithShop);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter products by category
  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    if (category === 'All') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(product => product.category?.name === category));
    }
  };

  // Update filtered products when products change
  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(product => product.category?.name === selectedCategory));
    }
  }, [products, selectedCategory]);

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
  const validProductCount = filteredProducts.filter(product => product.variations?.length > 0).length;

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

      {/* Compact Shop Header */}
      <div className="px-4 mt-16 sm:mt-20">
        <div className="bg-white rounded-xl p-3 shadow-md border border-orange-100 mb-4">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-base font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
              🏪 {shop.name}
            </h1>
            <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-md">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-bold">{shop.rating || 0}</span>
              <span className="text-xs text-gray-500">({shop.totalReviews || 0})</span>
            </div>
          </div>
          
          {/* Compact Info Row */}
          <div className="flex items-center gap-4 text-xs text-gray-600 overflow-x-auto">
            <div className="flex items-center gap-1 flex-shrink-0">
              <MapPin className="w-3 h-3" />
              <span>{shop.city}, {shop.state}</span>
            </div>
            {shop.phoneNumber && (
              <div className="flex items-center gap-1 flex-shrink-0">
                <Phone className="w-3 h-3" />
                <span>{shop.phoneNumber}</span>
              </div>
            )}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="flex items-center gap-1">
                <span>🛍️</span>
                <span className="font-medium">{validProductCount}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>⭐</span>
                <span className="font-medium">{shop.totalReviews || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        {categories.length > 1 && (
          <div className="mb-4">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryFilter(category)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-md'
                      : 'bg-white text-gray-600 border border-orange-200 hover:border-orange-300 hover:bg-orange-50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Products Section */}
        <div className="mb-20">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-base font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
              🛒 Products ({validProductCount})
            </h2>
          </div>

          {validProductCount === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl">
              <Lottie options={notFoundOptions} height={100} width={100} />
              <p className="text-gray-500 mt-3 font-medium text-sm">No products found 🐾</p>
              <p className="text-gray-400 text-xs mt-1">Try a different category!</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {filteredProducts.filter(product => product.variations?.length > 0).map((product) => (
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