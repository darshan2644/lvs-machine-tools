// Temporary file-based database for development
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'temp-db.json');

// Initialize database if it doesn't exist
const initDb = () => {
  if (!fs.existsSync(dbPath)) {
    const initialData = {
      categories: [
        {
          _id: 'cnc-machines',
          name: 'CNC Machines',
          slug: 'cnc-machines',
          description: 'Professional CNC machines for precision manufacturing',
          isActive: true,
          order: 1
        },
        {
          _id: 'bangle-cnc-cutting',
          name: 'Bangle CNC Cutting',
          slug: 'bangle-cnc-cutting',
          description: 'Specialized CNC machines for bangle cutting',
          isActive: true,
          order: 2
        }
      ],
      products: [
        {
          _id: 'cnc-9axis',
          name: '9 Axis CNC Universal Cutting & Engraving Auto Tool Changer Machine',
          description: 'High-precision 9-axis CNC machine with automatic tool changing capability for universal cutting and engraving operations.',
          price: 250000,
          image: '/images/cnc-9axis-main.png',
          category: 'cnc-machines',
          categoryName: 'CNC Machines',
          isActive: true,
          createdAt: new Date().toISOString()
        },
        {
          _id: 'bangle-cnc-main',
          name: 'Bangle CNC Cutting Machine',
          description: 'Leading Manufacturer of Bangle CNC Cutting Machine with high precision cutting technology for jewelry manufacturing.',
          price: 105000,
          image: '/images/bangle-cnc-main.png',
          category: 'bangle-cnc-cutting',
          categoryName: 'Bangle CNC Cutting',
          isActive: true,
          createdAt: new Date().toISOString()
        },
        {
          _id: 'cnc-bangle-standard',
          name: 'CNC Bangle Cutting Machine',
          description: 'Professional CNC bangle cutting machine for precision jewelry manufacturing with standard model specifications.',
          price: 95000,
          image: '/images/cnc-bangle-main.png',
          category: 'bangle-cnc-cutting',
          categoryName: 'Bangle CNC Cutting',
          isActive: true,
          createdAt: new Date().toISOString()
        }
      ],
      orders: [],
      users: []
    };
    
    fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2));
  }
};

// Database operations
const db = {
  read: () => {
    initDb();
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  },
  
  write: (data) => {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  },
  
  // Categories
  getCategories: () => {
    const data = db.read();
    return data.categories.filter(cat => cat.isActive);
  },
  
  // Products
  getProducts: (query = {}) => {
    const data = db.read();
    let products = data.products.filter(prod => prod.isActive);
    
    if (query.category && query.category !== 'all') {
      products = products.filter(prod => prod.category === query.category);
    }
    
    if (query.search) {
      const searchTerm = query.search.toLowerCase();
      products = products.filter(prod => 
        prod.name.toLowerCase().includes(searchTerm) ||
        prod.description.toLowerCase().includes(searchTerm)
      );
    }
    
    return products;
  },
  
  getProductById: (id) => {
    const data = db.read();
    return data.products.find(prod => prod._id === id);
  },
  
  // Orders
  createOrder: (orderData) => {
    const data = db.read();
    const order = {
      _id: 'ORD' + Date.now(),
      ...orderData,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    data.orders.push(order);
    db.write(data);
    return order;
  },
  
  getOrders: () => {
    const data = db.read();
    return data.orders;
  }
};

module.exports = db;
