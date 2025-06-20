import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, X, Minus } from 'lucide-react';
import lottie from 'lottie-web';
import emptyCartAnimation from '../Assets/animations/empty_cart.json';
import catWaitingAnimation from '../Assets/animations/cat_waiting.json';
import cloudAnimation from '../Assets/animations/cloud.json';

const API_REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;

const ShoppingCart = ({ onClose }) => {
  const [carts, setCarts] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [removingItem, setRemovingItem] = React.useState(null);
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

  // Function to remove a specific item from a cart
  const removeCartItem = async (cartId, shopId, variationId) => {
    const confirmRemove = window.confirm('Are you sure you want to remove this item?');
    if (!confirmRemove) return;

    const token = localStorage.getItem('accessToken');
    if (!token) {
      setError('You need to log in to perform this action.');
      return;
    }

    setRemovingItem(`${cartId}-${variationId}`);

    try {
      // Update cart with quantity 0 to remove the item
      const response = await fetch(`${API_REACT_APP_BASE_URL}/api/carts`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': '*/*'
        },
        body: JSON.stringify({
          shopId: shopId,
          updatedVariations: [{
            variationId: variationId,
            quantity: 0 // Setting quantity to 0 removes the item
          }]
        })
      });

      if (response.ok) {
        // Update local state to reflect the removal
        setCarts(carts.map(cart => {
          if (cart.id === cartId) {
            // Remove the specific item from cartItems
            return {
              ...cart,
              cartItems: cart.cartItems.filter(item => 
                item.productVariation.id !== variationId
              )
            };
          }
          return cart;
        }));
      } else {
        setError('Failed to remove item from cart');
      }
    } catch (err) {
      console.error('Failed to remove item:', err);
      setError('Failed to remove item from cart');
    } finally {
      setRemovingItem(null);
    }
  };

  const calculateCartTotal = (cart) => {
    return cart.cartItems.reduce((sum, item) => {
      return sum + (Number(item.price) * item.quantity);
    }, 0);
  };

  const calculateTotalPrice = () => {
    return carts.reduce((total, cart) => {
      return total + calculateCartTotal(cart);
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
      <div className="fixed inset-0 bg-gradient-to-br from-orange-50 via-white to-yellow-50 z-50 h-screen">
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-500 mx-auto mb-4"></div>
            <div className="text-orange-600 font-medium">🛒 Loading cart details...</div>
          </div>
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
                className="mt-6 px-8 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-2xl hover:from-orange-600 hover:to-yellow-600 font-bold transition-all duration-200 active:scale-95 shadow-lg"
                onClick={() => navigate('/protected_route')}
              >
                🔐 Login
              </button>
            </>
          ) : error === 'No carts found' ? (
            <>
              <div ref={animationContainer} style={{ width: '80vmin', height: '80vmin', maxWidth: '400px', maxHeight: '400px' }} />
              <p className="text-gray-500 mt-4 text-center">You don't have any carts yet.</p>
              <p className="text-gray-400 text-sm mt-2 text-center">Start shopping to create your first cart!</p>
              <button
                className="mt-6 px-8 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-2xl hover:from-orange-600 hover:to-yellow-600 font-bold transition-all duration-200 active:scale-95 shadow-lg"
                onClick={() => navigate('/')}
              >
                🛍️ Browse Products
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
    <div className="fixed inset-0 bg-gradient-to-br from-orange-50 via-white to-yellow-50 z-50">
      {/* Modern Header */}
      <div className="absolute top-0 left-0 right-0 h-[60px] bg-gradient-to-r from-orange-400 via-yellow-400 to-amber-400 border-b flex items-center px-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white drop-shadow-sm">🛒 Shopping Carts</h1>
        </div>
        {onClose && (
          <button 
            onClick={onClose} 
            className="ml-auto p-2 hover:bg-white/20 rounded-xl transition-all duration-200 active:scale-95"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        )}
      </div>

      {/* Scrollable Content - Adjusted to account for bottom nav */}
      <div className="absolute top-[60px] bottom-[140px] left-0 right-0 overflow-y-auto">
        <div className="container mx-auto max-w-4xl p-4">
          {carts.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-orange-200">
                <div ref={animationContainer} className="w-64 h-64" />
                <p className="text-gray-600 mt-4 text-center font-medium">🛒 Shopping cart is empty</p>
                <p className="text-gray-500 text-sm text-center mt-2">Start shopping to add items to your cart!</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {carts.map((cart) => (
                <div key={cart.id} className="bg-white rounded-3xl shadow-xl border-2 border-orange-100 overflow-hidden">
                  <div className="p-6 bg-gradient-to-r from-orange-100 to-yellow-100 border-b border-orange-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-bold text-gray-800 flex items-center">
                          🛒 Cart: {cart.id.slice(0, 8)}...
                        </span>
                        <div className="text-sm bg-orange-200 text-orange-800 px-3 py-1 rounded-full mt-2 w-fit font-medium">
                          Status: {cart.status}
                        </div>
                      </div>
                      <button
                        className="text-red-500 hover:text-red-600 p-3 hover:bg-red-50 rounded-2xl transition-all duration-200 active:scale-95"
                        onClick={() => deleteCart(cart.id)}
                      >
                        <Trash2 className="w-6 h-6" />
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="mb-4 flex justify-between items-center bg-gray-50 rounded-2xl p-4">
                      <span className="text-gray-700 font-semibold flex items-center">
                        🏪 Shop: <span className="text-orange-600 ml-2">{cart.shop.name}</span>
                      </span>
                      <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-lg">
                        📅 {new Date(cart.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {cart.cartItems.length > 0 ? (
                      <div className="space-y-4">
                        {cart.cartItems.map((item) => (
                          <div key={item.id} className="flex justify-between items-center p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl border border-orange-200">
                            <div className="flex-1">
                              <div className="font-bold text-gray-800">
                                🐾 {item.productVariation.name || item.productVariation.material || 'Product'}
                              </div>
                              <div className="text-sm text-gray-600 mt-1">
                                📦 Quantity: <span className="font-medium">{item.quantity}</span>
                              </div>
                              <div className="text-orange-600 font-bold mt-1">
                                💰 ${Number(item.price).toFixed(2)} per item
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-3">
                              <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-4 py-2 rounded-xl font-bold shadow-md">
                                ${(Number(item.price) * item.quantity).toFixed(2)}
                              </div>
                              <button
                                className="text-red-500 hover:text-red-600 px-3 py-2 hover:bg-red-50 rounded-xl flex items-center gap-2 text-sm font-medium transition-all duration-200 active:scale-95"
                                onClick={() => removeCartItem(cart.id, cart.shop.id, item.productVariation.id)}
                                disabled={removingItem === `${cart.id}-${item.productVariation.id}`}
                              >
                                {removingItem === `${cart.id}-${item.productVariation.id}` ? (
                                  <div className="w-4 h-4 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
                                ) : (
                                  <Minus className="w-4 h-4" />
                                )}
                                🗑️ Remove
                              </button>
                            </div>
                          </div>
                        ))}
                        <div className="flex justify-between items-center pt-4 border-t-2 border-orange-200 mt-4">
                          <span className="font-bold text-gray-800 text-lg">🧮 Cart Total:</span>
                          <span className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-6 py-3 rounded-2xl font-bold text-lg shadow-lg">
                            ${calculateCartTotal(cart).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-600 text-center py-6 bg-gray-50 rounded-2xl">
                        <div className="text-4xl mb-2">🛒</div>
                        <p className="font-medium">No items in this cart</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modern Fixed Total Price & Checkout */}
      <div className="fixed bottom-[56px] left-0 right-0 bg-gradient-to-r from-orange-400 via-yellow-400 to-amber-400 border-t-2 border-orange-300 shadow-lg">
        <div className="container mx-auto max-w-4xl px-4 py-4">
          <div className="flex justify-between items-center mb-4 bg-white/90 backdrop-blur-sm rounded-2xl p-4">
            <span className="text-lg font-bold text-gray-800">
              💰 Total Price (All Carts):
            </span>
            <span className="text-2xl font-bold text-orange-600">
              ${calculateTotalPrice().toFixed(2)}
            </span>
          </div>
          <button
            className="w-full h-14 bg-gradient-to-r from-orange-600 to-yellow-600 text-white rounded-2xl font-bold text-lg hover:from-orange-700 hover:to-yellow-700 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
            onClick={handleCheckout}
            disabled={carts.length === 0 || carts.every(cart => cart.cartItems.length === 0)}
          >
            🛒 Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;