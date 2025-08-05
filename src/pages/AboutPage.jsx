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
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
