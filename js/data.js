const products = [
  { id: 1, name: 'Plaid Mini Skirt', price: 549, colors: ['#ffb6c1', '#b0e0e6', '#d3d3d3'], image: 'https://placehold.co/600x600/f9ecec/8a6a72?text=Plaid+Skirt' },
  { id: 2, name: 'Plaid Scrunchies (3pc)', price: 199, colors: ['#ffb6c1', '#f4c2c2', '#e6e6fa'], image: 'https://placehold.co/600x600/f9ecec/8a6a72?text=Scrunchies' },
  { id: 3, name: 'Oversized Plaid Blazer', price: 899, colors: ['#ffb6c1', '#a95c84', '#000000'], image: 'https://placehold.co/600x600/f9ecec/8a6a72?text=Blazer' },
  { id: 4, name: 'Plaid Tote Bag', price: 349, colors: ['#ffb6c1', '#c8a2c8', '#f5f5dc'], image: 'https://placehold.co/600x600/f9ecec/8a6a72?text=Tote+Bag' }
];

let orders = JSON.parse(localStorage.getItem('ambyarnsOrders')) || [
  { id: 'AMB-0001', customer: 'demo@example.com', items: 'Plaid Mini Skirt', total: 549, status: 'Pending', payment: 'gcash', receiveMode: 'pickup', pickupPlace: 'SM Fairview' }
];

function saveOrders() {
  localStorage.setItem('ambyarnsOrders', JSON.stringify(orders));
  if (typeof updateAdminBadge === 'function') updateAdminBadge();
}

window.products = products;
window.getOrders = () => orders;
window.setOrders = (newOrders) => { orders = newOrders; saveOrders(); };