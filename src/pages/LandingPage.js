import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Filter, X } from 'lucide-react';
import CompactProductCard from '../components/ProductCard';
import Header from '../components/Header';
import _ from 'lodash';
import Lottie from 'lottie-react';
import noProductAnimation from '../Assets/animations/not_found.json';
import loadingAnimation from '../Assets/animations/loading.json';
import { toast } from 'react-toastify';

const API_REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;

// Filter Popup Component remains the same...
const FilterPopup = ({ isOpen, onClose, filters, setFilters, categories }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-50">
      <div className="absolute right-0 top-0 bottom-0 w-[80%] max-w-md bg-white">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">All Filters</h2>
            <button onClick={onClose}>
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Same filter content as before */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 border-b">
              <h3 className="text-sm font-medium mb-3">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    className={
                      "px-4 py-2 rounded-full text-sm " +
                      (filters.categoryId === category.id
                        ? "bg-yellow-400 text-white"
                        : "bg-gray-100 text-gray-600")
                    }
                    onClick={() => setFilters(prev => ({ ...prev, categoryId: category.id }))}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4">
              <h3 className="text-sm font-medium mb-3">Sort By</h3>
              <div className="space-y-2">
                {['Recommended', 'Price: Low to High', 'Price: High to Low', 'Rating'].map(option => (
                  <button
                    key={option}
                    className="w-full py-2 px-3 text-left text-sm rounded-lg bg-gray-100"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 border-t">
            <button
              onClick={onClose}
              className="w-full py-3 bg-yellow-400 text-white rounded-lg font-medium"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Shop Section Component remains largely the same...
const ShopSection = ({ shop, products, onNavigate, wishlistItems, onWishlistToggle, wishlistLoading }) => {
  if (!products?.length) return null;

  return (
    <div className="mb-4 bg-white">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
            <img
              src={shop.logoUrl || '/api/placeholder/48/48'}
              alt={shop.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">{shop.name}</h2>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              {shop.rating && (
                <span className="flex items-center">
                  <span className="text-yellow-400">★</span>
                  <span className="ml-1">{shop.rating}</span>
                </span>
              )}
              <span>•</span>
              <span>{shop.totalProducts || products.length} items</span>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-3 p-4">
          {products.map(product => (
            <CompactProductCard
              key={product.id}
              product={product}
              onNavigate={() => onNavigate(product.id)}
              isInWishlist={wishlistItems.some(item => item.product.id === product.id)}
              isWishlistLoading={wishlistLoading === product.id}
              onWishlistToggle={() => onWishlistToggle(product)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Main Landing Page Component
const LandingPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    categoryId: '',
    sortBy: 'recommended'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(null);
  const navigate = useNavigate();

  // Fetch wishlist items
  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      const response = await fetch(`${API_REACT_APP_BASE_URL}/api/wishlist/my-wishlist`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (response.status === 401) {
        toast.error('You have to login');
        navigate('/login');
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setWishlistItems(data);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  // Handle wishlist toggle
  const handleWishlistToggle = async (product) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      toast.error('You have to login');
      navigate('/login');
      return;
    }

    setWishlistLoading(product.id);
    try {
      const isInWishlist = wishlistItems.some(item => item.product.id === product.id);

      if (isInWishlist) {
        const response = await fetch(
          `${API_REACT_APP_BASE_URL}/api/wishlist/product/${product.id}`,
          {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
            }
          }
        );

        if (response.status === 401) {
          toast.error('You have to login');
          navigate('/login');
          return;
        }

        if (!response.ok) throw new Error('Failed to remove from wishlist');
        setWishlistItems(prev => prev.filter(item => item.product.id !== product.id));
      } else {
        const response = await fetch(`${API_REACT_APP_BASE_URL}/api/wishlist`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            productId: product.id,
            shopId: product.__shop__?.id
          })
        });

        if (response.status === 401) {
          toast.error('You have to login');
          navigate('/login');
          return;
        }

        if (!response.ok) throw new Error('Failed to add to wishlist');
        await fetchWishlist();
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
    } finally {
      setWishlistLoading(null);
    }
  };

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (searchQuery) queryParams.append('name', searchQuery);
        if (filters.categoryId) queryParams.append('categoryId', filters.categoryId);
        
        const url = `${API_REACT_APP_BASE_URL}/api/products/get-all-with-filters${
          queryParams.toString() ? `?${queryParams.toString()}` : ''
        }`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, filters]);

  // Initial wishlist fetch
  useEffect(() => {
    fetchWishlist();
  }, []);

  // Group products by shop
  const groupedProducts = _.groupBy(products, product => product.__shop__?.id);
  
  // Get unique categories
  const categories = _.uniqBy(
    products.map(p => p.category).filter(Boolean),
    'id'
  );

  // Handle product navigation
  const handleProductNavigation = (productId) => {
    navigate(`/productDetails?key=${productId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header 
        onSearchChange={setSearchQuery}
        onFilterClick={() => setShowFilters(true)}
      />

      <div className="bg-white shadow-sm sticky top-[48px] z-30">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-2 px-4 py-2">
            {categories.map(category => (
              <button
                key={category.id}
                className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
                  filters.categoryId === category.id
                    ? 'bg-yellow-400 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
                onClick={() => setFilters(prev => ({
                  ...prev,
                  categoryId: category.id === prev.categoryId ? '' : category.id
                }))}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-64 h-64">
            <Lottie 
              animationData={loadingAnimation}
              loop={true}
              autoplay={true}
            />
          </div>
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-64 h-64">
            <Lottie 
              animationData={noProductAnimation}
              loop={true}
              autoplay={true}
            />
          </div>
          <p className="text-gray-500 text-lg mt-4">No products found</p>
        </div>
      ) : (
        <div className="pb-20 pt-2">
          {Object.entries(groupedProducts).map(([shopId, shopProducts]) => {
            const shop = shopProducts[0].__shop__;
            return (
              <ShopSection
                key={shopId}
                shop={shop}
                products={shopProducts}
                onNavigate={handleProductNavigation}
                wishlistItems={wishlistItems}
                onWishlistToggle={handleWishlistToggle}
                wishlistLoading={wishlistLoading}
              />
            );
          })}
        </div>
      )}

      <FilterPopup
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        setFilters={setFilters}
        categories={categories}
      />
    </div>
  );
};

export default LandingPage;