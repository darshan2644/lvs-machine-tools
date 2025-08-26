const axios = require('axios');

const testAPI = async () => {
  try {
    console.log('🧪 Testing email API...');
    
    const response = await axios.post('http://localhost:5000/api/email/test', {
      email: 'toolsandmachinelvs@gmail.com'
    });
    
    console.log('✅ API Test Result:', response.data);
    
  } catch (error) {
    console.error('❌ API Test Error:', error.response?.data || error.message);
  }
};

testAPI();
