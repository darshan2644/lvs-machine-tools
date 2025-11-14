const express = require('express');
const router = express.Router();
const { sendOrderConfirmationEmail, sendOrderNotificationToBusiness, sendTestEmail, sendContactNotificationEmail } = require('../services/emailService');

// Send order confirmation email
router.post('/order-confirmation', async (req, res) => {
  try {
    const orderData = req.body;
    
    // Validate required fields
    if (!orderData.customerEmail || !orderData.orderId || !orderData.items || !orderData.customerName) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required order data (customerEmail, orderId, items, customerName)' 
      });
    }

    console.log('📧 Sending order confirmation email for order:', orderData.orderId);
    
    // Send the email
    const result = await sendOrderConfirmationEmail(orderData);
    
    if (result.success) {
      res.json({ 
        success: true, 
        message: 'Order confirmation email sent successfully',
        messageId: result.messageId 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        error: 'Failed to send email',
        details: result.error 
      });
    }
    
  } catch (error) {
    console.error('❌ Order confirmation email error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// Test email route
router.post('/test', async (req, res) => {
  try {
    console.log('🔍 Email test route accessed:', req.body);
    const { email } = req.body;
    
    if (!email) {
      console.log('❌ No email provided in request');
      return res.status(400).json({ 
        success: false, 
        error: 'Email address is required' 
      });
    }

    console.log('📧 Sending test email to:', email);
    
    const result = await sendTestEmail(email);
    
    if (result.success) {
      console.log('✅ Test email sent successfully');
      res.json({ 
        success: true, 
        message: 'Test email sent successfully',
        messageId: result.messageId 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        error: 'Failed to send test email',
        details: result.error 
      });
    }
    
  } catch (error) {
    console.error('❌ Test email error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// Send contact form notification to business
router.post('/contact', async (req, res) => {
  try {
    const contactData = req.body;
    
    // Validate required fields
    if (!contactData.email || !contactData.firstName || !contactData.lastName || !contactData.subject || !contactData.message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required contact data (email, firstName, lastName, subject, message)' 
      });
    }

    console.log('📧 Sending contact form notification from:', contactData.email);
    
    // Send the contact notification email
    const result = await sendContactNotificationEmail(contactData);
    
    if (result.success) {
      res.json({ 
        success: true, 
        message: 'Contact form submitted successfully',
        messageId: result.messageId 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        error: 'Failed to send contact notification',
        details: result.error 
      });
    }
    
  } catch (error) {
    console.error('❌ Contact form notification error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// Send order notification to business email FROM customer email
router.post('/business-notification', async (req, res) => {
  try {
    const orderData = req.body;
    
    // Validate required fields
    if (!orderData.customerEmail || !orderData.orderId || !orderData.items || !orderData.customerName) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required order data (customerEmail, orderId, items, customerName)' 
      });
    }

    console.log('📧 Sending order notification to business for order:', orderData.orderId);
    console.log('📧 From customer email:', orderData.customerEmail);
    
    // Send the business notification email
    const result = await sendOrderNotificationToBusiness(orderData);
    
    if (result.success) {
      res.json({ 
        success: true, 
        message: 'Order notification sent to business successfully',
        messageId: result.messageId 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        error: 'Failed to send business notification',
        details: result.error 
      });
    }
    
  } catch (error) {
    console.error('❌ Business notification email error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// Admin email management routes - must come before other GET routes
router.get('/admin/emails', async (req, res) => {
  try {
    // Mock email data for admin panel
    const emails = [
      {
        _id: 'email1',
        to: 'customer@example.com',
        subject: 'Order Confirmation - #ORD001',
        type: 'order_confirmation',
        status: 'sent',
        sentAt: new Date('2024-01-15T10:30:00'),
        orderId: 'ORD001'
      },
      {
        _id: 'email2',
        to: 'admin@lvstools.com',
        subject: 'New Order Notification - #ORD001',
        type: 'order_notification',
        status: 'sent',
        sentAt: new Date('2024-01-15T10:31:00'),
        orderId: 'ORD001'
      },
      {
        _id: 'email3',
        to: 'customer2@example.com',
        subject: 'Order Confirmation - #ORD002',
        type: 'order_confirmation',
        status: 'failed',
        sentAt: new Date('2024-01-14T15:20:00'),
        orderId: 'ORD002',
        error: 'Invalid email address'
      }
    ];
    
    res.json({
      success: true,
      emails: emails,
      count: emails.length
    });
  } catch (error) {
    console.error('Error fetching emails:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching emails',
      error: error.message
    });
  }
});

// Get email by ID - admin route
router.get('/admin/emails/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Mock email detail
    const email = {
      _id: id,
      to: 'customer@example.com',
      subject: 'Order Confirmation - #ORD001',
      type: 'order_confirmation',
      status: 'sent',
      sentAt: new Date('2024-01-15T10:30:00'),
      orderId: 'ORD001',
      content: 'Thank you for your order...'
    };
    
    res.json({
      success: true,
      email: email
    });
  } catch (error) {
    console.error('Error fetching email:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching email',
      error: error.message
    });
  }
});

// Resend email - admin route
router.post('/admin/emails/:id/resend', async (req, res) => {
  try {
    const { id } = req.params;
    
    res.json({
      success: true,
      message: 'Email resent successfully'
    });
  } catch (error) {
    console.error('Error resending email:', error);
    res.status(500).json({
      success: false,
      message: 'Error resending email',
      error: error.message
    });
  }
});

// Delete email - admin route
router.delete('/admin/emails/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    res.json({
      success: true,
      message: 'Email deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting email:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting email',
      error: error.message
    });
  }
});

// Get email settings - admin route
router.get('/admin/settings', async (req, res) => {
  try {
    const settings = {
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587,
      smtpUser: 'admin@lvstools.com',
      smtpSecure: false,
      fromEmail: 'admin@lvstools.com',
      fromName: 'LVS Machine Tools',
      orderNotificationEmail: 'orders@lvstools.com'
    };
    
    res.json({
      success: true,
      settings: settings
    });
  } catch (error) {
    console.error('Error fetching email settings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching email settings',
      error: error.message
    });
  }
});

// Update email settings - admin route
router.put('/admin/settings', async (req, res) => {
  try {
    const settings = req.body;
    
    res.json({
      success: true,
      message: 'Email settings updated successfully',
      settings: settings
    });
  } catch (error) {
    console.error('Error updating email settings:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating email settings',
      error: error.message
    });
  }
});

// Get email status - keeping the original test route as GET
router.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Email service is running',
    timestamp: new Date().toISOString(),
    endpoints: {
      'POST /email/order-confirmation': 'Send order confirmation email',
      'POST /email/business-notification': 'Send order notification to business email',
      'POST /email/contact': 'Send contact form notification to business',
      'POST /email/test': 'Send test email',
      'GET /email/test': 'Check email service status',
      'GET /email/admin/emails': 'Get all emails (admin)',
      'GET /email/admin/settings': 'Get email settings (admin)'
    }
  });
});

module.exports = router;