// @ts-check
// Ensure this file runs in a Node.js environment

import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Backend server is running' });
});

// Auth Routes
app.post('/api/auth/register', (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  
  // Mock registration - in real app, hash password and save to database
  console.log('Registration attempt:', { firstName, lastName, email });
  
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    user: { id: 1, name: `${firstName} ${lastName}`, email },
    token: 'mock-jwt-token-' + Date.now()
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Mock login - in real app, verify credentials against database
  console.log('Login attempt:', { email });
  
  if (email && password) {
    res.json({
      success: true,
      message: 'Login successful',
      user: { id: 1, name: 'Test User', email },
      token: 'mock-jwt-token-' + Date.now()
    });
  } else {
    res.status(400).json({ message: 'Email and password required' });
  }
});

// Categories API endpoint
app.get('/api/categories', (req, res) => {
  const categories = [
    { _id: '1', name: 'CNC Bangle And Ring Cutting Machine', description: 'Bangle CNC Cutting Machine, CNC Bangle Cutting Machine', icon: '💍', slug: 'cnc-bangle-cutting' },
    { _id: '2', name: 'Faceting Machine', description: 'CNC BANGLE DOUBLE HEAD CUTTING MACHINE', icon: '💎', slug: 'faceting-machine' },
    { _id: '3', name: 'Pendent And Ring Engraving & Cutting Machine', description: 'CNC Jewellery Engraving Machine', icon: '🔗', slug: 'pendent-ring-engraving' },
    { _id: '4', name: 'Dough Balls Cutting Machine', description: 'Round Balls Automatic Faceting Cutting Machine', icon: '⚙️', slug: 'dough-balls-cutting' },
    { _id: '5', name: 'Jewellery Cutting Machine', description: 'continuous pipe cutting machine', icon: '✨', slug: 'jewellery-cutting' },
    { _id: '6', name: 'Jewellery Engraving Machine', description: 'Professional jewellery engraving and cutting solutions', icon: '🎨', slug: 'jewellery-engraving' }
  ];
  
  res.json({
    success: true,
    data: categories,
    message: 'Categories fetched successfully'
  });
});

// Featured products API endpoint
app.get('/api/products/featured', (req, res) => {
  const limit = parseInt(req.query.limit?.toString() || '8') || 8;
  const products = [];
  
  res.json({
    success: true,
    data: products,
    message: 'Featured products fetched successfully'
  });
});

