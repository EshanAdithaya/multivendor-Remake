import React from 'react';
import { Star, MapPin, Clock, Phone } from 'lucide-react';

const ShopsPage = () => {
  const shops = [
    {
      id: 1,
      name: "Pawsome Pets",
      image: "/api/placeholder/400/250",
      rating: 4.8,
      reviewCount: 256,
      location: "123 Pet Street, New York",
      hours: "9:00 AM - 9:00 PM",
      phone: "+1 234 567 8900",
      tags: ["Pet Food", "Accessories", "Grooming"],
      isOpen: true,
      featured: true
    },
    {
      id: 2,
      name: "Happy Tails Store",
      image: "/api/placeholder/400/250",
      rating: 4.5,
      reviewCount: 182,
      location: "456 Animal Avenue, Brooklyn",
      hours: "8:00 AM - 8:00 PM",
      phone: "+1 234 567 8901",
      tags: ["Pet Food", "Toys", "Medicine"],
      isOpen: true,
      featured: false
    },
    {
      id: 3,
      name: "Veterinary Supplies Co",
      image: "/api/placeholder/400/250",
      rating: 4.7,
      reviewCount: 143,
      location: "789 Vet Road, Queens",
      hours: "10:00 AM - 7:00 PM",
      phone: "+1 234 567 8902",
      tags: ["Medicine", "Equipment", "Supplements"],
      isOpen: false,
      featured: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Logo */}
      <div className="bg-white p-4 border-b sticky top-0 z-10">
        <img src="/api/placeholder/40/40" alt="PetDoc Logo" className="w-10 h-10" />
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white border-b">
        <div className="p-4">
          <input
            type="search"
            placeholder="Search for shops..."
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition"
          />
        </div>

        {/* Tags/Categories */}
        <div className="px-4 pb-4 flex gap-2 overflow-x-auto">
          {["All Shops", "Pet Food", "Medicine", "Accessories", "Grooming", "Toys"].map((tag) => (
            <button
              key={tag}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                tag === "All Shops"
                  ? "bg-yellow-400 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Shops Grid */}
      <div className="p-4 space-y-4">
        {shops.map((shop) => (
          <div
            key={shop.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition hover:shadow-md"
          >
            {/* Shop Image */}
            <div className="relative">
              <img
                src={shop.image}
                alt={shop.name}
                className="w-full h-48 object-cover"
              />
              {shop.featured && (
                <div className="absolute top-4 left-4 bg-yellow-400 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Featured
                </div>
              )}
              <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-medium">
                {shop.isOpen ? (
                  <span className="text-green-600">Open Now</span>
                ) : (
                  <span className="text-red-600">Closed</span>
                )}
              </div>
            </div>

            {/* Shop Details */}
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold text-gray-900">{shop.name}</h2>
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="ml-1 font-semibold">{shop.rating}</span>
                  <span className="text-gray-500 text-sm ml-1">({shop.reviewCount})</span>
                </div>
              </div>

              {/* Location, Hours, and Phone */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-sm">{shop.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="text-sm">{shop.hours}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  <span className="text-sm">{shop.phone}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="mt-4 flex flex-wrap gap-2">
                {shop.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex gap-3">
                <button className="flex-1 bg-yellow-400 text-white font-semibold py-2 px-4 rounded-lg hover:bg-yellow-500 transition-colors">
                  Visit Shop
                </button>
                <button className="flex-1 border border-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                  Contact
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopsPage;