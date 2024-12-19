import React, { useState } from 'react';
import { Upload, Plus } from 'lucide-react';
import Navbar from '../components/Navbar';

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    name: 'Jhon Doe',
    bio: '',
    email: 'admin@pawsome.com',
    phone: '+1 (936) 514-1641',
    addresses: {
      billing: '2231 Kidd Avenue, AK, Kipnuk, 99614, United States',
      shipping: '2148 Straford Park, KY, Winchester, 40391, United States'
    }
  });

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header Logo */}
      <div className="p-4 border-b">
        <img src="/api/placeholder/40/40" alt="PetDoc" className="h-10" />
      </div>

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
            className="w-full p-3 border rounded-lg"
          />
        </div>

        {/* Bio Section */}
        <div className="space-y-2">
          <label className="block text-gray-700">Bio</label>
          <textarea
            className="w-full p-3 border rounded-lg h-24"
            value={profile.bio}
          />
          <div className="flex justify-end">
            <button className="bg-yellow-400 text-white px-6 py-2 rounded-lg">
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
            className="w-full p-3 border rounded-lg"
          />
          <div className="flex justify-end">
            <button className="bg-yellow-400 text-white px-6 py-2 rounded-lg">
              Update
            </button>
          </div>
        </div>

        {/* Contact Number */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-gray-700">Contact Number</label>
            <button className="text-yellow-400">+ Update</button>
          </div>
          <div className="flex border rounded-lg overflow-hidden">
            <div className="bg-white border-r px-3 py-3 flex items-center gap-2">
              <img src="/api/placeholder/20/15" alt="US" className="w-5" />
              <span>🇺🇸</span>
            </div>
            <input
              type="tel"
              value={profile.phone}
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
      <Navbar />
    </div>
  );
};

export default ProfilePage;