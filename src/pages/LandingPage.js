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

// Modern Category Button Component
const CategoryButton = ({ icon, label, onClick }) => {
  return (
    <div 
      className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-gradient-to-br from-orange-50 to-yellow-50 hover:from-orange-100 hover:to-yellow-100 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
      onClick={onClick}
    >
      <div className="w-14 h-14 flex items-center justify-center bg-white rounded-xl shadow-sm">
        {icon}
      </div>
      <span className="text-xs font-semibold text-gray-700">{label}</span>
    </div>
  );
};

// Modern Sale Card Component
const SaleCard = ({ title, subtitle, tag, endDate, imageUrl, isOngoing, onClick }) => {
  return (
    <div 
      className="min-w-[180px] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 bg-white border border-orange-100"
      onClick={onClick}
    >
      <div className="relative">
        <img 
          src={imageUrl || '/api/placeholder/180/120'} 
          alt={title} 
          className="w-full h-28 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="text-white text-sm font-bold drop-shadow-lg">{title}</h3>
        </div>
        {isOngoing && (
          <div className="absolute top-2 right-2">
            <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
              🔥 LIVE
            </div>
          </div>
        )}
      </div>
      <div className="bg-white p-3">
        <div className="flex gap-1 mb-2">
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${
            isOngoing ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
          }`}>
            {isOngoing ? "🟢 Active" : "⏰ Ended"}
          </span>
          {tag && (
            <span className="text-xs px-3 py-1 bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-700 rounded-full font-medium">
              ✨ {tag}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{subtitle}</p>
        {endDate && (
          <div className="flex items-center mt-2">
            <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">
              📅 {new Date(endDate).toLocaleDateString('en-US', { 
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

// Modern Store Card Component
const StoreCard = ({ name, logoUrl, totalItems, rating, onClick, isFavorite }) => {
  return (
    <div 
      className="min-w-[140px] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl bg-white cursor-pointer transform hover:scale-105 transition-all duration-300 border border-gray-100"
      onClick={onClick}
    >
      <div className="relative h-28">
        <img 
          src={logoUrl || '/api/placeholder/140/140'} 
          alt={name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        {isFavorite && (
          <div className="absolute top-2 right-2">
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-1">
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            </div>
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-sm text-gray-800 mb-2">{name}</h3>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">
            🏪 {totalItems} items
          </span>
          <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
            <span className="text-yellow-500 text-sm">⭐</span>
            <span className="text-xs ml-1 font-medium text-gray-700">{rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modern Section Header Component
const SectionHeader = ({ title, icon, onSeeAll }) => {
  return (
    <div className="flex items-center justify-between px-4 py-4">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-bold text-gray-800 tracking-tight">{title}</h2>
        {icon}
      </div>
      <button 
        onClick={onSeeAll} 
        className="flex items-center text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-3 py-2 rounded-xl transition-all duration-200 active:scale-95"
      >
        <span className="text-sm font-medium mr-1">See All</span>
        <ChevronRight className="w-4 h-4" />
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 pb-20 overflow-x-hidden overflow-y-visible">
      {/* Promotional Popup */}
      <PromotionalPopup />
      
      {/* Unauthorized Modal */}
      {isUnauthorized && <UnauthorizedModal onGoHome={handleGoHome} />}
      
      {/* Modern Top Navigation Bar */}
      <div className="bg-gradient-to-br from-orange-400 via-yellow-400 to-amber-400 pt-4 pb-6 relative overflow-visible">
        {/* Curved background with gradient */}
        <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 -z-10"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-2 left-4 w-8 h-8 bg-white/20 rounded-full"></div>
        <div className="absolute top-6 right-8 w-6 h-6 bg-white/20 rounded-full"></div>
        <div className="absolute top-1 right-16 w-4 h-4 bg-white/30 rounded-full"></div>
        
        {/* Use the HeaderBar component */}
        <div className="relative overflow-visible">
          <HeaderBar />
        </div>
        
        {/* Modern Search Bar */}
        <div className="px-4 mt-6">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative flex items-center bg-white/95 backdrop-blur-sm rounded-2xl py-3 px-5 shadow-lg border border-white/50">
              <Search className="text-orange-500 w-5 h-5 mr-3" />
              <input
                type="text"
                placeholder="🐾 Search for pet essentials..."
                className="bg-transparent w-full border-none outline-none text-gray-700 text-base placeholder-gray-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="ml-2 bg-orange-500 text-white p-2 rounded-xl hover:bg-orange-600 transition-colors cursor-pointer">
                <Search className="w-4 h-4" />
              </div>
            </div>
          </form>
        </div>
      </div>
      
      {/* Modern Banner Carousel */}
      <div className="px-4 mt-6">
        <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
          <div className="relative w-full h-56">
            {carouselImages.map((image, index) => (
              <div 
                key={index}
                className={`absolute top-0 left-0 w-full h-full transition-all duration-700 ease-in-out transform ${
                  index === currentSlide ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'
                }`}
              >
                <img 
                  src={image} 
                  alt={`Banner ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            ))}
            {/* Modern carousel indicators */}
            <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
              {carouselImages.map((_, index) => (
                <button
                  key={index}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentSlide 
                      ? 'w-8 h-3 bg-white shadow-lg' 
                      : 'w-3 h-3 bg-white/60 hover:bg-white/80'
                  }`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
            {/* Pet-themed overlay badge */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg">
              <span className="text-sm font-bold text-orange-600">🐾 Featured</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modern Categories Section */}
      <div className="mt-6">
        <div className="px-4 mb-4">
          <h2 className="text-lg font-bold text-gray-800 mb-1">🏪 Shop by Category</h2>
          <p className="text-sm text-gray-600">Find everything your furry friend needs</p>
        </div>
        <div className="px-4">
          <div className="grid grid-cols-5 gap-3">
            <CategoryButton 
              icon={<img src="https://pawsome-testing.sgp1.digitaloceanspaces.com/Application_CDN_Assets/landing_page_shortcuts_dog_food.png" alt="Dog Food" className="w-8 h-8" />}
              label="Dog Food"
              onClick={() => handleCategoryClick('dog-food')}
            />
            <CategoryButton 
              icon={<img src="https://pawsome-testing.sgp1.digitaloceanspaces.com/Application_CDN_Assets/landing_page_shortcuts_cat_food.png" alt="Cat Food" className="w-8 h-8" />}
              label="Cat Food"
              onClick={() => handleCategoryClick('cat-food')}
            />
            <CategoryButton 
              icon={<img src="https://pawsome-testing.sgp1.digitaloceanspaces.com/Application_CDN_Assets/landing_page_shortcuts_toys.png" alt="Pet Toys" className="w-8 h-8" />}
              label="Pet Toys"
              onClick={() => handleCategoryClick('pet-toys')}
            />
            <CategoryButton 
              icon={<img src="https://pawsome-testing.sgp1.digitaloceanspaces.com/Application_CDN_Assets/landing_page_shortcuts_litter.png" alt="Litter" className="w-8 h-8" />}
              label="Litter"
              onClick={() => handleCategoryClick('litter')}
            />
            <CategoryButton 
              icon={<img src="https://pawsome-testing.sgp1.digitaloceanspaces.com/Application_CDN_Assets/landing_page_shortcuts_treats.png" alt="Treats" className="w-8 h-8" />}
              label="Treats"
              onClick={() => handleCategoryClick('treats')}
            />
          </div>
        </div>
      </div>
      
      {/* Modern Points Section */}
      <div className="px-4 mt-6">
        <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-bold text-lg">🎯 Reward Points</h3>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
              <span className="text-white text-xs font-medium">💎 Premium</span>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 flex-1">
              <p className="text-xs text-gray-600 mb-1">Available</p>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl text-gray-800">{points.available}</span>
                <img src="https://pawsome-testing.sgp1.digitaloceanspaces.com/Application_CDN_Assets/landing_page_shortcuts_points.png" alt="Coin" className="w-6 h-6" />
              </div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 flex-1">
              <p className="text-xs text-gray-600 mb-1">Used</p>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl text-gray-800">{points.used}</span>
                <img src="https://pawsome-testing.sgp1.digitaloceanspaces.com/Application_CDN_Assets/landing_page_shortcuts_used_points.png" alt="Award" className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modern Flash Sale Section */}
      <div className="mt-8 bg-white rounded-t-3xl pt-2 shadow-lg">
        <SectionHeader 
          title="🔥 Flash Sale" 
          onSeeAll={() => navigate('/flash-sales')}
        />
        <div className="pl-4 pb-6 overflow-x-auto">
          <div className="flex gap-4">
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
      
      {/* Modern Food Products Section */}
      <div className="mt-6 bg-white">
        <SectionHeader 
          title="🍽️ Happy Tails, Full Bowls" 
          onSeeAll={() => navigate('/category/food')}
        />
        <div className="pl-4 pb-6 overflow-x-auto">
          <div className="flex gap-4">
            {loading ? (
              <div className="flex justify-center items-center w-full h-32">
                <div className="relative">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-orange-500"></div>
                  <div className="absolute inset-2 rounded-full bg-orange-50"></div>
                  <span className="absolute inset-0 flex items-center justify-center text-orange-500 text-xs">🐾</span>
                </div>
              </div>
            ) : foodProducts.length > 0 ? (
              foodProducts.map(product => (
                <div key={product.id} className="min-w-[170px]">
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
              <div className="flex items-center justify-center w-full h-32 text-gray-500">
                <div className="text-center">
                  <div className="text-4xl mb-2">😪</div>
                  <p className="text-sm">No food products available</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Modern Latest Products Section */}
      <div className="mt-6 bg-white">
        <SectionHeader 
          title="🎆 Keep Discovering" 
          onSeeAll={() => navigate('/category')}
        />
        <div className="pl-4 pb-6 overflow-x-auto">
          <div className="flex gap-4">
            {loading ? (
              <div className="flex justify-center items-center w-full h-32">
                <div className="relative">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-500"></div>
                  <div className="absolute inset-2 rounded-full bg-purple-50"></div>
                  <span className="absolute inset-0 flex items-center justify-center text-purple-500 text-xs">🔍</span>
                </div>
              </div>
            ) : latestProducts.length > 0 ? (
              latestProducts.map(product => (
                <div key={product.id} className="min-w-[170px]">
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
              <div className="flex items-center justify-center w-full h-32 text-gray-500">
                <div className="text-center">
                  <div className="text-4xl mb-2">🤷</div>
                  <p className="text-sm">No products available</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Modern Toy Products Section */}
      <div className="mt-6 bg-white" data-section="toy-products">
        <SectionHeader 
          title="🎾 Playtime Starts Here" 
          onSeeAll={() => navigate('/category/pet-toys')}
        />
        <div className="pl-4 pb-6 overflow-x-auto">
          <div className="flex gap-4">
            {loading ? (
              <div className="flex justify-center items-center w-full h-32">
                <div className="relative">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-200 border-t-green-500"></div>
                  <div className="absolute inset-2 rounded-full bg-green-50"></div>
                  <span className="absolute inset-0 flex items-center justify-center text-green-500 text-xs">🎾</span>
                </div>
              </div>
            ) : toyProducts.length > 0 ? (
              toyProducts.map(product => (
                <div key={product.id} className="min-w-[170px]">
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
              <div className="flex items-center justify-center w-full h-32 text-gray-500">
                <div className="text-center">
                  <div className="text-4xl mb-2">🥸</div>
                  <p className="text-sm">No toy products available</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modern Footer */}
      <div 
        ref={footerRef}
        className={`mt-12 px-4 pb-12 text-center transition-all duration-300 ${
          isAtBottom ? 'transform scale-105' : ''
        }`}
      >
        <div className="bg-gradient-to-br from-orange-400 via-pink-400 to-purple-500 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-2 left-4 w-16 h-16 bg-white/10 rounded-full"></div>
          <div className="absolute bottom-2 right-6 w-12 h-12 bg-white/10 rounded-full"></div>
          <div className="absolute top-1/2 right-2 w-8 h-8 bg-white/20 rounded-full"></div>
          
          <div className="relative z-10">
            <div className="text-4xl mb-3">🐾🎉</div>
            <p className="text-lg font-bold text-white mb-2">You've explored all our featured collections!</p>
            <p className="text-sm text-white/90 mb-6">Discover more amazing products for your furry friends</p>
            <div className="flex justify-center space-x-4">
              <button 
                onClick={() => navigate('/category')}
                className="px-6 py-3 bg-white text-orange-600 font-bold rounded-2xl hover:bg-gray-50 transition-all duration-200 shadow-lg active:scale-95"
              >
                🛍️ Browse All
              </button>
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white font-medium rounded-2xl hover:bg-white/30 transition-all duration-200 active:scale-95"
              >
                ⬆️ Back to Top
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;