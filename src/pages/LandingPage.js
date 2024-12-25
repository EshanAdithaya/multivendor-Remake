import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Heart, Star, ArrowRight, TrendingUp, Percent, Award, Menu, Truck, Gift, Clock, Shield, Package, Trophy, ShoppingCart } from 'lucide-react';
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

  const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const [addingToCart, setAddingToCart] = useState(false);
    const [quantity, setQuantity] = useState(1);
  
    const handleQuantityChange = (value) => {
      const newQty = Math.max(1, Math.min(product.stockQuantity, quantity + value));
      setQuantity(newQty);
    };

    const handleViewDetails = () => {
      navigate(`/productDetails?key=${product.id}`);
    };

    const handleAddToCart = async () => {
      setAddingToCart(true);
      try {
        const cartData = {
          productId: product.id,
          quantity: 1,
          shopId: product.__shop__.id,
          price: product.price,
          name: product.name,
          description: product.description,
          imageUrl: product.imageUrl,
          categoryId: product.category.id,
          productGroupId: product.productGroup.id,
          manufacturerId: product.manufacturer.id,
          productVariations: [
            {
              variationId: product.id,
              quantity: quantity,
              price: product.price,
              name: product.name,
              imageUrl: product.imageUrl
            }
          ]
        };
  
        const response = await fetch('https://ppabanckend.adaptable.app/api/carts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(cartData)
        });
  
        if (!response.ok) {
          throw new Error('Failed to add to cart');
        }
  
        alert('Product added to cart successfully!');
      } catch (error) {
        console.error('Error adding to cart:', error);
        alert('Failed to add product to cart. Please try again.');
      } finally {
        setAddingToCart(false);
      }
    };

    return (
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col">
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
        
        <div className="p-3 flex-grow flex flex-col">
          <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-1">{product.name}</h3>
          <p className="text-xs text-gray-500 mb-2 line-clamp-2">{product.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
              Stock: {product.stockQuantity}
            </span>
            {product.category && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                {product.category.name}
              </span>
            )}
          </div>
  
          <div className="mt-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-gray-900">
                ${Number(product.price).toFixed(2)}
              </span>
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg">
                <button 
                  onClick={() => handleQuantityChange(-1)}
                  className="px-2 py-1 text-gray-600 hover:text-gray-800"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-2 text-sm">{quantity}</span>
                <button 
                  onClick={() => handleQuantityChange(1)}
                  className="px-2 py-1 text-gray-600 hover:text-gray-800"
                  disabled={quantity >= product.stockQuantity}
                >
                  +
                </button>
              </div>
            </div>
  
            <div className="flex space-x-2">
              <button 
                className="flex-1 py-2 bg-yellow-400 rounded-lg text-white hover:bg-yellow-500 transition-colors text-sm"
                onClick={handleViewDetails}
              >
                Details
              </button>
              <button 
                className={`flex-1 py-2 rounded-lg text-white text-sm transition-colors ${
                  addingToCart 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-green-400 hover:bg-green-500'
                }`}
                onClick={handleAddToCart}
                disabled={addingToCart}
              >
                {addingToCart ? 'Adding...' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

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