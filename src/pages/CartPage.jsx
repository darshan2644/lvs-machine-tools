import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CartPage.css';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId') || 'demo-user-123';

  console.log('CartPage component loaded, userId:', userId);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        console.log('Fetching cart items for userId:', userId);
        setLoading(true);
        setError(''); // Clear previous errors
        
        const response = await axios.get(`http://localhost:5000/api/cart/${userId}`);
        console.log('Cart API response:', response.data);
        
        if (response.data.success) {
          // Filter out items with null productId to prevent errors
          const validItems = (response.data.items || []).filter(item => item.productId);
          setCartItems(validItems);
          console.log('Cart items loaded:', validItems);
          if (validItems.length !== (response.data.items || []).length) {
            console.warn('Some cart items had null productId and were filtered out');
          }
        } else {
          console.error('API returned success=false:', response.data);
          setError('Failed to load cart items');
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
        setError(`Failed to load cart items: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [userId]);

  const updateQuantity = async (productId, newQuantity) => {
    try {
      const response = await axios.put('http://localhost:5000/api/cart/update', {
        userId,
        productId,
        quantity: newQuantity
      });

      if (response.data.success) {
        if (newQuantity <= 0) {
          setCartItems(items => items.filter(item => item.productId?._id !== productId));
        } else {
          setCartItems(items => 
            items.map(item => 
              item.productId?._id === productId 
                ? { ...item, quantity: newQuantity }
                : item
            )
          );
        }
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      setError('Failed to update quantity');
    }
  };

  const removeItem = async (productId) => {
    try {
      const response = await axios.post('http://localhost:5000/api/cart/remove', {
        userId,
        productId
      });

      if (response.data.success) {
        setCartItems(items => items.filter(item => item.productId?._id !== productId));
      }
    } catch (error) {
      console.error('Error removing item:', error);
      setError('Failed to remove item');
    }
  };

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTax = () => {
    return getSubtotal() * 0.18; // 18% GST
  };

  const getDeliveryCharge = () => {
    return getSubtotal() > 1000 ? 0 : 50;
  };

  const getTotal = () => {
    return getSubtotal() + getTax() + getDeliveryCharge();
  };

  const handleCheckout = () => {
    console.log('Checkout button clicked!');
    console.log('Cart items:', cartItems);
    
    if (cartItems.length === 0) {
      console.log('Cart is empty, showing error');
      setError('Your cart is empty');
      return;
    }
    
    console.log('Saving cart items to localStorage and navigating...');
    // Save cart items to localStorage for checkout page
    localStorage.setItem('lvsCartItems', JSON.stringify(cartItems));
    
    // Navigate to checkout page
    console.log('Navigating to /checkout');
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading your cart...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="elegant-cart-page">
      <div className="container">
        <div className="cart-header animate-fade-in">
          <div className="header-content">
            <span className="cart-subtitle">SHOPPING</span>
            <h1 className="cart-title">Your <span className="text-brown">Cart</span></h1>
            <p className="cart-count">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart</p>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={() => setError('')}>Dismiss</button>
          </div>
        )}

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-illustration">
              <div className="cart-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="m1 1 4 4 4.68 11H19l3-7H6"></path>
                </svg>
              </div>
              <div className="empty-lines">
                <div className="line line-1"></div>
                <div className="line line-2"></div>
                <div className="line line-3"></div>
              </div>
            </div>
            <div className="empty-cart-content">
              <h2>Your cart is empty</h2>
              <p>Add some products to your cart to get started</p>
              <div className="empty-cart-actions">
                <button 
                  className="continue-shopping-btn" 
                  onClick={() => navigate('/categories')}
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 1v6M16 1v6"/>
                  </svg>
                  Continue Shopping
                </button>
                <button 
                  className="browse-categories-btn" 
                  onClick={() => navigate('/categories')}
                >
                  Browse Categories
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item._id} className="cart-item">
                  <div className="item-image">
                    <img 
                      src={item.productId?.images?.[0] || '/images/placeholder-product.svg'} 
                      alt={item.productId?.name || 'Product'}
                    />
                  </div>
                  
                  <div className="item-details">
                    <h3>{item.productId?.name || 'Product Name'}</h3>
                    <p className="item-brand">{item.productId?.brand || 'LVS Machine Tools'}</p>
                    <p className="item-price">₹{(item.price || 0).toLocaleString()}</p>
                  </div>

                  <div className="item-quantity">
                    <button 
                      className="qty-btn"
                      onClick={() => updateQuantity(item.productId?._id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="qty-value">{item.quantity}</span>
                    <button 
                      className="qty-btn"
                      onClick={() => updateQuantity(item.productId?._id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>

                  <div className="item-total">
                    <p>₹{((item.price || 0) * item.quantity).toLocaleString()}</p>
                    <button 
                      className="remove-btn"
                      onClick={() => removeItem(item.productId?._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h3>Order Summary</h3>
              
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>₹{getSubtotal().toLocaleString()}</span>
              </div>
              
              <div className="summary-row">
                <span>Tax (GST 18%):</span>
                <span>₹{getTax().toLocaleString()}</span>
              </div>
              
              <div className="summary-row">
                <span>Delivery:</span>
                <span>{getDeliveryCharge() === 0 ? 'Free' : `₹${getDeliveryCharge()}`}</span>
              </div>
              
              <div className="summary-row total">
                <span>Total:</span>
                <span>₹{getTotal().toLocaleString()}</span>
              </div>

              <button 
                className="btn btn-primary checkout-btn"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
