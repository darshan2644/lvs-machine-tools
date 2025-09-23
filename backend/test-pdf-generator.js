const LVSReceiptGenerator = require('./services/lvsReceiptGenerator');

const generator = new LVSReceiptGenerator();

const testOrder = {
  orderId: 'TEST001',
  totalAmount: 125000,
  createdAt: new Date(),
  customerInfo: {
    firstName: 'Test',
    lastName: 'Customer'
  },
  shippingAddress: {
    address: '123 Test Street',
    city: 'Jamnagar',
    state: 'Gujarat',
    pincode: '361001'
  },
  items: [
    {
      name: '4-Axis Chain Faceting Machine',
      price: 75000,
      quantity: 1
    },
    {
      name: '7-Axis Flat Bangle Machine',
      price: 50000,
      quantity: 1
    }
  ]
};

generator.generateReceipt(testOrder)
  .then(filepath => {
    console.log('✅ PDF generated successfully:', filepath);
  })
  .catch(err => {
    console.error('❌ Error generating PDF:', err);
  });