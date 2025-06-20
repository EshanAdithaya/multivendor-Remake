import React from 'react';
import { Heart, ChevronRight } from 'lucide-react';

// Modern Category Button Component
export const CategoryButton = ({ icon, label, onClick }) => {
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
export const SaleCard = ({ title, subtitle, tag, endDate, imageUrl, isOngoing, onClick }) => {
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
export const StoreCard = ({ name, logoUrl, totalItems, rating, onClick, isFavorite }) => {
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
export const SectionHeader = ({ title, icon, onSeeAll }) => {
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