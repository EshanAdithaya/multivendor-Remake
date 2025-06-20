import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Heart, ChevronRight, ShoppingBag, Award, CheckCircle, AlertCircle } from 'lucide-react';
import _ from 'lodash';
import { toast } from 'react-toastify';
import { HeaderBar } from '../components/HeaderBar';
import CompactProductCard from '../components/ProductCard';
import { useWishlistService } from '../components/WishlistService';
import PromotionalPopup from '../components/PromotionalPopup';

const API_REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;

// Unauthorized Modal Component
const UnauthorizedModal = ({ onGoHome }) => {
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center p-6">
      <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
      <h2 className="text-xl font-bold text-center mb-2">Session Expired</h2>
      <p className="text-gray-600 text-center mb-6">
        Your session has expired or you're not authorized.
        Please go back to home and try again.
      </p>
      <button 
        onClick={onGoHome}
        className="px-6 py-3 bg-yellow-400 rounded-full font-medium shadow-sm"
      >
        Go to Home
      </button>
    </div>
  );
};

// Category Button Component
const CategoryButton = ({ icon, label, onClick }) => {
  return (
    <div className="flex flex-col items-center gap-1" onClick={onClick}>
      <div className="w-16 h-16 flex items-center justify-center">
        {icon}
      </div>
      <span className="text-xs font-medium">{label}</span>
    </div>
  );
};

