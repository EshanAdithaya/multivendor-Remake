import React, { useState } from 'react';

const AddCardModal = ({ isOpen, onClose }) => {
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    billingAddress: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Card Data:', cardData);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCardData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Add Payment Card</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Card Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Card Number
            </label>
            <input
              type="text"
              name="cardNumber"
              value={cardData.cardNumber}
              onChange={handleChange}
              placeholder="1234 5678 9012 3456"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
              maxLength="19"
              required
            />
          </div>

          {/* Cardholder Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cardholder Name
            </label>
            <input
              type="text"
              name="cardholderName"
              value={cardData.cardholderName}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
              required
            />
          </div>

          {/* Expiry Date and CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date
              </label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  name="expiryMonth"
                  value={cardData.expiryMonth}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                  required
                >
                  <option value="">MM</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                    <option key={month} value={month.toString().padStart(2, '0')}>
                      {month.toString().padStart(2, '0')}
                    </option>
                  ))}
                </select>
                <select
                  name="expiryYear"
                  value={cardData.expiryYear}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                  required
                >
                  <option value="">YY</option>
                  {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                    <option key={year} value={year.toString().slice(-2)}>
                      {year.toString().slice(-2)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CVV
              </label>
              <input
                type="password"
                name="cvv"
                value={cardData.cvv}
                onChange={handleChange}
                placeholder="123"
                maxLength="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                required
              />
            </div>
          </div>

          {/* Billing Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Billing Address
            </label>
            <input
              type="text"
              name="billingAddress"
              value={cardData.billingAddress}
              onChange={handleChange}
              placeholder="Street Address"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
              required
            />
          </div>

          {/* City, State, Zip */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                name="city"
                value={cardData.city}
                onChange={handleChange}
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
                name="state"
                value={cardData.state}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ZIP Code
              </label>
              <input
                type="text"
                name="zipCode"
                value={cardData.zipCode}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                required
              />
            </div>
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            <select
              name="country"
              value={cardData.country}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
              required
            >
              <option value="">Select Country</option>
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="GB">United Kingdom</option>
              <option value="AU">Australia</option>
              {/* Add more countries as needed */}
            </select>
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
            >
              Save Card
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const MyCardsScreen = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Header with Logo */}
      <div className="w-full border-b border-gray-100 px-4 py-3">
        <div className="flex items-center">
          <div className="relative w-24">
            <div className="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center">
              <div className="text-white text-xs transform -rotate-45">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M12,2C6.48,2,2,6.48,2,12c0,5.52,4.48,10,10,10s10-4.48,10-10C22,6.48,17.52,2,12,2z M12,20c-4.41,0-8-3.59-8-8 s3.59-8,8-8s8,3.59,8,8S16.41,20,12,20z"/>
                  <path d="M15,11c1.1,0,2-0.9,2-2s-0.9-2-2-2s-2,0.9-2,2S13.9,11,15,11z"/>
                  <path d="M9,11c1.1,0,2-0.9,2-2s-0.9-2-2-2s-2,0.9-2,2S7.9,11,9,11z"/>
                </svg>
              </div>
            </div>
            <span className="absolute bottom-0 left-11 text-sm font-medium text-gray-700">PetDoc</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 pt-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Cards</h1>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="text-yellow-400 font-semibold flex items-center hover:text-yellow-500"
          >
            <span className="text-2xl mr-2">+</span>
            <span>Add Card</span>
          </button>
        </div>

        {/* Card Content */}
        <div className="bg-white rounded-xl shadow-sm">
          {/* Header Row */}
          <div className="flex justify-between px-6 py-4 bg-gray-50 rounded-t-xl">
            <span className="text-gray-500 font-medium">Company</span>
            <span className="text-gray-500 font-medium">Card N°</span>
          </div>

          {/* Empty State */}
          <div className="px-6 py-12 flex justify-center border-t border-gray-100">
            <span className="text-gray-500">No card found</span>
          </div>
        </div>
      </div>

      <AddCardModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default MyCardsScreen;