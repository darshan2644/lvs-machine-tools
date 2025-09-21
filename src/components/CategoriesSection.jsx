import React from 'react';
import { Link } from 'react-router-dom';
import './CategoriesSection.css';

const CategoriesSection = () => {
  const categories = [
    {
      id: 'cnc-bangle-ring',
      title: 'CNC Bangle And Ring Cutting Machine',
      icon: 'ring',
      subcategories: [
        'Bangle CNC Cutting Machine',
        'ATC CNC BANGLE CUTTING MACHINE',
        'CNC BANGLE DOUBLE HEAD CUTTING MACHINE'
      ]
    },
    {
      id: 'faceting-machine',
      title: 'Faceting Machine',
      icon: 'faceting',
      subcategories: [
        '9 Axis CNC Universal Cutting & Engraving',
        'Auto Tool Changer Machine',
        'HORIZONTAL WIRE FACETING MACHINE'
      ]
    },
    {
      id: 'pendant-ring-engraving',
      title: 'Pendent And Ring Engraving & Cutting Machine',
      icon: 'engraving',
      subcategories: [
        'CNC Jewellery Engraving Machine',
        'Precision Engraving Systems',
        'Multi-Axis Cutting Solutions'
      ]
    },
    {
      id: 'dough-balls-cutting',
      title: 'Dough Balls Cutting Machine',
      icon: 'cutting',
      subcategories: [
        'Round Balls Automatic Faceting Cutting Machine',
        'Precision Ball Cutting Systems',
        'Automated Faceting Solutions'
      ]
    },
    {
      id: 'jewellery-cutting',
      title: 'Jewellery Cutting Machine',
      icon: 'jewellery',
      subcategories: [
        'Continuous Pipe Cutting Machine',
        'High-Precision Jewellery Tools',
        'Professional Cutting Solutions'
      ]
    },
    {
      id: 'jewellery-engraving',
      title: 'Jewellery Engraving Machine',
      icon: 'machine',
      subcategories: [
        'Professional Jewellery Engraving',
        'CNC Engraving Systems',
        'Precision Marking Solutions'
      ]
    }
  ];

  const getIcon = (iconType) => {
    const icons = {
      ring: (
        <svg width="48" height="48" viewBox="0 0 64 64" className="category-icon">
          <circle cx="32" cy="32" r="20" stroke="currentColor" strokeWidth="2.5" fill="none"/>
          <circle cx="32" cy="32" r="12" stroke="currentColor" strokeWidth="2" fill="none"/>
          <path d="M20 24 L44 24 M20 40 L44 40" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      ),
      faceting: (
        <svg width="48" height="48" viewBox="0 0 64 64" className="category-icon">
          <polygon points="32,8 48,24 32,40 16,24" stroke="currentColor" strokeWidth="2.5" fill="none"/>
          <polygon points="32,16 40,24 32,32 24,24" stroke="currentColor" strokeWidth="2" fill="none"/>
          <path d="M24 24 L40 24 M28 28 L36 28" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      ),
      engraving: (
        <svg width="48" height="48" viewBox="0 0 64 64" className="category-icon">
          <rect x="12" y="20" width="40" height="24" rx="4" stroke="currentColor" strokeWidth="2.5" fill="none"/>
          <circle cx="24" cy="32" r="4" stroke="currentColor" strokeWidth="2" fill="none"/>
          <circle cx="40" cy="32" r="3" stroke="currentColor" strokeWidth="2" fill="none"/>
          <path d="M16 26 L48 26 M16 38 L48 38 M20 30 L44 30 M20 34 L44 34" stroke="currentColor" strokeWidth="1"/>
        </svg>
      ),
      cutting: (
        <svg width="48" height="48" viewBox="0 0 64 64" className="category-icon">
          <rect x="10" y="16" width="44" height="32" rx="6" stroke="currentColor" strokeWidth="2.5" fill="none"/>
          <circle cx="24" cy="32" r="6" stroke="currentColor" strokeWidth="2" fill="none"/>
          <circle cx="40" cy="32" r="4" stroke="currentColor" strokeWidth="2" fill="none"/>
          <path d="M14 22 L50 22 M14 42 L50 42 M18 26 L46 26 M18 38 L46 38" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      ),
      jewellery: (
        <svg width="48" height="48" viewBox="0 0 64 64" className="category-icon">
          <path d="M16 20 L48 20 L44 44 L20 44 Z" stroke="currentColor" strokeWidth="2.5" fill="none"/>
          <circle cx="28" cy="30" r="3" stroke="currentColor" strokeWidth="2" fill="none"/>
          <circle cx="36" cy="36" r="2.5" stroke="currentColor" strokeWidth="2" fill="none"/>
          <path d="M20 24 L44 24 M22 28 L42 28 M24 32 L40 32" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      ),
      machine: (
        <svg width="48" height="48" viewBox="0 0 64 64" className="category-icon">
          <rect x="8" y="18" width="48" height="28" rx="4" stroke="currentColor" strokeWidth="2.5" fill="none"/>
          <circle cx="20" cy="32" r="5" stroke="currentColor" strokeWidth="2" fill="none"/>
          <circle cx="44" cy="32" r="4" stroke="currentColor" strokeWidth="2" fill="none"/>
          <rect x="30" y="28" width="8" height="8" stroke="currentColor" strokeWidth="2" fill="none"/>
          <path d="M12 24 L52 24 M12 40 L52 40" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      )
    };
    
    return icons[iconType] || icons.machine;
  };

  return (
    <section className="categories-section">
      <div className="categories-container">
        <div className="categories-header">
          <h2 className="categories-title">Explore Our Precision Categories</h2>
          <p className="categories-subtitle">
            Discover our comprehensive range of industrial machinery and precision tools
          </p>
        </div>

        <div className="categories-grid">
          {categories.map((category) => (
            <div key={category.id} className="category-card">
              <div className="category-icon-wrapper">
                {getIcon(category.icon)}
              </div>
              
              <h3 className="category-title">{category.title}</h3>
              
              <ul className="category-subcategories">
                {category.subcategories.map((subcategory, index) => (
                  <li key={index} className="subcategory-item">
                    {subcategory}
                  </li>
                ))}
              </ul>
              
              <Link 
                to={`/categories/${category.id}`} 
                className="category-link"
              >
                View Details
                <svg width="16" height="16" viewBox="0 0 24 24" className="link-arrow">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
              </Link>
            </div>
          ))}
        </div>

        <div className="categories-cta">
          <Link to="/categories" className="view-all-btn">
            View All Categories
            <svg width="18" height="18" viewBox="0 0 24 24" className="btn-arrow">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;