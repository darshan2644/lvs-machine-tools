import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './OrderConfirmationPage.css';

const OrderConfirmationPageEnhanced = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [customerInfo, setCustomerInfo] = useState(null);

  useEffect(() => {
    // First check if order data was passed via navigation state
    if (location.state?.order) {
      setOrder(location.state.order);
      setCustomerInfo(location.state.customerInfo);
      setLoading(false);
    } else if (orderId) {
      // Fetch order from backend
      fetchOrderDetails();
    } else {
      setError('No order ID provided');
      setLoading(false);
    }
  }, [orderId, location.state]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/order/${orderId}`);
      
      if (response.data.success) {
        setOrder(response.data.order);
      } else {
        setError('Order not found');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'order placed':
      case 'placed':
        return 'var(--info)';
      case 'packed':
        return 'var(--warning)';
      case 'shipped':
      case 'out for delivery':
        return 'var(--accent-gold)';
      case 'delivered':
        return 'var(--success)';
      case 'cancelled':
        return 'var(--error)';
      default:
        return 'var(--info)';
    }
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  const handleTrackOrder = () => {
    navigate(`/order-tracking/${orderId || order.orderId}`);
  };

  const handleViewOrders = () => {
    navigate('/orders');
  };

  if (loading) {
    return (
      <div className="order-confirmation-page">
        <div className="container">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-confirmation-page">
        <div className="container">
          <div className="error-container">
            <div className="error-icon">❌</div>
            <h2>Order Not Found</h2>
            <p>{error}</p>
            <button onClick={() => navigate('/')} className="btn btn-primary">
              Go to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-confirmation-page">
        <div className="container">
          <div className="error-container">
            <div className="error-icon">📦</div>
            <h2>No Order Found</h2>
            <p>We couldn't find the order details.</p>
            <button onClick={() => navigate('/')} className="btn btn-primary">
              Go to Homepage
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
        <div className="confirmation-header animate-fade-in">
          <div className="success-animation">
            <div className="success-checkmark">
              <div className="check-icon">
                <span className="icon-line line-tip"></span>
                <span className="icon-line line-long"></span>
                <div className="icon-circle"></div>
                <div className="icon-fix"></div>
              </div>
            </div>
          </div>
          <div className="success-content">
            <h1 className="success-title">Order Confirmed!</h1>
            <p className="success-subtitle">
              Thank you for your order. Your order has been placed successfully.
            </p>
            <div className="order-number">
              Order ID: <span className="order-id">{order.orderId || order._id}</span>
            </div>
          </div>
        </div>

        <div className="confirmation-content">
          <div className="confirmation-main">
            {/* Order Status */}
            <div className="elegant-section animate-slide-in-left">
              <div className="section-header">
                <div className="section-icon">📋</div>
                <h2>Order Status</h2>
                <p>Current status of your order</p>
              </div>
              <div className="order-status-card">
                <div className="status-badge" style={{ backgroundColor: getStatusColor(order.orderStatus) }}>
                  {order.orderStatus || 'Order Placed'}
                </div>
                <div className="order-timeline">
                  <div className="timeline-item active">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <h4>Order Placed</h4>
                      <p>{formatDate(order.createdAt || order.orderDate)}</p>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <h4>Order Packed</h4>
                      <p>Processing...</p>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <h4>Shipped</h4>
                      <p>Pending</p>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <h4>Delivered</h4>
                      <p>Estimated: {order.estimatedDelivery ? formatDate(order.estimatedDelivery) : '5-7 business days'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="elegant-section animate-slide-in-left">
              <div className="section-header">
                <div className="section-icon">📦</div>
                <h2>Order Items</h2>
                <p>Items in your order</p>
              </div>
              <div className="order-items-list">
                {order.items?.map((item, index) => (
                  <div key={item._id || index} className="order-item-card">
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
                      <h4 className="item-name">{item.name || item.productId?.name || 'Product'}</h4>
                      <p className="item-brand">{item.productId?.brand || 'LVS Tools'}</p>
                      <div className="item-meta">
                        <span className="item-quantity">Qty: {item.quantity}</span>
                        <span className="item-price">{formatCurrency(item.price || 0)}</span>
                      </div>
                    </div>
                    <div className="item-total">
                      <span className="total-label">Total</span>
                      <span className="total-amount">{formatCurrency((item.price || 0) * item.quantity)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Information */}
            <div className="elegant-section animate-slide-in-left">
              <div className="section-header">
                <div className="section-icon">🏠</div>
                <h2>Delivery Information</h2>
                <p>Where we'll deliver your order</p>
              </div>
              <div className="delivery-info-card">
                {order.shippingAddress && (
                  <div className="address-section">
                    <h4>Delivery Address</h4>
                    <div className="address-details">
                      <p className="recipient-name">{order.shippingAddress.fullName}</p>
                      <p>{order.shippingAddress.address}</p>
                      <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
                      <p>{order.shippingAddress.country || 'India'}</p>
                      {order.shippingAddress.phone && (
                        <p className="phone-number">📞 {order.shippingAddress.phone}</p>
                      )}
                    </div>
                  </div>
                )}
                <div className="delivery-estimate">
                  <h4>Estimated Delivery</h4>
                  <p className="delivery-date">
                    {order.estimatedDelivery ? formatDate(order.estimatedDelivery) : 'Within 5-7 business days'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="confirmation-sidebar animate-slide-in-right">
            <div className="elegant-order-summary">
              <div className="summary-header">
                <div className="summary-icon">💰</div>
                <h2>Order Summary</h2>
                <p>Payment and pricing details</p>
              </div>

              {/* Payment Info */}
              <div className="payment-info-card">
                <div className="payment-method">
                  <span className="payment-label">Payment Method</span>
                  <span className="payment-value">
                    {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 
                     order.paymentMethod === 'card' ? 'Credit/Debit Card' : 
                     order.paymentMethod === 'razorpay' ? 'Razorpay' :
                     order.paymentMethod || 'COD'}
                  </span>
                </div>
                <div className="payment-status">
                  <span className="status-label">Payment Status</span>
                  <span className={`status-value ${order.paymentStatus || 'pending'}`}>
                    {order.paymentStatus === 'success' ? 'Paid' : 
                     order.paymentStatus === 'pending' ? 'Pending' : 
                     'Pending'}
                  </span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="price-breakdown">
                <div className="price-row">
                  <span>Subtotal</span>
                  <span>{formatCurrency(order.subtotal || 0)}</span>
                </div>
                <div className="price-row">
                  <span>Tax (GST)</span>
                  <span>{formatCurrency(order.tax || 0)}</span>
                </div>
                <div className="price-row">
                  <span>Shipping</span>
                  <span>{formatCurrency(order.shipping || 0)}</span>
                </div>
                <div className="price-row total-row">
                  <span>Total Amount</span>
                  <span className="total-amount">{formatCurrency(order.totalPrice || 0)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
                <button onClick={handleTrackOrder} className="btn btn-primary">
                  <span className="btn-icon">📍</span>
                  <span>Track Order</span>
                </button>
                <button onClick={handleViewOrders} className="btn btn-secondary">
                  <span className="btn-icon">📋</span>
                  <span>View All Orders</span>
                </button>
                <button onClick={handleContinueShopping} className="btn btn-outline">
                  <span className="btn-icon">🛍️</span>
                  <span>Continue Shopping</span>
                </button>
              </div>

              {/* Contact Support */}
              <div className="support-info">
                <h4>Need Help?</h4>
                <p>Contact our customer support team</p>
                <div className="support-links">
                  <a href="tel:+91-9999999999" className="support-link">
                    <span className="support-icon">📞</span>
                    <span>+91-9999999999</span>
                  </a>
                  <a href="mailto:support@lvsmachinetools.com" className="support-link">
                    <span className="support-icon">📧</span>
                    <span>support@lvsmachinetools.com</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Thank You Message */}
        <div className="thank-you-section animate-fade-in">
          <div className="thank-you-content">
            <h3>Thank you for choosing LVS Machine & Tools!</h3>
            <p>We appreciate your business and look forward to serving you again.</p>
            <div className="social-links">
              <span>Follow us:</span>
              <a href="#" className="social-link">Facebook</a>
              <a href="#" className="social-link">Instagram</a>
              <a href="#" className="social-link">LinkedIn</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPageEnhanced;
