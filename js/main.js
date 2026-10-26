let isAdminLoggedIn = false;
let currentUser = null;

// --- TOAST NOTIFICATION ---
window.showToast = function(message, isError = false) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = 'position:fixed; bottom:24px; right:24px; z-index:1000; display:flex; flex-direction:column; gap:12px;';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.style.cssText = `background:#fff; border:1px solid var(--brand-border); border-left:4px solid ${isError ? '#d9534f' : 'var(--brand-primary)'}; padding:16px 24px; border-radius:4px; box-shadow:0 8px 24px rgba(0,0,0,0.1); font-size:0.9rem; font-weight:500; display:flex; align-items:center; gap:12px; animation:slideIn 0.3s ease forwards;`;
  toast.innerHTML = `<i class="fas ${isError ? 'fa-exclamation-circle' : 'fa-check-circle'}" style="color: ${isError ? '#d9534f' : 'var(--brand-primary)'}"></i> ${message}`;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 3000);
};

// --- FULL PAGE LOGIN LOGIC ---
window.openAuthPage = function() {
  if (currentUser) {
    window.firebaseSignOut(window.firebaseAuth).then(() => {
      window.showToast("Logged out successfully");
      window.loadPage('home');
    });
  } else {
    window.loadPage('login');
  }
};

window.handleLogin = async function(e) {
  e.preventDefault();
  const email = document.getElementById('authEmail').value;
  const password = document.getElementById('authPassword').value;
  try {
    await window.firebaseSignIn(window.firebaseAuth, email, password);
    window.showToast("Welcome back!");
    window.loadPage('home');
  } catch (err) {
    window.showToast("Invalid email or password", true);
  }
};

window.handleRegister = async function() {
  const email = document.getElementById('authEmail').value;
  const password = document.getElementById('authPassword').value;
  if(!email || !password) return window.showToast("Enter email and password first", true);
  try {
    await window.firebaseCreateUser(window.firebaseAuth, email, password);
    window.showToast("Account created! You are now logged in.");
    window.loadPage('home');
  } catch (err) {
    window.showToast(err.message, true);
  }
};

// --- AUTH OBSERVER ---
window.addEventListener('firebaseReady', () => {
  window.onAuthStateChanged(window.firebaseAuth, (user) => {
    currentUser = user;
    isAdminLoggedIn = !!user;
    const adminLink = document.getElementById('adminNavLink');
    const authBtn = document.getElementById('authBtn');
    
    if (user) {
      adminLink.style.display = 'block';
      authBtn.innerHTML = 'Log Out';
    } else {
      adminLink.style.display = 'none';
      authBtn.innerHTML = 'Log In';
      if (window.location.hash === '#admin') window.loadPage('home');
    }
  });
  
  // Load initial page once Firebase is ready
  window.loadPage('home');
});

// --- PAGE TEMPLATES ---
const pageTemplates = {
  home: `<section class="hero"><div class="section-title">Handmade in the Philippines</div><h1>Handmade plaid, made with love.</h1><p>Small-batch plaid apparel...</p><button class="btn" onclick="window.loadPage('order')">Shop the collection</button></section><div class="section-title">Shop</div><h2 class="section-heading">New Arrivals</h2><div class="product-grid" id="homeNewProducts"></div>`,
  
  order: `<section class="hero" style="padding: 40px 0;"><h1>Shop the Collection</h1></section><div class="product-grid" id="productList"></div><div id="productDetail" style="margin-top: 40px; display: none;"></div>`,
  
  cart: `<section class="hero" style="padding: 40px 0 20px;"><h1>Your Shopping Bag</h1></section><div style="max-width: 800px; margin: 0 auto 80px auto;"><div id="cartItemsContainer"></div><div id="cartCheckoutArea" style="margin-top: 32px; text-align: right; display: none;"><h3 style="margin-bottom: 16px;">Total: ₱<span id="cartTotal">0.00</span></h3><button class="btn" onclick="window.proceedToCheckout()">Proceed to Checkout</button></div></div>`,
  
  'order-process': `
    <section class="hero" style="padding: 40px 0 20px;"><h1>Checkout</h1></section>
    <div class="card" style="max-width: 700px; margin: 0 auto 80px auto; padding: 32px; background: #fff; border: 1px solid var(--brand-border);">
      <div id="orderSummary"></div>
      <form id="orderForm">
        <div class="form-group"><label>Email <span style="color:red">*</span></label><input type="email" id="contactInfo" required></div>
        <div class="form-group">
          <label>Mode of receiving</label>
          <div class="radio-group">
            <label><input type="radio" name="receiveMode" value="pickup" checked onchange="document.getElementById('pickupSection').style.display='block'; document.getElementById('courierSection').style.display='none';"> Pick up</label>
            <label><input type="radio" name="receiveMode" value="courier" onchange="document.getElementById('pickupSection').style.display='none'; document.getElementById('courierSection').style.display='block';"> Courier (delivery fee handled by you)</label>
          </div>
        </div>
        <div id="pickupSection"><div class="form-group"><label>Pick-up place</label><select id="pickupPlace"><option>SM Fairview</option><option>SM Caloocan</option></select></div></div>
        <div id="courierSection" style="display: none;"><div class="form-group"><label>Delivery Address <span style="color:red">*</span></label><textarea id="courierAddress" rows="2"></textarea><p style="font-size: 0.8rem; color: var(--brand-primary); margin-top: 4px;">Note: Customer handles delivery fee.</p></div></div>
        <div class="form-group"><label>Payment method</label><div class="radio-group"><label><input type="radio" name="payment" value="cash" checked> Cash</label><label><input type="radio" name="payment" value="gcash" onchange="document.getElementById('gcashSection').style.display='block'"> GCash</label></div></div>
        <div id="gcashSection" style="display: none;"><div class="qr-placeholder"><p>GCash: 0917 123 4567</p><input type="text" id="gcashProof" placeholder="Reference No."></div></div>
        <div class="form-group"><label>Optional Note</label><input type="text" id="orderNote" placeholder="Any special requests?"></div>
        <button type="submit" class="btn" style="width: 100%;">Place Order</button>
      </form>
    </div>`,
  
  about: `<section class="hero" style="padding: 60px 0;"><h1>Hi, I'm the maker.</h1></section><div style="max-width: 800px; margin: 0 auto 80px auto; text-align: center;"><p style="font-size: 1.1rem; color: var(--brand-muted);">Ambyarns started in 2022...</p></div>`,
  
  login: `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; width: 100%;">
      <div style="background: #fff; padding: 48px; border-radius: 8px; width: 100%; max-width: 450px; border: 1px solid var(--brand-border); box-shadow: 0 12px 32px rgba(217, 139, 156, 0.15);">
        <h2 style="text-align: center; margin-bottom: 8px; font-size: 2.2rem;">Welcome Back</h2>
        <p style="text-align: center; color: var(--brand-muted); margin-bottom: 32px; font-size: 0.95rem;">Log in to manage your orders</p>
        <form onsubmit="window.handleLogin(event)">
          <div class="form-group"><label>Email</label><input type="email" id="authEmail" required></div>
          <div class="form-group"><label>Password</label><input type="password" id="authPassword" required></div>
          <button type="submit" class="btn" style="width: 100%; margin-bottom: 16px;">Log In</button>
        </form>
        <div style="text-align: center; border-top: 1px solid var(--brand-border); padding-top: 20px;">
          <p style="font-size: 0.85rem; color: var(--brand-muted); margin-bottom: 8px;">Don't have an account?</p>
          <button onclick="window.handleRegister()" style="background: none; border: none; color: var(--brand-primary); font-size: 0.9rem; font-weight: 600; cursor: pointer; text-decoration: underline;">Create Admin Account</button>
        </div>
      </div>
    </div>
  `,
  
  admin: `
    <section class="hero" style="padding: 40px 0 20px;">
      <h1>Admin Dashboard</h1>
      <button class="btn mt-2" onclick="window.openProductModal()">+ Add New Product</button>
    </section>
    <div class="kanban-board" id="kanbanBoard"></div>
  `
};

function loadPage(pageId) {
  const mainContainer = document.getElementById('mainContainer');
  
  if (pageId === 'admin' && !isAdminLoggedIn) {
    window.showToast("Please log in as Admin first.", true);
    return;
  }

  mainContainer.innerHTML = pageTemplates[pageId] || '<h2>Page not found</h2>';
  document.querySelectorAll('nav a').forEach(a => a.classList.toggle('active', a.dataset.page === pageId));

  const initFn = window[`init_${pageId.replace('-', '_')}`];
  if (typeof initFn === 'function') initFn();
  
  window.scrollTo(0, 0);
}

window.loadPage = loadPage;
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', (e) => { e.preventDefault(); loadPage(link.dataset.page); });
});