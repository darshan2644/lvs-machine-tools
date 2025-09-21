import React from 'react';
import './AboutPage.css';

const AboutPage = () => {
  const whyChooseUsFeatures = [
    {
      id: 1,
      number: "01",
      title: "Advanced Manufacturing Unit",
      description: "Constant efforts to improve our product line using state-of-the-art technology."
    },
    {
      id: 2,
      number: "02",
      title: "Customized Solutions",
      description: "Tailoring our machinery to meet the specific, unique requirements of each client."
    },
    {
      id: 3,
      number: "03",
      title: "Timely Delivery & Support",
      description: "Ensuring total client satisfaction with on-time delivery and dedicated after-sales support."
    },
    {
      id: 4,
      number: "04",
      title: "Moral & Ethical Dealings",
      description: "Operating with complete transparency and adhering to moral business practices."
    }
  ];

  const coreValues = [
    "Ethics",
    "Innovation (R&D)",
    "Delighted Customer",
    "Time Discipline",
    "Respect for All",
    "Training and Development of All Staff"
  ];

  return (
    <div className="about-page">
      <div className="about-container">
        {/* Main Introduction Section */}
        <section className="intro-section">
          <div className="intro-content">
            <div className="intro-text">
              <h1 className="intro-headline">World-Class Industrial Infrastructure.</h1>
              <p className="intro-tagline">Innovating the Future of Precision Machinery.</p>
              <p className="intro-description">
                LVS Machine Tools is a world-class infrastructural facility, fully-fledged with modern machinery and equipment. 
                We have the caliber to innovate new techniques of fabricating sophisticated Bangles & Rings, Pendants, and Round Ball Making Machines. 
                Our team of quality experts examines the efficiency and performance of all Jewellery CNC Bangle Faceting machines and Jewellery SPM Machineries.
              </p>
            </div>
            <div className="intro-image">
              <div className="facility-image-placeholder">
                <svg width="400" height="300" viewBox="0 0 400 300" fill="none">
                  <rect width="400" height="300" fill="#f8fafc" rx="12"/>
                  <rect x="50" y="50" width="300" height="200" fill="#e2e8f0" rx="8"/>
                  <circle cx="200" cy="120" r="30" fill="#718096"/>
                  <rect x="170" y="140" width="60" height="40" fill="#718096" rx="4"/>
                  <rect x="150" y="190" width="100" height="20" fill="#2d3748" rx="2"/>
                  <text x="200" y="240" textAnchor="middle" fill="#718096" fontSize="14">LVS Manufacturing Facility</text>
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="why-choose-section">
          <div className="section-header">
            <h2 className="section-title">Why Choose Us?</h2>
          </div>
          
          <div className="features-grid">
            {whyChooseUsFeatures.map(feature => (
              <div key={feature.id} className="feature-card">
                <div className="feature-number">{feature.number}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Core Values Section */}
        <section className="core-values-section">
          <div className="values-content">
            <div className="values-text">
              <h2 className="values-headline">Our Core Values</h2>
            </div>
            <div className="values-list">
              {coreValues.map((value, index) => (
                <div key={index} className="value-item">
                  <div className="value-icon">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <span className="value-text">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Engineering Objective Section */}
        <section className="engineering-section">
          <div className="engineering-content">
            <div className="engineering-image">
              <div className="cnc-image-placeholder">
                <svg width="400" height="300" viewBox="0 0 400 300" fill="none">
                  <rect width="400" height="300" fill="#f8fafc" rx="12"/>
                  <rect x="30" y="40" width="340" height="220" fill="#e2e8f0" rx="8"/>
                  <rect x="60" y="80" width="280" height="140" fill="#cbd5e0" rx="6"/>
                  <circle cx="200" cy="130" r="40" fill="#4a5568"/>
                  <rect x="180" y="150" width="40" height="30" fill="#2d3748" rx="2"/>
                  <rect x="100" y="200" width="200" height="10" fill="#718096" rx="1"/>
                  <text x="200" y="280" textAnchor="middle" fill="#718096" fontSize="14">CNC Machine in Operation</text>
                </svg>
              </div>
            </div>
            <div className="engineering-text">
              <h2 className="engineering-headline">Efficiency Through Automation.</h2>
              <p className="engineering-description">
                Our CNC machines are designed to dramatically increase efficiency. They enhance <strong>Speed</strong> by consolidating multiple steps, 
                provide <strong>Cost Savings</strong> by optimizing raw material usage, offer <strong>Flexibility</strong> with easily recalled programs, 
                and enable full <strong>Automation</strong> for continuous, unmanned operation.
              </p>
              <div className="engineering-benefits">
                <div className="benefit-item">
                  <span className="benefit-label">Speed</span>
                  <span className="benefit-description">Consolidating multiple manufacturing steps</span>
                </div>
                <div className="benefit-item">
                  <span className="benefit-label">Cost Savings</span>
                  <span className="benefit-description">Optimizing raw material usage</span>
                </div>
                <div className="benefit-item">
                  <span className="benefit-label">Flexibility</span>
                  <span className="benefit-description">Easily recalled programs</span>
                </div>
                <div className="benefit-item">
                  <span className="benefit-label">Automation</span>
                  <span className="benefit-description">Continuous, unmanned operation</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;