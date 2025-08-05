import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './CategoriesPage.css';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [categoriesRes, productsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/categories'),
        axios.get('http://localhost:5000/api/products')
      ]);
      
      setCategories(categoriesRes.data.data);
      setProducts(productsRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Set fallback data
      setCategories([
        { _id: '1', name: 'CNC Bangle And Ring Cutting Machine', slug: 'cnc-bangle-cutting', icon: '💍' },
        { _id: '2', name: 'Faceting Machine', slug: 'faceting-machine', icon: '❓' },
        { _id: '3', name: 'Pendent And Ring Engraving & Cutting Machine', slug: 'pendent-ring-engraving', icon: '💎' },
        { _id: '4', name: 'Dough Balls Cutting Machine', slug: 'dough-balls-cutting', icon: '⚙️' },
        { _id: '5', name: 'Jewellery Cutting Machine', slug: 'jewellery-cutting', icon: '✨' },
        { _id: '6', name: 'Jewellery Engraving Machine', slug: 'jewellery-engraving', icon: '🎨' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="categories-page">
      {/* Hero Section */}
      <section className="categories-hero">
        <div className="container">
          <h1 className="hero-title">
            Product <span className="text-yellow">Categories</span>
          </h1>
          <p className="hero-description">
            Explore our comprehensive range of professional machine tools and equipment
          </p>
        </div>
      </section>

      {/* Categories with Products */}
      <section className="categories-section">
        <div className="container">
          {categories.map((category) => {
            const categoryProducts = products.filter(product => product.category === category.slug);
            
            if (categoryProducts.length === 0) return null;
            
            return (
              <div key={category._id} className="category-section">
                <div className="category-header">
                  <div className="category-icon">{category.icon}</div>
                  <h2 className="category-title">{category.name}</h2>
                  <p className="category-description">{category.description}</p>
                </div>
                
                <div className="products-grid">
                  {categoryProducts.map((product) => (
                    <div key={product._id} className="product-item">
                      <h4 className="product-name">{product.name}</h4>
                      <p className="product-description">{product.description}</p>
                      <div className="product-actions">
                        <Link to={`/product/${product._id}`} className="btn btn-primary btn-sm">
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="category-footer">
                  <span className="product-count">{categoryProducts.length} product{categoryProducts.length !== 1 ? 's' : ''} available</span>
                  <Link 
                    to={`/products?category=${category.slug}`} 
                    className="btn btn-outline view-products-btn"
                  >
                    View All Products
                  </Link>
                </div>
              </div>
            );
          })}
          
          <div className="view-all-section">
            <Link to="/products" className="btn btn-primary view-all-btn">
              View All Categories
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CategoriesPage;
