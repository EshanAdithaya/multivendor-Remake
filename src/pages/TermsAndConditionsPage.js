import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

const TermsAndConditionsPage = () => {
  const [terms, setTerms] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTerms = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/terms`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch terms and conditions');
        }

        const data = await response.json();
        // Find the active terms
        const activeTerms = data.find(term => term.isActive);
        
        if (!activeTerms) {
          throw new Error('No active terms and conditions found');
        }

        setTerms(activeTerms);
        setError('');
      } catch (err) {
        setError('Failed to load terms and conditions. Please try again later.');
        console.error('Error fetching terms:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTerms();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white px-4 pt-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-12">
          Terms and Conditions
        </h1>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
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

      {!error && terms && (
        <div className="bg-white rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {terms.title}
            </h2>
            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
              Version {terms.version}
            </span>
          </div>
          
          {terms.effectiveDate && (
            <p className="text-sm text-gray-500 mb-4">
              Effective from: {new Date(terms.effectiveDate).toLocaleDateString()}
              {terms.expirationDate && 
                ` until ${new Date(terms.expirationDate).toLocaleDateString()}`
              }
            </p>
          )}
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
              {terms.content}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TermsAndConditionsPage;