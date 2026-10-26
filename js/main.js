// Set your desired admin password here
const ADMIN_PASSWORD = "ambyarns123"; 
let isAdminLoggedIn = false;

const pageTemplates = {
  home: `
    <section class="hero">
      <div class="section-title">Handmade in the Philippines</div>
      <h1>Handmade crochet items, made with love.</h1>
      <p>Cute keychains, accessories & pretty things — crafted for people who love soft, aesthetic things.</p>
      <button class="btn" onclick="window.loadPage('order')">Shop the collection</button>
    </section>
    <div class="card" style="margin: 0 auto 40px; max-width: 800px; text-align: center; background: #ffd1d1; border: 1px solid var(--brand-border); padding: 32px; border-radius: 4px;">
      <div class="section-title">📢 Announcements</div>
      <p><strong>New booth on November 4, at National University - Manila!</strong> Come visit for exclusive items and free stickers. ^^</p>
      <p class="mt-2" style="color:#8a6a72;">📦 New crocheted flowers just dropped — limited stock. Order online or pick up!</p>
    </div>
    <div class="section-title">Shop</div>
    <h2 class="section-heading">New Arrivals</h2>
    <div class="product-grid" id="homeNewProducts"></div>
    <div class="features">
      <div class="feature"><i class="fas fa-heart"></i><h4>Handmade with Love</h4><p>Every piece is crocheted and finished by hand, one at a time.</p></div>
      <div class="feature"><i class="fas fa-star"></i><h4>Small-Batch Quality</h4><p>Limited runs mean more attention to detail on every item.</p></div>
      <div class="feature"><i class="fas fa-tag"></i><h4>Fair Prices</h4><p>Lowest prices exclusively on our website, always.</p></div>
    </div>
    <div class="reviews-section">
      <div class="section-title">Reviews</div>
      <h2 class="section-heading">What customers say</h2>
      <div class="reviews-grid">
        <div class="review-card"><div class="stars">★★★★★</div><p>“The quality is amazing! The pink plaid skirt is so cute and the fit is perfect.”</p><div class="reviewer">— Mia, Verified Buyer</div></div>
        <div class="review-card"><div class="stars">★★★★★</div><p>“Super aesthetic packaging, you can feel the love. Thank you!”</p><div class="reviewer">— Bianca, Verified Buyer</div></div>
      </div>
    </div>
  `,
  order: `
    <section class="hero" style="padding: 40px 0;"><h1>Shop the Collection</h1></section>
    <div class="product-grid" id="productList"></div>
    <div id="productDetail" style="margin-top: 40px; display: none;"></div>
  `,
  cart: `
    <section class="hero" style="padding: 40px 0 20px;"><h1>Your Shopping Bag</h1></section>
    <div style="max-width: 800px; margin: 0 auto 80px auto;">
      <div id="cartItemsContainer"></div>
      <div id="cartCheckoutArea" style="margin-top: 32px; text-align: right; display: none;">
        <h3 style="margin-bottom: 16px;">Total: ₱<span id="cartTotal">0.00</span></h3>
        <button class="btn" onclick="window.proceedToCheckout()">Proceed to Checkout</button>
      </div>
    </div>
  `,
  'order-process': `
    <section class="hero" style="padding: 40px 0 20px;"><h1>Checkout</h1></section>
    <div class="card" style="max-width: 700px; margin: 0 auto 80px auto; padding: 32px; background: #fff; border: 1px solid var(--brand-border);">
      <div id="orderSummary"></div>
      <form id="orderForm">
        <div class="form-group"><label>Email or Facebook link</label><input type="text" id="contactInfo" required></div>
        <div class="form-group"><label>Payment method</label><div class="radio-group"><label><input type="radio" name="payment" value="cash" checked> Cash</label><label><input type="radio" name="payment" value="gcash"> GCash</label></div></div>
        <div id="gcashSection" style="display: none;"><div class="qr-placeholder"><i class="fas fa-qrcode"></i><p>Scan QR: <strong>0917 123 4567</strong></p></div><div class="form-group"><label>Ref Number</label><input type="text" id="gcashProof"></div></div>
        <div class="form-group"><label>Pick-up place</label><select id="pickupPlace"><option>SM Fairview</option><option>SM Caloocan</option></select></div>
        <div class="form-group"><label>Mode of receiving</label><div class="radio-group"><label><input type="radio" name="receiveMode" value="pickup" checked> Pick up</label><label><input type="radio" name="receiveMode" value="courier"> Courier</label></div></div>
        <button type="submit" class="btn" style="width: 100%;">Place Order</button>
      </form>
    </div>
  `,
  about: `
    <section class="hero" style="padding: 60px 0;"><h1>Hi, I'm Amber</h1></section>
    <div style="max-width: 800px; margin: 0 auto 80px auto; text-align: center;">
      <p style="font-size: 1.1rem; color: var(--brand-muted); margin-bottom: 24px;">Ambyarns started in November 1, 2025 as a tiny passion project. Every piece is handmade with love in my small room.</p>
      <div style="font-family: 'Cormorant Garamond', serif; font-size: 1.8rem; color: var(--brand-primary);">Love, Ambyarns <i class="fas fa-heart"></i></div>
    </div>
  `,
  admin: `
    <section class="hero" style="padding: 40px 0 20px;"><h1>Admin Dashboard</h1></section>
    <div id="adminOrders" style="max-width: 900px; margin: 0 auto 80px auto;"></div>
  `
};

function loadPage(pageId) {
  const mainContainer = document.getElementById('mainContainer');

  // Check if they are trying to access Admin but aren't logged in
  if (pageId === 'admin' && !isAdminLoggedIn) {
    mainContainer.innerHTML = `
      <div style="max-width: 400px; margin: 100px auto; padding: 40px; background: #fff; border: 1px solid var(--brand-border); border-radius: 4px; text-align: center;">
        <i class="fas fa-lock" style="font-size: 2.5rem; color: var(--brand-primary); margin-bottom: 20px;"></i>
        <h2 style="margin-bottom: 10px;">Admin Access</h2>
        <p style="color: var(--brand-muted); margin-bottom: 24px; font-size: 0.9rem;">Only the admin can access this section.</p>
        <input type="password" id="adminPasswordInput" placeholder="Enter password" style="width: 100%; margin-bottom: 16px; text-align: center;">
        <button class="btn" style="width: 100%;" onclick="window.checkAdminPass()">Login</button>
        <p id="loginError" style="color: #d9534f; font-size: 0.85rem; margin-top: 12px; display: none;">Incorrect password</p>
      </div>
    `;
    return; // Stop loading the rest of the page
  }

  mainContainer.innerHTML = pageTemplates[pageId] || '<h2>Page not found</h2>';

  // Add a logout button if they are on the admin page
  if (pageId === 'admin' && isAdminLoggedIn) {
    const logoutBtn = document.createElement('div');
    logoutBtn.style.cssText = 'text-align: center; margin-bottom: 32px;';
    logoutBtn.innerHTML = `<button class="btn" style="background: transparent; color: #d9534f; border: 1px solid #d9534f;" onclick="window.adminLogout()">Log Out</button>`;
    mainContainer.prepend(logoutBtn);
  }

  document.querySelectorAll('nav a').forEach(a => {
    a.classList.toggle('active', a.dataset.page === pageId);
  });

  const initFn = window[`init_${pageId.replace('-', '_')}`];
  if (typeof initFn === 'function') initFn();
  
  window.scrollTo(0, 0);
}

window.checkAdminPass = function() {
  const input = document.getElementById('adminPasswordInput').value;
  if (input === ADMIN_PASSWORD) {
    isAdminLoggedIn = true;
    loadPage('admin');
  } else {
    document.getElementById('loginError').style.display = 'block';
  }
};

window.adminLogout = function() {
  isAdminLoggedIn = false;
  loadPage('home');
};

document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    loadPage(link.dataset.page);
  });
});

window.loadPage = loadPage;
document.addEventListener('DOMContentLoaded', () => loadPage('home'));