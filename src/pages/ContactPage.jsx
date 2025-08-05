import React from 'react';
import './ContactPage.css';

const ContactPage = () => {
  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="container">
          <h1 className="hero-title">
            Contact <span className="text-yellow">Us</span>
          </h1>
          <p className="hero-description">
            Get in touch with our team for expert advice and support
          </p>
        </div>
      </section>

      <section className="contact-content">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <h2>Get In Touch</h2>
              <p>
                Have questions about our machine tools or need expert advice? 
                Our team is here to help you find the perfect solution for your needs.
              </p>

              <div className="contact-details">
                <div className="contact-item">
                  <div className="contact-icon">📧</div>
                  <div>
                    <h3>Email</h3>
                    <p>info@lvsmachinetools.com</p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">📞</div>
                  <div>
                    <h3>Phone</h3>
                    <p>+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">📍</div>
                  <div>
                    <h3>Address</h3>
                    <p>123 Industrial Avenue<br />Manufacturing District<br />City, State 12345</p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">🕒</div>
                  <div>
                    <h3>Business Hours</h3>
                    <p>Monday - Friday: 8:00 AM - 6:00 PM<br />Saturday: 9:00 AM - 4:00 PM<br />Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-form">
              <h2>Send Us a Message</h2>
              <form>
                <div className="form-group">
                  <label>Name</label>
                  <input type="text" required />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input type="email" required />
                </div>

                <div className="form-group">
                  <label>Phone</label>
                  <input type="tel" />
                </div>

                <div className="form-group">
                  <label>Subject</label>
                  <input type="text" required />
                </div>

                <div className="form-group">
                  <label>Message</label>
                  <textarea rows="5" required></textarea>
                </div>

                <button type="submit" className="btn btn-primary">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
