import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Load user orders
  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        
        // Get userId from user context or localStorage
        const userId = user?.id || user?.uid || localStorage.getItem('userId') || 'demo-user-123';
        console.log('Loading orders for userId:', userId);
        
        // Fetch orders from backend
        try {
          const response = await fetch(`http://localhost:5000/api/orders/user/${userId}`);
          console.log('Orders API response status:', response.status);
          
          if (response.ok) {
            const data = await response.json();
            console.log('Orders API response data:', data);
            
            if (data.success && data.orders) {
              setOrders(data.orders);
              console.log('Loaded orders:', data.orders);
            } else {
              console.log('No orders found or API returned error');
              setOrders([]);
            }
          } else {
            console.log('API request failed with status:', response.status);
            setOrders([]);
          }
        } catch (error) {
          console.error('Backend API error:', error);
          // Fallback to localStorage orders if backend is not available
          const localOrders = localStorage.getItem('lvsOrders');
          if (localOrders) {
            try {
              const parsedOrders = JSON.parse(localOrders);
              setOrders(parsedOrders || []);
              console.log('Using local orders:', parsedOrders);
            } catch (parseError) {
              console.error('Error parsing local orders:', parseError);
              setOrders([]);
            }
          } else {
            setOrders([]);
          }
        }
      } catch (error) {
        console.error('Error loading orders:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadOrders();
      
      // Listen for order updates
      const handleOrderUpdate = () => {
        console.log('Order update event received, reloading orders...');
        loadOrders();
      };
      
      window.addEventListener('orderPlaced', handleOrderUpdate);
      window.addEventListener('orderUpdated', handleOrderUpdate);
      
      return () => {
        window.removeEventListener('orderPlaced', handleOrderUpdate);
        window.removeEventListener('orderUpdated', handleOrderUpdate);
      };
    }
  }, [user]);

  const handleEditProfile = () => {
    setIsEditing(!isEditing);
  };

  const handleChangePassword = () => {
    // TODO: Implement change password functionality
    console.log('Change password clicked');
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
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

  const getOrderStatus = (order) => {
    if (order.orderStatus) return order.orderStatus;
    if (order.paymentMethod === 'cod') return 'Processing';
    return 'Confirmed';
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'success';
      case 'shipped': case 'in transit': return 'info';
      case 'processing': case 'confirmed': return 'warning';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  const handleViewOrder = (orderId) => {
    navigate(`/order-confirmation/${orderId}`);
  };

  const handleTrackOrder = (orderId) => {
    navigate(`/track-order/${orderId}`);
  };

  return (
    <div className="elegant-profile-page">
      <div className="container">
        {/* Profile Header */}
        <div className="elegant-profile-header animate-fade-in">
          <div className="profile-hero">
            <div className="profile-avatar">
              <div className="avatar-circle">
                <span className="avatar-initials">{getInitials(user?.firstName, user?.lastName)}</span>
              </div>
              <div className="avatar-status active"></div>
            </div>
            <div className="profile-info">
              <h1 className="profile-name">
                Welcome back, <span className="text-brown">{user?.firstName}</span>!
              </h1>
              <p className="profile-subtitle">Manage your account and view your orders</p>
              <div className="profile-stats">
                <div className="stat-item">
                  <span className="stat-number">{orders.length}</span>
                  <span className="stat-label">Total Orders</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">
                    {orders.filter(order => getOrderStatus(order).toLowerCase() === 'delivered').length}
                  </span>
                  <span className="stat-label">Delivered</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">
                    {orders.filter(order => ['processing', 'confirmed', 'shipped'].includes(getOrderStatus(order).toLowerCase())).length}
                  </span>
                  <span className="stat-label">Active</span>
                </div>
              </div>
            </div>
            <div className="profile-actions">
              <button className="elegant-btn btn-outline" onClick={handleEditProfile}>
                <span className="btn-icon">✏️</span>
                <span className="btn-text">Edit Profile</span>
              </button>
              <button className="elegant-btn btn-primary" onClick={() => navigate('/')}>
                <span className="btn-icon">🛒</span>
                <span className="btn-text">Shop Now</span>
              </button>
            </div>
          </div>
        </div>

        {/* Profile Navigation */}
        <div className="elegant-profile-nav animate-slide-in-up">
          <nav className="profile-tabs">
            <button 
              className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <span className="tab-icon">🏠</span>
              <span className="tab-text">Overview</span>
            </button>
            <button 
              className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <span className="tab-icon">📆</span>
              <span className="tab-text">Orders</span>
              {orders.length > 0 && <span className="tab-badge">{orders.length}</span>}
            </button>
            <button 
              className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <span className="tab-icon">⚙️</span>
              <span className="tab-text">Settings</span>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="elegant-profile-content">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="tab-content animate-fade-in">
              <div className="content-grid">
                <div className="profile-card account-info">
                  <div className="card-header">
                    <div className="card-icon">👤</div>
                    <h3>Account Information</h3>
                  </div>
                  <div className="info-grid">
                    <div className="info-item">
                      <label>Full Name</label>
                      <span>{user?.firstName} {user?.lastName}</span>
                    </div>
                    <div className="info-item">
                      <label>Email Address</label>
                      <span>{user?.email}</span>
                    </div>
                    <div className="info-item">
                      <label>Account Role</label>
                      <span className="role-badge">{user?.role || 'Customer'}</span>
                    </div>
                    <div className="info-item">
                      <label>Member Since</label>
                      <span>{user?.createdAt ? formatDate(user.createdAt) : 'Recently'}</span>
                    </div>
                  </div>
                </div>

                <div className="profile-card recent-orders">
                  <div className="card-header">
                    <div className="card-icon">📆</div>
                    <h3>Recent Orders</h3>
                    {orders.length > 0 && (
                      <button 
                        className="view-all-btn"
                        onClick={() => setActiveTab('orders')}
                      >
                        View All
                      </button>
                    )}
                  </div>
                  <div className="recent-orders-list">
                    {orders.length === 0 ? (
                      <div className="empty-state">
                        <div className="empty-icon">📋</div>
                        <h4>No Orders Yet</h4>
                        <p>Start shopping to see your orders here</p>
                        <button 
                          className="elegant-btn btn-primary"
                          onClick={() => navigate('/')}
                        >
                          <span className="btn-text">Browse Products</span>
                        </button>
                      </div>
                    ) : (
                      orders.slice(0, 3).map((order, index) => (
                        <div key={index} className="recent-order-item">
                          <div className="order-info">
                            <h4>Order #{order.orderId || order._id}</h4>
                            <p>{formatDate(order.createdAt || order.orderDate)}</p>
                          </div>
                          <div className="order-status">
                            <span className={`status-badge ${getStatusColor(getOrderStatus(order))}`}>
                              {getOrderStatus(order)}
                            </span>
                            <span className="order-total">{formatCurrency(order.totalPrice || order.totalAmount)}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="tab-content animate-fade-in">
              <div className="orders-section">
                <div className="section-header">
                  <div className="header-content">
                    <h2>Your Orders</h2>
                    <p>Track and manage all your orders</p>
                  </div>
                  {orders.length > 0 && (
                    <div className="orders-summary">
                      <div className="summary-item">
                        <span className="summary-number">{orders.length}</span>
                        <span className="summary-label">Total</span>
                      </div>
                      <div className="summary-item">
                        <span className="summary-number">
                          {orders.filter(order => getOrderStatus(order).toLowerCase() === 'delivered').length}
                        </span>
                        <span className="summary-label">Delivered</span>
                      </div>
                    </div>
                  )}
                </div>

                {loading ? (
                  <div className="loading-orders">
                    <div className="loading-animation">
                      <div className="loading-circle"></div>
                      <div className="loading-circle"></div>
                      <div className="loading-circle"></div>
                    </div>
                    <p>Loading your orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="empty-orders">
                    <div className="empty-illustration">🛍️</div>
                    <h3>No Orders Found</h3>
                    <p>You haven't placed any orders yet. Start shopping to see your orders here.</p>
                    <button 
                      className="elegant-btn btn-primary"
                      onClick={() => navigate('/')}
                    >
                      <span className="btn-icon">🛒</span>
                      <span className="btn-text">Start Shopping</span>
                    </button>
                  </div>
                ) : (
                  <div className="orders-list">
                    {orders.map((order, index) => (
                      <div key={index} className="elegant-order-card">
                        <div className="order-header">
                          <div className="order-id">
                            <h3>Order #{order.orderId || order._id}</h3>
                            <span className="order-date">{formatDate(order.createdAt || order.orderDate)}</span>
                          </div>
                          <div className="order-status-section">
                            <span className={`status-badge ${getStatusColor(getOrderStatus(order))}`}>
                              {getOrderStatus(order)}
                            </span>
                          </div>
                        </div>

                        <div className="order-content">
                          <div className="order-items">
                            {order.items && order.items.length > 0 ? (
                              <div className="items-preview">
                                <span className="items-count">
                                  {order.items.length} item{order.items.length > 1 ? 's' : ''}
                                </span>
                                <div className="items-list">
                                  {order.items.slice(0, 2).map((item, itemIndex) => (
                                    <span key={itemIndex} className="item-name">
                                      {item.productId?.name || item.name || 'Product'}
                                    </span>
                                  ))}
                                  {order.items.length > 2 && (
                                    <span className="items-more">+{order.items.length - 2} more</span>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <span className="no-items">No items information available</span>
                            )}
                          </div>

                          <div className="order-details">
                            <div className="detail-item">
                              <span className="detail-label">Total Amount</span>
                              <span className="detail-value amount">
                                {formatCurrency(order.totalPrice || order.totalAmount)}
                              </span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">Payment Method</span>
                              <span className="detail-value">
                                {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 
                                 order.paymentMethod === 'razorpay' ? 'Razorpay' : 
                                 order.paymentMethod === 'card' ? 'Credit/Debit Card' : 
                                 order.paymentMethod || 'N/A'}
                              </span>
                            </div>
                          </div>

                          <div className="order-actions">
                            <button 
                              className="elegant-btn btn-outline"
                              onClick={() => handleViewOrder(order.orderId || order._id)}
                            >
                              <span className="btn-icon">👁️</span>
                              <span className="btn-text">View Details</span>
                            </button>
                            {getOrderStatus(order).toLowerCase() !== 'delivered' && (
                              <button 
                                className="elegant-btn btn-primary"
                                onClick={() => handleTrackOrder(order.orderId || order._id)}
                              >
                                <span className="btn-icon">📱</span>
                                <span className="btn-text">Track Order</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="tab-content animate-fade-in">
              <div className="settings-section">
                <div className="settings-grid">
                  <div className="profile-card settings-card">
                    <div className="card-header">
                      <div className="card-icon">⚙️</div>
                      <h3>Account Settings</h3>
                    </div>
                    <div className="settings-list">
                      <button className="setting-item" onClick={handleEditProfile}>
                        <div className="setting-info">
                          <div className="setting-icon">✏️</div>
                          <div>
                            <h4>Edit Profile</h4>
                            <p>Update your name, email and other details</p>
                          </div>
                        </div>
                        <div className="setting-arrow">➤</div>
                      </button>
                      
                      <button className="setting-item" onClick={handleChangePassword}>
                        <div className="setting-info">
                          <div className="setting-icon">🔒</div>
                          <div>
                            <h4>Change Password</h4>
                            <p>Update your account password</p>
                          </div>
                        </div>
                        <div className="setting-arrow">➤</div>
                      </button>
                      
                      <button className="setting-item danger" onClick={logout}>
                        <div className="setting-info">
                          <div className="setting-icon">📴</div>
                          <div>
                            <h4>Sign Out</h4>
                            <p>Sign out from your account</p>
                          </div>
                        </div>
                        <div className="setting-arrow">➤</div>
                      </button>
                    </div>
                  </div>

                  <div className="profile-card help-card">
                    <div className="card-header">
                      <div className="card-icon">❓</div>
                      <h3>Help & Support</h3>
                    </div>
                    <div className="help-content">
                      <p>Need assistance with your account or orders?</p>
                      <div className="help-actions">
                        <button className="elegant-btn btn-outline">
                          <span className="btn-icon">📞</span>
                          <span className="btn-text">Contact Support</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
