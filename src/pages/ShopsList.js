import React, { useState, useEffect } from 'react';
import { MapPin, Star, Store } from 'lucide-react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import Lottie from 'react-lottie';
import loaderAnimation from '../Assets/animations/loading.json';
import notFoundAnimation from '../Assets/animations/not_found.json';

const API_REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;

const ShopsList = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loaderAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  const notFoundOptions = {
    loop: true,
    autoplay: true,
    animationData: notFoundAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await fetch(`${API_REACT_APP_BASE_URL}/api/shops/get-all-with-filters`);
        if (!response.ok) throw new Error('Failed to fetch shops');
        const data = await response.json();
        setShops(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchShops();
  }, []);

  const handleShopClick = (shopId) => {
    window.location.href = `/shopShow?token=${shopId}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Lottie options={defaultOptions} height={120} width={120} />
          <p className="text-orange-600 font-medium mt-4">Finding amazing pet shops... 🐾</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 flex flex-col items-center justify-center p-4">
        <div className="text-center bg-white rounded-3xl p-8 shadow-xl border-2 border-red-200">
          <div className="text-6xl mb-4">😿</div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-2xl hover:from-orange-600 hover:to-yellow-600 font-bold transition-all duration-200 active:scale-95 shadow-lg"
          >
            🔄 Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50">
      <Header />
      
      {/* Hero Section */}
      <div className="px-4 pt-6 pb-4">
        <div className="text-center mb-6">
          <div className="text-6xl mb-3">🏪🐾</div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent mb-2">
            Pet Shops
          </h1>
          <p className="text-gray-600 font-medium">Discover amazing stores for your furry friends</p>
        </div>
      </div>

      {/* Shops List */}
      <div className="px-4 pb-20">
        {shops.length === 0 ? (
          <div className="text-center py-12">
            <Lottie options={notFoundOptions} height={150} width={150} />
            <p className="text-gray-500 mt-4 font-medium">No pet shops found 🐕</p>
          </div>
        ) : (
          <div className="space-y-4">
            {shops.map((shop) => (
              <div
                key={shop.id}
                onClick={() => handleShopClick(shop.id)}
                className="bg-white rounded-3xl p-5 shadow-xl border-2 border-orange-100 cursor-pointer hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 hover:border-orange-200"
              >
                <div className="flex items-center gap-4">
                  {/* Shop Logo */}
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 via-yellow-400 to-amber-400 p-0.5 shadow-lg">
                      <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center overflow-hidden">
                        {shop.logoUrl ? (
                          <img
                            src={shop.logoUrl}
                            alt={shop.name}
                            className="w-12 h-12 object-contain"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'block';
                            }}
                          />
                        ) : null}
                        <div className="text-2xl" style={{ display: shop.logoUrl ? 'none' : 'block' }}>🏪</div>
                      </div>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                      <Store className="w-3 h-3 text-white" />
                    </div>
                  </div>

                  {/* Shop Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h2 className="text-lg font-bold text-gray-900 truncate">{shop.name}</h2>
                      {shop.rating && (
                        <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-semibold text-gray-700">{shop.rating}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-orange-500" />
                      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                        {shop.city && shop.state 
                          ? `${shop.city}, ${shop.state}` 
                          : `${shop.streetAddress}, ${shop.city}, ${shop.state}, ${shop.zip}`
                        }
                      </p>
                    </div>
                    
                    {shop.description && (
                      <p className="text-xs text-gray-500 mt-2 line-clamp-1">{shop.description}</p>
                    )}
                  </div>

                  {/* Arrow */}
                  <div className="flex-shrink-0 ml-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-100 to-yellow-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-orange-600" viewBox="0 0 8 12">
                        <path d="M1.5 1L6.5 6L1.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default ShopsList;