import React, { useState } from 'react';
import { ChevronLeft, MapPin, CreditCard, Clock, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [selectedAddress, setSelectedAddress] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState(0);
  const [selectedTime, setSelectedTime] = useState(0);

  const addresses = [
    {
      id: 0,
      type: 'Home',
      address: '123 Main Street, Apt 4B',
      details: 'New York, NY 10001'
    },
    {
      id: 1,
      type: 'Work',
      address: '456 Office Road, Floor 3',
      details: 'New York, NY 10002'
    }
  ];

  const paymentMethods = [
    {
      id: 0,
      type: 'Credit Card',
      details: '•••• 4242',
      expiry: '04/25'
    },
    {
      id: 1,
      type: 'Debit Card',
      details: '•••• 8573',
      expiry: '08/24'
    }
  ];

  const deliveryTimes = [
    { id: 0, time: 'Today, 2:00 PM - 4:00 PM' },
    { id: 1, time: 'Today, 4:00 PM - 6:00 PM' },
    { id: 2, time: 'Tomorrow, 10:00 AM - 12:00 PM' }
  ];

  const orderSummary = {
    subtotal: 7.90,
    delivery: 2.00,
    tax: 0.79,
    total: 10.69
  };

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
          {/* Delivery Address */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-yellow-600" />
                <h2 className="font-semibold">Delivery Address</h2>
              </div>
              <button className="text-yellow-600">
                <Plus className="w-5 h-5" />
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
                    <span className="font-medium">{addr.type}</span>
                  </div>
                  <p className="text-gray-600 mt-1">{addr.address}</p>
                  <p className="text-gray-500 text-sm">{addr.details}</p>
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
              <button className="text-yellow-600">
                <Plus className="w-5 h-5" />
              </button>
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
                    <span className="text-gray-500">{method.expiry}</span>
                  </div>
                  <p className="text-gray-600 mt-1">{method.details}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Time */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-yellow-600" />
              <h2 className="font-semibold">Delivery Time</h2>
            </div>

            <div className="space-y-3">
              {deliveryTimes.map((slot) => (
                <div
                  key={slot.id}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                    selectedTime === slot.id
                      ? 'border-yellow-400 bg-yellow-50'
                      : 'border-gray-100'
                  }`}
                  onClick={() => setSelectedTime(slot.id)}
                >
                  <span className="font-medium">{slot.time}</span>
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

      {/* Place Order Button - Fixed at bottom with higher z-index */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="bg-white border-t p-4">
          <button className="w-full bg-yellow-400 text-white py-4 rounded-full flex items-center justify-between px-6">
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