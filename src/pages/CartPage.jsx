import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShoppingCart } from '../hooks/useShoppingCart';
import './CartPage.css';

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice } = useShoppingCart();
  
  const [deliveryAddress, setDeliveryAddress] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    phone: ''
  });
  
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryFee, setDeliveryFee] = useState(40);

  // ML Model simulation for delivery prediction
  const calculateDeliveryDate = React.useCallback(() => {
    const today = new Date();
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalValue = getTotalPrice();
    
    // Simple ML simulation based on cart value, items, and current date
    let deliveryDays = 2; // Base delivery time
    
    // Factors affecting delivery time
    if (totalValue > 100000) deliveryDays -= 1; // Priority for high-value orders
    if (totalItems > 5) deliveryDays += 1; // More items = longer processing
    if (today.getDay() === 0 || today.getDay() === 6) deliveryDays += 1; // Weekend orders
    
    // Add randomization for realistic ML prediction
    deliveryDays += Math.floor(Math.random() * 2); // 0-1 extra days
    
    const deliveryDate = new Date(today.getTime() + (deliveryDays * 24 * 60 * 60 * 1000));
    const options = { weekday: 'long', day: 'numeric', month: 'short' };
    setDeliveryDate(deliveryDate.toLocaleDateString('en-IN', options));
    
    // Calculate delivery fee based on distance simulation
    if (totalValue >= 100000) {
      setDeliveryFee(0); // Free delivery for orders above ₹1,00,000
    } else {
      setDeliveryFee(40 + Math.floor(Math.random() * 60)); // ₹40-100 based on "distance"
    }
  }, [cartItems, getTotalPrice]);

  // Load saved addresses from localStorage
  useEffect(() => {
    const addresses = localStorage.getItem('lvsAddresses');
    if (addresses) {
      const parsedAddresses = JSON.parse(addresses);
      setSavedAddresses(parsedAddresses);
      if (parsedAddresses.length > 0) {
        setSelectedAddress(parsedAddresses[0]);
      }
    }
  }, []);

  // Calculate delivery date when cart changes
  useEffect(() => {
    calculateDeliveryDate();
  }, [calculateDeliveryDate]);

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    const newAddress = { ...deliveryAddress, id: Date.now() };
    const updatedAddresses = [...savedAddresses, newAddress];
    setSavedAddresses(updatedAddresses);
    setSelectedAddress(newAddress);
    localStorage.setItem('lvsAddresses', JSON.stringify(updatedAddresses));
    setShowAddressForm(false);
    setDeliveryAddress({ name: '', street: '', city: '', state: '', pincode: '', phone: '' });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(id);
    } else {
      updateQuantity(id, newQuantity);
    }
    calculateDeliveryDate(); // Recalculate delivery when quantity changes
  };

  const proceedToCheckout = () => {
    if (!selectedAddress) {
      alert('Please select a delivery address');
      return;
    }
    
    // Store selected address for checkout
    localStorage.setItem('lvsSelectedAddress', JSON.stringify(selectedAddress));
    localStorage.setItem('lvsDeliveryInfo', JSON.stringify({ date: deliveryDate, fee: deliveryFee }));
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page empty-cart">
        <div className="container">
          <div className="empty-cart-content">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your LVS Cart is Empty</h2>
            <p>Add some amazing machine tools to get started!</p>
            <button onClick={() => navigate('/products')} className="continue-shopping-btn">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          <span className="cart-count">{cartItems.length} item(s)</span>
        </div>

        <div className="cart-layout">
          {/* Left Column: Cart Items and Address */}
          <div className="cart-main">
            {/* Delivery Address Section */}
            <div className="address-section">
              <div className="address-header">
                <h3>
                  <svg className="address-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  Delivery Address
                </h3>
                <button 
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="add-address-btn"
                >
                  {savedAddresses.length === 0 ? 'Add Address' : 'Add New Address'}
                </button>
              </div>

              {/* Saved Addresses */}
              {savedAddresses.length > 0 && (
                <div className="saved-addresses">
                  {savedAddresses.map((address) => (
                    <div 
                      key={address.id}
                      className={`address-card ${selectedAddress?.id === address.id ? 'selected' : ''}`}
                      onClick={() => setSelectedAddress(address)}
                    >
                      <div className="address-radio">
                        <div className={`radio-dot ${selectedAddress?.id === address.id ? 'active' : ''}`}></div>
                      </div>
                      <div className="address-details">
                        <h4>{address.name}</h4>
                        <p>{address.street}</p>
                        <p>{address.city}, {address.state} - {address.pincode}</p>
                        <p className="phone">📞 {address.phone}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Address Form */}
              {showAddressForm && (
                <form onSubmit={handleAddressSubmit} className="address-form">
                  <h4>Add New Address</h4>
                  <div className="form-grid">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={deliveryAddress.name}
                      onChange={(e) => setDeliveryAddress({...deliveryAddress, name: e.target.value})}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Street Address"
                      value={deliveryAddress.street}
                      onChange={(e) => setDeliveryAddress({...deliveryAddress, street: e.target.value})}
                      required
                    />
                    <input
                      type="text"
                      placeholder="City"
                      value={deliveryAddress.city}
                      onChange={(e) => setDeliveryAddress({...deliveryAddress, city: e.target.value})}
                      required
                    />
                    <select
                      value={deliveryAddress.state}
                      onChange={(e) => setDeliveryAddress({...deliveryAddress, state: e.target.value})}
                      required
                    >
                      <option value="">Select State</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Other">Other</option>
                    </select>
                    <input
                      type="text"
                      placeholder="PIN Code"
                      value={deliveryAddress.pincode}
                      onChange={(e) => setDeliveryAddress({...deliveryAddress, pincode: e.target.value})}
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={deliveryAddress.phone}
                      onChange={(e) => setDeliveryAddress({...deliveryAddress, phone: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="save-address-btn">Save Address</button>
                    <button type="button" onClick={() => setShowAddressForm(false)} className="cancel-btn">Cancel</button>
                  </div>
                </form>
              )}
            </div>

            {/* Delivery Date Prediction */}
            {selectedAddress && (
              <div className="delivery-prediction">
                <div className="delivery-info">
                  <div className="delivery-icon">📦</div>
                  <div className="delivery-details">
                    <h4>Arriving {deliveryDate}</h4>
                    <p className="delivery-note">
                      If you order in the next{' '}
                      <span className="highlight">
                        {20 - new Date().getHours()} hours and {60 - new Date().getMinutes()} minutes
                      </span>
                    </p>
                    <div className="delivery-timeline">
                      <div className="timeline-dot active"></div>
                      <div className="timeline-line"></div>
                      <div className="timeline-dot"></div>
                      <span className="delivery-day">{deliveryDate}</span>
                      <span className="delivery-cost">{deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)} Delivery</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Cart Items */}
            <div className="cart-items-section">
              <h3>Items in your cart</h3>
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="item-image">
                    <img src={item.image} alt={item.name} onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }} />
                    <div className="placeholder-icon" style={{ display: 'none' }}>🔧</div>
                  </div>
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p className="item-brand">Brand: {item.brand || 'LVS'}</p>
                    <p className="item-category">Category: {item.category}</p>
                    <div className="item-actions">
                      <div className="quantity-controls">
                        <button 
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="qty-btn"
                        >
                          🗑️
                        </button>
                        <span className="quantity-display">{item.quantity}</span>
                        <button 
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="qty-btn"
                        >
                          ➕
                        </button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="remove-btn"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="item-price">
                    {formatPrice(item.price * item.quantity)}
                    {item.quantity > 1 && (
                      <span className="unit-price">({formatPrice(item.price)} each)</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="cart-summary">
            <div className="summary-card">
              <h3>Order Summary</h3>
              
              <div className="summary-row">
                <span>Items ({cartItems.reduce((sum, item) => sum + item.quantity, 0)}):</span>
                <span>{formatPrice(getTotalPrice())}</span>
              </div>
              
              <div className="summary-row">
                <span>Delivery:</span>
                <span>{deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}</span>
              </div>
              
              {deliveryFee === 0 && (
                <div className="free-delivery-note">
                  🎉 FREE delivery on orders above ₹1,00,000
                </div>
              )}
              
              <div className="summary-row total">
                <span>Order Total:</span>
                <span>{formatPrice(getTotalPrice() + deliveryFee)}</span>
              </div>

              <button 
                onClick={proceedToCheckout}
                className="checkout-btn"
                disabled={!selectedAddress}
              >
                Proceed to Checkout
              </button>

              <div className="payment-info">
                <div className="payment-icons">
                  <span>💳</span>
                  <span>📱</span>
                  <span>💰</span>
                </div>
                <p>We accept all payment methods</p>
              </div>
            </div>

            {/* Recommendations */}
            <div className="recommendations">
              <h4>Customers also bought</h4>
              <div className="rec-item">
                <img src="/images/cnc-bangle-main.png" alt="Recommended" />
                <div className="rec-details">
                  <p>CNC Bangle Cutting Machine Pro</p>
                  <span>{formatPrice(125000)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
