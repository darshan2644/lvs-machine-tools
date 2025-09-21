const nodemailer = require('nodemailer');
const PDFReceiptGenerator = require('./pdfGenerator');
const fs = require('fs');

// Email configuration
const createTransporter = () => {
  // For Gmail (you can change this for other providers)
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'toolsandmachinelvs@gmail.com',
      pass: process.env.EMAIL_PASS || process.env.EMAIL_PASSWORD
    },
    tls: {
      rejectUnauthorized: false // This fixes the self-signed certificate issue
    }
  });
};

// Generate order confirmation email HTML
const generateOrderConfirmationHTML = (orderData) => {
  const {
    orderId,
    customerName,
    customerEmail,
    items,
    totalAmount,
    shippingAddress,
    estimatedDelivery,
    paymentMethod,
    orderDate
  } = orderData;

  const itemsHTML = items.map(item => `
    <tr style="border-bottom: 1px solid #eee;">
      <td style="padding: 12px; text-align: left;">
        <img src="${item.image || '/images/placeholder-product.svg'}" 
             alt="${item.name}" 
             style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px; margin-right: 10px; vertical-align: middle;">
        ${item.name}
      </td>
      <td style="padding: 12px; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; text-align: right;">₹${item.price.toLocaleString('en-IN')}</td>
      <td style="padding: 12px; text-align: right; font-weight: bold;">₹${(item.quantity * item.price).toLocaleString('en-IN')}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation - LVS Machine Tools</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 0; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%); color: white; padding: 30px 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">🎉 Order Confirmed!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Thank you for your order from LVS Machine Tools</p>
        </div>

        <!-- Order Details -->
        <div style="padding: 30px 20px;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #FFD700;">
            <h2 style="margin: 0 0 15px 0; color: #2c3e50; font-size: 20px;">📋 Order Information</h2>
            <p style="margin: 5px 0;"><strong>Order ID:</strong> <span style="color: #3498db; font-weight: bold;">${orderId}</span></p>
            <p style="margin: 5px 0;"><strong>Order Date:</strong> ${new Date(orderDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p style="margin: 5px 0;"><strong>Customer:</strong> ${customerName}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${customerEmail}</p>
            <p style="margin: 5px 0;"><strong>Payment Method:</strong> ${paymentMethod}</p>
          </div>

          <!-- Items Table -->
          <h3 style="color: #2c3e50; margin-bottom: 15px;">📦 Order Items</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; background: white; border: 1px solid #eee;">
            <thead>
              <tr style="background-color: #f8f9fa;">
                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6;">Product</th>
                <th style="padding: 12px; text-align: center; border-bottom: 2px solid #dee2e6;">Qty</th>
                <th style="padding: 12px; text-align: right; border-bottom: 2px solid #dee2e6;">Price</th>
                <th style="padding: 12px; text-align: right; border-bottom: 2px solid #dee2e6;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
            <tfoot>
              <tr style="background-color: #f8f9fa; font-weight: bold; font-size: 16px;">
                <td colspan="3" style="padding: 15px; text-align: right; border-top: 2px solid #dee2e6;">Grand Total:</td>
                <td style="padding: 15px; text-align: right; border-top: 2px solid #dee2e6; color: #27ae60;">₹${totalAmount.toLocaleString('en-IN')}</td>
              </tr>
            </tfoot>
          </table>

          <!-- Shipping Details -->
          <div style="background-color: #e8f4f8; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="margin: 0 0 15px 0; color: #2c3e50;">🚚 Shipping Information</h3>
            <p style="margin: 5px 0; line-height: 1.5;">
              <strong>Delivery Address:</strong><br>
              ${shippingAddress.fullName}<br>
              ${shippingAddress.address}<br>
              ${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.pincode}<br>
              Phone: ${shippingAddress.phone}
            </p>
            <p style="margin: 15px 0 5px 0;"><strong>📅 Estimated Delivery:</strong> 
              <span style="color: #27ae60; font-weight: bold;">
                ${estimatedDelivery || 'Within 5-7 business days'}
              </span>
            </p>
          </div>

          <!-- Next Steps -->
          <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107;">
            <h3 style="margin: 0 0 15px 0; color: #856404;">⚡ What's Next?</h3>
            <ul style="margin: 0; padding-left: 20px; color: #856404;">
              <li>We'll process your order within 1-2 business days</li>
              <li>You'll receive a shipping confirmation with tracking details</li>
              <li>Your order will be carefully packed and dispatched</li>
              <li>Track your order status in your account dashboard</li>
              <li><strong>📎 Your PDF receipt is attached to this email for your records</strong></li>
            </ul>
          </div>

          <!-- Support -->
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="margin: 0 0 10px 0; color: #666;">Need help? Contact our support team:</p>
            <p style="margin: 0;">
              📞 <strong>+91-XXXXXXXXXX</strong> | 
              📧 <strong>support@lvsmachinetools.com</strong>
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #2c3e50; color: white; padding: 20px; text-align: center;">
          <p style="margin: 0 0 10px 0; font-size: 18px; font-weight: bold;">LVS Machine Tools</p>
          <p style="margin: 0; opacity: 0.8; font-size: 14px;">Your trusted partner for professional machine tools and industrial equipment</p>
          <p style="margin: 10px 0 0 0; opacity: 0.7; font-size: 12px;">This is an automated email. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Send order confirmation email
const sendOrderConfirmationEmail = async (orderData) => {
  try {
    const transporter = createTransporter();
    
    // Generate PDF receipt
    const pdfGenerator = new PDFReceiptGenerator();
    const pdfPath = await pdfGenerator.generateReceipt(orderData);
    
    const mailOptions = {
      from: {
        name: 'LVS Machine Tools',
        address: process.env.EMAIL_USER || 'toolsandmachinelvs@gmail.com'
      },
      to: orderData.customerEmail,
      subject: `🎉 Order Confirmation - ${orderData.orderId} | LVS Machine Tools`,
      html: generateOrderConfirmationHTML(orderData),
      attachments: [
        {
          filename: `Receipt_${orderData.orderId}.pdf`,
          path: pdfPath
        }
      ],
      // Also send plain text version
      text: `
Order Confirmation - LVS Machine Tools

Dear ${orderData.customerName},

Thank you for your order! Here are the details:

Order ID: ${orderData.orderId}
Order Date: ${new Date(orderData.orderDate).toLocaleDateString('en-IN')}
Total Amount: ₹${orderData.totalAmount.toLocaleString('en-IN')}
Payment Method: ${orderData.paymentMethod}
Estimated Delivery: ${orderData.estimatedDelivery || 'Within 5-7 business days'}

Items Ordered:
${orderData.items.map(item => `- ${item.name} (Qty: ${item.quantity}) - ₹${(item.quantity * item.price).toLocaleString('en-IN')}`).join('\n')}

Shipping Address:
${orderData.shippingAddress.fullName}
${orderData.shippingAddress.address}
${orderData.shippingAddress.city}, ${orderData.shippingAddress.state} - ${orderData.shippingAddress.pincode}

We'll process your order within 1-2 business days and send you tracking information.

Please find your receipt attached as a PDF for your records.

Thank you for choosing LVS Machine Tools!

Best regards,
LVS Machine Tools Team
      `
    };

    const result = await transporter.sendMail(mailOptions);
    
    // Clean up temporary PDF file
    cleanupTempFile(pdfPath);
    
    console.log('✅ Order confirmation email with PDF receipt sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('❌ Error sending order confirmation email:', error);
    return { success: false, error: error.message };
  }
};

// NEW: Send order notification to business email FROM customer email
const sendOrderNotificationToBusiness = async (orderData) => {
  try {
    const transporter = createTransporter();
    
    // Create email that appears to be sent FROM customer but actually sent from business email
    // We use replyTo to make it easy to respond to the customer
    const mailOptions = {
      from: {
        name: `${orderData.customerName} (via LVS System)`,
        address: process.env.EMAIL_USER || 'toolsandmachinelvs@gmail.com'
      },
      to: process.env.EMAIL_USER || 'toolsandmachinelvs@gmail.com',
      replyTo: {
        name: orderData.customerName,
        address: orderData.customerEmail
      },
      subject: `🆕 New Order Placed - ${orderData.orderId} - ${orderData.customerName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>New Order Notification</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 0; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; font-size: 24px;">🆕 New Order Received!</h1>
              <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">A customer has placed a new order</p>
            </div>

            <!-- Order Summary -->
            <div style="padding: 20px;">
              <div style="background-color: #fff3cd; padding: 15px; border-radius: 6px; margin-bottom: 20px; border-left: 4px solid #ffc107;">
                <h2 style="margin: 0 0 10px 0; color: #856404; font-size: 18px;">📋 Order Details</h2>
                <p style="margin: 3px 0;"><strong>Order ID:</strong> ${orderData.orderId}</p>
                <p style="margin: 3px 0;"><strong>Order Date:</strong> ${new Date(orderData.orderDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                <p style="margin: 3px 0;"><strong>Total Amount:</strong> ₹${orderData.totalAmount.toLocaleString('en-IN')}</p>
                <p style="margin: 3px 0;"><strong>Payment Method:</strong> ${orderData.paymentMethod}</p>
              </div>

              <!-- Customer Information -->
              <div style="background-color: #d4edda; padding: 15px; border-radius: 6px; margin-bottom: 20px; border-left: 4px solid #28a745;">
                <h3 style="margin: 0 0 10px 0; color: #155724;">👤 Customer Information</h3>
                <p style="margin: 3px 0;"><strong>Name:</strong> ${orderData.customerName}</p>
                <p style="margin: 3px 0;"><strong>Email:</strong> <a href="mailto:${orderData.customerEmail}" style="color: #155724;">${orderData.customerEmail}</a></p>
                <p style="margin: 3px 0;"><strong>Phone:</strong> <a href="tel:${orderData.shippingAddress.phone}" style="color: #155724;">${orderData.shippingAddress.phone}</a></p>
              </div>

              <!-- Shipping Address -->
              <div style="background-color: #cce7ff; padding: 15px; border-radius: 6px; margin-bottom: 20px; border-left: 4px solid #007bff;">
                <h3 style="margin: 0 0 10px 0; color: #004085;">🚚 Shipping Address</h3>
                <p style="margin: 3px 0; line-height: 1.4;">
                  ${orderData.shippingAddress.fullName}<br>
                  ${orderData.shippingAddress.address}<br>
                  ${orderData.shippingAddress.city}, ${orderData.shippingAddress.state} - ${orderData.shippingAddress.pincode}
                </p>
              </div>

              <!-- Order Items -->
              <div style="margin-bottom: 20px;">
                <h3 style="color: #2c3e50; margin-bottom: 10px;">📦 Ordered Items</h3>
                <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
                  <thead>
                    <tr style="background-color: #f8f9fa;">
                      <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Product</th>
                      <th style="padding: 8px; text-align: center; border: 1px solid #ddd;">Qty</th>
                      <th style="padding: 8px; text-align: right; border: 1px solid #ddd;">Price</th>
                      <th style="padding: 8px; text-align: right; border: 1px solid #ddd;">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${orderData.items.map(item => `
                      <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;">${item.name}</td>
                        <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">${item.quantity}</td>
                        <td style="padding: 8px; text-align: right; border: 1px solid #ddd;">₹${item.price.toLocaleString('en-IN')}</td>
                        <td style="padding: 8px; text-align: right; border: 1px solid #ddd; font-weight: bold;">₹${(item.quantity * item.price).toLocaleString('en-IN')}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                  <tfoot>
                    <tr style="background-color: #f8f9fa; font-weight: bold;">
                      <td colspan="3" style="padding: 10px; text-align: right; border: 1px solid #ddd;">Grand Total:</td>
                      <td style="padding: 10px; text-align: right; border: 1px solid #ddd; color: #28a745; font-size: 16px;">₹${orderData.totalAmount.toLocaleString('en-IN')}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <!-- Action Required -->
              <div style="background-color: #f8d7da; padding: 15px; border-radius: 6px; border-left: 4px solid #dc3545;">
                <h3 style="margin: 0 0 10px 0; color: #721c24;">⚡ Action Required</h3>
                <ul style="margin: 0; padding-left: 20px; color: #721c24;">
                  <li>Process the order in your system</li>
                  <li>Prepare items for shipment</li>
                  <li>Contact customer if needed: ${orderData.customerEmail}</li>
                  <li>Update order status and tracking information</li>
                </ul>
              </div>

              <!-- Quick Actions -->
              <div style="margin-top: 20px; text-align: center;">
                <p style="margin-bottom: 15px; color: #666;">Quick Actions:</p>
                <a href="mailto:${orderData.customerEmail}?subject=Re: Order ${orderData.orderId}&body=Dear ${orderData.customerName},%0A%0AThank you for your order ${orderData.orderId}." 
                   style="display: inline-block; background-color: #28a745; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; margin: 0 5px;">
                  📧 Email Customer
                </a>
                <a href="tel:${orderData.shippingAddress.phone}" 
                   style="display: inline-block; background-color: #007bff; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; margin: 0 5px;">
                  📞 Call Customer
                </a>
              </div>
            </div>

            <!-- Footer -->
            <div style="background-color: #6c757d; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px;">
              <p style="margin: 0; font-size: 14px;">LVS Machine Tools - Order Management System</p>
              <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.8;">💡 Click "Reply" to respond directly to the customer (${orderData.customerEmail})</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
New Order Notification - LVS Machine Tools

Order ID: ${orderData.orderId}
Customer: ${orderData.customerName}
Email: ${orderData.customerEmail}
Phone: ${orderData.shippingAddress.phone}
Total: ₹${orderData.totalAmount.toLocaleString('en-IN')}
Payment: ${orderData.paymentMethod}

Shipping Address:
${orderData.shippingAddress.fullName}
${orderData.shippingAddress.address}
${orderData.shippingAddress.city}, ${orderData.shippingAddress.state} - ${orderData.shippingAddress.pincode}

Items:
${orderData.items.map(item => `- ${item.name} (Qty: ${item.quantity}) - ₹${(item.quantity * item.price).toLocaleString('en-IN')}`).join('\n')}

Action Required:
- Process the order
- Prepare for shipment
- Contact customer if needed

Reply to this email to contact the customer directly.
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Order notification sent to business email:', result.messageId);
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('❌ Error sending order notification to business:', error);
    return { success: false, error: error.message };
  }
};

// Test email function
const sendTestEmail = async (toEmail) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: {
        name: 'LVS Machine Tools',
        address: process.env.EMAIL_USER || 'toolsandmachinelvs@gmail.com'
      },
      to: toEmail,
      subject: '✅ Email Test - LVS Machine Tools',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2c3e50;">Email System Test</h2>
          <p>✅ Your email system is working correctly!</p>
          <p>This is a test email from LVS Machine Tools.</p>
          <hr>
          <p style="color: #666; font-size: 12px;">Sent at: ${new Date().toLocaleString('en-IN')}</p>
        </div>
      `,
      text: 'Email system test successful! Your email configuration is working correctly.'
    };

    const result = await transporter.sendMail(mailOptions);
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('Test email error:', error);
    return { success: false, error: error.message };
  }
};

// Clean up temporary PDF files
const cleanupTempFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log('🗑️ Temporary PDF file cleaned up:', filePath);
    }
  } catch (error) {
    console.error('❌ Error cleaning up temporary file:', error);
  }
};

module.exports = {
  sendOrderConfirmationEmail,
  sendOrderNotificationToBusiness,
  sendTestEmail,
  generateOrderConfirmationHTML
};