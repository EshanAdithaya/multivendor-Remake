import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Lottie from 'react-lottie';
import lostAnimation from '../Assets/animations/lost.json'; // Adjust path as needed
import MaintenanceMode from './MaintenanceMode'; // Import the maintenance component

const API_REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkMaintenanceAndAuth = async () => {
      try {
        // First check if system is in maintenance mode
        try {
          const maintenanceResponse = await fetch(`${API_REACT_APP_BASE_URL}/api/system/maintenance-status`);
          const maintenanceData = await maintenanceResponse.json();
          
          if (maintenanceData.maintenanceMode === true) {
            setIsMaintenanceMode(true);
            setMaintenanceMessage(maintenanceData.message || 'System is currently under maintenance. Please try again later.');
            setIsLoading(false);
            return; // Don't proceed with auth check if in maintenance mode
          }
        } catch (maintenanceError) {
          // If we get a 503 error, it likely means maintenance mode is on
          if (maintenanceError.response && maintenanceError.response.status === 503) {
            setIsMaintenanceMode(true);
            setMaintenanceMessage('System is currently under maintenance. Please try again later.');
            setIsLoading(false);
            return;
          }
          // If it's another error, continue with auth check
          console.error('Error checking maintenance status:', maintenanceError);
        }
        
        // Now check authentication
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

    checkMaintenanceAndAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-yellow-400 border-t-transparent"></div>
      </div>
    );
  }

  if (isMaintenanceMode) {
    return <MaintenanceMode message={maintenanceMessage} onRetry={() => window.location.reload()} />;
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
    };

    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-white">
        <div className="w-75 h-64 mx-auto mb-4 mr-12">
          <Lottie options={defaultOptions} height="100%" width="100%" />
        </div>
        <h2 className="text-2xl font-bold mb-4 text-gray-900">We lost you.</h2>
        <p className="text-gray-600 mb-6">Please go back to app and come again.</p>
        <button 
          onClick={() => window.location.href = '/'}
          className="px-6 py-3 bg-yellow-400 text-black font-medium rounded-full shadow-sm hover:bg-yellow-500 transition-all duration-300 transform hover:-translate-y-0.5"
        >
          Return to App
        </button>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;