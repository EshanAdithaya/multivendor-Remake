import React from 'react';

const FlashSalesPage = () => {
  const salesData = [
    {
      title: "Limited-Time Offer: Act Fast! 🔥",
      offerTill: "31 Oct 2023 - 29 Nov 2024",
      campaignStatus: "On going",
      campaignType: "Percentage",
      dealsRate: "50"
    },
    {
      title: "Limited time discounts.",
      offerTill: "16 Oct 2023 - 29 Nov 2024",
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] px-4 pt-8 pb-20">
      {/* Header */}
      <h1 className="text-[32px] font-bold text-[#1a1a1a] mb-8">
        Flash sales
      </h1>

      {/* Sales Cards Container */}
      <div className="space-y-6">
        {salesData.map((sale, index) => (
          <div key={index} className="space-y-4">
            {/* Flash Sale Banner */}
            <div className="rounded-2xl bg-[#5B699C] p-6 relative overflow-hidden">
              <svg viewBox="0 0 400 100" className="w-full">
                <text x="50" y="60" className="text-4xl font-bold fill-white drop-shadow-lg">
                  FLASH
                </text>
                <path d="M180 20 L200 10 L190 50 L210 45 L180 90" 
                      fill="#FFD700" 
                      className="drop-shadow-lg" />
                <text x="220" y="60" className="text-4xl font-bold fill-white drop-shadow-lg">
                  SALE!
                </text>
              </svg>
            </div>

            {/* Sale Details */}
            <div className="space-y-3">
              <h2 className="text-xl font-semibold">{sale.title}</h2>
              
              <div className="space-y-2">
                <div className="flex">
                  <span className="text-black font-semibold min-w-[180px]">Offer Till:</span>
                  <span className="text-gray-600">{sale.offerTill}</span>
                </div>
                
                {sale.campaignStatus && (
                  <div className="flex">
                    <span className="text-black font-semibold min-w-[180px]">Campaign status :</span>
                    <span className="text-gray-600">{sale.campaignStatus}</span>
                  </div>
                )}
                
                {sale.campaignType && (
                  <div className="flex">
                    <span className="text-black font-semibold min-w-[180px]">Campaign type on :</span>
                    <span className="text-gray-600">{sale.campaignType}</span>
                  </div>
                )}
                
                {sale.dealsRate && (
                  <div className="flex">
                    <span className="text-black font-semibold min-w-[180px]">Deals rate :</span>
                    <span className="text-gray-600">{sale.dealsRate}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlashSalesPage;