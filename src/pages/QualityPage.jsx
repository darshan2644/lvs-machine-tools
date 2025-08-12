import React from 'react';
import './AboutPage.css';

const QualityPage = () => {
  return (
    <div className="page-container">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Quality Assurance</h1>
          <p className="page-subtitle">Committed to Excellence in Every Machine</p>
        </div>

        <div className="content-section">
          <div className="quality-grid">
            <div className="quality-card">
              <div className="quality-icon">🏆</div>
              <h3>ISO Certified</h3>
              <p>Our manufacturing processes are ISO 9001:2015 certified, ensuring consistent quality standards.</p>
            </div>

            <div className="quality-card">
              <div className="quality-icon">🔬</div>
              <h3>Rigorous Testing</h3>
              <p>Every machine undergoes comprehensive testing before delivery to ensure optimal performance.</p>
            </div>

            <div className="quality-card">
              <div className="quality-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                </svg>
              </div>
              <h3>Premium Materials</h3>
              <p>We use only the finest materials and components sourced from trusted global suppliers.</p>
            </div>

            <div className="quality-card">
              <div className="quality-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <h3>Quality Control</h3>
              <p>Multi-stage quality control processes ensure every product meets our high standards.</p>
            </div>
          </div>

          <div className="quality-content">
            <h2>Our Quality Promise</h2>
            <p>
              At LVS Machine Tools, quality is not just a goal – it's our foundation. We are committed to 
              delivering machinery that exceeds expectations and stands the test of time. Our quality 
              assurance program encompasses every aspect of our operations, from design and manufacturing 
              to testing and delivery.
            </p>

            <h3>Quality Standards</h3>
            <ul>
              <li>ISO 9001:2015 Quality Management System</li>
              <li>CE Marking for European Conformity</li>
              <li>Strict adherence to international safety standards</li>
              <li>Continuous improvement and innovation processes</li>
              <li>Regular audits and quality assessments</li>
            </ul>

            <h3>Testing Procedures</h3>
            <p>
              Our comprehensive testing procedures include performance testing, durability testing, 
              safety compliance checks, and precision accuracy verification. Each machine is 
              thoroughly tested before shipment to ensure it meets our exacting standards.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QualityPage;
