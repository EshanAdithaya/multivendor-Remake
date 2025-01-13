import React, { useState, useEffect } from 'react';
import { ChevronLeft, MapPin, CreditCard, Clock, Plus, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [selectedAddress, setSelectedAddress] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [carts, setCarts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;

  const paymentMethods = [
    {
      id: 0,
      type: 'credit_card',
      details: 'Credit Card Payment',
      expiry: ''
    },
    {
      id: 1,
      type: 'paypal',
      details: 'PAYPAL ',
      expiry: ''
    },
    {
      id: 2,
      type: 'bank_transfer',
      details: 'BANK_TRANSFER',
      expiry: ''
    }
  ];

  useEffect(() => {
    fetchAddresses();
    fetchCarts();
  }, []);

  const fetchAddresses = async () => {
    const token = localStorage.getItem('accessToken');
    try {
      const response = await fetch(`${API_REACT_APP_BASE_URL}/api/orders/addresses`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setAddresses(data);
      if (data.length > 0) {
        setSelectedAddress(data[0].id);
      }
    } catch (err) {
      setError('Failed to fetch addresses');
    }
  };

  const fetchCarts = async () => {
    const token = localStorage.getItem('accessToken');
    try {
      const response = await fetch(`${API_REACT_APP_BASE_URL}/api/carts/user`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setCarts(data);
      }
    } catch (err) {
      setError('Failed to fetch cart data');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotal = () => {
    let subtotal = carts.reduce((total, cart) => {
      return total + cart.cartItems.reduce((cartTotal, item) => {
        return cartTotal + (Number(item.price) * item.quantity);
      }, 0);
    }, 0);

    const delivery = 2.00;
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + delivery + tax;

    return {
      subtotal,
      delivery,
      tax,
      total
    };
  };

  const handlePlaceOrder = async () => {
    const token = localStorage.getItem('accessToken');
    
    try {
      for (const cart of carts) {
        const orderData = {
          status: "pending",
          paymentStatus: "pending",
          paymentMethod: paymentMethods[selectedPayment].type.toLowerCase(),
          transactionId: `txn_${Date.now()}`,
          billingAddressId: selectedAddress,
          shippingAddressId: selectedAddress,
          shopId: cart.shop.id,
          shippingStatus: "pending",
          shippingMethod: "standard",
          items: cart.cartItems.map(item => ({
            productVariationId: item.productVariation.id,
            quantity: item.quantity
          }))
        };

        const response = await fetch(`${API_REACT_APP_BASE_URL}/api/orders`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(orderData)
        });

        if (!response.ok) {
          throw new Error(`Failed to create order for ${cart.shop.name}`);
        }
      }
      
      // Navigate to success page or show success message
      navigate('/order-success');
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-yellow-600">Loading checkout...</div>
      </div>
    );
  }

  const orderSummary = calculateTotal();

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white p-4 border-b flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold">Checkout</h1>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="max-w-lg mx-auto p-4 space-y-6">
          {/* Cart Items */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingBag className="w-5 h-5 text-yellow-600" />
              <h2 className="font-semibold">Your Items</h2>
            </div>
            {carts.map((cart) => (
              <div key={cart.id} className="mb-4">
                <div className="font-medium text-gray-700 mb-2">{cart.shop.name}</div>
                {cart.cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded mb-2">
                    <div>
                      <div className="font-medium">{item.productVariation.material}</div>
                      <div className="text-sm text-gray-500">Quantity: {item.quantity}</div>
                    </div>
                    <div className="text-yellow-600">${Number(item.price).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Delivery Address */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-yellow-600" />
                <h2 className="font-semibold">Delivery Address</h2>
              </div>
              <button className="text-yellow-600">
                <a href='/address'> <Plus className="w-5 h-5" /> </a>
              </button>
            </div>
            
            <div className="space-y-3">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                    selectedAddress === addr.id
                      ? 'border-yellow-400 bg-yellow-50'
                      : 'border-gray-100'
                  }`}
                  onClick={() => setSelectedAddress(addr.id)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{addr.city}</span>
                  </div>
                  <p className="text-gray-600 mt-1">{addr.street}</p>
                  <p className="text-gray-500 text-sm">{addr.state}, {addr.postalCode}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-yellow-600" />
                <h2 className="font-semibold">Payment Method</h2>
              </div>
            </div>

            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                    selectedPayment === method.id
                      ? 'border-yellow-400 bg-yellow-50'
                      : 'border-gray-100'
                  }`}
                  onClick={() => setSelectedPayment(method.id)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{method.type}</span>
                  </div>
                  <p className="text-gray-600 mt-1">{method.details}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h2 className="font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${orderSummary.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span>${orderSummary.delivery.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>${orderSummary.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                <span>Total</span>
                <span>${orderSummary.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Place Order Button */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="bg-white border-t p-4">
          <button 
            onClick={handlePlaceOrder}
            disabled={!selectedAddress} 
            className="w-full bg-yellow-400 text-white py-4 rounded-full flex items-center justify-between px-6 disabled:opacity-50"
          >
            <span className="text-lg font-medium">Place Order</span>
            <span className="bg-white text-yellow-400 px-4 py-2 rounded-full font-medium">
              ${orderSummary.total.toFixed(2)}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;