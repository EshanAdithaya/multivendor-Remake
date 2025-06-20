import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

// Get environment variables
const ADMIN_URL = process.env.REACT_APP_ADMIN_URL ;
const SELLER_URL = process.env.REACT_APP_SELLER_URL ;
const API_REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showDashboardPrompt, setShowDashboardPrompt] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [token, setToken] = useState('');

  const validateForm = () => {
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setMessage({ text: 'Please enter a valid email address', type: 'error' });
      return false;
    }
    if (formData.password.length < 8) {
      setMessage({ text: 'Password must be at least 8 characters long', type: 'error' });
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRedirection = (role, token) => {
    const savedUrl = Cookies.get('redirectUrl');
    Cookies.remove('redirectUrl');

    if (role === 'super_admin' || role === 'shop_admin') {
      setUserRole(role);
      setToken(token);
      setShowDashboardPrompt(true);
      return;
    }

    switch (role) {
      case 'customer':
        if (savedUrl) {
          navigate(savedUrl);
        } else {
          navigate('/');
        }
        break;
      default:
        console.error('Unknown role:', role);
        setMessage({ text: 'Invalid user role', type: 'error' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setMessage({ text: '', type: '' });
    setLoading(true);

    try {
      const response = await fetch(`${API_REACT_APP_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('accessToken', data.accessToken);
        
        setMessage({ text: 'Login successful! Redirecting...', type: 'success' });
        
        if (data.payload && data.payload.role) {
          handleRedirection(data.payload.role, data.accessToken);
        } else {
          setMessage({ text: 'Invalid response format', type: 'error' });
        }

        setFormData({ email: '', password: '' });
        return;
      }

      const errorData = await response.json().catch(() => ({
        message: 'An unexpected error occurred'
      }));
      throw new Error(errorData.message || `Login failed with status: ${response.status}`);
    } catch (error) {
      console.error('Login error:', error);
      setMessage({
        text: error.message || 'Login failed. Please try again later.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDashboardChoice = (choice) => {
    setShowDashboardPrompt(false);
    if (choice === 'dashboard') {
      if (userRole === 'super_admin') {
        window.location.href = `${ADMIN_URL}/handler?jwt=${token}`;
      } else if (userRole === 'shop_admin') {
        window.location.href = `${SELLER_URL}/handler?jwt=${token}`;
      }
    } else {
      navigate('/');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border-2 border-orange-100 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-4 right-4 w-8 h-8 bg-orange-200 rounded-full opacity-30"></div>
        <div className="absolute bottom-4 left-4 w-6 h-6 bg-yellow-300 rounded-full opacity-30"></div>
        
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🐾</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back!</h2>
          <p className="text-gray-600">Sign in to continue shopping for your pets</p>
        </div>
        
        {message.text && (
          <div className={`mb-6 p-4 rounded-2xl border-2 ${
            message.type === 'error' 
              ? 'bg-red-50 text-red-700 border-red-200' 
              : 'bg-green-50 text-green-700 border-green-200'
          }`}>
            <div className="flex items-center gap-2">
              <span className="text-xl">{message.type === 'error' ? '⚠️' : '✅'}</span>
              <span className="font-medium">{message.text}</span>
            </div>
          </div>
        )}

        {showDashboardPrompt && (
          <div className="mb-6 p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">📊</div>
              <p className="text-blue-800 font-medium">Choose your destination</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleDashboardChoice('client')}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-2xl hover:from-orange-600 hover:to-yellow-600 font-bold transition-all duration-200 active:scale-95 shadow-lg"
              >
                🏠 Stay Here
              </button>
              <button
                onClick={() => handleDashboardChoice('dashboard')}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-2xl hover:from-blue-600 hover:to-indigo-600 font-bold transition-all duration-200 active:scale-95 shadow-lg"
              >
                📊 Dashboard
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
              📧 Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-orange-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 bg-white/80 backdrop-blur-sm"
              placeholder="📧 Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2">
              🔒 Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-orange-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 bg-white/80 backdrop-blur-sm"
              placeholder="🔒 Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 px-6 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-2xl hover:from-orange-600 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 font-bold text-lg transition-all duration-200 active:scale-95 shadow-xl ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                <span>Logging in...</span>
              </div>
            ) : (
              '🔑 Log In'
            )}
          </button>

          <div className="text-center text-sm">
            <span className="text-gray-600">Don't have an account? </span>
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="text-orange-600 hover:text-orange-700 font-bold transition-colors duration-200"
            >
              📝 Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;