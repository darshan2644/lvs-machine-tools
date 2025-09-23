import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './CategoriesPage.css';

// Comprehensive category data with proper images and descriptions
const defaultCategories = [
  {
    _id: '1',
    name: 'CNC Bangle And Ring Cutting Machine',
    slug: 'cnc-bangle-ring-cutting',
    image: '/images/cnc-bangle-main.png',
    subcategories: 'Precision Cutting, Ring Formation',
    description: 'Advanced CNC machines for precision bangle and ring cutting with automated operations',
    productCount: 12
  },
  {
    _id: '2',
    name: 'Bangle CNC Cutting Machine',
    slug: 'bangle-cnc-cutting',
    image: '/images/bangle-cnc-main.png',
    subcategories: 'Bangle Manufacturing, CNC Automation',
    description: 'Specialized CNC cutting machines designed specifically for bangle production',
    productCount: 8
  },
  {
    _id: '3',
    name: 'CNC Bangle Cutting Machine',
    slug: 'cnc-bangle-cutting-machine',
    image: '/images/cnc-bangle-1.png',
    subcategories: 'Industrial Cutting, High Precision',
    description: 'Industrial-grade CNC machines for high-volume bangle cutting operations',
    productCount: 10
  },
  {
    _id: '4',
    name: 'CNC Bangle Flat And Half Round Cutting Machine',
    slug: 'cnc-bangle-flat-half-round',
    image: '/images/cnc-bangle-2.png',
    subcategories: 'Flat Cutting, Half Round Formation',
    description: 'Versatile CNC machines for both flat and half-round bangle cutting applications',
    productCount: 6
  },
  {
    _id: '5',
    name: 'Bangle Cutting Machine',
    slug: 'bangle-cutting-machine',
    image: '/images/bangle-cnc-3.png',
    subcategories: 'Traditional Cutting, Semi-Automatic',
    description: 'Reliable bangle cutting machines for various production requirements',
    productCount: 7
  },
  {
    _id: '6',
    name: 'Cutting Machine',
    slug: 'cutting-machine',
    image: '/images/bangle-cnc-4.png',
    subcategories: 'General Purpose, Multi-Material',
    description: 'General purpose cutting machines for various industrial applications',
    productCount: 15
  },
  {
    _id: '7',
    name: 'HORIZONTAL WIRE FACETING MACHINE',
    slug: 'horizontal-wire-faceting',
    image: '/images/cnc-9axis-main.png',
    subcategories: 'Wire Processing, Faceting Operations',
    description: 'Horizontal wire faceting machines for precision wire processing and faceting',
    productCount: 4
  },
  {
    _id: '8',
    name: 'Jewellery',
    slug: 'jewellery-machines',
    image: '/images/cnc-9axis-1.png',
    subcategories: 'Jewelry Manufacturing, Complete Solutions',
    description: 'Complete jewelry manufacturing machines and equipment for professional use',
    productCount: 20
  },
  {
    _id: '9',
    name: 'ATC CNC BANGLE CUTTING MACHINE',
    slug: 'atc-cnc-bangle-cutting',
    image: '/images/cnc-9axis-2.png',
    subcategories: 'Automatic Tool Change, High Efficiency',
    description: 'Advanced ATC CNC bangle cutting machines with automatic tool changing capability',
    productCount: 5
  },
  {
    _id: '10',
    name: 'Faceting Machine',
    slug: 'faceting-machine',
    image: '/images/cnc-bangle-main.png',
    subcategories: 'Gem Cutting, Precision Faceting',
    description: 'Professional faceting machines for precision gem cutting and jewelry making',
    productCount: 8
  },
  {
    _id: '11',
    name: 'CNC BANGLE DOUBLE HEAD CUTTING MACHINE',
    slug: 'cnc-bangle-double-head',
    image: '/images/bangle-cnc-1.png',
    subcategories: 'Dual Head Operation, High Productivity',
    description: 'Double head CNC bangle cutting machines for increased productivity and efficiency',
    productCount: 3
  },
  {
    _id: '12',
    name: 'Dough Balls Cutting Machine',
    slug: 'dough-balls-cutting',
    image: '/images/bangle-cnc-2.png',
    subcategories: 'Food Processing, Automated Cutting',
    description: 'Specialized machines for cutting dough balls with precision and consistency',
    productCount: 6
  },
  {
    _id: '13',
    name: 'Round Balls Automatic Faceting Cutting Machine',
    slug: 'round-balls-faceting',
    image: '/images/bangle-cnc-3.png',
    subcategories: 'Spherical Processing, Automatic Operation',
    description: 'Automatic faceting machines for round ball cutting with precision control',
    productCount: 4
  },
  {
    _id: '14',
    name: 'Pendent And Ring Engraving & Cutting Machine',
    slug: 'pendant-ring-engraving-cutting',
    image: '/images/bangle-cnc-4.png',
    subcategories: 'Engraving, Cutting, Detailed Work',
    description: 'Combined engraving and cutting machines for pendants and rings',
    productCount: 9
  },
  {
    _id: '15',
    name: 'CNC Jewellery Engraving Machine',
    slug: 'cnc-jewellery-engraving',
    image: '/images/cnc-bangle-main.png',
    subcategories: 'CNC Engraving, High Precision',
    description: 'CNC-controlled jewelry engraving machines for detailed and precise work',
    productCount: 7
  },
  {
    _id: '16',
    name: 'Jewellery Engraving Machine',
    slug: 'jewellery-engraving-machine',
    image: '/images/bangle-cnc-main.png',
    subcategories: 'Manual/Semi-Auto Engraving',
    description: 'Traditional jewelry engraving machines for custom and detailed engraving work',
    productCount: 11
  },
  {
    _id: '17',
    name: 'Bangle And Ring Turning Machine',
    slug: 'bangle-ring-turning',
    image: '/images/cnc-bangle-1.png',
    subcategories: 'Turning Operations, Finishing',
    description: 'Specialized turning machines for bangle and ring finishing operations',
    productCount: 5
  },
  {
    _id: '18',
    name: 'Bangle Turning & Finishing Machine',
    slug: 'bangle-turning-finishing',
    image: '/images/cnc-bangle-2.png',
    subcategories: 'Surface Finishing, Polish Operations',
    description: 'Complete turning and finishing machines for bangle surface preparation and polishing',
    productCount: 6
  }
];

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [productCounts, setProductCounts] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesRes, productsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/categories'),
          axios.get('http://localhost:5000/api/products')
        ]);
        
        setCategories(categoriesRes.data.data || defaultCategories);
        
        // Count products per category
        if (productsRes.data.success) {
          const counts = {};
          productsRes.data.data.forEach(product => {
            counts[product.category] = (counts[product.category] || 0) + 1;
          });
          setProductCounts(counts);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setCategories(defaultCategories);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.subcategories?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="categories-page">
      {/* Breadcrumb Navigation */}
      <section className="breadcrumb-section">
        <div className="container">
          <nav className="breadcrumb">
            <Link to="/" className="breadcrumb-link">Home</Link>
            <span className="breadcrumb-separator">&gt;</span>
            <span className="breadcrumb-current">Our Categories</span>
          </nav>
        </div>
      </section>

      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">Explore Our Product Lines</h1>
          <p className="page-subtitle">
            From precision jewelry fabrication to automated cutting solutions, find the machinery that powers your production.
          </p>
          
          {/* Search Bar */}
          <form className="search-form" onSubmit={handleSearchSubmit}>
            <div className="search-container">
              <input
                type="text"
                className="search-input"
                placeholder="Search for a machine or category..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <button type="submit" className="search-button">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Category Grid */}
      <section className="categories-section">
        <div className="container">
          <div className="categories-grid">
            {filteredCategories.map((category) => (
              <div key={category._id} className="category-card">
                <div className="category-image-wrapper">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="category-image"
                    onError={(e) => {
                      e.target.src = '/images/placeholder-product.svg';
                    }}
                  />
                </div>
                
                <div className="category-content">
                  <h3 className="category-title">{category.name}</h3>
                  
                  {category.subcategories && (
                    <p className="category-subcategories">{category.subcategories}</p>
                  )}
                  
                  <p className="category-description">{category.description}</p>
                  
                  <p className="category-count">
                    {productCounts[category.slug] || category.productCount || 0} Products Available
                  </p>
                  
                  <Link 
                    to={`/products?category=${category.slug}`} 
                    className="category-cta"
                  >
                    View Products →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {filteredCategories.length === 0 && (
            <div className="no-results">
              <h3>No categories found</h3>
              <p>Try adjusting your search terms or browse all categories.</p>
            </div>
          )}
        </div>
      </section>

      {/* Custom Solution Section */}
      <section className="custom-solution-section">
        <div className="container">
          <div className="custom-solution-content">
            <h2 className="custom-solution-title">Looking for a Custom Solution?</h2>
            <p className="custom-solution-text">
              Our team of engineers can help design and build custom machinery to meet your exact specifications.
            </p>
            <Link to="/contact" className="custom-solution-btn">
              Contact Our Experts
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CategoriesPage;