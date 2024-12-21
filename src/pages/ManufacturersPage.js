import React, { useState } from 'react';
import { Star, MapPin, Globe, Mail, Building2, Search, Filter } from 'lucide-react';
import Header from '../components/Header';

const ManufacturersPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  
  const manufacturers = [
    {
      id: 1,
      name: "PawPerfect Industries",
      type: "manufacturer",
      logo: "/api/placeholder/120/120",
      coverImage: "/api/placeholder/400/200",
      description: "Leading manufacturer of premium pet foods and accessories since 1990",
      rating: 4.8,
      reviewCount: 328,
      location: "New York, USA",
      website: "www.pawperfect.com",
      email: "contact@pawperfect.com",
      brands: ["Happy Paws", "PetLife", "NatureFeed"],
      featured: true,
      categories: ["Food", "Toys", "Accessories"]
    },
    {
      id: 2,
      name: "Pet Literature Co",
      type: "publisher",
      logo: "/api/placeholder/120/120",
      coverImage: "/api/placeholder/400/200",
      description: "Publishing the best pet care guides and educational materials",
      rating: 4.6,
      reviewCount: 156,
      location: "London, UK",
      website: "www.petliterature.com",
      email: "info@petliterature.com",
      publications: ["Pet Care Monthly", "Training Guides", "Breed Encyclopedia"],
      featured: true,
      categories: ["Books", "Magazines", "Digital Content"]
    },
    {
      id: 3,
      name: "VetSupply Global",
      type: "manufacturer",
      logo: "/api/placeholder/120/120",
      coverImage: "/api/placeholder/400/200",
      description: "Specialized in veterinary supplies and medical equipment",
      rating: 4.9,
      reviewCount: 245,
      location: "Berlin, Germany",
      website: "www.vetsupplyglobal.com",
      email: "contact@vetsupplyglobal.com",
      brands: ["MediPet", "VetCare", "PetHealth"],
      featured: false,
      categories: ["Medical Supplies", "Equipment", "Medicine"]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Logo */}
      <Header />

      {/* Search and Filter Section */}
      <div className="bg-white border-b">
        <div className="p-4 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="search"
              placeholder="Search manufacturers or publishers..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition"
            />
          </div>

          {/* Tabs */}
          <div className="flex gap-4">
            {['all', 'manufacturers', 'publishers'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${
                  activeTab === tab
                    ? 'bg-yellow-400 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="px-4 pb-4 flex gap-2 overflow-x-auto">
          {["All Categories", "Food", "Medicine", "Books", "Equipment", "Toys"].map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap bg-gray-100 text-gray-600 hover:bg-gray-200`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Manufacturers/Publishers Grid */}
      <div className="p-4 space-y-4">
        {manufacturers.map((company) => (
          <div
            key={company.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Cover Image and Logo */}
            <div className="relative">
              <img
                src={company.coverImage}
                alt={`${company.name} cover`}
                className="w-full h-48 object-cover"
              />
              <div className="absolute -bottom-8 left-4">
                <img
                  src={company.logo}
                  alt={`${company.name} logo`}
                  className="w-16 h-16 rounded-lg border-4 border-white shadow-sm"
                />
              </div>
              {company.featured && (
                <div className="absolute top-4 left-4 bg-yellow-400 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Featured Partner
                </div>
              )}
            </div>

            {/* Company Details */}
            <div className="p-4 pt-10">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{company.name}</h2>
                  <span className="text-sm text-gray-500 capitalize">{company.type}</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="ml-1 font-semibold">{company.rating}</span>
                  <span className="text-gray-500 text-sm ml-1">({company.reviewCount})</span>
                </div>
              </div>

              <p className="mt-3 text-gray-600">{company.description}</p>

              {/* Contact Information */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-sm">{company.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Globe className="w-4 h-4 mr-2" />
                  <span className="text-sm">{company.website}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  <span className="text-sm">{company.email}</span>
                </div>
              </div>

              {/* Brands/Publications */}
              <div className="mt-4">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  {company.type === 'manufacturer' ? 'Popular Brands' : 'Popular Publications'}:
                </div>
                <div className="flex flex-wrap gap-2">
                  {(company.brands || company.publications || []).map((item) => (
                    <span
                      key={item}
                      className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div className="mt-4">
                <div className="text-sm font-medium text-gray-700 mb-2">Categories:</div>
                <div className="flex flex-wrap gap-2">
                  {company.categories.map((category) => (
                    <span
                      key={category}
                      className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex gap-3">
                <button className="flex-1 bg-yellow-400 text-white font-semibold py-2 px-4 rounded-lg hover:bg-yellow-500 transition-colors">
                  View Products
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

export default ManufacturersPage;