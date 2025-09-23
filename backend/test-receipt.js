const LVSReceiptGenerator = require('./services/lvsReceiptGenerator');

// Test data mimicking a real order
const testOrderData = {
  orderId: 'LVS-000123',
  createdAt: new Date(),
  customerInfo: {
    firstName: 'Rajesh',
    lastName: 'Patel',
    email: 'rajesh.patel@example.com',
    company: 'Patel Jewellery Works'
  },
  shippingAddress: {
    address: '123 Jewelry Market St',
    city: 'Rajkot',
    state: 'Gujarat',
    pincode: '360001',
    phone: '+91 98765 43210'
  },
  items: [
    {
      name: '7 Axis CNC Round Ball Cutting And Engraving Machine',
      description: 'Professional 7-axis CNC machine for round ball cutting',
      price: 250000,
      quantity: 1
    },
    {
      name: '4 Axis Pro CNC Pendant Engraving Machine',
      description: 'Precision pendant engraving machine',
      price: 165000,
      quantity: 1
    },
    {
      name: 'Hydraulic Bangle Sizing Machine',
      description: 'Professional hydraulic bangle sizing equipment',
      price: 95000,
      quantity: 2
    }
  ],
  totalAmount: 605000,
  orderStatus: 'Confirmed',
  paymentMethod: 'Bank Transfer'
};

async function testReceiptGeneration() {
  try {
    console.log('🧪 Testing LVS Receipt Generator...');
    
    const generator = new LVSReceiptGenerator();
    const pdfPath = await generator.generateReceipt(testOrderData);
    
    console.log('✅ Professional LVS receipt generated successfully!');
    console.log('📁 File saved at:', pdfPath);
    console.log('💡 Open this PDF to see your new professional receipt design');
    
  } catch (error) {
    console.error('❌ Error generating receipt:', error);
  }
}

testReceiptGeneration();