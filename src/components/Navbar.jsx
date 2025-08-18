import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ShoppingCart from './ShoppingCart';
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
          <img src="/images/lvs-logo.png" alt="LVS Machine & Tools" className="logo-image" />
          <div className="logo-content">
            <span className="logo-text">LVS Machine & Tools</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <ul className="navbar-menu">
          <li className="navbar-item">
            <Link to="/" className="navbar-link">
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9,22 9,12 15,12 15,22"></polyline>
              </svg>
              Home
            </Link>
          </li>
          <li className="navbar-item dropdown">
            <span className="navbar-link dropdown-toggle">
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="9" y1="9" x2="15" y2="15"></line>
                <line x1="15" y1="9" x2="9" y2="15"></line>
              </svg>
              Categories
              <svg className="dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6,9 12,15 18,9"></polyline>
              </svg>
            </span>
            <ul className="dropdown-menu">
              <li>
                <Link to="/cnc-bangle-category" className="dropdown-link">
                  <svg className="dropdown-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="16"></line>
                    <line x1="8" y1="12" x2="16" y2="12"></line>
                  </svg>
                  CNC Bangle & Ring Cutting
                </Link>
              </li>
              <li>
                <Link to="/bangle-cnc-cutting-machine" className="dropdown-link">
                  <svg className="dropdown-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="m8 12 2 2 4-4"></path>
                  </svg>
                  Bangle CNC Cutting Machine
                </Link>
              </li>
              <li>
                <Link to="/category/faceting-machine" className="dropdown-link">
                  <svg className="dropdown-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 3h12l4 6-10 13L2 9l4-6z"></path>
                  </svg>
                  Faceting Machine
                </Link>
              </li>
              <li>
                <Link to="/category/pendent-ring-engraving" className="dropdown-link">
                  <svg className="dropdown-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                  </svg>
                  Pendant & Ring Engraving
                </Link>
              </li>
              <li>
                <Link to="/category/dough-balls-cutting" className="dropdown-link">
                  <svg className="dropdown-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z"></path>
                  </svg>
                  Dough Balls Cutting
                </Link>
              </li>
              <li>
                <Link to="/category/jewellery-cutting" className="dropdown-link">
                  <svg className="dropdown-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 3h12l4 6-10 13L2 9l4-6z"></path>
                    <path d="M11 3 8 9l4 13 4-13-3-6"></path>
                  </svg>
                  Jewellery Cutting
                </Link>
              </li>
              <li>
                <Link to="/category/jewellery-engraving" className="dropdown-link">
                  <svg className="dropdown-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                    <circle cx="11" cy="11" r="2"></circle>
                  </svg>
                  Jewellery Engraving
                </Link>
              </li>
            </ul>
          </li>
          <li className="navbar-item">
            <Link to="/products" className="navbar-link">
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              Products
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/about" className="navbar-link">
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 16v-4"></path>
                <path d="M12 8h.01"></path>
              </svg>
              About
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/contact" className="navbar-link">
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              Contact
            </Link>
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
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="navbar-actions">
          <ShoppingCart />

          {isAuthenticated ? (
            <div className="user-menu-wrapper">
              <button className="action-btn user-btn" onClick={toggleUserMenu}>
                <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
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
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    My Profile
                  </Link>
                  <Link to="/orders" className="user-menu-link" onClick={() => setShowUserMenu(false)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
                      <path d="m3.3 7 8.7 5 8.7-5"></path>
                      <path d="M12 22V12"></path>
                    </svg>
                    My Orders
                  </Link>
                  <Link to="/settings" className="user-menu-link" onClick={() => setShowUserMenu(false)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="3"></circle>
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z"></path>
                    </svg>
                    Settings
                  </Link>
                  <div className="user-menu-divider"></div>
                  <button className="user-menu-link logout-btn" onClick={handleLogout}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16,17 21,12 16,7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="auth-btn login-btn">
                <svg className="auth-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h6v6M9 21H3V15M21 3l-7 7M3 21l7-7"/>
                </svg>
                Sign In
              </Link>
              <Link to="/signup" className="auth-btn signup-btn">
                <svg className="auth-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="8.5" cy="7" r="4"/>
                  <line x1="20" y1="8" x2="20" y2="14"/>
                  <line x1="23" y1="11" x2="17" y2="11"/>
                </svg>
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
