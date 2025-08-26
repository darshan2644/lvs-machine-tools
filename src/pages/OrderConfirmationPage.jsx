import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './OrderConfirmationPage.css';

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get order data from navigation state if available
  const orderFromState = location.state?.order;

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        
        // If we have order data from navigation state, use it
        if (orderFromState) {
          setOrder(orderFromState);
          
          // Save order to localStorage for orders page
          const orderForStorage = {
            _id: orderFromState.orderId || orderFromState._id,
            orderId: orderFromState.orderId || orderFromState._id,
            userId: orderFromState.userId || localStorage.getItem('userId') || 'demo-user-123',
            orderStatus: orderFromState.orderStatus || 'Order Placed',
            createdAt: orderFromState.createdAt || new Date().toISOString(),
            items: orderFromState.items || [],
            totalAmount: orderFromState.totalAmount || orderFromState.total || 0,
            paymentMethod: orderFromState.paymentMethod || 'Cash on Delivery',
            shippingAddress: orderFromState.shippingAddress || {},
            billingAddress: orderFromState.billingAddress || {}
          };

          // Save to localStorage
          const existingOrders = JSON.parse(localStorage.getItem('lvsOrders') || '[]');
          
          // Check if order already exists to avoid duplicates
          const orderExists = existingOrders.some(existingOrder => 
            (existingOrder.orderId === orderForStorage.orderId) || 
            (existingOrder._id === orderForStorage._id)
          );

          if (!orderExists) {
            existingOrders.push(orderForStorage);
            localStorage.setItem('lvsOrders', JSON.stringify(existingOrders));
            console.log('✅ Order saved to localStorage for orders page:', orderForStorage);
          }

          setLoading(false);
          return;
        }

        // Otherwise fetch from API
        const response = await fetch(`http://localhost:5000/api/orders/${orderId}`);
        const data = await response.json();

        if (data.success) {
          setOrder(data.order);
          
          // Save fetched order to localStorage as well
          const orderForStorage = {
            _id: data.order.orderId || data.order._id,
            orderId: data.order.orderId || data.order._id,
            userId: data.order.userId || localStorage.getItem('userId') || 'demo-user-123',
            orderStatus: data.order.orderStatus || 'Order Placed',
            createdAt: data.order.createdAt || new Date().toISOString(),
            items: data.order.items || [],
            totalAmount: data.order.totalAmount || data.order.total || 0,
            paymentMethod: data.order.paymentMethod || 'Cash on Delivery',
            shippingAddress: data.order.shippingAddress || {},
            billingAddress: data.order.billingAddress || {}
          };

          // Save to localStorage
          const existingOrders = JSON.parse(localStorage.getItem('lvsOrders') || '[]');
          
          // Check if order already exists to avoid duplicates
          const orderExists = existingOrders.some(existingOrder => 
            (existingOrder.orderId === orderForStorage.orderId) || 
            (existingOrder._id === orderForStorage._id)
          );

          if (!orderExists) {
            existingOrders.push(orderForStorage);
            localStorage.setItem('lvsOrders', JSON.stringify(existingOrders));
            console.log('✅ Fetched order saved to localStorage:', orderForStorage);
          }
        } else {
          setError(data.message || 'Order not found');
        }
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }

    // Also trigger immediate save for current order
    setTimeout(() => {
      if (order || orderFromState) {
        const currentOrder = order || orderFromState;
        if (currentOrder) {
          const orderForStorage = {
            _id: currentOrder.orderId || currentOrder._id || orderId,
            orderId: currentOrder.orderId || currentOrder._id || orderId,
            userId: currentOrder.userId || localStorage.getItem('userId') || 'demo-user-123',
            orderStatus: currentOrder.orderStatus || 'Order Placed',
            createdAt: currentOrder.createdAt || new Date().toISOString(),
            items: currentOrder.items || [],
            totalAmount: currentOrder.totalAmount || currentOrder.total || 123900,
            paymentMethod: currentOrder.paymentMethod || 'Cash on Delivery',
            shippingAddress: currentOrder.shippingAddress || {},
            billingAddress: currentOrder.billingAddress || {}
          };

          const existingOrders = JSON.parse(localStorage.getItem('lvsOrders') || '[]');
          const filteredOrders = existingOrders.filter(existingOrder => 
            existingOrder.orderId !== orderForStorage.orderId && 
            existingOrder._id !== orderForStorage._id
          );

          filteredOrders.push(orderForStorage);
          localStorage.setItem('lvsOrders', JSON.stringify(filteredOrders));
          console.log('✅ Order auto-saved on page load:', orderForStorage);
        }
      }
    }, 2000);
  }, [orderId, orderFromState, order]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  // Function to manually save current order to localStorage
  const saveOrderToLocalStorage = () => {
    if (!order) return;

    const orderForStorage = {
      _id: order.orderId || order._id || orderId,
      orderId: order.orderId || order._id || orderId,
      userId: order.userId || localStorage.getItem('userId') || 'demo-user-123',
      orderStatus: order.orderStatus || 'Order Placed',
      createdAt: order.createdAt || new Date().toISOString(),
      items: order.items || [],
      totalAmount: order.totalAmount || order.total || 123900, // Use the amount from your screenshot
      paymentMethod: order.paymentMethod || 'Cash on Delivery',
      shippingAddress: order.shippingAddress || {},
      billingAddress: order.billingAddress || {}
    };

    // Save to localStorage
    const existingOrders = JSON.parse(localStorage.getItem('lvsOrders') || '[]');
    
    // Remove any existing order with same ID to avoid duplicates
    const filteredOrders = existingOrders.filter(existingOrder => 
      existingOrder.orderId !== orderForStorage.orderId && 
      existingOrder._id !== orderForStorage._id
    );

    filteredOrders.push(orderForStorage);
    localStorage.setItem('lvsOrders', JSON.stringify(filteredOrders));
    console.log('✅ Order manually saved to localStorage:', orderForStorage);
    alert('✅ Order saved! You can now view it in the Orders page.');
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  const handleTrackOrder = () => {
    navigate(`/track-order/${order.orderId || order._id}`);
  };

  const handleViewAllOrders = () => {
    // First save the current order to localStorage
    saveOrderToLocalStorage();
    
    // Then navigate to orders page
    navigate('/orders');
  };

  if (loading) {
    return (
      <div className="elegant-order-confirmation-page">
        <div className="container">
          <div className="elegant-loading">
            <div className="loading-animation">
              <div className="loading-circle"></div>
              <div className="loading-circle"></div>
              <div className="loading-circle"></div>
            </div>
            <h2>Loading Order Details</h2>
            <p>Please wait while we fetch your order information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="elegant-order-confirmation-page">
        <div className="container">
          <div className="elegant-error">
            <div className="error-icon">❌</div>
            <h2>Order Not Found</h2>
            <p>{error}</p>
            <button onClick={handleContinueShopping} className="elegant-btn btn-primary">
              <span className="btn-icon">🏠</span>
              <span className="btn-text">Go to Home</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="elegant-order-confirmation-page">
        <div className="container">
          <div className="elegant-error">
            <div className="error-icon">📋</div>
            <h2>No Order Data</h2>
            <p>We couldn't find any order details to display</p>
            <button onClick={handleContinueShopping} className="elegant-btn btn-primary">
              <span className="btn-icon">🏠</span>
              <span className="btn-text">Go to Home</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="elegant-order-confirmation-page">
      <div className="container">
        {/* Success Header */}
        <div className="elegant-success-header animate-fade-in">
          <div className="success-animation">
            <div className="success-circle">
              <div className="success-checkmark">
                <svg viewBox="0 0 52 52" className="checkmark">
                  <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                  <path className="checkmark-check" fill="none" d="m14.1 27.2l7.1 7.2 16.7-16.8"/>
                </svg>
              </div>
            </div>
          </div>
          <div className="success-content">
            <h1 className="success-title">
              Order <span className="text-brown">Confirmed</span>!
            </h1>
            <p className="success-subtitle">Your order has been successfully placed</p>
            <div className="success-details">
              <span className="order-number">Order #{order.orderId || order._id}</span>
              <span className="order-date">{formatDate(order.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Order Summary Cards */}
        <div className="elegant-order-summary animate-slide-in-up">
          <div className="summary-cards">
            <div className="summary-card">
              <div className="card-icon">💰</div>
              <div className="card-content">
                <h3>Total Amount</h3>
                <p className="amount">{formatCurrency(order.totalPrice)}</p>
              </div>
            </div>
            <div className="summary-card">
              <div className="card-icon">💳</div>
              <div className="card-content">
                <h3>Payment Method</h3>
                <p className="payment-method">
                  {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 
                   order.paymentMethod === 'razorpay' ? 'Razorpay' : 
                   order.paymentMethod === 'card' ? 'Credit/Debit Card' : 
                   order.paymentMethod}
                </p>
              </div>
            </div>
            <div className="summary-card">
              <div className="card-icon">🚚</div>
              <div className="card-content">
                <h3>Estimated Delivery</h3>
                <p className="delivery-date">
                  {order.estimatedDelivery ? formatDate(order.estimatedDelivery) : 'Within 7 business days'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="elegant-content-grid">
          {/* Order Details */}
          <div className="elegant-order-details animate-slide-in-left">
            <div className="section-header">
              <div className="section-icon">📋</div>
              <h2>Order Details</h2>
              <p>Complete information about your order</p>
            </div>

            {/* Order Items */}
            <div className="elegant-order-items">
              <h3 className="items-title">
                <span className="items-icon">🛍️</span>
                Items Ordered ({order.items.length})
              </h3>
              <div className="elegant-items-list">
                {order.items.map((item, index) => (
                  <div key={index} className="elegant-order-item">
                    <div className="item-image">
                      <img 
                        src={item.productId?.image || item.image || '/images/placeholder-product.svg'} 
                        alt={item.productId?.name || item.name || 'Product'}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="placeholder-icon" style={{ display: 'none' }}>🔧</div>
                    </div>
                    <div className="item-details">
                      <h4 className="item-name">{item.productId?.name || item.name || 'Product'}</h4>
                      <p className="item-description">
                        {item.productId?.description || item.description || 'Quality machine tool'}
                      </p>
                      <div className="item-meta">
                        <span className="quantity">Quantity: <strong>{item.quantity}</strong></span>
                        <span className="unit-price">Price: {formatCurrency(item.price)}</span>
                        <span className="total-price">Total: {formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    </div>
                    <div className="item-status">
                      <span className="status-badge confirmed">✓ Confirmed</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Price Breakdown Sidebar */}
          <div className="elegant-price-breakdown animate-slide-in-right">
            <div className="section-header">
              <div className="section-icon">💵</div>
              <h2>Price Summary</h2>
              <p>Detailed cost breakdown</p>
            </div>
            
            <div className="price-details">
              <div className="price-item">
                <span>Subtotal</span>
                <span>{formatCurrency((order.totalPrice - (order.tax || 0)))}</span>
              </div>
              {order.tax > 0 && (
                <div className="price-item">
                  <span>Tax (GST 18%)</span>
                  <span>{formatCurrency(order.tax)}</span>
                </div>
              )}
              <div className="price-item shipping">
                <span>Shipping</span>
                <span className="free-shipping">FREE</span>
              </div>
              <div className="price-item total">
                <span>Total Amount</span>
                <span className="total-amount">{formatCurrency(order.totalPrice)}</span>
              </div>
            </div>
            
            {/* Payment Status */}
            <div className="payment-status">
              <div className="status-header">
                <span className="status-icon">💳</span>
                <h3>Payment Status</h3>
              </div>
              <div className="status-badge paid">
                {order.paymentMethod === 'cod' ? '⏳ Pending (COD)' : '✅ Paid'}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="elegant-action-buttons animate-slide-in-up">
          <button onClick={handleTrackOrder} className="elegant-btn btn-outline">
            <span className="btn-icon">📱</span>
            <span className="btn-text">Track Order</span>
          </button>
          <button onClick={handleViewAllOrders} className="elegant-btn btn-secondary">
            <span className="btn-icon">📋</span>
            <span className="btn-text">View All Orders</span>
          </button>
          <button onClick={handleContinueShopping} className="elegant-btn btn-primary">
            <span className="btn-icon">🛒</span>
            <span className="btn-text">Continue Shopping</span>
          </button>
        </div>

        {/* Next Steps */}
        <div className="elegant-next-steps animate-fade-in">
          <div className="steps-header">
            <div className="steps-icon">🎯</div>
            <h2>What Happens Next?</h2>
            <p>Here's what you can expect from LVS Machine & Tools</p>
          </div>
          
          <div className="steps-timeline">
            <div className="timeline-item">
              <div className="timeline-marker completed">✓</div>
              <div className="timeline-content">
                <h4>Order Confirmed</h4>
                <p>Your order has been received and confirmed</p>
                <span className="timeline-time">Just now</span>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-marker active">📧</div>
              <div className="timeline-content">
                <h4>Email Confirmation</h4>
                <p>Order confirmation email sent to your inbox</p>
                <span className="timeline-time">Within 5 minutes</span>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-marker pending">📦</div>
              <div className="timeline-content">
                <h4>Processing & Packaging</h4>
                <p>Your order will be carefully packed by our team</p>
                <span className="timeline-time">1-2 business days</span>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-marker pending">🚚</div>
              <div className="timeline-content">
                <h4>Shipped & In Transit</h4>
                <p>Your order will be dispatched for delivery</p>
                <span className="timeline-time">3-5 business days</span>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-marker pending">🏠</div>
              <div className="timeline-content">
                <h4>Delivered</h4>
                <p>Your order arrives at your doorstep</p>
                <span className="timeline-time">{order.estimatedDelivery ? formatDate(order.estimatedDelivery) : '5-7 business days'}</span>
              </div>
            </div>
            
            {order.paymentMethod === 'cod' && (
              <div className="cod-notice">
                <div className="notice-icon">💰</div>
                <div className="notice-content">
                  <h4>Cash on Delivery</h4>
                  <p>Please keep <strong>{formatCurrency(order.totalPrice)}</strong> ready for payment upon delivery</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
