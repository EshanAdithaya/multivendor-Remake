import React from 'react';
import Header from '../components/Header';

const RefundsScreen = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Logo Header */}
      {/* <div className="border-b border-gray-200 p-4">
        <img
          src="/api/placeholder/40/40"
          alt="PetDoc Logo"
          className="h-10"
        />
      </div> */}
      <Header />

      {/* Main Content */}
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">My Refunds</h1>

        {/* Refunds Table */}
        <div className="shadow-sm rounded-lg border border-gray-200">
          {/* Table Header */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 border-b border-gray-200">
            <div className="text-gray-700 font-medium">ID</div>
            <div className="text-gray-700 font-medium">Refund Reason</div>
          </div>

          {/* Table Row */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-white">
            <div className="text-gray-600">#26373</div>
            <div className="text-gray-600">Urgent refund</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundsScreen;