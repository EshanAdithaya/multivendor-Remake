import React, { useState, useEffect } from 'react';
import { ChevronLeft, MapPin, CreditCard, Clock, Plus, ShoppingBag, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import loadingAnimation from '../Assets/animations/loading.json';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [selectedAddress, setSelectedAddress] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [carts, setCarts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const API_REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;

  const paymentMethods = [
    {
      id: 0,
      type: 'Cash On Delivery',
      details: 'Cash on delivery (Currently Unavailable)',
      expiry: '',
      disabled: true
    },
    {
      id: 1,
      type: 'Pawsome Points',
      details: 'Buy using Pawsome points (Currently Unavailable)',
      expiry: '',
      disabled: true
    },
    {
      id: 2,
      type: 'bank_transfer',
      details: 'BANK_TRANSFER',
      expiry: '',
      disabled: true
    },
    {
      id: 3,
      type: 'stripe',
      details: 'Pay with Credit/Debit Card via Stripe',
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

  const handleApplyCoupon = async () => {
    if (!couponCode) {
      setCouponError('Please enter a coupon code');
      return;
    }

    try {
      const response = await fetch(`${API_REACT_APP_BASE_URL}/api/coupons/coupon-name/${couponCode}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Invalid coupon code');
      }

      const couponData = await response.json();
      
      // Check if coupon is expired
      if (new Date(couponData.expiresAt) < new Date()) {
        setCouponError('This coupon has expired');
        return;
      }

      setAppliedCoupon(couponData);
      setCouponError('');
    } catch (err) {
      setCouponError('Invalid coupon code');
      setAppliedCoupon(null);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  const calculateTotal = () => {
    let subtotal = carts.reduce((total, cart) => {
      return total + cart.cartItems.reduce((cartTotal, item) => {
        return cartTotal + (Number(item.price) * item.quantity);
      }, 0);
    }, 0);

    const delivery = 2.00;
    const tax = subtotal * 0.1; // 10% tax

    let discount = 0;
    if (appliedCoupon) {
      if (appliedCoupon.type === 'fixed') {
        discount = Number(appliedCoupon.value);
      } else if (appliedCoupon.type === 'percentage') {
        discount = (subtotal * Number(appliedCoupon.value)) / 100;
      }
    }

    const total = subtotal + delivery + tax - discount;

    return {
      subtotal,
      delivery,
      tax,
      discount,
      total
    };
  };

  const handlePlaceOrder = async () => {
    if (calculateTotal().subtotal <= 0) {
      setError('Cannot place order with empty cart');
      return;
    }

    if (!selectedAddress) {
      setError('Please select a delivery address');
      return;
    }

    setIsProcessing(true);
    const token = localStorage.getItem('accessToken');
    
    try {
      // Validate coupon if present
      if (appliedCoupon) {
        const couponResponse = await fetch(`${API_REACT_APP_BASE_URL}/api/coupons/coupon-name/${appliedCoupon.code}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!couponResponse.ok || new Date(appliedCoupon.expiresAt) < new Date()) {
          setAppliedCoupon(null);
          setCouponError('Coupon is no longer valid');
          setIsProcessing(false);
          return;
        }
      }

      // Create bulk checkout order data structure
      const bulkOrderData = {
        orders: carts.map(cart => ({
          status: "pending",
          paymentStatus: "pending",
          paymentMethod: paymentMethods[selectedPayment].type.toLowerCase(),
          transactionId: `txn_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
          billingAddressId: selectedAddress,
          shippingAddressId: selectedAddress,
          shopId: cart.shop.id,
          shippingStatus: "pending",
          shippingMethod: "standard",
          ...(appliedCoupon && { couponId: appliedCoupon.id }),
          items: cart.cartItems.map(item => ({
            productVariationId: item.productVariation.id,
            quantity: item.quantity
          }))
        }))
      };

      // Handle Stripe payment differently
      if (paymentMethods[selectedPayment].type === 'stripe') {
        await handleStripeCheckout();
      } else {
        // For non-Stripe payments, use the existing flow
        const response = await fetch(`${API_REACT_APP_BASE_URL}/api/bulk-checkout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(bulkOrderData)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to process orders');
        }

        const responseData = await response.json();
        
        if (responseData.success && responseData.data && responseData.data.length > 0) {
          navigate(`/order-success?key=${responseData.data[0].orderId}`, {
            state: {
              orderId: responseData.data[0].orderId,
              allOrders: responseData.data,
              partialSuccess: responseData.data.length < bulkOrderData.orders.length
            }
          });
        } else {
          throw new Error(responseData.message || 'No orders were created');
        }
      }
    } catch (err) {
      setError(`Failed to process your order: ${err.message}`);
      console.error('Checkout error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // UPDATED: Enhanced Stripe checkout function
  // const handleStripeCheckout = async () => {
  //   try {
  //     console.log('Starting Stripe checkout process...');
      
  //     const orderSummary = calculateTotal();
      
  //     // Prepare line items from cart data with better product descriptions
  //     const cartLineItems = [];
      
  //     // Add individual cart items
  //     carts.forEach(cart => {
  //       cart.cartItems.forEach(item => {
  //         cartLineItems.push({
  //           price_data: {
  //             currency: 'usd',
  //             product_data: {
  //               name: item.productVariation.material || 'Product',
  //               description: `${item.productVariation.material || 'Product'} from ${cart.shop.name}`,
  //             },
  //             unit_amount: Math.round(Number(item.price) * 100), // Convert to cents
  //           },
  //           quantity: item.quantity,
  //         });
  //       });
  //     });

  //     // Add delivery fee
  //     cartLineItems.push({
  //       price_data: {
  //         currency: 'usd',
  //         product_data: {
  //           name: 'Delivery Fee',
  //           description: 'Standard delivery service',
  //         },
  //         unit_amount: Math.round(orderSummary.delivery * 100),
  //       },
  //       quantity: 1,
  //     });

  //     // Add tax
  //     cartLineItems.push({
  //       price_data: {
  //         currency: 'usd',
  //         product_data: {
  //           name: 'Tax',
  //           description: 'Sales tax (10%)',
  //         },
  //         unit_amount: Math.round(orderSummary.tax * 100),
  //       },
  //       quantity: 1,
  //     });

  //     // Add discount as negative amount if applicable
  //     if (orderSummary.discount > 0) {
  //       cartLineItems.push({
  //         price_data: {
  //           currency: 'usd',
  //           product_data: {
  //             name: 'Discount',
  //             description: appliedCoupon?.code ? `Coupon: ${appliedCoupon.code}` : 'Discount Applied',
  //           },
  //           unit_amount: -Math.round(orderSummary.discount * 100), // Negative for discount
  //         },
  //         quantity: 1,
  //       });
  //     }

  //     console.log('Line items prepared:', cartLineItems);

  //     // Validate line items
  //     const invalidItems = cartLineItems.filter(item => 
  //       !item.price_data.product_data || 
  //       !item.price_data.product_data.name ||
  //       typeof item.price_data.unit_amount !== 'number' ||
  //       typeof item.quantity !== 'number'
  //     );

  //     if (invalidItems.length > 0) {
  //       console.error('Invalid line items found:', invalidItems);
  //       throw new Error('Invalid product data detected');
  //     }

  //     // Call your backend to create checkout session
  //     const response = await fetch(`${API_REACT_APP_BASE_URL}/api/payments/create-checkout-session`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
  //       },
  //       body: JSON.stringify({
  //         lineItems: cartLineItems,
  //         orderId: `order-${Date.now()}`,
  //         customerId: 'customer-checkout', // This will be overridden by backend
  //       }),
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       console.error('Stripe API Error:', errorData);
        
  //       // Handle specific validation errors
  //       if (errorData.message && Array.isArray(errorData.message)) {
  //         throw new Error(`Validation failed: ${errorData.message.join(', ')}`);
  //       }
        
  //       throw new Error(errorData.message || 'Failed to create checkout session');
  //     }

  //     const { url, sessionId } = await response.json();
      
  //     console.log('Checkout session created:', sessionId);
  //     console.log('Redirecting to Stripe:', url);
      
  //     // Redirect to Stripe's checkout page
  //     window.location.href = url;
      
  //   } catch (error) {
  //     console.error('Stripe checkout error:', error);
  //     setError(`Stripe checkout failed: ${error.message}`);
  //     setIsProcessing(false);
  //   }
  // };

// COMBINED SOLUTION: Create order first + Send real product names
const handleStripeCheckout = async () => {
  try {
    console.log('Starting Stripe checkout process...');
    
    const token = localStorage.getItem('accessToken');
    const orderSummary = calculateTotal();
    
    // STEP 1: Create the actual order in your database first
    console.log('Creating order in database before Stripe checkout...');
    
    const bulkOrderData = {
      orders: carts.map(cart => ({
        status: "pending",
        paymentStatus: "pending", // Will be updated after Stripe payment
        paymentMethod: "stripe",
        transactionId: null, // Will be updated after Stripe payment
        billingAddressId: selectedAddress,
        shippingAddressId: selectedAddress,
        shopId: cart.shop.id,
        shippingStatus: "pending",
        shippingMethod: "standard",
        ...(appliedCoupon && { couponId: appliedCoupon.id }),
        items: cart.cartItems.map(item => ({
          productVariationId: item.productVariation.id,
          quantity: item.quantity
        }))
      }))
    };

    // Create the orders in your database
    const orderResponse = await fetch(`${API_REACT_APP_BASE_URL}/api/bulk-checkout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bulkOrderData)
    });

    if (!orderResponse.ok) {
      const errorData = await orderResponse.json();
      throw new Error(errorData.message || 'Failed to create orders');
    }

    const orderResponseData = await orderResponse.json();
    
    if (!orderResponseData.success || !orderResponseData.data || orderResponseData.data.length === 0) {
      throw new Error('No orders were created');
    }

    // Use the first order's ID for Stripe (or combine all if multiple)
    const primaryOrder = orderResponseData.data[0];
    console.log('Order created successfully:', primaryOrder.orderId);

    // STEP 2: Prepare line items for Stripe with REAL product names
    const cartLineItems = [];
    
    // Add individual cart items with actual product details
    carts.forEach(cart => {
      cart.cartItems.forEach(item => {
        // Use actual product information from your cart
        const productName = item.productVariation.product?.name || 
                           item.productVariation.material || 
                           item.productVariation.name || 
                           'Product'; // fallback only if all else fails
        
        const productDescription = `${productName} from ${cart.shop.name}` + 
                                 (item.productVariation.material ? ` - ${item.productVariation.material}` : '') +
                                 (item.productVariation.color ? ` (${item.productVariation.color})` : '') +
                                 (item.productVariation.size ? ` - Size: ${item.productVariation.size}` : '');

        cartLineItems.push({
          price_data: {
            currency: 'usd',
            product_data: {
              name: productName, // REAL product name
              description: productDescription, // Detailed description
            },
            unit_amount: Math.round(Number(item.price) * 100),
          },
          quantity: item.quantity,
        });
        
        console.log(`Added product: ${productName} - $${item.price} x ${item.quantity}`);
      });
    });

    // Add delivery fee (this one is correct to be generic)
    cartLineItems.push({
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Delivery Fee',
          description: 'Standard delivery service',
        },
        unit_amount: Math.round(orderSummary.delivery * 100),
      },
      quantity: 1,
    });

    // Add tax (this one is correct to be generic)
    cartLineItems.push({
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Tax',
          description: 'Sales tax (10%)',
        },
        unit_amount: Math.round(orderSummary.tax * 100),
      },
      quantity: 1,
    });

    // Add discount if applicable (this one is correct to be generic)
    if (orderSummary.discount > 0) {
      cartLineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Discount',
            description: appliedCoupon?.code ? `Coupon: ${appliedCoupon.code}` : 'Discount Applied',
          },
          unit_amount: -Math.round(orderSummary.discount * 100),
        },
        quantity: 1,
      });
    }

    console.log('Line items with real product names prepared:', cartLineItems);

    // STEP 3: Create Stripe checkout session with the real order ID
    const stripeResponse = await fetch(`${API_REACT_APP_BASE_URL}/api/payments/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        lineItems: cartLineItems,
        orderId: primaryOrder.orderId, // Use the real order ID from database
        customerId: 'customer-checkout', // This will be overridden by backend
      }),
    });

    if (!stripeResponse.ok) {
      const errorData = await stripeResponse.json();
      console.error('Stripe API Error:', errorData);
      
      // If Stripe fails, you might want to update the order status to failed
      console.log('Stripe checkout failed, order was created but payment failed');
      
      if (errorData.message && Array.isArray(errorData.message)) {
        throw new Error(`Validation failed: ${errorData.message.join(', ')}`);
      }
      
      throw new Error(errorData.message || 'Failed to create checkout session');
    }

    const { url, sessionId } = await stripeResponse.json();
    
    console.log('Checkout session created:', sessionId);
    console.log('Redirecting to Stripe with real order ID:', primaryOrder.orderId);
    console.log('Products will show real names in Stripe dashboard');
    
    // STEP 4: Redirect to Stripe's checkout page
    window.location.href = url;
    
  } catch (error) {
    console.error('Stripe checkout error:', error);
    setError(`Stripe checkout failed: ${error.message}`);
    setIsProcessing(false);
  }
};

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
        <div className="text-center">
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-orange-200">
            <Lottie
              animationData={loadingAnimation}
              loop={true}
              style={{ width: 200, height: 200 }}
            />
            <p className="text-gray-600 font-medium mt-4">🛒 Loading checkout...</p>
          </div>
        </div>
      </div>
    );
  }

  const orderSummary = calculateTotal();

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      {/* Modern Header */}
      <div className="bg-gradient-to-r from-orange-400 via-yellow-400 to-amber-400 p-4 border-b shadow-lg flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 active:scale-95">
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-xl font-bold text-white drop-shadow-sm">🛒 Checkout</h1>
      </div>

      {/* Modern Error message */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 text-red-700 p-4 mx-4 my-2 rounded-2xl shadow-md">
          <div className="flex items-start gap-2">
            <span className="text-xl">⚠️</span>
            <div className="flex-1">
              <p className="font-medium">{error}</p>
              <button 
                className="text-sm bg-red-200 hover:bg-red-300 px-3 py-1 rounded-lg mt-2 transition-colors duration-200" 
                onClick={() => setError(null)}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="max-w-lg mx-auto p-4 space-y-6">
          {/* Modern Cart Items */}
          <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-orange-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-orange-100 to-yellow-100 p-3 rounded-2xl">
                <ShoppingBag className="w-5 h-5 text-orange-600" />
              </div>
              <h2 className="font-bold text-gray-800">🛒 Your Items</h2>
            </div>
            
            {carts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-6xl mb-4">🛒</div>
                <p className="font-medium">Your cart is empty</p>
              </div>
            ) : (
              carts.map((cart) => (
                <div key={cart.id} className="mb-6">
                  <div className="bg-gradient-to-r from-orange-100 to-yellow-100 p-4 rounded-2xl mb-3 border border-orange-200">
                    <div className="font-bold text-orange-800 flex items-center">
                      🏪 {cart.shop.name}
                    </div>
                  </div>
                  {cart.cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl mb-3 border border-orange-200">
                      <div>
                        <div className="font-bold text-gray-800">🐾 {item.productVariation.material}</div>
                        <div className="text-sm text-gray-600">📦 Quantity: <span className="font-medium">{item.quantity}</span></div>
                      </div>
                      <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-4 py-2 rounded-xl font-bold shadow-md">${Number(item.price).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>

          {/* Modern Delivery Address */}
          <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-orange-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-orange-100 to-yellow-100 p-3 rounded-2xl">
                  <MapPin className="w-5 h-5 text-orange-600" />
                </div>
                <h2 className="font-bold text-gray-800">📦 Delivery Address</h2>
              </div>
              <a href='/address' className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white p-3 rounded-2xl hover:from-orange-600 hover:to-yellow-600 transition-all duration-200 active:scale-95 shadow-lg">
                <Plus className="w-5 h-5" />
              </a>
            </div>
            
            <div className="space-y-4">
              {addresses.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-6xl mb-4">🏠</div>
                  <p className="font-medium mb-4">No addresses found.</p>
                  <a 
                    href="/address" 
                    className="inline-block bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-6 py-3 rounded-2xl font-bold hover:from-orange-600 hover:to-yellow-600 transition-all duration-200 active:scale-95 shadow-lg"
                  >
                    🏠 Add a new address
                  </a>
                </div>
              ) : (
                addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 active:scale-98 ${
                      selectedAddress === addr.id
                        ? 'border-orange-400 bg-gradient-to-r from-orange-50 to-yellow-50 shadow-md'
                        : 'border-gray-200 hover:border-orange-300 bg-white hover:shadow-md'
                    }`}
                    onClick={() => setSelectedAddress(addr.id)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-800">🏠 {addr.city}</span>
                    </div>
                    <p className="text-gray-600 mt-2">📍 {addr.street}</p>
                    <p className="text-gray-500 text-sm mt-1">{addr.state}, {addr.postalCode}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Modern Payment Method */}
          <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-orange-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-orange-100 to-yellow-100 p-3 rounded-2xl">
                  <CreditCard className="w-5 h-5 text-orange-600" />
                </div>
                <h2 className="font-bold text-gray-800">💳 Payment Method</h2>
              </div>
            </div>

            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`p-4 rounded-2xl border-2 transition-all duration-200 ${
                    selectedPayment === method.id
                      ? 'border-orange-400 bg-gradient-to-r from-orange-50 to-yellow-50 shadow-md'
                      : 'border-gray-200 hover:border-orange-300 bg-white'
                  } ${method.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-md active:scale-98'}`}
                  onClick={() => !method.disabled && setSelectedPayment(method.id)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-800">💳 {method.type}</span>
                    {method.disabled && <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-lg font-medium">Unavailable</span>}
                  </div>
                  <p className="text-gray-600 mt-2">{method.details}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Modern Coupon Section */}
          <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-orange-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-orange-100 to-yellow-100 p-3 rounded-2xl">
                <Tag className="w-5 h-5 text-orange-600" />
              </div>
              <h2 className="font-bold text-gray-800">🏷️ Apply Coupon</h2>
            </div>
            
            {appliedCoupon ? (
              <div className="flex items-center justify-between bg-gradient-to-r from-green-100 to-emerald-100 p-4 rounded-2xl border-2 border-green-200">
                <div>
                  <p className="font-bold text-green-800 flex items-center">🎉 {appliedCoupon.code}</p>
                  <p className="text-sm text-green-700 mt-1">
                    {appliedCoupon.type === 'fixed' 
                      ? `💰 $${appliedCoupon.value} off` 
                      : `📉 ${appliedCoupon.value}% off`}
                  </p>
                </div>
                <button 
                  onClick={removeCoupon}
                  className="bg-red-100 hover:bg-red-200 text-red-600 px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200"
                >
                  🗑️ Remove
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="🏷️ Enter coupon code"
                    className="flex-1 px-4 py-3 border-2 border-orange-200 rounded-2xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-2xl hover:from-orange-600 hover:to-yellow-600 font-bold transition-all duration-200 active:scale-95 shadow-lg"
                  >
                    Apply
                  </button>
                </div>
                {couponError && (
                  <p className="text-red-600 text-sm bg-red-50 p-3 rounded-xl border border-red-200">⚠️ {couponError}</p>
                )}
              </div>
            )}
          </div>

          {/* Modern Order Summary */}
          <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-orange-100">
            <h2 className="font-bold text-gray-800 mb-6 flex items-center">
              🧾 Order Summary
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between text-gray-600 bg-gray-50 p-3 rounded-xl">
                <span>💰 Subtotal</span>
                <span className="font-semibold">${orderSummary.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 bg-gray-50 p-3 rounded-xl">
                <span>🚚 Delivery Fee</span>
                <span className="font-semibold">${orderSummary.delivery.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 bg-gray-50 p-3 rounded-xl">
                <span>📄 Tax</span>
                <span className="font-semibold">${orderSummary.tax.toFixed(2)}</span>
              </div>
              {orderSummary.discount > 0 && (
                <div className="flex justify-between text-green-600 bg-green-50 p-3 rounded-xl border border-green-200">
                  <span>🎉 Discount</span>
                  <span className="font-bold">-${orderSummary.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-xl pt-4 border-t-2 border-orange-200 bg-gradient-to-r from-orange-100 to-yellow-100 p-4 rounded-2xl">
                <span className="text-gray-800">💳 Total</span>
                <span className="text-orange-600">${orderSummary.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Place Order Button */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="bg-gradient-to-r from-orange-400 via-yellow-400 to-amber-400 border-t-2 border-orange-300 p-4 shadow-lg">
          <button 
            onClick={handlePlaceOrder}
            disabled={!selectedAddress || orderSummary.subtotal <= 0 || isProcessing} 
            className={`w-full py-4 rounded-2xl flex items-center justify-between px-6 transition-all duration-200 active:scale-95 shadow-xl
                      ${isProcessing ? 'bg-gray-500' : 'bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700'} 
                      text-white disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <span className="text-lg font-bold flex items-center">
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mr-3"></div>
                  Processing...
                </>
              ) : (
                '🛒 Place Order'
              )}
            </span>
            <span className="bg-white/90 backdrop-blur-sm text-orange-600 px-6 py-3 rounded-xl font-bold shadow-md">
              ${orderSummary.total.toFixed(2)}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;