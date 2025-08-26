const axios = require('axios');

const testEmail = async () => {
  try {
    console.log('🧪 Testing email service...');
    
    // Test basic service
    console.log('1️⃣ Checking service status...');
    const statusResponse = await axios.get('http://localhost:5000/api/email/test');
    console.log('✅ Email service status:', statusResponse.data);
    
    // Test sending email
    console.log('2️⃣ Sending test email...');
    const emailResponse = await axios.post('http://localhost:5000/api/email/test', {
      email: 'toolsandmachinelvs@gmail.com'
    });
    console.log('✅ Test email result:', emailResponse.data);
    
  } catch (error) {
    console.error('❌ Email test error:', error.response?.data || error.message);
    if (error.response?.data?.details) {
      console.error('🔍 Error details:', error.response.data.details);
    }
  }
};

// Test direct nodemailer
const testNodemailer = () => {
  try {
    console.log('3️⃣ Testing nodemailer directly...');
    const nodemailer = require('nodemailer');
    console.log('✅ Nodemailer loaded successfully');
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'toolsandmachinelvs@gmail.com',
        pass: 'fyhf hkkm xuup bbhr'
      }
    });
    console.log('✅ Transporter created successfully');
    
  } catch (error) {
    console.error('❌ Nodemailer test error:', error.message);
  }
};

console.log('🚀 Starting comprehensive email tests...');
testNodemailer();
testEmail();
