import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Filter, Search, ArrowLeft, SlidersHorizontal } from 'lucide-react';
import CompactProductCard from '../components/ProductCard';
import { useWishlistService } from '../components/WishlistService';

const API_REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;

const CategoryPage = () => {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const wishlistService = useWishlistService();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [wishlistMap, setWishlistMap] = useState({});
  const [wishlistLoading, setWishlistLoading] = useState({});

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_REACT_APP_BASE_URL}/api/categories`);
        if (!response.ok) throw new Error('Failed to fetch categories');
        
        const data = await response.json();
        setCategories(data);
        
        // Find category that matches the slug (both by name and case-insensitive comparison)
        const matchedCategory = data.find(
          category => 
            category.name.toLowerCase() === categorySlug.toLowerCase() || 
            category.name.replace(/\s+/g, '-').toLowerCase() === categorySlug.toLowerCase()
        );
        
        if (matchedCategory) {
          setCurrentCategory(matchedCategory);
        } else {
          setError(`Category "${categorySlug}" not found`);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(err.message);
      }
    };

    fetchCategories();
  }, [categorySlug]);

  // Fetch products for the current category
  useEffect(() => {
    const fetchProducts = async () => {
      if (!currentCategory) return;
      
      try {
        setLoading(true);
        const response = await fetch(
          `${API_REACT_APP_BASE_URL}/api/products/get-all-with-filters?categoryId=${currentCategory.id}`
        );
        
        if (!response.ok) throw new Error('Failed to fetch products');
        
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
        
        // Check wishlist status for each product
        checkWishlistStatus(data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentCategory]);

  // Filter products based on search query
  useEffect(() => {
    if (!products.length) return;
    
    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  // Check wishlist status for each product
  const checkWishlistStatus = async (products) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;
      
      const wishlistItems = await fetchWishlistItems();
      const wishlistProductIds = new Set(wishlistItems.map(item => item.product.id));
      
      const wishlistStatus = {};
      products.forEach(product => {
        wishlistStatus[product.id] = wishlistProductIds.has(product.id);
      });
      
      setWishlistMap(wishlistStatus);
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  };

  // Fetch all wishlist items
  const fetchWishlistItems = async () => {
    try {
      const response = await fetch(`${API_REACT_APP_BASE_URL}/api/wishlist/my-wishlist`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Accept': 'application/json'
        },
      });
      
      if (response.ok) {
        return await response.json();
      }
      return [];
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      return [];
    }
  };

  // Handle wishlist toggle
  const handleWishlistToggle = async (productId, shopId) => {
    if (!localStorage.getItem('accessToken')) {
      navigate('/login');
      return;
    }
    
    setWishlistLoading(prev => ({ ...prev, [productId]: true }));
    
    try {
      const wasInWishlist = wishlistMap[productId];
      
      // Optimistic update
      setWishlistMap(prev => ({ ...prev, [productId]: !wasInWishlist }));
      
      if (wasInWishlist) {
        await wishlistService.removeFromWishlist(productId);
      } else {
        await wishlistService.addToWishlist(productId, shopId);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      // Revert on error
      setWishlistMap(prev => ({ ...prev, [productId]: !prev[productId] }));
    } finally {
      setWishlistLoading(prev => ({ ...prev, [productId]: false }));
    }
  };

  const handleNavigateToProduct = (productId) => {
    navigate(`/productDetails?key=${productId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Back
          </button>
          
          <div className="bg-red-50 text-red-700 p-4 rounded-lg">
            <p className="font-medium text-lg">Error</p>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            <h1 className="text-xl font-bold">
              {currentCategory?.name || categorySlug}
            </h1>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white border-b sticky top-16 z-10">
        <div className="max-w-4xl mx-auto p-4">
          <div className="relative flex items-center">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="search"
              placeholder={`Search in ${currentCategory?.name || categorySlug}...`}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="ml-3 p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
              <SlidersHorizontal className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex overflow-x-auto scrollbar-hide gap-3 pb-1">
            {categories.map(category => (
              <button
                key={category.id}
                className={`px-4 py-1.5 text-sm font-medium whitespace-nowrap rounded-full transition-colors
                  ${category.id === currentCategory?.id
                    ? 'bg-yellow-400 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                onClick={() => navigate(`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-4xl mx-auto p-4">
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-gray-500">No products found in this category.</p>
            <p className="text-gray-400 mt-2">Try adjusting your search or browse another category.</p>
          </div>
        ) : (
          <>
            <p className="text-gray-500 mb-4">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredProducts.map(product => (
                <div key={product.id} className="w-full">
                  <CompactProductCard
                    product={product}
                    onNavigate={() => handleNavigateToProduct(product.id)}
                    isWishlistLoading={wishlistLoading[product.id] || false}
                    isInWishlist={wishlistMap[product.id] || false}
                    onWishlistToggle={() => handleWishlistToggle(product.id, product.__shop__?.id)}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;