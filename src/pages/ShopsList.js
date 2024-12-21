import React from 'react';
import { MapPin } from 'lucide-react';
import Header from '../components/Header';

const ShopsList = () => {
  const shops = [
    {
      id: 1,
      name: "Bakery Shop",
      address: "4422 Fort Street, Carolina, Rocky Mount, 27801, USA",
      logo: "/bread-logo.png", // Replace with actual path
      iconBg: "bg-[#1E2532]",
      iconColor: "text-yellow-500"
    },
    {
      id: 2,
      name: "Makeup Shop",
      address: "2960 Rose Avenue, Louisiana, Metairie, 70001, USA",
      logo: "/makeup-logo.png",
      iconBg: "bg-[#B3823E]",
      iconColor: "text-white"
    },
    {
      id: 3,
      name: "Bags Shop",
      address: "1740 Bedford Street, Alabama, Michigan, 35203, USA",
      logo: "/bags-logo.png",
      iconBg: "bg-[#1E2532]",
      iconColor: "text-[#FFA500]"
    },
    {
      id: 4,
      name: "Clothing Shop",
      address: "4885 Spring Street, Illinois, Lincoln, 62656, USA",
      logo: "/clothing-logo.png",
      iconBg: "bg-[#D84B4B]",
      iconColor: "text-white"
    },
    {
      id: 5,
      name: "Furniture Shop",
      address: "588 Finwood Road, New Jersey, East Dover, 08753, USA",
      logo: "/furniture-logo.png",
      iconBg: "bg-[#A0522D]",
      iconColor: "text-white"
    }
  ];

  return (
    <main className="min-h-screen bg-[#F8F9FB]">
      {/* Safe area spacing for mobile */}
      <Header />
      <div className="pt-4 pb-16 px-4 space-y-3">
        {shops.map((shop) => (
          <div 
            key={shop.id}
            className="bg-white rounded-xl p-3 flex items-center gap-3 shadow-[0_2px_8px_rgba(0,0,0,0.05)] active:bg-gray-50 touch-manipulation"
          >
            {/* Icon Container - Slightly smaller for mobile */}
            <div className={`${shop.iconBg} w-[60px] h-[60px] rounded-full flex items-center justify-center flex-shrink-0`}>
              <img 
                src={shop.logo}
                alt=""
                className={`w-8 h-8 object-contain ${shop.iconColor}`}
              />
            </div>
            
            {/* Content Container */}
            <div className="flex-grow min-w-0 py-0.5">
              <h2 className="text-lg font-semibold text-[#1E2532] tracking-[-0.2px] mb-0.5">
                {shop.name}
              </h2>
              <div className="flex items-start gap-1.5">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-gray-400" />
                <p className="text-sm leading-5 text-[#6B7280] font-normal line-clamp-2">
                  {shop.address}
                </p>
              </div>
            </div>

            {/* Subtle right arrow indicator for touch targets */}
            <div className="text-gray-300 pr-1">
              <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.5 1L6.5 6L1.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default ShopsList;