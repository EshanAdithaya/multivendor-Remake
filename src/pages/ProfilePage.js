import React, { useState, useEffect } from 'react';
import { Upload, Plus } from 'lucide-react';
import Navbar from '../components/Navbar';
import Header from '../components/Header';

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState({
    name: '',
    bio: '',
    email: '',
    phone: '',
    addresses: {
      billing: '',
      shipping: ''
    }
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('accessToken'); // Assuming you store the JWT token in localStorage
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch('https://ppabanckend.adaptable.app/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'accept': '*/*'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }

        const userData = await response.json();
        
        // Map API data to profile state
        setProfile(prevProfile => ({
          ...prevProfile,
          email: userData.email,
          // Add other fields as they become available from the API
          // For now, keeping some fields with placeholder data
          name: userData.name || 'John Doe',
          bio: userData.bio || '',
          phone: userData.phone || '+1 (936) 514-1641',
          addresses: {
            billing: userData.billingAddress || '2231 Kidd Avenue, AK, Kipnuk, 99614, United States',
            shipping: userData.shippingAddress || '2148 Straford Park, KY, Winchester, 40391, United States'
          }
        }));
      } catch (err) {
        setError(err.message);
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSave = async (field, value) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Here you would typically make an API call to update the specific field
      // For now, just updating the local state
      setProfile(prev => ({
        ...prev,
        [field]: value
      }));

      // Show success message
      alert(`${field} updated successfully`);
    } catch (err) {
      console.error(`Error updating ${field}:`, err);
      alert(`Failed to update ${field}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-yellow-400 text-white px-6 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <div className="p-4 space-y-6">
        {/* Image Upload */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <div className="flex flex-col items-center">
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <div>
              <span className="text-yellow-400">Upload an image</span>
              <span className="text-gray-500"> or drag and drop</span>
            </div>
            <span className="text-gray-400 text-sm mt-1">PNG, JPG</span>
          </div>
        </div>

        {/* Profile Picture */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-green-200 rounded-full overflow-hidden">
            <img src="/api/placeholder/64/64" alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Name Section */}
        <div className="space-y-2">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
            className="w-full p-3 border rounded-lg"
          />
          <div className="flex justify-end">
            <button 
              onClick={() => handleSave('name', profile.name)}
              className="bg-yellow-400 text-white px-6 py-2 rounded-lg"
            >
              Save
            </button>
          </div>
        </div>

        {/* Bio Section */}
        <div className="space-y-2">
          <label className="block text-gray-700">Bio</label>
          <textarea
            className="w-full p-3 border rounded-lg h-24"
            value={profile.bio}
            onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
          />
          <div className="flex justify-end">
            <button 
              onClick={() => handleSave('bio', profile.bio)}
              className="bg-yellow-400 text-white px-6 py-2 rounded-lg"
            >
              Save
            </button>
          </div>
        </div>

        {/* Email Section */}
        <div className="space-y-2">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            value={profile.email}
            readOnly
            className="w-full p-3 border rounded-lg bg-gray-50"
          />
        </div>

        {/* Contact Number */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-gray-700">Contact Number</label>
            <button 
              onClick={() => handleSave('phone', profile.phone)}
              className="text-yellow-400"
            >
              + Update
            </button>
          </div>
          <div className="flex border rounded-lg overflow-hidden">
            <div className="bg-white border-r px-3 py-3 flex items-center gap-2">
              <img src="/api/placeholder/20/15" alt="US" className="w-5" />
              <span>🇺🇸</span>
            </div>
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
              className="flex-1 p-3"
            />
          </div>
        </div>

        {/* Addresses */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-gray-700">Addresses</label>
            <button className="text-yellow-400">+ Add</button>
          </div>
          
          {/* Billing Address */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-1">
            <h3 className="font-medium">Billing</h3>
            <p className="text-gray-600 text-sm">{profile.addresses.billing}</p>
          </div>

          {/* Shipping Address */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-1">
            <h3 className="font-medium">Shipping</h3>
            <p className="text-gray-600 text-sm">{profile.addresses.shipping}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;