import React, { useState, useEffect } from 'react';
import { Search, Heart, Star, ArrowRight, TrendingUp, Percent, Award, Menu, Truck, Gift, Clock, Shield, Package, Trophy } from 'lucide-react';
import Header from '../components/Header';

const LandingPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productGroups, setProductGroups] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    name: '',
    categoryId: '',
    productGroupId: '',
    manufacturerId: ''
  });
  
  // Initial load of all products and filter data
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch all data in parallel
        const [productsRes, categoriesRes, groupsRes, manufacturersRes] = await Promise.all([
          fetch('https://ppabanckend.adaptable.app/api/products/get-all-with-filters'),
          fetch('https://ppabanckend.adaptable.app/api/categories'),
          fetch('https://ppabanckend.adaptable.app/api/product-groups'),
          fetch('https://ppabanckend.adaptable.app/api/manufacturers')
        ]);
        
        // Check each response individually for better error handling
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

  // Fetch filtered products when filters change
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Only create query parameters for non-empty filters
        const activeFilters = Object.entries(filters).filter(([_, value]) => value !== '');
        
        // If no filters are active, use the base endpoint
        const endpoint = activeFilters.length === 0 
          ? 'https://ppabanckend.adaptable.app/api/products/get-all-with-filters'
          : `https://ppabanckend.adaptable.app/api/products/get-all-with-filters?${new URLSearchParams(
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

    // Debounce the filter requests
    const timeoutId = setTimeout(fetchFilteredProducts, 300);
    return () => clearTimeout(timeoutId);
  }, [filters]);

  const FilterSection = () => (
    <div className="mb-6 bg-white p-4 rounded-xl shadow-sm">
      <h2 className="text-lg font-bold text-gray-800 mb-3">Filters</h2>
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium text-gray-700">Category</label>
          <select
            className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
            value={filters.categoryId}
            onChange={(e) => setFilters(prev => ({ ...prev, categoryId: e.target.value }))}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="text-sm font-medium text-gray-700">Product Group</label>
          <select
            className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
            value={filters.productGroupId}
            onChange={(e) => setFilters(prev => ({ ...prev, productGroupId: e.target.value }))}
          >
            <option value="">All Groups</option>
            {productGroups.map(group => (
              <option key={group.id} value={group.id}>{group.name}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="text-sm font-medium text-gray-700">Manufacturer</label>
          <select
            className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
            value={filters.manufacturerId}
            onChange={(e) => setFilters(prev => ({ ...prev, manufacturerId: e.target.value }))}
          >
            <option value="">All Manufacturers</option>
            {manufacturers.map(mfr => (
              <option key={mfr.id} value={mfr.id}>{mfr.name}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

  const ProductCard = ({ product }) => (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="relative">
        <img 
          src={product.imageUrl || '/api/placeholder/400/400'} 
          alt={product.name}
          className="w-full aspect-square object-cover rounded-t-xl"
        />
        <button 
          className="absolute top-2 left-2 p-1.5 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
          aria-label="Add to favorites"
        >
          <Heart className="w-4 h-4 text-gray-400 hover:text-red-500" />
        </button>
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-xs text-gray-500 mb-2 line-clamp-2">{product.description}</p>
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
            Stock: {product.stockQuantity}
          </span>
          {product.category && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
              {product.category.name}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-gray-900">
            ${Number(product.price).toFixed(2)}
          </span>
          <button 
            className="p-1.5 bg-yellow-400 rounded-full text-white hover:bg-yellow-500 transition-colors"
            aria-label="View product details"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full px-4 py-3 text-sm bg-white rounded-xl pl-10 focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm"
              value={filters.name}
              onChange={(e) => setFilters(prev => ({ ...prev, name: e.target.value }))}
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <FilterSection />
          </div>
          
          <div className="md:col-span-3">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading products...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-500">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-4 px-4 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500"
                >
                  Retry
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
                {products.length === 0 && !error && (
                  <div className="col-span-full text-center py-8">
                    <p className="text-gray-600">No products found matching your criteria</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;