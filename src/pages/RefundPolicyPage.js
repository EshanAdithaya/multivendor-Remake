import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import Header from '../components/Header';

const RefundPolicyPage = () => {
  const [policies, setPolicies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPolicies = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/refund-policies`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch refund policies');
        }

        const data = await response.json();
        // Sort policies by orderIndex if available
        const sortedPolicies = data
          .filter(policy => policy.isActive && policy.content)
          .sort((a, b) => a.orderIndex - b.orderIndex);

        setPolicies(sortedPolicies);
        setError('');
      } catch (err) {
        setError('Failed to load refund policies. Please try again later.');
        console.error('Error fetching policies:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPolicies();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white px-4 pt-8">
        <Header />
        <h1 className="text-[32px] font-bold text-[#1a1a1a] mb-12">
          Refund Policy
        </h1>
        <div className="space-y-8">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 pt-8 pb-20">
      <Header />
      <h1 className="text-[32px] font-bold text-[#1a1a1a] mb-12">
        Refund Policy
      </h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {!error && policies.length === 0 ? (
        <p className="text-gray-600 text-lg">No refund policies available at the moment.</p>
      ) : (
        <div className="space-y-8">
          {policies.map((policy) => (
            <div key={policy.id} className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1a1a1a]">
                {policy.title}
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                {policy.content}
              </p>
              {policy.returnWindow && (
                <p className="text-gray-500 text-base">
                  {/* Return Window: {policy.returnWindow} days */}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RefundPolicyPage;