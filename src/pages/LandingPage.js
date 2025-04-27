import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Heart, ChevronRight, ShoppingBag, Award, CheckCircle, AlertCircle } from 'lucide-react';
import _ from 'lodash';
import { toast } from 'react-toastify';
import { HeaderBar } from '../components/HeaderBar';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [points, setPoints] = useState({ available: 2500, used: 758 });
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

  const navigate = useNavigate();

  // Fetch data from API (if needed)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch points, flash sales, pet stores, etc.
        // This is a placeholder for actual API calls
        
        // Example:
        // const pointsResponse = await fetch(`${API_REACT_APP_BASE_URL}/api/user/points`);
        // if (pointsResponse.status === 401) {
        //   setIsUnauthorized(true);
        //   return;
        // }
        // if (pointsResponse.ok) {
        //   const pointsData = await pointsResponse.json();
        //   setPoints(pointsData);
        // }
        
        // Handle unauthorized response for any API call
        const handleUnauthorized = (response) => {
          if (response.status === 401) {
            setIsUnauthorized(true);
            return true;
          }
          return false;
        };
        
        // Example of how to use the handler with multiple API calls
        // const pointsResponse = await fetch(`${API_REACT_APP_BASE_URL}/api/user/points`);
        // if (handleUnauthorized(pointsResponse)) return;
        
        // const salesResponse = await fetch(`${API_REACT_APP_BASE_URL}/api/flash-sales`);
        // if (handleUnauthorized(salesResponse)) return;
        
        // Similarly for other data...
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, []);

  // Auto scroll carousel effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, [carouselImages.length]);

  const handleStoreClick = (storeId) => {
    // Navigate to store page
    navigate(`/store/${storeId}`);
  };
  
  const handleSaleClick = (saleId) => {
    // Navigate to sale page
    navigate(`/sale/${saleId}`);
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${searchQuery}`);
  };
  
  const handleCategoryClick = (category) => {
    navigate(`/category/${category}`);
  };

  const handleGoHome = () => {
    setIsUnauthorized(false);
    navigate('/');
    window.location.reload(); // Force a full page reload
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Unauthorized Modal */}
      {isUnauthorized && <UnauthorizedModal onGoHome={handleGoHome} />}
      
      {/* Top Navigation Bar */}
      <div className="bg-yellow-200 pt-4 pb-4 relative">
        {/* Yellow curved background */}
        <div className="absolute top-0 left-0 right-0 h-10 bg-yellow-400 -z-10"></div>
        
        {/* Use the HeaderBar component */}
        <HeaderBar />
        
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
      
      {/* Pet Stores - Happy Tails */}
      <div className="mt-4">
        <SectionHeader 
          title="Happy Tails, Full Bowls" 
          onSeeAll={() => navigate('/stores/happy-tails')}
        />
        <div className="pl-4 pb-4 overflow-x-auto">
          <div className="flex gap-3">
            {petStores.map(store => (
              <StoreCard 
                key={store.id}
                {...store}
                onClick={() => handleStoreClick(store.id)}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Keep Discovering */}
      <div className="mt-4">
        <SectionHeader 
          title="Keep Discovering ✓" 
          onSeeAll={() => navigate('/stores/discover')}
        />
        <div className="pl-4 pb-4 overflow-x-auto">
          <div className="flex gap-3">
            {discoverStores.map(store => (
              <StoreCard 
                key={store.id}
                {...store}
                onClick={() => handleStoreClick(store.id)}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Playtime Starts Here */}
      <div className="mt-4">
        <SectionHeader 
          title="Playtime Starts Here 🎾" 
          onSeeAll={() => navigate('/stores/playtime')}
        />
        <div className="pl-4 pb-4 overflow-x-auto">
          <div className="flex gap-3">
            {playtimeStores.map(store => (
              <StoreCard 
                key={store.id}
                {...store}
                onClick={() => handleStoreClick(store.id)}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-8 px-4 text-center text-xs text-gray-500">
        <p>We've got you covered for now.</p>
        <p className="mt-1">Stay tuned for more updates</p>
      </div>
    </div>
  );
};

export default LandingPage;