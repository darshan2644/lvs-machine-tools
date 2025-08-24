import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './OrdersPage.css';

const OrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, pending, delivered, cancelled

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId') || 'demo-user-123';
      
      // First try backend API
      try {
        const response = await axios.get(`http://localhost:5000/api/order/user/${userId}`);
        if (response.data.success) {
          setOrders(response.data.orders);
          console.log('Orders loaded from backend:', response.data.orders);
        } else {
          throw new Error('Backend returned no orders');
        }
      } catch (backendError) {
        console.log('Backend not available, loading from localStorage');
        // Fallback to localStorage
        const savedOrders = localStorage.getItem('lvsOrders');
        if (savedOrders) {
          const parsedOrders = JSON.parse(savedOrders);
          setOrders(parsedOrders);
        } else {
          setOrders([]);
        }
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders');
      setOrders([]);
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
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'order placed':
      case 'placed':
        return '#3B82F6';
      case 'packed':
        return '#F59E0B';
      case 'shipped':
      case 'out for delivery':
        return '#DAA520';
      case 'delivered':
        return '#10B981';
      case 'cancelled':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'order placed':
      case 'placed':
        return '📋';
      case 'packed':
        return '📦';
      case 'shipped':
        return '🚚';
      case 'out for delivery':
        return '🏃‍♂️';
      case 'delivered':
        return '✅';
      case 'cancelled':
        return '❌';
      default:
        return '📄';
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    if (filter === 'pending') return !['delivered', 'cancelled'].includes(order.orderStatus?.toLowerCase());
    if (filter === 'delivered') return order.orderStatus?.toLowerCase() === 'delivered';
    if (filter === 'cancelled') return order.orderStatus?.toLowerCase() === 'cancelled';
    return true;
  });

  const handleOrderClick = (orderId) => {
    navigate(`/order-tracking/${orderId}`);
  };

  const handleReorder = (order) => {
    // Add items back to cart and navigate to checkout
    const cartItems = order.items.map(item => ({
      _id: item.productId?._id || item.productId,
      name: item.name || item.productId?.name || 'Product',
      price: item.price,
      quantity: item.quantity,
      image: item.image || item.productId?.images?.[0] || '/images/placeholder-product.svg'
    }));
    
    localStorage.setItem('lvsCartItems', JSON.stringify(cartItems));
    window.dispatchEvent(new CustomEvent('cartUpdated'));
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="orders-page">
        <div className="container">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="elegant-orders-page">
      <div className="container">
        {/* Page Header */}
        <div className="orders-header animate-fade-in">
          <div className="header-content">
            <span className="orders-subtitle">MY ACCOUNT</span>
            <h1 className="orders-title">
              My <span className="text-brown">Orders</span>
            </h1>
            <p className="orders-description">
              Track and manage all your orders in one place
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="orders-filters animate-slide-in-left">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            <span className="filter-icon">📋</span>
            <span>All Orders</span>
            <span className="filter-count">{orders.length}</span>
          </button>
          <button 
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            <span className="filter-icon">⏳</span>
            <span>In Progress</span>
            <span className="filter-count">
              {orders.filter(o => !['delivered', 'cancelled'].includes(o.orderStatus?.toLowerCase())).length}
            </span>
          </button>
          <button 
            className={`filter-btn ${filter === 'delivered' ? 'active' : ''}`}
            onClick={() => setFilter('delivered')}
          >
            <span className="filter-icon">✅</span>
            <span>Delivered</span>
            <span className="filter-count">
              {orders.filter(o => o.orderStatus?.toLowerCase() === 'delivered').length}
            </span>
          </button>
          <button 
            className={`filter-btn ${filter === 'cancelled' ? 'active' : ''}`}
            onClick={() => setFilter('cancelled')}
          >
            <span className="filter-icon">❌</span>
            <span>Cancelled</span>
            <span className="filter-count">
              {orders.filter(o => o.orderStatus?.toLowerCase() === 'cancelled').length}
            </span>
          </button>
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

        {/* Orders List */}
        <div className="orders-content animate-slide-in-right">
          {filteredOrders.length === 0 ? (
            <div className="empty-orders">
              <div className="empty-icon">
                {filter === 'all' ? '📦' : filter === 'delivered' ? '✅' : filter === 'cancelled' ? '❌' : '⏳'}
              </div>
              <h2>
                {filter === 'all' ? 'No orders yet' :
                 filter === 'delivered' ? 'No delivered orders' :
                 filter === 'cancelled' ? 'No cancelled orders' :
                 'No orders in progress'}
              </h2>
              <p>
                {filter === 'all' 
                  ? 'Start shopping to see your orders here'
                  : `You don't have any ${filter} orders at the moment`}
              </p>
              {filter === 'all' && (
                <button onClick={() => navigate('/products')} className="btn btn-primary">
                  Start Shopping
                </button>
              )}
            </div>
          ) : (
            <div className="orders-list">
              {filteredOrders.map((order) => (
                <div key={order._id || order.orderId} className="order-card hover-lift">
                  <div className="order-header">
                    <div className="order-info">
                      <div className="order-number">
                        <span className="order-label">Order ID:</span>
                        <span className="order-id">{order.orderId || order._id}</span>
                      </div>
                      <div className="order-date">
                        <span className="date-icon">📅</span>
                        <span>{formatDate(order.createdAt || order.orderDate)}</span>
                      </div>
                    </div>
                    <div className="order-status">
                      <div 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(order.orderStatus) }}
                      >
                        <span className="status-icon">{getStatusIcon(order.orderStatus)}</span>
                        <span>{order.orderStatus || 'Order Placed'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="order-body">
                    {/* Order Items Preview */}
                    <div className="order-items-preview">
                      {order.items?.slice(0, 2).map((item, index) => (
                        <div key={index} className="item-preview">
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
                          <div className="item-info">
                            <h4 className="item-name">{item.name || item.productId?.name || 'Product'}</h4>
                            <p className="item-quantity">Qty: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                      {order.items?.length > 2 && (
                        <div className="more-items">
                          <span>+{order.items.length - 2} more items</span>
                        </div>
                      )}
                    </div>

                    {/* Order Summary */}
                    <div className="order-summary">
                      <div className="summary-row">
                        <span className="summary-label">Total Amount:</span>
                        <span className="summary-value">{formatCurrency(order.totalPrice || 0)}</span>
                      </div>
                      <div className="summary-row">
                        <span className="summary-label">Payment:</span>
                        <span className="summary-value">
                          {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 
                           order.paymentMethod === 'card' ? 'Credit/Debit Card' : 
                           order.paymentMethod === 'razorpay' ? 'Razorpay' :
                           order.paymentMethod || 'COD'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="order-footer">
                    <div className="order-actions">
                      <button 
                        onClick={() => handleOrderClick(order.orderId || order._id)}
                        className="btn btn-outline btn-sm"
                      >
                        <span className="btn-icon">👁️</span>
                        <span>View Details</span>
                      </button>
                      
                      {order.orderStatus?.toLowerCase() !== 'cancelled' && (
                        <button 
                          onClick={() => navigate(`/order-tracking/${order.orderId || order._id}`)}
                          className="btn btn-secondary btn-sm"
                        >
                          <span className="btn-icon">📍</span>
                          <span>Track Order</span>
                        </button>
                      )}

                      {order.orderStatus?.toLowerCase() === 'delivered' && (
                        <button 
                          onClick={() => handleReorder(order)}
                          className="btn btn-primary btn-sm"
                        >
                          <span className="btn-icon">🔄</span>
                          <span>Reorder</span>
                        </button>
                      )}
                    </div>

                    {order.orderStatus?.toLowerCase() === 'delivered' && (
                      <div className="delivery-info">
                        <span className="delivery-icon">✅</span>
                        <span className="delivery-text">
                          Delivered on {formatDate(order.deliveredAt || order.estimatedDelivery)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Support Section */}
        <div className="support-section animate-fade-in">
          <div className="support-content">
            <h3>Need Help with Your Orders?</h3>
            <p>Our customer support team is here to assist you</p>
            <div className="support-actions">
              <button onClick={() => navigate('/contact')} className="btn btn-outline">
                <span className="btn-icon">📞</span>
                <span>Contact Support</span>
              </button>
              <button onClick={() => navigate('/help')} className="btn btn-outline">
                <span className="btn-icon">❓</span>
                <span>Help Center</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
