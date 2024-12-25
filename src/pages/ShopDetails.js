import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Phone, Mail, Globe, Star } from 'lucide-react';
import Header from '../components/Header';

const ShopDetails = () => {
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const shopId = params.get('token');
        if (!shopId) throw new Error('Shop ID is missing');
        
        const [shopResponse, productsResponse] = await Promise.all([
          fetch(`https://ppabanckend.adaptable.app/api/shops/${shopId}`),
          fetch(`https://ppabanckend.adaptable.app/api/products/get-all-with-filters?shopId=${shopId}`)
        ]);

        if (!shopResponse.ok || !productsResponse.ok) 
          throw new Error('Failed to fetch data');

        const [shopData, productsData] = await Promise.all([
          shopResponse.json(),
          productsResponse.json()
        ]);

        setShop(shopData);
        setProducts(productsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-base text-gray-600">Loading...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-base text-red-600">Error: {error}</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Shop Header - Mobile Optimized */}
      <div className="relative">
        <img
          src={shop.coverImageUrl || '/placeholder-cover.jpg'}
          alt="Shop Cover"
          className="w-full h-32 sm:h-48 object-cover"
        />
        <div className="absolute -bottom-12 sm:-bottom-16 left-4 bg-white p-2 rounded-xl shadow-lg">
          <img
            src={shop.logoUrl || '/placeholder-logo.png'}
            alt={shop.name}
            className="w-20 h-20 sm:w-28 sm:h-28 rounded-lg object-cover"
          />
        </div>
      </div>

      {/* Shop Details - Mobile Optimized */}
      <div className="px-4 mt-16 sm:mt-20 space-y-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{shop.name}</h1>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />
              <span className="text-base sm:text-lg font-semibold">{shop.rating}</span>
              <span className="text-sm text-gray-500">({shop.totalReviews})</span>
            </div>
          </div>

          <p className="text-gray-600 text-sm sm:text-base mt-2">{shop.description}</p>

          <div className="mt-4 space-y-2">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0 mt-1" />
              <p className="text-sm sm:text-base text-gray-600">
                {`${shop.streetAddress}, ${shop.city}, ${shop.state}, ${shop.zip}`}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <a href={`tel:${shop.phoneNumber}`} className="text-sm sm:text-base text-gray-600">
                {shop.phoneNumber}
              </a>
            </div>

            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <a href={`mailto:${shop.email}`} className="text-sm sm:text-base text-gray-600 break-all">
                {shop.email}
              </a>
            </div>

            {shop.website && (
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <a href={shop.website} target="_blank" rel="noopener noreferrer" 
                   className="text-sm sm:text-base text-blue-600 break-all">
                  Visit Website
                </a>
              </div>
            )}
          </div>

          <div className="mt-4 sm:mt-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-3">Shop Statistics</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs sm:text-sm text-gray-500">Products</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{shop.totalProducts}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs sm:text-sm text-gray-500">Reviews</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{shop.totalReviews}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Products Section - Mobile Optimized */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="text-lg sm:text-xl font-semibold mb-3">Products ({products.length})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {products.map((product) => (
              <div key={product.id} className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <div className="relative">
                  <img
                    src={product.imageUrl || '/api/placeholder/400/320'}
                    alt={product.name}
                    className="w-full h-32 sm:h-48 object-cover rounded-lg"
                  />
                  <span className={`absolute top-2 right-2 text-xs px-2 py-1 rounded ${
                    product.status === 'AVAILABLE' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.status}
                  </span>
                </div>
                
                <h3 className="font-semibold text-base sm:text-lg mt-2 line-clamp-1">{product.name}</h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">{product.description}</p>
                
                <div className="flex justify-between items-center mt-2">
                  <span className="text-base sm:text-lg font-bold text-blue-600">
                    ${parseFloat(product.price).toFixed(2)}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500">
                    Stock: {product.stockQuantity}
                  </span>
                </div>
                
                {product.variations?.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <p className="text-xs sm:text-sm font-medium mb-1">Variations:</p>
                    <div className="space-y-1">
                      {product.variations.slice(0, 2).map((variant) => (
                        <div key={variant.id} className="text-xs sm:text-sm text-gray-600 flex justify-between">
                          <span>{variant.material || variant.size || variant.color}</span>
                          <span>${parseFloat(variant.price).toFixed(2)}</span>
                        </div>
                      ))}
                      {product.variations.length > 2 && (
                        <div className="text-xs text-blue-600">
                          +{product.variations.length - 2} more variations
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-2 pt-2 border-t border-gray-200">
                  <span className="text-xs text-gray-500">
                    Expires: {new Date(product.expirationDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ShopDetails;