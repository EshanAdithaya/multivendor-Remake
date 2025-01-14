import React, { useState, useEffect } from 'react';
import { Search, Filter, X, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import Lottie from 'react-lottie';
import loaderAnimation from '../Assets/animations/loading.json';

// FilterSection component
const FilterSection = ({ showFilters, setShowFilters, filters, setFilters, categories, productGroups, manufacturers }) => (
  <div className={`fixed inset-0 bg-gray-800 bg-opacity-50 z-50 transition-opacity ${showFilters ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
    <div className={`absolute right-0 top-0 h-full w-[80%] max-w-md bg-white transform transition-transform ${showFilters ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
            <div className="flex items-center gap-4">
              {Object.values(filters).some(v => v !== '') && (
                <button
                  onClick={() => setFilters({
                    name: '',
                    categoryId: '',
                    productGroupId: '',
                    manufacturerId: ''
                  })}
                  className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  Clear all
                </button>
              )}
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="divide-y divide-gray-100">
            {/* Categories Section */}
            <div className="p-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Category</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, categoryId: '' }))}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      filters.categoryId === '' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    All
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setFilters(prev => ({ ...prev, categoryId: cat.id }))}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        filters.categoryId === cat.id
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Product Groups Section */}
            <div className="p-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Product Group</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, productGroupId: '' }))}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      filters.productGroupId === ''
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    All
                  </button>
                  {productGroups.map(group => (
                    <button
                      key={group.id}
                      onClick={() => setFilters(prev => ({ ...prev, productGroupId: group.id }))}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        filters.productGroupId === group.id
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {group.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Manufacturers Section */}
            <div className="p-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Manufacturer</h3>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, manufacturerId: '' }))}
                    className={`px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                      filters.manufacturerId === ''
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    All Manufacturers
                  </button>
                  {manufacturers.map(mfr => (
                    <button
                      key={mfr.id}
                      onClick={() => setFilters(prev => ({ ...prev, manufacturerId: mfr.id }))}
                      className={`px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                        filters.manufacturerId === mfr.id
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {mfr.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Apply Filters Button */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={() => setShowFilters(false)}
            className="w-full py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Main LandingPage Component
const LandingPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productGroups, setProductGroups] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    name: '',
    categoryId: '',
    productGroupId: '',
    manufacturerId: ''
  });

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loaderAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [productsRes, categoriesRes, groupsRes, manufacturersRes] = await Promise.all([
          fetch(`${process.env.REACT_APP_BASE_URL}/api/products/get-all-with-filters`),
          fetch(`${process.env.REACT_APP_BASE_URL}/api/categories`),
          fetch(`${process.env.REACT_APP_BASE_URL}/api/product-groups`),
          fetch(`${process.env.REACT_APP_BASE_URL}/api/manufacturers`)
        ]);
        
        if (!productsRes.ok) throw new Error('Failed to fetch products');
        if (!categoriesRes.ok) throw new Error('Failed to fetch categories');
        if (!groupsRes.ok) throw new Error('Failed to fetch product groups');
        if (!manufacturersRes.ok) throw new Error('Failed to fetch manufacturers');

        const [productsData, categoriesData, groupsData, manufacturersData] = await Promise.all([
          productsRes.json(),
          categoriesRes.json(),
          groupsRes.json(),
          manufacturersRes.json()
        ]);
        
        setProducts(Array.isArray(productsData) ? productsData : []);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        setProductGroups(Array.isArray(groupsData) ? groupsData : []);
        setManufacturers(Array.isArray(manufacturersData) ? manufacturersData : []);
      } catch (error) {
        console.error('Error fetching initial data:', error);
        setError(error.message || 'Failed to load initial data');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const activeFilters = Object.entries(filters).filter(([_, value]) => value !== '');
        
        const endpoint = activeFilters.length === 0 
          ? `${process.env.REACT_APP_BASE_URL}/api/products/get-all-with-filters`
          : `${process.env.REACT_APP_BASE_URL}/api/products/get-all-with-filters?${new URLSearchParams(
              Object.fromEntries(activeFilters)
            )}`;
        
        const response = await fetch(endpoint);
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError(error.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchFilteredProducts, 300);
    return () => clearTimeout(timeoutId);
  }, [filters]);

  const handleNavigateToProduct = (productId) => {
    navigate(`/productDetails?key=${productId}`);
  };

  const renderProductCard = (product, isFlashSale = false) => {
    return (
      <ProductCard
        key={product.id}
        product={product}
        isFlashSale={isFlashSale}
        saleEndsAt={isFlashSale ? new Date(Date.now() + 4 * 60 * 60 * 1000) : null}
        discount={isFlashSale ? 20 : null}
        onNavigate={() => handleNavigateToProduct(product.id)}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pb-6">
        {/* Search and Filter Controls */}
        <div className="sticky top-0 bg-white shadow-sm z-40">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full px-4 py-2 text-sm bg-gray-100 rounded-full pl-10 focus:outline-none focus:ring-2 focus:ring-red-400"
                  value={filters.name}
                  onChange={(e) => setFilters(prev => ({ ...prev, name: e.target.value }))}
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
              <button 
                className="p-2 bg-gray-100 rounded-full"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Categories Scroll */}
        <div className="bg-white mb-4">
          <div className="overflow-x-auto">
            <div className="flex gap-3 px-4 py-4">
              <button
                onClick={() => setFilters(prev => ({ ...prev, categoryId: '' }))}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                  filters.categoryId === ''
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                All
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setFilters(prev => ({ ...prev, categoryId: cat.id }))}
                  className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                    filters.categoryId === cat.id
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Lottie options={defaultOptions} height={100} width={100} />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            {/* Flash Sale Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4 px-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Flash Sale</h2>
                  <p className="text-sm text-gray-500">Don't miss out on these deals!</p>
                </div>
                <button className="flex items-center text-sm text-gray-500">
                  View All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <div className="flex gap-3 px-4 pb-4">
                  {products.slice(0, 6).map(product => (
                    <div key={product.id} className="w-[160px] flex-shrink-0">
                      {renderProductCard(product, true)}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* All Products Grid */}
            <div className="px-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">All Products</h2>
                <button className="flex items-center text-sm text-gray-500">
                  Sort by
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {products.map(product => renderProductCard(product))}
                {products.length === 0 && (
                  <div className="col-span-2 text-center py-8">
                    <p className="text-gray-600">No products found matching your criteria</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Filter Section */}
        <FilterSection 
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          filters={filters}
          setFilters={setFilters}
          categories={categories}
          productGroups={productGroups}
          manufacturers={manufacturers}
        />
      </main>
    </div>
  );
};

export default LandingPage;