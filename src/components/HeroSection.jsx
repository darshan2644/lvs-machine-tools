import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HeroSection.css';

const HeroSection = () => {
  const navigate = useNavigate();

  const handleGetQuote = () => {
    navigate('/contact');
  };

  return (
    <div className="hero-container">
      {/* Hero Content */}
      <main className="hero-main">
        <div className="hero-grid">
          {/* Left Content */}
          <div className="hero-left">
            <div className="hero-content">
              <h1 className="hero-headline">
                <span className="headline-primary">Precision Engineering</span>
                <span className="headline-secondary">for Modern Industry</span>
              </h1>
              
              <p className="hero-description">
                Our integrated approach to industrial machinery and automation provides 
                comprehensive solutions that meet the complex needs of our clients.
              </p>
              
              <button className="cta-button" onClick={handleGetQuote}>
                <span>Get a Quote</span>
                <svg width="20" height="20" viewBox="0 0 24 24" className="cta-arrow">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Right Content */}
          <div className="hero-right">
            <div className="hero-images">
              {/* Main CNC Machine Image */}
              <div className="main-image">
                <img 
                  src="/images/cnc-9axis-main.png" 
                  alt="Sophisticated CNC Machine in Modern Workshop"
                  className="cnc-image"
                />
              </div>
              
              {/* Overlapping Detail Image */}
              <div className="detail-image">
                <img 
                  src="/images/cnc-bangle-main.png" 
                  alt="Precision Metal Part Close-up"
                  className="detail-part"
                />
              </div>
            </div>

            {/* Statistics Bar */}
            <div className="stats-bar">
              <div className="stat-item featured">
                <div className="stat-number">500+</div>
                <div className="stat-label">Machines Sold</div>
                <div className="stat-highlight"></div>
              </div>
              
              <div className="stat-item">
                <div className="stat-number">35</div>
                <div className="stat-label">Industries</div>
              </div>
              
              <div className="stat-item">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Support</div>
              </div>
              
              <div className="stat-item">
                <div className="stat-number">99.8%</div>
                <div className="stat-label">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HeroSection;