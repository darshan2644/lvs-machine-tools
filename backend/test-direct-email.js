const nodemailer = require('nodemailer');
require('dotenv').config();

const testDirectEmail = async () => {
  try {
    console.log('📧 Testing direct email sending...');
    console.log('Email user:', process.env.EMAIL_USER);
    console.log('Email pass length:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 'undefined');
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'toolsandmachinelvs@gmail.com',
        pass: process.env.EMAIL_PASS || 'fyhf hkkm xuup bbhr'
      },
      tls: {
        rejectUnauthorized: false // This fixes the self-signed certificate issue
      }
    });
    
    console.log('✅ Transporter created');
    
    // Verify connection
    await transporter.verify();
    console.log('✅ Email server connection verified');
    
    // Send test email
    const info = await transporter.sendMail({
      from: 'LVS Machine Tools <toolsandmachinelvs@gmail.com>',
      to: 'toolsandmachinelvs@gmail.com', // Send to self for testing
      subject: '✅ Test Email - LVS System Working',
      html: `
        <h2>🎉 Email Test Successful!</h2>
        <p>This email confirms that the LVS Machine Tools email system is working correctly.</p>
        <p><strong>Timestamp:</strong> ${new Date().toLocaleString('en-IN')}</p>
        <p><strong>System:</strong> Direct nodemailer test</p>
      `,
      text: 'Email test successful! LVS Machine Tools email system is working correctly.'
    });
    
    console.log('✅ Email sent successfully!');
    console.log('📧 Message ID:', info.messageId);
    console.log('📬 Preview URL:', nodemailer.getTestMessageUrl(info));
    
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    if (error.code) {
      console.error('🔍 Error code:', error.code);
    }
  }
};

testDirectEmail();
