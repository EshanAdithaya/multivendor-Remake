import React from 'react';
import Navbar from '../../components/Navbar';

const MyCardsScreen = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header with Logo */}
      <div className="w-full border-b border-gray-100 px-4 py-3">
        <div className="flex items-center">
          <div className="relative w-24">
            <div className="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center">
              <div className="text-white text-xs transform -rotate-45">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M12,2C6.48,2,2,6.48,2,12c0,5.52,4.48,10,10,10s10-4.48,10-10C22,6.48,17.52,2,12,2z M12,20c-4.41,0-8-3.59-8-8 s3.59-8,8-8s8,3.59,8,8S16.41,20,12,20z"/>
                  <path d="M15,11c1.1,0,2-0.9,2-2s-0.9-2-2-2s-2,0.9-2,2S13.9,11,15,11z"/>
                  <path d="M9,11c1.1,0,2-0.9,2-2s-0.9-2-2-2s-2,0.9-2,2S7.9,11,9,11z"/>
                </svg>
              </div>
            </div>
            <span className="absolute bottom-0 left-11 text-sm font-medium text-gray-700">PetDoc</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 pt-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Cards</h1>
          <button className="text-yellow-400 font-semibold flex items-center">
            <span className="text-2xl mr-2">+</span>
            <span>Add Card</span>
          </button>
        </div>

        {/* Card Content */}
        <div className="bg-white rounded-xl shadow-sm">
          {/* Header Row */}
          <div className="flex justify-between px-6 py-4 bg-gray-50 rounded-t-xl">
            <span className="text-gray-500 font-medium">Company</span>
            <span className="text-gray-500 font-medium">Card N</span>
          </div>

          {/* Empty State */}
          <div className="px-6 py-12 flex justify-center border-t border-gray-100">
            <span className="text-gray-500">No card found</span>
          </div>
        </div>
      </div>
      {/* <Navbar /> */}
    </div>
  );
};

export default MyCardsScreen;