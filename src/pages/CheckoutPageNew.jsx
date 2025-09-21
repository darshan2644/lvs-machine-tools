import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/ToastProvider';
import './CheckoutPageNew.css';

const CheckoutPageNew = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { showSuccess, showError } = useToast();
  
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  
  // Address management
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  
  // Form states
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: ''
  });
  
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India'
  });
  
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  
  // Check if Razorpay is loaded
  useEffect(() => {
    const checkRazorpay = () => {
      if (window.Razorpay) {
        setRazorpayLoaded(true);
        console.log('Razorpay SDK loaded successfully');
      } else {
        console.log('Razorpay SDK not loaded, will retry...');
        setTimeout(checkRazorpay, 1000);
      }
    };
    
    checkRazorpay();
  }, []);
  
  // Load cart items
  useEffect(() => {
    const loadCartItems = async () => {
      try {
        const userId = localStorage.getItem('userId') || 'demo-user-123';
        const response = await fetch(`http://localhost:5000/api/cart/${userId}`);
        const data = await response.json();
        
        if (data.success) {
          setCartItems(data.items || []);
        }
      } catch (error) {
        console.error('Error loading cart:', error);
        showError('Failed to load cart items');
      } finally {
        setLoading(false);
      }
    };
    
    loadCartItems();
  }, [showError]);
  
  // Load user data and saved addresses
  useEffect(() => {
    const loadUserData = async () => {
      if (isAuthenticated && user) {
        setCustomerInfo({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          phone: user.phone || '',
          company: user.company || ''
        });
        
        // Load saved addresses from API
        try {
          const token = localStorage.getItem('token');
          const response = await fetch('http://localhost:5000/api/auth/addresses', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          const data = await response.json();
          if (data.success) {
            setSavedAddresses(data.addresses);
            const defaultAddress = data.addresses.find(addr => addr.isDefault);
            if (defaultAddress) {
              setSelectedAddressId(defaultAddress._id);
              setShippingAddress({
                address: defaultAddress.address,
                city: defaultAddress.city,
                state: defaultAddress.state,
                pincode: defaultAddress.pincode,
                country: defaultAddress.country
              });
            }
          }
        } catch (error) {
          console.error('Error loading addresses:', error);
        }
      }
    };
    
    loadUserData();
  }, [isAuthenticated, user]);
  
  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 50000 ? 0 : 1500; // Free shipping over ₹50,000
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + shipping + tax;
  
  const handleCustomerInfoChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSavedAddressSelect = (addressId) => {
    setSelectedAddressId(addressId);
    const address = savedAddresses.find(addr => addr._id === addressId);
    if (address) {
      setShippingAddress({
        address: address.address,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        country: address.country
      });
      setShowNewAddressForm(false);
    }
  };
  
  const saveCurrentAddress = async () => {
    if (!isAuthenticated || !user) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/auth/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...shippingAddress,
          isDefault: savedAddresses.length === 0
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setSavedAddresses(data.addresses);
        const newAddress = data.addresses[data.addresses.length - 1];
        setSelectedAddressId(newAddress._id);
        setShowNewAddressForm(false);
        showSuccess('Address saved successfully!');
      } else {
        showError(data.message || 'Failed to save address');
      }
    } catch (error) {
      console.error('Error saving address:', error);
      showError('Failed to save address');
    }
  };
  
  const handleSubmitOrder = async () => {
    if (!customerInfo.firstName || !customerInfo.email || !shippingAddress.address) {
      showError('Please fill in all required fields');
      return;
    }
    
    setProcessing(true);
    
    try {
      if (paymentMethod === 'razorpay') {
        await handleRazorpayPayment();
      } else if (paymentMethod === 'upi') {
        await handleUPIPayment();
      } else {
        await handleCODOrder();
      }
    } catch (error) {
      console.error('Order processing error:', error);
      showError('Failed to process order. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleCODOrder = async () => {
    try {
      const userId = localStorage.getItem('userId') || 'demo-user-123';
      
      const orderData = {
        userId,
        customerInfo,
        shippingAddress,
        paymentMethod: 'cod',
        items: cartItems.map(item => ({
          productId: item._id,
          quantity: item.quantity,
          price: item.price,
          name: item.name,
          image: item.image
        })),
        totalPrice: total,
        subtotal,
        shipping,
        tax,
        paymentStatus: 'pending'
      };
      
      // Save order to backend
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Clear cart
        await fetch(`http://localhost:5000/api/cart/clear/${userId}`, { method: 'DELETE' });
        
        showSuccess('Order placed successfully!');
        
        // Redirect to orders page after 2 seconds
        setTimeout(() => {
          navigate('/orders');
        }, 2000);
      } else {
        showError('Order creation failed. Please contact support.');
        setProcessing(false);
      }
    } catch (error) {
      console.error('Error creating COD order:', error);
      showError('Order creation failed. Please contact support.');
      setProcessing(false);
    }
  };

  const handleUPIPayment = async () => {
    // Create UPI payment link
    const upiId = 'darshanvasoya75@gmail.com'; // Your UPI ID
    const amount = total;
    const orderRef = 'ORD-' + Date.now();
    
    // UPI payment URL format
    const upiUrl = `upi://pay?pa=${upiId}&pn=LVS Machine and Tools&am=${amount}&cu=INR&tn=Order Payment - ${orderRef}`;
    
    // For web, show UPI QR code or payment instructions
    const confirmPayment = window.confirm(
      `UPI Payment of ₹${amount.toLocaleString('en-IN')}\n\n` +
      `Pay to: ${upiId}\n` +
      `Amount: ₹${amount}\n` +
      `Reference: ${orderRef}\n\n` +
      `Click OK to open UPI payment or manually transfer the amount and then confirm your payment.`
    );
    
    if (confirmPayment) {
      // Try to open UPI app
      try {
        window.open(upiUrl, '_blank');
        console.log('Opened UPI payment URL:', upiUrl);
      } catch (err) {
        console.log('Could not open UPI app:', err.message);
      }
      
      // Show payment confirmation dialog
      setTimeout(() => {
        const paymentConfirmed = window.confirm(
          'Have you completed the UPI payment?\n\n' +
          'Click OK if payment is completed, or Cancel to try again.'
        );
        
        if (paymentConfirmed) {
          completeOrder('upi', orderRef);
        } else {
          setProcessing(false);
          showError('Payment cancelled. Please try again when ready.');
        }
      }, 2000);
    } else {
      setProcessing(false);
    }
  };

  const handleRazorpayPayment = async () => {
    try {
      // Check if Razorpay is loaded
      if (!window.Razorpay) {
        showError('Razorpay SDK not loaded. Please refresh the page and try again.');
        setProcessing(false);
        return;
      }

      console.log('Creating Razorpay order for amount:', total);

      // Create Razorpay order
      const response = await fetch('http://localhost:5000/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(total), // Backend will convert to paise
          currency: 'INR',
          receipt: 'order_' + Date.now()
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const orderData = await response.json();
      console.log('Razorpay order response:', orderData);
      
      if (!orderData.success) {
        throw new Error(orderData.message || 'Failed to create Razorpay order');
      }
      
      // Configure Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'LVS Machine and Tools',
        description: 'Order Payment',
        order_id: orderData.order.id,
        prefill: {
          name: `${customerInfo.firstName} ${customerInfo.lastName}`,
          email: customerInfo.email,
          contact: customerInfo.phone
        },
        theme: {
          color: '#000000'
        },
        handler: function(response) {
          console.log('Razorpay payment success:', response);
          verifyRazorpayPayment(response);
        },
        modal: {
          ondismiss: function() {
            console.log('Razorpay payment cancelled');
            setProcessing(false);
            showError('Payment cancelled by user');
          }
        }
      };
      
      console.log('Opening Razorpay with options:', options);
      
      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
    } catch (error) {
      console.error('Razorpay payment error:', error);
      showError(error.message || 'Failed to initialize payment. Please try again.');
      setProcessing(false);
    }
  };

  const verifyRazorpayPayment = async (paymentResponse) => {
    try {
      const response = await fetch('http://localhost:5000/api/payment/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_signature: paymentResponse.razorpay_signature
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        completeOrder('razorpay', paymentResponse.razorpay_payment_id);
      } else {
        showError('Payment verification failed. Please contact support.');
        setProcessing(false);
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      showError('Payment verification failed. Please contact support.');
      setProcessing(false);
    }
  };

  const completeOrder = async (paymentType, paymentRef) => {
    try {
      const userId = localStorage.getItem('userId') || 'demo-user-123';
      
      const orderData = {
        userId,
        customerInfo,
        shippingAddress,
        paymentMethod: paymentType,
        paymentReference: paymentRef,
        items: cartItems.map(item => ({
          productId: item._id,
          quantity: item.quantity,
          price: item.price,
          name: item.name,
          image: item.image
        })),
        totalPrice: total,
        subtotal,
        shipping,
        tax,
        paymentStatus: 'success',
        razorpayPaymentId: paymentRef
      };
      
      // Save order to backend
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Clear cart
        await fetch(`http://localhost:5000/api/cart/clear/${userId}`, { method: 'DELETE' });
        
        showSuccess('Payment successful! Order confirmed.');
        
        // Redirect to orders page after 2 seconds
        setTimeout(() => {
          navigate('/orders');
        }, 2000);
      } else {
        showError('Order creation failed. Please contact support.');
        setProcessing(false);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      showError('Order creation failed. Please contact support.');
      setProcessing(false);
    }
  };
  
  if (loading) {
    return (
      <div className="checkout-loading">
        <div className="loading-spinner"></div>
        <p>Loading checkout...</p>
      </div>
    );
  }
  
  if (cartItems.length === 0) {
    return (
      <div className="checkout-empty">
        <h2>Your cart is empty</h2>
        <p>Add some products before checking out.</p>
        <button onClick={() => navigate('/products')} className="btn-primary">
          Continue Shopping
        </button>
      </div>
    );
  }
  
  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-header">
          <h1>Checkout</h1>
          <div className="checkout-steps">
            <div className="step active">
              <span className="step-number">1</span>
              <span className="step-label">Information</span>
            </div>
            <div className="step">
              <span className="step-number">2</span>
              <span className="step-label">Payment</span>
            </div>
            <div className="step">
              <span className="step-number">3</span>
              <span className="step-label">Confirmation</span>
            </div>
          </div>
        </div>
        
        <div className="checkout-content">
          <div className="checkout-forms">
            {/* Customer Information */}
            <div className="form-section">
              <h3>Customer Information</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={customerInfo.firstName}
                    onChange={handleCustomerInfoChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={customerInfo.lastName}
                    onChange={handleCustomerInfoChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={customerInfo.email}
                    onChange={handleCustomerInfoChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={customerInfo.phone}
                    onChange={handleCustomerInfoChange}
                  />
                </div>
                <div className="form-group full-width">
                  <label>Company (Optional)</label>
                  <input
                    type="text"
                    name="company"
                    value={customerInfo.company}
                    onChange={handleCustomerInfoChange}
                  />
                </div>
              </div>
            </div>
            
            {/* Delivery Address */}
            <div className="form-section">
              <div className="section-header">
                <h3>Delivery Address</h3>
                {isAuthenticated && savedAddresses.length > 0 && (
                  <button
                    className="btn-secondary"
                    onClick={() => setShowNewAddressForm(!showNewAddressForm)}
                  >
                    {showNewAddressForm ? 'Use Saved Address' : 'Add New Address'}
                  </button>
                )}
              </div>
              
              {/* Saved Addresses */}
              {isAuthenticated && savedAddresses.length > 0 && !showNewAddressForm && (
                <div className="saved-addresses">
                  {savedAddresses.map(address => (
                    <label key={address._id} className="address-option">
                      <input
                        type="radio"
                        name="selectedAddress"
                        value={address._id}
                        checked={selectedAddressId === address._id}
                        onChange={() => handleSavedAddressSelect(address._id)}
                      />
                      <div className="address-details">
                        <div className="address-line">
                          {address.address}
                        </div>
                        <div className="address-line">
                          {address.city}, {address.state} {address.pincode}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
              
              {/* New Address Form */}
              {(showNewAddressForm || savedAddresses.length === 0) && (
                <div className="address-form">
                  <div className="form-grid">
                    <div className="form-group full-width">
                      <label>Address *</label>
                      <textarea
                        name="address"
                        value={shippingAddress.address}
                        onChange={handleAddressChange}
                        required
                        rows="3"
                      />
                    </div>
                    <div className="form-group">
                      <label>City *</label>
                      <input
                        type="text"
                        name="city"
                        value={shippingAddress.city}
                        onChange={handleAddressChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>State *</label>
                      <input
                        type="text"
                        name="state"
                        value={shippingAddress.state}
                        onChange={handleAddressChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Pincode *</label>
                      <input
                        type="text"
                        name="pincode"
                        value={shippingAddress.pincode}
                        onChange={handleAddressChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Country</label>
                      <select
                        name="country"
                        value={shippingAddress.country}
                        onChange={handleAddressChange}
                      >
                        <option value="India">India</option>
                      </select>
                    </div>
                  </div>
                  
                  {isAuthenticated && (
                    <button
                      type="button"
                      className="btn-save-address"
                      onClick={saveCurrentAddress}
                    >
                      Save Address for Future Orders
                    </button>
                  )}
                </div>
              )}
            </div>
            
            {/* Payment Method */}
            <div className="form-section">
              <h3>Payment Method</h3>
              <div className="payment-methods">
                <label className="payment-option">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className="payment-details">
                    <div className="payment-title">Cash on Delivery</div>
                    <div className="payment-description">Pay when you receive your order</div>
                  </div>
                </label>
                
                <label className="payment-option">
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className="payment-details">
                    <div className="payment-title">UPI Payment</div>
                    <div className="payment-description">Pay using UPI apps (PhonePe, GPay, Paytm)</div>
                  </div>
                </label>
                
                <label className="payment-option">
                  <input
                    type="radio"
                    name="payment"
                    value="razorpay"
                    checked={paymentMethod === 'razorpay'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className="payment-details">
                    <div className="payment-title">Online Payment (Razorpay)</div>
                    <div className="payment-description">Pay with Credit/Debit Card, Net Banking, UPI</div>
                  </div>
                </label>
                
                <label className="payment-option">
                  <input
                    type="radio"
                    name="payment"
                    value="bank"
                    checked={paymentMethod === 'bank'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className="payment-details">
                    <div className="payment-title">Bank Transfer</div>
                    <div className="payment-description">Transfer to our bank account</div>
                  </div>
                </label>
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="order-summary">
            <h3>Order Summary</h3>
            
            <div className="cart-items">
              {cartItems.map(item => (
                <div key={`${item.productId}-${item._id}`} className="cart-item">
                  <img 
                    src={item.productId?.image || '/images/placeholder-product.svg'} 
                    alt={item.productId?.name || 'Product'}
                    className="item-image"
                  />
                  <div className="item-details">
                    <h4>{item.productId?.name || 'Product'}</h4>
                    <p>Quantity: {item.quantity}</p>
                    <p className="item-price">₹{item.price?.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="order-totals">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="total-row">
                <span>Shipping:</span>
                <span>{shipping === 0 ? 'Free' : `₹${shipping.toLocaleString('en-IN')}`}</span>
              </div>
              <div className="total-row">
                <span>GST (18%):</span>
                <span>₹{tax.toLocaleString('en-IN')}</span>
              </div>
              <div className="total-row total">
                <span>Total:</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>
            
            <button
              className="btn-place-order"
              onClick={handleSubmitOrder}
              disabled={processing}
            >
              {processing ? 'Processing...' : 'Place Order'}
            </button>
            
            <div className="security-info">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m0 0v2m0-2h2m-2 0H10m4-9.5c0-1.38-1.12-2.5-2.5-2.5S9 7.12 9 8.5v1h6v-1z"/>
              </svg>
              Your information is secure and encrypted
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPageNew;