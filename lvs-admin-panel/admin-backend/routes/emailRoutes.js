import express from 'express';
const router = express.Router();

// Mock data for demonstration
const mockEmails = [
  {
    _id: '1',
    type: 'invoice',
    to: 'john@example.com',
    subject: 'Invoice for Order LVS-001',
    content: '<h1>Invoice</h1><p>Thank you for your order...</p>',
    status: 'sent',
    sentAt: new Date('2024-01-15T10:30:00'),
    openedAt: new Date('2024-01-15T11:00:00'),
    createdAt: new Date('2024-01-15T10:00:00')
  },
  {
    _id: '2',
    type: 'order-confirmation',
    to: 'jane@example.com',
    subject: 'Order Confirmation - LVS-002',
    content: '<h1>Order Confirmed</h1><p>Your order has been confirmed...</p>',
    status: 'sent',
    sentAt: new Date('2024-01-14T15:20:00'),
    createdAt: new Date('2024-01-14T15:15:00')
  },
  {
    _id: '3',
    type: 'promotional',
    to: 'customer@example.com',
    subject: 'New Products Available!',
    content: '<h1>Check out our new products</h1>',
    status: 'failed',
    createdAt: new Date('2024-01-13T09:00:00')
  }
];

// Mock email settings
let emailSettings = {
  smtpHost: 'smtp.gmail.com',
  smtpPort: 587,
  smtpUsername: 'your-email@gmail.com',
  smtpPassword: '',
  fromEmail: 'noreply@lvsmachinetools.com',
  fromName: 'LVS Machine Tools',
  enableSSL: true,
  testMode: false
};

// Get all emails
router.get('/', (req, res) => {
  try {
    res.json(mockEmails);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching emails', error: error.message });
  }
});

// Get email by ID
router.get('/:id', (req, res) => {
  try {
    const email = mockEmails.find(e => e._id === req.params.id);
    if (!email) {
      return res.status(404).json({ message: 'Email not found' });
    }
    res.json(email);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching email', error: error.message });
  }
});

// Resend email
router.post('/:id/resend', (req, res) => {
  try {
    const emailIndex = mockEmails.findIndex(e => e._id === req.params.id);
    if (emailIndex === -1) {
      return res.status(404).json({ message: 'Email not found' });
    }
    
    // Mock resending email
    mockEmails[emailIndex].status = 'pending';
    mockEmails[emailIndex].sentAt = null;
    
    // Simulate sending
    setTimeout(() => {
      mockEmails[emailIndex].status = 'sent';
      mockEmails[emailIndex].sentAt = new Date();
    }, 1000);
    
    res.json({ message: 'Email queued for resending' });
  } catch (error) {
    res.status(500).json({ message: 'Error resending email', error: error.message });
  }
});

// Delete email
router.delete('/:id', (req, res) => {
  try {
    const emailIndex = mockEmails.findIndex(e => e._id === req.params.id);
    if (emailIndex === -1) {
      return res.status(404).json({ message: 'Email not found' });
    }
    
    mockEmails.splice(emailIndex, 1);
    res.json({ message: 'Email deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting email', error: error.message });
  }
});

// Send test email
router.post('/test', (req, res) => {
  try {
    const { to, subject, content } = req.body;
    
    // Mock sending test email
    const testEmail = {
      _id: (mockEmails.length + 1).toString(),
      type: 'test',
      to,
      subject,
      content,
      status: 'sent',
      sentAt: new Date(),
      createdAt: new Date()
    };
    
    mockEmails.push(testEmail);
    res.json({ message: 'Test email sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending test email', error: error.message });
  }
});

// Get email settings
router.get('/settings', (req, res) => {
  try {
    res.json(emailSettings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching email settings', error: error.message });
  }
});

// Update email settings
router.put('/settings', (req, res) => {
  try {
    emailSettings = { ...emailSettings, ...req.body };
    res.json(emailSettings);
  } catch (error) {
    res.status(500).json({ message: 'Error updating email settings', error: error.message });
  }
});

export default router;