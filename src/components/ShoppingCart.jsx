import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ShoppingCart.css';

const ShoppingCart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('lvsCart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }

    // Listen for global addToCart events
    const handleAddToCart = (event) => {
      const product = event.detail;
      addToCartHandler(product);
    };

    window.addEventListener('addToCart', handleAddToCart);
    return () => window.removeEventListener('addToCart', handleAddToCart);
  }, []);

  // Save cart to localStorage whenever cartItems changes
  useEffect(() => {
    localStorage.setItem('lvsCart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item to cart handler
  const addToCartHandler = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        // Item exists, increment quantity
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // New item, add with quantity 1
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  // Update item quantity
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(id);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Remove item from cart
  const removeFromCart = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  // Navigate to cart page
  const goToCart = () => {
    setIsCartOpen(false);
    navigate('/cart');
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate total price
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Calculate total items count
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Format price in Indian Rupees
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  // Toggle cart visibility
  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <>
      {/* Cart Button */}
      <div className="cart-button-container">
        <button className="cart-button" onClick={toggleCart}>
          <svg className="cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="m1 1 4 4 1 14 13 0-2-9H7"></path>
          </svg>
          {getTotalItems() > 0 && (
            <span className="cart-badge">{getTotalItems()}</span>
          )}
        </button>
      </div>

      {/* Cart Overlay */}
      {isCartOpen && (
        <div className="cart-overlay" onClick={toggleCart}>
          <div className="cart-sidebar" onClick={(e) => e.stopPropagation()}>
            {/* Cart Header */}
            <div className="cart-header">
              <div className="cart-title">
                <svg className="cart-header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="m1 1 4 4 1 14 13 0-2-9H7"></path>
                </svg>
                <h2>Shopping Cart</h2>
                <span className="cart-count">({getTotalItems()} items)</span>
              </div>
              <button className="cart-close" onClick={toggleCart}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Cart Content */}
            <div className="cart-content">
              {cartItems.length === 0 ? (
                <div className="cart-empty">
                  <div className="empty-cart-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="9" cy="21" r="1"></circle>
                      <circle cx="20" cy="21" r="1"></circle>
                      <path d="m1 1 4 4 1 14 13 0-2-9H7"></path>
                    </svg>
                  </div>
                  <h3>Your cart is empty</h3>
                  <p>Add some products to get started</p>
                </div>
              ) : (
                <div className="cart-items">
                  {cartItems.map((item) => (
                    <div key={item.id} className="cart-item">
                      <div className="cart-item-image">
                        <img src={item.image} alt={item.name} />
                      </div>
                      <div className="cart-item-details">
                        <h3 className="cart-item-name">{item.name}</h3>
                        <p className="cart-item-price">{formatPrice(item.price)}</p>
                        <div className="cart-item-actions">
                          <div className="quantity-controls">
                            <button 
                              className="quantity-btn"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              -
                            </button>
                            <span className="quantity">{item.quantity}</span>
                            <button 
                              className="quantity-btn"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                          <button 
                            className="remove-btn"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3,6 5,6 21,6"></polyline>
                              <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="cart-item-total">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Footer */}
            {cartItems.length > 0 && (
              <div className="cart-footer">
                <div className="cart-summary">
                  <div className="cart-total">
                    <span className="total-label">Total:</span>
                    <span className="total-amount">{formatPrice(getTotalPrice())}</span>
                  </div>
                </div>
                <div className="cart-actions">
                  <button className="clear-cart-btn" onClick={clearCart}>
                    Clear Cart
                  </button>
                  <button className="view-cart-btn" onClick={goToCart}>
                    View Cart
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

// Export the component
export default ShoppingCart;
