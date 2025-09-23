const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

class LVSReceiptGenerator {
  constructor() {
    this.doc = null;
    this.colors = {
      primary: '#1f2937',
      secondary: '#6b7280',
      accent: '#0891b2',
      lightGray: '#f3f4f6',
      white: '#ffffff',
      black: '#000000'
    };
    this.pageWidth = 595;
    this.pageHeight = 842;
    this.margin = 50;
  }

  generateReceipt(orderData) {
    return new Promise((resolve, reject) => {
      try {
        this.doc = new PDFDocument({ 
          margin: this.margin,
          size: 'A4'
        });
        
        const tempDir = path.join(__dirname, '..', 'temp');
        if (!fs.existsSync(tempDir)) {
          fs.mkdirSync(tempDir, { recursive: true });
        }
        
        const filename = `lvs_invoice_${orderData.orderId || 'order_' + Date.now()}.pdf`;
        const filepath = path.join(tempDir, filename);
        
        this.doc.pipe(fs.createWriteStream(filepath));
        
        this.addHeader();
        this.addInvoiceInfo(orderData);
        this.addBillingSection(orderData);
        this.addItemsTable(orderData);
        this.addTotals(orderData);
        this.addNotes();
        this.addFooter();
        
        this.doc.end();
        
        this.doc.on('end', () => {
          resolve(filepath);
        });
        
      } catch (error) {
        reject(error);
      }
    });
  }

  addHeader() {
    this.doc
      .rect(0, 0, this.pageWidth, 60)
      .fill(this.colors.accent);

    this.doc
      .save()
      .translate(70, 30)
      .rotate(45)
      .rect(-10, -10, 20, 20)
      .fill(this.colors.white)
      .restore();

    this.doc
      .fontSize(8)
      .fillColor(this.colors.accent)
      .text('LVS', 65, 27);

    this.doc
      .fontSize(9)
      .fillColor(this.colors.white)
      .text('LVS Machine and Tools', this.pageWidth - 200, 20, { align: 'right', width: 150 })
      .text('A-20, Shanker Tekri, Industrial Estate', this.pageWidth - 200, 35, { align: 'right', width: 150 })
      .text('Jamnagar - 361004, Gujarat', this.pageWidth - 200, 48, { align: 'right', width: 150 });

    this.doc
      .fontSize(28)
      .fillColor(this.colors.primary)
      .text('Invoice', this.margin, 100);
  }

  addInvoiceInfo(orderData) {
    const rightX = this.pageWidth - 150;
    const startY = 100;

    this.doc
      .fontSize(10)
      .fillColor(this.colors.primary)
      .text('INVOICE #', rightX, startY, { continued: true })
      .fillColor(this.colors.secondary)
      .text(`  ${orderData.orderId || '000001'}`, { align: 'left' });

    this.doc
      .fillColor(this.colors.primary)
      .text('DATE', rightX, startY + 20, { continued: true })
      .fillColor(this.colors.secondary)
      .text(`  ${new Date(orderData.createdAt || Date.now()).toLocaleDateString('en-GB')}`, { align: 'left' });

    this.doc
      .fillColor(this.colors.primary)
      .text('DUE DATE', rightX, startY + 40, { continued: true })
      .fillColor(this.colors.secondary)
      .text(`  ${new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString('en-GB')}`, { align: 'left' });

    this.doc
      .fillColor(this.colors.primary)
      .text('INVOICE TOTAL', rightX, startY + 60, { continued: true })
      .fillColor(this.colors.secondary)
      .text(`  ₹${(orderData.totalAmount || 0).toLocaleString('en-IN')}`, { align: 'left' });
  }

  addBillingSection(orderData) {
    const startY = 200;
    
    this.doc
      .fontSize(10)
      .fillColor(this.colors.primary)
      .text('BILL TO:', this.margin, startY);

    const customerInfo = orderData.customerInfo || {};
    const shippingAddress = orderData.shippingAddress || {};
    
    this.doc
      .fontSize(11)
      .fillColor(this.colors.primary)
      .text(`${customerInfo.firstName || ''} ${customerInfo.lastName || ''}`.trim() || 'Valued Customer', this.margin, startY + 20);

    if (customerInfo.company) {
      this.doc
        .fontSize(10)
        .fillColor(this.colors.secondary)
        .text(customerInfo.company, this.margin, startY + 40);
    }

    this.doc
      .fontSize(10)
      .fillColor(this.colors.secondary)
      .text(`${shippingAddress.address || 'Address'}`, this.margin, startY + 60)
      .text(`${shippingAddress.city || 'City'}, ${shippingAddress.state || 'State'}`, this.margin, startY + 75)
      .text(`${shippingAddress.pincode || 'Pincode'}`, this.margin, startY + 90);
  }

