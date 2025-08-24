import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import './Navbar.css';

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
        {/* Premium Logo Section */}
        <Link to="/" className="navbar-logo hover-lift">
          <img 
            src="/images/lvs-logo.png" 
            alt="LVS Machine & Tools" 
            className="logo-image"
          />
          <div className="logo-content">
            <span className="logo-text">LVS Machine & Tools</span>
          </div>
        </Link>

        {/* Premium Desktop Navigation */}
        <div className="navbar-menu">
          <Link 
            to="/" 
            className={`navbar-link ${isActiveLink('/') ? 'active' : ''}`}
          >
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9,22 9,12 15,12 15,22"></polyline>
            </svg>
            <span>Home</span>
          </Link>
          
          <Link 
            to="/categories" 
            className={`navbar-link ${isActiveLink('/categories') ? 'active' : ''}`}
          >
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            <span>Categories</span>
          </Link>
          
          <Link 
            to="/products" 
            className={`navbar-link ${isActiveLink('/products') ? 'active' : ''}`}
          >
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27,6.96 12,12.01 20.73,6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
            <span>Products</span>
          </Link>
          
          <Link 
            to="/about" 
            className={`navbar-link ${isActiveLink('/about') ? 'active' : ''}`}
          >
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <span>About</span>
          </Link>
          
          <Link 
            to="/contact" 
            className={`navbar-link ${isActiveLink('/contact') ? 'active' : ''}`}
          >
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            <span>Contact</span>
          </Link>
        </div>

        {/* Premium Action Buttons */}
        <div className="navbar-actions">
          {/* Premium Search Bar */}
          <div className="navbar-search">
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search products..."
            />
            <button className="search-btn">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="M21 21l-4.35-4.35"></path>
              </svg>
            </button>
          </div>

          {/* Premium Cart Button */}
          <Link to="/cart" className="cart-btn action-btn hover-lift">
            <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {cartCount > 0 && (
              <span className="cart-count">{cartCount > 99 ? '99+' : cartCount}</span>
            )}
          </Link>

          {/* Premium User Authentication */}
          {isAuthenticated ? (
            <div className="user-menu-wrapper">
              <button onClick={toggleUserMenu} className="user-btn action-btn hover-lift">
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--accent-gold) 0%, var(--warm-gold) 100%)',
                  color: 'var(--pure-white)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  boxShadow: 'var(--shadow-soft)'
                }}>
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <span className="user-name d-none d-lg-inline">{user?.name || 'User'}</span>
                <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6,9 12,15 18,9"></polyline>
                </svg>
              </button>
              
              {showUserMenu && (
                <div className="user-dropdown animate-fade-in">
                  <div className="user-info">
                    <span className="user-display-name">{user?.name || 'User'}</span>
                    <span className="user-email">{user?.email || 'user@example.com'}</span>
                  </div>
                  <div className="user-menu-divider"></div>
                  <Link to="/profile" className="user-menu-link" onClick={() => setShowUserMenu(false)}>
                    <svg className="user-menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <span>Profile</span>
                  </Link>
                  <Link to="/orders" className="user-menu-link" onClick={() => setShowUserMenu(false)}>
                    <svg className="user-menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                    </svg>
                    <span>Orders</span>
                  </Link>
                  <Link to="/wishlist" className="user-menu-link" onClick={() => setShowUserMenu(false)}>
                    <svg className="user-menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    <span>Wishlist</span>
                  </Link>
                  <div className="user-menu-divider"></div>
                  <button onClick={handleLogout} className="logout-btn">
                    <svg className="user-menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16,17 21,12 16,7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="auth-btn login-btn">
                <svg className="auth-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                  <polyline points="10,17 15,12 10,7"></polyline>
                  <line x1="15" y1="12" x2="3" y2="12"></line>
                </svg>
                <span>Login</span>
              </Link>
              <Link to="/signup" className="auth-btn signup-btn">
                <svg className="auth-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="8.5" cy="7" r="4"></circle>
                  <line x1="20" y1="8" x2="20" y2="14"></line>
                  <line x1="23" y1="11" x2="17" y2="11"></line>
                </svg>
                <span>Sign Up</span>
              </Link>
            </div>
          )}
          
          {/* Premium Mobile Menu Toggle */}
          <button 
            onClick={toggleMenu}
            className={`mobile-menu-toggle ${isMenuOpen ? 'active' : ''}`}
          >
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
          </button>
        </div>
      </div>

      {/* Premium Mobile Menu */}
      <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-list">
          <Link to="/" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9,22 9,12 15,12 15,22"></polyline>
            </svg>
            <span>Home</span>
          </Link>
          
          <Link to="/categories" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            <span>Categories</span>
          </Link>
          
          <Link to="/products" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27,6.96 12,12.01 20.73,6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
            <span>Products</span>
          </Link>
          
          <Link to="/about" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <span>About</span>
          </Link>
          
          <Link to="/contact" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            <span>Contact</span>
          </Link>
          
          {/* Mobile Auth Section */}
          <div className="mobile-auth-section">
            {isAuthenticated ? (
              <>
                <div className="user-info-mobile">
                  <span className="mobile-user-name">{user?.name || 'User'}</span>
                  <span className="mobile-user-email">{user?.email || 'user@example.com'}</span>
                </div>
                <Link to="/profile" className="mobile-auth-btn login-mobile" onClick={() => setIsMenuOpen(false)}>
                  Profile
                </Link>
                <Link to="/orders" className="mobile-auth-btn login-mobile" onClick={() => setIsMenuOpen(false)}>
                  Orders
                </Link>
                <button onClick={handleLogout} className="mobile-auth-btn logout-mobile">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="mobile-auth-btn login-mobile" onClick={() => setIsMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/signup" className="mobile-auth-btn signup-mobile" onClick={() => setIsMenuOpen(false)}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
