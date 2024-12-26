import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

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

        const response = await fetch('https://ppabanckend.adaptable.app/api/orders', {
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
      {/* Header */}
      {/* <div className="w-full border-b border-gray-100 bg-white px-4 py-3">
        <div className="flex items-center">
          <div className="relative w-24">
            <div className="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center">
              <div className="text-white text-xs transform -rotate-45">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M12,2C6.48,2,2,6.48,2,12c0,5.52,4.48,10,10,10s10-4.48,10-10C22,6.48,17.52,2,12,2z"/>
                  <path d="M15,11c1.1,0,2-0.9,2-2s-0.9-2-2-2s-2,0.9-2,2S13.9,11,15,11z"/>
                  <path d="M9,11c1.1,0,2-0.9,2-2s-0.9-2-2-2s-2,0.9-2,2S7.9,11,9,11z"/>
                </svg>
              </div>
            </div>
            <span className="absolute bottom-0 left-11 text-sm font-medium text-gray-700">PetDoc</span>
          </div>
        </div>
      </div> */}

      {/* Main Content */}
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