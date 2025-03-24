import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Heart, ChevronRight, ShoppingBag, Award, CheckCircle } from 'lucide-react';
import _ from 'lodash';
import { toast } from 'react-toastify';

const API_REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;

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
  
  const navigate = useNavigate();

  // Fetch data from API (if needed)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch points, flash sales, pet stores, etc.
        // This is a placeholder for actual API calls
        
        // Example:
        // const pointsResponse = await fetch(`${API_REACT_APP_BASE_URL}/api/user/points`);
        // if (pointsResponse.ok) {
        //   const pointsData = await pointsResponse.json();
        //   setPoints(pointsData);
        // }
        
        // Similarly for other data...
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, []);

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

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Top Navigation Bar */}
      <div className="bg-yellow-200 pt-20 pb-4 relative">
        {/* Yellow curved background */}
        <div className="absolute top-0 left-0 right-0 h-10 bg-yellow-400 -z-10 "></div>
        
        {/* Tabs - positioned halfway on the curved yellow background */}
        <div className="flex justify-around px-2 -mt-8">
          <div className="flex flex-col items-center">
            <div className="bg-yellow-500 w-20 h-12 rounded-xl flex items-center justify-center gap-1">
              <img 
                src="https://pawsome-testing.sgp1.digitaloceanspaces.com/Application_CDN_Assets/landing_page_pure_address.png" 
                alt="Location" 
                className="w-5 h-5" 
              />
              <ChevronRight className="w-4 h-4 text-white transform rotate-90" />
            </div>
            <div className="bg-white px-3 py-0.2 rounded-md -mt-3 text-center border border-yellow-500 z-10">
            <span className="text-xs font-medium text-yellow-500">Addresses</span>
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="bg-yellow-500 w-20 h-12 rounded-xl flex items-center justify-center gap-1">
            <img 
                src="https://pawsome-testing.sgp1.digitaloceanspaces.com/Application_CDN_Assets/landing_page_wishlist.png" 
                alt="Location" 
                className="w-5 h-5" 
              />
              <span className="text-white text-base font-medium ml-1">20</span>
            </div>
            <div className="bg-white px-3 py-0.2 rounded-md -mt-3 text-center border border-yellow-500 z-10">
            <span className="text-xs font-medium text-yellow-500">Wishlist</span>
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="bg-yellow-500 w-20 h-12 rounded-xl flex items-center justify-center gap-1">
              <img 
                src="https://pawsome-testing.sgp1.digitaloceanspaces.com/Application_CDN_Assets/landing_page_orders.png" 
                alt="Orders" 
                className="w-5 h-5" 
              />
              <span className="text-white text-base font-medium ml-1">20</span>
            </div>
            <div className="bg-white px-3 py-0.2 rounded-md -mt-3 text-center border border-yellow-500 z-10">
            <span className="text-xs font-medium text-yellow-500">Orders</span>
            </div>
          </div>
          
          <div className="flex flex-col items-center ">
            <div className="bg-yellow-500 w-20 h-12 rounded-xl flex items-center justify-center gap-1 ">
            <img 
                src="https://pawsome-testing.sgp1.digitaloceanspaces.com/Application_CDN_Assets/landing_page_cart.png" 
                alt="Orders" 
                className="w-5 h-5" 
              />
              <span className="text-white text-base font-medium ml-1">20</span>
            </div>
            <div className="bg-white px-3 py-0.2 rounded-md -mt-3 text-center border border-yellow-500 z-10">
              <span className="text-xs font-medium text-yellow-500">Cart</span>
            </div>
          </div>
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
      
      
      {/* Main Banner */}
      <div className="px-4 mt-4">
        <div className="bg-orange-100 rounded-lg overflow-hidden">
          <div className="p-4">
            <h2 className="text-2xl font-bold text-brown-800">FEED THEM AS FAMILY</h2>
            <p className="text-sm font-bold text-brown-700">FRESH, RAW, REAL FOOD FOR PETS</p>
            <div className="mt-2">
              <img 
                src="/api/placeholder/60/60"
                alt="Dog"
                className="w-16 h-16 object-cover rounded-full"
              />
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