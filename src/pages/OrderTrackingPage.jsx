import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './OrderTrackingPage.css';

const OrderTrackingPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/orders/track/${orderId}`);
        
        if (response.data.success) {
          setOrder(response.data.order);
        } else {
          setError('Order not found');
        }
      } catch (error) {
        console.error('Error fetching order:', error);
        setError('Failed to fetch order details');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    } else {
      setError('No order ID provided');
      setLoading(false);
    }
  }, [orderId]);

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      setCancelling(true);
      const response = await axios.post(`http://localhost:5000/api/orders/cancel/${orderId}`);
      
      if (response.data.success) {
        setOrder(prev => ({ ...prev, orderStatus: 'cancelled' }));
        alert('Order cancelled successfully');
      } else {
        alert(response.data.message || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const canCancelOrder = (status) => {
    return ['placed', 'packed'].includes(status);
  };

  if (loading) {
    return (
      <div className="order-tracking-page">
        <div className="container">
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-tracking-page">
        <div className="container">
          <div className="error-container">
            <h2>Error</h2>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={() => navigate('/')}>
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-tracking-page">
        <div className="container">
          <div className="error-container">
            <h2>Order Not Found</h2>
            <p>The order you're looking for doesn't exist.</p>
            <button className="btn btn-primary" onClick={() => navigate('/')}>
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-tracking-page">
      <div className="container">
        {/* Header Section */}
        <div className="order-header">
          <button className="back-button" onClick={() => navigate('/products')}>
            ← Back
          </button>
          <div className="header-content">
            <h1>Order #{orderId.slice(-8)}</h1>
            <p className="order-date">Order placed on {formatDate(order.createdAt)}</p>
          </div>
        </div>

        {/* Order Status Section */}
        <div className="order-status-card">
          <div className="status-header">
            <div className="status-info">
              <div className={`status-indicator ${order.orderStatus}`}></div>
              <div>
                <h2 className="status-title">
                  {order.orderStatus === 'placed' && 'Order Confirmed'}
                  {order.orderStatus === 'packed' && 'Order Packed'}
                  {order.orderStatus === 'shipped' && 'Order Shipped'}
                  {order.orderStatus === 'delivered' && 'Order Delivered'}
                  {order.orderStatus === 'cancelled' && 'Order Cancelled'}
                </h2>
                <p className="status-subtitle">Your order has been {order.orderStatus}</p>
              </div>
            </div>
            <div className="order-total">
              <span className="total-label">Total</span>
              <span className="total-amount">₹{order.totalPrice?.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Timeline */}
          <div className="timeline">
            <div className={`timeline-item ${order.orderStatus === 'placed' || ['packed', 'shipped', 'delivered'].includes(order.orderStatus) ? 'completed' : ''}`}>
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h3>Order Confirmed</h3>
                <p>Your order has been placed successfully</p>
                <span className="timeline-date">{formatDate(order.createdAt)}</span>
              </div>
            </div>

            <div className={`timeline-item ${['packed', 'shipped', 'delivered'].includes(order.orderStatus) ? 'completed' : ''}`}>
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h3>Order Packed</h3>
                <p>Your item has been packed and ready for shipping</p>
                {order.orderStatus === 'packed' && <span className="timeline-date">Expected by tomorrow</span>}
              </div>
            </div>

            <div className={`timeline-item ${['shipped', 'delivered'].includes(order.orderStatus) ? 'completed' : ''}`}>
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h3>Order Shipped</h3>
                <p>Your order is on the way</p>
                {order.orderStatus === 'shipped' && <span className="timeline-date">Expected delivery in 2-3 days</span>}
              </div>
            </div>

            <div className={`timeline-item ${order.orderStatus === 'delivered' ? 'completed' : ''}`}>
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h3>Delivered</h3>
                <p>Your order has been delivered successfully</p>
                {order.orderStatus === 'delivered' && <span className="timeline-date">Delivered today</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="product-details-card">
          <h2>Items in this order</h2>
          {order.items && order.items.map((item, index) => (
            <div key={index} className="product-item">
              <div className="product-image">
                <img 
                  src={item.productId?.image || '/images/placeholder-product.svg'} 
                  alt={item.productId?.name || 'Product'}
                />
              </div>
              <div className="product-info">
                <h3>{item.productId?.name || 'Product Name'}</h3>
                <p className="product-brand">Brand: {item.productId?.brand || 'LVS'}</p>
                <p className="product-description">{item.productId?.description || 'High-quality machine tool'}</p>
                <div className="product-pricing">
                  <span className="quantity">Qty: {item.quantity}</span>
                  <span className="price">₹{item.price?.toLocaleString('en-IN')} each</span>
                </div>
              </div>
              <div className="item-total">
                <span>₹{(item.price * item.quantity)?.toLocaleString('en-IN')}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Price Breakdown */}
        <div className="price-details-card">
          <h2>Price Details</h2>
          <div className="price-breakdown">
            <div className="price-row">
              <span>Item Total</span>
              <span>₹{(order.totalPrice - (order.tax || 0))?.toLocaleString('en-IN')}</span>
            </div>
            {order.tax > 0 && (
              <div className="price-row">
                <span>Taxes & GST</span>
                <span>₹{order.tax?.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="price-row">
              <span>Delivery Charges</span>
              <span className="free">FREE</span>
            </div>
            <div className="price-row total-row">
              <span>Order Total</span>
              <span>₹{order.totalPrice?.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Delivery & Payment Info */}
        <div className="info-cards">
          <div className="delivery-info-card">
            <h3>Delivery Address</h3>
            <div className="address">
              <p><strong>LVS Machine & Tools</strong></p>
              <p>Industrial Area, Rajkot</p>
              <p>Gujarat - 360001</p>
              <p>Phone: +91 98765 43210</p>
            </div>
          </div>

          <div className="payment-info-card">
            <h3>Payment Information</h3>
            <div className="payment-details">
              <p><strong>Payment Method:</strong> {order.paymentMethod?.toUpperCase() || 'COD'}</p>
              <p><strong>Payment Status:</strong> {order.paymentStatus || 'Pending'}</p>
              {order.razorpayOrderId && (
                <p><strong>Transaction ID:</strong> {order.razorpayOrderId}</p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          {canCancelOrder(order.orderStatus) && (
            <button 
              className="btn btn-outline cancel-btn"
              onClick={handleCancelOrder}
              disabled={cancelling}
            >
              {cancelling ? 'Cancelling...' : 'Cancel Order'}
            </button>
          )}
          
          <button 
            className="btn btn-primary continue-btn"
            onClick={() => navigate('/products')}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;