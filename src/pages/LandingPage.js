import React, { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';

// FilterSection component
const FilterSection = ({ showFilters, filters, setFilters, categories, productGroups, manufacturers }) => (
  <div className={`sticky top-4 ${showFilters ? '' : 'hidden'}`}>
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
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
        </div>
      </div>
      
      <div className="divide-y divide-gray-100">
        <div className="p-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Category</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilters(prev => ({ ...prev, categoryId: '' }))}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  filters.categoryId === '' 
                    ? 'bg-yellow-100 text-yellow-800' 
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
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Product Group</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilters(prev => ({ ...prev, productGroupId: '' }))}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  filters.productGroupId === ''
                    ? 'bg-yellow-100 text-yellow-800'
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
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {group.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Manufacturer</h3>
            <div className="max-h-40 overflow-y-auto pr-2 space-y-1">
              <div
                onClick={() => setFilters(prev => ({ ...prev, manufacturerId: '' }))}
                className={`px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                  filters.manufacturerId === ''
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All Manufacturers
              </div>
              {manufacturers.map(mfr => (
                <div
                  key={mfr.id}
                  onClick={() => setFilters(prev => ({ ...prev, manufacturerId: mfr.id }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                    filters.manufacturerId === mfr.id
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {mfr.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const LandingPage = () => {
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

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [productsRes, categoriesRes, groupsRes, manufacturersRes] = await Promise.all([
          fetch('https://ppabanckend.adaptable.app/api/products/get-all-with-filters'),
          fetch('https://ppabanckend.adaptable.app/api/categories'),
          fetch('https://ppabanckend.adaptable.app/api/product-groups'),
          fetch('https://ppabanckend.adaptable.app/api/manufacturers')
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

    const timeoutId = setTimeout(fetchFilteredProducts, 300);
    return () => clearTimeout(timeoutId);
  }, [filters]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full px-4 py-3 text-sm bg-white rounded-xl pl-10 focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm"
              value={filters.name}
              onChange={(e) => setFilters(prev => ({ ...prev, name: e.target.value }))}
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
          <button 
            className="ml-4 p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <FilterSection 
              showFilters={showFilters}
              filters={filters}
              setFilters={setFilters}
              categories={categories}
              productGroups={productGroups}
              manufacturers={manufacturers}
            />
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