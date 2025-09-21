import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './OrdersPageNew.css';

const OrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, pending, delivered, cancelled
  const [cancelling, setCancelling] = useState(null); // Track which order is being cancelled

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId') || 'demo-user-123';
      
      const response = await fetch(`http://localhost:5000/api/orders?userId=${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setOrders(data.data);
      } else {
        setError(data.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to fetch orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    const confirmCancel = window.confirm(
      'Are you sure you want to cancel this order?\\n\\nThis action cannot be undone.'
    );
    
    if (!confirmCancel) return;

    try {
      setCancelling(orderId);
      
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/cancel`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cancelReason: 'Cancelled by customer'
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Update the order in the state
        setOrders(orders.map(order => 
          order.orderId === orderId 
            ? { ...order, orderStatus: 'Cancelled', cancelledAt: new Date() }
            : order
        ));
        alert('Order cancelled successfully!');
      } else {
        alert(data.message || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Failed to cancel order. Please try again.');
    } finally {
      setCancelling(null);
    }
  };

  const getFilteredOrders = () => {
    if (filter === 'all') return orders;
    if (filter === 'pending') return orders.filter(order => 
      ['Order Placed', 'Packed', 'Shipped', 'Out for Delivery'].includes(order.orderStatus)
    );
    if (filter === 'delivered') return orders.filter(order => order.orderStatus === 'Delivered');
    if (filter === 'cancelled') return orders.filter(order => order.orderStatus === 'Cancelled');
    return orders;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Order Placed': return '#007bff';
      case 'Packed': return '#fd7e14';
      case 'Shipped': return '#6f42c1';
      case 'Out for Delivery': return '#20c997';
      case 'Delivered': return '#28a745';
      case 'Cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredOrders = getFilteredOrders();

  if (loading) {
    return (
      <div className="orders-page">
        <div className="orders-loading">
          <div className="loading-spinner"></div>
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-header">
        <div className="orders-title-section">
          <h1>My Orders</h1>
          <button 
            className="home-button"
            onClick={() => navigate('/')}
          >
            <i className="fas fa-home"></i>
            Go to Home
          </button>
        </div>
        
        <div className="orders-filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Orders ({orders.length})
          </button>
          <button 
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Active ({orders.filter(o => ['Order Placed', 'Packed', 'Shipped', 'Out for Delivery'].includes(o.orderStatus)).length})
          </button>
          <button 
            className={`filter-btn ${filter === 'delivered' ? 'active' : ''}`}
            onClick={() => setFilter('delivered')}
          >
            Delivered ({orders.filter(o => o.orderStatus === 'Delivered').length})
          </button>
          <button 
            className={`filter-btn ${filter === 'cancelled' ? 'active' : ''}`}
            onClick={() => setFilter('cancelled')}
          >
            Cancelled ({orders.filter(o => o.orderStatus === 'Cancelled').length})
          </button>
        </div>
      </div>

      {error && (
        <div className="orders-error">
          <p>{error}</p>
          <button onClick={fetchOrders}>Retry</button>
        </div>
      )}

      {filteredOrders.length === 0 ? (
        <div className="orders-empty">
          <div className="empty-icon">📦</div>
          <h3>No orders found</h3>
          <p>
            {filter === 'all' 
              ? "You haven't placed any orders yet." 
              : `No ${filter} orders found.`
            }
          </p>
          <button 
            className="shop-now-btn"
            onClick={() => navigate('/categories')}
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {filteredOrders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3>Order #{order.orderId}</h3>
                  <p className="order-date">Placed on {formatDate(order.createdAt)}</p>
                </div>
                <div className="order-status">
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(order.orderStatus) }}
                  >
                    {order.orderStatus}
                  </span>
                </div>
              </div>

              <div className="order-items">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <img 
                      src={item.image || '/images/placeholder-product.svg'} 
                      alt={item.name}
                      className="item-image"
                    />
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <p>Quantity: {item.quantity}</p>
                      <p className="item-price">₹{item.price?.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-summary">
                <div className="summary-row">
                  <span>Total Amount:</span>
                  <span className="total-amount">₹{order.totalPrice?.toLocaleString('en-IN')}</span>
                </div>
                <div className="summary-row">
                  <span>Payment Method:</span>
                  <span>{order.paymentMethod === 'razorpay' ? 'Razorpay' : order.paymentMethod?.toUpperCase()}</span>
                </div>
                <div className="summary-row">
                  <span>Estimated Delivery:</span>
                  <span>{formatDate(order.estimatedDelivery)}</span>
                </div>
              </div>

              <div className="order-actions">
                {order.orderStatus === 'Cancelled' ? (
                  <div className="cancelled-info">
                    <span className="cancelled-text">
                      Cancelled on {formatDate(order.cancelledAt)}
                    </span>
                  </div>
                ) : order.orderStatus === 'Delivered' ? (
                  <div className="delivered-info">
                    <span className="delivered-text">
                      Delivered on {formatDate(order.deliveredAt)}
                    </span>
                  </div>
                ) : (
                  <button
                    className="cancel-order-btn"
                    onClick={() => handleCancelOrder(order.orderId)}
                    disabled={cancelling === order.orderId}
                  >
                    {cancelling === order.orderId ? (
                      <>
                        <div className="btn-spinner"></div>
                        Cancelling...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-times"></i>
                        Cancel Order
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;