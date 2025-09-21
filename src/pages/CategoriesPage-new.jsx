import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CategoriesPageNew.css';

// Complete category data for CNC and jewelry machines
const categories = [
  {
    id: 'cnc-bangle-ring-cutting',
    name: 'CNC Bangle & Ring Cutting Machine',
    image: '/images/cnc-bangle-main.png',
    description: 'Advanced CNC machines for precision bangle and ring cutting with automated operations',
    productCount: 12,
    features: ['High Precision', 'Automated Operation', 'Multiple Sizes']
  },
  {
    id: 'bangle-cnc-cutting',
    name: 'Bangle CNC Cutting Machine',
    image: '/images/bangle-cnc-main.png',
    description: 'Specialized CNC cutting machines designed specifically for bangle production',
    productCount: 8,
    features: ['CNC Automation', 'High Speed', 'Consistent Quality']
  },
  {
    id: 'cnc-bangle-cutting-machine',
    name: 'CNC Bangle Cutting Machine',
    image: '/images/cnc-bangle-1.png',
    description: 'Industrial-grade CNC machines for high-volume bangle cutting operations',
    productCount: 10,
    features: ['Industrial Grade', 'High Volume', 'Precision Cutting']
  },
  {
    id: 'cnc-bangle-flat-half-round',
    name: 'CNC Bangle Flat & Half Round Cutting',
    image: '/images/cnc-bangle-2.png',
    description: 'Versatile CNC machines for both flat and half-round bangle cutting applications',
    productCount: 6,
    features: ['Dual Function', 'Versatile Design', 'Precision Control']
  },
  {
    id: 'bangle-cutting-machine',
    name: 'Bangle Cutting Machine',
    image: '/images/bangle-cnc-3.png',
    description: 'Reliable bangle cutting machines for various production requirements',
    productCount: 9,
    features: ['Reliable Operation', 'Cost Effective', 'Easy Operation']
  },
  {
    id: 'cutting-machine',
    name: 'Cutting Machine',
    image: '/images/bangle-cnc-4.png',
    description: 'General-purpose cutting machines for various materials and applications',
    productCount: 15,
    features: ['Multi-Purpose', 'Various Materials', 'Flexible Setup']
  },
  {
    id: '7-axis-cnc-round-ball',
    name: '7 Axis CNC Round Ball Cutting',
    image: '/images/cnc-9axis-main.png',
    description: 'Advanced 7-axis CNC machines for complex round ball cutting and engraving',
    productCount: 4,
    features: ['7-Axis Control', 'Complex Geometry', 'High Precision']
  },
  {
    id: 'cnc-bangle-mr5',
    name: 'CNC Bangle MR5 Cutting Machine',
    image: '/images/cnc-9axis-1.png',
    description: 'MR5 series CNC bangle cutting machines with enhanced precision features',
    productCount: 7,
    features: ['MR5 Technology', 'Enhanced Precision', 'Advanced Control']
  },
  {
    id: 'cnc-bangle-semi-auto',
    name: 'CNC Bangle Semi Auto Cutting',
    image: '/images/cnc-9axis-2.png',
    description: 'Semi-automatic CNC bangle cutting machines for flexible production',
    productCount: 5,
    features: ['Semi-Automatic', 'Flexible Production', 'User Friendly']
  },
  {
    id: 'jewelry-cnc-machine',
    name: 'Jewelry CNC Machine',
    image: '/images/cnc-bangle-main.png',
    description: 'Specialized CNC machines designed for jewelry manufacturing and processing',
    productCount: 13,
    features: ['Jewelry Focused', 'Fine Detail', 'Precious Materials']
  },
  {
    id: 'cnc-bangle-double-head',
    name: 'CNC Bangle Double Head Cutting',
    image: '/images/bangle-cnc-1.png',
    description: 'Double head CNC bangle cutting machines for increased productivity',
    productCount: 3,
    features: ['Dual Head', 'High Productivity', 'Efficient Operation']
  },
  {
    id: 'dough-balls-cutting',
    name: 'Dough Balls Cutting Machine',
    image: '/images/bangle-cnc-2.png',
    description: 'Specialized machines for cutting dough balls with precision and consistency',
    productCount: 6,
    features: ['Food Grade', 'Consistent Size', 'Automated Process']
  },
  {
    id: 'round-balls-faceting',
    name: 'Round Balls Automatic Faceting',
    image: '/images/bangle-cnc-3.png',
    description: 'Automatic faceting machines for round ball cutting with precision control',
    productCount: 4,
    features: ['Automatic Faceting', 'Precision Control', 'Spherical Processing']
  },
  {
    id: 'pendant-ring-engraving-cutting',
    name: 'Pendant & Ring Engraving & Cutting',
    image: '/images/bangle-cnc-4.png',
    description: 'Combined engraving and cutting machines for pendants and rings',
    productCount: 9,
    features: ['Dual Function', 'Fine Engraving', 'Detailed Work']
  },
  {
    id: 'cnc-jewellery-engraving',
    name: 'CNC Jewellery Engraving Machine',
    image: '/images/cnc-bangle-main.png',
    description: 'CNC-controlled jewelry engraving machines for detailed and precise work',
    productCount: 7,
    features: ['CNC Control', 'Fine Detail', 'Precision Engraving']
  },
  {
    id: 'jewellery-engraving-machine',
    name: 'Jewellery Engraving Machine',
    image: '/images/bangle-cnc-main.png',
    description: 'Traditional jewelry engraving machines for custom and detailed engraving work',
    productCount: 11,
    features: ['Traditional Design', 'Custom Work', 'Manual Control']
  },
  {
    id: 'bangle-ring-turning',
    name: 'Bangle & Ring Turning Machine',
    image: '/images/cnc-bangle-1.png',
    description: 'Specialized turning machines for bangle and ring finishing operations',
    productCount: 5,
    features: ['Turning Operation', 'Finishing Quality', 'Surface Polish']
  },
  {
    id: 'bangle-turning-finishing',
    name: 'Bangle Turning & Finishing Machine',
    image: '/images/cnc-bangle-2.png',
    description: 'Complete turning and finishing machines for bangle surface preparation and polishing',
    productCount: 6,
    features: ['Complete Solution', 'Surface Prep', 'Professional Finish']
  }
];

