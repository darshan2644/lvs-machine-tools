import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

// Get user ID from localStorage or use demo user
const getUserId = () => {
  return localStorage.getItem('userId') || 'demo-user-123';
};

// Add product to cart
export const addToCart = async (productId, quantity = 1, price) => {
  try {
    const userId = getUserId();
    const response = await axios.post(`${API_BASE}/cart/add`, {
      userId,
      productId,
      quantity,
      price
    });

    if (response.data.success) {
      // Dispatch cart update event
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      return { success: true, message: 'Product added to cart!' };
    } else {
      return { success: false, message: response.data.message || 'Failed to add product to cart' };
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    return { success: false, message: 'Failed to add product to cart' };
  }
};

// Remove product from cart
export const removeFromCart = async (productId) => {
  try {
    const userId = getUserId();
    const response = await axios.delete(`${API_BASE}/cart/remove`, {
      data: { userId, productId }
    });

    if (response.data.success) {
      return { success: true, message: 'Product removed from cart' };
    } else {
      return { success: false, message: response.data.message || 'Failed to remove product from cart' };
    }
  } catch (error) {
    console.error('Error removing from cart:', error);
    return { success: false, message: 'Failed to remove product from cart' };
  }
};

// Update cart item quantity
export const updateCartQuantity = async (productId, quantity) => {
  try {
    const userId = getUserId();
    const response = await axios.put(`${API_BASE}/cart/update`, {
      userId,
      productId,
      quantity
    });

    if (response.data.success) {
      return { success: true };
    } else {
      return { success: false, message: response.data.message || 'Failed to update quantity' };
    }
  } catch (error) {
    console.error('Error updating cart quantity:', error);
    return { success: false, message: 'Failed to update quantity' };
  }
};

// Get cart items
export const getCartItems = async () => {
  try {
    const userId = getUserId();
    const response = await axios.get(`${API_BASE}/cart/${userId}`);

    if (response.data.success) {
      return { success: true, items: response.data.items || [] };
    } else {
      return { success: false, items: [] };
    }
  } catch (error) {
    console.error('Error fetching cart items:', error);
    return { success: false, items: [] };
  }
};

// Clear cart
export const clearCart = async () => {
  try {
    const userId = getUserId();
    const response = await axios.delete(`${API_BASE}/cart/clear/${userId}`);

    if (response.data.success) {
      return { success: true, message: 'Cart cleared successfully' };
    } else {
      return { success: false, message: response.data.message || 'Failed to clear cart' };
    }
  } catch (error) {
    console.error('Error clearing cart:', error);
    return { success: false, message: 'Failed to clear cart' };
  }
};

// Buy now function
export const buyNow = async (productId, quantity = 1, price) => {
  try {
    const userId = getUserId();
    const response = await axios.post(`${API_BASE}/orders/buynow`, {
      userId,
      productId,
      quantity,
      price
    });

    if (response.data.success) {
      return { 
        success: true, 
        orderId: response.data.orderId,
        razorpayOrderId: response.data.razorpayOrderId
      };
    } else {
      return { success: false, message: response.data.message || 'Failed to create order' };
    }
  } catch (error) {
    console.error('Error in buy now:', error);
    return { success: false, message: 'Failed to create order' };
  }
};

// Place order from cart
export const placeOrder = async (paymentMethod = 'cod') => {
  try {
    const userId = getUserId();
    const cartResponse = await getCartItems();
    
    if (!cartResponse.success || cartResponse.items.length === 0) {
      return { success: false, message: 'Cart is empty' };
    }

    const orderData = {
      userId,
      items: cartResponse.items.map(item => ({
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.price
      })),
      paymentMethod
    };

    const response = await axios.post(`${API_BASE}/orders/place`, orderData);

    if (response.data.success) {
      return { 
        success: true, 
        orderId: response.data.orderId,
        razorpayOrderId: response.data.razorpayOrderId
      };
    } else {
      return { success: false, message: response.data.message || 'Failed to place order' };
    }
  } catch (error) {
    console.error('Error placing order:', error);
    return { success: false, message: 'Failed to place order' };
  }
};

// Get cart count
export const getCartCount = async () => {
  try {
    const cartResponse = await getCartItems();
    if (cartResponse.success) {
      return cartResponse.items.reduce((total, item) => total + item.quantity, 0);
    }
    return 0;
  } catch (error) {
    console.error('Error getting cart count:', error);
    return 0;
  }
};
