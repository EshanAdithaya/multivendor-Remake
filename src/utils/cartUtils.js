// Check if user is authenticated
export const checkAuth = () => {
    const token = localStorage.getItem('token');
    return !!token;
  };
  
  // Get auth token
  export const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };
  
  // Handle cart operations
  export const handleCartOperation = async (product, quantity = 1) => {
    try {
      if (!checkAuth()) {
        throw new Error('Please login to add items to cart');
      }
  
      if (!product.__shop__?.id) {
        throw new Error('Shop information not found');
      }
  
      // Check for existing cart
      const userCartsResponse = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/carts/user`,
        { headers: getAuthHeader() }
      );
  
      let existingCart = null;
      if (userCartsResponse.status === 200) {
        const userCarts = await userCartsResponse.json();
        existingCart = userCarts.find(cart => cart.shopId === product.__shop__.id);
      }
  
      // Prepare variation data
      const variationData = {
        variationId: product.id,
        quantity: quantity
      };
  
      if (!existingCart) {
        // Create new cart
        const createResponse = await fetch(
          `${process.env.REACT_APP_BASE_URL}/api/carts`,
          {
            method: 'POST',
            headers: getAuthHeader(),
            body: JSON.stringify({
              shopId: product.__shop__.id,
              productVariations: [variationData]
            })
          }
        );
  
        if (!createResponse.ok) {
          throw new Error('Failed to create cart');
        }
      } else {
        // Update existing cart
        const updateResponse = await fetch(
          `${process.env.REACT_APP_BASE_URL}/api/carts`,
          {
            method: 'PATCH',
            headers: getAuthHeader(),
            body: JSON.stringify({
              shopId: product.__shop__.id,
              updatedVariations: [variationData]
            })
          }
        );
  
        if (!updateResponse.ok) {
          throw new Error('Failed to update cart');
        }
      }
  
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Failed to add item to cart' 
      };
    }
  };