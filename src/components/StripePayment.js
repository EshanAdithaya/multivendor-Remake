// src/components/StripePayment.js
import React, { useState } from 'react';

const StripePayment = ({ orderData, onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);

  const handleStripeCheckout = async () => {
    setLoading(true);
    
    try {
      console.log('Starting Stripe checkout process...');
      
      // Prepare line items from order data
      const lineItems = orderData.items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.productName || item.productVariation?.material || 'Product',
            description: item.description || `${item.productVariation?.material || ''} - Qty: ${item.quantity}`,
          },
          unit_amount: Math.round(Number(item.price) * 100), // Convert to cents
        },
        quantity: item.quantity,
      }));

      console.log('Line items prepared:', lineItems);

      // Call your backend to create checkout session
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/payments/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({
          lineItems,
          orderId: orderData.orderId,
          customerId: orderData.customerId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create checkout session');
      }

      const { url, sessionId } = await response.json();
      
      console.log('Checkout session created:', sessionId);
      console.log('Redirecting to Stripe:', url);
      
      // Redirect to Stripe's checkout page
      window.location.href = url;
      
    } catch (error) {
      console.error('Stripe checkout error:', error);
      onError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stripe-payment-wrapper">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <h3 className="font-medium text-blue-800 mb-2">Secure Payment with Stripe</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>✓ 256-bit SSL encryption</li>
          <li>✓ Credit/Debit cards, Apple Pay, Google Pay</li>
          <li>✓ No card details stored on our servers</li>
        </ul>
      </div>
      
      <button 
        onClick={handleStripeCheckout}
        disabled={loading}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200 ${
          loading 
            ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Redirecting to Stripe...
          </span>
        ) : (
          'Pay Securely with Stripe'
        )}
      </button>
      
      <p className="text-xs text-gray-500 text-center mt-2">
        You'll be redirected to Stripe's secure payment page
      </p>
    </div>
  );
};

export default StripePayment;