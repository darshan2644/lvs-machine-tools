/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShoppingCart } from '../hooks/useShoppingCart';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems: hookCartItems, getTotalPrice, clearCart } = useShoppingCart();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [showCardForm, setShowCardForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  
  // Debug environment variables
  console.log('Environment variables check:');
  console.log('VITE_RAZORPAY_KEY_ID:', import.meta.env.VITE_RAZORPAY_KEY_ID);
  console.log('All env vars:', import.meta.env);
  console.log('Razorpay SDK loaded:', !!window.Razorpay);
  
  // Load cart items from hook or localStorage
  useEffect(() => {
    console.log('Loading cart items...');
    console.log('Hook cart items:', hookCartItems);
    
    if (hookCartItems && hookCartItems.length > 0) {
      console.log('Using cart items from hook');
      setCartItems(hookCartItems);
    } else {
      // Fallback to localStorage if hook is empty
      const savedCartItems = localStorage.getItem('lvsCartItems');
      console.log('Saved cart items from localStorage:', savedCartItems);
      
      if (savedCartItems) {
        try {
          const parsedItems = JSON.parse(savedCartItems);
          console.log('Using cart items from localStorage:', parsedItems);
          setCartItems(parsedItems);
        } catch (error) {
          console.error('Error parsing cart items from localStorage:', error);
          setCartItems([]);
        }
      } else {
        console.log('No cart items found');
        setCartItems([]);
      }
    }
  }, [hookCartItems]);
  
  const [calculations, setCalculations] = useState({
    subtotal: 0,
    cgst: 0,
    sgst: 0,
    shipping: 0,
    grandTotal: 0
  });

  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India'
  });

  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  const [deliveryDate, setDeliveryDate] = useState('');

  // Load delivery info and address from localStorage
  useEffect(() => {
    const deliveryInfo = localStorage.getItem('lvsDeliveryInfo');
    const selectedAddress = localStorage.getItem('lvsSelectedAddress');
    const savedCartItems = localStorage.getItem('lvsCartItems');
    
    console.log('Loading checkout data from localStorage:');
    console.log('Cart items from hook:', cartItems);
    console.log('Saved cart items:', savedCartItems);
    
    if (deliveryInfo) {
      try {
        const { date } = JSON.parse(deliveryInfo);
        setDeliveryDate(date);
      } catch (error) {
        console.warn('Failed to parse delivery info:', error);
      }
    }
    
    if (selectedAddress) {
      try {
        const address = JSON.parse(selectedAddress);
        setCustomerInfo(prev => ({
          ...prev,
          firstName: address.name?.split(' ')[0] || '',
          lastName: address.name?.split(' ').slice(1).join(' ') || '',
          phone: address.phone || '',
          address: address.street || '',
          city: address.city || '',
          state: address.state || '',
          pincode: address.pincode || ''
        }));
      } catch (error) {
        console.warn('Failed to parse selected address:', error);
      }
    }
  }, [cartItems]); // Added cartItems dependency

  // Calculate totals
  useEffect(() => {
    // Calculate total price from cart items
    const getLocalTotalPrice = () => {
      return cartItems.reduce((total, item) => {
        return total + (item.price * item.quantity);
      }, 0);
    };

    const calculateTotals = () => {
      const subtotal = getLocalTotalPrice();
      const cgst = subtotal * 0.09; // 9% CGST
      const sgst = subtotal * 0.09; // 9% SGST
      const shipping = subtotal >= 100000 ? 0 : 50; // Free shipping above ₹1,00,000
      const grandTotal = subtotal + cgst + sgst + shipping;

      setCalculations({
        subtotal,
        cgst,
        sgst,
        shipping,
        grandTotal
      });
    };

    calculateTotals();
  }, [cartItems]); // Removed getTotalPrice dependency

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  // Generate order ID
  const generateOrderId = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `LVS${timestamp}${random}`;
  };

  // Handle payment method selection
  const handlePaymentMethodSelect = (method) => {
    console.log('Payment method selected:', method);
    setSelectedPaymentMethod(method);
    setShowCardForm(method === 'card');
  };

  // Handle form input changes
  const handleInputChange = (e, section) => {
    const { name, value } = e.target;
    if (section === 'customer') {
      setCustomerInfo(prev => ({
        ...prev,
        [name]: value
      }));
    } else if (section === 'card') {
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
    }
  };

  // Validate form
  const validateForm = () => {
    console.log('Validating form, customerInfo:', customerInfo);
    
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'pincode'];
    
    for (let field of requiredFields) {
      if (!customerInfo[field]?.trim()) {
        console.log('Missing field:', field);
        alert(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerInfo.email)) {
      alert('Please enter a valid email address');
      return false;
    }

    // Phone validation
    if (customerInfo.phone.length < 10) {
      alert('Please enter a valid phone number');
      return false;
    }

    if (selectedPaymentMethod === 'card') {
      const cardFields = ['cardNumber', 'expiryDate', 'cvv', 'cardholderName'];
      for (let field of cardFields) {
        if (!cardInfo[field]?.trim()) {
          alert(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
          return false;
        }
      }
      
      // Card number validation
      if (cardInfo.cardNumber.replace(/\s/g, '').length < 13) {
        alert('Please enter a valid card number');
        return false;
      }
      
      // CVV validation
      if (cardInfo.cvv.length < 3) {
        alert('Please enter a valid CVV');
        return false;
      }
    }

    console.log('Form validation passed');
    return true;
  };

  // Save order data to both localStorage and backend
  const saveOrder = async (orderData) => {
    console.log('Saving order data...', orderData);
    try {
      // Save to localStorage
      const existingOrders = JSON.parse(localStorage.getItem('lvsOrders') || '[]');
      existingOrders.push(orderData);
      localStorage.setItem('lvsOrders', JSON.stringify(existingOrders));
      console.log('Order saved to localStorage');

      // Save to backend
      try {
        console.log('Attempting to save to backend...');
        const response = await fetch('http://localhost:5000/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customerName: orderData.customerName,
            customerEmail: orderData.customerEmail,
            customerPhone: orderData.customerPhone,
            items: orderData.items,
            deliveryAddress: orderData.deliveryAddress,
            paymentMethod: orderData.paymentMethod,
            paymentId: orderData.paymentId,
            subtotal: orderData.subtotal,
            cgst: orderData.cgst,
            sgst: orderData.sgst,
            shipping: orderData.shipping,
            totalAmount: orderData.totalAmount,
            notes: orderData.notes || ''
          })
        });

        if (response.ok) {
          const result = await response.json();
          console.log('Order saved to backend:', result);
          // Update the order data with backend-generated ID
          if (result.data && result.data.orderId) {
            orderData.orderId = result.data.orderId;
          }
        } else {
          console.error('Failed to save order to backend:', response.statusText);
        }
      } catch (backendError) {
        console.error('Backend not available, order saved locally only:', backendError);
      }

      console.log('saveOrder returning true');
      return true;
    } catch (error) {
      console.error('Error saving order:', error);
      return false;
    }
  };

  // Process payment
  const handlePlaceOrder = async () => {
    console.log('Place order clicked, selectedPaymentMethod:', selectedPaymentMethod);
    console.log('cartItems:', cartItems);
    
    if (!selectedPaymentMethod) {
      alert('Please select a payment method');
      return;
    }

    // Basic form validation - only check essential fields
    if (!customerInfo.firstName) {
      alert('Please enter your first name');
      return;
    }
    if (!customerInfo.email) {
      alert('Please enter your email');
      return;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setIsProcessing(true);

    try {
      switch (selectedPaymentMethod) {
        case 'cod':
          await processCOD();
          break;
        case 'card':
          await processCard();
          break;
        case 'razorpay':
          console.log('Razorpay payment method selected');
          alert('Testing Razorpay payment - check console for details');
          await processRazorpay();
          break;
        default:
          alert('Invalid payment method selected');
      }
    } catch (error) {
      console.error('Error processing order:', error);
      alert('Error processing your order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const processCOD = async () => {
    console.log('Processing COD order...');
    
    try {
      // Prepare order data for backend API
      const orderData = {
        userId: 'demo-user-123', // In real app, get from auth context
        items: cartItems.map(item => ({
          productId: item._id || item.productId,
          quantity: item.quantity,
          price: item.price
        })),
        totalPrice: calculations.grandTotal,
        tax: calculations.cgst + calculations.sgst,
        paymentMethod: 'cod',
        shippingAddress: {
          fullName: `${customerInfo.firstName} ${customerInfo.lastName}`,
          address: customerInfo.address,
          city: customerInfo.city,
          state: customerInfo.state,
          pincode: customerInfo.pincode,
          phone: customerInfo.phone
        }
      };

      console.log('Sending order data to backend:', orderData);

      // Call backend API to create order
      const response = await fetch('http://localhost:5000/api/orders/place', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();
      console.log('Backend response:', result);

      if (result.success) {
        // Clear cart
        clearCart();
        localStorage.removeItem('lvsCartItems');
        
        // Navigate to order confirmation page with order data
        navigate(`/order-confirmation/${result.order.orderId || result.orderId}`, {
          state: { order: result.order }
        });
      } else {
        throw new Error(result.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Error placing COD order:', error);
      alert('Failed to place order. Please try again.');
      throw error;
    }
  };

  const processCard = async () => {
    const orderId = generateOrderId();
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const orderData = {
      orderId,
      customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
      customerEmail: customerInfo.email,
      customerPhone: customerInfo.phone,
      items: cartItems,
      totalAmount: calculations.grandTotal,
      deliveryAddress: customerInfo,
      deliveryDate,
      paymentMethod: 'Credit/Debit Card',
      orderStatus: 'Paid',
      orderDate: new Date().toISOString(),
      cardLastFour: cardInfo.cardNumber.slice(-4),
      trackingNumber: `LVS-CARD-${Date.now()}`,
      estimatedDelivery: deliveryDate || 'Within 5-7 business days',
      paymentId: `PAY_${Date.now()}`
    };

    const orderSaved = await saveOrder(orderData);
    if (orderSaved) {
      clearCart();
      navigate('/');
    } else {
      throw new Error('Failed to save order');
    }
  };

  const processRazorpay = async () => {
    console.log('processRazorpay called');
    
    // Set some default customer info for testing
    const testCustomerInfo = {
      firstName: customerInfo.firstName || 'Test',
      lastName: customerInfo.lastName || 'User', 
      email: customerInfo.email || 'test@example.com',
      phone: customerInfo.phone || '9999999999',
      address: customerInfo.address || 'Test Address',
      city: customerInfo.city || 'Test City',
      state: customerInfo.state || 'Test State',
      pincode: customerInfo.pincode || '123456'
    };
    
    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
    console.log('Razorpay key:', razorpayKey);
    
    if (!razorpayKey) {
      console.error('Razorpay key not found in environment variables');
      alert('Razorpay is not configured. Please contact support or use another payment method.');
      setIsProcessing(false);
      return;
    }

    console.log('Checking if Razorpay SDK is loaded...');
    if (!window.Razorpay) {
      console.error('Razorpay SDK not found on window object');
      alert('Razorpay SDK not loaded. Please refresh the page and try again.');
      setIsProcessing(false);
      return;
    }
    console.log('Razorpay SDK found:', window.Razorpay);

    try {
      const orderId = generateOrderId();
      console.log('Generated order ID:', orderId);

      // Prepare order data for our system
      const localOrderData = {
        orderId,
        customerName: `${testCustomerInfo.firstName} ${testCustomerInfo.lastName}`,
        customerEmail: testCustomerInfo.email,
        customerPhone: testCustomerInfo.phone,
        items: cartItems,
        totalAmount: calculations.grandTotal,
        deliveryAddress: testCustomerInfo,
        deliveryDate,
        paymentMethod: 'Razorpay (UPI/Cards/Wallets)',
        orderDate: new Date().toISOString(),
        trackingNumber: `LVS-RZP-${Date.now()}`,
        estimatedDelivery: deliveryDate || 'Within 5-7 business days'
      };

      const options = {
        key: razorpayKey,
        amount: Math.round(calculations.grandTotal * 100), // Amount in paisa
        currency: 'INR',
        name: 'LVS Machine & Tools',
        description: `Order #${orderId} - CNC Machines & Tools`,
        image: '/images/lvs-logo.png',
        handler: async (response) => {
          try {
            console.log('Payment successful:', response);
            
            const finalOrderData = {
              ...localOrderData,
              orderStatus: 'Paid',
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature
            };
            
            const orderSaved = await saveOrder(finalOrderData);
            if (orderSaved) {
              // Clear cart from localStorage as well
              localStorage.removeItem('lvsCartItems');
              clearCart();
              navigate(`/order-tracking/${orderId}`);
            } else {
              alert('Payment successful but error saving order. Please contact support with Payment ID: ' + response.razorpay_payment_id);
            }
          } catch (error) {
            console.error('Error processing payment:', error);
            alert('Payment successful but error processing order. Please contact support.');
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: `${testCustomerInfo.firstName} ${testCustomerInfo.lastName}`,
          email: testCustomerInfo.email,
          contact: testCustomerInfo.phone
        },
        notes: {
          order_id: orderId,
          customer_name: `${testCustomerInfo.firstName} ${testCustomerInfo.lastName}`
        },
        theme: {
          color: '#FFD700'
        }
      };

      console.log('Creating Razorpay instance with options:', options);
      const razorpay = new window.Razorpay(options);
      
      razorpay.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        setIsProcessing(false);
        alert(`Payment failed: ${response.error.description || 'Unknown error occurred'}\nPlease try again or use another payment method.`);
      });
      
      console.log('Opening Razorpay checkout...');
      razorpay.open();
    } catch (error) {
      console.error('Error initializing Razorpay:', error);
      setIsProcessing(false);
      alert('Error initializing payment. Please try again or use another payment method.');
    }
  };

  // Test function to trigger Razorpay directly
  const testRazorpay = () => {
    console.log('Testing Razorpay directly...');
    setIsProcessing(true);
    processRazorpay();
  };

  const getButtonText = () => {
    if (isProcessing) return 'Processing...';
    
    switch (selectedPaymentMethod) {
      case 'cod': return 'Place Order (COD)';
      case 'card': return `Pay ${formatCurrency(calculations.grandTotal)}`;
      case 'razorpay': return `Pay ${formatCurrency(calculations.grandTotal)} with Razorpay`;
      default: return 'Select Payment Method';
    }
  };

  // Empty cart redirect - but not if we're navigating from a successful order
  const urlParams = new URLSearchParams(window.location.search);
  const fromOrder = urlParams.get('from') === 'order';
  
  if (cartItems.length === 0 && !fromOrder) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="empty-cart">
            <h2>Your cart is empty</h2>
            <p>Add some products to your cart before checking out.</p>
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
                    value={customerInfo.firstName}
                    onChange={(e) => handleInputChange(e, 'customer')}
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
                    value={customerInfo.lastName}
                    onChange={(e) => handleInputChange(e, 'customer')}
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
                    value={customerInfo.email}
                    onChange={(e) => handleInputChange(e, 'customer')}
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
                    value={customerInfo.phone}
                    onChange={(e) => handleInputChange(e, 'customer')}
                    placeholder="Enter phone number"
                    className="elegant-input"
                    required
                  />
                </div>
                <div className="elegant-form-group">
                  <label className="form-label">Company</label>
                  <input
                    type="text"
                    name="company"
                    value={customerInfo.company}
                    onChange={(e) => handleInputChange(e, 'customer')}
                    placeholder="Enter company name (optional)"
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
                    value={customerInfo.address}
                    onChange={(e) => handleInputChange(e, 'customer')}
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
                    value={customerInfo.city}
                    onChange={(e) => handleInputChange(e, 'customer')}
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
                    value={customerInfo.state}
                    onChange={(e) => handleInputChange(e, 'customer')}
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
                    value={customerInfo.pincode}
                    onChange={(e) => handleInputChange(e, 'customer')}
                    placeholder="Enter pincode"
                    className="elegant-input"
                    required
                  />
                </div>
                <div className="elegant-form-group">
                  <label className="form-label">Country *</label>
                  <input
                    type="text"
                    name="country"
                    value={customerInfo.country}
                    onChange={(e) => handleInputChange(e, 'customer')}
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
                  className={`payment-method ${selectedPaymentMethod === 'cod' ? 'selected' : ''}`}
                  onClick={() => handlePaymentMethodSelect('cod')}
                >
                  <div className="payment-info">
                    <div className="payment-header">
                      <div className="radio-container">
                        <div className={`radio-dot ${selectedPaymentMethod === 'cod' ? 'active' : ''}`}></div>
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
                  className={`payment-method ${selectedPaymentMethod === 'card' ? 'selected' : ''}`}
                  onClick={() => handlePaymentMethodSelect('card')}
                >
                  <div className="payment-info">
                    <div className="payment-header">
                      <div className="radio-container">
                        <div className={`radio-dot ${selectedPaymentMethod === 'card' ? 'active' : ''}`}></div>
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
                  className={`payment-method ${selectedPaymentMethod === 'razorpay' ? 'selected' : ''}`}
                  onClick={() => handlePaymentMethodSelect('razorpay')}
                >
                  <div className="payment-info">
                    <div className="payment-header">
                      <div className="radio-container">
                        <div className={`radio-dot ${selectedPaymentMethod === 'razorpay' ? 'active' : ''}`}></div>
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
              {showCardForm && (
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
                        onChange={(e) => handleInputChange(e, 'card')}
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
                        onChange={(e) => handleInputChange(e, 'card')}
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
                        onChange={(e) => handleInputChange(e, 'card')}
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
                        onChange={(e) => handleInputChange(e, 'card')}
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
                {cartItems.map((item) => (
                  <div key={item.id} className="elegant-order-item">
                    <div className="item-image">
                      <img 
                        src={item.image || '/images/placeholder-product.svg'} 
                        alt={item.name} 
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="placeholder-icon" style={{ display: 'none' }}>🔧</div>
                    </div>
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <p>Qty: {item.quantity}</p>
                      <p className="item-price">{formatCurrency(item.price)}</p>
                    </div>
                    <div className="item-total">
                      <p>{formatCurrency(item.price * item.quantity)}</p>
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

              {/* Delivery Date */}
              {deliveryDate && (
                <div className="elegant-delivery-info">
                  <div className="delivery-header">
                    <span className="delivery-icon">🚚</span>
                    <h3>Estimated Delivery</h3>
                  </div>
                  <p className="delivery-date">{deliveryDate}</p>
                </div>
              )}

              {/* Place Order Button */}
              <button
                className={`elegant-checkout-btn ${!selectedPaymentMethod || isProcessing ? 'disabled' : ''} ${selectedPaymentMethod ? 'ready' : ''}`}
                onClick={handlePlaceOrder}
                disabled={!selectedPaymentMethod || isProcessing}
              >
                <span className="btn-icon">{isProcessing ? '⏳' : selectedPaymentMethod === 'cod' ? '📦' : '💳'}</span>
                <span className="btn-text">{getButtonText()}</span>
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

export default CheckoutPage;
