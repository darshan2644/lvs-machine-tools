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
          setLoading(false);
          return;
        }

        // Otherwise fetch from API
        const response = await fetch(`http://localhost:5000/api/orders/${orderId}`);
        const data = await response.json();

        if (data.success) {
          setOrder(data.order);
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
  }, [orderId, orderFromState]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
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
