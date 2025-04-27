import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Lottie from 'lottie-react';
import orderSuccessAnimation from '../Assets/animations/packing.json';

const OrderPlaceStatus = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [ordersData, setOrdersData] = useState([]);
  const [failedOrders, setFailedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [partialSuccess, setPartialSuccess] = useState(false);
  
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        // Get order ID from URL parameters or state passed from checkout page
        const primaryOrderId = searchParams.get('key') || location.state?.orderId;
        
        if (!primaryOrderId) {
          navigate('/');
          return;
        }
        
        // Check if we have allOrders from the bulk checkout response
        const allOrders = location.state?.allOrders || [];
        const hasFailedOrders = location.state?.partialSuccess || false;
        const errorsList = location.state?.errors || [];
        
        setPartialSuccess(hasFailedOrders);
        
        if (allOrders.length > 0) {
          // If we have pre-fetched orders data from checkout page
          setOrdersData(allOrders);
          setFailedOrders(errorsList);
          setLoading(false);
        } else {
          // Otherwise, fetch the individual order
          const orderResponse = await fetch(`${process.env.REACT_APP_BASE_URL}/api/orders/${primaryOrderId}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
          });

          if (!orderResponse.ok) {
            throw new Error('Failed to fetch order details');
          }

          const orderData = await orderResponse.json();
          setOrdersData([{
            orderId: primaryOrderId,
            uniqueOrderId: orderData.uniqueOrderId || primaryOrderId,
            shopName: orderData.shop?.name || 'Shop',
            status: orderData.status,
            totalAmount: orderData.totalAmount
          }]);
        }
      } catch (err) {
        setError(err.message);
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [location, navigate, searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error && ordersData.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
          <p className="text-gray-600 mb-6">{error || 'Order details not found'}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-yellow-400 text-white font-semibold py-2 px-4 rounded-md hover:bg-yellow-500 transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  const getSuccessMessage = () => {
    if (ordersData.length === 0 && failedOrders.length > 0) {
      return "Order Processing Failed";
    } else if (partialSuccess || failedOrders.length > 0) {
      return "Orders Partially Successful";
    } else if (ordersData.length > 1) {
      return "Orders Placed Successfully!";
    } else {
      return "Order Placed Successfully!";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <div className="mb-6 w-48 h-48 mx-auto">
          <Lottie
            animationData={orderSuccessAnimation}
            loop={false}
            autoplay={true}
          />
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {getSuccessMessage()}
        </h1>
        
        {ordersData.length > 0 ? (
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. 
            {ordersData.length > 1 ? ' Your orders have' : ' Your order has'} been confirmed.
          </p>
        ) : (
          <p className="text-gray-600 mb-6">
            We encountered an issue processing your order(s).
          </p>
        )}
        
        {ordersData.length > 0 && (
          <p className="text-sm text-gray-500 mb-4">
            A confirmation email has been sent to your registered email address.
          </p>
        )}

        {/* Successful Orders Section */}
        {ordersData.length > 0 && (
          <div className="bg-gray-50 rounded-md p-4 mb-6">
            <h3 className="font-semibold text-gray-700 mb-3">
              {ordersData.length > 1 ? 'Successful Orders:' : 'Order Detail:'}
            </h3>
            
            <div className="space-y-4">
              {ordersData.map((order, index) => (
                <div key={order.orderId || index} className="border border-gray-200 rounded-md p-3 bg-white">
                  <p className="font-medium text-yellow-600">
                    Unique Order ID #{order.uniqueOrderId || order.orderId}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Order ID: {order.orderId}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Shop: {order.shopName}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-500">Status:</span>
                    <span className="text-sm font-medium px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                      {order.status || 'Processing'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-500">Amount:</span>
                    <span className="text-sm font-medium">${Number(order.totalAmount).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Failed Orders Section */}
        {(failedOrders.length > 0 || partialSuccess) && (
          <div className="bg-red-50 rounded-md p-4 mb-6">
            <h3 className="font-semibold text-red-700 mb-3">Failed Orders:</h3>
            
            <div className="space-y-4">
              {failedOrders.length > 0 ? (
                failedOrders.map((failedOrder, index) => (
                  <div key={index} className="border border-red-200 rounded-md p-3 bg-white">
                    <p className="font-medium text-red-600">
                      Shop: {failedOrder.shopName || failedOrder.shopId || 'Unknown Shop'}
                    </p>
                    <p className="text-sm text-red-500 mt-1">
                      Error: {failedOrder.error || 'Processing failed'}
                    </p>
                  </div>
                ))
              ) : (
                <div className="border border-red-200 rounded-md p-3 bg-white">
                  <p className="text-sm text-red-500">
                    Some orders couldn't be processed. Please try again or contact customer support.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error message if one was caught */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="space-y-3">
          {ordersData.length > 0 && (
            <button
              onClick={() => navigate('/my-order')}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 px-4 rounded-md transition-colors"
            >
              Track Orders
            </button>
          )}

          <button
            onClick={() => navigate('/')}
            className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-2 px-4 rounded-md border border-gray-300 transition-colors"
          >
            Continue Shopping
          </button>
          
          {(failedOrders.length > 0 || partialSuccess) && (
            <button
              onClick={() => navigate('/cart')}
              className="w-full bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-2 px-4 rounded-md transition-colors"
            >
              Return to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderPlaceStatus;