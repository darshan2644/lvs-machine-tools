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
          setCartItems(response.data.items || []);
          console.log('Cart items loaded:', response.data.items);
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
          setCartItems(items => items.filter(item => item.productId._id !== productId));
        } else {
          setCartItems(items => 
            items.map(item => 
              item.productId._id === productId 
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
        setCartItems(items => items.filter(item => item.productId._id !== productId));
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
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Add some products to your cart to get started</p>
            <button 
              className="btn btn-primary" 
              onClick={() => navigate('/products')}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item._id} className="cart-item">
                  <div className="item-image">
                    <img 
                      src={item.productId.images?.[0] || '/images/placeholder-product.svg'} 
                      alt={item.productId.name}
                    />
                  </div>
                  
                  <div className="item-details">
                    <h3>{item.productId.name}</h3>
                    <p className="item-brand">{item.productId.brand}</p>
                    <p className="item-price">₹{item.price.toLocaleString()}</p>
                  </div>

                  <div className="item-quantity">
                    <button 
                      className="qty-btn"
                      onClick={() => updateQuantity(item.productId._id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="qty-value">{item.quantity}</span>
                    <button 
                      className="qty-btn"
                      onClick={() => updateQuantity(item.productId._id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>

                  <div className="item-total">
                    <p>₹{(item.price * item.quantity).toLocaleString()}</p>
                    <button 
                      className="remove-btn"
                      onClick={() => removeItem(item.productId._id)}
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
