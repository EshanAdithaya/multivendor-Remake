import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const API_BASE_URL = process.env.BASE_URL;

const OrderCard = ({ order, onClick }) => {
  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm p-4 mb-4 cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-800">
          Order #{order.id.slice(0, 6)}
        </h3>
        <span className={`px-3 py-1 rounded-full text-sm ${
          order.shippingStatus === 'shipped' 
            ? 'bg-green-100 text-green-800'
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

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          throw new Error('No access token found');
        }

        const response = await fetch(`${API_BASE_URL}/api/orders`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'accept': '*/*'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleOrderClick = (orderId) => {
    navigate(`/orderDetails?token=${orderId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="bg-red-50 text-red-800 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h1>
        
        {orders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No orders found
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