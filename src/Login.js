import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

// Get environment variables
const ADMIN_URL = process.env.REACT_APP_ADMIN_URL ;
const SELLER_URL = process.env.REACT_APP_SELLER_URL ;
const API_BASE_URL = process.env.BASE_URL;

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
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Log In</h2>
        
        {message.text && (
          <div className={`mb-4 p-3 rounded ${
            message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
            {message.text}
          </div>
        )}

        {showDashboardPrompt && (
          <div className="mb-4 p-3 rounded bg-blue-100 text-blue-700">
            <p>Do you want to stay on the client side or navigate to the dashboard?</p>
            <button
              onClick={() => handleDashboardChoice('client')}
              className="mr-2 py-1 px-3 bg-yellow-400 text-white rounded-md hover:bg-yellow-500"
            >
              Stay
            </button>
            <button
              onClick={() => handleDashboardChoice('dashboard')}
              className="py-1 px-3 bg-yellow-400 text-white rounded-md hover:bg-yellow-500"
            >
              Dashboard
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 bg-yellow-400 text-white rounded-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>

          <div className="text-center text-sm">
            <span className="text-gray-600">Don't have an account? </span>
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="text-yellow-600 hover:text-yellow-700 font-medium"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;