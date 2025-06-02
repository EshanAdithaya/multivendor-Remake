// src/pages/PaymentSuccessPage.js
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import orderSuccessAnimation from '../Assets/animations/packing.json';
import { CheckCircle, Copy, ExternalLink } from 'lucide-react';

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const processPaymentSuccess = async () => {
      const sessionId = searchParams.get('session_id');
      const orderId = searchParams.get('order_id');

      if (!sessionId || !orderId) {
        setError('Missing payment information');
        setLoading(false);
        return;
      }

      try {
        console.log('Processing payment success...', { sessionId, orderId });

        // Call your backend success handler
        const response = await fetch(
          `${process.env.REACT_APP_BASE_URL}/api/orders/payment/success?session_id=${sessionId}&order_id=${orderId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to process payment');
        }

        const result = await response.json();
        console.log('Payment success result:', result);
        setOrderDetails(result);
        
        // Optional: Redirect to order details page after a few seconds
        setTimeout(() => {
          if (result.uniqueOrderId) {
            navigate(`/order-details?token=${result.uniqueOrderId}`);
          } else {
            navigate(`/order-details?token=${result.orderId}`);
          }
        }, 8000); // Increased to 8 seconds to give user time to see details

      } catch (error) {
        console.error('Payment processing error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    processPaymentSuccess();
  }, [searchParams, navigate]);

  const copyOrderId = (orderIdToCopy) => {
    navigator.clipboard.writeText(orderIdToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleViewOrderDetails = () => {
    if (orderDetails?.uniqueOrderId) {
      navigate(`/order-details?token=${orderDetails.uniqueOrderId}`);
    } else if (orderDetails?.orderId) {
      navigate(`/order-details?token=${orderDetails.orderId}`);
    } else {
      navigate('/my-order');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Processing your payment...</p>
          <p className="mt-2 text-sm text-gray-500">Please wait while we confirm your transaction</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-red-600 mb-2">Payment Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-y-2">
            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-yellow-400 text-white px-6 py-2 rounded-lg hover:bg-yellow-500"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/cart')}
              className="w-full bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300"
            >
              Return to Cart
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
        {/* Success Animation */}
        <div className="mb-6 w-48 h-48 mx-auto">
          <Lottie
            animationData={orderSuccessAnimation}
            loop={false}
            autoplay={true}
          />
        </div>
        
        {/* Success Icon and Message */}
        <div className="flex items-center justify-center gap-2 text-green-600 mb-2">
          <CheckCircle className="w-8 h-8" />
          <h1 className="text-3xl font-bold">Payment Successful!</h1>
        </div>
        
        <p className="text-gray-600 mb-6">
          Thank you for your purchase! Your order has been confirmed and payment processed successfully.
        </p>
        
        {/* Order Details Section */}
        {orderDetails && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h2 className="font-semibold text-gray-700 mb-4 text-center">Order Confirmation</h2>
            
            {/* Unique Order ID */}
            {orderDetails.uniqueOrderId && (
              <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Unique Order ID</p>
                    <p className="font-bold text-yellow-600 text-lg">#{orderDetails.uniqueOrderId}</p>
                  </div>
                  <button
                    onClick={() => copyOrderId(orderDetails.uniqueOrderId)}
                    className="p-2 hover:bg-yellow-100 rounded transition-colors"
                    title="Copy Order ID"
                  >
                    <Copy className="w-4 h-4 text-yellow-600" />
                  </button>
                </div>
              </div>
            )}

            {/* Database Order ID */}
            {orderDetails.orderId && (
              <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Database Order ID</p>
                    <p className="font-mono text-sm text-blue-600">{orderDetails.orderId}</p>
                  </div>
                  <button
                    onClick={() => copyOrderId(orderDetails.orderId)}
                    className="p-2 hover:bg-blue-100 rounded transition-colors"
                    title="Copy Database ID"
                  >
                    <Copy className="w-4 h-4 text-blue-600" />
                  </button>
                </div>
              </div>
            )}

            {/* Order Status and Payment Info */}
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  {orderDetails.order?.status || 'Confirmed'}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Payment</p>
                <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  {orderDetails.order?.paymentStatus || 'Paid'}
                </span>
              </div>
            </div>

            {/* Payment Method and Amount */}
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <p className="text-sm text-gray-600">Payment Method</p>
                <p className="font-medium">💳 Stripe (Credit Card)</p>
              </div>
              {orderDetails.order?.totalAmount && (
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="font-bold text-lg text-green-600">
                    ${Number(orderDetails.order.totalAmount).toFixed(2)}
                  </p>
                </div>
              )}
            </div>

            {/* Session ID for reference */}
            {orderDetails.sessionId && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Transaction ID: {orderDetails.sessionId}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Copy Success Message */}
        {copied && (
          <div className="mb-4 p-2 bg-green-100 text-green-700 rounded-md text-sm">
            ✓ Order ID copied to clipboard!
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleViewOrderDetails}
            className="w-full bg-yellow-400 text-white px-6 py-3 rounded-lg hover:bg-yellow-500 flex items-center justify-center gap-2 font-medium"
          >
            <ExternalLink className="w-4 h-4" />
            View Order Details
          </button>
          
          <button
            onClick={() => navigate('/my-order')}
            className="w-full bg-green-100 text-green-700 px-6 py-3 rounded-lg hover:bg-green-200 font-medium"
          >
            View All Orders
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 font-medium"
          >
            Continue Shopping
          </button>
        </div>

        {/* Email Confirmation Note */}
        <p className="text-sm text-gray-500 mt-6">
          📧 A confirmation email has been sent to your registered email address.
        </p>

        {/* Auto-redirect Notice */}
        <p className="text-xs text-gray-400 mt-4">
          You will be automatically redirected to order details in 8 seconds...
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;