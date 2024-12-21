import React from 'react';
import Header from '../components/Header';

const PromotionsPage = () => {
  const coupons = [
    { code: '5OFF', amount: 5 },
    { code: '5OFF', amount: 5 },
    { code: '5OFF', amount: 5 },
  ];

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="min-h-screen bg-white px-4 pt-8 pb-20">
      {/* Header */}
      <Header />
      <h1 className="text-[32px] font-bold text-[#1a1a1a] mb-8">
        Promotions
      </h1>

      {/* Coupons Container */}
      <div className="space-y-4">
        {coupons.map((coupon, index) => (
          <div key={index} className="relative">
            {/* Coupon Card */}
            <div className="rounded-2xl bg-[#FFB98A] p-8 relative">
              {/* Dotted Border */}
              <div className="absolute inset-4 border-2 border-dashed border-white rounded-xl opacity-50" />
              
              {/* Coupon Amount */}
              <div className="text-white text-center text-4xl font-bold">
                ${coupon.amount} OFF
              </div>
            </div>

            {/* Code Bar */}
            <div className="flex justify-between items-center px-4 py-3 bg-gray-50 rounded-b-xl">
              <span className="font-medium text-gray-700">{coupon.code}</span>
              <button
                onClick={() => handleCopy(coupon.code)}
                className="text-[#F5A05F] font-medium"
              >
                Copy
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromotionsPage;