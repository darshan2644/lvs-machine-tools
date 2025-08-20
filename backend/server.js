require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Import models
const Category = require('./models/Category');
const Product = require('./models/Product');
const User = require('./models/User');
const Cart = require('./models/Cart');
const Order = require('./models/Order');

// Import routes
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/order');
const cartRoutes = require('./routes/cart');
const emailRoutes = require('./routes/email');
const paymentRoutes = require('./routes/payment');

const app = express();
const PORT = process.env.PORT || 5000;
console.log('Starting server with payment routes...');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/payment', paymentRoutes);

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.log('Continuing without MongoDB - using mock data...');
    // Don't exit, just continue without database
  }
};

// Connect to database
connectDB();

// Categories API endpoint
app.get('/api/categories', async (req, res) => {
  try {
    let categories;
    try {
      categories = await Category.find({ isActive: true }).sort({ order: 1 });
    } catch (dbError) {
      // If database error, use mock data
      categories = [
        { _id: 'cnc-machines', name: 'CNC Machines', slug: 'cnc-machines' },
        { _id: 'bangle-cnc-cutting', name: 'Bangle CNC Cutting', slug: 'bangle-cnc-cutting' }
      ];
    }
    
    res.json({
      success: true,
      data: categories,
      message: 'Categories fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
});

// All products API endpoint
app.get('/api/products', async (req, res) => {
  try {
    let query = { isActive: true };
    
    // Filter by category if provided
    const category = req.query.category;
    if (category && category !== 'all') {
      query.category = category;
    }
    
    // Search functionality
    const search = req.query.search;
    if (search) {
      query.$text = { $search: search };
    }
    
    // Get products from database
    let products;
    try {
      products = await Product.find(query).sort({ createdAt: -1 });
    } catch (dbError) {
      // If database error, use mock data
      products = [
        {
          _id: 'cnc-9axis',
          name: '9 Axis CNC Universal Cutting & Engraving Auto Tool Changer Machine',
          description: 'High-precision 9-axis CNC machine with automatic tool changing capability.',
          price: 250000,
          image: '/images/cnc-9axis-main.png',
          category: 'cnc-machines',
          categoryName: 'CNC Machines'
        },
        {
          _id: 'bangle-cnc-main',
          name: 'Bangle CNC Cutting Machine',
          description: 'Leading Manufacturer of Bangle CNC Cutting Machine with high precision cutting technology.',
          price: 105000,
          image: '/images/bangle-cnc-main.png',
          category: 'bangle-cnc-cutting',
          categoryName: 'Bangle CNC Cutting'
        }
      ];
    }
    
    res.json({
      success: true,
      data: products,
      message: 'Products fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
});

// Featured products API endpoint - must come before /:id route
app.get('/api/products/featured', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    let products;
    
    try {
      products = await Product.find({ isActive: true, isFeatured: true })
        .limit(limit)
        .sort({ createdAt: -1 });
    } catch (dbError) {
      // If database error, use mock featured products
      products = [
        {
          _id: 'cnc-9axis',
          name: '9 Axis CNC Universal Cutting & Engraving Auto Tool Changer Machine',
          description: 'High-precision 9-axis CNC machine with automatic tool changing capability.',
          price: 250000,
          image: '/images/cnc-9axis-main.png',
          category: 'cnc-machines',
          categoryName: 'CNC Machines',
          isFeatured: true
        },
        {
          _id: 'bangle-cnc-main',
          name: 'Bangle CNC Cutting Machine',
          description: 'Leading Manufacturer of Bangle CNC Cutting Machine with high precision cutting technology.',
          price: 105000,
          image: '/images/bangle-cnc-main.png',
          category: 'bangle-cnc-cutting',
          categoryName: 'Bangle CNC Cutting',
          isFeatured: true
        }
      ].slice(0, limit);
    }

    res.json({
      success: true,
      data: products,
      message: 'Featured products fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching featured products',
      error: error.message
    });
  }
});

// Single product API endpoint
app.get('/api/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product,
      message: 'Product fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