  addItemsTable(orderData) {
    const startY = 320;
    const tableWidth = this.pageWidth - (2 * this.margin);
    const items = orderData.items || [];

    this.doc
      .rect(this.margin, startY, tableWidth, 30)
      .fill(this.colors.lightGray);

    this.doc
      .fontSize(10)
      .fillColor(this.colors.primary)
      .text('ITEMS', this.margin + 10, startY + 10)
      .text('DESCRIPTION', this.margin + 80, startY + 10)
      .text('QUANTITY', this.pageWidth - 200, startY + 10)
      .text('PRICE', this.pageWidth - 130, startY + 10)
      .text('TAX', this.pageWidth - 80, startY + 10)
      .text('AMOUNT', this.pageWidth - 50, startY + 10, { align: 'right', width: 40 });

    let currentY = startY + 30;
    let subtotal = 0;

    items.forEach((item, index) => {
      const rowHeight = 30;
      const rowY = currentY + (index * rowHeight);
      
      if (index % 2 === 0) {
        this.doc
          .rect(this.margin, rowY, tableWidth, rowHeight)
          .fill('#fafafa');
      }

      const itemPrice = item.price || 0;
      const quantity = item.quantity || 1;
      const itemTotal = itemPrice * quantity;
      subtotal += itemTotal;

      const productName = item.name || item.productName || item.description || 'Machine/Tool';
      
      this.doc
        .fontSize(9)
        .fillColor(this.colors.primary)
        .text(`Item ${index + 1}`, this.margin + 10, rowY + 10)
        .text(productName, this.margin + 80, rowY + 10, { width: 200 })
        .text(quantity.toString(), this.pageWidth - 200, rowY + 10)
        .text(`₹${itemPrice.toLocaleString('en-IN')}`, this.pageWidth - 130, rowY + 10)
        .text('0%', this.pageWidth - 80, rowY + 10)
        .text(`₹${itemTotal.toLocaleString('en-IN')}`, this.pageWidth - 50, rowY + 10, { align: 'right', width: 40 });
    });

    this.subtotal = subtotal;
    this.itemsEndY = currentY + (items.length * 30);
  }

  addTotals(orderData) {
    const startY = this.itemsEndY + 40;
    const totalAmount = orderData.totalAmount || this.subtotal || 0;

    const totalsX = this.pageWidth - 200;
    
    this.doc
      .fontSize(18)
      .fillColor(this.colors.primary)
      .text('TOTAL', totalsX, startY, { align: 'right', width: 100 })
      .fontSize(24)
      .text(`₹${totalAmount.toLocaleString('en-IN')}`, totalsX, startY + 25, { align: 'right', width: 150 });
  }

  addNotes() {
    const notesY = this.pageHeight - 200;
    
    this.doc
      .fontSize(10)
      .fillColor(this.colors.primary)
      .text('NOTES:', this.margin, notesY);

    this.doc
      .fontSize(9)
      .fillColor(this.colors.secondary)
      .text('Thank you for your business with LVS Machine and Tools.', this.margin, notesY + 20)
      .text('For any queries regarding this invoice, please contact us.', this.margin, notesY + 35);
  }

  addFooter() {
    const footerY = this.pageHeight - 120;
    
    this.doc
      .rect(0, footerY, this.pageWidth, 80)
      .fill('#ecfeff');

    this.doc
      .fontSize(8)
      .fillColor(this.colors.secondary)
      .text('Powered by LVS Machine Tools', this.margin, footerY + 20, { align: 'center', width: this.pageWidth - (2 * this.margin) })
      .text('This invoice was generated with our advanced invoicing system.', this.margin, footerY + 35, { align: 'center', width: this.pageWidth - (2 * this.margin) })
      .text('For support, please visit our website or contact customer service.', this.margin, footerY + 50, { align: 'center', width: this.pageWidth - (2 * this.margin) });
  }
}

module.exports = LVSReceiptGenerator;