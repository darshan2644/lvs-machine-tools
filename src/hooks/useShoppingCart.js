import { useState, useEffect } from 'react';

// Custom hook for shopping cart functionality
export const useShoppingCart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('lvsCart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }

    // Listen for cart updates
    const handleStorageChange = () => {
      const savedCart = localStorage.getItem('lvsCart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Global function to add items to cart from anywhere in the app
  const addToCart = (product) => {
    const event = new CustomEvent('addToCart', { detail: product });
    window.dispatchEvent(event);
  };

  // Update item quantity
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }

    const updatedItems = cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedItems);
    localStorage.setItem('lvsCart', JSON.stringify(updatedItems));
  };

  // Remove item from cart
  const removeFromCart = (id) => {
    const updatedItems = cartItems.filter(item => item.id !== id);
    setCartItems(updatedItems);
    localStorage.setItem('lvsCart', JSON.stringify(updatedItems));
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('lvsCart');
  };

  // Get total items count
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Get total price
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Check if item is in cart
  const isItemInCart = (id) => {
    return cartItems.some(item => item.id === id);
  };

  // Get item quantity
  const getItemQuantity = (id) => {
    const item = cartItems.find(item => item.id === id);
    return item ? item.quantity : 0;
  };

  return { 
    cartItems, 
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalItems, 
    getTotalPrice,
    isItemInCart,
    getItemQuantity
  };
};

// Utility function to create a product object
export const createProduct = (id, name, price, image, category = 'Machine Tools', brand = 'LVS') => {
  return {
    id,
    name,
    price,
    image,
    category,
    brand
  };
};
