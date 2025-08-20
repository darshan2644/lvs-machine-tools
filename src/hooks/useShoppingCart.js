import { useState, useEffect } from 'react';
import axios from 'axios';

export const useShoppingCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getUserId = () => {
    return localStorage.getItem('userId') || 'demo-user-123';
  };

  // Fetch cart items from backend
  const fetchCartItems = async () => {
    try {
      setIsLoading(true);
      const userId = getUserId();
      const response = await axios.get(`http://localhost:5000/api/cart/${userId}`);
      
      if (response.data.success && response.data.items) {
        setCartItems(response.data.items);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async (productId, quantity = 1, price) => {
    try {
      const userId = getUserId();
      const response = await axios.post('http://localhost:5000/api/cart/add', {
        userId,
        productId,
        quantity,
        price
      });

      if (response.data.success) {
        fetchCartItems(); // Refresh cart
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

  // Remove item from cart
  const removeFromCart = async (productId) => {
    try {
      const userId = getUserId();
      const response = await axios.delete(`http://localhost:5000/api/cart/remove`, {
        data: { userId, productId }
      });

      if (response.data.success) {
        fetchCartItems(); // Refresh cart
        window.dispatchEvent(new CustomEvent('cartUpdated'));
        return { success: true };
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
    return { success: false };
  };

  // Update item quantity
  const updateQuantity = async (productId, quantity) => {
    try {
      const userId = getUserId();
      const response = await axios.put('http://localhost:5000/api/cart/update', {
        userId,
        productId,
        quantity
      });

      if (response.data.success) {
        fetchCartItems(); // Refresh cart
        window.dispatchEvent(new CustomEvent('cartUpdated'));
        return { success: true };
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
    return { success: false };
  };

  // Clear all cart items
  const clearCart = async () => {
    try {
      const userId = getUserId();
      const response = await axios.delete(`http://localhost:5000/api/cart/clear/${userId}`);

      if (response.data.success) {
        setCartItems([]);
        window.dispatchEvent(new CustomEvent('cartUpdated'));
        return { success: true };
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
    return { success: false };
  };

  // Calculate total price
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  // Calculate total items
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Load cart items on component mount
  useEffect(() => {
    const loadCart = async () => {
      await fetchCartItems();
    };
    
    loadCart();

    // Listen for cart updates from other components
    const handleCartUpdate = () => {
      fetchCartItems();
    };
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    cartItems,
    isLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
    fetchCartItems
  };
};
