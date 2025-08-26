const express = require('express');
const router = express.Router();
const { sendOrderConfirmationEmail, sendOrderNotificationToBusiness, sendTestEmail } = require('../services/emailService');

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

// Get email status - keeping the original test route as GET
router.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Email service is running',
    timestamp: new Date().toISOString(),
    endpoints: {
      'POST /email/order-confirmation': 'Send order confirmation email',
      'POST /email/business-notification': 'Send order notification to business email',
      'POST /email/test': 'Send test email',
      'GET /email/test': 'Check email service status'
    }
  });
});

module.exports = router;