function init_home() {
  const container = document.getElementById('homeNewProducts');
  if (!container) return;
  
  // Show the first 3 products as "New Arrivals"
  const newProds = window.products.slice(0, 3);
  
  container.innerHTML = newProds.map(p => `
    <div class="product-card" onclick="window.loadPage('order')">
      <div class="product-img-wrapper">
        <img src="${p.image}" alt="${p.name}">
      </div>
      <h3>${p.name}</h3>
      <div class="price">₱${p.price.toFixed(2)}</div>
      <div class="color-swatches">
        ${p.colors.map(c => `<span class="swatch" style="background:${c};"></span>`).join('')}
      </div>
    </div>
  `).join('');
}

window.init_home = init_home;