const http = require('http');

const data = JSON.stringify({
  email: 'toolsandmachinelvs@gmail.com'
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/email/test',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

console.log('🧪 Testing email API with http module...');

const req = http.request(options, (res) => {
  let body = '';
  
  res.on('data', (chunk) => {
    body += chunk;
  });
  
  res.on('end', () => {
    console.log('📤 Response status:', res.statusCode);
    console.log('📧 Response body:', body);
  });
});

req.on('error', (error) => {
  console.error('❌ Request error:', error.message);
});

req.write(data);
req.end();
