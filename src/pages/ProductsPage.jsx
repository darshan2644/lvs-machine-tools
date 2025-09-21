import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { addToCart } from '../services/cartService';
import './ProductsPage.css';

// Sample products for fallback
const sampleProducts = [
  // CNC Bangle And Ring Cutting Machine Category
  {
    _id: 'cnc-bangle-ring-001',
    name: 'CNC Bangle And Ring Cutting Machine Model A1',
    description: 'Advanced CNC machine for precision bangle and ring cutting with automated operations and high accuracy.',
    price: 185000,
    image: '/images/cnc-bangle-main.png',
    category: 'cnc-bangle-ring-cutting',
    categoryName: 'CNC Bangle And Ring Cutting Machine'
  },
  {
    _id: 'cnc-bangle-ring-002',
    name: 'Professional CNC Bangle Ring Cutter Pro',
    description: 'Professional grade CNC cutting machine designed for high-volume bangle and ring production.',
    price: 220000,
    image: '/images/bangle-cnc-1.png',
    category: 'cnc-bangle-ring-cutting',
    categoryName: 'CNC Bangle And Ring Cutting Machine'
  },
  
  // Bangle CNC Cutting Machine Category
  {
    _id: 'bangle-cnc-001',
    name: 'Bangle CNC Cutting Machine Standard',
    description: 'Specialized CNC cutting machine designed specifically for bangle production with precision control.',
    price: 105000,
    image: '/images/bangle-cnc-main.png',
    category: 'bangle-cnc-cutting',
    categoryName: 'Bangle CNC Cutting Machine'
  },
  {
    _id: 'bangle-cnc-002',
    name: 'Advanced Bangle CNC Cutter',
    description: 'Advanced bangle CNC cutting machine with enhanced features for professional jewelry manufacturing.',
    price: 125000,
    image: '/images/bangle-cnc-2.png',
    category: 'bangle-cnc-cutting',
    categoryName: 'Bangle CNC Cutting Machine'
  },
  
  // CNC Bangle Cutting Machine Category
  {
    _id: 'cnc-bangle-001',
    name: 'CNC Bangle Cutting Machine Industrial',
    description: 'Industrial-grade CNC machine for high-volume bangle cutting operations with superior precision.',
    price: 95000,
    image: '/images/cnc-bangle-main.png',
    category: 'cnc-bangle-cutting-machine',
    categoryName: 'CNC Bangle Cutting Machine'
  },
  {
    _id: 'cnc-bangle-002',
    name: 'Heavy Duty CNC Bangle Cutter',
    description: 'Heavy duty CNC bangle cutting machine designed for continuous industrial operations.',
    price: 135000,
    image: '/images/cnc-bangle-1.png',
    category: 'cnc-bangle-cutting-machine',
    categoryName: 'CNC Bangle Cutting Machine'
  },
  
  // CNC Bangle Flat And Half Round Cutting Machine Category
  {
    _id: 'cnc-flat-half-001',
    name: 'CNC Bangle Flat And Half Round Cutting Machine',
    description: 'Versatile CNC machine for both flat and half-round bangle cutting applications.',
    price: 165000,
    image: '/images/cnc-bangle-2.png',
    category: 'cnc-bangle-flat-half-round',
    categoryName: 'CNC Bangle Flat And Half Round Cutting Machine'
  },
  
  // Bangle Cutting Machine Category
  {
    _id: 'bangle-cutting-001',
    name: 'Semi-Automatic Bangle Cutting Machine',
    description: 'Reliable semi-automatic bangle cutting machine for various production requirements.',
    price: 75000,
    image: '/images/bangle-cnc-3.png',
    category: 'bangle-cutting-machine',
    categoryName: 'Bangle Cutting Machine'
  },
  {
    _id: 'bangle-cutting-002',
    name: 'Manual Bangle Cutting Machine',
    description: 'Traditional manual bangle cutting machine for precision custom work.',
    price: 45000,
    image: '/images/bangle-cnc-4.png',
    category: 'bangle-cutting-machine',
    categoryName: 'Bangle Cutting Machine'
  },
  
  // Cutting Machine Category
  {
    _id: 'cutting-001',
    name: 'Multi-Purpose Cutting Machine',
    description: 'General purpose cutting machine for various industrial applications and materials.',
    price: 85000,
    image: '/images/cnc-9axis-main.png',
    category: 'cutting-machine',
    categoryName: 'Cutting Machine'
  },
  {
    _id: 'cutting-002',
    name: 'Industrial Cutting Machine Pro',
    description: 'Professional industrial cutting machine with advanced control systems.',
    price: 120000,
    image: '/images/cnc-9axis-1.png',
    category: 'cutting-machine',
    categoryName: 'Cutting Machine'
  },
  
  // HORIZONTAL WIRE FACETING MACHINE Category
  {
    _id: 'wire-faceting-001',
    name: 'Horizontal Wire Faceting Machine Model H1',
    description: 'Horizontal wire faceting machine for precision wire processing and faceting operations.',
    price: 195000,
    image: '/images/cnc-9axis-2.png',
    category: 'horizontal-wire-faceting',
    categoryName: 'HORIZONTAL WIRE FACETING MACHINE'
  },
  
  // Jewellery Category
  {
    _id: 'jewellery-001',
    name: 'Complete Jewelry Manufacturing System',
    description: 'Complete jewelry manufacturing machines and equipment for professional jewelry making.',
    price: 350000,
    image: '/images/bangle-cnc-main.png',
    category: 'jewellery-machines',
    categoryName: 'Jewellery'
  },
  {
    _id: 'jewellery-002',
    name: 'Jewelry Production Line Machine',
    description: 'Automated jewelry production line machine for high-volume manufacturing.',
    price: 425000,
    image: '/images/bangle-cnc-1.png',
    category: 'jewellery-machines',
    categoryName: 'Jewellery'
  },
  
  // ATC CNC BANGLE CUTTING MACHINE Category
  {
    _id: 'atc-cnc-001',
    name: 'ATC CNC Bangle Cutting Machine Auto',
    description: 'Advanced ATC CNC bangle cutting machine with automatic tool changing capability.',
    price: 285000,
    image: '/images/bangle-cnc-2.png',
    category: 'atc-cnc-bangle-cutting',
    categoryName: 'ATC CNC BANGLE CUTTING MACHINE'
  },
  
  // Faceting Machine Category
  {
    _id: 'faceting-001',
    name: 'Professional Faceting Machine',
    description: 'Professional faceting machine for precision gem cutting and jewelry making.',
    price: 145000,
    image: '/images/cnc-bangle-3.png',
    category: 'faceting-machine',
    categoryName: 'Faceting Machine'
  },
  {
    _id: 'faceting-002',
    name: 'Automated Faceting Machine',
    description: 'Automated faceting machine with computer-controlled precision cutting.',
    price: 210000,
    image: '/images/cnc-bangle-4.png',
    category: 'faceting-machine',
    categoryName: 'Faceting Machine'
  },
  
  // CNC BANGLE DOUBLE HEAD CUTTING MACHINE Category
  {
    _id: 'double-head-001',
    name: 'CNC Bangle Double Head Cutting Machine',
    description: 'Double head CNC bangle cutting machine for increased productivity and efficiency.',
    price: 395000,
    image: '/images/cnc-bangle-main.png',
    category: 'cnc-bangle-double-head',
    categoryName: 'CNC BANGLE DOUBLE HEAD CUTTING MACHINE'
  },
  
  // Dough Balls Cutting Machine Category
  {
    _id: 'dough-balls-001',
    name: 'Automatic Dough Balls Cutting Machine',
    description: 'Specialized machine for cutting dough balls with precision and consistency for food processing.',
    price: 65000,
    image: '/images/bangle-cnc-1.png',
    category: 'dough-balls-cutting',
    categoryName: 'Dough Balls Cutting Machine'
  },
  
  // Round Balls Automatic Faceting Cutting Machine Category
  {
    _id: 'round-balls-001',
    name: 'Round Balls Automatic Faceting Cutting Machine',
    description: 'Automatic faceting machine for round ball cutting with precision control systems.',
    price: 175000,
    image: '/images/bangle-cnc-2.png',
    category: 'round-balls-faceting',
    categoryName: 'Round Balls Automatic Faceting Cutting Machine'
  },
  
  // Pendent And Ring Engraving & Cutting Machine Category
  {
    _id: 'pendant-ring-001',
    name: 'Pendant And Ring Engraving & Cutting Machine',
    description: 'Combined engraving and cutting machine for pendants and rings with detailed precision work.',
    price: 155000,
    image: '/images/bangle-cnc-3.png',
    category: 'pendant-ring-engraving-cutting',
    categoryName: 'Pendent And Ring Engraving & Cutting Machine'
  },
  
  // CNC Jewellery Engraving Machine Category
  {
    _id: 'cnc-engraving-001',
    name: 'CNC Jewellery Engraving Machine Pro',
    description: 'CNC-controlled jewelry engraving machine for detailed and precise engraving work.',
    price: 135000,
    image: '/images/bangle-cnc-4.png',
    category: 'cnc-jewellery-engraving',
    categoryName: 'CNC Jewellery Engraving Machine'
  },
  
  // Jewellery Engraving Machine Category
  {
    _id: 'engraving-001',
    name: 'Manual Jewellery Engraving Machine',
    description: 'Traditional jewelry engraving machine for custom and detailed manual engraving work.',
    price: 85000,
    image: '/images/cnc-bangle-main.png',
    category: 'jewellery-engraving-machine',
    categoryName: 'Jewellery Engraving Machine'
  },
  {
    _id: 'engraving-002',
    name: 'Semi-Auto Jewellery Engraving Machine',
    description: 'Semi-automatic jewelry engraving machine with enhanced precision and control.',
    price: 115000,
    image: '/images/bangle-cnc-main.png',
    category: 'jewellery-engraving-machine',
    categoryName: 'Jewellery Engraving Machine'
  },
  
  // Bangle And Ring Turning Machine Category
  {
    _id: 'turning-001',
    name: 'Bangle And Ring Turning Machine',
    description: 'Specialized turning machine for bangle and ring finishing operations with precision control.',
    price: 125000,
    image: '/images/cnc-bangle-1.png',
    category: 'bangle-ring-turning',
    categoryName: 'Bangle And Ring Turning Machine'
  },
  
  // Bangle Turning & Finishing Machine Category
  {
    _id: 'finishing-001',
    name: 'Bangle Turning & Finishing Machine Complete',
    description: 'Complete turning and finishing machine for bangle surface preparation and polishing operations.',
    price: 145000,
    image: '/images/cnc-bangle-2.png',
    category: 'bangle-turning-finishing',
    categoryName: 'Bangle Turning & Finishing Machine'
  }
];

const ProductsPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState(sampleProducts);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams] = useSearchParams();
  
  // Function to handle add to cart
  const handleAddToCart = async (product) => {
    console.log('Add to cart clicked for product:', product);
    try {
      const result = await addToCart(product._id, 1, product.price);
      console.log('Add to cart result:', result);
      if (result.success) {
        alert('Product added to cart successfully!');
      } else {
        alert(result.message || 'Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart');
    }
  };

  // Function to handle buy now

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [categoriesRes, productsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/categories'),
        axios.get('http://localhost:5000/api/products')
      ]);
      
      setCategories(categoriesRes.data.data || []);
      setProducts(productsRes.data.data || sampleProducts);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Use sample data on error
      setCategories([
        { _id: 'cnc-machines', name: 'CNC Machines', slug: 'cnc-machines' },
        { _id: 'bangle-cnc-cutting', name: 'Bangle CNC Cutting', slug: 'bangle-cnc-cutting' }
      ]);
      setProducts(sampleProducts);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    // Set initial category from URL parameters
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="text-center">
          <div className="loading-spinner mb-3"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="elegant-products-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content animate-fade-in">
            <p className="hero-subtitle">PROFESSIONAL TOOLS</p>
            <h1 className="hero-title">
              Machine & <span className="text-brown">Tool</span> Collection
            </h1>
            <p className="hero-description">
              Discover our premium range of industrial equipment and precision machinery for professional manufacturing.
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="filters-section">
        <div className="container">
          <div className="filters-wrapper animate-slide-in-left">
            <div className="search-wrapper">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="elegant-search"
              />
            </div>
            <div className="category-wrapper">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="elegant-select"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="products-section">
        <div className="container">
          {filteredProducts.length === 0 ? (
            <div className="no-products animate-fade-in">
              <h3>No products found</h3>
              <p>Try adjusting your search or category filters.</p>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map((product, index) => (
                <div 
                  key={product._id} 
                  className="elegant-product-card animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={(e) => {
                    // Only navigate if clicking outside buttons
                    if (!e.target.closest('.product-actions')) {
                      navigate(`/product/${product._id}`);
                    }
                  }}
                >
                  <div className="product-image-container">
                    <img 
                      src={product.image || '/images/placeholder-product.svg'} 
                      alt={product.name}
                      className="product-image"
                      onError={(e) => {
                        e.target.src = '/images/placeholder-product.svg';
                      }}
                    />
                    {product.categoryName && (
                      <span className="category-badge">
                        {product.categoryName}
                      </span>
                    )}
                  </div>
                  
                  <div className="product-content">
                    <div className="product-header">
                      <span className="product-category">MACHINE</span>
                      <h3 className="product-title">{product.name}</h3>
                      <p className="product-description">
                        {product.description || 'A professional machine tool designed for precision manufacturing with advanced industrial capabilities.'}
                      </p>
                    </div>
                    
                    <div className="product-footer">
                      <div className="price-section">
                        <span className="price">
                          {product.price ? `₹${product.price.toLocaleString('en-IN')}` : 'Contact for Price'}
                        </span>
                        <span className="price-old">
                          {product.price ? `₹${(product.price * 1.2).toLocaleString('en-IN')}` : ''}
                        </span>
                      </div>
                      
                      <div className="product-actions">
                        <button 
                          className="btn-add-cart"
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('Add to Cart clicked!', product);
                            handleAddToCart({
                              _id: product._id,
                              name: product.name,
                              price: product.price || 0,
                              image: product.image,
                              category: product.categoryName,
                              brand: 'LVS'
                            });
                          }}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.4 5.1 16.4H17M17 13V16.4H17M9 19.5A1.5 1.5 0 1 1 10.5 21A1.5 1.5 0 0 1 9 19.5ZM20 19.5A1.5 1.5 0 1 1 21.5 21A1.5 1.5 0 0 1 20 19.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProductsPage;
