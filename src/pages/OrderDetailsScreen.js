import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Package, CreditCard, Truck, MapPin } from 'lucide-react';

const API_REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;

const StatusBadge = ({ status }) => {
  const getStatusColor = () => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'completed':
      case 'paid':
      case 'shipped':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'in_transit':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`px-3 py-1 rounded-lg text-sm capitalize ${getStatusColor()}`}>
      {status?.toLowerCase()?.replace('_', ' ') || 'N/A'}
    </span>
  );
};

const OrderDetailsScreen = () => {
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        // Extract token from URL search params
        const token = searchParams.get('token');
        console.log('Fetching order details for token:', token); // Debug log

        if (!token) {
          throw new Error('Order token is missing');
        }

        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          throw new Error('Authentication token is required');
        }

        // Use the token directly in the URL
        const response = await fetch(`${API_REACT_APP_BASE_URL}/api/orders/${token}`, {
          method: 'GET', // Explicitly set GET method
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json'
          }
        });

        console.log('Response status:', response.status); // Debug log

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Order not found');
          }
          throw new Error('Failed to fetch order details');
        }

        const data = await response.json();
        console.log('Fetched order data:', data); // Debug log
        setOrder(data);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto mt-8">
          <button 
            onClick={() => navigate('/my-order')}
            className="flex items-center text-gray-600 mb-4"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Orders
          </button>
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => navigate('/my-order')}
              className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg"
            >
              Return to Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto mt-8">
          <button 
            onClick={() => navigate('/my-order')}
            className="flex items-center text-gray-600 mb-4"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Orders
          </button>
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <p className="text-gray-600">No order data available</p>
          </div>
        </div>
      </div>
    );
  }

  // Format order ID safely
  const orderId = order?.id ? order.id.slice(0, 8) : 'ORD123456';
  
  // Format date safely
  const orderDate = order?.createdAt 
    ? new Date(order.createdAt).toLocaleString()
    : 'Date not available';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4">
        <button 
          onClick={() => navigate('/my-order')}
          className="flex items-center text-gray-600 mb-4"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Orders
        </button>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Order Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  Order #{orderId}
                </h1>
                <p className="text-gray-500 mt-1">{orderDate}</p>
              </div>
              <div className="flex gap-2">
                <StatusBadge status={order?.status} />
                <StatusBadge status={order?.paymentStatus} />
                <StatusBadge status={order?.shippingStatus} />
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Package className="w-5 h-5 text-yellow-400 mr-2" />
                <h3 className="font-semibold">Order Info</h3>
              </div>
              <div className="text-sm text-gray-600">
                <p>Transaction ID: {order?.transactionId || 'TXN78912345'}</p>
                {order?.trackingNumber && (
                  <p>Tracking: {order.trackingNumber}</p>
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <CreditCard className="w-5 h-5 text-yellow-400 mr-2" />
                <h3 className="font-semibold">Payment Info</h3>
              </div>
              <div className="text-sm text-gray-600">
                <p>Method: {order?.paymentMethod?.replace('_', ' ').toUpperCase() || 'CREDIT_CARD'}</p>
                <p>Amount: ${order?.totalAmount ? parseFloat(order.totalAmount).toFixed(2) : '149.99'}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Truck className="w-5 h-5 text-yellow-400 mr-2" />
                <h3 className="font-semibold">Shipping Info</h3>
              </div>
              <div className="text-sm text-gray-600">
                <p>Method: {order?.shippingMethod?.replace('_', ' ').toUpperCase() || 'STANDARD_SHIPPING'}</p>
                <StatusBadge status={order?.shippingStatus || 'in_transit'} />
              </div>
            </div>
          </div>

          {/* Order Items */}
          {order?.items?.length > 0 && (
            <div className="p-6 border-t border-gray-100">
              <h3 className="font-semibold mb-4">Order Items</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left p-4">Item</th>
                      <th className="text-right p-4">Price</th>
                      <th className="text-right p-4">Quantity</th>
                      <th className="text-right p-4">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, index) => (
                      <tr key={item?.id || index} className="border-t border-gray-100">
                        <td className="p-4">
                          <div className="flex items-center">
                            <img 
                              src={item?.imageUrl || "https://example.com/product-image.jpg"}
                              alt="Product"
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div className="ml-4">
                              <div className="font-medium">{item?.name || 'Premium Cotton T-Shirt'}</div>
                              {item?.productVariation && (
                                <div className="text-sm text-gray-500">
                                  {item.productVariation.size && (
                                    <span>Size: {item.productVariation.size}</span>
                                  )}
                                  {item.productVariation.color && (
                                    <span className="ml-2">Color: {item.productVariation.color}</span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-right">${parseFloat(item?.price || 0).toFixed(2)}</td>
                        <td className="p-4 text-right">{item?.quantity || 0}</td>
                        <td className="p-4 text-right">${parseFloat(item?.total || 0).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-gray-100 font-semibold">
                      <td colSpan="3" className="p-4 text-right">Total Amount</td>
                      <td className="p-4 text-right">
                        ${parseFloat(order?.totalAmount || 0).toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* Addresses */}
          {(order?.shippingAddress || order?.billingAddress) && (
            <div className="p-6 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {order?.shippingAddress && (
                  <div>
                    <div className="flex items-center mb-3">
                      <MapPin className="w-5 h-5 text-yellow-400 mr-2" />
                      <h3 className="font-semibold">Shipping Address</h3>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-600">{order.shippingAddress.street}</p>
                      <p className="text-gray-600">
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                      </p>
                      <p className="text-gray-600">{order.shippingAddress.country}</p>
                    </div>
                  </div>
                )}

                {order?.billingAddress && (
                  <div>
                    <div className="flex items-center mb-3">
                      <MapPin className="w-5 h-5 text-yellow-400 mr-2" />
                      <h3 className="font-semibold">Billing Address</h3>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-600">{order.billingAddress.street}</p>
                      <p className="text-gray-600">
                        {order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.postalCode}
                      </p>
                      <p className="text-gray-600">{order.billingAddress.country}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsScreen;