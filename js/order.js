// ==========================================
// 1. SHOP PAGE & PRODUCT DETAILS
// ==========================================
function init_order() {
  const container = document.getElementById('productList');
  if (!container) return;
  
  container.innerHTML = window.products.map(p => `
    <div class="product-card" onclick="window.showProductDetail(${p.id})">
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

window.showProductDetail = function (productId) {
  const product = window.products.find(p => p.id === productId);
  const detailDiv = document.getElementById('productDetail');
  if (!detailDiv) return;

  detailDiv.style.display = 'block';
  detailDiv.innerHTML = `
    <div style="background: #fff; border: 1px solid var(--brand-border); padding: 32px; border-radius: 4px; display: flex; gap: 32px; flex-wrap: wrap;">
      <img src="${product.image}" style="width: 100%; max-width: 350px; border-radius: 4px;">
      <div style="flex: 1;">
        <h2 style="font-size: 2rem; margin-bottom: 8px;">${product.name}</h2>
        <div class="price" style="font-size: 1.5rem; color: var(--brand-muted); margin-bottom: 24px;">₱${product.price.toFixed(2)}</div>
        
        <label>Select Color</label>
        <div class="color-swatches" id="detailColors" style="margin-bottom: 24px; gap: 12px;">
          ${product.colors.map((c, idx) => `
            <span class="swatch ${idx === 0 ? 'selected' : ''}" 
                  style="background:${c}; width: 32px; height: 32px; cursor: pointer; border: ${idx === 0 ? '2px solid var(--brand-primary)' : '1px solid #ccc'};" 
                  data-color="${c}" 
                  onclick="window.selectColor(this)">
            </span>
          `).join('')}
        </div>

        <button class="btn" onclick="window.addToCart(${product.id}, '${product.name}', ${product.price})">
          <i class="fas fa-shopping-bag"></i> Add to Cart
        </button>
      </div>
    </div>
  `;
  detailDiv.scrollIntoView({ behavior: 'smooth' });
};

window.selectColor = function(el) {
  document.querySelectorAll('#detailColors .swatch').forEach(s => {
    s.style.border = '1px solid #ccc';
  });
  el.style.border = '2px solid var(--brand-primary)';
};

// ==========================================
// 2. CART LOGIC
// ==========================================
window.addToCart = function (id, name, price) {
  const selectedColorEl = document.querySelector('#detailColors .swatch[style*="border: 2px"]');
  const color = selectedColorEl ? selectedColorEl.dataset.color : '#ffb6c1';
  
  let cart = JSON.parse(localStorage.getItem('ambyarnsCart')) || [];
  cart.push({ id, name, price, color, cartId: Date.now() });
  localStorage.setItem('ambyarnsCart', JSON.stringify(cart));
  
  updateCartBadge();
  alert(`✅ Added ${name} to your cart!`);
};

function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem('ambyarnsCart')) || [];
  const badge = document.getElementById('cartBadge');
  if (badge) {
    if (cart.length > 0) {
      badge.style.display = 'inline-block';
      badge.textContent = cart.length;
    } else {
      badge.style.display = 'none';
    }
  }
}

// ==========================================
// 3. CART PAGE
// ==========================================
function init_cart() {
  const container = document.getElementById('cartItemsContainer');
  const checkoutArea = document.getElementById('cartCheckoutArea');
  const totalSpan = document.getElementById('cartTotal');
  
  if (!container) return;

  let cart = JSON.parse(localStorage.getItem('ambyarnsCart')) || [];
  
  if (cart.length === 0) {
    container.innerHTML = `<div style="text-align: center; padding: 40px; color: var(--brand-muted); border: 1px solid var(--brand-border); border-radius: 4px; background: #fff;">
      <i class="fas fa-shopping-bag" style="font-size: 3rem; color: var(--brand-border); margin-bottom: 16px;"></i>
      <p>Your cart is currently empty.</p>
      <button class="btn mt-2" onclick="window.loadPage('order')">Continue Shopping</button>
    </div>`;
    checkoutArea.style.display = 'none';
    return;
  }

  let total = 0;
  container.innerHTML = cart.map((item, index) => {
    total += item.price;
    return `
      <div style="display: flex; justify-content: space-between; align-items: center; background: #fff; padding: 24px; border: 1px solid var(--brand-border); border-radius: 4px; margin-bottom: 16px;">
        <div>
          <h4 style="font-family: 'Inter', sans-serif; margin-bottom: 4px;">${item.name}</h4>
          <p style="font-size: 0.9rem; color: var(--brand-muted);">
            Color: <span style="display:inline-block; width:14px; height:14px; background:${item.color}; border-radius:50%; border: 1px solid #ccc; vertical-align: middle;"></span>
          </p>
        </div>
        <div style="text-align: right;">
          <div style="font-weight: 600; margin-bottom: 8px;">₱${item.price.toFixed(2)}</div>
          <button onclick="window.removeFromCart(${index})" style="background: none; border: none; color: #d9534f; cursor: pointer; font-size: 0.8rem; text-decoration: underline;">Remove</button>
        </div>
      </div>
    `;
  }).join('');

  totalSpan.textContent = total.toFixed(2);
  checkoutArea.style.display = 'block';
}

window.removeFromCart = function (index) {
  let cart = JSON.parse(localStorage.getItem('ambyarnsCart')) || [];
  cart.splice(index, 1);
  localStorage.setItem('ambyarnsCart', JSON.stringify(cart));
  
  updateCartBadge();
  init_cart(); 
};

window.proceedToCheckout = function () {
  window.loadPage('order-process');
};

// ==========================================
// 4. ORDER PROCESS / CHECKOUT
// ==========================================
function init_order_process() {
  const cart = JSON.parse(localStorage.getItem('ambyarnsCart')) || [];
  const summaryDiv = document.getElementById('orderSummary');
  
  if (!summaryDiv) return;

  if (cart.length === 0) {
    summaryDiv.innerHTML = `<p>Your cart is empty. <a href="#" onclick="window.loadPage('order');return false;" style="color:var(--brand-primary); text-decoration:underline;">Return to Shop</a></p>`;
    document.getElementById('orderForm').style.display = 'none';
    return;
  }

  let grandTotal = cart.reduce((sum, item) => sum + item.price, 0);

  summaryDiv.innerHTML = `
    <div style="background: #f9ecec; padding: 24px; border-radius: 4px; margin-bottom: 32px; border: 1px solid var(--brand-border);">
      <h3 style="margin-bottom: 16px;">Order Summary</h3>
      ${cart.map(item => `
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.95rem;">
          <span>${item.name} <span style="display:inline-block; width:12px; height:12px; background:${item.color}; border-radius:50%; border: 1px solid #ccc; vertical-align: middle;"></span></span>
          <span>₱${item.price.toFixed(2)}</span>
        </div>
      `).join('')}
      <div style="border-top: 1px solid var(--brand-border); margin-top: 16px; padding-top: 16px; font-weight: 600; font-size: 1.1rem; text-align: right;">
        Total: ₱${grandTotal.toFixed(2)}
      </div>
    </div>
  `;

  document.querySelectorAll('input[name="payment"]').forEach(radio => {
    radio.addEventListener('change', function () {
      document.getElementById('gcashSection').style.display = this.value === 'gcash' ? 'block' : 'none';
    });
  });

  document.getElementById('orderForm').addEventListener('submit', function (e) {
    e.preventDefault();
    
    const itemsSummary = cart.map(i => i.name).join(', ');

    const newOrder = {
      id: 'AMB-' + Math.floor(1000 + Math.random() * 9000),
      customer: document.getElementById('contactInfo').value,
      items: itemsSummary,
      total: grandTotal,
      payment: document.querySelector('input[name="payment"]:checked').value,
      pickupPlace: document.getElementById('pickupPlace').value,
      receiveMode: document.querySelector('input[name="receiveMode"]:checked').value,
      status: 'Pending'
    };

    const currentOrders = window.getOrders();
    currentOrders.push(newOrder);
    window.setOrders(currentOrders);

    alert(`✅ Order placed successfully!\n\nOrder ID: ${newOrder.id}\nTotal: ₱${newOrder.total.toFixed(2)}\n\nWe will contact you at ${newOrder.customer}.`);
    
    localStorage.removeItem('ambyarnsCart');
    updateCartBadge();
    
    window.loadPage('home');
  });
}

window.init_order = init_order;
window.init_cart = init_cart;
window.init_order_process = init_order_process;

document.addEventListener('DOMContentLoaded', updateCartBadge);