// Sale Card Component
const SaleCard = ({ title, subtitle, tag, endDate, imageUrl, isOngoing, onClick }) => {
  return (
    <div className="min-w-[160px] rounded-lg overflow-hidden shadow-sm" onClick={onClick}>
      <div className="relative">
        <img 
          src={imageUrl || '/api/placeholder/160/100'} 
          alt={title} 
          className="w-full h-24 object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
          <h3 className="text-white text-sm font-bold">{title}</h3>
        </div>
      </div>
      <div className="bg-white p-2">
        <div className="flex gap-1 mb-1">
          <span className="text-xs px-2 py-0.5 bg-gray-200 rounded-full">
            {isOngoing ? "Ongoing" : "Sale Ended"}
          </span>
          {tag && (
            <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full">
              {tag}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-700 line-clamp-2">{subtitle}</p>
        {endDate && (
          <div className="flex items-center mt-1">
            <span className="text-xs text-gray-500">
              {new Date(endDate).toLocaleDateString('en-US', { 
                day: '2-digit', 
                month: 'short', 
                year: 'numeric' 
              })}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// Store Card Component
const StoreCard = ({ name, logoUrl, totalItems, rating, onClick, isFavorite }) => {
  return (
    <div className="min-w-[120px] rounded-lg overflow-hidden shadow-sm bg-white" onClick={onClick}>
      <div className="relative h-24">
        <img 
          src={logoUrl || '/api/placeholder/120/120'} 
          alt={name} 
          className="w-full h-full object-cover"
        />
        {isFavorite && (
          <div className="absolute top-1 right-1">
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
          </div>
        )}
      </div>
      <div className="p-2">
        <h3 className="font-medium text-sm">{name}</h3>
        <div className="flex items-center gap-1 mt-1">
          <span className="text-xs text-gray-500">{totalItems} items</span>
          <span className="text-xs">•</span>
          <div className="flex items-center">
            <span className="text-yellow-400 text-xs">★</span>
            <span className="text-xs ml-0.5">{rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Section Header Component
const SectionHeader = ({ title, icon, onSeeAll }) => {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-bold">{title}</h2>
        {icon}
      </div>
      <button onClick={onSeeAll} className="flex items-center text-gray-500">
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

// Main Landing Page Component
const LandingPage = () => {
  const navigate = useNavigate();
  const wishlistService = useWishlistService();
  const [searchQuery, setSearchQuery] = useState('');
  const [points, setPoints] = useState({ 
    available: 0,
    used: 0,
    earned: 0,
    expired: 0
  });
  const footerRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [flashSales, setFlashSales] = useState([
    {
      id: 1,
      title: 'Big Bag Bonanza',
      subtitle: 'Limited-Time Offer: Act Fast! 🔥',
      tag: 'Featured',
      imageUrl: '/api/placeholder/160/100',
      isOngoing: true,
      endDate: '2025-04-04',
    },
    {
      id: 2,
      title: 'Dog Love Food Promo!',
      subtitle: 'Dog Love Food Promo! Buy Now!',
      isOngoing: false,
      endDate: '2025-04-04',
      imageUrl: '/api/placeholder/160/100'
    }
  ]);
  
  const [petStores, setPetStores] = useState([
    { id: 1, name: 'Pets Cantry', totalItems: 100, rating: 4.7, logoUrl: '/api/placeholder/120/120', isFavorite: false },
    { id: 2, name: 'Pet Smart', totalItems: 45, rating: 4.5, logoUrl: '/api/placeholder/120/120', isFavorite: false },
    { id: 3, name: 'Pawsavenue', totalItems: 100, rating: 4.5, logoUrl: '/api/placeholder/120/120', isFavorite: false }
  ]);
  
  const [discoverStores, setDiscoverStores] = useState([
    { id: 4, name: 'Pet Mart', totalItems: 100, rating: 4.5, logoUrl: '/api/placeholder/120/120', isFavorite: true },
    { id: 5, name: 'Honey Combers', totalItems: 45, rating: 4.5, logoUrl: '/api/placeholder/120/120', isFavorite: false },
    { id: 6, name: 'Pet City', totalItems: 100, rating: 4.5, logoUrl: '/api/placeholder/120/120', isFavorite: false }
  ]);
  
  const [playtimeStores, setPlaytimeStores] = useState([
    { id: 7, name: 'NYC - PetMart', totalItems: 100, rating: 4.5, logoUrl: '/api/placeholder/120/120', isFavorite: true },
    { id: 8, name: 'Pet Store', totalItems: 45, rating: 4.5, logoUrl: '/api/placeholder/120/120', isFavorite: true },
    { id: 9, name: 'Pawsavenue', totalItems: 100, rating: 4.5, logoUrl: '/api/placeholder/120/120', isFavorite: false }
  ]);
  
  // New states for products
  const [foodProducts, setFoodProducts] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);
  const [toyProducts, setToyProducts] = useState([]);
  const [wishlistMap, setWishlistMap] = useState({});
  const [wishlistLoading, setWishlistLoading] = useState({});
  const [loading, setLoading] = useState(true);
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const carouselImages = [
    "https://pawsome-testing.sgp1.digitaloceanspaces.com/Application_CDN_Assets/carousel_image1.jpg",
    "https://pawsome-testing.sgp1.digitaloceanspaces.com/Application_CDN_Assets/carousel_image2.jpg",
    "https://pawsome-testing.sgp1.digitaloceanspaces.com/Application_CDN_Assets/carousel_image3.jpg",
    "https://pawsome-testing.sgp1.digitaloceanspaces.com/Application_CDN_Assets/carousel_image4.jpg",
    "https://pawsome-testing.sgp1.digitaloceanspaces.com/Application_CDN_Assets/carousel_image5.webp",
    "https://pawsome-testing.sgp1.digitaloceanspaces.com/Application_CDN_Assets/carousel_image6.webp"
  ];

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

  // Fetch products for different sections
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        // Fetch all products
        const allProductsResponse = await fetch(`${API_REACT_APP_BASE_URL}/api/products/get-all-with-filters`);
        if (allProductsResponse.ok) {
          const allProducts = await allProductsResponse.json();
          
          // Filter food products (products tagged with "Dog Food", "Cat Food", or "Puppy Food")
          const foodTagIds = ["fc475d04-482c-446e-9aca-492f9d05578c", "dd17fcb9-ae43-4fae-a2fe-122a4269bd19", "16dbfff8-cb64-4013-acbf-d1e278f31513"];
          const foodProductsList = allProducts.filter(product => 
            product.productTag.some(tag => foodTagIds.includes(tag.id))
          ).slice(0, 10); // Increased to 10 products
          setFoodProducts(foodProductsList);
          
          // Get latest products (sort by createdAt and take first 10)
          const sortedByDate = [...allProducts].sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
          );
          setLatestProducts(sortedByDate.slice(0, 10));
          
          // Filter toy products (products tagged with "pet toy" or in "Pet Toys" category)
          const toyTagId = "c184c759-ccc8-433e-91de-f51cb672c082";
          const petToysCategoryId = "767f7217-54b6-45ad-872a-9fe782bff010";
          const toyProductsList = allProducts.filter(product => 
            product.productTag.some(tag => tag.id === toyTagId) || 
            product.category.id === petToysCategoryId
          ).slice(0, 10); // Increased to 10 products
          setToyProducts(toyProductsList);
          
          // Check wishlist status for all products
          const allProductsList = [...foodProductsList, ...sortedByDate.slice(0, 10), ...toyProductsList];
          checkWishlistStatus(allProductsList);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  // Fetch user points balance
  useEffect(() => {
    const fetchPointsBalance = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        const response = await fetch(`${API_REACT_APP_BASE_URL}/api/points/balance`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          const pointsData = await response.json();
          setPoints({
            available: pointsData.pointsBalance,
            used: pointsData.totalPointsSpent,
            earned: pointsData.totalPointsEarned,
            expired: pointsData.totalPointsExpired
          });
        }
      } catch (error) {
        console.error('Error fetching points balance:', error);
        // Keep default values on error
      }
    };

    fetchPointsBalance();
  }, []);

  // Auto scroll carousel effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, [carouselImages.length]);
  
  // Smooth scroll to load more products when near bottom
  useEffect(() => {
    let scrollTimeout;
    
    const isNearBottom = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      
      // Check if we're within 100px of the bottom
      return documentHeight - (scrollTop + windowHeight) < 100;
    };

    const handleScrollToLoadMore = () => {
      if (isNearBottom() && !loading) {
        // Show visual feedback that we're at the bottom
        setIsAtBottom(true);
        
        // Auto-scroll to show the last section more clearly
        const lastProductSection = document.querySelector('[data-section="toy-products"]');
        if (lastProductSection) {
          const sectionTop = lastProductSection.getBoundingClientRect().top + window.pageYOffset;
          const targetPosition = sectionTop - 100; // Show section with some padding
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Reset the flag after scroll completes
          setTimeout(() => {
            setIsAtBottom(false);
          }, 800);
        }
      }
    };
    
    const handleScroll = () => {
      // Clear previous timeout if it exists
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      
      // Set a new timeout to check if scrolling has stopped
      scrollTimeout = setTimeout(() => {
        handleScrollToLoadMore();
      }, 150); // Wait 150ms after scrolling stops
    };
    
    // Add event listener
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [loading]);

  const handleStoreClick = (storeId) => {
    navigate(`/store/${storeId}`);
  };
  
  const handleSaleClick = (saleId) => {
    navigate(`/sale/${saleId}`);
  };
  
  // Updated search handler to navigate to category page with search query
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to category page with search query as URL parameter
      navigate(`/category?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };
  
  const handleCategoryClick = (category) => {
    navigate(`/category/${category}`);
  };

  const handleNavigateToProduct = (productId) => {
    navigate(`/productDetails?key=${productId}`);
  };

  const handleGoHome = () => {
    setIsUnauthorized(false);
    navigate('/');
    window.location.reload();
  };
  return (
    <div className="min-h-screen bg-white pb-20 overflow-x-hidden overflow-y-visible">
      {/* Promotional Popup */}
      <PromotionalPopup />
      
      {/* Unauthorized Modal */}
      {isUnauthorized && <UnauthorizedModal onGoHome={handleGoHome} />}
      
      {/* Top Navigation Bar */}
      <div className="bg-yellow-200 pt-4 pb-4 relative overflow-visible">
        {/* Yellow curved background */}
        <div className="absolute top-0 left-0 right-0 h-10 bg-yellow-400 -z-10"></div>
        
        {/* Use the HeaderBar component */}
        <div className="relative overflow-visible">
          <HeaderBar />
        </div>
        
        {/* Search Bar */}
        <div className="px-4 mt-6">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative flex items-center bg-gray-100 rounded-full py-2 px-4">
              <Search className="text-gray-400 w-5 h-5 mr-3" />
              <input
                type="text"
                placeholder="Pet Foods"
                className="bg-transparent w-full border-none outline-none text-gray-700 text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
        </div>
      </div>
      
      {/* Main Banner Carousel */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-lg overflow-hidden shadow-sm">
          <div className="relative w-full h-48">
            {carouselImages.map((image, index) => (
              <div 
                key={index}
                className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ease-in-out ${
                  index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                <img 
                  src={image} 
                  alt={`Banner ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            ))}
            <div className="absolute bottom-2 left-0 right-0 z-20 flex justify-center gap-1">
              {carouselImages.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentSlide ? 'bg-white' : 'bg-white/50'
                  }`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Categories */}
      <div className="mt-4 bg-white">
        <div className="flex justify-between px-4 py-4 overflow-x-auto scrollbar-hide">
          <CategoryButton 
            icon={<img src="https://pawsome-testing.sgp1.digitaloceanspaces.com/Application_CDN_Assets/landing_page_shortcuts_dog_food.png" alt="Dog Food" className="w-10 h-10" />}
            label="Dog Food"
            onClick={() => handleCategoryClick('dog-food')}
          />
          <CategoryButton 
            icon={<img src="https://pawsome-testing.sgp1.digitaloceanspaces.com/Application_CDN_Assets/landing_page_shortcuts_cat_food.png" alt="Cat Food" className="w-10 h-10" />}
            label="Cat Food"
            onClick={() => handleCategoryClick('cat-food')}
          />
          <CategoryButton 
            icon={<img src="https://pawsome-testing.sgp1.digitaloceanspaces.com/Application_CDN_Assets/landing_page_shortcuts_toys.png" alt="Pet Toys" className="w-10 h-10" />}
            label="Pet Toys"
            onClick={() => handleCategoryClick('pet-toys')}
          />
          <CategoryButton 
            icon={<img src="https://pawsome-testing.sgp1.digitaloceanspaces.com/Application_CDN_Assets/landing_page_shortcuts_litter.png" alt="Litter" className="w-10 h-10" />}
            label="Litter"
            onClick={() => handleCategoryClick('litter')}
          />
          <CategoryButton 
            icon={<img src="https://pawsome-testing.sgp1.digitaloceanspaces.com/Application_CDN_Assets/landing_page_shortcuts_treats.png" alt="Treats" className="w-10 h-10" />}
            label="Treats"
            onClick={() => handleCategoryClick('treats')}
          />
        </div>
      </div>
      
      {/* Points */}
      <div className="px-4 mt-4 flex gap-3">
        <div className="bg-yellow-100 rounded-lg p-3 flex-1">
          <p className="text-sm text-gray-700">Available Points</p>
          <div className="flex items-center gap-2 mt-1">
            <p className="font-bold text-lg">{points.available}</p>
            <img src="https://pawsome-testing.sgp1.digitaloceanspaces.com/Application_CDN_Assets/landing_page_shortcuts_points.png" alt="Coin" className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-yellow-100 rounded-lg p-3 flex-1">
          <p className="text-sm text-gray-700">Used Points</p>
          <div className="flex items-center gap-2 mt-1">
            <p className="font-bold text-lg">{points.used}</p>
            <img src="https://pawsome-testing.sgp1.digitaloceanspaces.com/Application_CDN_Assets/landing_page_shortcuts_used_points.png" alt="Award" className="w-5 h-5" />
          </div>
        </div>
      </div>
      
      {/* Flash Sale */}
      <div className="mt-4">
        <SectionHeader 
          title="Flash Sale 🔥" 
          onSeeAll={() => navigate('/flash-sales')}
        />
        <div className="pl-4 pb-4 overflow-x-auto">
          <div className="flex gap-3">
            {flashSales.map(sale => (
              <SaleCard 
                key={sale.id}
                {...sale}
                onClick={() => handleSaleClick(sale.id)}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Happy Tails, Full Bowls - Food Products */}
      <div className="mt-4">
        <SectionHeader 
          title="Happy Tails, Full Bowls" 
          onSeeAll={() => navigate('/category/food')}
        />
        <div className="pl-4 pb-4 overflow-x-auto">
          <div className="flex gap-3">
            {loading ? (
              <div className="flex justify-center items-center w-full h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-yellow-400 border-t-transparent"></div>
              </div>
            ) : foodProducts.length > 0 ? (
              foodProducts.map(product => (
                <div key={product.id} className="min-w-[160px]">
                  <CompactProductCard
                    product={product}
                    onNavigate={() => handleNavigateToProduct(product.id)}
                    isWishlistLoading={wishlistLoading[product.id] || false}
                    isInWishlist={wishlistMap[product.id] || false}
                    onWishlistToggle={() => handleWishlistToggle(product.id, product.__shop__?.id)}
                  />
                </div>
              ))
            ) : (
              <p className="text-gray-500">No food products available</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Keep Discovering - Latest Products */}
      <div className="mt-4">
        <SectionHeader 
          title="Keep Discovering ✓" 
          onSeeAll={() => navigate('/category')}
        />
        <div className="pl-4 pb-4 overflow-x-auto">
          <div className="flex gap-3">
            {loading ? (
              <div className="flex justify-center items-center w-full h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-yellow-400 border-t-transparent"></div>
              </div>
            ) : latestProducts.length > 0 ? (
              latestProducts.map(product => (
                <div key={product.id} className="min-w-[160px]">
                  <CompactProductCard
                    product={product}
                    onNavigate={() => handleNavigateToProduct(product.id)}
                    isWishlistLoading={wishlistLoading[product.id] || false}
                    isInWishlist={wishlistMap[product.id] || false}
                    onWishlistToggle={() => handleWishlistToggle(product.id, product.__shop__?.id)}
                  />
                </div>
              ))
            ) : (
              <p className="text-gray-500">No products available</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Playtime Starts Here - Toy Products */}
      <div className="mt-4" data-section="toy-products">
        <SectionHeader 
          title="Playtime Starts Here 🎾" 
          onSeeAll={() => navigate('/category/pet-toys')}
        />
        <div className="pl-4 pb-4 overflow-x-auto">
          <div className="flex gap-3">
            {loading ? (
              <div className="flex justify-center items-center w-full h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-yellow-400 border-t-transparent"></div>
              </div>
            ) : toyProducts.length > 0 ? (
              toyProducts.map(product => (
                <div key={product.id} className="min-w-[160px]">
                  <CompactProductCard
                    product={product}
                    onNavigate={() => handleNavigateToProduct(product.id)}
                    isWishlistLoading={wishlistLoading[product.id] || false}
                    isInWishlist={wishlistMap[product.id] || false}
                    onWishlistToggle={() => handleWishlistToggle(product.id, product.__shop__?.id)}
                  />
                </div>
              ))
            ) : (
              <p className="text-gray-500">No toy products available</p>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div 
        ref={footerRef}
        className={`mt-8 px-4 pb-10 text-center transition-all duration-300 ${
          isAtBottom ? 'transform scale-105' : ''
        }`}
      >
        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-4 shadow-sm">
          <p className="text-sm font-medium text-gray-700">🐾 You've explored all our featured collections!</p>
          <p className="mt-2 text-xs text-gray-600">Find more amazing products in our categories above</p>
          <div className="mt-3 flex justify-center space-x-2">
            <button 
              onClick={() => navigate('/category')}
              className="px-3 py-1 bg-yellow-400 text-white text-xs rounded-full hover:bg-yellow-500 transition-colors"
            >
              Browse All
            </button>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded-full hover:bg-gray-400 transition-colors"
            >
              Back to Top
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;