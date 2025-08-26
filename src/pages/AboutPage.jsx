import React from 'react';
import './AboutPage.css';

const AboutPage = () => {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="container">
          <h1 className="hero-title">
            About <span className="text-yellow">LVS Machine and Tools</span>
          </h1>
          <p className="hero-description">
            Your trusted partner for professional machine tools and industrial equipment
          </p>
        </div>
      </section>

      <section className="about-content">
        <div className="container">
          <div className="content-grid">
            <div className="content-section">
              <h2>Our Story</h2>
              <p>
                LVS Machine and Tools has been at the forefront of industrial machinery innovation for over 25 years. 
                We specialize in providing high-quality CNC machines, cutting equipment, and precision tools to 
                manufacturers, fabricators, and craftsmen worldwide.
              </p>
            </div>

            <div className="content-section">
              <h2>Our Mission</h2>
              <p>
                To deliver cutting-edge machine tools and equipment that enhance productivity, precision, and 
                profitability for our customers. We are committed to providing exceptional service and support 
                throughout the entire customer journey.
              </p>
            </div>

            <div className="content-section">
              <h2>Why Choose Us</h2>
              <ul>
                <li>25+ years of industry experience</li>
                <li>High-quality, reliable equipment</li>
                <li>Expert technical support</li>
                <li>Competitive pricing</li>
                <li>Fast shipping and delivery</li>
                <li>Custom solutions available</li>
              </ul>
            </div>

            <div className="content-section">
              <h2>Our Expertise</h2>
              <p>
                We specialize in jewelry manufacturing equipment, including CNC bangle cutting machines, 
                faceting machines, engraving equipment, and precision cutting tools. Our team of experts 
                ensures that every machine meets the highest standards of quality and performance.
              </p>
            </div>

            <div className="content-section location-section">
              <h2>Visit Our Location</h2>
              <p>
                Located in the heart of Gujarat's industrial hub, our facility houses state-of-the-art 
                machinery and serves customers across India and internationally. Come visit us to see 
                our equipment in action and discuss your specific requirements with our expert team.
              </p>
              
              <div className="location-details">
                <div className="address-info">
                  <h3>📍 LVS Machine Tools</h3>
                  <p>
                    <strong>Address:</strong> Gujarat, India<br/>
                    <strong>Business Hours:</strong> Monday - Saturday, 9:00 AM - 6:00 PM<br/>
                    <strong>Contact:</strong> +91-XXXXXXXXXX<br/>
                    <strong>Email:</strong> info@lvsmachinetools.com
                  </p>
                </div>
                
                <div className="map-container">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3687.156955891533!2d70.04875390947609!3d22.460735379486234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39576b9045344c93%3A0xbe4d9d3db617f596!2sLVS%20Machine%20Tools!5e0!3m2!1sen!2sin!4v1756185682816!5m2!1sen!2sin" 
                    width="100%" 
                    height="400" 
                    style={{border: 0, borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)'}} 
                    allowFullScreen="" 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="LVS Machine Tools Location"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
