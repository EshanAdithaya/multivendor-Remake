import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Filter, Search, ArrowLeft, SlidersHorizontal, X, ChevronDown, ChevronUp, ChevronRight, ChevronLeft } from 'lucide-react';
import CompactProductCard from '../components/ProductCard';
import { useWishlistService } from '../components/WishlistService';
// import './CategoryPage.css'; // We'll create this CSS file

const API_REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;

const CategoryPage = () => {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const wishlistService = useWishlistService();
  const filterPanelRef = useRef(null);
  
  // Basic states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [wishlistMap, setWishlistMap] = useState({});
  const [wishlistLoading, setWishlistLoading] = useState({});

  // Filter states
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [productGroups, setProductGroups] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [selectedProductGroup, setSelectedProductGroup] = useState('');
  const [selectedManufacturer, setSelectedManufacturer] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [stockQuantity, setStockQuantity] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    productGroup: true,
    manufacturer: true,
    price: false,
    stock: false
  });

  // Close filter panel on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (filterPanelRef.current && !filterPanelRef.current.contains(event.target) && 
          !event.target.closest('.filter-button')) {
        setShowFilterPanel(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_REACT_APP_BASE_URL}/api/categories`);
        if (!response.ok) throw new Error('Failed to fetch categories');
        
        const data = await response.json();
        setCategories(data);
        
        // If no categorySlug is provided, don't set any category filter
        if (!categorySlug) {
          setCurrentCategory(null);
          setActiveFilters({}); // Reset filters when no category is selected
          return;
        }
          // Find category that exactly matches the slug
        const exactMatchCategory = data.find(
          category => 
            category.name.toLowerCase() === categorySlug.toLowerCase() || 
            category.name.replace(/\s+/g, '-').toLowerCase() === categorySlug.toLowerCase()
        );
          if (exactMatchCategory) {
          // Exact match found
          setCurrentCategory(exactMatchCategory);
          setActiveFilters(prev => ({ ...prev, categoryId: exactMatchCategory.id }));
        } else {
          // Look for partial matches (contains the search term)
          const partialMatches = data.filter(
            category => category.name.toLowerCase().includes(categorySlug.toLowerCase())
          );
            if (partialMatches.length > 0) {
            // We have multiple categories that match
            // Sort categories by relevance - prioritize categories with "food" at the beginning if the search term is "food"
            partialMatches.sort((a, b) => {
              // First, check if either name starts with the search term
              const aStartsWith = a.name.toLowerCase().startsWith(categorySlug.toLowerCase());
              const bStartsWith = b.name.toLowerCase().startsWith(categorySlug.toLowerCase());
              
              if (aStartsWith && !bStartsWith) return -1;
              if (!aStartsWith && bStartsWith) return 1;
              
              // If same priority by start, prefer shorter names (likely more relevant)
              return a.name.length - b.name.length;
            });
            
            // Set first match (now most relevant) as current category but track all matches
            setCurrentCategory(partialMatches[0]);
            
            // Store all matching categories for displaying products from all of them
            const matchNames = partialMatches.map(cat => cat.name).join('", "');
            setError(`No exact match for "${categorySlug}". Showing products from: "${matchNames}"`);
            
            // We'll handle fetching products for all categories in the fetchProducts effect
            // Store all matching category IDs for later use
            const matchingCategoryIds = partialMatches.map(cat => cat.id);
            setActiveFilters(prev => ({ ...prev, matchingCategoryIds: matchingCategoryIds }));
          } else {
            // No matches at all
            setError(`No category named "${categorySlug}" found.`);
          }
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(err.message);
      }
    };

    fetchCategories();
  }, [categorySlug]);

  // Fetch product groups and manufacturers
  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        // Fetch product groups
        const groupsResponse = await fetch(`${API_REACT_APP_BASE_URL}/api/product-groups`);
        if (groupsResponse.ok) {
          const groupsData = await groupsResponse.json();
          setProductGroups(groupsData);
        }
        
        // Fetch manufacturers
        const manufacturersResponse = await fetch(`${API_REACT_APP_BASE_URL}/api/manufacturers`);
        if (manufacturersResponse.ok) {
          const manufacturersData = await manufacturersResponse.json();
          setManufacturers(manufacturersData);
        }
      } catch (err) {
        console.error('Error fetching filter data:', err);
      }
    };

    fetchFilterData();
  }, []);  // Fetch products with filters  // State to store grouped products by category
  const [productsByCategory, setProductsByCategory] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let allProducts = [];
        
        // Check if we have multiple matching categories
        if (activeFilters.matchingCategoryIds && activeFilters.matchingCategoryIds.length > 0) {
          // We need to fetch products for multiple categories
          const categoriesWithProducts = [];
          
          // Fetch products for each category
          for (const categoryId of activeFilters.matchingCategoryIds) {
            const params = new URLSearchParams();
            params.append('categoryId', categoryId);
            
            // Add search query if exists
            if (searchQuery) params.append('name', searchQuery);
            
            // Add other filters except categoryId which we're handling separately
            Object.entries(activeFilters).forEach(([key, value]) => {
              if (key !== 'categoryId' && key !== 'matchingCategoryIds' && value) {
                params.append(key, value);
              }
            });
            
            const apiEndpoint = `${API_REACT_APP_BASE_URL}/api/products/get-all-with-filters`;
            const response = await fetch(`${apiEndpoint}?${params.toString()}`);
            
            if (response.ok) {
              const categoryProducts = await response.json();
              
              if (categoryProducts.length > 0) {
                // Find the category name
                const category = categories.find(cat => cat.id === categoryId);
                categoriesWithProducts.push({
                  category,
                  products: categoryProducts
                });
                
                // Add these products to our overall products list
                allProducts = [...allProducts, ...categoryProducts];
              }
            }
          }
          
          // Store the categorized products for display
          setProductsByCategory(categoriesWithProducts);
          
        } else {
          // Single category or no category filter - use standard approach
          const params = new URLSearchParams();
          
          // Add all active filters to query params
          Object.entries(activeFilters).forEach(([key, value]) => {
            if (key !== 'matchingCategoryIds' && value) params.append(key, value);
          });
          
          // Add search query if exists
          if (searchQuery) params.append('name', searchQuery);
          
          // If we're on the base category page with no filters, just fetch all products
          const apiEndpoint = `${API_REACT_APP_BASE_URL}/api/products/get-all-with-filters`;
          
          const response = await fetch(
            `${apiEndpoint}?${params.toString()}`
          );
          
          if (!response.ok) throw new Error('Failed to fetch products');
          
          allProducts = await response.json();
          
          // Clear any previous categorized products
          setProductsByCategory([]);
        }
        
        setProducts(allProducts);
        setFilteredProducts(allProducts);
        
        // Check wishlist status for each product
        checkWishlistStatus(allProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeFilters, searchQuery, categories]);

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
      navigate('/protected_route');
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
  // Handler for applying filters
  const applyFilters = () => {
    const newFilters = {
      // Only include categoryId if we have a current category
      ...(currentCategory?.id && { categoryId: currentCategory.id }),
      ...(selectedProductGroup && { productGroupId: selectedProductGroup }),
      ...(selectedManufacturer && { manufacturerId: selectedManufacturer }),
      ...(stockQuantity && { stockQuantity }),
      ...(priceRange.min && { minPrice: priceRange.min }),
      ...(priceRange.max && { maxPrice: priceRange.max })
    };
    
    setActiveFilters(newFilters);
    setShowFilterPanel(false);
  };
  // Reset filters
  const resetFilters = () => {
    setSelectedProductGroup('');
    setSelectedManufacturer('');
    setPriceRange({ min: '', max: '' });
    setStockQuantity('');
    // Only keep the category filter if we're on a category page
    setActiveFilters(categorySlug ? { categoryId: currentCategory?.id } : {});
  };

  // Toggle filter panel section
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleNavigateToProduct = (productId) => {
    navigate(`/productDetails?key=${productId}`);
  };

  // Count active filters
  const activeFilterCount = Object.keys(activeFilters).filter(
    key => key !== 'categoryId' && activeFilters[key]
  ).length;

  if (loading && !products.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-transparent"></div>
      </div>
    );
  }
  // Only show error page for genuine errors, not for our helpful category suggestions
  if (error && !currentCategory) {
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
    <div className="min-h-screen bg-gray-50">      {/* Header */}      <div className="bg-white border-b sticky top-0 z-30">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold">
                {activeFilters.matchingCategoryIds ? (
                  <>
                    Search results for "<span className="text-yellow-600">{categorySlug}</span>"
                  </>
                ) : (
                  currentCategory?.name || categorySlug || "All Products"
                )}
              </h1>
              {error && currentCategory && (
                <p className="text-sm text-yellow-600 mt-1">{error}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white border-b sticky top-16 z-20">
        <div className="max-w-4xl mx-auto p-4">
          <div className="relative flex items-center">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />            <input
              type="search"
              placeholder={`Search in ${currentCategory?.name || "products"}...`}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              className="filter-button ml-3 p-2 bg-gray-100 rounded-lg hover:bg-gray-200 relative"
              onClick={() => setShowFilterPanel(!showFilterPanel)}
            >
              <SlidersHorizontal className="w-5 h-5 text-gray-600" />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 text-white text-xs rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
            
            {/* Filter Panel */}
            {showFilterPanel && (              <div 
                ref={filterPanelRef}
                className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-40"
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-lg">Filters</h3>
                    <button
                      onClick={() => setShowFilterPanel(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                    {/* Category Filter */}
                  <div className="mb-4 border-b pb-3">
                    <button 
                      className="flex items-center justify-between w-full text-left font-medium mb-2"
                      onClick={() => toggleSection('category')}
                    >
                      <span>Category</span>
                      {expandedSections.category ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    
                    {expandedSections.category && (
                      <div className="space-y-2 mt-2">
                        <select
                          className="w-full p-2 border border-gray-300 rounded-md"
                          value={currentCategory?.id || ""}
                          onChange={(e) => {
                            const selectedCategory = categories.find(cat => cat.id === e.target.value);
                            if (selectedCategory) {
                              navigate(`/category/${selectedCategory.name.toLowerCase().replace(/\s+/g, '-')}`);
                            } else {
                              navigate('/category');
                            }
                          }}
                        >
                          <option value="">All Categories</option>
                          {categories.map(category => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                  
                  {/* Product Group Filter */}
                  <div className="mb-4 border-b pb-3">
                    <button 
                      className="flex items-center justify-between w-full text-left font-medium mb-2"
                      onClick={() => toggleSection('productGroup')}
                    >
                      <span>Product Group</span>
                      {expandedSections.productGroup ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    
                    {expandedSections.productGroup && (
                      <div className="space-y-2 mt-2">
                        <select
                          className="w-full p-2 border border-gray-300 rounded-md"
                          value={selectedProductGroup}
                          onChange={(e) => setSelectedProductGroup(e.target.value)}
                        >
                          <option value="">All Product Groups</option>
                          {productGroups.map(group => (
                            <option key={group.id} value={group.id}>
                              {group.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                  
                  {/* Manufacturer Filter */}
                  <div className="mb-4 border-b pb-3">
                    <button 
                      className="flex items-center justify-between w-full text-left font-medium mb-2"
                      onClick={() => toggleSection('manufacturer')}
                    >
                      <span>Manufacturer</span>
                      {expandedSections.manufacturer ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    
                    {expandedSections.manufacturer && (
                      <div className="space-y-2 mt-2">
                        <select
                          className="w-full p-2 border border-gray-300 rounded-md"
                          value={selectedManufacturer}
                          onChange={(e) => setSelectedManufacturer(e.target.value)}
                        >
                          <option value="">All Manufacturers</option>
                          {manufacturers.map(manufacturer => (
                            <option key={manufacturer.id} value={manufacturer.id}>
                              {manufacturer.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                  
                  {/* Price Range Filter */}
                  <div className="mb-4 border-b pb-3">
                    <button 
                      className="flex items-center justify-between w-full text-left font-medium mb-2"
                      onClick={() => toggleSection('price')}
                    >
                      <span>Price Range</span>
                      {expandedSections.price ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    
                    {expandedSections.price && (
                      <div className="flex space-x-2 mt-2">
                        <input
                          type="number"
                          placeholder="Min"
                          className="w-1/2 p-2 border border-gray-300 rounded-md"
                          value={priceRange.min}
                          onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                        />
                        <input
                          type="number"
                          placeholder="Max"
                          className="w-1/2 p-2 border border-gray-300 rounded-md"
                          value={priceRange.max}
                          onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                        />
                      </div>
                    )}
                  </div>
                  
                  {/* Stock Quantity Filter */}
                  <div className="mb-4 border-b pb-3">
                    <button 
                      className="flex items-center justify-between w-full text-left font-medium mb-2"
                      onClick={() => toggleSection('stock')}
                    >
                      <span>Stock Quantity</span>
                      {expandedSections.stock ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    
                    {expandedSections.stock && (
                      <div className="mt-2">
                        <input
                          type="number"
                          placeholder="Minimum stock"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          value={stockQuantity}
                          onChange={(e) => setStockQuantity(e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                  
                  {/* Filter Actions */}
                  <div className="flex justify-between pt-2">
                    <button
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                      onClick={resetFilters}
                    >
                      Reset
                    </button>
                    <button
                      className="px-4 py-2 bg-yellow-400 text-white rounded-md hover:bg-yellow-500"
                      onClick={applyFilters}
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Active Filters Display */}
          {activeFilterCount > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedProductGroup && (
                <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm flex items-center">
                  <span className="mr-1">
                    {productGroups.find(group => group.id === selectedProductGroup)?.name || 'Product Group'}
                  </span>
                  <button 
                    onClick={() => {
                      setSelectedProductGroup('');
                      setActiveFilters(prev => {
                        const { productGroupId, ...rest } = prev;
                        return rest;
                      });
                    }}
                    className="ml-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              
              {selectedManufacturer && (
                <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm flex items-center">
                  <span className="mr-1">
                    {manufacturers.find(m => m.id === selectedManufacturer)?.name || 'Manufacturer'}
                  </span>
                  <button 
                    onClick={() => {
                      setSelectedManufacturer('');
                      setActiveFilters(prev => {
                        const { manufacturerId, ...rest } = prev;
                        return rest;
                      });
                    }}
                    className="ml-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              
              {(priceRange.min || priceRange.max) && (
                <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm flex items-center">
                  <span className="mr-1">
                    Price: {priceRange.min || '0'} - {priceRange.max || 'Any'}
                  </span>
                  <button 
                    onClick={() => {
                      setPriceRange({ min: '', max: '' });
                      setActiveFilters(prev => {
                        const { minPrice, maxPrice, ...rest } = prev;
                        return rest;
                      });
                    }}
                    className="ml-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              
              {stockQuantity && (
                <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm flex items-center">
                  <span className="mr-1">
                    Stock: {stockQuantity}+
                  </span>
                  <button 
                    onClick={() => {
                      setStockQuantity('');
                      setActiveFilters(prev => {
                        const { stockQuantity, ...rest } = prev;
                        return rest;
                      });
                    }}
                    className="ml-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              
              {activeFilterCount > 0 && (
                <button 
                  onClick={resetFilters}
                  className="text-gray-600 text-sm underline hover:text-gray-900"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>      {/* Category Navigation */}
      <div className="bg-white border-b relative z-10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex overflow-x-auto scrollbar-hide gap-3 pb-1">
            {categories.map(category => {
              // Check if this category is one of our matched categories
              const isMatchingCategory = activeFilters.matchingCategoryIds?.includes(category.id);
              // Check if we should highlight this based on the search term
              const shouldHighlight = categorySlug && category.name.toLowerCase().includes(categorySlug.toLowerCase());
              
              return (
                <button
                  key={category.id}
                  className={`px-4 py-1.5 text-sm font-medium whitespace-nowrap rounded-full transition-colors
                    ${category.id === currentCategory?.id 
                      ? 'bg-yellow-400 text-white' 
                      : isMatchingCategory 
                        ? 'bg-yellow-200 text-yellow-800 border border-yellow-400'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  onClick={() => navigate(`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`)}
                >
                  {shouldHighlight ? (
                    <span className={isMatchingCategory ? "relative" : ""}>
                      {category.name}
                      {isMatchingCategory && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-500"></span>}
                    </span>
                  ) : (
                    category.name
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>{/* Products Grid */}
      <div className="max-w-4xl mx-auto p-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-yellow-400 border-t-transparent"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-gray-500">No products found with the current filters.</p>
            <p className="text-gray-400 mt-2">Try adjusting your search criteria or clearing some filters.</p>
          </div>
        ) : productsByCategory.length > 0 ? (
          // Show products grouped by category when we have multiple categories
          <>
            <p className="text-gray-500 mb-4">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found in {productsByCategory.length} categories
            </p>
            {productsByCategory.map((categoryData, categoryIndex) => {
                // Highlight matching part of the category name if we have a search term
                const categoryName = categoryData.category.name;
                let highlightedName = categoryName;
                
                if (categorySlug && categoryName.toLowerCase().includes(categorySlug.toLowerCase())) {
                  const index = categoryName.toLowerCase().indexOf(categorySlug.toLowerCase());
                  const beforeMatch = categoryName.substring(0, index);
                  const match = categoryName.substring(index, index + categorySlug.length);
                  const afterMatch = categoryName.substring(index + categorySlug.length);
                  
                  highlightedName = (
                    <>
                      {beforeMatch}
                      <span className="bg-yellow-100 text-yellow-800 px-1 rounded">{match}</span>
                      {afterMatch}
                    </>
                  );
                }
                
                return (
                  <div key={categoryData.category.id} className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold text-gray-800">
                        {highlightedName}
                        <span className="text-sm text-gray-500 ml-2">({categoryData.products.length} products)</span>
                      </h2>
                      <button 
                        onClick={() => navigate(`/category/${categoryData.category.name.toLowerCase().replace(/\s+/g, '-')}`)}
                        className="text-sm text-yellow-600 hover:text-yellow-700 flex items-center"
                      >
                        View All
                      </button>
                    </div>
                    {/* Horizontal scrolling product container with scroll indicators */}
                    <div className="relative">
                      {categoryData.products.length > 3 && (
                        <>
                          <button 
                            className="scroll-indicator left" 
                            onClick={(e) => {
                              // Find the closest scroll container
                              const container = e.target.closest('.relative').querySelector('.overflow-x-auto');
                              if (container) {
                                container.scrollBy({ left: -600, behavior: 'smooth' });
                              }
                            }}
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <button 
                            className="scroll-indicator right" 
                            onClick={(e) => {
                              // Find the closest scroll container
                              const container = e.target.closest('.relative').querySelector('.overflow-x-auto');
                              if (container) {
                                container.scrollBy({ left: 600, behavior: 'smooth' });
                              }
                            }}
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </>
                      )}
                      <div className="overflow-x-auto pb-4 scrollbar-hide">
                        <div className="inline-flex space-x-4 pl-1 pr-1" style={{ minWidth: '100%' }}>
                          {categoryData.products.map((product) => (
                            <div key={product.id} className="w-[200px] flex-shrink-0">
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
                      </div>
                    </div>
                  </div>
                );
            })}
          </>
        ) : (
          <>
            {/* Standard product display for single category/no categories */}
            <p className="text-gray-500 mb-4">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
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