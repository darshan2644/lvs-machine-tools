const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

class LVSReceiptGenerator {
  constructor() {
    this.doc = null;
    this.colors = {
      primary: '#2c3e50',     // Dark blue-gray
      secondary: '#bdc3c7',   // Light gray
      accent: '#34495e',      // Darker blue-gray
      text: '#2c3e50',        // Dark text
      lightGray: '#ecf0f1',   // Very light gray
      beige: '#d4c5b3'        // Beige like in your image
    };
  }

  generateReceipt(orderData) {
    return new Promise((resolve, reject) => {
      try {
        // Initialize PDF document
        this.doc = new PDFDocument({ 
          margin: 60,
          size: 'A4'
        });
        
        // Create temp directory if it doesn't exist
        const tempDir = path.join(__dirname, '..', 'temp');
        if (!fs.existsSync(tempDir)) {
          fs.mkdirSync(tempDir, { recursive: true });
        }
        
        // Generate unique filename
        const filename = `lvs_receipt_${orderData.orderId || 'order_' + Date.now()}.pdf`;
        const filepath = path.join(tempDir, filename);
        
        // Pipe PDF to file
        this.doc.pipe(fs.createWriteStream(filepath));
        
        // Add content to PDF
        this.addHeader();
        this.addInvoiceInfo(orderData);
        this.addBillingInfo(orderData);
        this.addItemsTable(orderData);
        this.addTotals(orderData);
        this.addPaymentInfo();
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
    // Add company logo area (circular background like in your image)
    this.doc
      .circle(150, 80, 35)
      .fill(this.colors.beige);

    // Add initials in the circle
    this.doc
      .fontSize(20)
      .fillColor('#fff')
      .text('lvs', 135, 70, { width: 30, align: 'center' });

    // Company name
    this.doc
      .fontSize(22)
      .fillColor(this.colors.primary)
      .text('LVS MACHINE AND TOOLS', 60, 130, { letterSpacing: 2 });

    // Tagline
    this.doc
      .fontSize(10)
      .fillColor(this.colors.text)
      .text('precision machinery & industrial tools', 60, 155, { letterSpacing: 1 });

    // Add some spacing
    this.doc.moveDown(2);
  }

  addInvoiceInfo(orderData) {
    const rightX = 400;
    const startY = 60;

    // Invoice details on the right
    this.doc
      .fontSize(10)
      .fillColor(this.colors.text)
      .text('INVOICE NO:', rightX, startY, { continued: true, width: 80 })
      .text(`${orderData.orderId || 'LVS-' + Date.now().toString().slice(-6)}`, { align: 'right' });

    this.doc
      .text('DATE:', rightX, startY + 20, { continued: true, width: 80 })
      .text(new Date(orderData.createdAt || orderData.orderDate || Date.now()).toLocaleDateString('en-GB'), { align: 'right' });

    this.doc
      .text('DUE DATE:', rightX, startY + 40, { continued: true, width: 80 })
      .text(new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString('en-GB'), { align: 'right' });
  }

  addBillingInfo(orderData) {
    const startY = 200;
    
    // Issued To section
    this.doc
      .fontSize(10)
      .fillColor(this.colors.text)
      .text('ISSUED TO:', 60, startY, { underline: false });

    const customerInfo = orderData.customerInfo || {};
    const shippingAddress = orderData.shippingAddress || {};
    
    this.doc
      .fontSize(11)
      .fillColor(this.colors.primary)
      .text(`${customerInfo.firstName || ''} ${customerInfo.lastName || ''}`.trim() || 'Valued Customer', 60, startY + 20);

    if (customerInfo.company) {
      this.doc
        .fontSize(10)
        .fillColor(this.colors.text)
        .text(customerInfo.company, 60, startY + 40);
    }

    this.doc
      .fontSize(10)
      .fillColor(this.colors.text)
      .text(`${shippingAddress.address || 'Address not provided'}`, 60, startY + 60)
      .text(`${shippingAddress.city || ''}, ${shippingAddress.state || ''} ${shippingAddress.pincode || ''}`.trim(), 60, startY + 75);
  }

  addItemsTable(orderData) {
    const startY = 320;
    const tableWidth = 475;
    const items = orderData.items || [];

    // Table header background
    this.doc
      .rect(60, startY, tableWidth, 30)
      .fill(this.colors.beige);

    // Table headers
    this.doc
      .fontSize(10)
      .fillColor(this.colors.primary)
      .text('DESCRIPTION', 80, startY + 10)
      .text('UNIT PRICE', 300, startY + 10)
      .text('QTY', 400, startY + 10)
      .text('TOTAL', 470, startY + 10);

    // Table rows
    let currentY = startY + 30;
    let subtotal = 0;

    items.forEach((item, index) => {
      const rowHeight = 25;
      const rowY = currentY + (index * rowHeight);
      
      // Calculate total for this item
      const itemTotal = (item.quantity || 1) * (item.price || 0);
      subtotal += itemTotal;

      this.doc
        .fontSize(10)
        .fillColor(this.colors.text)
        .text(item.name || item.description || 'Machine/Tool', 80, rowY + 8)
        .text(`₹${(item.price || 0).toLocaleString('en-IN')}`, 300, rowY + 8)
        .text((item.quantity || 1).toString(), 400, rowY + 8)
        .text(`₹${itemTotal.toLocaleString('en-IN')}`, 470, rowY + 8);

      // Add subtle line separator
      if (index < items.length - 1) {
        this.doc
          .strokeColor(this.colors.lightGray)
          .lineWidth(0.5)
          .moveTo(80, rowY + rowHeight - 2)
          .lineTo(520, rowY + rowHeight - 2)
          .stroke();
      }
    });

    // Store subtotal for totals section
    this.subtotal = subtotal;
    this.itemsEndY = currentY + (items.length * 25);
  }

  addTotals(orderData) {
    const startY = this.itemsEndY + 40;
    const totalPrice = orderData.totalPrice || orderData.totalAmount || this.subtotal || 0;
    const tax = Math.round(totalPrice * 0.18); // 18% GST
    const grandTotal = totalPrice;

    // Subtotal
    this.doc
      .fontSize(10)
      .fillColor(this.colors.text)
      .text('SUBTOTAL', 400, startY, { width: 100, align: 'left' })
      .text(`₹${this.subtotal.toLocaleString('en-IN')}`, 500, startY, { width: 100, align: 'right' });

    // Tax line
    this.doc
      .text('Tax', 450, startY + 20, { width: 50, align: 'right' })
      .text('18%', 500, startY + 20, { width: 100, align: 'right' });

    // Total background
    this.doc
      .rect(380, startY + 45, 155, 25)
      .fill(this.colors.beige);

    // Total amount
    this.doc
      .fontSize(12)
      .fillColor(this.colors.primary)
      .text('TOTAL', 400, startY + 52, { width: 60, align: 'left' })
      .text(`₹${grandTotal.toLocaleString('en-IN')}`, 460, startY + 52, { width: 70, align: 'right' });
  }

  addPaymentInfo() {
    const startY = 600;

    // Bank details section
    this.doc
      .fontSize(10)
      .fillColor(this.colors.primary)
      .text('BANK DETAILS', 60, startY);

    this.doc
      .fontSize(9)
      .fillColor(this.colors.text)
      .text('State Bank of India', 60, startY + 20)
      .text('Account Name: LVS Machine and Tools', 60, startY + 35)
      .text('Account No.: 38049567890', 60, startY + 50)
      .text('IFSC: SBIN0012345', 60, startY + 65)
      .text('Branch: Jamnagar Industrial Area', 60, startY + 80);

    // Thank you section
    this.doc
      .fontSize(12)
      .fillColor(this.colors.primary)
      .text('THANK YOU', 400, startY);

    // Signature area
    this.doc
      .fontSize(9)
      .fillColor(this.colors.text)
      .text('Authorized Signature', 400, startY + 40);
  }

  addFooter() {
    const footerY = 720;
    
    // Company address in footer
    this.doc
      .fontSize(8)
      .fillColor(this.colors.text)
      .text('LVS Machine and Tools • A-20, Shanker Tekri, Industrial Estate, Jamnagar - 361004, Gujarat', 60, footerY, { align: 'center' })
      .text('Phone: +91 288 2561871 • Email: lvsmachinetools@gmail.com • GST: 24XXXXXXXXXXXXXX', 60, footerY + 12, { align: 'center' });

    // Footer line
    this.doc
      .strokeColor(this.colors.beige)
      .lineWidth(1)
      .moveTo(60, footerY - 10)
      .lineTo(535, footerY - 10)
      .stroke();
  }
}

module.exports = LVSReceiptGenerator;