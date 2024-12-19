import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import Navbar from '../components/Navbar';

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Sticks', price: 1.60, quantity: 1, weight: '1lb', image: '/api/placeholder/60/60' },
    { id: 2, name: 'Dried Tuna', price: 0.60, quantity: 1, weight: '2Pfund', image: '/api/placeholder/60/60' },
    { id: 3, name: 'Loem ipsum', price: 2.20, quantity: 1, weight: '1lb', image: '/api/placeholder/60/60' },
    { id: 4, name: 'Lore', price: 3.50, quantity: 1, weight: '1lb', image: '/api/placeholder/60/60' }
  ]);

  const updateQuantity = (id, change) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cartItems.length;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-yellow-600" />
          <span className="text-lg font-medium">{totalItems} Items</span>
        </div>
        <button className="p-2 rounded-full bg-gray-100">
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-auto">
        {cartItems.map(item => (
          <div key={item.id} className="p-4 border-b flex items-center gap-4">
            {/* Quantity Controls */}
            <div className="flex flex-col items-center bg-gray-100 rounded-full">
              <button
                className="p-2"
                onClick={() => updateQuantity(item.id, 1)}
              >
                <Plus className="w-4 h-4" />
              </button>
              <span className="py-1">{item.quantity}</span>
              <button
                className="p-2"
                onClick={() => updateQuantity(item.id, -1)}
              >
                <Minus className="w-4 h-4" />
              </button>
            </div>

            {/* Product Info */}
            <div className="flex-1 flex gap-3">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-yellow-600">${item.price.toFixed(2)}</p>
                <p className="text-gray-500 text-sm">
                  {item.quantity} X {item.weight}
                </p>
              </div>
              <div className="flex items-start gap-4">
                <span className="font-medium">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-gray-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Checkout Button */}
      <div className="p-4">
        <button className="w-full bg-yellow-400 text-white py-4 rounded-full flex items-center justify-between px-6">
          <span className="text-lg font-medium">Checkout</span>
          <span className="bg-white text-yellow-400 px-4 py-2 rounded-full font-medium">
            ${totalAmount.toFixed(2)}
          </span>
        </button>
      </div>
      <Navbar />
    </div>
  );
};

export default ShoppingCart;