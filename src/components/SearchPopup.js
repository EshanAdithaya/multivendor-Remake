import React from 'react';
import { Search, ArrowLeft } from 'lucide-react';

const SearchPopup = ({ isOpen, onClose, searchQuery, setSearchQuery }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-50">
      <div className="flex items-center gap-3 p-4 border-b">
        <button onClick={onClose}>
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-base focus:outline-none"
          />
        </div>
      </div>

      {/* Recent Searches - Could be implemented later */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Recent Searches</h3>
        {/* Add recent searches list here */}
      </div>
    </div>
  );
};

export default SearchPopup;