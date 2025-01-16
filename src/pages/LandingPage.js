import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Filter, X } from 'lucide-react';
import CompactProductCard from '../components/ProductCard';
import Header from '../components/Header';
import _ from 'lodash';

// Filter Popup Component
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

          <div className="flex-1 overflow-y-auto">
            {/* Categories */}
            <div className="p-4 border-b">
              <h3 className="text-sm font-medium mb-3">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    className={`px-4 py-2 rounded-full text-sm ${
                      filters.categoryId === category.id
                        ? 'bg-yellow-400 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                    onClick={() => setFilters(prev => ({ ...prev, categoryId: category.id }))}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort By */}
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

// Shop Section Component
const ShopSection = ({ shop, products, onNavigate }) => {
  if (!products?.length) return null;

  return (
    <div className="mb-4 bg-white">
      {/* Shop Header */}
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

      {/* Products Scroll */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-3 p-4">
          {products.map(product => (
            <CompactProductCard
              key={product.id}
              product={product}
              onNavigate={() => onNavigate(product.id)}
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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (searchQuery) queryParams.append('name', searchQuery);
        if (filters.categoryId) queryParams.append('categoryId', filters.categoryId);
        
        const url = `${process.env.REACT_APP_BASE_URL}/api/products/get-all-with-filters${
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

  // Group products by shop
  const groupedProducts = _.groupBy(products, product => product.__shop__?.id);
  
  // Get unique categories
  const categories = _.uniqBy(
    products.map(p => p.category).filter(Boolean),
    'id'
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <Header 
        onSearchChange={setSearchQuery}
        onFilterClick={() => setShowFilters(true)}
      />

      {/* Categories */}
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

      {/* Main Content */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-yellow-400 rounded-full animate-spin"></div>
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
                onNavigate={(productId) => navigate(`/product/${productId}`)}
              />
            );
          })}
        </div>
      )}

      {/* Filter Popup */}
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