function init_admin() {
  const board = document.getElementById('kanbanBoard');
  if (!board) return;
  
  board.innerHTML = '<p>Loading live orders...</p>';

  window.firebaseOnSnapshot(window.firebaseCollection(window.firebaseDB, "orders"), (snapshot) => {
    const orders = [];
    snapshot.forEach((doc) => orders.push({ firebaseId: doc.id, ...doc.data() }));

    const columns = {
      'Pending': [], 'Processing': [], 'Ready for pick up': [], 'Shipped': [], 'Completed': []
    };
    orders.forEach(o => { if(columns[o.status]) columns[o.status].push(o); });

    board.innerHTML = Object.keys(columns).map(status => `
      <div class="kanban-col">
        <h3>${status} (${columns[status].length})</h3>
        ${columns[status].map(order => `
          <div class="order-card">
            <div style="font-weight: 600; font-size: 0.85rem; margin-bottom: 4px;">${order.id}</div>
            <div style="font-size: 0.85rem; color: var(--brand-muted); margin-bottom: 8px;">
              <strong>${order.customer}</strong><br>
              ${order.items}<br>
              ₱${order.total.toFixed(2)}<br>
              ${order.receiveMode === 'pickup' ? `📍 ${order.pickupPlace}` : `🚚 ${order.courierAddress}`}
            </div>
            <select onchange="window.updateOrderStatus('${order.firebaseId}', this.value)" style="width:100%;">
              ${Object.keys(columns).map(s => `<option value="${s}" ${order.status === s ? 'selected' : ''}>Move to ${s}</option>`).join('')}
            </select>
          </div>
        `).join('') || '<p style="font-size:0.8rem; text-align:center; color:#aaa;">Empty</p>'}
      </div>
    `).join('');
  });
}

window.updateOrderStatus = async function(firebaseId, newStatus) {
  try {
    const orderRef = window.firebaseDoc(window.firebaseDB, "orders", firebaseId);
    await window.firebaseUpdateDoc(orderRef, { status: newStatus });
    window.showToast(`Order moved to ${newStatus}`);
  } catch (e) { window.showToast("Failed to update status", true); }
};

// --- ADD/DELETE PRODUCTS ---
window.openProductModal = function() {
  const name = prompt("Product Name:");
  if (!name) return;
  const price = parseFloat(prompt("Price (numbers only):"));
  if (!price) return;
  const image = prompt("Image URL (e.g., https://placehold.co/600x600):", "https://placehold.co/600x600/f9ecec/8a6a72?text=New+Item");

  const newProduct = { id: Date.now().toString(), name, price, image, colors: ['#ffb6c1'] };
  
  window.firebaseAddDoc(window.firebaseCollection(window.firebaseDB, "products"), newProduct)
    .then(() => window.showToast("Product added to database!"))
    .catch(e => window.showToast("Error adding product", true));
};

window.init_admin = init_admin;

// Auto-redirect to admin if logged in user is the admin and refreshes
window.addEventListener('firebaseReady', () => {
  window.onAuthStateChanged(window.firebaseAuth, (user) => {
    if (user && user.email === "bryce.udaundo@gmail.com" && window.location.hash === '#admin') {
      window.loadPage('admin');
    }
  });
});