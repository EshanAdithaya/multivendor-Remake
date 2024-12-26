import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Eye, Loader2 } from 'lucide-react';

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
        
        if (!accessToken) {
          throw new Error('Missing required parameters');
        }

        const response = await fetch(`https://ppabanckend.adaptable.app/api/orders/${orderId}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'accept': '*/*'
          }
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Order not found');
          }
          throw new Error('Failed to fetch order details');
        }

        const data = await response.json();
        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [searchParams]);

  // Separate useEffect for handling successful order navigation
  useEffect(() => {
    if (order?.id && !loading && !error) {
      // Navigate to order-success with the order ID as the key parameter
      navigate(`/order-success?key=${order.id}`);
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
      {/* Main Content */}
      <div className="px-6 pt-6">
        <h1 className="text-xl font-bold text-gray-800 mb-4">Order #{order?.id?.slice(0, 6)}</h1>

        {/* Order Details Card */}
        <div className="bg-white rounded-xl shadow-sm mb-4">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="text-gray-800">Order Details - {order?.transactionId}</div>
              <div className="flex items-center text-yellow-400">
                <Eye className="w-5 h-5 mr-2" />
                <span>Details</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center">
                <span className="text-gray-600">Order Status:</span>
                <span className="ml-2 px-3 py-1 bg-[#f5f0e5] text-[#96772d] rounded-lg text-sm capitalize">
                  {order?.status}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-600">Payment Status:</span>
                <span className="ml-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-sm capitalize">
                  {order?.paymentMethod}
                </span>
              </div>
            </div>
          </div>

          {/* Addresses */}
          <div className="p-4 space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Shipping Address</h3>
              <p className="text-gray-600">
                {`${order?.shippingAddress?.street}, ${order?.shippingAddress?.city}, ${order?.shippingAddress?.state}, ${order?.shippingAddress?.postalCode}, ${order?.shippingAddress?.country}`}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Billing Address</h3>
              <p className="text-gray-600">
                {`${order?.billingAddress?.street}, ${order?.billingAddress?.city}, ${order?.billingAddress?.state}, ${order?.billingAddress?.postalCode}, ${order?.billingAddress?.country}`}
              </p>
            </div>
          </div>

          {/* Price Details */}
          <div className="p-4 border-t border-gray-100">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount</span>
                <span>${parseFloat(order?.totalAmount).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Timeline */}
        <div className="relative pb-8">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          
          {/* Timeline Items */}
          <div className="space-y-6">
            {[
              { status: 'Pending', complete: order?.status !== 'pending' },
              { status: 'Processing', complete: order?.status === 'processing' },
              { status: 'Shipped', complete: order?.shippingStatus === 'shipped', number: 3 },
              { status: 'Delivered', complete: order?.status === 'completed', number: 4 }
            ].map((item, index) => (
              <div key={index} className="flex items-center ml-4">
                {item.complete ? (
                  <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center -ml-4">
                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full border-2 border-yellow-400 flex items-center justify-center -ml-4 bg-white">
                    <span className="text-yellow-400">{item.number || index + 1}</span>
                  </div>
                )}
                <span className="ml-4 text-gray-800">{item.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Items Table */}
        <div className="mt-6">
          <div className="flex justify-between py-3 px-4 bg-gray-50 rounded-t-lg">
            <span className="font-medium">Item</span>
            <span className="font-medium">Quantity</span>
          </div>
          
          {/* Item Rows */}
          {order?.items?.map((item, index) => (
            <div key={index} className="flex items-center justify-between py-4 px-4 border-b">
              <div className="flex items-center">
                <img src="/api/placeholder/48/48" alt="Product" className="w-12 h-12 object-cover rounded" />
                <div className="ml-3">
                  <div className="text-gray-800">Item {index + 1}</div>
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