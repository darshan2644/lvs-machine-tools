require('dotenv').config();
const mongoose = require('mongoose');

// Simple Category Schema
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  icon: String,
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Simple Product Schema  
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  category: { type: String, required: true },
  categoryName: String,
  price: Number,
  image: String,
  specifications: mongoose.Schema.Types.Mixed,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);
const Product = mongoose.model('Product', productSchema);

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

// Sample data
const categories = [
  {
    name: 'CNC Bangle And Ring Cutting Machine',
    slug: 'cnc-bangle-cutting',
    description: 'Advanced CNC machines for precision cutting and engraving of bangles and rings',
    icon: 'fa-cogs',
    order: 1
  },
  {
    name: 'Dough Balls Cutting Machine',
    slug: 'dough-balls-cutting', 
    description: 'Specialized machines for cutting and shaping round balls',
    icon: 'fa-circle',
    order: 2
  }
];

const products = [
  {
    name: '9 Axis CNC Universal Cutting & Engraving Auto Tool Changer Machine',
    description: 'High-precision 9-axis CNC machine with automatic tool changing capability for universal cutting and engraving operations.',
    category: 'cnc-bangle-cutting',
    categoryName: 'CNC Bangle And Ring Cutting Machine',
    image: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400&h=300&fit=crop',
    specifications: {
      axes: '9 Axis',
      control: 'CNC',
      features: ['Auto Tool Changer', 'Universal Cutting', 'Engraving']
    }
  },
  {
    name: '8 Axis CNC Universal Flat and Half Round Bangle Cutting Machine',
    description: 'Advanced 8-axis CNC system for cutting flat and half round bangles and rings.',
    category: 'cnc-bangle-cutting',
    categoryName: 'CNC Bangle And Ring Cutting Machine',
    image: 'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=400&h=300&fit=crop',
    specifications: {
      axes: '8 Axis',
      control: 'CNC',
      features: ['Flat Cutting', 'Half Round Cutting']
    }
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
    
    await mongoose.connection.close();
    
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
