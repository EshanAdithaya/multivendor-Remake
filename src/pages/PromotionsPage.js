import React, { useState, useEffect } from 'react';
import { Copy, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import Header from '../components/Header';

const PromotionsPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/coupons`);
      if (!response.ok) throw new Error('Failed to fetch coupons');
      const data = await response.json();
      setCoupons(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const formatValue = (type, value) => {
    if (type === 'fixed') {
      return `$${parseFloat(value).toFixed(2)} OFF`;
    }
    return `${value}% OFF`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 pt-8 pb-20">
      <Header />
      
      <div className="max-w-6xl mx-auto">
        <h1 className="text-[32px] font-bold text-[#1a1a1a] mb-8">
          Promotions
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        )}

        {coupons.length === 0 && !error ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No active promotions at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coupons.map((coupon) => (
              <div key={coupon.id} className="relative">
                {/* Coupon Card */}
                <div className="rounded-t-2xl bg-[#FFB98A] p-8 relative overflow-hidden">
                  {/* Dotted Border */}
                  <div className="absolute inset-4 border-2 border-dashed border-white rounded-xl opacity-50" />
                  
                  {/* Coupon Image */}
                  {coupon.image && (
                    <div className="absolute top-4 right-4 w-16 h-16 rounded-lg overflow-hidden">
                      <img 
                        src={coupon.image.url} 
                        alt="Coupon" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  {/* Coupon Value */}
                  <div className="text-white text-center">
                    <div className="text-4xl font-bold mb-2">
                      {formatValue(coupon.type, coupon.value)}
                    </div>
                    {coupon.maxUsage && (
                      <div className="text-sm opacity-90">
                        Limited to {coupon.maxUsage} uses
                      </div>
                    )}
                  </div>
                </div>

                {/* Code Bar */}
                <div className="flex flex-col px-4 py-3 bg-gray-50 rounded-b-xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-700">{coupon.code}</span>
                    <button
                      onClick={() => handleCopy(coupon.code)}
                      className="flex items-center gap-2 text-[#F5A05F] font-medium px-3 py-1 rounded hover:bg-[#fff3eb] transition-colors"
                    >
                      {copiedCode === coupon.code ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  
                  {/* Expiry Date */}
                  {coupon.expiresAt && (
                    <div className="text-sm text-gray-500">
                      Expires: {formatDate(coupon.expiresAt)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PromotionsPage;