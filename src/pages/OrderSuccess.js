import React from 'react';
import { CheckCircle } from 'lucide-react';

const OrderSuccess = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {/* Success Card */}
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        {/* Animation Container */}
        <div className="mb-6 relative">
          {/* Outer expanding circle animation */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-green-100 animate-ping" />
          
          {/* Inner static circle */}
          <div className="relative">
            <CheckCircle className="w-24 h-24 mx-auto text-green-500 animate-bounce" />
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Order Successful!
        </h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order has been confirmed.
        </p>

        {/* Order Details */}
        <div className="bg-gray-50 rounded-md p-4 mb-6">
          <p className="text-sm text-gray-500 mb-2">
            Order number: #123-456-789
          </p>
          <p className="text-sm text-gray-500">
            A confirmation email has been sent to your inbox.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button className="w-full text-yellow-500 hover:text-yellow-600 text-white font-semibold py-2 px-4 rounded-md transition-colors">
            Track Order
          </button>
         <a href='/'> <button className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-2 px-4 rounded-md border border-gray-300 transition-colors">
            Continue Shopping
          </button> </a>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;