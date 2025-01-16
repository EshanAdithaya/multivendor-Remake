import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const PasswordChangeScreen = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false
  });

  const validateForm = () => {
    if (!formData.oldPassword) {
      setMessage({ text: 'Please enter your current password', type: 'error' });
      return false;
    }
    if (formData.newPassword.length < 8) {
      setMessage({ text: 'New password must be at least 8 characters long', type: 'error' });
      return false;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ text: 'New passwords do not match', type: 'error' });
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

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setMessage({ text: '', type: '' });
    setLoading(true);

    try {
      const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
      const response = await fetch(`${REACT_APP_BASE_URL}/api/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setMessage({ text: 'Password changed successfully!', type: 'success' });
        setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        // Add delay before navigation
        setTimeout(() => {
          navigate('/profile');
        }, 2000);
        return;
      }

      const errorData = await response.json().catch(() => ({
        message: 'An unexpected error occurred'
      }));
      throw new Error(errorData.message || `Password change failed with status: ${response.status}`);

    } catch (error) {
      console.error('Password change error:', error);
      setMessage({ 
        text: error.message || 'Password change failed. Please try again later.', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const renderPasswordField = (label, name, placeholder) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          type={passwordVisibility[name] ? 'text' : 'password'}
          id={name}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
          placeholder={placeholder}
          required
          minLength={name !== 'oldPassword' ? 8 : undefined}
        />
        <button
          type="button"
          onClick={() => togglePasswordVisibility(name)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2"
        >
          {passwordVisibility[name] ? (
            <EyeOff className="w-5 h-5 text-gray-400" />
          ) : (
            <Eye className="w-5 h-5 text-gray-400" />
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Change Password</h2>
        
        {message.text && (
          <div className={`mb-4 p-3 rounded ${
            message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {renderPasswordField('Current Password', 'oldPassword', 'Enter your current password')}
          {renderPasswordField('New Password', 'newPassword', 'Enter new password (min. 8 characters)')}
          {renderPasswordField('Confirm New Password', 'confirmPassword', 'Confirm your new password')}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 bg-yellow-400 text-white rounded-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Changing password...' : 'Change Password'}
          </button>

          <div className="text-center text-sm">
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="text-yellow-600 hover:text-yellow-700 font-medium"
            >
              Back to Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordChangeScreen;