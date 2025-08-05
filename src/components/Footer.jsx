import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="container">
          <div className="footer-sections">
            {/* Company Info */}
            <div className="footer-section">
              <div className="footer-logo">
                <img src="/images/lvs-logo.png" alt="LVS Machine and Tools" className="footer-logo-img" />
                <span className="footer-logo-text">LVS Machine and Tools</span>
              </div>
              <p className="footer-description">
                Your trusted partner for professional machine tools and industrial equipment. 
                Serving manufacturers worldwide with quality products and expert support.
              </p>
              <div className="footer-social">
                <a href="#" className="social-link" aria-label="Facebook">
                  <i className="social-icon">📘</i>
                </a>
                <a href="#" className="social-link" aria-label="Twitter">
                  <i className="social-icon">🐦</i>
                </a>
                <a href="#" className="social-link" aria-label="LinkedIn">
                  <i className="social-icon">💼</i>
                </a>
                <a href="#" className="social-link" aria-label="YouTube">
                  <i className="social-icon">📺</i>
                </a>
                <a href="#" className="social-link" aria-label="Instagram">
                  <i className="social-icon">📷</i>
                </a>
              </div>
            </div>

            {/* Product Categories */}
            <div className="footer-section">
              <h3 className="footer-title">Product Categories</h3>
              <ul className="footer-links">
                <li><Link to="/category/cnc-machines" className="footer-link">CNC Machines</Link></li>
                <li><Link to="/category/lathes" className="footer-link">Lathes</Link></li>
                <li><Link to="/category/milling-machines" className="footer-link">Milling Machines</Link></li>
                <li><Link to="/category/drill-presses" className="footer-link">Drill Presses</Link></li>
                <li><Link to="/category/grinders" className="footer-link">Grinders</Link></li>
                <li><Link to="/category/welding-equipment" className="footer-link">Welding Equipment</Link></li>
              </ul>
            </div>

            {/* Quick Links */}
            <div className="footer-section">
              <h3 className="footer-title">Quick Links</h3>
              <ul className="footer-links">
                <li><Link to="/" className="footer-link">Home</Link></li>
                <li><Link to="/products" className="footer-link">All Products</Link></li>
                <li><Link to="/about" className="footer-link">About Us</Link></li>
                <li><Link to="/contact" className="footer-link">Contact</Link></li>
                <li><Link to="/support" className="footer-link">Support</Link></li>
                <li><Link to="/warranty" className="footer-link">Warranty</Link></li>
              </ul>
            </div>

            {/* Customer Service */}
            <div className="footer-section">
              <h3 className="footer-title">Customer Service</h3>
              <ul className="footer-links">
                <li><Link to="/shipping" className="footer-link">Shipping Information</Link></li>
                <li><Link to="/returns" className="footer-link">Returns & Exchanges</Link></li>
                <li><Link to="/faq" className="footer-link">FAQ</Link></li>
                <li><Link to="/track-order" className="footer-link">Track Your Order</Link></li>
                <li><Link to="/bulk-orders" className="footer-link">Bulk Orders</Link></li>
                <li><Link to="/financing" className="footer-link">Financing Options</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="footer-section">
              <h3 className="footer-title">Contact Information</h3>
              <div className="contact-info">
                <div className="contact-item">
                  <i className="contact-icon">📞</i>
                  <div className="contact-details">
                    <strong>Phone:</strong><br />
                    <a href="tel:+15551234567" className="contact-link">+1 (555) 123-4567</a>
                  </div>
                </div>
                <div className="contact-item">
                  <i className="contact-icon">✉️</i>
                  <div className="contact-details">
                    <strong>Email:</strong><br />
                    <a href="mailto:support@lvstools.com" className="contact-link">support@lvstools.com</a>
                  </div>
                </div>
                <div className="contact-item">
                  <i className="contact-icon">📍</i>
                  <div className="contact-details">
                    <strong>Address:</strong><br />
                    123 Industrial Blvd<br />
                    Manufacturing City, MC 12345
                  </div>
                </div>
                <div className="contact-item">
                  <i className="contact-icon">🕒</i>
                  <div className="contact-details">
                    <strong>Business Hours:</strong><br />
                    Mon-Fri: 8:00 AM - 6:00 PM<br />
                    Sat: 9:00 AM - 4:00 PM
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="footer-newsletter">
        <div className="container">
          <div className="newsletter-content">
            <div className="newsletter-info">
              <h3 className="newsletter-title">Stay Updated</h3>
              <p className="newsletter-description">
                Subscribe to our newsletter for the latest products, deals, and industry insights.
              </p>
            </div>
            <div className="newsletter-form">
              <div className="form-group">
                <input 
                  type="email" 
                  placeholder="Enter your email address"
                  className="newsletter-input"
                />
                <button className="btn btn-primary newsletter-btn">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <div className="footer-copyright">
              <p>&copy; {currentYear} LVS Tools. All rights reserved.</p>
            </div>
            <div className="footer-legal">
              <Link to="/privacy" className="legal-link">Privacy Policy</Link>
              <Link to="/terms" className="legal-link">Terms of Service</Link>
              <Link to="/cookies" className="legal-link">Cookie Policy</Link>
            </div>
            <div className="footer-payments">
              <span className="payments-label">We Accept:</span>
              <div className="payment-icons">
                <span className="payment-icon">💳</span>
                <span className="payment-icon">🏧</span>
                <span className="payment-icon">💰</span>
                <span className="payment-icon">🏦</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
