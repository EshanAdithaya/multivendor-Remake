import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Lottie from 'lottie-react';
import orderSuccessAnimation from '../Assets/animations/packing.json';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [emailSent, setEmailSent] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchUserAndOrderDetails = async () => {
      const orderId = searchParams.get('key') || location.state?.orderId;
      
      if (!orderId) {
        navigate('/');
        return;
      }

      try {
        // First fetch user details to get the email
        const userResponse = await fetch(`${process.env.REACT_APP_BASE_URL}/api/auth/me`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        });

        if (!userResponse.ok) {
          throw new Error('Failed to fetch user details');
        }

        const userData = await userResponse.json();
        setUserEmail(userData.email);

        // Then fetch order details
        const orderResponse = await fetch(`${process.env.REACT_APP_BASE_URL}/api/orders/${orderId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        });

        if (!orderResponse.ok) {
          throw new Error('Failed to fetch order details');
        }

        const orderData = await orderResponse.json();
        setOrderDetails({
          orderNumber: orderData.uniqueOrderId || orderId,
          total: orderData.totalAmount
        });

        // Send confirmation email
        if (userData.email) {
          const emailResponse = await fetch(`${process.env.REACT_APP_BASE_URL}/api/email/send`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify({
              to: [userData.email],
              subject: `Order Confirmation #${orderData.uniqueOrderId || orderId}`,
              htmlContent: `
                <h1>Thank you for your order!</h1>
                <p>Your order #${orderData.uniqueOrderId || orderId} has been confirmed.</p>
                <p>We'll notify you when your order ships.</p>
                <br>
                <p>Order Total: $${orderData.totalAmount || '0.00'}</p>
              `
            })
          });

          if (emailResponse.ok) {
            setEmailSent(true);
          }
        }
      } catch (err) {
        setError(err.message);
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndOrderDetails();
  }, [location, navigate, searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !orderDetails) {
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
            {emailSent && userEmail
              ? `Confirmation email sent to ${userEmail}`
              : 'Sending confirmation email...'}
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate('/my-order')}
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