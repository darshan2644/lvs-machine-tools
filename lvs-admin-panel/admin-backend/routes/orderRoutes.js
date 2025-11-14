import express from 'express';
const router = express.Router();

// Mock data for demonstration - replace with actual database queries
const mockOrders = [
  {
    _id: '1',
    orderId: 'LVS-001',
    customerName: 'John Doe',
    user: { name: 'John Doe', email: 'john@example.com' },
    totalAmount: 25000,
    status: 'pending',
    paymentMethod: 'COD',
    createdAt: new Date('2024-01-15'),
    items: [
      { productName: 'CNC Machine', quantity: 1, price: 25000 }
    ],
    shippingAddress: {
      address: '123 Main St, City, State'
    }
  },
  {
    _id: '2',
    orderId: 'LVS-002',
    customerName: 'Jane Smith',
    user: { name: 'Jane Smith', email: 'jane@example.com' },
    totalAmount: 15000,
    status: 'completed',
    paymentMethod: 'Online',
    createdAt: new Date('2024-01-14'),
    items: [
      { productName: 'Jewelry Tool', quantity: 2, price: 7500 }
    ],
    shippingAddress: {
      address: '456 Oak Ave, City, State'
    }
  }
];

// Get all orders
router.get('/', (req, res) => {
  try {
    res.json(mockOrders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
});

// Get order by ID
router.get('/:id', (req, res) => {
  try {
    const order = mockOrders.find(o => o._id === req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error: error.message });
  }
});

// Update order status
router.put('/:id', (req, res) => {
  try {
    const { status, estimatedDelivery, trackingNumber } = req.body;
    const orderIndex = mockOrders.findIndex(o => o._id === req.params.id);
    
    if (orderIndex === -1) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    mockOrders[orderIndex] = {
      ...mockOrders[orderIndex],
      status,
      estimatedDelivery,
      trackingNumber,
      updatedAt: new Date()
    };
    
    res.json(mockOrders[orderIndex]);
  } catch (error) {
    res.status(500).json({ message: 'Error updating order', error: error.message });
  }
});

// Send invoice
router.post('/:id/send-invoice', (req, res) => {
  try {
    // Mock invoice sending
    console.log(`Sending invoice for order ${req.params.id}`);
    res.json({ message: 'Invoice sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending invoice', error: error.message });
  }
});

export default router;