import express from 'express';
const router = express.Router();

// Mock data for demonstration
const mockCustomers = [
  {
    _id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+91 9876543210',
    address: '123 Main St, Mumbai, Maharashtra',
    isBlocked: false,
    createdAt: new Date('2024-01-10')
  },
  {
    _id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+91 9876543211',
    address: '456 Oak Ave, Delhi, Delhi',
    isBlocked: false,
    createdAt: new Date('2024-01-12')
  },
  {
    _id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    phone: '+91 9876543212',
    address: '789 Pine St, Bangalore, Karnataka',
    isBlocked: true,
    createdAt: new Date('2024-01-08')
  }
];

// Get all customers
router.get('/', (req, res) => {
  try {
    res.json(mockCustomers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customers', error: error.message });
  }
});

// Get customer by ID
router.get('/:id', (req, res) => {
  try {
    const customer = mockCustomers.find(c => c._id === req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customer', error: error.message });
  }
});

// Update customer (block/unblock)
router.put('/:id', (req, res) => {
  try {
    const customerIndex = mockCustomers.findIndex(c => c._id === req.params.id);
    if (customerIndex === -1) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    mockCustomers[customerIndex] = {
      ...mockCustomers[customerIndex],
      ...req.body,
      updatedAt: new Date()
    };
    
    res.json(mockCustomers[customerIndex]);
  } catch (error) {
    res.status(500).json({ message: 'Error updating customer', error: error.message });
  }
});

export default router;