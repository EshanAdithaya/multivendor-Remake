import React, { useState, useEffect, useRef } from 'react';
import { Upload, Plus } from 'lucide-react';
import Lottie from 'lottie-react';
import loadingAnimation from '../Assets/animations/loading.json';
import Navbar from '../components/Navbar';
import Header from '../components/Header';

const API_REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    bio: '',
    phone: '',
    profilePicture: null,
    addresses: {
      billing: '',
      shipping: ''
    }
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_REACT_APP_BASE_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': '*/*'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile data');
      }

      const userData = await response.json();
      
      setProfile(prevProfile => ({
        ...prevProfile,
        email: userData.email,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        profilePicture: userData.profilePicture,
        phone: userData.phone || '+1 (936) 514-1641',
        bio: userData.bio || '',
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

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_REACT_APP_BASE_URL}/api/files/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) throw new Error('Failed to upload image');

      const imageData = await response.json();
      
      // Update profile with the new image
      await updateProfile({
        profilePictureId: imageData.id
      });

      // Refresh profile data
      await fetchUserProfile();
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const updateProfile = async (updateData) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_REACT_APP_BASE_URL}/api/auth/profile-update`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) throw new Error('Failed to update profile');

      return await response.json();
    } catch (err) {
      console.error('Error updating profile:', err);
      throw err;
    }
  };

  const handleSave = async (field, value) => {
    try {
      let updateData = {};
      
      switch (field) {
        case 'name':
          const [firstName, ...lastNameParts] = value.split(' ');
          updateData = {
            firstName,
            lastName: lastNameParts.join(' ')
          };
          break;
        case 'email':
          updateData = { email: value };
          break;
        default:
          updateData = { [field]: value };
      }

      await updateProfile(updateData);
      await fetchUserProfile();
      alert(`${field} updated successfully`);
    } catch (err) {
      console.error(`Error updating ${field}:`, err);
      alert(`Failed to update ${field}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-32 h-32">
          <Lottie animationData={loadingAnimation} loop={true} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={fetchUserProfile}
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
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          <div className="flex flex-col items-center">
            {uploading ? (
              <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <div>
                  <span className="text-yellow-400">Upload an image</span>
                  <span className="text-gray-500"> or drag and drop</span>
                </div>
                <span className="text-gray-400 text-sm mt-1">PNG, JPG</span>
              </>
            )}
          </div>
        </div>

        {/* Profile Picture */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-green-200 rounded-full overflow-hidden">
            {profile.profilePicture ? (
              <img 
                src={profile.profilePicture} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <img 
                src="/api/placeholder/64/64" 
                alt="Profile" 
                className="w-full h-full object-cover" 
              />
            )}
          </div>
        </div>

        {/* Name Section */}
        <div className="space-y-2">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            value={`${profile.firstName} ${profile.lastName}`.trim()}
            onChange={(e) => {
              const [firstName, ...lastNameParts] = e.target.value.split(' ');
              setProfile(prev => ({
                ...prev,
                firstName: firstName || '',
                lastName: lastNameParts.join(' ') || ''
              }));
            }}
            className="w-full p-3 border rounded-lg"
          />
          <div className="flex justify-end">
            <button 
              onClick={() => handleSave('name', `${profile.firstName} ${profile.lastName}`.trim())}
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