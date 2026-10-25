function init_admin() {
  renderAdminOrders();
  updateAdminBadge();
}

function renderAdminOrders() {
  const container = document.getElementById('adminOrders');
  if (!container) return;
  const orders = window.getOrders();
  
  if (orders.length === 0) {
    container.innerHTML = `<div style="text-align: center; padding: 40px; color: var(--brand-muted);"><i class="fas fa-box-open" style="font-size: 3rem; color: var(--brand-border); margin-bottom: 16px;"></i><p>No orders yet. When a customer checks out, they will appear here.</p></div>`;
    return;
  }

  container.innerHTML = orders.map(order => `
    <div class="order-card">
      <div>
        <h4 style="margin-bottom: 4px; font-family: 'Inter', sans-serif;">${order.id} · ${order.items}</h4>
        <p style="font-size: 0.9rem; color: var(--brand-muted);"><strong>Customer:</strong> ${order.customer} <br><strong>Total:</strong> ₱${order.total.toFixed(2)} <br><strong>Method:</strong> ${order.payment === 'gcash' ? 'GCash' : 'Cash'} · ${order.receiveMode === 'pickup' ? `Pick up at ${order.pickupPlace}` : 'Courier Delivery'}</p>
      </div>
      <div style="text-align: right;">
        <span class="status-badge" style="display: block; margin-bottom: 12px;">${order.status}</span>
        <select onchange="window.updateOrderStatus('${order.id}', this.value)" style="padding: 8px 12px; border-radius: 4px; border: 1px solid var(--brand-border);">
          <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
          <option value="Processing" ${order.status === 'Processing' ? 'selected' : ''}>Processing</option>
          <option value="Ready for pick up" ${order.status === 'Ready for pick up' ? 'selected' : ''}>Ready for pick up</option>
          <option value="Shipped" ${order.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
          <option value="Completed" ${order.status === 'Completed' ? 'selected' : ''}>Completed</option>
        </select>
      </div>
    </div>`).join('');
}

function updateAdminBadge() {
  const badge = document.getElementById('adminNotif');
  if (!badge) return;
  const pendingCount = window.getOrders().filter(o => o.status === 'Pending').length;
  badge.style.display = pendingCount > 0 ? 'inline-block' : 'none';
  badge.textContent = pendingCount;
}

window.updateOrderStatus = function (orderId, newStatus) {
  const orders = window.getOrders();
  const order = orders.find(o => o.id === orderId);
  if (order) {
    order.status = newStatus;
    window.setOrders(orders); 
    renderAdminOrders();
    updateAdminBadge();
    if (newStatus === 'Ready for pick up') {
      alert(`📧 EMAIL SIMULATION:\nSent to ${order.customer}:\n"Good news! Your order ${order.id} is ready for pick up at ${order.pickupPlace}."`);
    }
  }
};

window.init_admin = init_admin;