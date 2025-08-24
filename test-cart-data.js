// Test script to add items to localStorage for testing checkout
const mockCartItems = [
  {
    _id: '68a4a5d12c779915538996a7',
    name: '9 Axis CNC Universal Cutting & Engraving Auto Tool Changer Machine',
    price: 250000,
    image: '/images/cnc-9axis-main.png',
    quantity: 1
  },
  {
    _id: '68a4a5d12c779915538996a8',
    name: 'Bangle CNC Cutting Machine',
    price: 105000,
    image: '/images/bangle-cnc-main.png',
    quantity: 2
  }
];

// Run this in browser console to add test items to cart
localStorage.setItem('lvsCartItems', JSON.stringify(mockCartItems));
window.dispatchEvent(new CustomEvent('cartUpdated'));
console.log('Test cart items added! Navigate to /checkout to test.');
