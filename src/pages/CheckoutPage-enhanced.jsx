import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './CheckoutPage.css';

const CheckoutPageEnhanced = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState('');
  
  // Form data
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    
    // Delivery Address
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    
    // Payment
    paymentMethod: ''
  });
  
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  // Load cart items or buy now item
  useEffect(() => {
    const loadCheckoutData = () => {
      // Check if coming from buy now (single item)
      const buyNowItem = location.state?.buyNowItem;
      
      if (buyNowItem) {
        setCartItems([buyNowItem]);
        console.log('Buy now item loaded:', buyNowItem);
      } else {
        // Load from cart
        const savedCartItems = localStorage.getItem('lvsCartItems');
        if (savedCartItems) {
          try {
            const parsedItems = JSON.parse(savedCartItems);
            setCartItems(parsedItems);
            console.log('Cart items loaded:', parsedItems);
          } catch (error) {
            console.error('Error parsing cart items:', error);
            setCartItems([]);
          }
        } else {
          // Fetch cart from backend
          fetchCartItems();
        }
      }
    };

    loadCheckoutData();
  }, [location.state]);

  const fetchCartItems = async () => {
    try {
      const userId = localStorage.getItem('userId') || 'demo-user-123';
      const response = await axios.get(`http://localhost:5000/api/cart/${userId}`);
      
      if (response.data.success && response.data.items) {
        setCartItems(response.data.items);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  // Calculate totals
  const calculations = {
    subtotal: cartItems.reduce((total, item) => {
      const price = item.price || item.productId?.price || 0;
      return total + (price * item.quantity);
    }, 0),
    get cgst() { return this.subtotal * 0.09; },
    get sgst() { return this.subtotal * 0.09; },
    get shipping() { return this.subtotal >= 100000 ? 0 : 50; },
    get grandTotal() { return this.subtotal + this.cgst + this.sgst + this.shipping; }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
      formattedValue = formattedValue.match(/.{1,4}/g)?.join(' ') || formattedValue;
      if (formattedValue.length > 19) formattedValue = formattedValue.substring(0, 19);
    } else if (name === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.substring(0, 2) + '/' + formattedValue.substring(2, 4);
      }
    } else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').substring(0, 4);
    }
    
    setCardInfo(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const validateForm = () => {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'pincode'];
    
    for (let field of requiredFields) {
      if (!formData[field]?.trim()) {
        setError(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Phone validation
    if (formData.phone.length < 10) {
      setError('Please enter a valid phone number');
      return false;
    }

    if (!formData.paymentMethod) {
      setError('Please select a payment method');
      return false;
    }

    // Card validation if card is selected
    if (formData.paymentMethod === 'card') {
      const cardFields = ['cardNumber', 'expiryDate', 'cvv', 'cardholderName'];
      for (let field of cardFields) {
        if (!cardInfo[field]?.trim()) {
          setError(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
          return false;
        }
      }
    }

    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    if (cartItems.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      // Handle different payment methods
      if (formData.paymentMethod === 'razorpay') {
        await processRazorpayPayment();
      } else if (formData.paymentMethod === 'card') {
        await processCardPayment();
      } else if (formData.paymentMethod === 'cod') {
        await processCODPayment();
      }
    } catch (error) {
      console.error('Error placing order:', error);
      setError(error.response?.data?.message || 'Failed to place order. Please try again.');
      setIsProcessing(false);
    }
  };

  const processCODPayment = async () => {
    const orderData = {
      userId: localStorage.getItem('userId') || 'demo-user-123',
      items: cartItems.map(item => ({
        productId: item._id || item.productId?._id || item.productId,
        quantity: item.quantity,
        price: item.price || item.productId?.price || 0,
        name: item.name || item.productId?.name || 'Product',
        image: item.image || item.productId?.images?.[0] || ''
      })),
      customerInfo: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        company: formData.company
      },
      shippingAddress: {
        fullName: `${formData.firstName} ${formData.lastName}`,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        country: formData.country,
        phone: formData.phone
      },
      paymentMethod: 'cod',
      totalPrice: calculations.grandTotal,
      tax: calculations.cgst + calculations.sgst,
      subtotal: calculations.subtotal,
      shipping: calculations.shipping
    };

    console.log('Processing COD order:', orderData);

    const response = await axios.post('http://localhost:5000/api/orders/place', orderData);

    if (response.data.success) {
      // Clear cart
      localStorage.removeItem('lvsCartItems');
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      
      // Dispatch order placed event for profile page updates
      window.dispatchEvent(new CustomEvent('orderPlaced', {
        detail: { 
          orderId: response.data.order.orderId, 
          type: 'enhanced-checkout-cod',
          order: response.data.order 
        }
      }));
      console.log('Order placed event dispatched from enhanced COD checkout');
      
      // Navigate to order confirmation
      navigate(`/order-confirmation/${response.data.order.orderId}`, {
        state: { 
          order: response.data.order,
          customerInfo: formData 
        }
      });
    } else {
      throw new Error(response.data.message || 'Failed to place COD order');
    }
    
    setIsProcessing(false);
  };

  const processCardPayment = async () => {
    // Simulate card processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const orderData = {
      userId: localStorage.getItem('userId') || 'demo-user-123',
      items: cartItems.map(item => ({
        productId: item._id || item.productId?._id || item.productId,
        quantity: item.quantity,
        price: item.price || item.productId?.price || 0,
        name: item.name || item.productId?.name || 'Product',
        image: item.image || item.productId?.images?.[0] || ''
      })),
      customerInfo: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        company: formData.company
      },
      shippingAddress: {
        fullName: `${formData.firstName} ${formData.lastName}`,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        country: formData.country,
        phone: formData.phone
      },
      paymentMethod: 'card',
      paymentDetails: {
        cardLastFour: cardInfo.cardNumber.slice(-4),
        cardholderName: cardInfo.cardholderName
      },
      totalPrice: calculations.grandTotal,
      tax: calculations.cgst + calculations.sgst,
      subtotal: calculations.subtotal,
      shipping: calculations.shipping
    };

    const response = await axios.post('http://localhost:5000/api/orders/place', orderData);

    if (response.data.success) {
      localStorage.removeItem('lvsCartItems');
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      
      // Dispatch orderPlaced event for profile page integration
      window.dispatchEvent(new CustomEvent('orderPlaced', {
        detail: { order: response.data.order }
      }));
      
      navigate(`/order-confirmation/${response.data.order.orderId}`, {
        state: { 
          order: response.data.order,
          customerInfo: formData 
        }
      });
    } else {
      throw new Error(response.data.message || 'Card payment failed');
    }
    
    setIsProcessing(false);
  };

  const processRazorpayPayment = async () => {
    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
    
    if (!razorpayKey) {
      throw new Error('Razorpay key not configured');
    }

    if (!window.Razorpay) {
      throw new Error('Razorpay SDK not loaded');
    }

    // Create order data
    const orderData = {
      userId: localStorage.getItem('userId') || 'demo-user-123',
      items: cartItems.map(item => ({
        productId: item._id || item.productId?._id || item.productId,
        quantity: item.quantity,
        price: item.price || item.productId?.price || 0,
        name: item.name || item.productId?.name || 'Product',
        image: item.image || item.productId?.images?.[0] || ''
      })),
      customerInfo: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        company: formData.company
      },
      shippingAddress: {
        fullName: `${formData.firstName} ${formData.lastName}`,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        country: formData.country,
        phone: formData.phone
      },
      paymentMethod: 'razorpay',
      totalPrice: calculations.grandTotal,
      tax: calculations.cgst + calculations.sgst,
      subtotal: calculations.subtotal,
      shipping: calculations.shipping
    };

    console.log('Processing Razorpay payment:', orderData);

    // Create Razorpay order
    const response = await axios.post('http://localhost:5000/api/orders/place', orderData);
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to create Razorpay order');
    }

    const options = {
      key: razorpayKey,
      amount: Math.round(calculations.grandTotal * 100), // Amount in paise
      currency: 'INR',
      name: 'LVS Machine & Tools',
      description: `Order for ${cartItems.length} item(s)`,
      image: '/images/lvs-logo.png',
      order_id: response.data.razorpayOrderId,
      handler: async (razorpayResponse) => {
        try {
          console.log('Razorpay payment successful:', razorpayResponse);
          
          // Verify payment with backend
          const verifyResponse = await axios.post('http://localhost:5000/api/orders/verify-payment', {
            razorpay_order_id: razorpayResponse.razorpay_order_id,
            razorpay_payment_id: razorpayResponse.razorpay_payment_id,
            razorpay_signature: razorpayResponse.razorpay_signature,
          });
          
          if (verifyResponse.data.success) {
            console.log('Payment verified successfully');
            
            // Clear cart and navigate to confirmation
            localStorage.removeItem('lvsCartItems');
            window.dispatchEvent(new CustomEvent('cartUpdated'));
            
            navigate(`/order-confirmation/${verifyResponse.data.order.orderId}`, {
              state: { 
                order: verifyResponse.data.order,
                customerInfo: formData 
              }
            });
            
            setIsProcessing(false);
          } else {
            throw new Error(verifyResponse.data.message || 'Payment verification failed');
          }
        } catch (error) {
          console.error('Error verifying payment:', error);
          setError('Payment verification failed. Please contact support.');
          setIsProcessing(false);
        }
      },
      prefill: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        contact: formData.phone
      },
      notes: {
        address: formData.address,
        city: formData.city
      },
      theme: {
        color: '#DAA520'
      },
      modal: {
        ondismiss: () => {
          console.log('Razorpay payment cancelled');
          setError('Payment was cancelled. Please try again.');
          setIsProcessing(false);
        }
      }
    };

    const razorpay = new window.Razorpay(options);
    
    razorpay.on('payment.failed', (response) => {
      console.error('Razorpay payment failed:', response.error);
      setError(`Payment failed: ${response.error.description}`);
      setIsProcessing(false);
    });
    
    razorpay.open();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  // Redirect if no items
  if (cartItems.length === 0 && !location.state?.buyNowItem) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>No items to checkout</h2>
            <p>Add some products to your cart or use buy now on a product page.</p>
            <button onClick={() => navigate('/products')} className="btn btn-primary">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="elegant-checkout-page">
      <div className="container">
        {/* Header */}
        <div className="checkout-header animate-fade-in">
          <div className="header-content">
            <span className="checkout-subtitle">SECURE</span>
            <h1 className="checkout-title">
              Check<span className="text-brown">out</span>
            </h1>
            <p className="checkout-description">
              Complete your order with our secure checkout process
            </p>
          </div>
          
          <div className="progress-steps">
            <div className="step-item active">
              <div className="step-circle">1</div>
              <span className="step-label">Details</span>
            </div>
            <div className="step-connector"></div>
            <div className="step-item">
              <div className="step-circle">2</div>
              <span className="step-label">Payment</span>
            </div>
            <div className="step-connector"></div>
            <div className="step-item">
              <div className="step-circle">3</div>
              <span className="step-label">Complete</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="error-message animate-fade-in">
            <div className="error-content">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
              <button onClick={() => setError('')} className="error-close">×</button>
            </div>
          </div>
        )}

        <div className="checkout-content">
          <div className="checkout-main">
            {/* Customer Information */}
            <div className="elegant-section animate-slide-in-left">
              <div className="section-header">
                <div className="section-icon">👤</div>
                <h2>Customer Information</h2>
                <p>Please provide your contact details</p>
              </div>
              <div className="elegant-form-grid">
                <div className="elegant-form-group">
                  <label className="form-label">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Enter first name"
                    className="elegant-input"
                    required
                  />
                </div>
                <div className="elegant-form-group">
                  <label className="form-label">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Enter last name"
                    className="elegant-input"
                    required
                  />
                </div>
                <div className="elegant-form-group">
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                    className="elegant-input"
                    required
                  />
                </div>
                <div className="elegant-form-group">
                  <label className="form-label">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    className="elegant-input"
                    required
                  />
                </div>
                <div className="elegant-form-group full-width">
                  <label className="form-label">Company (Optional)</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Enter company name"
                    className="elegant-input"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="elegant-section animate-slide-in-left">
              <div className="section-header">
                <div className="section-icon">🏠</div>
                <h2>Delivery Address</h2>
                <p>Where should we deliver your order?</p>
              </div>
              <div className="elegant-form-grid">
                <div className="elegant-form-group full-width">
                  <label className="form-label">Street Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter complete street address"
                    className="elegant-input"
                    required
                  />
                </div>
                <div className="elegant-form-group">
                  <label className="form-label">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Enter city"
                    className="elegant-input"
                    required
                  />
                </div>
                <div className="elegant-form-group">
                  <label className="form-label">State *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="Enter state"
                    className="elegant-input"
                    required
                  />
                </div>
                <div className="elegant-form-group">
                  <label className="form-label">Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    placeholder="Enter pincode"
                    className="elegant-input"
                    required
                  />
                </div>
                <div className="elegant-form-group">
                  <label className="form-label">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    className="elegant-input readonly"
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="elegant-section animate-slide-in-left">
              <div className="section-header">
                <div className="section-icon">💳</div>
                <h2>Payment Method</h2>
                <p>Choose your preferred payment option</p>
              </div>
              <div className="elegant-payment-methods">
                {/* Cash on Delivery */}
                <div
                  className={`payment-method ${formData.paymentMethod === 'cod' ? 'selected' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'cod' }))}
                >
                  <div className="payment-info">
                    <div className="payment-header">
                      <div className="radio-container">
                        <div className={`radio-dot ${formData.paymentMethod === 'cod' ? 'active' : ''}`}></div>
                      </div>
                      <div>
                        <h3>Cash on Delivery</h3>
                        <p>Pay when your order is delivered</p>
                      </div>
                    </div>
                    <span className="payment-badge">COD</span>
                  </div>
                </div>

                {/* Credit/Debit Card */}
                <div
                  className={`payment-method ${formData.paymentMethod === 'card' ? 'selected' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'card' }))}
                >
                  <div className="payment-info">
                    <div className="payment-header">
                      <div className="radio-container">
                        <div className={`radio-dot ${formData.paymentMethod === 'card' ? 'active' : ''}`}></div>
                      </div>
                      <div>
                        <h3>Credit/Debit Card</h3>
                        <p>Pay securely with your card</p>
                      </div>
                    </div>
                    <span className="payment-badge">Card</span>
                  </div>
                </div>

                {/* Razorpay */}
                <div
                  className={`payment-method ${formData.paymentMethod === 'razorpay' ? 'selected' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'razorpay' }))}
                >
                  <div className="payment-info">
                    <div className="payment-header">
                      <div className="radio-container">
                        <div className={`radio-dot ${formData.paymentMethod === 'razorpay' ? 'active' : ''}`}></div>
                      </div>
                      <div>
                        <h3>Razorpay</h3>
                        <p>UPI, Cards, Wallets & More</p>
                      </div>
                    </div>
                    <span className="payment-badge">Razorpay</span>
                  </div>
                </div>
              </div>

              {/* Card Form */}
              {formData.paymentMethod === 'card' && (
                <div className="elegant-card-form animate-slide-in-down">
                  <div className="card-form-header">
                    <div className="section-icon">💳</div>
                    <h3>Card Details</h3>
                    <p>Enter your card information</p>
                  </div>
                  <div className="elegant-form-grid">
                    <div className="elegant-form-group full-width">
                      <label className="form-label">Card Number *</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={cardInfo.cardNumber}
                        onChange={handleCardInputChange}
                        placeholder="1234 5678 9012 3456"
                        className="elegant-input card-input"
                        maxLength={19}
                        required
                      />
                    </div>
                    <div className="elegant-form-group">
                      <label className="form-label">Expiry Date *</label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={cardInfo.expiryDate}
                        onChange={handleCardInputChange}
                        placeholder="MM/YY"
                        className="elegant-input card-input"
                        maxLength={5}
                        required
                      />
                    </div>
                    <div className="elegant-form-group">
                      <label className="form-label">CVV *</label>
                      <input
                        type="password"
                        name="cvv"
                        value={cardInfo.cvv}
                        onChange={handleCardInputChange}
                        placeholder="123"
                        className="elegant-input card-input"
                        maxLength={4}
                        required
                      />
                    </div>
                    <div className="elegant-form-group full-width">
                      <label className="form-label">Cardholder Name *</label>
                      <input
                        type="text"
                        name="cardholderName"
                        value={cardInfo.cardholderName}
                        onChange={handleCardInputChange}
                        placeholder="Enter cardholder name"
                        className="elegant-input card-input"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="checkout-sidebar animate-slide-in-right">
            <div className="elegant-order-summary">
              <div className="summary-header">
                <div className="summary-icon">🛒</div>
                <h2>Order Summary</h2>
                <p>Review your order details</p>
              </div>
              
              {/* Order Items */}
              <div className="elegant-order-items">
                {cartItems.map((item, index) => (
                  <div key={item._id || index} className="elegant-order-item">
                    <div className="item-image">
                      <img 
                        src={item.image || item.productId?.images?.[0] || '/images/placeholder-product.svg'} 
                        alt={item.name || item.productId?.name || 'Product'} 
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="placeholder-icon" style={{ display: 'none' }}>🔧</div>
                    </div>
                    <div className="item-details">
                      <h4>{item.name || item.productId?.name || 'Product'}</h4>
                      <p>Qty: {item.quantity}</p>
                      <p className="item-price">{formatCurrency(item.price || item.productId?.price || 0)}</p>
                    </div>
                    <div className="item-total">
                      <p>{formatCurrency((item.price || item.productId?.price || 0) * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="elegant-price-breakdown">
                <div className="elegant-price-row">
                  <span>Subtotal</span>
                  <span>{formatCurrency(calculations.subtotal)}</span>
                </div>
                <div className="elegant-price-row">
                  <span>CGST (9%)</span>
                  <span>{formatCurrency(calculations.cgst)}</span>
                </div>
                <div className="elegant-price-row">
                  <span>SGST (9%)</span>
                  <span>{formatCurrency(calculations.sgst)}</span>
                </div>
                <div className="elegant-price-row">
                  <span>Shipping</span>
                  <span className="shipping-value">{calculations.shipping === 0 ? 'FREE' : formatCurrency(calculations.shipping)}</span>
                </div>
                <div className="elegant-price-row elegant-total-row">
                  <span>Total Amount</span>
                  <span className="total-amount">{formatCurrency(calculations.grandTotal)}</span>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                className={`elegant-checkout-btn ${!formData.paymentMethod || isProcessing ? 'disabled' : 'ready'}`}
                onClick={handlePlaceOrder}
                disabled={!formData.paymentMethod || isProcessing}
              >
                <span className="btn-icon">{isProcessing ? '⏳' : formData.paymentMethod === 'cod' ? '📦' : '💳'}</span>
                <span className="btn-text">
                  {isProcessing ? 'Processing...' : 
                   formData.paymentMethod === 'cod' ? 'Place Order (COD)' : 
                   `Pay ${formatCurrency(calculations.grandTotal)}`}
                </span>
              </button>

              {/* Security Info */}
              <div className="elegant-security-info">
                <div className="security-title">
                  <span className="security-shield">🛡️</span>
                  <span>Your Security is Our Priority</span>
                </div>
                <div className="security-features">
                  <div className="security-feature">
                    <span className="feature-icon">🔒</span>
                    <span>256-bit SSL Encrypted</span>
                  </div>
                  <div className="security-feature">
                    <span className="feature-icon">✓</span>
                    <span>PCI DSS Compliant</span>
                  </div>
                  <div className="security-feature">
                    <span className="feature-icon">🏦</span>
                    <span>Bank-level Security</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPageEnhanced;
