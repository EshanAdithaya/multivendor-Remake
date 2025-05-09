import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Lottie from 'react-lottie'; // Add this import for Lottie

// If you don't have the lottie files imported yet, you'll need to install: npm install react-lottie
import lostAnimation from '../Assets/animations/lost.json'; // Adjust path as needed

const API_REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        const response = await axios.get(`${API_REACT_APP_BASE_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.status === 200) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth error:', error);
        setIsAuthenticated(false);
        localStorage.removeItem('accessToken'); // Clear invalid token
      } finally {
        setIsLoading(false);
      }
    };

    verifyUser();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Replace redirect with Lottie animation
    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: lostAnimation,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
      }
    };    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <div className="w-75 h-64 mx-auto mb-4 mr-12">
          <Lottie options={defaultOptions} height="100%" width="100%" />
        </div>
        <h2 className="text-2xl font-bold mb-2">We lost you.</h2>
        <p className="text-gray-600 mb-4">Please go back to app and come again. 
          For development purposes:- token expired or invalid token.
        </p>
        <button 
          onClick={() => window.location.href = '/'}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Return to App
        </button>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;