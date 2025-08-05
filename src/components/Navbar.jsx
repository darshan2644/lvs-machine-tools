import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <img src="/images/lvs-logo.png" alt="LVS Machine and Tools" className="logo-image" />
          <span className="logo-text">LVS Machine and Tools</span>
        </Link>

        {/* Desktop Navigation */}
        <ul className="navbar-menu">
          <li className="navbar-item">
            <Link to="/" className="navbar-link">Home</Link>
          </li>
          <li className="navbar-item dropdown">
            <Link to="/categories" className="navbar-link dropdown-toggle">
              Categories
              <i className="dropdown-icon">▼</i>
            </Link>
            <ul className="dropdown-menu">
              <li><Link to="/category/cnc-bangle-cutting" className="dropdown-link">CNC Bangle And Ring Cutting Machine</Link></li>
              <li><Link to="/category/faceting-machine" className="dropdown-link">Faceting Machine</Link></li>
              <li><Link to="/category/pendent-ring-engraving" className="dropdown-link">Pendent And Ring Engraving & Cutting Machine</Link></li>
              <li><Link to="/category/dough-balls-cutting" className="dropdown-link">Dough Balls Cutting Machine</Link></li>
              <li><Link to="/category/jewellery-cutting" className="dropdown-link">Jewellery Cutting Machine</Link></li>
              <li><Link to="/category/jewellery-engraving" className="dropdown-link">Jewellery Engraving Machine</Link></li>
            </ul>
          </li>
          <li className="navbar-item">
            <Link to="/products" className="navbar-link">All Products</Link>
          </li>
          <li className="navbar-item">
            <Link to="/about" className="navbar-link">About</Link>
          </li>
          <li className="navbar-item">
            <Link to="/contact" className="navbar-link">Contact</Link>
          </li>
        </ul>

        {/* Search Bar */}
        <div className="navbar-search">
          <input 
            type="text" 
            placeholder="Search products..."
            className="search-input"
          />
          <button className="search-btn">
            <i className="search-icon">🔍</i>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="navbar-actions">
          <button className="action-btn cart-btn">
            <i className="action-icon">🛒</i>
            <span className="cart-count">0</span>
          </button>

          {isAuthenticated ? (
            <div className="user-menu-wrapper">
              <button className="action-btn user-btn" onClick={toggleUserMenu}>
                <i className="action-icon">👤</i>
                <span className="user-name">{user?.firstName}</span>
              </button>
              {showUserMenu && (
                <div className="user-dropdown">
                  <div className="user-info">
                    <span className="user-display-name">{user?.firstName} {user?.lastName}</span>
                    <span className="user-email">{user?.email}</span>
                  </div>
                  <div className="user-menu-divider"></div>
                  <Link to="/profile" className="user-menu-link" onClick={() => setShowUserMenu(false)}>
                    <i className="fas fa-user"></i>
                    My Profile
                  </Link>
                  <Link to="/orders" className="user-menu-link" onClick={() => setShowUserMenu(false)}>
                    <i className="fas fa-box"></i>
                    My Orders
                  </Link>
                  <Link to="/settings" className="user-menu-link" onClick={() => setShowUserMenu(false)}>
                    <i className="fas fa-cog"></i>
                    Settings
                  </Link>
                  <div className="user-menu-divider"></div>
                  <button className="user-menu-link logout-btn" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt"></i>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="auth-btn login-btn">
                Sign In
              </Link>
              <Link to="/signup" className="auth-btn signup-btn">
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className={`mobile-menu-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
        <ul className="mobile-menu-list">
          <li className="mobile-menu-item">
            <Link to="/" className="mobile-menu-link" onClick={toggleMenu}>Home</Link>
          </li>
          <li className="mobile-menu-item">
            <span className="mobile-menu-category">Categories</span>
            <ul className="mobile-submenu">
              <li><Link to="/category/cnc-machines" className="mobile-submenu-link" onClick={toggleMenu}>CNC Machines</Link></li>
              <li><Link to="/category/lathes" className="mobile-submenu-link" onClick={toggleMenu}>Lathes</Link></li>
              <li><Link to="/category/milling-machines" className="mobile-submenu-link" onClick={toggleMenu}>Milling Machines</Link></li>
              <li><Link to="/category/drill-presses" className="mobile-submenu-link" onClick={toggleMenu}>Drill Presses</Link></li>
              <li><Link to="/category/grinders" className="mobile-submenu-link" onClick={toggleMenu}>Grinders</Link></li>
              <li><Link to="/category/welding-equipment" className="mobile-submenu-link" onClick={toggleMenu}>Welding Equipment</Link></li>
            </ul>
          </li>
          <li className="mobile-menu-item">
            <Link to="/products" className="mobile-menu-link" onClick={toggleMenu}>All Products</Link>
          </li>
          <li className="mobile-menu-item">
            <Link to="/about" className="mobile-menu-link" onClick={toggleMenu}>About</Link>
          </li>
          <li className="mobile-menu-item">
            <Link to="/contact" className="mobile-menu-link" onClick={toggleMenu}>Contact</Link>
          </li>
          
          {/* Mobile Auth Section */}
          <div className="mobile-auth-section">
            {isAuthenticated ? (
              <>
                <li className="mobile-menu-item user-info-mobile">
                  <span className="mobile-user-name">{user?.firstName} {user?.lastName}</span>
                  <span className="mobile-user-email">{user?.email}</span>
                </li>
                <li className="mobile-menu-item">
                  <Link to="/profile" className="mobile-menu-link" onClick={toggleMenu}>My Profile</Link>
                </li>
                <li className="mobile-menu-item">
                  <Link to="/orders" className="mobile-menu-link" onClick={toggleMenu}>My Orders</Link>
                </li>
                <li className="mobile-menu-item">
                  <button className="mobile-menu-link logout-mobile" onClick={() => { handleLogout(); toggleMenu(); }}>
                    Sign Out
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="mobile-menu-item">
                  <Link to="/login" className="mobile-auth-btn login-mobile" onClick={toggleMenu}>
                    Sign In
                  </Link>
                </li>
                <li className="mobile-menu-item">
                  <Link to="/signup" className="mobile-auth-btn signup-mobile" onClick={toggleMenu}>
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </div>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
