import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import './Navbar-minimal.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Fetch cart count
    fetchCartCount();
    
    // Listen for cart updates
    const handleCartUpdate = () => {
      fetchCartCount();
    };
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const fetchCartCount = async () => {
    try {
      const userId = localStorage.getItem('userId') || 'demo-user-123';
      const response = await axios.get(`http://localhost:5000/api/cart/${userId}`);
      
      if (response.data.success && response.data.items) {
        const totalItems = response.data.items.reduce((total, item) => total + item.quantity, 0);
        setCartCount(totalItems);
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  const location = useLocation();

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Left Side - Logo Text */}
        <Link to="/" className="navbar-logo">
          LVS Machine and Tools
        </Link>

        {/* Right Side - Navigation Content */}
        <div className="navbar-content">
          {/* Desktop Navigation Menu */}
          <ul className="navbar-menu">
            <li>
              <Link 
                to="/" 
                className={`navbar-link ${isActiveLink('/') ? 'active' : ''}`}
              >
                Home
              </Link>
            </li>
            
            <li>
              <Link 
                to="/categories" 
                className={`navbar-link ${isActiveLink('/categories') ? 'active' : ''}`}
              >
                Categories
              </Link>
            </li>
            
            <li>
              <Link 
                to="/products" 
                className={`navbar-link ${isActiveLink('/products') ? 'active' : ''}`}
              >
                Products
              </Link>
            </li>
            
            <li>
              <Link 
                to="/about" 
                className={`navbar-link ${isActiveLink('/about') ? 'active' : ''}`}
              >
                About
              </Link>
            </li>
            
            <li>
              <Link 
                to="/contact" 
                className={`navbar-link ${isActiveLink('/contact') ? 'active' : ''}`}
              >
                Contact
              </Link>
            </li>
          </ul>

          {/* Action Buttons */}
          <div className="navbar-actions">
            {/* Search Bar */}
            <div className="search-container">
              <input 
                type="text" 
                className="search-input" 
                placeholder="Search products..."
              />
              <button className="search-btn">
                🔍
              </button>
            </div>

            {/* Shopping Cart */}
            <Link to="/cart" className="action-btn cart-btn">
              🛒
              {cartCount > 0 && (
                <span className="cart-count">{cartCount > 99 ? '99+' : cartCount}</span>
              )}
            </Link>

            {/* User Authentication */}
            {isAuthenticated ? (
              <div className="user-menu-wrapper">
                <button onClick={toggleUserMenu} className="user-profile-btn">
                  <div className="user-avatar">
                    {(user?.firstName?.[0] || user?.name?.[0] || 'U').toUpperCase()}
                  </div>
                  <span className="user-name">
                    {user?.firstName || user?.name || 'User'}
                  </span>
                  <svg className="dropdown-arrow" width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>
                
                {showUserMenu && (
                  <div className="user-dropdown">
                    <div className="user-info">
                      <div className="user-avatar-large">
                        {user?.avatar || (user?.firstName?.[0] || user?.name?.[0] || 'U').toUpperCase()}
                      </div>
                      <div className="user-details">
                        <span className="user-display-name">
                          {user?.firstName && user?.lastName 
                            ? `${user.firstName} ${user.lastName}` 
                            : user?.name || 'User'}
                        </span>
                        <span className="user-email">{user?.email || 'user@example.com'}</span>
                        {user?.phone && (
                          <span className="user-phone">📱 {user.phone}</span>
                        )}
                        {user?.company && (
                          <span className="user-company">🏢 {user.company}</span>
                        )}
                      </div>
                    </div>
                    
                    {user?.savedAddresses && user.savedAddresses.length > 0 && (
                      <div className="user-addresses">
                        <div className="address-header">
                          <span>📍 Saved Addresses</span>
                        </div>
                        <div className="address-list">
                          {user.savedAddresses.slice(0, 2).map((address, index) => (
                            <div key={index} className="address-item">
                              <span className="address-label">{address.label || `Address ${index + 1}`}</span>
                              <span className="address-text">
                                {address.address}, {address.city}, {address.state} {address.pincode}
                              </span>
                            </div>
                          ))}
                          {user.savedAddresses.length > 2 && (
                            <div className="address-more">
                              +{user.savedAddresses.length - 2} more addresses
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="user-menu-divider"></div>
                    <Link to="/profile" className="user-menu-link" onClick={() => setShowUserMenu(false)}>
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                      </svg>
                      Profile Settings
                    </Link>
                    <Link to="/orders" className="user-menu-link" onClick={() => setShowUserMenu(false)}>
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                      </svg>
                      Orders
                    </Link>
                    <div className="user-menu-divider"></div>
                    <button onClick={handleLogout} className="logout-btn">
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="action-btn login-btn">
                  Login
                </Link>
                <Link to="/signup" className="action-btn signup-btn">
                  Sign Up
                </Link>
              </div>
            )}
            
            {/* Mobile Menu Toggle */}
            <button 
              onClick={toggleMenu}
              className={`mobile-menu-toggle ${isMenuOpen ? 'active' : ''}`}
            >
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
        <ul className="mobile-menu-list">
          <li>
            <Link to="/" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
          </li>
          
          <li>
            <Link to="/categories" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
              Categories
            </Link>
          </li>
          
          <li>
            <Link to="/products" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
              Products
            </Link>
          </li>
          
          <li>
            <Link to="/about" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
              About
            </Link>
          </li>
          
          <li>
            <Link to="/contact" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
              Contact
            </Link>
          </li>
          
          {/* Mobile Auth Section */}
          <li className="mobile-auth-section">
            {isAuthenticated ? (
              <>
                <div className="user-info-mobile">
                  <span className="mobile-user-name">{user?.name || 'User'}</span>
                  <span className="mobile-user-email">{user?.email || 'user@example.com'}</span>
                </div>
                <Link to="/profile" className="mobile-auth-btn" onClick={() => setIsMenuOpen(false)}>
                  Profile
                </Link>
                <Link to="/orders" className="mobile-auth-btn" onClick={() => setIsMenuOpen(false)}>
                  Orders
                </Link>
                <button onClick={handleLogout} className="mobile-auth-btn logout-mobile">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="mobile-auth-btn" onClick={() => setIsMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/signup" className="mobile-auth-btn signup-mobile" onClick={() => setIsMenuOpen(false)}>
                  Sign Up
                </Link>
              </>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
