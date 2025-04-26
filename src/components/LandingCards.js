import React from 'react';
import { Heart, ChevronRight } from 'lucide-react';

// Category Button Component
export const CategoryButton = ({ icon, label, onClick }) => {
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
export const SaleCard = ({ title, subtitle, tag, endDate, imageUrl, isOngoing, onClick }) => {
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
export const StoreCard = ({ name, logoUrl, totalItems, rating, onClick, isFavorite }) => {
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
export const SectionHeader = ({ title, icon, onSeeAll }) => {
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