const CategoriesPageNew = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCategories, setFilteredCategories] = useState(categories);

  useEffect(() => {
    const filtered = categories.filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.features.some(feature => 
        feature.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredCategories(filtered);
  }, [searchTerm]);

  return (
    <div className="categories-page-new">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Machine Categories</h1>
            <p className="hero-subtitle">
              Explore our comprehensive range of CNC and jewelry manufacturing machines
            </p>
            
            {/* Search Bar */}
            <div className="search-container">
              <input
                type="text"
                className="search-input"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg className="search-icon" width="20" height="20" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="categories-section">
        <div className="container">
          <div className="categories-grid">
            {filteredCategories.map((category) => (
              <div key={category.id} className="category-card">
                <div className="category-image">
                  <img
                    src={category.image}
                    alt={category.name}
                    onError={(e) => {
                      e.target.src = '/images/placeholder-product.svg';
                    }}
                  />
                </div>
                
                <div className="category-content">
                  <h3 className="category-name">{category.name}</h3>
                  <p className="category-description">{category.description}</p>
                  
                  <div className="category-features">
                    {category.features.map((feature, index) => (
                      <span key={index} className="feature-tag">{feature}</span>
                    ))}
                  </div>
                  
                  <div className="category-footer">
                    <span className="product-count">{category.productCount} Products</span>
                    <Link 
                      to={`/products?category=${category.id}`} 
                      className="view-products-btn"
                    >
                      View Products
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredCategories.length === 0 && (
            <div className="no-results">
              <h3>No categories found</h3>
              <p>Try adjusting your search terms.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CategoriesPageNew;