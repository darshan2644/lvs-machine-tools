import React, { useState, useEffect } from 'react';import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';import { Link } from 'react-router-dom';

import './CategoriesPageNew.css';import './CategoriesPageNew.css';



const CategoriesPageNew = () => {const CategoriesPageNew = () => {

  const [searchTerm, setSearchTerm] = useState('');  const [searchTerm, setSearchTerm] = useState('');

  const [categories, setCategories] = useState([]);  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);  const [loading, setLoading] = useState(true);

  const [productCounts, setProductCounts] = useState({});  const [productCounts, setProductCounts] = useState({});



  // Fetch categories from API  // Fetch categories from API

  useEffect(() => {  useEffect(() => {

    const fetchCategoriesAndProducts = async () => {    const fetchCategoriesAndProducts = async () => {

      try {      try {

        setLoading(true);        setLoading(true);

        const [categoriesResponse, productsResponse] = await Promise.all([        const [categoriesResponse, productsResponse] = await Promise.all([

          fetch('http://localhost:5000/api/categories'),          fetch('http://localhost:5000/api/categories'),

          fetch('http://localhost:5000/api/products')          fetch('http://localhost:5000/api/products')

        ]);        ]);

                

        const categoriesData = await categoriesResponse.json();        const categoriesData = await categoriesResponse.json();

        const productsData = await productsResponse.json();        const productsData = await productsResponse.json();

                

        if (categoriesData.success) {        if (categoriesData.success) {

          setCategories(categoriesData.data);          setCategories(categoriesData.data);

        }        }

                

        if (productsData.success) {        if (productsData.success) {

          // Count products per category          // Count products per category

          const counts = {};          const counts = {};

          productsData.data.forEach(product => {          productsData.data.forEach(product => {

            counts[product.category] = (counts[product.category] || 0) + 1;            counts[product.category] = (counts[product.category] || 0) + 1;

          });          });

          setProductCounts(counts);          setProductCounts(counts);

        }        }

      } catch (error) {      } catch (error) {

        console.error('Error fetching data:', error);        console.error('Error fetching data:', error);

      } finally {      } finally {

        setLoading(false);        setLoading(false);

      }      }

    };    };



    fetchCategoriesAndProducts();    fetchCategoriesAndProducts();

  }, []);  }, []);



  // Filter categories based on search term  // Filter categories based on search term

  const filteredCategories = categories.filter(category =>  const filteredCategories = categories.filter(category =>

    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||

    category.description.toLowerCase().includes(searchTerm.toLowerCase())    category.description.toLowerCase().includes(searchTerm.toLowerCase())

  );  );



  if (loading) {  if (loading) {

    return (    return (

      <div className="categories-page">      <div className="categories-page">

        <div className="loading-state">        <div className="loading-state">

          <div className="loading-spinner"></div>          <div className="loading-spinner"></div>

          <p>Loading categories...</p>          <p>Loading categories...</p>

        </div>        </div>

      </div>      </div>

    );    );

  }  }



  return (  return (

    <div className="categories-page">    <div className="categories-page">

      {/* Hero Section */}      {/* Hero Section */}

      <section className="categories-hero">      <section className="categories-hero">

        <div className="container">        <div className="container">

          <h1>Product Categories</h1>          <h1>Product Categories</h1>

          <p>Explore our comprehensive range of CNC machines and jewelry manufacturing equipment</p>          <p>Explore our comprehensive range of CNC machines and jewelry manufacturing equipment</p>

        </div>        </div>

      </section>      </section>



      {/* Search Section */}      {/* Search Section */}

      <section className="search-section">      <section className="search-section">

        <div className="container">        <div className="container">

          <div className="search-container">          <div className="search-container">

            <div className="search-input-wrapper">            <div className="search-input-wrapper">

              <svg className="search-icon" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">              <svg className="search-icon" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>

              </svg>              </svg>

              <input              <input

                type="text"                type="text"

                placeholder="Search categories..."                placeholder="Search categories..."

                value={searchTerm}                value={searchTerm}

                onChange={(e) => setSearchTerm(e.target.value)}                onChange={(e) => setSearchTerm(e.target.value)}

                className="search-input"                className="search-input"

              />              />

            </div>            </div>

          </div>          </div>

        </div>        </div>

      </section>      </section>



      {/* Categories Grid */}      {/* Categories Grid */}

      <section className="categories-section">      <section className="categories-section">

        <div className="container">        <div className="container">

          <div className="categories-grid">          <div className="categories-grid">

            {filteredCategories.map((category) => (            {filteredCategories.map((category) => (

              <div key={category._id} className="category-card">              <div key={category._id} className="category-card">

                <div className="category-image">                <div className="category-image">

                  <img                  <img

                    src={category.image || '/images/placeholder-product.svg'}                    src={category.image || '/images/placeholder-product.svg'}

                    alt={category.name}                    alt={category.name}

                    onError={(e) => {                    onError={(e) => {

                      e.target.src = '/images/placeholder-product.svg';                      e.target.src = '/images/placeholder-product.svg';

                    }}                    }}

                  />                  />

                </div>                </div>

                                

                <div className="category-content">                <div className="category-content">

                  <h3 className="category-name">{category.name}</h3>                  <h3 className="category-name">{category.name}</h3>

                  <p className="category-description">{category.description}</p>                  <p className="category-description">{category.description}</p>

                                    

                  <div className="category-features">                  <div className="category-features">

                    {category.features && category.features.map((feature, index) => (                    {category.features && category.features.map((feature, index) => (

                      <span key={index} className="feature-tag">{feature}</span>                      <span key={index} className="feature-tag">{feature}</span>

                    ))}                    ))}

                  </div>                  </div>

                                    

                  <div className="category-footer">                  <div className="category-footer">

                    <span className="product-count">                    <span className="product-count">

                      {productCounts[category.slug] || 0} Products                      {productCounts[category.slug] || 0} Products

                    </span>                    </span>

                    <Link                     <Link 

                      to={`/products?category=${category.slug}`}                       to={`/products?category=${category.slug}`} 

                      className="view-products-btn"                      className="view-products-btn"

                    >                    >

                      View Products                      View Products

                    </Link>                    </Link>

                  </div>                  </div>

                </div>                </div>

              </div>              </div>

            ))}            ))}

          </div>          </div>



          {filteredCategories.length === 0 && !loading && (          {filteredCategories.length === 0 && !loading && (

            <div className="no-results">            <div className="no-results">

              <h3>No categories found</h3>              <h3>No categories found</h3>

              <p>Try adjusting your search terms.</p>              <p>Try adjusting your search terms.</p>

            </div>            </div>

          )}          )}

        </div>        </div>

      </section>      </section>

    </div>    </div>

  );  );

};};



export default CategoriesPageNew;export default CategoriesPageNew;
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