// All products API endpoint
app.get('/api/products', (req, res) => {
  const products = [
    // CNC Machines
    {
      _id: '1',
      name: '9 Axis CNC Universal Cutting & Engraving Auto Tool Changer Machine',
      description: 'High-precision 9-axis CNC machine with automatic tool changing capability for universal cutting and engraving operations.',
      category: 'cnc-bangle-cutting',
      categoryName: 'CNC Bangle And Ring Cutting Machine',
      price: null,
      image: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400&h=300&fit=crop',
      specifications: {
        axes: '9 Axis',
        control: 'CNC',
        features: ['Auto Tool Changer', 'Universal Cutting', 'Engraving'],
        applications: ['Jewelry Manufacturing', 'Precision Cutting']
      }
    },
    {
      _id: '2', 
      name: '8 Axis CNC Universal Flat and Half Round Bangle and Rings Cutting & Engraving Combine Head Machine',
      description: 'Advanced 8-axis CNC system for cutting flat and half round bangles and rings with combined cutting and engraving capabilities.',
      category: 'cnc-bangle-cutting',
      categoryName: 'CNC Bangle And Ring Cutting Machine',
      price: null,
      image: 'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=400&h=300&fit=crop',
      specifications: {
        axes: '8 Axis',
        control: 'CNC',
        features: ['Flat Cutting', 'Half Round Cutting', 'Combine Head'],
        applications: ['Bangle Manufacturing', 'Ring Production']
      }
    },
    {
      _id: '3',
      name: '7 Axis CNC Universal Flat Bangle Horizontal and Vertical Cutting & Engraving Machine',
      description: 'Versatile 7-axis CNC machine for horizontal and vertical cutting and engraving of flat bangles.',
      category: 'cnc-bangle-cutting', 
      categoryName: 'CNC Bangle And Ring Cutting Machine',
      price: null,
      image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=300&fit=crop',
      specifications: {
        axes: '7 Axis',
        control: 'CNC',
        features: ['Horizontal Cutting', 'Vertical Cutting', 'Universal Design'],
        applications: ['Flat Bangle Production', 'Precision Engraving']
      }
    },
    {
      _id: '4',
      name: '7 Axis CNC Round Ball Cutting And Engraving Horizontal And Vertical Machine',
      description: 'Specialized 7-axis CNC machine for cutting and engraving round balls in both horizontal and vertical orientations.',
      category: 'dough-balls-cutting',
      categoryName: 'Dough Balls Cutting Machine',
      price: null,
      image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=300&fit=crop',
      specifications: {
        axes: '7 Axis',
        control: 'CNC',
        features: ['Round Ball Cutting', 'Dual Orientation', 'Precision Engraving'],
        applications: ['Ball Manufacturing', 'Decorative Elements']
      }
    },
    {
      _id: '5',
      name: '4 Axis PLC Based Round Ball Cutting Machine',
      description: 'PLC-controlled 4-axis machine designed for precise round ball cutting operations.',
      category: 'dough-balls-cutting',
      categoryName: 'Dough Balls Cutting Machine', 
      price: null,
      image: 'https://images.unsplash.com/photo-1581094289062-7a6db75c31e7?w=400&h=300&fit=crop',
      specifications: {
        axes: '4 Axis',
        control: 'PLC Based',
        features: ['Round Ball Cutting', 'Precision Control', 'User-Friendly Interface'],
        applications: ['Ball Production', 'Industrial Manufacturing']
      }
    },
    {
      _id: '6',
      name: '4 Axis Pro CNC Pendent Engraving & Cutting Machine',
      description: 'Professional 4-axis CNC machine specialized for pendant engraving and cutting operations.',
      category: 'pendent-ring-engraving',
      categoryName: 'Pendent And Ring Engraving & Cutting Machine',
      price: null,
      image: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400&h=300&fit=crop',
      specifications: {
        axes: '4 Axis Pro',
        control: 'CNC',
        features: ['Pendant Engraving', 'Precision Cutting', 'Professional Grade'],
        applications: ['Jewelry Engraving', 'Custom Pendants']
      }
    },
    {
      _id: '7',
      name: '4 Axis PLC Based Chain Faceting Horizontal Machine',
      description: 'PLC-based horizontal chain faceting machine with 4-axis precision control.',
      category: 'faceting-machine',
      categoryName: 'Faceting Machine',
      price: null,
      image: '/images/products/chain-faceting.jpg'
    },
    {
      _id: '8',
      name: '2 Axis Pic Based Bangle Inside Turning & Finishing Machine',
      description: 'PIC-based 2-axis machine for inside turning and finishing of bangles.',
      category: 'cnc-bangle-cutting',
      categoryName: 'CNC Bangle And Ring Cutting Machine',
      price: null,
      image: '/images/products/bangle-turning.jpg'
    },
    {
      _id: '9',
      name: 'Bangle Inside Turning & Finishing Machine',
      description: 'Specialized machine for internal turning and finishing operations on bangles.',
      category: 'cnc-bangle-cutting',
      categoryName: 'CNC Bangle And Ring Cutting Machine',
      price: null,
      image: '/images/products/bangle-finishing.jpg'
    },
    {
      _id: '10',
      name: 'Hydraulic Bangle Sizing Machine',
      description: 'Hydraulic-powered machine for precise bangle sizing operations.',
      category: 'cnc-bangle-cutting',
      categoryName: 'CNC Bangle And Ring Cutting Machine',
      price: null,
      image: '/images/products/hydraulic-sizing.jpg'
    },
    {
      _id: '11',
      name: 'Continuous Pipe cutting Machine',
      description: 'High-efficiency machine for continuous pipe cutting operations.',
      category: 'jewellery-cutting',
      categoryName: 'Jewellery Cutting Machine',
      price: null,
      image: '/images/products/pipe-cutting.jpg'
    },
    {
      _id: '12',
      name: 'Horizontal & Vertical Flat Surface Engraving & Cutting Machine',
      description: 'Dual-orientation machine for flat surface engraving and cutting in both horizontal and vertical positions.',
      category: 'jewellery-engraving',
      categoryName: 'Jewellery Engraving Machine',
      price: null,
      image: '/images/products/flat-surface.jpg'
    },
    {
      _id: '13',
      name: 'Bangle Groove Rolling Machine',
      description: 'Specialized machine for creating grooves in bangles through rolling process.',
      category: 'cnc-bangle-cutting',
      categoryName: 'CNC Bangle And Ring Cutting Machine',
      price: null,
      image: '/images/products/groove-rolling.jpg'
    },
    {
      _id: '14',
      name: 'Double Head Horizontal & Vertical Decoration Machine',
      description: 'Dual-head machine for horizontal and vertical decoration operations.',
      category: 'jewellery-engraving',
      categoryName: 'Jewellery Engraving Machine',
      price: null,
      image: '/images/products/double-head.jpg'
    },
    {
      _id: '15',
      name: '5 Axis CNC Vertical Acrylic Bangle Cutting Machine',
      description: '5-axis CNC machine specialized for vertical cutting of acrylic bangles.',
      category: 'cnc-bangle-cutting',
      categoryName: 'CNC Bangle And Ring Cutting Machine',
      price: null,
      image: '/images/products/acrylic-cutting.jpg'
    }
  ];

  // Filter by category if provided
  const category = req.query.category;
  let filteredProducts = products;
  
  if (category && category !== 'all') {
    filteredProducts = products.filter(product => product.category === category);
  }

  res.json({
    success: true,
    data: filteredProducts,
    message: 'Products fetched successfully'
  });
});

