import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import orderSuccessAnimation from '../Assets/animations/packing.json';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [emailSent, setEmailSent] = useState(false);
  const orderDetails = location.state?.orderDetails;

  useEffect(() => {
    if (!orderDetails) {
      navigate('/');
      return;
    }

    const sendConfirmationEmail = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/email/send`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          },
          body: JSON.stringify({
            to: [orderDetails.email],
            subject: `Order Confirmation #${orderDetails.orderNumber}`,
            htmlContent: `
              <h1>Thank you for your order!</h1>
              <p>Your order #${orderDetails.orderNumber} has been confirmed.</p>
              <p>We'll notify you when your order ships.</p>
              <br>
              <p>Order Total: $${orderDetails.total}</p>
            `
          })
        });

        if (response.ok) {
          setEmailSent(true);
        }
      } catch (error) {
        console.error('Failed to send confirmation email:', error);
      }
    };

    sendConfirmationEmail();
  }, [orderDetails, navigate]);

  if (!orderDetails) {
    return null;
  }

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
          Order Successful!
        </h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order has been confirmed.
        </p>

        <div className="bg-gray-50 rounded-md p-4 mb-6">
          <p className="text-sm text-gray-500 mb-2">
            Order number: #{orderDetails.orderNumber}
          </p>
          <p className="text-sm text-gray-500">
            {emailSent 
              ? `Confirmation email sent to ${orderDetails.email}`
              : 'Sending confirmation email...'}
          </p>
        </div>

        <div className="space-y-3">
          <button 
            onClick={() => navigate('/orders')}
            className="w-full text-yellow-500 hover:text-yellow-600 font-semibold py-2 px-4 rounded-md transition-colors"
          >
            Track Order
          </button>

          <button 
            onClick={() => navigate('/')}
            className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-2 px-4 rounded-md border border-gray-300 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;