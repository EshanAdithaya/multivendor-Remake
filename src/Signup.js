import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'customer'
  });

  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [roles] = useState(['customer', 'super_admin', 'shop_admin']);
  const navigate = useNavigate();

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
      [name]: value,
    }));
  };

// Inside your handleSubmit function, replace the fetch call with this:

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  setMessage({ text: '', type: '' });
  setLoading(true);

  try {
    // Correctly using environment variable
    const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL ;
    const response = await fetch(`${REACT_APP_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'omit',
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Registration successful:', data);
      setMessage({ text: 'Registration successful! Redirecting...', type: 'success' });
      setFormData({ email: '', password: '', role: 'customer' });
      // Add delay before navigation
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      return;
    }

    const errorData = await response.json().catch(() => ({
      message: 'An unexpected error occurred'
    }));
    throw new Error(errorData.message || `Registration failed with status: ${response.status}`);

  } catch (error) {
    console.error('Registration error:', error);
    setMessage({ 
      text: error.message || 'Registration failed. Please try again later.', 
      type: 'error' 
    });
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Sign Up</h2>
        
        {message.text && (
          <div className={`mb-4 p-3 rounded ${
            message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
            {message.text}
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
              placeholder="Enter password (min. 8 characters)"
              required
              minLength={8}
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role.replace('_', ' ').toLowerCase()}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 bg-yellow-400 text-white rounded-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>

          <div className="text-center text-sm">
            <span className="text-gray-600">Already have an account? </span>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-yellow-600 hover:text-yellow-700 font-medium"
            >
              Log In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;