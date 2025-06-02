// src/pages/PaymentSuccessPage.js
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import orderSuccessAnimation from '../Assets/animations/packing.json';

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState(null);

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
        setOrderDetails(result);
        
        // Optional: Redirect to order details page after a few seconds
        setTimeout(() => {
          navigate(`/order-details?token=${result.orderId}`);
        }, 5000);

      } catch (error) {
        console.error('Payment processing error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    processPaymentSuccess();
  }, [searchParams, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Processing your payment...</p>
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
          <button
            onClick={() => navigate('/checkout')}
            className="bg-yellow-400 text-white px-6 py-2 rounded-lg hover:bg-yellow-500"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="mb-6 w-48 h-48 mx-auto">
          <Lottie
            animationData={orderSuccessAnimation}
            loop={false}
            autoplay={true}
          />
        </div>
        
        <h1 className="text-3xl font-bold text-green-600 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-4">Thank you for your purchase!</p>
        
        {orderDetails && (
          <div className="bg-gray-50 p-4 rounded-lg mb-4 text-left">
            <h2 className="font-semibold mb-2">Order Details</h2>
            <p><strong>Order ID:</strong> {orderDetails.uniqueOrderId}</p>
            <p><strong>Status:</strong> <span className="text-green-600">Confirmed</span></p>
            <p><strong>Payment:</strong> <span className="text-green-600">Paid via Stripe</span></p>
          </div>
        )}

        <div className="space-y-2">
          <button
            onClick={() => navigate(`/order-details?token=${orderDetails?.orderId}`)}
            className="w-full bg-yellow-400 text-white px-6 py-2 rounded-lg hover:bg-yellow-500"
          >
            View Order Details
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300"
          >
            Continue Shopping
          </button>
        </div>

        <p className="text-sm text-gray-500 mt-4">
          You will be automatically redirected to your order details in a few seconds...
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;