import { useState, useEffect } from 'react';

const TokenExtractor = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [tokenStatus, setTokenStatus] = useState('');

  useEffect(() => {
    const extractAndValidateToken = async () => {
      try {
        // Extract token from URL
        const urlParams = new URLSearchParams(window.location.search);
        const fullUrl = window.location.href;
        
        let token;
        
        // Check if the token is in the query params
        if (urlParams.has('token')) {
          token = urlParams.get('token');
        } else {
          // Try to extract token from a URL like the example
          const tokenMatch = fullUrl.match(/login-request\?token=([^&]+)/);
          if (tokenMatch && tokenMatch[1]) {
            token = tokenMatch[1];
          }
        }

        if (!token) {
          setError('No token found in URL');
          setLoading(false);
          return;
        }

        // Store token in localStorage
        localStorage.setItem('accessToken', token);
        setTokenStatus('Token extracted and stored in localStorage');
        
        // Validate user with API
        const response = await fetch('https://pawsome.soluzent.com/api/auth/me', {
          method: 'GET',
          headers: {
            'Accept': '*/*',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setUserData(data);
        setLoading(false);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message || 'An error occurred during token validation');
        setLoading(false);
      }
    };

    extractAndValidateToken();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-700">Validating your login...</h2>
            <p className="text-gray-500 mt-2">Please wait while we authenticate you.</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
          <div className="flex flex-col items-center">
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4 w-full">
              <h2 className="font-bold text-lg mb-2">Authentication Error</h2>
              <p>{error}</p>
            </div>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
        <div className="flex flex-col items-center">
          <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-4 w-full">
            <h2 className="font-bold text-lg mb-2">Authentication Successful</h2>
            <p>{tokenStatus}</p>
          </div>
          
          {userData && (
            <div className="w-full mt-4">
              <h3 className="font-semibold text-lg mb-2">User Details:</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="mb-2"><span className="font-medium">Name:</span> {userData.firstName} {userData.lastName}</p>
                <p className="mb-2"><span className="font-medium">Email:</span> {userData.email}</p>
                <p className="mb-2"><span className="font-medium">Role:</span> {userData.role}</p>
                <p className="mb-2"><span className="font-medium">User ID:</span> {userData.userId}</p>
              </div>
            </div>
          )}
          
          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded mt-6"
            onClick={() => window.location.href = '/'}
          >
            Continue to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default TokenExtractor;