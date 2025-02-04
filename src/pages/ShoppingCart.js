import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, X } from 'lucide-react';
import lottie from 'lottie-web';
import emptyCartAnimation from '../Assets/animations/empty_cart.json';
import catWaitingAnimation from '../Assets/animations/cat_waiting.json';
import cloudAnimation from '../Assets/animations/cloud.json';

const API_REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;

const ShoppingCart = ({ onClose }) => {
  const [carts, setCarts] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const navigate = useNavigate();
  const animationContainer = React.useRef(null);
  const currentAnimation = React.useRef(null);

  const clearCurrentAnimation = () => {
    if (currentAnimation.current) {
      currentAnimation.current.destroy();
      currentAnimation.current = null;
    }
  };

  const playAnimation = (animationData) => {
    clearCurrentAnimation();
    if (animationContainer.current) {
      currentAnimation.current = lottie.loadAnimation({
        container: animationContainer.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData
      });
    }
  };

  React.useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setError('unauthorized');
      setIsLoading(false);
      playAnimation(catWaitingAnimation);
      return;
    }

    const fetchCarts = async () => {
      try {
        const response = await fetch(`${API_REACT_APP_BASE_URL}/api/carts/user`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': '*/*'
          }
        });
        
        if (response.status === 401) {
          setError('unauthorized');
          playAnimation(catWaitingAnimation);
          return;
        }
        
        const data = await response.json();
        
        if (response.ok && Array.isArray(data)) {
          setCarts(data);
        } else if (response.status === 404) {
          setCarts([]);
          setError('No carts found');
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

    return () => clearCurrentAnimation();
  }, []);

  React.useEffect(() => {
    if (isLoading) return;

    if (error === 'Unexpected data format') {
      playAnimation(cloudAnimation);
    } else if (!localStorage.getItem('accessToken')) {
      playAnimation(catWaitingAnimation);
    } else if (carts.length === 0) {
      playAnimation(emptyCartAnimation);
    }
  }, [carts, isLoading, error]);

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
          'Authorization': `Bearer ${token}`,
          'Accept': '*/*'
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
      <div className="fixed inset-0 bg-white z-50 h-screen">
        <div className="h-full flex items-center justify-center">
          <div className="text-yellow-600">Loading cart details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-white z-50 h-screen flex items-center justify-center">
        <div className="w-full max-w-md px-4 flex flex-col items-center">
          {error === 'Unexpected data format' ? (
            <>
              <div ref={animationContainer} style={{ width: '80vmin', height: '80vmin', maxWidth: '400px', maxHeight: '400px' }} />
              <p className="text-gray-500 mt-4 text-center">Unexpected data format. Please contact admin.</p>
            </>
          ) : error === 'unauthorized' ? (
            <>
              <div ref={animationContainer} style={{ width: '80vmin', height: '80vmin', maxWidth: '400px', maxHeight: '400px' }} />
              <p className="text-gray-500 mt-4 text-center">Please log in to view your cart</p>
              <button
                className="mt-4 px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                onClick={() => navigate('/login')}
              >
                Login
              </button>
            </>
          ) : error === 'No carts found' ? (
            <>
              <div ref={animationContainer} style={{ width: '80vmin', height: '80vmin', maxWidth: '400px', maxHeight: '400px' }} />
              <p className="text-gray-500 mt-4 text-center">You don't have any carts yet.</p>
              <p className="text-gray-400 text-sm mt-2 text-center">Start shopping to create your first cart!</p>
              <button
                className="mt-4 px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                onClick={() => navigate('/')}
              >
                Browse Products
              </button>
            </>
          ) : (
            <>
              <div ref={animationContainer} style={{ width: '80vmin', height: '80vmin', maxWidth: '400px', maxHeight: '400px' }} />
              <p className="text-gray-500 mt-4 text-center">{error}</p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-50">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 h-[60px] bg-white border-b flex items-center px-4">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-yellow-600" />
          <h1 className="text-2xl font-semibold">Shopping Carts</h1>
        </div>
        {onClose && (
          <button 
            onClick={onClose} 
            className="ml-auto p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Scrollable Content - Adjusted to account for bottom nav */}
      <div className="absolute top-[60px] bottom-[140px] left-0 right-0 overflow-y-auto">
        <div className="container mx-auto max-w-4xl p-4">
          {carts.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
              <div ref={animationContainer} className="w-64 h-64" />
              <p className="text-gray-500 mt-4">Shopping cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {carts.map((cart) => (
                <div key={cart.id} className="bg-white rounded-xl shadow-sm border">
                  <div className="p-4 border-b">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-medium text-gray-700">
                          Cart ID: {cart.id.slice(0, 8)}...
                        </span>
                        <div className="text-sm text-blue-600 mt-1">
                          Status: {cart.status}
                        </div>
                      </div>
                      <button
                        className="text-red-500 hover:text-red-600 p-2 hover:bg-red-50 rounded-full"
                        onClick={() => deleteCart(cart.id)}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="mb-3 flex justify-between items-center">
                      <span className="text-gray-600">
                        Shop: {cart.shop.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(cart.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {cart.cartItems.length > 0 ? (
                      <div className="space-y-3">
                        {cart.cartItems.map((item) => (
                          <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
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
                      <div className="text-gray-500 text-center py-3">
                        No items in cart
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Fixed Total Price & Checkout - Positioned just above nav bar */}
      <div className="fixed bottom-[56px] left-0 right-0 bg-white border-t">
        <div className="container mx-auto max-w-4xl px-4 py-3">
          <div className="flex justify-between items-center mb-3">
            <span className="text-lg font-medium text-gray-800">
              Total Price (All Carts):
            </span>
            <span className="text-xl font-bold text-yellow-600">
              ${calculateTotalPrice().toFixed(2)}
            </span>
          </div>
          <button
            className="w-full h-12 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleCheckout}
            disabled={carts.length === 0}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;