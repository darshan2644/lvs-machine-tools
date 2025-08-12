import React, { useState } from 'react';
import './AboutPage.css';

const InquiryPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    product: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    alert('Thank you for your inquiry! We will contact you soon.');
  };

  return (
    <div className="page-container">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Product Inquiry</h1>
          <p className="page-subtitle">Get detailed information about our machine tools</p>
        </div>

        <div className="content-section">
          <div className="inquiry-grid">
            <div className="inquiry-info">
              <h2>Request Information</h2>
              <p>
                Interested in our machine tools? Fill out the form and our experts will 
                provide you with detailed specifications, pricing, and delivery information.
              </p>

              <div className="inquiry-benefits">
                <h3>Why Choose LVS Machine Tools?</h3>
                <ul>
                  <li>✓ Expert technical consultation</li>
                  <li>✓ Customized solutions for your needs</li>
                  <li>✓ Competitive pricing and flexible terms</li>
                  <li>✓ Comprehensive after-sales support</li>
                  <li>✓ Fast delivery and installation</li>
                </ul>
              </div>

              <div className="contact-info">
                <h3>Quick Contact</h3>
                <div className="contact-item">
                  <span className="contact-label">Phone:</span>
                  <span>+91 288 2561871 / +91 98252 65401</span>
                </div>
                <div className="contact-item">
                  <span className="contact-label">Email:</span>
                  <span>lvsmachinetools@gmail.com</span>
                </div>
              </div>
            </div>

            <div className="inquiry-form">
              <form onSubmit={handleSubmit} className="form">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="company">Company Name</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="product">Product of Interest</label>
                  <select
                    id="product"
                    name="product"
                    value={formData.product}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="">Select a product category</option>
                    <option value="cnc-bangle-cutting">CNC Bangle & Ring Cutting Machine</option>
                    <option value="dough-balls-cutting">Dough Balls Cutting Machine</option>
                    <option value="pendent-ring-engraving">Pendant & Ring Engraving Machine</option>
                    <option value="faceting-machine">Faceting Machine</option>
                    <option value="jewellery-cutting">Jewellery Cutting Machine</option>
                    <option value="jewellery-engraving">Jewellery Engraving Machine</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="4"
                    className="form-input"
                    placeholder="Please describe your requirements, quantity needed, or any specific questions..."
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary">
                  Send Inquiry
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InquiryPage;
