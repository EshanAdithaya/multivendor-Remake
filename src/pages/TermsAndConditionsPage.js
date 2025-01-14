import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

const TermsAndConditionsPage = () => {
  const [latestTerms, setLatestTerms] = useState(null);
  const [allTerms, setAllTerms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTermsData = async () => {
      setIsLoading(true);
      try {
        // Fetch both latest and all active terms
        const [latestResponse, allResponse] = await Promise.all([
          fetch(`${process.env.REACT_APP_BASE_URL}/api/terms/latest`),
          fetch(`${process.env.REACT_APP_BASE_URL}/api/terms?active=true`)
        ]);

        if (!latestResponse.ok || !allResponse.ok) {
          throw new Error('Failed to fetch terms and conditions');
        }

        const latestData = await latestResponse.json();
        const allData = await allResponse.json();

        setLatestTerms(latestData);
        setAllTerms(allData);
        setError('');
      } catch (err) {
        setError('Failed to load terms and conditions. Please try again later.');
        console.error('Error fetching terms:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTermsData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white px-4 pt-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-12">
          Terms and Conditions
        </h1>
        <div className="space-y-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Terms and Conditions
      </h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {!error && latestTerms && (
        <div className="space-y-8">
          <div className="mb-12">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {latestTerms.title}
              </h2>
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                Current Version {latestTerms.version}
              </span>
            </div>
            
            {latestTerms.effectiveDate && (
              <p className="text-sm text-gray-500 mb-4">
                Effective from: {new Date(latestTerms.effectiveDate).toLocaleDateString()}
                {latestTerms.expirationDate && 
                  ` until ${new Date(latestTerms.expirationDate).toLocaleDateString()}`
                }
              </p>
            )}
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                {latestTerms.content}
              </p>
            </div>
          </div>

          {allTerms.length > 1 && (
            <div className="mt-12">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Previous Versions
              </h3>
              <div className="space-y-6">
                {allTerms
                  .filter(term => term.id !== latestTerms.id)
                  .map(term => (
                    <div key={term.id} className="p-6 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-medium text-gray-900">
                          {term.title}
                        </h4>
                        <span className="text-sm text-gray-500">
                          Version {term.version}
                        </span>
                      </div>
                      <p className="text-gray-600">
                        {term.content}
                      </p>
                      {term.effectiveDate && (
                        <p className="text-sm text-gray-500 mt-4">
                          Effective: {new Date(term.effectiveDate).toLocaleDateString()}
                          {term.expirationDate && 
                            ` - ${new Date(term.expirationDate).toLocaleDateString()}`
                          }
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TermsAndConditionsPage;