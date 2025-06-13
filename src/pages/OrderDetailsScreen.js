import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Eye, Loader2, XCircle, AlertCircle } from 'lucide-react';

const API_BASE_URL = 'https://pawsome.soluzent.com';

const OrderDetailsScreen = () => {
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refund, setRefund] = useState(null);
  const [processingAction, setProcessingAction] = useState(false);
  const navigate = useNavigate();

const fetchOrderDetails = async () => {
  try {
    const orderId = searchParams.get('token');
    const token = localStorage.getItem('accessToken');
    
    if (!orderId || !token) {
      throw new Error('Missing required parameters');
    }

    // Use the new API endpoint for fetching orders by unique ID
    const response = await fetch(`${API_BASE_URL}/api/orders/by-unique-id/${orderId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'accept': '*/*',
        'Content-Type': 'application/json',
        'mode': 'cors'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch order details: ${response.status}`);
    }

    const data = await response.json();
    
    // Debug logging
    console.log('Order data received:', data);
    
    // API now returns a single order object directly, not an array
    setOrder(data);
  } catch (err) {
    setError(err.message);
  }
};

  const fetchRefundDetails = async () => {
    try {
      const orderId = searchParams.get('token');
      const token = localStorage.getItem('accessToken');

      if (!orderId || !token) return;

      // Get the UUID from the order data instead of using the token directly
      if (!order || !order.id) {
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/refunds?orderId=${order.id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': '*/*',
          'Content-Type': 'application/json',
          'mode': 'cors'
        }
      });

      if (!response.ok) return;

      const data = await response.json();
      // Check if data is an array and take the first item, or use the data directly if it's an object
      setRefund(Array.isArray(data) ? data[0] : data);
    } catch (err) {
      console.error('Error fetching refund:', err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchOrderDetails();
  }, [searchParams]);
  
  // Fetch refund details after order is loaded
  useEffect(() => {
    if (order) {
      fetchRefundDetails();
    }
  }, [order]);


const handleRequestRefund = async () => {
  try {
    setProcessingAction(true);
    const token = localStorage.getItem('accessToken');
    
    // Extract userId and shopId from nested objects
    const userId = order.customer?.userId;
    const shopId = order.shop?.id;
    
    // Validate required fields
    if (!userId || !shopId) {
      throw new Error('Missing required order information (userId or shopId)');
    }
    
    // First update order status
    const orderUpdateResponse = await fetch(`${API_BASE_URL}/api/orders/${order.id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'accept': '*/*',
        'Content-Type': 'application/json',
        'mode': 'cors'
      },
      body: JSON.stringify({
        status: 'refund_initiated'
      })
    });

    if (!orderUpdateResponse.ok) {
      throw new Error('Failed to update order status');
    }
    
    // Then create refund request
    const refundResponse = await fetch(`${API_BASE_URL}/api/refunds`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'accept': '*/*',
        'Content-Type': 'application/json',
        'mode': 'cors'
      },
      body: JSON.stringify({
        amount: order.totalAmount,
        reason: 'Customer requested refund',
        status: 'pending',
        orderId: order.id,
        userId: userId,  // Use the extracted userId
        shopId: shopId   // Use the extracted shopId
      })
    });

    if (!refundResponse.ok) {
      const errorData = await refundResponse.json();
      throw new Error(errorData.message?.join(', ') || 'Failed to create refund request');
    }

    const refundData = await refundResponse.json();
    setRefund(refundData);
    await fetchOrderDetails(); // Refresh order details
  } catch (err) {
    setError(err.message);
    console.error('Refund error:', err);  // Log for debugging
  } finally {
    setProcessingAction(false);
  }
};

  const handleCancelRefund = async () => {
    try {
      setProcessingAction(true);
      const token = localStorage.getItem('accessToken');

      // First delete the refund request
      if (refund?.id) {
        const deleteResponse = await fetch(`${API_BASE_URL}/api/refunds/${refund.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'accept': '*/*',
            'mode': 'cors'
          }
        });

        if (!deleteResponse.ok) {
          throw new Error('Failed to cancel refund request');
        }
      }      // Then update order status back to original
      const orderUpdateResponse = await fetch(`${API_BASE_URL}/api/orders/${order.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': '*/*',
          'Content-Type': 'application/json',
          'mode': 'cors'
        },
        body: JSON.stringify({
          status: 'confirmed' // or whatever the original status should be
        })
      });

      if (!orderUpdateResponse.ok) {
        throw new Error('Failed to update order status');
      }

      setRefund(null);
      await fetchOrderDetails(); // Refresh order details
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessingAction(false);
    }
  };

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
    <div className="min-h-screen bg-white">      <div className="px-6 pt-6">
        <h1 className="text-xl font-bold text-gray-800 mb-4">Order #{order.uniqueOrderId || order.id}</h1>

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
        </div>        {/* Refund Section */}
        <div className="px-6 py-4 -mx-6">
          {refund && order?.status === 'refund_initiated' ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                    Refund Request Pending
                  </h3>
                  <p className="text-yellow-700">Amount: ${parseFloat(refund.amount).toFixed(2)}</p>
                  <p className="text-yellow-700">Reason: {refund.reason}</p>
                </div>
                <button
                  onClick={handleCancelRefund}
                  disabled={processingAction}
                  className="flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  {processingAction ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : (
                    <XCircle className="w-5 h-5 mr-2" />
                  )}
                  Cancel Request
                </button>
              </div>
            </div>
          ) : (
            order?.status !== 'refunded' && order?.status !== 'refund_initiated' && (
              <button
                onClick={handleRequestRefund}
                disabled={processingAction}
                className="flex items-center px-4 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition-colors"
              >
                {processingAction ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  <AlertCircle className="w-5 h-5 mr-2" />
                )}
                Request Refund
              </button>
            )
          )}
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