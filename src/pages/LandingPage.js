import React, { useState, useEffect } from 'react';
import { ChevronRight, Search } from 'lucide-react';
import CompactProductCard from '../components/ProductCard';
import _ from 'lodash';
import { useNavigate } from 'react-router-dom';

const ShopSection = ({ shop, products, onNavigate }) => {
  if (!products?.length) return null;

  return (
    <div className="mb-4">
      {/* Shop Header */}
      <div className="flex items-center justify-between px-4 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
            <img
              src={shop.logoUrl || '/api/placeholder/40/40'}
              alt={shop.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="font-medium text-sm text-gray-900">{shop.name}</h2>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              {shop.rating && (
                <span className="flex items-center">
                  <span className="text-yellow-400">★</span>
                  <span className="ml-0.5">{shop.rating}</span>
                </span>
              )}
              {shop.totalReviews > 0 && (
                <>
                  <span>•</span>
                  <span>{shop.totalReviews} reviews</span>
                </>
              )}
            </div>
          </div>
        </div>
        <button className="text-xs text-gray-500 hover:text-gray-700">
          View All
        </button>
      </div>

      {/* Products Scroll */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 px-4 pb-2">
          {products.map(product => (
            <CompactProductCard
              key={product.id}
              product={product}
              onNavigate={() => onNavigate(product.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const LandingPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/products/get-all-with-filters${
          searchQuery ? `?name=${encodeURIComponent(searchQuery)}` : ''
        }`);
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery]);

  // Group products by shop
  const groupedProducts = _.groupBy(products, product => product.__shop__?.id);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-6 h-6 border-2 border-gray-200 border-t-yellow-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Search Bar */}
      <div className="sticky top-0 bg-white shadow-sm z-10 px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white mb-2">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 px-4 py-3">
            {products.map(product => product.category).filter((category, index, self) =>
              category && self.findIndex(c => c?.id === category?.id) === index
            ).map(category => (
              <button
                key={category.id}
                className="px-3 py-1.5 rounded-full text-xs whitespace-nowrap bg-gray-100 text-gray-600 hover:bg-gray-200"
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Shops and Products */}
      <div className="space-y-2">
        {Object.entries(groupedProducts).map(([shopId, shopProducts]) => {
          const shop = shopProducts[0].__shop__;
          return (
            <ShopSection
              key={shopId}
              shop={shop}
              products={shopProducts}
              onNavigate={(productId) => navigate(`/product/${productId}`)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default LandingPage;