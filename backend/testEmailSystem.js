// Test script for email and PDF functionality
require('dotenv').config();
const { sendTestEmail } = require('./services/emailService');
const PDFReceiptGenerator = require('./services/pdfGenerator');

// Mock order data for testing
const mockOrderData = {
  orderId: 'LVS' + Date.now(),
  customerInfo: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'test@example.com',
    phone: '+91 98765 43210',
    company: 'Test Company'
  },
  items: [
    {
      name: 'CNC Bangle Cutting Machine',
      quantity: 1,
      price: 125000,
      description: 'Professional grade CNC machine for bangle cutting'
    },
    {
      name: 'Diamond Tool Set',
      quantity: 2,
      price: 15000,
      description: 'High quality diamond cutting tools'
    }
  ],
  totalPrice: 155000,
  paymentMethod: 'razorpay',
  shippingAddress: {
    fullName: 'John Doe',
    address: '123 Test Street, Business Park',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    phone: '+91 98765 43210'
  },
  createdAt: new Date(),
  estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  orderStatus: 'Order Placed'
};

async function testPDFGeneration() {
  try {
    console.log('🔍 Testing PDF generation...');
    const pdfGenerator = new PDFReceiptGenerator();
    const pdfPath = await pdfGenerator.generateReceipt(mockOrderData);
    console.log('✅ PDF generated successfully at:', pdfPath);
    return true;
  } catch (error) {
    console.error('❌ PDF generation failed:', error);
    return false;
  }
}

async function testEmailSystem() {
  try {
    console.log('🔍 Testing email system...');
    const result = await sendTestEmail('test@example.com');
    console.log('📧 Email test result:', result);
    return result.success;
  } catch (error) {
    console.error('❌ Email test failed:', error);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting Email & PDF Receipt System Tests\n');
  
  const pdfTest = await testPDFGeneration();
  const emailTest = await testEmailSystem();
  
  console.log('\n📋 Test Results:');
  console.log(`PDF Generation: ${pdfTest ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Email System: ${emailTest ? '✅ PASS' : '❌ FAIL'}`);
  
  if (pdfTest && emailTest) {
    console.log('\n🎉 All tests passed! Email receipt system is ready.');
    console.log('\n📝 Next Steps:');
    console.log('1. Configure your email credentials in .env file');
    console.log('2. Set EMAIL_USER and EMAIL_PASS (Gmail app password)');
    console.log('3. Set ADMIN_EMAIL for order notifications');
    console.log('4. Test by placing an order through the website');
  } else {
    console.log('\n⚠️ Some tests failed. Please check the error messages above.');
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

module.exports = { testPDFGeneration, testEmailSystem, runTests };