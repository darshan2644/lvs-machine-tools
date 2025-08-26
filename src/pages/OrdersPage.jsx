import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { syncOrdersToBackend } from '../services/cartService';
import './OrdersPage.css';

const OrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, pending, delivered, cancelled
  const [cancelling, setCancelling] = useState(null); // Track which order is being cancelled

  useEffect(() => {
    fetchOrders();

    // Debug: Show localStorage contents
    const localOrders = localStorage.getItem('lvsOrders');
    console.log('💾 LocalStorage orders on page load:', localOrders);
    if (localOrders) {
      try {
        const parsed = JSON.parse(localOrders);
        console.log('📊 Parsed localStorage orders:', parsed.length, 'orders found');
      } catch (e) {
        console.error('❌ Error parsing localStorage orders:', e);
      }
    }

    // Listen for new orders being placed
    const handleOrderPlaced = (event) => {
      console.log('New order placed, refreshing orders list:', event.detail);
      setTimeout(() => {
        fetchOrders(); // Refresh orders after a short delay
      }, 1000);
    };

    window.addEventListener('orderPlaced', handleOrderPlaced);

    // Cleanup event listener
    return () => {
      window.removeEventListener('orderPlaced', handleOrderPlaced);
    };
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId') || 'demo-user-123';
      
      // First try backend API
      try {
        const response = await axios.get(`http://localhost:5000/api/orders/user/${userId}`);
        if (response.data.success) {
          setOrders(response.data.orders);
          console.log('Orders loaded from backend:', response.data.orders);
        } else {
          throw new Error('Backend returned no orders');
        }
      } catch {
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

  // Function to refresh orders
  const refreshOrders = () => {
    fetchOrders();
  };

  // Function to create a test order for demonstration
  const createTestOrder = () => {
    const testOrder = {
      _id: 'LVS' + Date.now(),
      orderId: 'LVS' + Date.now(),
      userId: localStorage.getItem('userId') || 'demo-user-123',
      orderStatus: 'Order Placed',
      createdAt: new Date().toISOString(),
      items: [
        {
          productId: 'cnc-9axis',
          name: '9 Axis CNC Universal Cutting & Engraving Auto Tool Changer Machine',
          quantity: 1,
          price: 250000,
          image: '/images/cnc-9axis-main.png'
        }
      ],
      totalAmount: 250000,
      paymentMethod: 'Cash on Delivery',
      shippingAddress: {
        fullName: 'Test Customer',
        address: '123 Test Street',
        city: 'Test City',
        state: 'Test State',
        pincode: '123456'
      }
    };

    // Add to localStorage
    const existingOrders = JSON.parse(localStorage.getItem('lvsOrders') || '[]');
    existingOrders.push(testOrder);
    localStorage.setItem('lvsOrders', JSON.stringify(existingOrders));
    
    // Update state immediately
    setOrders(existingOrders);
    
    console.log('✅ Test order created:', testOrder);
    alert(`✅ Test order ${testOrder.orderId} created successfully!`);
  };

  // Function to clear all orders
  const clearAllOrders = () => {
    if (window.confirm('🗑️ Are you sure you want to delete ALL orders?\n\nThis action cannot be undone!')) {
      // Clear localStorage
      localStorage.removeItem('lvsOrders');
      // Clear state
      setOrders([]);
      setError('');
      console.log('✅ All orders cleared successfully');
      alert('🗑️ All orders have been cleared!');
    }
  };

  // Function to sync localStorage orders to backend
  const handleSyncOrders = async () => {
    try {
      setLoading(true);
      console.log('🔄 Starting order sync to backend...');
      
      const result = await syncOrdersToBackend();
      
      if (result.success) {
        console.log('✅ Sync completed:', result.message);
        alert(`✅ ${result.message}`);
        
        // Refresh orders after sync
        await fetchOrders();
      } else {
        console.error('❌ Sync failed:', result.error);
        alert(`❌ Sync failed: ${result.error}`);
      }
    } catch (error) {
      console.error('❌ Error during sync:', error);
      alert('❌ Error during sync. Please try again.');
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
      case 'processing':
        return '⚙️';
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

  const handleCancelOrder = async (order) => {
    console.log('🔴 Cancel button clicked for order:', order.orderId || order._id, 'Status:', order.orderStatus);
    
    // Check if order can be cancelled
    const cancellableStatuses = ['order placed', 'placed', 'packed', 'processing', 'confirmed', 'pending'];
    if (!cancellableStatuses.includes(order.orderStatus?.toLowerCase())) {
      setError('This order cannot be cancelled as it has already been shipped or delivered.');
      alert('❌ This order cannot be cancelled as it has already been shipped or delivered.');
      return;
    }

    // Confirm cancellation
    if (!window.confirm(`🚨 Are you sure you want to cancel order ${order.orderId || order._id}?\n\nThis action cannot be undone.`)) {
      return;
    }

    console.log('✅ User confirmed cancellation, proceeding...');
    setCancelling(order._id || order.orderId);
    setError('');

    try {
      // Try to cancel via backend API
      try {
        const response = await axios.patch(`http://localhost:5000/api/orders/${order._id || order.orderId}/cancel`, {
          cancelReason: 'Cancelled by customer'
        });

        if (response.data.success) {
          // Update local orders state
          setOrders(prevOrders => 
            prevOrders.map(o => 
              (o._id === order._id || o.orderId === order.orderId) 
                ? { ...o, orderStatus: 'Cancelled', cancelledAt: new Date().toISOString(), cancelReason: 'Cancelled by customer' }
                : o
            )
          );
          
          // Show success message
          setError(''); // Clear any previous errors
          alert(`Order ${order.orderId || order._id} has been cancelled successfully! 🎯`);
          console.log('✅ Order cancelled via backend:', response.data);
        } else {
          throw new Error(response.data.message || 'Failed to cancel order');
        }
  } catch {
        console.log('Backend not available, updating locally');
        
        // Fallback: Update localStorage
        const savedOrders = localStorage.getItem('lvsOrders');
        if (savedOrders) {
          const parsedOrders = JSON.parse(savedOrders);
          const updatedOrders = parsedOrders.map(o => 
            (o._id === order._id || o.orderId === order.orderId) 
              ? { ...o, orderStatus: 'Cancelled', cancelledAt: new Date().toISOString(), cancelReason: 'Cancelled by customer' }
              : o
          );
          localStorage.setItem('lvsOrders', JSON.stringify(updatedOrders));
        }

        // Update state
        setOrders(prevOrders => 
          prevOrders.map(o => 
            (o._id === order._id || o.orderId === order.orderId) 
              ? { ...o, orderStatus: 'Cancelled', cancelledAt: new Date().toISOString(), cancelReason: 'Cancelled by customer' }
              : o
          )
        );

        setError(''); // Clear any previous errors
        alert(`Order ${order.orderId || order._id} has been cancelled successfully! 📱 (Updated locally)`);
        console.log('✅ Order cancelled locally (backend unavailable)');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      setError('Failed to cancel order. Please try again or contact support.');
    } finally {
      setCancelling(null);
    }
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

        {/* Action Buttons */}
        <div className="orders-actions" style={{ marginTop: '16px', textAlign: 'center', display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button 
            onClick={refreshOrders}
            className="btn"
            style={{
              backgroundColor: '#3B82F6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#2563EB';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#3B82F6';
            }}
          >
            🔄 Refresh Orders
          </button>

          <button 
            onClick={createTestOrder}
            className="btn"
            style={{
              backgroundColor: '#10B981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#059669';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#10B981';
            }}
          >
            ➕ Create Test Order
          </button>

          <button 
            onClick={handleSyncOrders}
            className="btn"
            style={{
              backgroundColor: '#8B5CF6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#7C3AED';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#8B5CF6';
            }}
            title="Sync localStorage orders to backend database"
          >
            🔄 Sync to Backend
          </button>
          
          {orders.length > 0 && (
            <button 
              onClick={clearAllOrders}
              className="btn"
              style={{
                backgroundColor: '#EF4444',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#DC2626';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#EF4444';
              }}
            >
              🗑️ Clear All Orders
            </button>
          )}
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

                      {/* Cancel Order Button - for cancellable orders */}
                      {(order.orderStatus && 
                        ['order placed', 'placed', 'packed', 'processing', 'pending', 'confirmed'].includes(order.orderStatus.toLowerCase()) &&
                        !['delivered', 'shipped', 'cancelled', 'out for delivery'].includes(order.orderStatus.toLowerCase())
                      ) && (
                        <button 
                          onClick={() => {
                            console.log('🔴 Cancel button clicked!', order);
                            handleCancelOrder(order);
                          }}
                          className="btn btn-sm"
                          style={{ 
                            borderColor: '#EF4444', 
                            color: '#EF4444',
                            backgroundColor: 'transparent',
                            border: '1px solid #EF4444',
                            borderRadius: '6px',
                            padding: '6px 12px',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#EF4444';
                            e.target.style.color = 'white';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                            e.target.style.color = '#EF4444';
                          }}
                          disabled={cancelling === (order._id || order.orderId)}
                        >
                          <span className="btn-icon" style={{ marginRight: '4px' }}>
                            {cancelling === (order._id || order.orderId) ? '⏳' : '❌'}
                          </span>
                          <span>
                            {cancelling === (order._id || order.orderId) ? 'Cancelling...' : 'Cancel Order'}
                          </span>
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
