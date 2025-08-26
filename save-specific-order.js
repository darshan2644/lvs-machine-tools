// Save specific order to localStorage
const orderToSave = {
  _id: 'LVS898042TPQB1O',
  orderId: 'LVS898042TPQB1O',
  userId: localStorage.getItem('userId') || 'demo-user-123',
  orderStatus: 'Order Placed',
  createdAt: new Date().toISOString(),
  items: [
    {
      productId: 'cnc-9axis',
      name: '9 Axis CNC Universal Cutting & Engraving Auto Tool Changer Machine',
      quantity: 1,
      price: 105000,
      image: '/images/cnc-9axis-main.png'
    }
  ],
  totalAmount: 123900,
  subtotal: 105000,
  tax: 18900,
  shipping: 0,
  paymentMethod: 'Cash on Delivery',
  paymentStatus: 'Pending',
  shippingAddress: {},
  billingAddress: {}
};

// Save to localStorage
const existingOrders = JSON.parse(localStorage.getItem('lvsOrders') || '[]');
const filteredOrders = existingOrders.filter(order => 
  order.orderId !== orderToSave.orderId && order._id !== orderToSave._id
);
filteredOrders.push(orderToSave);
localStorage.setItem('lvsOrders', JSON.stringify(filteredOrders));

console.log('✅ Order LVS898042TPQB1O saved to localStorage!');
console.log('Saved order:', orderToSave);
