import React, { useState, useEffect, useRef } from 'react';
import { Upload, Plus, Trash2 } from 'lucide-react';
import Lottie from 'lottie-react';
import loadingAnimation from '../Assets/animations/loading.json';
import Navbar from '../components/Navbar';
import Header from '../components/Header';

const API_REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    profilePicture: null
  });
  const [addresses, setAddresses] = useState([]);
  const [addressesLoading, setAddressesLoading] = useState(false);

  useEffect(() => {
    fetchUserProfile();
    fetchAddresses();
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
        profilePicture: userData.profilePicture?.url || null,
        profilePictureId: userData.profilePicture?.id || null,
        phone: userData.phone || '+1 (936) 514-1641'
      }));
      setHasChanges(false);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      setAddressesLoading(true);
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_REACT_APP_BASE_URL}/api/orders/addresses`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': '*/*'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch addresses');
      }

      const addressData = await response.json();
      setAddresses(addressData);
    } catch (err) {
      console.error('Error fetching addresses:', err);
    } finally {
      setAddressesLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
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
      
      // Update profile with the new image ID
      const updateResponse = await fetch(`${API_REACT_APP_BASE_URL}/api/auth/profile-update`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          profilePictureId: imageData.id
        })
      });

      if (!updateResponse.ok) throw new Error('Failed to update profile with new image');

      // Refresh profile to get updated data
      await fetchUserProfile();
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async () => {
    if (!profile.profilePictureId) return;

    try {
      const token = localStorage.getItem('accessToken');
      await fetch(`${API_REACT_APP_BASE_URL}/api/files/${profile.profilePictureId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': '*/*'
        }
      });

      // Update profile to remove image reference
      const updateResponse = await fetch(`${API_REACT_APP_BASE_URL}/api/auth/profile-update`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          profilePictureId: null
        })
      });

      if (!updateResponse.ok) throw new Error('Failed to update profile');

      // Refresh profile
      await fetchUserProfile();
    } catch (err) {
      console.error('Error deleting image:', err);
      setError('Failed to delete image');
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_REACT_APP_BASE_URL}/api/orders/delete-address/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': '*/*'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete address');
      }

      fetchAddresses();
    } catch (err) {
      console.error('Error deleting address:', err);
    }
  };

  const handleSaveAll = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('accessToken');
      const updateData = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
        profilePictureId: profile.profilePictureId
      };

      const response = await fetch(`${API_REACT_APP_BASE_URL}/api/auth/profile-update`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) throw new Error('Failed to update profile');

      await fetchUserProfile();
      setHasChanges(false);
      alert('Profile updated successfully');
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
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
        {/* Profile Picture Section */}
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden">
                {profile.profilePicture ? (
                  <img 
                    src={profile.profilePicture} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img 
                    src="/api/placeholder/96/96" 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              {profile.profilePicture && (
                <button
                  onClick={handleDeleteImage}
                  className="absolute -bottom-2 -right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer"
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
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          {/* Name Section */}
          <div className="space-y-2">
            <label className="block text-gray-700">First Name</label>
            <input
              type="text"
              value={profile.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className="w-full p-3 border rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-gray-700">Last Name</label>
            <input
              type="text"
              value={profile.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className="w-full p-3 border rounded-lg"
            />
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

          {/* Phone Section */}
          <div className="space-y-2">
            <label className="block text-gray-700">Phone</label>
            <div className="flex border rounded-lg overflow-hidden">
              <div className="bg-white border-r px-3 py-3 flex items-center gap-2">
                <img src="/api/placeholder/20/15" alt="US" className="w-5" />
                <span>🇺🇸</span>
              </div>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="flex-1 p-3"
              />
            </div>
          </div>

          {/* Addresses Section */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-gray-700">Addresses</label>
              <button className="text-yellow-400">+ Add</button>
            </div>
            
            {addressesLoading ? (
              <div className="text-center py-4">
                <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : addresses.length > 0 ? (
              addresses.map((address) => (
                <div key={address.id} className="bg-gray-50 p-4 rounded-lg space-y-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{address.street}</h3>
                      <p className="text-gray-600 text-sm">
                        {address.city}, {address.state}, {address.postalCode}
                      </p>
                      <p className="text-gray-600 text-sm">{address.country}</p>
                    </div>
                    <button 
                      onClick={() => handleDeleteAddress(address.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                No addresses found
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="sticky bottom-0 bg-white p-4 border-t">
          <button 
            onClick={handleSaveAll}
            disabled={!hasChanges || saving}
            className={`w-full p-3 rounded-lg ${
              hasChanges && !saving
                ? 'bg-yellow-400 text-white hover:bg-yellow-500'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            {saving ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Saving...
              </div>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;