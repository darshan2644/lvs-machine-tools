// Load environment variables
require('dotenv').config();

const { sendOrderNotificationToBusiness } = require('./services/emailService');

// Test data for business notification
const testOrderData = {
  orderId: "ORD-TEST-BUSINESS-001",
  customerName: "Rajesh Kumar",
  customerEmail: "rajesh.kumar@example.com",
  orderDate: new Date().toISOString(),
  totalAmount: 45000,
  paymentMethod: "Cash on Delivery",
  estimatedDelivery: "Within 5-7 business days",
  items: [
    {
      name: "CNC Bangle Cutting Machine",
      quantity: 1,
      price: 45000
    }
  ],
  shippingAddress: {
    fullName: "Rajesh Kumar",
    phone: "+91-9876543210",
    address: "123 Industrial Area, Sector 5",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001"
  }
};

async function testBusinessNotification() {
  console.log('🧪 Testing Business Notification Email...');
  console.log('📧 This email will be sent FROM:', testOrderData.customerEmail);
  console.log('📧 This email will be sent TO: toolsandmachinelvs@gmail.com');
  console.log('📋 Order ID:', testOrderData.orderId);
  console.log('---');
  
  try {
    const result = await sendOrderNotificationToBusiness(testOrderData);
    
    if (result.success) {
      console.log('✅ Business notification email sent successfully!');
      console.log('📬 Message ID:', result.messageId);
      console.log('📧 Check your business email (toolsandmachinelvs@gmail.com) for the notification');
      console.log('---');
      console.log('✨ The email should appear as if it was sent FROM rajesh.kumar@example.com');
      console.log('✨ TO toolsandmachinelvs@gmail.com with order details');
    } else {
      console.log('❌ Failed to send business notification email');
      console.log('Error:', result.error);
    }
  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

// Run the test
testBusinessNotification();
