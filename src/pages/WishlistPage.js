import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import loadingAnimation from '../Assets/animations/loading.json';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';

const WishlistPage = () => {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/wishlist/my-wishlist`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch wishlist');

      const data = await response.json();
      // Transform the wishlist data to match ProductCard props
      const transformedData = data.map(item => ({
        ...item.product,
        __shop__: item.shop,
        variations: [
          {
            id: item.id,
            price: item.price || 0,
            stockQuantity: item.stockQuantity || 0,
            isActive: item.product.isActive,
            imageUrl: item.product.imageUrl,
          }
        ]
      }));
      
      setWishlistItems(transformedData);
      setError('');
    } catch (err) {
      setError('Failed to load wishlist. Please try again later.');
      console.error('Error fetching wishlist:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">My Wishlist</h1>
          <div className="flex items-center justify-center h-64">
            <Lottie 
              animationData={loadingAnimation}
              style={{ width: 150, height: 150 }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">My Wishlist</h1>

        {error ? (
          <div className="text-red-600 p-4 bg-red-50 rounded-lg">
            {error}
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">Your wishlist is empty</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {wishlistItems.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onNavigate={() => {
                  navigate(`/productDetails?key=${product.id}`);
                  console.log('Navigate to product:', product.id);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;