import React, { useState, useEffect } from 'react';
import { Trash2, PlusCircle, Edit } from 'lucide-react';

// AddressModal component for adding/editing addresses
const AddressModal = ({ isOpen, onClose, initialData = null, onSubmit }) => {
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
  });
  const [error, setError] = useState('');
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    const fetchCountries = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('https://restcountries.com/v2/all');
        if (!response.ok) throw new Error('Failed to fetch countries');
        const data = await response.json();
        
        const formattedCountries = data.map(country => ({
          name: country.name,
          code: country.alpha2Code,
          flag: country.flag || `${country.alpha2Code} Flag`
        })).sort((a, b) => a.name.localeCompare(b.name));
        
        setCountries(formattedCountries);
      } catch (err) {
        setError('Failed to load countries. Please try again later.');
        console.error('Error fetching countries:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError('Failed to save address. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {initialData ? 'Edit Address' : 'Add New Address'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ×
          </button>
        </div>

        {error && (
          <div className="m-4 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Street Address
            </label>
            <input
              type="text"
              value={formData.street}
              onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Postal Code
              </label>
              <input
                type="text"
                value={formData.postalCode}
                onChange={(e) => setFormData(prev => ({ ...prev, postalCode: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <div className="relative">
                {isLoading ? (
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                    Loading countries...
                  </div>
                ) : (
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 appearance-none"
                    required
                  >
                    <option value="">Select Country</option>
                    {countries.map((country) => (
                      <option key={country.code} value={country.name}>
                        <img src={country.flag} alt={`${country.name} flag`} className="inline-block w-4 h-4 mr-2" />
                        {country.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-yellow-400 text-white rounded-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
              disabled={isLoading}
            >
              Save Address
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main AddressManagement component
const AddressManagement = () => {
  const [addresses, setAddresses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [error, setError] = useState('');


  const fetchAddresses = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/orders/addresses`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch addresses');
      const data = await response.json();
      setAddresses(data);
    } catch (err) {
      setError('Failed to load addresses');
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleAddAddress = async (formData) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/orders/create-address`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed to add address');
      fetchAddresses();
    } catch (err) {
      throw err;
    }
  };


  const handleUpdateAddress = async (formData) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/orders/update-address/${editingAddress.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed to update address');
      fetchAddresses();
    } catch (err) {
      throw err;
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/orders/delete-address/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to delete address');
      fetchAddresses();
    } catch (err) {
      setError('Failed to delete address');
    }
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingAddress(null);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="px-6 pt-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Addresses</h1>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="text-yellow-400 font-semibold flex items-center hover:text-yellow-500"
          >
            <PlusCircle className="mr-2" />
            Add Address
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm">
          <div className="flex justify-between px-6 py-4 bg-gray-50 rounded-t-xl">
            <span className="text-gray-500 font-medium">Address</span>
            <span className="text-gray-500 font-medium">Actions</span>
          </div>

          {addresses.length === 0 ? (
            <div className="px-6 py-12 flex justify-center border-t border-gray-100">
              <span className="text-gray-500">No addresses found</span>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {addresses.map((address) => (
                <div key={address.id} className="px-6 py-4 flex justify-between items-center">
                  <div className="flex-1">
                    <p className="text-gray-800">{address.street}</p>
                    <p className="text-gray-600 text-sm">
                      {address.city}, {address.state} {address.postalCode}
                    </p>
                    <p className="text-gray-600 text-sm">{address.country}</p>
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleEdit(address)}
                      className="text-gray-600 hover:text-yellow-500"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(address.id)}
                      className="text-gray-600 hover:text-red-500"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AddressModal 
        isOpen={isModalOpen}
        onClose={handleModalClose}
        initialData={editingAddress}
        onSubmit={editingAddress ? handleUpdateAddress : handleAddAddress}
      />
    </div>
  );
};

export default AddressManagement;