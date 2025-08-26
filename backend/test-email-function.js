const axios = require('axios');

const testEmailFunction = async () => {
  try {
    console.log('🧪 Testing email test function...');
    
    const response = await axios.post('http://localhost:5000/api/email/test', {
      email: 'toolsandmachinelvs@gmail.com'
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
    
    console.log('✅ Test Email Response:', response.data);
    console.log('🎉 Test email sent successfully!');
    
  } catch (error) {
    console.error('❌ Test email failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
};

console.log('🚀 Testing the test email function...');
testEmailFunction();
