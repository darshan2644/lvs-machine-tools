import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Load env vars
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5175', 'http://localhost:5177'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Example route
app.get('/', (req, res) => {
  res.send('LVS Admin Backend Running');
});

// Import routes
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import emailRoutes from './routes/emailRoutes.js';

// Use routes
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/categories', categoryRoutes);
app.use('/customers', customerRoutes);
app.use('/emails', emailRoutes);
app.use('/email-settings', emailRoutes);

// Dashboard stats endpoint
app.get('/dashboard/stats', (req, res) => {
  try {
    // Mock dashboard statistics
    const stats = {
      totalOrders: 156,
      totalCustomers: 89,
      totalRevenue: 456789,
      totalProducts: 45,
      pendingOrders: 12,
      completedOrders: 134,
      todayOrders: 8,
      todayRevenue: 25000
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard stats', error: error.message });
  }
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Admin backend listening on port ${PORT}`);
});
