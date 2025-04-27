import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import loadingAnimation from '../Assets/animations/loading.json';

const OrderCard = ({ order, onClick }) => {
  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Use uniqueOrderId if available, otherwise show first 8 chars of regular ID
  const displayOrderId = order.uniqueOrderId || order.id.substring(0, 8);
  const fullOrderId = order.id;

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm p-4 mb-4 cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-center mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Order #{displayOrderId}
          </h3>
          <p className="text-xs text-gray-500">ID: {fullOrderId}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm ${
          order.shippingStatus === 'shipped' 
            ? 'bg-green-100 text-green-800'
            : order.shippingStatus === 'delivered'
            ? 'bg-blue-100 text-blue-800'
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {order.shippingStatus.charAt(0).toUpperCase() + order.shippingStatus.slice(1)}
        </span>
      </div>

      <div className="space-y-2 text-gray-600">
        <div className="flex justify-between">
          <span>Order Date:</span>
          <span>{formattedDate}</span>
        </div>
        <div className="flex justify-between">
          <span>Shop:</span>
          <span className="truncate max-w-[180px]">{order.shop?.name || 'Unknown Shop'}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping Method:</span>
          <span className="capitalize">{order.shippingMethod}</span>
        </div>
        <div className="flex justify-between">
          <span>Items:</span>
          <span>{order.items.length}</span>
        </div>
        <div className="flex justify-between font-semibold text-gray-800">
          <span>Total Amount:</span>
          <span>${parseFloat(order.totalAmount).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

const MyOrdersScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const API_REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;

  const handleOrderClick = (orderId) => {
    navigate(`/order-details?token=${orderId}`);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          throw new Error('No access token found');
        }

        const response = await fetch(`${API_REACT_APP_BASE_URL}/api/orders`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': '*/*'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        
        // Sort orders by creation date (newest first)
        const sortedOrders = [...data].sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        
        setOrders(sortedOrders);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [API_REACT_APP_BASE_URL]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-64 h-64">
          <Lottie animationData={loadingAnimation} loop={true} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="bg-red-50 text-red-800 p-4 rounded-lg border border-red-200">
          <h3 className="font-medium mb-2">Error loading orders</h3>
          <p>{error}</p>
          <button 
            className="mt-3 bg-red-100 text-red-800 px-4 py-2 rounded hover:bg-red-200"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h1>
        
        {orders.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg shadow-sm p-6">
            <div className="text-gray-500 mb-4">No orders found</div>
            <button 
              onClick={() => navigate('/')}
              className="bg-yellow-400 text-white px-4 py-2 rounded-full hover:bg-yellow-500"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                onClick={() => handleOrderClick(order.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersScreen;