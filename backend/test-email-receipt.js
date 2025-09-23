const { sendOrderConfirmationEmail } = require('./services/emailService');

// Test sending an order confirmation email with the new receipt
const testEmailWithReceipt = async () => {
  const testOrder = {
    orderId: 'LVS-TEST-001',
    customerEmail: 'darshanvasoya75@gmail.com', // Your email for testing
    customerName: 'Darshan Vasoya',
    createdAt: new Date(),
    customerInfo: {
      firstName: 'Darshan',
      lastName: 'Vasoya',
      email: 'darshanvasoya75@gmail.com',
      company: 'LVS Machine Tools'
    },
    shippingAddress: {
      address: 'A-20, Shanker Tekri, Industrial Estate',
      city: 'Jamnagar',
      state: 'Gujarat',
      pincode: '361004',
      phone: '+91 288 2561871'
    },
    items: [
      {
        name: '9 Axis CNC Universal Cutting & Engraving Machine',
        description: 'High-precision 9-axis CNC machine with auto tool changer',
        price: 320000,
        quantity: 1
      },
      {
        name: 'Bangle Groove Rolling Machine',
        description: 'Professional groove rolling machine for bangles',
        price: 55000,
        quantity: 1
      }
    ],
    totalAmount: 375000,
    orderStatus: 'Order Placed',
    paymentMethod: 'Online Payment',
    estimatedDelivery: 'Within 7-10 business days'
  };

  try {
    console.log('📧 Testing email with professional LVS receipt...');
    await sendOrderConfirmationEmail(testOrder);
    console.log('✅ Test email sent successfully with LVS receipt!');
    console.log('📮 Check your email at darshanvasoya75@gmail.com');
  } catch (error) {
    console.error('❌ Error sending test email:', error);
  }
};

testEmailWithReceipt();