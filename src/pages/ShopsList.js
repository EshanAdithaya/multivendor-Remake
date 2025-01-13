import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';

const API_REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;

const ShopsList = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  if (loading) return <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center text-red-600">{error}</div>;

  return (
    <main className="min-h-screen bg-[#F8F9FB]">
      <Header />
      <div className="pt-4 pb-16 px-4 space-y-3">
        {shops.map((shop) => (
          <div
            key={shop.id}
            onClick={() => handleShopClick(shop.id)}
            className="bg-white rounded-xl p-3 flex items-center gap-3 shadow-sm cursor-pointer hover:bg-gray-50"
          >
            <div className="bg-[#1E2532] w-[60px] h-[60px] rounded-full flex items-center justify-center">
              <img
                src={shop.logoUrl || '/placeholder-logo.png'}
                alt=""
                className="w-8 h-8 object-contain"
              />
            </div>
            <div className="flex-grow min-w-0">
              <h2 className="text-lg font-semibold text-[#1E2532]">{shop.name}</h2>
              <div className="flex items-start gap-1.5">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-gray-400" />
                <p className="text-sm text-gray-600 line-clamp-2">
                  {`${shop.streetAddress}, ${shop.city}, ${shop.state}, ${shop.zip}, ${shop.country}`}
                </p>
              </div>
            </div>
            <svg className="text-gray-300 w-2 h-4" viewBox="0 0 8 12">
              <path d="M1.5 1L6.5 6L1.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        ))}
      </div>
    </main>
  );
};

export default ShopsList;