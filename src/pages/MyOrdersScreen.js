import React from 'react';
import Navbar from '../components/Navbar';

const OrderCard = () => (
  <div className="bg-gray-50 rounded-xl mb-4 p-6">
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center">
        <span className="text-gray-800 text-lg font-medium">Order</span>
        <span className="text-gray-800 text-lg">#48</span>
      </div>
      <div className="bg-[#f5f0e5] text-[#96772d] px-4 py-2 rounded-lg">
        Order Completed
      </div>
    </div>

    <div className="space-y-3">
      <div className="flex items-center">
        <span className="text-gray-700 w-36">Order Date</span>
        <span className="text-gray-500">:</span>
        <span className="text-gray-700 ml-8">February 7, 2024</span>
      </div>
      
      <div className="flex items-center">
        <span className="text-gray-700 w-36">Delivery Time</span>
        <span className="text-gray-500">:</span>
        <span className="text-gray-700 ml-8">Express Delivery</span>
      </div>
      
      <div className="flex items-center">
        <span className="text-gray-800 font-semibold w-36">Amount</span>
        <span className="text-gray-500">:</span>
        <span className="text-gray-800 ml-8">$14.50</span>
      </div>
      
      <div className="flex items-center">
        <span className="text-gray-800 font-semibold w-36">Total Price</span>
        <span className="text-gray-500">:</span>
        <span className="text-gray-800 ml-8">$64.79</span>
      </div>
    </div>
  </div>
);

const MyOrdersScreen = () => {
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
        <h1 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h1>
        
        {/* Order Cards */}
        <OrderCard />
        <OrderCard />
        <OrderCard />
      </div>
      <Navbar />
    </div>
  );
};

export default MyOrdersScreen;