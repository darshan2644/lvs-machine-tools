// Test Order Creation Script
// Copy and paste this into your browser console on localhost:5173

console.log('🚀 Creating test order...');

const testOrder = {
  _id: 'LVS' + Date.now(),
  orderId: 'LVS' + Date.now(),
  userId: localStorage.getItem('userId') || 'demo-user-123',
  orderStatus: 'Order Placed',
  createdAt: new Date().toISOString(),
  orderDate: new Date().toISOString(),
  items: [
    {
      productId: 'cnc-9axis',
      name: '9 Axis CNC Universal Cutting & Engraving Auto Tool Changer Machine',
      quantity: 1,
      price: 250000,
      image: '/images/cnc-9axis-main.png'
    }
  ],
  totalAmount: 250000,
  paymentMethod: 'Cash on Delivery',
  paymentStatus: 'Pending',
  customerName: 'Test Customer',
  customerEmail: 'test@example.com',
  customerPhone: '9876543210',
  shippingAddress: {
    fullName: 'Test Customer',
    address: '123 Test Street',
    city: 'Test City',
    state: 'Test State',
    pincode: '123456',
    phone: '9876543210'
  },
  estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
};

// Add to localStorage
const existingOrders = JSON.parse(localStorage.getItem('lvsOrders') || '[]');
existingOrders.push(testOrder);
localStorage.setItem('lvsOrders', JSON.stringify(existingOrders));

console.log('✅ Test order added successfully!');
console.log('Order ID:', testOrder.orderId);
console.log('Total orders in localStorage:', existingOrders.length);
console.log('Go to /orders page to see the order!');

// Dispatch order placed event to refresh orders page if open
window.dispatchEvent(new CustomEvent('orderPlaced', {
  detail: { orderId: testOrder.orderId, type: 'test' }
}));

// Show confirmation
alert(`✅ Test order ${testOrder.orderId} created! Go to Orders page to see it.`);

// Return order details
testOrder;
