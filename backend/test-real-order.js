const axios = require('axios');

const testRealOrder = async () => {
  try {
    console.log('🧪 Testing real order email flow...');
    
    // Simulate order data that would come from a real order
    const orderData = {
      orderId: `LVS-TEST-${Date.now()}`,
      customerName: 'Test Customer',
      customerEmail: 'toolsandmachinelvs@gmail.com', // Use the business email for testing
      items: [
        {
          productId: 'cnc-bangle-1',
          name: 'CNC Bangle Cutting Machine',
          quantity: 1,
          price: 125000,
          image: '/images/cnc-bangle-main.png'
        }
      ],
      totalAmount: 125000,
      shippingAddress: {
        fullName: 'Test Customer',
        address: '123 Test Street',
        city: 'Test City',
        state: 'Test State',
        pincode: '123456',
        phone: '+91-9876543210'
      },
      estimatedDelivery: 'Within 5-7 business days',
      paymentMethod: 'Cash on Delivery (COD)',
      orderDate: new Date().toISOString()
    };

    console.log('📧 Sending order confirmation email...');
    console.log('Order ID:', orderData.orderId);
    console.log('Customer Email:', orderData.customerEmail);
    
    const response = await axios.post('http://localhost:5000/api/email/order-confirmation', orderData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000 // 30 second timeout
    });
    
    console.log('✅ Email API Response:', response.data);
    console.log('🎉 Order confirmation email sent successfully!');
    
  } catch (error) {
    console.error('❌ Email test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response:', error.response.data);
    } else if (error.request) {
      console.error('Network Error - No response received');
      console.error('Request details:', error.message);
    } else {
      console.error('Error:', error.message);
    }
  }
};

console.log('🚀 Starting real order email test...');
testRealOrder();