// Single product API endpoint
app.get('/api/products/:id', (req, res) => {
  const productId = req.params.id;
  
  const products = [
    // Same products array as above
    {
      _id: '1',
      name: '9 Axis CNC Universal Cutting & Engraving Auto Tool Changer Machine',
      description: 'High-precision 9-axis CNC machine with automatic tool changing capability for universal cutting and engraving operations. This advanced machine features state-of-the-art technology for professional jewelry manufacturing.',
      category: 'cnc-bangle-cutting',
      categoryName: 'CNC Bangle And Ring Cutting Machine',
      price: null,
      image: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400&h=300&fit=crop',
      specifications: {
        axes: '9 Axis',
        control: 'CNC',
        features: ['Auto Tool Changer', 'Universal Cutting', 'Engraving'],
        applications: ['Jewelry Manufacturing', 'Precision Cutting']
      }
    },
    {
      _id: '2', 
      name: '8 Axis CNC Universal Flat and Half Round Bangle and Rings Cutting & Engraving Combine Head Machine',
      description: 'Advanced 8-axis CNC system for cutting flat and half round bangles and rings with combined cutting and engraving capabilities. Perfect for high-volume production environments.',
      category: 'cnc-bangle-cutting',
      categoryName: 'CNC Bangle And Ring Cutting Machine',
      price: null,
      image: 'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=400&h=300&fit=crop',
      specifications: {
        axes: '8 Axis',
        control: 'CNC',
        features: ['Flat Cutting', 'Half Round Cutting', 'Combine Head'],
        applications: ['Bangle Manufacturing', 'Ring Production']
      }
    },
    {
      _id: '3',
      name: '7 Axis CNC Universal Flat Bangle Horizontal and Vertical Cutting & Engraving Machine',
      description: 'Versatile 7-axis CNC machine for horizontal and vertical cutting and engraving of flat bangles. Offers exceptional precision and reliability for professional applications.',
      category: 'cnc-bangle-cutting', 
      categoryName: 'CNC Bangle And Ring Cutting Machine',
      price: null,
      image: '/images/products/cnc-7axis.jpg'
    },
    {
      _id: '4',
      name: '7 Axis CNC Round Ball Cutting And Engraving Horizontal And Vertical Machine',
      description: 'Specialized 7-axis CNC machine for cutting and engraving round balls in both horizontal and vertical orientations. Ideal for creating decorative elements.',
      category: 'dough-balls-cutting',
      categoryName: 'Dough Balls Cutting Machine',
      price: null,
      image: '/images/products/cnc-round-ball.jpg'
    },
    {
      _id: '5',
      name: '4 Axis PLC Based Round Ball Cutting Machine',
      description: 'PLC-controlled 4-axis machine designed for precise round ball cutting operations. Features user-friendly interface and reliable performance.',
      category: 'dough-balls-cutting',
      categoryName: 'Dough Balls Cutting Machine', 
      price: null,
      image: '/images/products/plc-round-ball.jpg'
    },
    {
      _id: '6',
      name: '4 Axis Pro CNC Pendent Engraving & Cutting Machine',
      description: 'Professional 4-axis CNC machine specialized for pendant engraving and cutting operations. Delivers exceptional detail and finish quality.',
      category: 'pendent-ring-engraving',
      categoryName: 'Pendent And Ring Engraving & Cutting Machine',
      price: null,
      image: '/images/products/cnc-pendant.jpg'
    },
    {
      _id: '7',
      name: '4 Axis PLC Based Chain Faceting Horizontal Machine',
      description: 'PLC-based horizontal chain faceting machine with 4-axis precision control. Designed for efficient and accurate chain processing.',
      category: 'faceting-machine',
      categoryName: 'Faceting Machine',
      price: null,
      image: '/images/products/chain-faceting.jpg'
    },
    {
      _id: '8',
      name: '2 Axis Pic Based Bangle Inside Turning & Finishing Machine',
      description: 'PIC-based 2-axis machine for inside turning and finishing of bangles. Compact design with powerful capabilities.',
      category: 'cnc-bangle-cutting',
      categoryName: 'CNC Bangle And Ring Cutting Machine',
      price: null,
      image: '/images/products/bangle-turning.jpg'
    },
    {
      _id: '9',
      name: 'Bangle Inside Turning & Finishing Machine',
      description: 'Specialized machine for internal turning and finishing operations on bangles. Ensures smooth interior surfaces and perfect finish.',
      category: 'cnc-bangle-cutting',
      categoryName: 'CNC Bangle And Ring Cutting Machine',
      price: null,
      image: '/images/products/bangle-finishing.jpg'
    },
    {
      _id: '10',
      name: 'Hydraulic Bangle Sizing Machine',
      description: 'Hydraulic-powered machine for precise bangle sizing operations. Provides consistent and reliable sizing results.',
      category: 'cnc-bangle-cutting',
      categoryName: 'CNC Bangle And Ring Cutting Machine',
      price: null,
      image: '/images/products/hydraulic-sizing.jpg'
    },
    {
      _id: '11',
      name: 'Continuous Pipe cutting Machine',
      description: 'High-efficiency machine for continuous pipe cutting operations. Ideal for high-volume production with consistent quality.',
      category: 'jewellery-cutting',
      categoryName: 'Jewellery Cutting Machine',
      price: null,
      image: '/images/products/pipe-cutting.jpg'
    },
    {
      _id: '12',
      name: 'Horizontal & Vertical Flat Surface Engraving & Cutting Machine',
      description: 'Dual-orientation machine for flat surface engraving and cutting in both horizontal and vertical positions. Versatile solution for various applications.',
      category: 'jewellery-engraving',
      categoryName: 'Jewellery Engraving Machine',
      price: null,
      image: '/images/products/flat-surface.jpg'
    },
    {
      _id: '13',
      name: 'Bangle Groove Rolling Machine',
      description: 'Specialized machine for creating grooves in bangles through rolling process. Ensures uniform groove patterns and dimensions.',
      category: 'cnc-bangle-cutting',
      categoryName: 'CNC Bangle And Ring Cutting Machine',
      price: null,
      image: '/images/products/groove-rolling.jpg'
    },
    {
      _id: '14',
      name: 'Double Head Horizontal & Vertical Decoration Machine',
      description: 'Dual-head machine for horizontal and vertical decoration operations. Increases productivity with simultaneous processing capability.',
      category: 'jewellery-engraving',
      categoryName: 'Jewellery Engraving Machine',
      price: null,
      image: '/images/products/double-head.jpg'
    },
    {
      _id: '15',
      name: '5 Axis CNC Vertical Acrylic Bangle Cutting Machine',
      description: '5-axis CNC machine specialized for vertical cutting of acrylic bangles. Perfect for working with acrylic materials and other synthetics.',
      category: 'cnc-bangle-cutting',
      categoryName: 'CNC Bangle And Ring Cutting Machine',
      price: null,
      image: '/images/products/acrylic-cutting.jpg'
    }
  ];

  const product = products.find(p => p._id === productId);
  
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
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
