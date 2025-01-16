import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Eye, Loader2 } from 'lucide-react';

// Ensure this is set in your .env file
const API_BASE_URL = process.env.REACT_APP_BASE_URL || 'https://pawsome.soluzent.com';

// Remove TypeScript interfaces
// const OrderDetailsScreen = () => {
const OrderDetailsScreen = () => {
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const orderId = searchParams.get('token');
        const accessToken = localStorage.getItem('accessToken');
        
        if (!orderId || !accessToken) {
          throw new Error('Missing required parameters');
        }

        const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'accept': '*/*',
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 404) {
          throw new Error('Order not found');
        }
        
        if (!response.ok) {
          throw new Error(`Failed to fetch order details: ${response.status}`);
        }

        const data = await response.json();
        setOrder(data[0]); // Assuming the API returns an array with one order
      } catch (err) {
        console.error('Error:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [searchParams]);

  // Optional redirect after successful order fetch
  useEffect(() => {
    if (order?.id && !loading && !error) {
      // Uncomment if you want to redirect
      // navigate(`/order-success?key=${order.id}`);
    }
  }, [order, loading, error, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white p-4">
        <div className="max-w-2xl mx-auto mt-8 bg-red-50 text-red-800 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="px-6 pt-6">
        <h1 className="text-xl font-bold text-gray-800 mb-4">Order #{order.id.slice(0, 6)}</h1>

        <div className="bg-white rounded-xl shadow-sm mb-4">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="text-gray-800">Order Details - {order.transactionId}</div>
              <div className="flex items-center text-yellow-400">
                <Eye className="w-5 h-5 mr-2" />
                <span>Details</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center">
                <span className="text-gray-600">Order Status:</span>
                <span className="ml-2 px-3 py-1 bg-[#f5f0e5] text-[#96772d] rounded-lg text-sm capitalize">
                  {order.status}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-600">Payment Method:</span>
                <span className="ml-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-sm capitalize">
                  {order.paymentMethod}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-600">Order Date:</span>
                <span className="ml-2 text-gray-800">
                  {formatDate(order.createdAt)}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Shipping Address</h3>
              <p className="text-gray-600">
                {`${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state}, ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}`}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Billing Address</h3>
              <p className="text-gray-600">
                {`${order.billingAddress.street}, ${order.billingAddress.city}, ${order.billingAddress.state}, ${order.billingAddress.postalCode}, ${order.billingAddress.country}`}
              </p>
            </div>
          </div>

          <div className="p-4 border-t border-gray-100">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount</span>
                <span className="font-semibold">${parseFloat(order.totalAmount).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex justify-between py-3 px-4 bg-gray-50 rounded-t-lg">
            <span className="font-medium">Item</span>
            <span className="font-medium">Quantity</span>
          </div>
          
          {order.items.map((item, index) => (
            <div key={item.id} className="flex items-center justify-between py-4 px-4 border-b">
              <div className="flex items-center">
                <img 
                  src={
                    item.productVariation?.imageUrl || 
                    item.productVariation?.product?.imageUrl || 
                    '/api/placeholder/48/48'
                  } 
                  alt={`Product ${index + 1}`} 
                  className="w-12 h-12 object-cover rounded" 
                />
                <div className="ml-3">
                  <div className="text-gray-800">
                    {item.productVariation?.product?.name || `Item ${index + 1}`}
                  </div>
                  <div className="text-gray-500">
                    {item.productVariation?.size && `Size: ${item.productVariation.size}`}
                    {item.productVariation?.color && ` | Color: ${item.productVariation.color}`}
                  </div>
                  <div className="text-yellow-400">${parseFloat(item.price).toFixed(2)}</div>
                  <div className="text-gray-500">Total: ${parseFloat(item.total).toFixed(2)}</div>
                </div>
              </div>
              <span className="text-gray-800">{item.quantity}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsScreen;