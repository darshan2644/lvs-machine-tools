// Script to clear all orders from localStorage
console.log('🗑️ Clearing all orders...');

// Clear localStorage orders
if (typeof localStorage !== 'undefined') {
  localStorage.removeItem('lvsOrders');
  console.log('✅ localStorage orders cleared');
} else {
  console.log('ℹ️ localStorage not available in this environment');
}

console.log('🎯 Orders clearing complete!');
