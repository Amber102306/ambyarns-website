let products = [];

window.addEventListener('firebaseReady', () => {
  window.firebaseOnSnapshot(window.firebaseCollection(window.firebaseDB, "products"), (snapshot) => {
    products = [];
    snapshot.forEach(doc => products.push({ id: doc.id, ...doc.data() }));
    
    // If database is empty on first load, add dummy products
    if (products.length === 0 && !localStorage.getItem('seeded')) {
      localStorage.setItem('seeded', 'true');
      const seedData = [
        { name: 'Plaid Mini Skirt', price: 549, colors: ['#ffb6c1', '#b0e0e6'], image: 'https://placehold.co/600x600/f9ecec/8a6a72?text=Skirt' },
        { name: 'Plaid Scrunchies', price: 199, colors: ['#ffb6c1'], image: 'https://placehold.co/600x600/f9ecec/8a6a72?text=Scrunchies' }
      ];
      seedData.forEach(p => window.firebaseAddDoc(window.firebaseCollection(window.firebaseDB, "products"), p));
    }
    window.products = products;
    if (document.getElementById('productList')) window.init_order();
    if (document.getElementById('homeNewProducts')) window.init_home();
  });
});