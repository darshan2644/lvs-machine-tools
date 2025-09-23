require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');
const Product = require('./models/Product');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lvs-machine-tools', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB Connected Successfully');
})
.catch(err => {
  console.log('MongoDB Connection Error:', err);
});

// Categories data
const categories = [
  {
    name: 'CNC Bangle And Ring Cutting Machine',
    slug: 'cnc-bangle-cutting',
    description: 'Advanced CNC machines for precision cutting and engraving of bangles and rings',
    image: '/images/cnc-bangle-main.png',
    icon: 'fa-cogs',
    order: 1,
    isActive: true
  },
  {
    name: 'Dough Balls Cutting Machine',
    slug: 'dough-balls-cutting',
    description: 'Specialized machines for cutting and shaping round balls',
    image: '/images/7-axis-round-ball.png',
    icon: 'fa-circle',
    order: 2,
    isActive: true
  },
  {
    name: 'Pendent And Ring Engraving & Cutting Machine',
    slug: 'pendent-ring-engraving',
    description: 'Professional engraving and cutting machines for pendants and rings',
    image: '/images/4-axis-pendant-pro.png',
    icon: 'fa-gem',
    order: 3,
    isActive: true
  },
  {
    name: 'Faceting Machine',
    slug: 'faceting-machine',
    description: 'Precision faceting machines for jewelry manufacturing',
    image: '/images/4-axis-chain-faceting.png',
    icon: 'fa-cut',
    order: 4,
    isActive: true
  },
  {
    name: 'Jewellery Cutting Machine',
    slug: 'jewellery-cutting',
    description: 'General purpose jewelry cutting machines',
    image: '/images/bangle-cnc-2.png',
    icon: 'fa-tools',
    order: 5,
    isActive: true
  },
  {
    name: 'Jewellery Engraving Machine',
    slug: 'jewellery-engraving',
    description: 'Professional engraving machines for jewelry decoration',
    image: '/images/double-head-decoration.png',
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
    price: 320000,
    image: '/images/cnc-9axis-main.png',
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
    price: 285000,
    image: '/images/8-axis-universal-bangle.png',
    specifications: {
      axes: '8 Axis',
      control: 'CNC',
      features: ['Flat Cutting', 'Half Round Cutting', 'Combine Head'],
      applications: ['Bangle Manufacturing', 'Ring Production']
    },
    isActive: true
  },
  {
    name: '7 Axis CNC Round Ball Cutting And Engraving Horizontal And Vertical Machine',
    description: 'Specialized 7-axis CNC machine for cutting and engraving round balls in both horizontal and vertical positions.',
    category: 'dough-balls-cutting',
    categoryName: 'Dough Balls Cutting Machine',
    price: 250000,
    image: '/images/7-axis-round-ball.png',
    specifications: {
      axes: '7 Axis',
      control: 'CNC',
      features: ['Round Ball Cutting', 'Horizontal/Vertical Operation', 'Precision Engraving'],
      applications: ['Ball Manufacturing', 'Decorative Spheres']
    },
    isActive: true
  },
  {
    name: '7 Axis CNC Flat, Round and Oval Bangle Chain Faceting Machine',
    description: 'Versatile 7-axis CNC machine for faceting flat, round, and oval bangle chains.',
    category: 'faceting-machine',
    categoryName: 'Faceting Machine',
    price: 220000,
    image: '/images/7-axis-flat-bangle.png',
    specifications: {
      axes: '7 Axis',
      control: 'CNC',
      features: ['Multi-shape Faceting', 'Chain Processing', 'Precision Control'],
      applications: ['Chain Faceting', 'Bangle Processing']
    },
    isActive: true
  },
  {
    name: '4 Axis PLC Based Round Ball Cutting Machine',
    description: 'PLC-controlled 4-axis machine designed for precise round ball cutting operations.',
    category: 'dough-balls-cutting',
    categoryName: 'Dough Balls Cutting Machine',
    price: 185000,
    image: '/images/4-axis-chain-faceting.png',
    specifications: {
      axes: '4 Axis',
      control: 'PLC',
      features: ['Round Ball Cutting', 'PLC Control', 'High Precision'],
      applications: ['Ball Cutting', 'Sphere Manufacturing']
    },
    isActive: true
  },
  {
    name: '4 Axis Pro CNC Pendant Engraving & Cutting Machine',
    description: 'Professional 4-axis CNC machine specialized for pendant engraving and cutting operations.',
    category: 'pendent-ring-engraving',
    categoryName: 'Pendent And Ring Engraving & Cutting Machine',
    price: 165000,
    image: '/images/4-axis-pendant-pro.png',
    specifications: {
      axes: '4 Axis',
      control: 'CNC',
      features: ['Pendant Engraving', 'Precision Cutting', 'Professional Grade'],
      applications: ['Pendant Manufacturing', 'Ring Engraving']
    },
    isActive: true
  },
  {
    name: '4 Axis PLC Based Chain Faceting Horizontal Machine',
    description: 'PLC-based horizontal chain faceting machine with 4-axis control for precise chain processing.',
    category: 'faceting-machine',
    categoryName: 'Faceting Machine',
    price: 145000,
    image: '/images/atc-cnc-bangle-main.png',
    specifications: {
      axes: '4 Axis',
      control: 'PLC',
      features: ['Chain Faceting', 'Horizontal Operation', 'PLC Control'],
      applications: ['Chain Processing', 'Link Manufacturing']
    },
    isActive: true
  },
  {
    name: '2 Axis Plc Based Bangle Inside Turning & Finishing Machine',
    description: 'PLC-based 2-axis machine for inside turning and finishing of bangles.',
    category: 'cnc-bangle-cutting',
    categoryName: 'CNC Bangle And Ring Cutting Machine',
    price: 125000,
    image: '/images/bangle-cnc-main.png',
    specifications: {
      axes: '2 Axis',
      control: 'PLC',
      features: ['Inside Turning', 'Surface Finishing', 'Quality Control'],
      applications: ['Bangle Manufacturing', 'Surface Treatment']
    },
    isActive: true
  },
  {
    name: 'Bangle Inside Turning & Finishing Machine',
    description: 'Specialized machine for internal turning and finishing operations on bangles.',
    category: 'cnc-bangle-cutting',
    categoryName: 'CNC Bangle And Ring Cutting Machine',
    price: 105000,
    image: '/images/bangle-cnc-1.png',
    specifications: {
      operation: 'Inside Turning',
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
    price: 95000,
    image: '/images/hydraulic-bangle-sizing.png',
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
    price: 75000,
    image: '/images/cnc-bangle-main.png',
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
    price: 155000,
    image: '/images/cnc-bangle-2.png',
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
    price: 55000,
    image: '/images/bangle-groove-rolling.png',
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
    price: 135000,
    image: '/images/double-head-decoration.png',
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
    price: 25000,
    image: '/images/bangle-cnc-2.png',
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
    console.log(`\n📊 Summary:`);
    console.log(`Categories: ${insertedCategories.length}`);
    console.log(`Products: ${insertedProducts.length}`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run the seed function
seedDatabase();