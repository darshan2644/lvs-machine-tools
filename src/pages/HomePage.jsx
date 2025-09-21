import React from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import CategoriesSection from '../components/CategoriesSection';
import FeaturedProducts from '../components/FeaturedProducts';
import './HomePage.css';

const HomePage = () => {

  return (
    <div className="home-page">
      {/* Modern Hero Section */}
      <HeroSection />
      
      {/* Premium Categories Section */}
      <CategoriesSection />

      {/* Featured Products Section */}
      <FeaturedProducts />

      {/* Features Section */}
      <section className="features section">
        <div className="container">
          <h2 className="section-title">Why Choose LVS Tools?</h2>
          
          <div className="features-grid grid grid-3">
            <div className="feature-card card">
              <div className="feature-icon">
                <svg className="icon-large" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 3h15l2 3-2 3H1V3z"></path>
                  <path d="M16 12v9a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-9h16z"></path>
                  <circle cx="8" cy="8" r="2"></circle>
                </svg>
              </div>
              <h3 className="feature-title">Fast Shipping</h3>
              <p className="feature-description">
                Free shipping on orders over $500. Express delivery available for urgent requirements.
              </p>
            </div>
            
            <div className="feature-card card">
              <div className="feature-icon">
                <svg className="icon-large" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h3 className="feature-title">Quality Guarantee</h3>
              <p className="feature-description">
                All products come with manufacturer warranty and our quality assurance guarantee.
              </p>
            </div>
            
            <div className="feature-card card">
              <div className="feature-icon">
                <svg className="icon-large" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                </svg>
              </div>
              <h3 className="feature-title">Expert Support</h3>
              <p className="feature-description">
                Our technical experts provide consultation and support for all your machinery needs.
              </p>
            </div>
            
            <div className="feature-card card">
              <div className="feature-icon">
                <svg className="icon-large" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
              <h3 className="feature-title">Best Prices</h3>
              <p className="feature-description">
                Competitive pricing with regular discounts and special offers for bulk purchases.
              </p>
            </div>
            
            <div className="feature-card card">
              <div className="feature-icon">
                <svg className="icon-large" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <h3 className="feature-title">24/7 Service</h3>
              <p className="feature-description">
                Round-the-clock customer service and technical support for your peace of mind.
              </p>
            </div>
            
            <div className="feature-card card">
              <div className="feature-icon">
                <svg className="icon-large" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="10" r="3"></circle>
                  <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"></path>
                </svg>
              </div>
              <h3 className="feature-title">Custom Solutions</h3>
              <p className="feature-description">
                Tailored machinery solutions and custom configurations to meet your specific needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Upgrade Your Workshop?</h2>
            <p className="cta-subtitle">
              Get expert advice and find the perfect machines for your business
            </p>
            <div className="cta-actions">
              <button className="btn btn-primary">
                Contact Our Experts
              </button>
              <button className="btn btn-secondary">
                Request Quote
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
