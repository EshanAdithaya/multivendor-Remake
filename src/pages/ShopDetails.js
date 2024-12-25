import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Phone, Mail, Globe, Star } from 'lucide-react';
import Header from '../components/Header';

const ShopDetails = () => {
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const shopId = params.get('token');
        if (!shopId) throw new Error('Shop ID is missing');
        
        const response = await fetch(`https://ppabanckend.adaptable.app/api/shops/${shopId}`);
        if (!response.ok) throw new Error('Failed to fetch shop details');
        const data = await response.json();
        setShop(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchShop();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F8F9FB] flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading shop details...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#F8F9FB] flex items-center justify-center">
        <div className="text-lg text-red-600">Error: {error}</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F9FB]">
      <Header />
      <div className="relative">
        <img
          src={shop.coverImageUrl || '/placeholder-cover.jpg'}
          alt="Shop Cover"
          className="w-full h-48 object-cover"
        />
        <div className="absolute -bottom-16 left-4 bg-white p-2 rounded-xl shadow-lg">
          <img
            src={shop.logoUrl || '/placeholder-logo.png'}
            alt={shop.name}
            className="w-28 h-28 rounded-lg object-cover"
          />
        </div>
      </div>

      <div className="px-4 mt-20">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-bold text-[#1E2532]">{shop.name}</h1>
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="text-lg font-semibold">{shop.rating}</span>
              <span className="text-gray-500 text-sm">({shop.totalReviews} reviews)</span>
            </div>
          </div>

          <p className="text-gray-600 mt-2">{shop.description}</p>

          <div className="mt-4 space-y-3">
            <div className="flex items-start gap-2">
              <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <p className="text-gray-600">
                {`${shop.streetAddress}, ${shop.city}, ${shop.state}, ${shop.zip}, ${shop.country}`}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-gray-400" />
              <a href={`tel:${shop.phoneNumber}`} className="text-gray-600">
                {shop.phoneNumber}
              </a>
            </div>

            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-gray-400" />
              <a href={`mailto:${shop.email}`} className="text-gray-600">
                {shop.email}
              </a>
            </div>

            {shop.website && (
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-gray-400" />
                <a href={shop.website} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                  Visit Website
                </a>
              </div>
            )}
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-3">Shop Statistics</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-500">Total Products</p>
                <p className="text-2xl font-bold text-[#1E2532]">{shop.totalProducts}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-500">Total Reviews</p>
                <p className="text-2xl font-bold text-[#1E2532]">{shop.totalReviews}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ShopDetails;