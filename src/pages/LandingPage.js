import React, { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import Header from '../components/Header';

// Use CDN links for Card and Badge components
const Card = ({ children, className }) => (
  <div className={`card ${className}`}>{children}</div>
);

const CardContent = ({ children, className }) => (
  <div className={`card-content ${className}`}>{children}</div>
);

const Badge = ({ children, className, variant }) => (
  <span className={`badge ${variant} ${className}`}>{children}</span>
);

// ProductCard Component
const ProductCard = ({ product }) => (
  <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
    <CardContent className="p-0">
      <div className="relative">
        <div className="aspect-[4/3] overflow-hidden bg-gray-100">
          <img
            src={product.imageUrl || "/api/placeholder/400/300"}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        {product.isNew && (
          <Badge className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 font-medium">
            New
          </Badge>
        )}
      </div>
      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
              {product.name}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {product.manufacturer?.name}
            </p>
          </div>
          <Badge variant="outline" className="bg-gray-50">
            {product.category?.name}
          </Badge>
        </div>
        <p className="text-gray-600 text-sm line-clamp-2">
          {product.description}
        </p>
        <div className="pt-3 flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">
            ${product.price?.toFixed(2)}
          </span>
          <button className="px-4 py-2 bg-yellow-400 text-yellow-900 rounded-lg font-medium hover:bg-yellow-500 transition-colors">
            View Details
          </button>
        </div>
      </div>
    </CardContent>
  </Card>
);

// FilterSection Component
const FilterSection = ({ showFilters, filters, setFilters, categories, productGroups, manufacturers }) => (
  <div className={`lg:block ${showFilters ? 'block' : 'hidden'}`}>
    <div className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-4">
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
        {/* Categories */}
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

        {/* Product Groups */}
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

        {/* Manufacturers */}
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

// Main LandingPage Component
const LandingPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productGroups, setProductGroups] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState({
    name: '',
    categoryId: '',
    productGroupId: '',
    manufacturerId: ''
  });

  // Initial data fetch
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
        
        if (!productsRes.ok || !categoriesRes.ok || !groupsRes.ok || !manufacturersRes.ok) {
          throw new Error('Failed to fetch data');
        }

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
        setError('Failed to load initial data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchInitialData();
  }, []);

  // Filter products effect
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const activeFilters = Object.entries(filters).filter(([_, value]) => value !== '');
        const queryParams = new URLSearchParams(Object.fromEntries(activeFilters));
        
        const response = await fetch(
          `https://ppabanckend.adaptable.app/api/products/get-all-with-filters${
            activeFilters.length ? `?${queryParams}` : ''
          }`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again.');
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
      <main className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8 flex items-center justify-between max-w-3xl mx-auto">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full px-4 py-3.5 text-base bg-white rounded-2xl pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm transition-shadow duration-200 hover:shadow-md"
              value={filters.name}
              onChange={(e) => setFilters(prev => ({ ...prev, name: e.target.value }))}
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
          </div>
          <button 
            className="ml-4 p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:bg-gray-50 lg:hidden"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className={`w-5 h-5 transition-colors duration-200 ${showFilters ? 'text-yellow-500' : 'text-gray-400'}`} />
          </button>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Section */}
          <div className="lg:col-span-1">
            <FilterSection 
              showFilters={showFilters}
              filters={filters}
              setFilters={setFilters}
              categories={categories}
              productGroups={productGroups}
              manufacturers={manufacturers}
            />
          </div>
          
          {/* Products Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mx-auto"></div>
                <p className="mt-6 text-gray-600 text-lg">Loading amazing products...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12 px-4">
                <div className="bg-red-50 rounded-xl p-6 max-w-md mx-auto">
                  <p className="text-red-600 text-lg">{error}</p>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="mt-4 px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
                {products.length === 0 && !error && (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-500 text-lg">No products found matching your criteria</p>
                    <button
                      onClick={() => setFilters({
                        name: '',
                        categoryId: '',
                        productGroupId: '',
                        manufacturerId: ''
                      })}
                      className="mt-4 text-yellow-600 hover:text-yellow-700 font-medium"
                    >
                      Clear all filters
                    </button>
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