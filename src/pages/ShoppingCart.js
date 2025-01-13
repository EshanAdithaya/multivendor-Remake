import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2 } from 'lucide-react';

const API_REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;

const ShoppingCart = ({ onClose }) => {
  const [carts, setCarts] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setError('You need to log in to see this page.');
      setIsLoading(false);
      return;
    }

    const fetchCarts = async () => {
      try {
        const response = await fetch(`${API_REACT_APP_BASE_URL}/api/carts/user`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (Array.isArray(data)) {
          setCarts(data);
        } else {
          setError('Unexpected data format');
        }
      } catch (err) {
        setError('Failed to fetch cart data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCarts();
  }, []);

  const deleteCart = async (cartId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this cart?');
    if (!confirmDelete) return;

    const token = localStorage.getItem('accessToken');
    if (!token) {
      setError('You need to log in to perform this action.');
      return;
    }

    try {
      const response = await fetch(`${API_REACT_APP_BASE_URL}/api/carts/${cartId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setCarts(carts.filter(cart => cart.id !== cartId));
      } else {
        setError('Failed to delete cart');
      }
    } catch (err) {
      setError('Failed to delete cart');
    }
  };

  const calculateTotalPrice = () => {
    return carts.reduce((total, cart) => {
      const cartTotal = cart.cartItems.reduce((sum, item) => {
        return sum + (Number(item.price) * item.quantity);
      }, 0);
      return total + cartTotal;
    }, 0);
  };

  const handleCheckout = () => {
    if (onClose) {
      onClose();
    }
    navigate('/checkout');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-yellow-600">Loading cart details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        {error}
        {!localStorage.getItem('accessToken') && (
          <button
            className="ml-4 px-4 py-2 bg-yellow-600 text-white rounded"
            onClick={() => navigate('/login')}
          >
            Login
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mb-6 flex items-center gap-2">
        <ShoppingBag className="w-6 h-6 text-yellow-600" />
        <h1 className="text-2xl font-semibold">Shopping Carts</h1>
      </div>

      {carts.map((cart) => (
        <div key={cart.id} className="mb-6 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Cart ID: {cart.id.slice(0, 8)}...</span>
              <span className="text-sm text-gray-500">
                {new Date(cart.createdAt).toLocaleDateString()}
              </span>
              <button
                className="text-red-500"
                onClick={() => deleteCart(cart.id)}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              <div className="text-sm text-gray-500">Status: {cart.status}</div>
              <div className="text-sm">Shop: {cart.shop.name}</div>
              
              {cart.cartItems.length > 0 ? (
                <div className="space-y-4">
                  {cart.cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">
                          {item.productVariation.material || 'Product'}
                        </div>
                        <div className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </div>
                      </div>
                      <div className="text-yellow-600 font-medium">
                        ${Number(item.price).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-center py-4">
                  No items in cart
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      <div className="mt-8 bg-white rounded-lg shadow-md">
        <div className="p-6">
          <div className="flex justify-between items-center text-lg font-semibold">
            <span>Total Price (All Carts):</span>
            <span className="text-yellow-600">${calculateTotalPrice().toFixed(2)}</span>
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <button
          className="px-4 py-2 bg-yellow-600 text-white rounded"
          onClick={handleCheckout}
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default ShoppingCart;