// Authentication utilities
export const checkAuth = async () => {
  console.log('🔒 Checking authentication status...');
  const token = localStorage.getItem('accessToken');
  
  if (!token) {
    console.log('❌ No token found');
    return false;
  }

  try {
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': '*/*'
      }
    });

    if (!response.ok) {
      console.log('❌ Auth check failed:', response.status);
      localStorage.removeItem('accessToken'); // Clear invalid token
      return false;
    }

    const userData = await response.json();
    console.log('✅ User authenticated:', userData.email);
    return true;
  } catch (error) {
    console.error('❌ Auth check error:', error);
    return false;
  }
};

// Get authentication headers
export const getAuthHeader = () => {
  const token = localStorage.getItem('accessToken');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Accept': '*/*'
  };
};

// Handle cart operations
export const handleCartOperation = async (product, quantity = 1) => {
  console.log('🛒 Starting cart operation...', { product, quantity });
  
  try {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
      console.log('❌ Authentication check failed');
      throw new Error('Please login to add items to cart');
    }

    // Safely access shop information
    const shopId = product.__shop__?.id || 
                  product.shop?.id || 
                  product.shopId;

    if (!shopId) {
      console.log('❌ Shop information missing from product:', product);
      throw new Error('Shop information not found');
    }

    // Check for existing cart
    console.log('🔍 Checking for existing cart...');
    const userCartsResponse = await fetch(
      `${process.env.REACT_APP_BASE_URL}/api/carts/user`,
      { headers: getAuthHeader() }
    );

    let existingCart = null;
    if (userCartsResponse.status === 200) {
      const userCarts = await userCartsResponse.json();
      console.log('📦 User carts:', userCarts);
      existingCart = userCarts.find(cart => cart.shopId === shopId);
    }

    // Prepare variation data
    const variationData = {
      variationId: product.id,
      quantity: quantity,
      price: product.price,
      name: product.name || '',
      imageUrl: product.imageUrl || product.image?.url || '',
      size: product.size,
      color: product.color,
      material: product.material,
      sku: product.sku,
      weight: product.weight
    };

    console.log('📝 Prepared variation data:', variationData);

    if (!existingCart) {
      // Create new cart
      console.log('🆕 Creating new cart for shop:', shopId);
      const createResponse = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/carts`,
        {
          method: 'POST',
          headers: getAuthHeader(),
          body: JSON.stringify({
            shopId: shopId,
            productVariations: [variationData]
          })
        }
      );

      if (!createResponse.ok) {
        const errorData = await createResponse.json().catch(() => ({}));
        console.error('❌ Create cart failed:', errorData);
        throw new Error(errorData.message || 'Failed to create cart');
      }

      const createResult = await createResponse.json();
      console.log('✅ Cart created successfully:', createResult);
    } else {
      // Update existing cart
      console.log('🔄 Updating existing cart for shop:', shopId);
      const currentQuantity = existingCart.cartItems.find(
        item => item.productVariation.id === product.id
      )?.quantity || 0;

      const updateResponse = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/carts`,
        {
          method: 'PATCH',
          headers: getAuthHeader(),
          body: JSON.stringify({
            shopId: shopId,
            updatedVariations: [{
              variationId: product.id,
              quantity: currentQuantity + quantity
            }]
          })
        }
      );

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json().catch(() => ({}));
        console.error('❌ Update cart failed:', errorData);
        throw new Error(errorData.message || 'Failed to update cart');
      }

      const updateResult = await updateResponse.json();
      console.log('✅ Cart updated successfully:', updateResult);
    }

    return { 
      success: true,
      message: 'Item added to cart successfully'
    };
  } catch (error) {
    console.error('❌ Cart operation failed:', error);
    return {
      success: false,
      error: error.message || 'Failed to add item to cart'
    };
  }
};

// Save current URL for redirect after login
export const saveCurrentUrl = () => {
  const currentPath = window.location.pathname + window.location.search;
  console.log('💾 Saving current URL for redirect:', currentPath);
  localStorage.setItem('redirectUrl', currentPath);
};

// Handle redirect to login
export const redirectToLogin = (navigate) => {
  console.log('🔄 Redirecting to login...');
  saveCurrentUrl();
  navigate('/protected_route');
};