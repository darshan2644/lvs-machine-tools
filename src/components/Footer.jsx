import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="container">
          <div className="footer-sections">
            {/* Company Info */}
            <div className="footer-section company-section">
              <div className="footer-logo">
                <img src="/images/lvs-logo.png" alt="LVS Machine Tools" className="footer-logo-img" />
                <span className="footer-logo-text">L.V.S. MACHINE TOOLS</span>
              </div>
              <p className="footer-description">
                We are reputed and renowned company occupied in manufacturer, trader and supplier a world class collection of Jewellery CNC Bangle Faceting Machine And All Types of Jewellery SPM Machineries.
              </p>
              <button className="read-more-btn">
                <i className="btn-icon">📖</i>
                Read More
              </button>
            </div>

            {/* Useful Links 1 */}
            <div className="footer-section">
              <h3 className="footer-title">Useful Links</h3>
              <div className="title-underline"></div>
              <ul className="footer-links">
                <li><Link to="/" className="footer-link">🡪 Home</Link></li>
                <li><Link to="/about" className="footer-link">🡪 About Us</Link></li>
                <li><Link to="/products" className="footer-link">🡪 Products</Link></li>
              </ul>
            </div>

            {/* Useful Links 2 */}
            <div className="footer-section">
              <h3 className="footer-title">Useful Links</h3>
              <div className="title-underline"></div>
              <ul className="footer-links">
                <li><Link to="/quality" className="footer-link">🡪 Quality</Link></li>
                <li><Link to="/inquiry" className="footer-link">🡪 Inquiry</Link></li>
                <li><Link to="/contact" className="footer-link">🡪 Contact Us</Link></li>
              </ul>
            </div>

            {/* Contact Us */}
            <div className="footer-section contact-section">
              <h3 className="footer-title">Contact Us</h3>
              <div className="title-underline"></div>
              <div className="contact-info">
                <div className="contact-item">
                  <i className="contact-icon">📍</i>
                  <div className="contact-details">
                    A-20, Shanker Tekri, Industrial Estate, Shed No. A-20, Hirji Mistry Road, Near Punjab National Bank, Jamnagar - 361004, Gujarat - INDIA
                  </div>
                </div>
                <div className="contact-item">
                  <i className="contact-icon">�</i>
                  <div className="contact-details">
                    +91 288 2561871 / +91 98252 65401
                  </div>
                </div>
                <div className="contact-item">
                  <i className="contact-icon">✉️</i>
                  <div className="contact-details">
                    lvsmachinetools@gmail.com
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
