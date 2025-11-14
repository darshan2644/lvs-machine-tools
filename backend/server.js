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
const orderRoutes = require('./routes/orders');
const cartRoutes = require('./routes/cart');
const emailRoutes = require('./routes/email');
const paymentRoutes = require('./routes/payment');
const wishlistRoutes = require('./routes/wishlist');

// Admin routes
const adminProductRoutes = require('./routes/admin/products');
const adminOrderRoutes = require('./routes/admin/orders');
const adminCustomerRoutes = require('./routes/admin/customers');
const adminCategoryRoutes = require('./routes/admin/categories');
const adminDashboardRoutes = require('./routes/admin/dashboard');

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
app.use('/api/wishlist', wishlistRoutes);

// Admin Routes
app.use('/api/admin/products', adminProductRoutes);
app.use('/api/admin/orders', adminOrderRoutes);
app.use('/api/admin/customers', adminCustomerRoutes);
app.use('/api/admin/categories', adminCategoryRoutes);
app.use('/api/admin/dashboard', adminDashboardRoutes);

// Admin API - Get basic stats (temporary endpoint for testing)
app.get('/api/admin/stats', async (req, res) => {
  try {
    let stats = {
      totalProducts: 0,
      totalOrders: 0,
      totalCustomers: 0,
      totalRevenue: 0
    };

    try {
      // Try to get real data from database
      const products = await Product.find();
      const orders = await Order.find();
      const users = await User.find();
      
      stats.totalProducts = products.length;
      stats.totalOrders = orders.length;
      stats.totalCustomers = users.length;
      
      // Calculate revenue from delivered orders
      const revenue = orders
        .filter(order => order.status === 'delivered' || order.status === 'shipped')
        .reduce((sum, order) => sum + (order.total || 0), 0);
      stats.totalRevenue = revenue;
    } catch (dbError) {
      console.log('Using mock admin stats data');
      // Mock data for testing
      stats = {
        totalProducts: 15,
        totalOrders: 8,
        totalCustomers: 12,
        totalRevenue: 245000
      };
    }

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin statistics'
    });
  }
});

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
      // If database error, use comprehensive mock data
      categories = [
        {
          _id: 'cnc-bangle-ring-cutting',
          name: 'CNC Bangle & Ring Cutting Machine',
          slug: 'cnc-bangle-ring-cutting',
          description: 'Advanced CNC machines for precision bangle and ring cutting with automated operations',
          isActive: true,
          order: 1
        },
        {
          _id: 'bangle-cnc-cutting',
          name: 'Bangle CNC Cutting Machine',
          slug: 'bangle-cnc-cutting',
          description: 'Specialized CNC cutting machines designed specifically for bangle production',
          isActive: true,
          order: 2
        },
        {
          _id: 'cnc-bangle-cutting-machine',
          name: 'CNC Bangle Cutting Machine',
          slug: 'cnc-bangle-cutting-machine',
          description: 'Industrial-grade CNC machines for high-volume bangle cutting operations',
          isActive: true,
          order: 3
        },
        {
          _id: 'cnc-bangle-flat-half-round',
          name: 'CNC Bangle Flat & Half Round Cutting',
          slug: 'cnc-bangle-flat-half-round',
          description: 'Versatile CNC machines for both flat and half-round bangle cutting applications',
          isActive: true,
          order: 4
        },
        {
          _id: 'bangle-cutting-machine',
          name: 'Bangle Cutting Machine',
          slug: 'bangle-cutting-machine',
          description: 'Reliable bangle cutting machines for various production requirements',
          isActive: true,
          order: 5
        },
        {
          _id: 'cutting-machine',
          name: 'Cutting Machine',
          slug: 'cutting-machine',
          description: 'General-purpose cutting machines for various materials and applications',
          isActive: true,
          order: 6
        },
        {
          _id: '7-axis-cnc-round-ball',
          name: '7 Axis CNC Round Ball Cutting',
          slug: '7-axis-cnc-round-ball',
          description: 'Advanced 7-axis CNC machines for complex round ball cutting and engraving',
          isActive: true,
          order: 7
        },
        {
          _id: 'cnc-bangle-mr5',
          name: 'CNC Bangle MR5 Cutting Machine',
          slug: 'cnc-bangle-mr5',
          description: 'MR5 series CNC bangle cutting machines with enhanced precision features',
          isActive: true,
          order: 8
        },
        {
          _id: 'cnc-bangle-semi-auto',
          name: 'CNC Bangle Semi Auto Cutting',
          slug: 'cnc-bangle-semi-auto',
          description: 'Semi-automatic CNC bangle cutting machines for flexible production',
          isActive: true,
          order: 9
        },
        {
          _id: 'jewelry-cnc-machine',
          name: 'Jewelry CNC Machine',
          slug: 'jewelry-cnc-machine',
          description: 'Specialized CNC machines designed for jewelry manufacturing and processing',
          isActive: true,
          order: 10
        },
        {
          _id: 'cnc-bangle-double-head',
          name: 'CNC Bangle Double Head Cutting',
          slug: 'cnc-bangle-double-head',
          description: 'Double head CNC bangle cutting machines for increased productivity',
          isActive: true,
          order: 11
        },
        {
          _id: 'dough-balls-cutting',
          name: 'Dough Balls Cutting Machine',
          slug: 'dough-balls-cutting',
          description: 'Specialized machines for cutting dough balls with precision and consistency',
          isActive: true,
          order: 12
        },
        {
          _id: 'round-balls-faceting',
          name: 'Round Balls Automatic Faceting',
          slug: 'round-balls-faceting',
          description: 'Automatic faceting machines for round ball cutting with precision control',
          isActive: true,
          order: 13
        },
        {
          _id: 'pendant-ring-engraving-cutting',
          name: 'Pendant & Ring Engraving & Cutting',
          slug: 'pendant-ring-engraving-cutting',
          description: 'Combined engraving and cutting machines for pendants and rings',
          isActive: true,
          order: 14
        },
        {
          _id: 'cnc-jewellery-engraving',
          name: 'CNC Jewellery Engraving Machine',
          slug: 'cnc-jewellery-engraving',
          description: 'CNC-controlled jewelry engraving machines for detailed and precise work',
          isActive: true,
          order: 15
        },
        {
          _id: 'jewellery-engraving-machine',
          name: 'Jewellery Engraving Machine',
          slug: 'jewellery-engraving-machine',
          description: 'Traditional jewelry engraving machines for custom and detailed engraving work',
          isActive: true,
          order: 16
        },
        {
          _id: 'bangle-ring-turning',
          name: 'Bangle & Ring Turning Machine',
          slug: 'bangle-ring-turning',
          description: 'Specialized turning machines for bangle and ring finishing operations',
          isActive: true,
          order: 17
        },
        {
          _id: 'bangle-turning-finishing',
          name: 'Bangle Turning & Finishing Machine',
          slug: 'bangle-turning-finishing',
          description: 'Complete turning and finishing machines for bangle surface preparation and polishing',
          isActive: true,
          order: 18
        }
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
      // If database error, use comprehensive mock data
      products = [
        {
          _id: 'cnc-bangle-001',
          name: 'CNC Bangle Cutting Machine Industrial',
          description: 'Industrial-grade CNC machine for high-volume bangle cutting operations with superior precision.',
          price: 95000,
          image: '/images/cnc-bangle-main.png',
          category: 'cnc-bangle-cutting-machine',
          categoryName: 'CNC Bangle Cutting Machine',
          features: ['High Precision', 'Industrial Grade', 'Automated Operation'],
          isActive: true,
          inStock: true
        },
        {
          _id: 'cnc-bangle-002',
          name: 'Heavy Duty CNC Bangle Cutter',
          description: 'Heavy duty CNC bangle cutting machine designed for continuous industrial operations.',
          price: 135000,
          image: '/images/cnc-bangle-1.png',
          category: 'cnc-bangle-cutting-machine',
          categoryName: 'CNC Bangle Cutting Machine',
          features: ['Heavy Duty', 'Continuous Operation', 'High Capacity'],
          isActive: true,
          inStock: true
        },
        {
          _id: 'cnc-flat-half-001',
          name: 'CNC Bangle Flat And Half Round Cutting Machine',
          description: 'Versatile CNC machine for both flat and half-round bangle cutting applications.',
          price: 165000,
          image: '/images/cnc-bangle-2.png',
          category: 'cnc-bangle-flat-half-round',
          categoryName: 'CNC Bangle Flat And Half Round Cutting Machine',
          features: ['Dual Function', 'Versatile Design', 'Precision Control'],
          isActive: true,
          inStock: true
        },
        {
          _id: 'bangle-cutting-001',
          name: 'Semi-Automatic Bangle Cutting Machine',
          description: 'Reliable semi-automatic bangle cutting machine for various production requirements.',
          price: 75000,
          image: '/images/bangle-cnc-3.png',
          category: 'bangle-cutting-machine',
          categoryName: 'Bangle Cutting Machine',
          features: ['Semi-Automatic', 'Reliable Operation', 'Cost Effective'],
          isActive: true,
          inStock: true
        },
        {
          _id: 'bangle-cutting-002',
          name: 'Manual Bangle Cutting Machine',
          description: 'Traditional manual bangle cutting machine for precision custom work.',
          price: 45000,
          image: '/images/bangle-cnc-4.png',
          category: 'bangle-cutting-machine',
          categoryName: 'Bangle Cutting Machine',
          features: ['Manual Control', 'Precision Work', 'Traditional Design'],
          isActive: true,
          inStock: true
        },
        {
          _id: 'cutting-machine-001',
          name: 'Multi-Purpose Cutting Machine',
          description: 'Versatile cutting machine suitable for various materials and industrial applications.',
          price: 85000,
          image: '/images/cnc-9axis-main.png',
          category: 'cutting-machine',
          categoryName: 'Cutting Machine',
          features: ['Multi-Purpose', 'Various Materials', 'Industrial Grade'],
          isActive: true,
          inStock: true
        },
        {
          _id: '7-axis-cnc-001',
          name: '7 Axis CNC Round Ball Cutting & Engraving Machine',
          description: 'Automatic CNC round ball faceting and cutting machine with horizontal and vertical operation.',
          price: 75000,
          image: '/images/cnc-9axis-1.png',
          category: '7-axis-cnc-round-ball',
          categoryName: '7 Axis CNC Round Ball Cutting & Engraving Machine',
          features: ['7-Axis Control', 'Automatic Operation', 'Complex Geometry'],
          isActive: true,
          inStock: true
        },
        {
          _id: 'cnc-mr5-001',
          name: 'CNC Bangle MR5 Cutting Machine Pro',
          description: 'Advanced MR5 series CNC bangle cutting machine with enhanced precision and control features.',
          price: 125000,
          image: '/images/cnc-9axis-2.png',
          category: 'cnc-bangle-mr5',
          categoryName: 'CNC Bangle MR5 Cutting Machine',
          features: ['MR5 Technology', 'Enhanced Precision', 'Advanced Control'],
          isActive: true,
          inStock: true
        },
        {
          _id: 'cnc-semi-auto-001',
          name: 'CNC Bangle Semi Auto Cutting Machine',
          description: 'Semi-automatic CNC bangle cutting machine offering flexibility in production processes.',
          price: 95000,
          image: '/images/bangle-cnc-main.png',
          category: 'cnc-bangle-semi-auto',
          categoryName: 'CNC Bangle Semi Auto Cutting Machine',
          features: ['Semi-Automatic', 'Flexible Production', 'User Friendly'],
          isActive: true,
          inStock: true
        },
        {
          _id: 'jewelry-cnc-001',
          name: 'Professional Jewelry CNC Machine',
          description: 'Specialized CNC machine designed for high-precision jewelry manufacturing and processing.',
          price: 185000,
          image: '/images/cnc-bangle-1.png',
          category: 'jewelry-cnc-machine',
          categoryName: 'Jewelry CNC Machine',
          features: ['Jewelry Focused', 'High Precision', 'Professional Grade'],
          isActive: true,
          inStock: true
        },
        {
          _id: 'double-head-001',
          name: 'CNC Bangle Double Head Cutting Machine',
          description: 'Dual-head CNC bangle cutting machine designed for maximum productivity and efficiency.',
          price: 195000,
          image: '/images/cnc-bangle-2.png',
          category: 'cnc-bangle-double-head',
          categoryName: 'CNC Bangle Double Head Cutting Machine',
          features: ['Dual Head', 'High Productivity', 'Efficient Operation'],
          isActive: true,
          inStock: true
        },
        {
          _id: 'dough-balls-001',
          name: 'Automated Dough Balls Cutting Machine',
          description: 'Specialized automated machine for cutting dough balls with consistent size and precision.',
          price: 65000,
          image: '/images/bangle-cnc-3.png',
          category: 'dough-balls-cutting',
          categoryName: 'Dough Balls Cutting Machine',
          features: ['Food Grade', 'Consistent Size', 'Automated Process'],
          isActive: true,
          inStock: true
        },
        {
          _id: 'round-balls-001',
          name: 'Round Balls Automatic Faceting Machine',
          description: 'Automatic faceting machine for round ball cutting with precision control systems.',
          price: 175000,
          image: '/images/bangle-cnc-4.png',
          category: 'round-balls-faceting',
          categoryName: 'Round Balls Automatic Faceting Cutting Machine',
          features: ['Automatic Faceting', 'Precision Control', 'Spherical Processing'],
          isActive: true,
          inStock: true
        },
        {
          _id: 'pendant-ring-001',
          name: 'Pendant And Ring Engraving & Cutting Machine',
          description: 'Combined engraving and cutting machine for pendants and rings with detailed precision work.',
          price: 155000,
          image: '/images/cnc-bangle-main.png',
          category: 'pendant-ring-engraving-cutting',
          categoryName: 'Pendent And Ring Engraving & Cutting Machine',
          features: ['Dual Function', 'Fine Engraving', 'Detailed Work'],
          isActive: true,
          inStock: true
        },
        {
          _id: 'cnc-engraving-001',
          name: 'CNC Jewellery Engraving Machine Pro',
          description: 'CNC-controlled jewelry engraving machine for detailed and precise engraving work.',
          price: 135000,
          image: '/images/cnc-bangle-1.png',
          category: 'cnc-jewellery-engraving',
          categoryName: 'CNC Jewellery Engraving Machine',
          features: ['CNC Control', 'Fine Detail', 'Precision Engraving'],
          isActive: true,
          inStock: true
        },
        {
          _id: 'engraving-001',
          name: 'Manual Jewellery Engraving Machine',
          description: 'Traditional jewelry engraving machine for custom and detailed manual engraving work.',
          price: 85000,
          image: '/images/cnc-bangle-2.png',
          category: 'jewellery-engraving-machine',
          categoryName: 'Jewellery Engraving Machine',
          features: ['Traditional Design', 'Manual Control', 'Custom Work'],
          isActive: true,
          inStock: true
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
