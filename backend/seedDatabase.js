require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');
const Product = require('./models/Product');

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Categories data
const categories = [
  {
    name: 'CNC Bangle And Ring Cutting Machine',
    slug: 'cnc-bangle-cutting',
    description: 'Advanced CNC machines for precision cutting and engraving of bangles and rings',
    icon: 'fa-cogs',
    order: 1,
    isActive: true
  },
  {
    name: 'Dough Balls Cutting Machine',
    slug: 'dough-balls-cutting',
    description: 'Specialized machines for cutting and shaping round balls',
    icon: 'fa-circle',
    order: 2,
    isActive: true
  },
  {
    name: 'Pendent And Ring Engraving & Cutting Machine',
    slug: 'pendent-ring-engraving',
    description: 'Professional engraving and cutting machines for pendants and rings',
    icon: 'fa-gem',
    order: 3,
    isActive: true
  },
  {
    name: 'Faceting Machine',
    slug: 'faceting-machine',
    description: 'Precision faceting machines for jewelry manufacturing',
    icon: 'fa-cut',
    order: 4,
    isActive: true
  },
  {
    name: 'Jewellery Cutting Machine',
    slug: 'jewellery-cutting',
    description: 'General purpose jewelry cutting machines',
    icon: 'fa-tools',
    order: 5,
    isActive: true
  },
  {
    name: 'Jewellery Engraving Machine',
    slug: 'jewellery-engraving',
    description: 'Professional engraving machines for jewelry decoration',
    icon: 'fa-pen-fancy',
    order: 6,
    isActive: true
  }
];

// Products data
const products = [
  {
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
    },
    isActive: true
  },
  {
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
    },
    isActive: true
  },
  {
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
    },
    isActive: true
  },
  {
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
    },
    isActive: true
  },
  {
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
    },
    isActive: true
  },
  {
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
    },
    isActive: true
  },
  {
    name: '4 Axis PLC Based Chain Faceting Horizontal Machine',
    description: 'PLC-based horizontal chain faceting machine with 4-axis precision control.',
    category: 'faceting-machine',
    categoryName: 'Faceting Machine',
    price: null,
    image: 'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=400&h=300&fit=crop',
    specifications: {
      axes: '4 Axis',
      control: 'PLC Based',
      features: ['Chain Faceting', 'Horizontal Operation', 'Precision Control'],
      applications: ['Chain Manufacturing', 'Faceting Operations']
    },
    isActive: true
  },
  {
    name: '2 Axis Pic Based Bangle Inside Turning & Finishing Machine',
    description: 'PIC-based 2-axis machine for inside turning and finishing of bangles.',
    category: 'cnc-bangle-cutting',
    categoryName: 'CNC Bangle And Ring Cutting Machine',
    price: null,
    image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=300&fit=crop',
    specifications: {
      axes: '2 Axis',
      control: 'PIC Based',
      features: ['Inside Turning', 'Finishing Operations', 'Automated Control'],
      applications: ['Bangle Finishing', 'Internal Processing']
    },
    isActive: true
  },
  {
    name: 'Bangle Inside Turning & Finishing Machine',
    description: 'Specialized machine for internal turning and finishing operations on bangles.',
    category: 'cnc-bangle-cutting',
    categoryName: 'CNC Bangle And Ring Cutting Machine',
    price: null,
    image: 'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=400&h=300&fit=crop',
    specifications: {
      control: 'Manual/Semi-Auto',
      features: ['Inside Turning', 'Surface Finishing', 'Quality Control'],
      applications: ['Bangle Manufacturing', 'Surface Treatment']
    },
    isActive: true
  },
  {
    name: 'Hydraulic Bangle Sizing Machine',
    description: 'Hydraulic-powered machine for precise bangle sizing operations.',
    category: 'cnc-bangle-cutting',
    categoryName: 'CNC Bangle And Ring Cutting Machine',
    price: null,
    image: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400&h=300&fit=crop',
    specifications: {
      power: 'Hydraulic',
      features: ['Precise Sizing', 'High Pressure', 'Consistent Results'],
      applications: ['Bangle Sizing', 'Dimensional Control']
    },
    isActive: true
  },
  {
    name: 'Continuous Pipe Cutting Machine',
    description: 'High-efficiency machine for continuous pipe cutting operations.',
    category: 'jewellery-cutting',
    categoryName: 'Jewellery Cutting Machine',
    price: null,
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=300&fit=crop',
    specifications: {
      operation: 'Continuous',
      features: ['High Speed', 'Consistent Cuts', 'Automated Feed'],
      applications: ['Pipe Processing', 'Tube Manufacturing']
    },
    isActive: true
  },
  {
    name: 'Horizontal & Vertical Flat Surface Engraving & Cutting Machine',
    description: 'Dual-orientation machine for flat surface engraving and cutting in both horizontal and vertical positions.',
    category: 'jewellery-engraving',
    categoryName: 'Jewellery Engraving Machine',
    price: null,
    image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=300&fit=crop',
    specifications: {
      orientation: 'Horizontal & Vertical',
      features: ['Dual Position', 'Flat Surface Processing', 'Versatile Operation'],
      applications: ['Surface Engraving', 'Flat Cutting']
    },
    isActive: true
  },
  {
    name: 'Bangle Groove Rolling Machine',
    description: 'Specialized machine for creating grooves in bangles through rolling process.',
    category: 'cnc-bangle-cutting',
    categoryName: 'CNC Bangle And Ring Cutting Machine',
    price: null,
    image: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400&h=300&fit=crop',
    specifications: {
      process: 'Rolling',
      features: ['Groove Creation', 'Precision Rolling', 'Pattern Making'],
      applications: ['Decorative Grooves', 'Pattern Design']
    },
    isActive: true
  },
  {
    name: 'Double Head Horizontal & Vertical Decoration Machine',
    description: 'Dual-head machine for horizontal and vertical decoration operations.',
    category: 'jewellery-engraving',
    categoryName: 'Jewellery Engraving Machine',
    price: null,
    image: 'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=400&h=300&fit=crop',
    specifications: {
      heads: 'Double Head',
      orientation: 'Horizontal & Vertical',
      features: ['Dual Operation', 'Decorative Patterns', 'High Productivity'],
      applications: ['Jewelry Decoration', 'Pattern Engraving']
    },
    isActive: true
  },
  {
    name: '5 Axis CNC Vertical Acrylic Bangle Cutting Machine',
    description: '5-axis CNC machine specialized for vertical cutting of acrylic bangles.',
    category: 'cnc-bangle-cutting',
    categoryName: 'CNC Bangle And Ring Cutting Machine',
    price: null,
    image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=300&fit=crop',
    specifications: {
      axes: '5 Axis',
      control: 'CNC',
      material: 'Acrylic Specialized',
      features: ['Vertical Cutting', 'Acrylic Processing', 'Precision Control'],
      applications: ['Acrylic Bangles', 'Plastic Jewelry']
    },
    isActive: true
  }
];

// Seed function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('✅ Cleared existing data');
    
    // Insert categories
    const insertedCategories = await Category.insertMany(categories);
    console.log(`✅ Inserted ${insertedCategories.length} categories`);
    
    // Insert products
    const insertedProducts = await Product.insertMany(products);
    console.log(`✅ Inserted ${insertedProducts.length} products`);
    
    console.log('🎉 Database seeding completed successfully!');
    
    // Display summary
    console.log('\n📊 Summary:');
    console.log(`Categories: ${insertedCategories.length}`);
    console.log(`Products: ${insertedProducts.length}`);
    
    // Close connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeding
const runSeed = async () => {
  await connectDB();
  await seedDatabase();
};

runSeed();
