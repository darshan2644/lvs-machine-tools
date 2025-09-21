const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

class PDFReceiptGenerator {
  constructor() {
    this.doc = null;
  }

  generateReceipt(orderData) {
    return new Promise((resolve, reject) => {
      try {
        // Initialize PDF document
        this.doc = new PDFDocument({ margin: 50 });
        
        // Create temp directory if it doesn't exist
        const tempDir = path.join(__dirname, '..', 'temp');
        if (!fs.existsSync(tempDir)) {
          fs.mkdirSync(tempDir, { recursive: true });
        }
        
        // Generate unique filename
        const filename = `receipt_${orderData.orderId || 'order_' + Date.now()}.pdf`;
        const filepath = path.join(tempDir, filename);
        
        // Pipe PDF to file
        this.doc.pipe(fs.createWriteStream(filepath));
        
        // Add content to PDF
        this.addHeader();
        this.addCompanyInfo();
        this.addOrderInfo(orderData);
        this.addCustomerInfo(orderData);
        this.addItemsTable(orderData);
        this.addTotals(orderData);
        this.addFooter();
        
        // Finalize PDF
        this.doc.end();
        
        // Wait for PDF to be written
        this.doc.on('end', () => {
          resolve(filepath);
        });
        
      } catch (error) {
        reject(error);
      }
    });
  }

  addHeader() {
    // Company logo/header area
    this.doc
      .fontSize(24)
      .fillColor('#000000')
      .text('LVS MACHINE AND TOOLS', 50, 50, { align: 'left' });

    // Receipt title
    this.doc
      .fontSize(18)
      .fillColor('#666666')
      .text('INVOICE / RECEIPT', 400, 50, { align: 'right' });

    // Add a line separator
    this.doc
      .strokeColor('#000000')
      .lineWidth(2)
      .moveTo(50, 80)
      .lineTo(550, 80)
      .stroke();
  }

  addCompanyInfo() {
    const startY = 90;
    
    this.doc
      .fontSize(10)
      .fillColor('#333333')
      .text('A-20, Shanker Tekri, Industrial Estate', 50, startY)
      .text('Jamnagar - 361004, Gujarat - INDIA', 50, startY + 15)
      .text('Phone: +91 288 2561871 / +91 98252 65401', 50, startY + 30)
      .text('Email: lvsmachinetools@gmail.com', 50, startY + 45)
      .text('GST: 24XXXXXXXXXXXXXX', 50, startY + 60);
  }

  addOrderInfo(orderData) {
    const startY = 180;
    
    this.doc
      .fontSize(12)
      .fillColor('#000000')
      .text('Order Details', 400, startY, { underline: true });

    this.doc
      .fontSize(10)
      .fillColor('#333333')
      .text(`Order ID: ${orderData.orderId}`, 400, startY + 20)
      .text(`Date: ${new Date(orderData.createdAt || orderData.orderDate).toLocaleDateString('en-IN')}`, 400, startY + 35)
      .text(`Status: ${orderData.orderStatus || 'Order Placed'}`, 400, startY + 50)
      .text(`Payment: ${orderData.paymentMethod || 'Online'}`, 400, startY + 65);
  }

  addCustomerInfo(orderData) {
    const startY = 180;
    
    this.doc
      .fontSize(12)
      .fillColor('#000000')
      .text('Bill To:', 50, startY, { underline: true });

    const customerInfo = orderData.customerInfo || {};
    const shippingAddress = orderData.shippingAddress || {};
    
    this.doc
      .fontSize(10)
      .fillColor('#333333')
      .text(`${customerInfo.firstName || ''} ${customerInfo.lastName || ''}`, 50, startY + 20)
      .text(`${customerInfo.company || ''}`, 50, startY + 35)
      .text(`${shippingAddress.address || ''}`, 50, startY + 50)
      .text(`${shippingAddress.city || ''}, ${shippingAddress.state || ''} - ${shippingAddress.pincode || ''}`, 50, startY + 65)
      .text(`Phone: ${shippingAddress.phone || customerInfo.phone || ''}`, 50, startY + 80)
      .text(`Email: ${customerInfo.email || ''}`, 50, startY + 95);
  }

  addItemsTable(orderData) {
    const startY = 300;
    const items = orderData.items || [];
    
    // Table header
    this.doc
      .fontSize(10)
      .fillColor('#ffffff')
      .rect(50, startY, 500, 25)
      .fill('#333333')
      .fillColor('#ffffff')
      .text('Description', 60, startY + 8)
      .text('Qty', 350, startY + 8)
      .text('Rate', 400, startY + 8)
      .text('Amount', 480, startY + 8);

    // Table rows
    let currentY = startY + 25;
    items.forEach((item, index) => {
      const rowY = currentY + (index * 25);
      
      // Alternate row colors
      if (index % 2 === 0) {
        this.doc
          .rect(50, rowY, 500, 25)
          .fill('#f8f9fa')
          .stroke();
      }
      
      this.doc
        .fillColor('#333333')
        .text(item.name || item.description || 'Product', 60, rowY + 8)
        .text(item.quantity.toString(), 350, rowY + 8)
        .text(`₹${item.price.toLocaleString('en-IN')}`, 400, rowY + 8)
        .text(`₹${(item.quantity * item.price).toLocaleString('en-IN')}`, 480, rowY + 8);
    });
  }

  addTotals(orderData) {
    const startY = 420;
    
    // Get total price from either totalPrice or totalAmount field
    const totalPrice = orderData.totalPrice || orderData.totalAmount || 0;
    const subtotal = orderData.subtotal || totalPrice;
    const shipping = orderData.shipping || 1500; // Default shipping cost
    const tax = orderData.tax || Math.round(totalPrice * 0.18);

    // Totals section
    this.doc
      .fontSize(10)
      .fillColor('#666666')
      .text('Subtotal:', 400, startY)
      .text(`₹${subtotal.toLocaleString('en-IN')}`, 480, startY)
      .text('Shipping:', 400, startY + 20)
      .text(`₹${shipping.toLocaleString('en-IN')}`, 480, startY + 20)
      .text('GST (18%):', 400, startY + 40)
      .text(`₹${tax.toLocaleString('en-IN')}`, 480, startY + 40);

    // Total line
    this.doc
      .strokeColor('#000000')
      .lineWidth(1)
      .moveTo(350, startY + 65)
      .lineTo(550, startY + 65)
      .stroke();

    this.doc
      .fontSize(12)
      .fillColor('#000000')
      .text('Total Amount:', 400, startY + 75, { continued: true })
      .text(`₹${totalPrice.toLocaleString('en-IN')}`, { align: 'right' });
  }

  addFooter() {
    const footerY = 650;
    
    this.doc
      .fontSize(8)
      .fillColor('#666666')
      .text('Thank you for your business!', 50, footerY, { align: 'center' })
      .text('For any queries, please contact us at lvsmachinetools@gmail.com', 50, footerY + 15, { align: 'center' })
      .text('This is a computer generated invoice and does not require signature.', 50, footerY + 30, { align: 'center' });
  }
}

module.exports = PDFReceiptGenerator;