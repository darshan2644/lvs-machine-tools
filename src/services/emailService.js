// Email service for order confirmations
export const sendOrderConfirmationEmail = async (orderData) => {
  try {
    // In a real application, this would call your backend API
    // For now, we'll simulate the email sending
    
    const emailData = {
      to: orderData.customerEmail,
      subject: `Order Confirmation - LVS Machine & Tools - Order #${orderData.orderId}`,
      html: generateOrderEmailTemplate(orderData)
    };

    // Simulate API call to your backend email service
    console.log('Sending email confirmation:', emailData);
    
    // You would replace this with actual email service like:
    // const response = await fetch('/api/send-email', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(emailData)
    // });
    
    // Simulate successful email sending
    return { success: true, message: 'Email sent successfully' };
    
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, message: 'Failed to send email' };
  }
};

const generateOrderEmailTemplate = (orderData) => {
  const { orderId, customerName, items, totalAmount, deliveryAddress, deliveryDate, paymentMethod } = orderData;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmation - LVS Machine & Tools</title>
      <style>
        body { font-family: 'Arial', sans-serif; margin: 0; padding: 0; background: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; }
        .header { background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); padding: 20px; text-align: center; }
        .header h1 { color: #1f2937; margin: 0; font-size: 24px; }
        .content { padding: 30px; }
        .order-info { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .items-table th, .items-table td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
        .items-table th { background: #f3f4f6; font-weight: 600; }
        .total-row { background: #fef3c7; font-weight: bold; }
        .delivery-info { background: #ecfdf5; padding: 15px; border-radius: 6px; margin: 15px 0; }
        .footer { background: #1f2937; color: white; padding: 20px; text-align: center; }
        .logo { font-weight: bold; font-size: 20px; color: #fbbf24; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">LVS Machine & Tools</div>
          <h1>Order Confirmation</h1>
        </div>
        
        <div class="content">
          <h2>Thank you for your order, ${customerName}!</h2>
          <p>We're excited to confirm that we've received your order and it's being processed.</p>
          
          <div class="order-info">
            <h3>Order Details</h3>
            <p><strong>Order ID:</strong> ${orderId}</p>
            <p><strong>Order Date:</strong> ${new Date().toLocaleDateString('en-IN')}</p>
            <p><strong>Payment Method:</strong> ${paymentMethod}</p>
          </div>

          <h3>Items Ordered</h3>
          <table class="items-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>₹${item.price.toLocaleString('en-IN')}</td>
                  <td>₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
                </tr>
              `).join('')}
              <tr class="total-row">
                <td colspan="3">Order Total</td>
                <td>₹${totalAmount.toLocaleString('en-IN')}</td>
              </tr>
            </tbody>
          </table>

          <div class="delivery-info">
            <h3>Delivery Information</h3>
            <p><strong>Expected Delivery:</strong> ${deliveryDate}</p>
            <p><strong>Shipping Address:</strong></p>
            <p>${deliveryAddress.name}<br>
               ${deliveryAddress.street}<br>
               ${deliveryAddress.city}, ${deliveryAddress.state} - ${deliveryAddress.pincode}<br>
               📞 ${deliveryAddress.phone}</p>
          </div>

          <p><strong>What's Next?</strong></p>
          <ul>
            <li>We'll send you a tracking number once your order ships</li>
            <li>Our team will contact you for any clarifications</li>
            <li>Expected delivery: ${deliveryDate}</li>
          </ul>

          <p>If you have any questions about your order, please contact us at:</p>
          <p>📧 orders@lvsmachinetools.com<br>
             📞 +91 98765 43210</p>
        </div>

        <div class="footer">
          <p>&copy; 2025 LVS Machine & Tools. All rights reserved.</p>
          <p>Leading provider of precision CNC machines and industrial tools</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Function to generate order ID
export const generateOrderId = () => {
  const timestamp = Date.now();
  const randomNum = Math.floor(Math.random() * 1000);
  return `LVS${timestamp}${randomNum}`.slice(-12);
};

// Function to save order to localStorage (in real app, this would go to database)
export const saveOrder = (orderData) => {
  try {
    const existingOrders = JSON.parse(localStorage.getItem('lvsOrders') || '[]');
    existingOrders.push({
      ...orderData,
      timestamp: new Date().toISOString(),
      status: 'confirmed'
    });
    localStorage.setItem('lvsOrders', JSON.stringify(existingOrders));
    return true;
  } catch (error) {
    console.error('Error saving order:', error);
    return false;
  }
};
