import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="modern-footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Company Info Section */}
          <div className="footer-section company-section">
            <div className="company-header">
              <img 
                src="/images/lvs-logo.png" 
                alt="LVS Machine Tools" 
                className="footer-logo"
              />
              <h3 className="company-name">L.V.S. MACHINE TOOLS</h3>
            </div>
            <p className="company-description">
              We are a reputed and renowned company occupied in manufacturing, trading and 
              supplying a world class collection of Jewellery CNC Bangle Faceting Machine 
              and all types of Jewellery SPM Machineries.
            </p>
            <Link to="/about" className="read-more-btn">
              Read More
            </Link>
          </div>

          {/* Quick Links Section */}
          <div className="footer-section">
            <h4 className="section-title">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/categories">Categories</Link></li>
            </ul>
          </div>

          {/* Services Section */}
          <div className="footer-section">
            <h4 className="section-title">Services</h4>
            <ul className="footer-links">
              <li><Link to="/quality">Quality</Link></li>
              <li><Link to="/inquiry">Inquiry</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/cart">Shopping Cart</Link></li>
            </ul>
          </div>

          {/* Contact Information Section */}
          <div className="footer-section contact-section">
            <h4 className="section-title">Contact Information</h4>
            <div className="contact-info">
              <div className="contact-item">
                <div className="contact-icon">📍</div>
                <div className="contact-details">
                  <p>A-20, Shanker Tekri, Industrial Estate, Shed No. A-20, Hirji Mistry Road, Near Punjab National Bank, Jamnagar - 361004, Gujarat - INDIA</p>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="contact-icon">📞</div>
                <div className="contact-details">
                  <p>+91 288 2561871 / +91 98252 65401</p>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="contact-icon">✉️</div>
                <div className="contact-details">
                  <a href="mailto:lvsmachinetools@gmail.com">
                    lvsmachinetools@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">
              © 2024 L.V.S. Machine Tools. All rights reserved.
            </p>
            <div className="footer-legal">
              <Link to="/privacy-policy">Privacy Policy</Link>
              <Link to="/terms-of-service">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;