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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border-2 border-orange-100 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-4 right-4 w-8 h-8 bg-orange-200 rounded-full opacity-30"></div>
        <div className="absolute bottom-4 left-4 w-6 h-6 bg-yellow-300 rounded-full opacity-30"></div>
        
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🐱🐶</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Join Our Family!</h2>
          <p className="text-gray-600">Create an account to start shopping for your beloved pets</p>
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
              placeholder="🔒 Enter password (min. 8 characters)"
              required
              minLength={8}
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-bold text-gray-700 mb-2">
              👤 Account Type
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-orange-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 bg-white/80 backdrop-blur-sm"
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role === 'customer' ? '🐾 Pet Owner' : 
                   role === 'super_admin' ? '👑 Super Admin' : 
                   role === 'shop_admin' ? '🏪 Shop Admin' : 
                   role.replace('_', ' ').toLowerCase()}
                </option>
              ))}
            </select>
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
                <span>Creating account...</span>
              </div>
            ) : (
              '🎉 Create Account'
            )}
          </button>

          <div className="text-center text-sm">
            <span className="text-gray-600">Already have an account? </span>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-orange-600 hover:text-orange-700 font-bold transition-colors duration-200"
            >
              🔑 Log In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;