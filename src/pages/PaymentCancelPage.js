// src/pages/PaymentCancelPage.js
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import Lottie from 'lottie-react';
import cancelAnimation from '../Assets/animations/not_found.json';
import { ChevronLeft, ShoppingBag, AlertCircle } from 'lucide-react';

const PaymentCancelPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState(null);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const processPaymentCancel = async () => {
      const orderId = searchParams.get('order_id');

      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        console.log('Processing payment cancellation...', { orderId });

        // Call your backend cancel handler
        const response = await fetch(
          `${process.env.REACT_APP_BASE_URL}/api/orders/payment/cancel?order_id=${orderId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          setOrderDetails(result);
        }
      } catch (error) {
        console.error('Cancel processing error:', error);
      } finally {
        setLoading(false);
      }
    };

    processPaymentCancel();
  }, [searchParams]);

  const handleReturnToCheckout = () => {
    navigate('/checkout');
  };

  const handleReturnToCart = () => {
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white p-4 border-b flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold">Payment Cancelled</h1>
      </div>

      {/* Content */}
      <div className="flex flex-col items-center justify-center flex-1 p-6">
        <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="w-48 h-48 mx-auto">
            <Lottie
              animationData={cancelAnimation}
              loop={true}
            />
          </div>
          
          <div className="mt-6 flex items-center justify-center gap-2 text-red-600">
            <AlertCircle className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Payment Cancelled</h2>
          </div>
          
          <p className="mt-4 text-gray-600">
            Your payment was cancelled and no charges were made to your account.
            {sessionId && <span className="block mt-2 text-sm text-gray-500">Session ID: {sessionId}</span>}
          </p>
          
          {orderDetails && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4 text-left">
              <h2 className="font-semibold mb-2">Order Information</h2>
              <p><strong>Order ID:</strong> {orderDetails.uniqueOrderId}</p>
              <p><strong>Status:</strong> <span className="text-yellow-600">Cancelled</span></p>
              <p><strong>Payment:</strong> <span className="text-yellow-600">Cancelled</span></p>
            </div>
          )}

          <div className="mt-8 space-y-3">
            <button 
              onClick={handleReturnToCheckout}
              className="w-full py-3 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition-colors"
            >
              Return to Checkout
            </button>
            
            <button 
              onClick={handleReturnToCart}
              className="w-full py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>View Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelPage;