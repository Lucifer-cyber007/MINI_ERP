// API Base URL
const API_BASE = 'http://localhost:8000';

// State
let products = [];
let customers = [];
let orders = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initForms();
    loadAllData();
});

// Tab Navigation
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.tab;

            // Update active states
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            document.getElementById(tabName).classList.add('active');

            // Reload data when switching tabs
            if (tabName === 'products') loadProducts();
            if (tabName === 'customers') loadCustomers();
            if (tabName === 'orders') loadOrders();
        });
    });
}

// Form Handlers
function initForms() {
    document.getElementById('productForm').addEventListener('submit', handleProductSubmit);
    document.getElementById('customerForm').addEventListener('submit', handleCustomerSubmit);
    document.getElementById('orderForm').addEventListener('submit', handleOrderSubmit);
    document.getElementById('addLineBtn').addEventListener('click', addOrderLine);
}

// Load All Data
async function loadAllData() {
    await loadProducts();
    await loadCustomers();
    await loadOrders();
}

// ============ PRODUCTS ============
async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE}/products/`);
        products = await response.json();
        renderProducts();
        updateProductDropdowns();
    } catch (error) {
        showNotification('Failed to load products', 'error');
    }
}

function renderProducts() {
    const container = document.getElementById('productList');

    if (products.length === 0) {
        container.innerHTML = '<p style="color: var(--text-secondary);">No products yet. Add one above!</p>';
        return;
    }

    container.innerHTML = products.map(product => `
        <div class="data-card">
            <h4>${product.name}</h4>
            <p><strong>Price:</strong> $${parseFloat(product.price).toFixed(2)}</p>
            <p><strong>Stock:</strong> ${product.stock_quantity} units</p>
            <p><strong>Status:</strong> ${product.is_active ? '✅ Active' : '❌ Inactive'}</p>
        </div>
    `).join('');
}

async function handleProductSubmit(e) {
    e.preventDefault();

    const productData = {
        name: document.getElementById('productName').value,
        price: parseFloat(document.getElementById('productPrice').value),
        stock_quantity: parseInt(document.getElementById('productStock').value),
        is_active: true
    };

    try {
        const response = await fetch(`${API_BASE}/products/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
        });

        if (response.ok) {
            showNotification('Product added successfully!', 'success');
            e.target.reset();
            await loadProducts();
        } else {
            showNotification('Failed to add product', 'error');
        }
    } catch (error) {
        showNotification('Error: ' + error.message, 'error');
    }
}

// ============ CUSTOMERS ============
async function loadCustomers() {
    try {
        const response = await fetch(`${API_BASE}/customers/`);
        customers = await response.json();
        renderCustomers();
        updateCustomerDropdown();
    } catch (error) {
        showNotification('Failed to load customers', 'error');
    }
}

function renderCustomers() {
    const container = document.getElementById('customerList');

    if (customers.length === 0) {
        container.innerHTML = '<p style="color: var(--text-secondary);">No customers yet. Add one above!</p>';
        return;
    }

    container.innerHTML = customers.map(customer => `
        <div class="data-card">
            <h4>${customer.name}</h4>
            <p><strong>Email:</strong> ${customer.email || 'N/A'}</p>
            <p><strong>Phone:</strong> ${customer.phone || 'N/A'}</p>
        </div>
    `).join('');
}

async function handleCustomerSubmit(e) {
    e.preventDefault();

    const customerData = {
        name: document.getElementById('customerName').value,
        email: document.getElementById('customerEmail').value || null,
        phone: document.getElementById('customerPhone').value || null
    };

    try {
        const response = await fetch(`${API_BASE}/customers/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(customerData)
        });

        if (response.ok) {
            showNotification('Customer added successfully!', 'success');
            e.target.reset();
            await loadCustomers();
        } else {
            showNotification('Failed to add customer', 'error');
        }
    } catch (error) {
        showNotification('Error: ' + error.message, 'error');
    }
}

// ============ ORDERS ============
async function loadOrders() {
    try {
        const response = await fetch(`${API_BASE}/orders/`);
        orders = await response.json();
        renderOrders();
    } catch (error) {
        showNotification('Failed to load orders', 'error');
    }
}

function renderOrders() {
    const container = document.getElementById('orderList');

    if (orders.length === 0) {
        container.innerHTML = '<p style="color: var(--text-secondary);">No orders yet. Create one above!</p>';
        return;
    }

    container.innerHTML = orders.map(order => {
        const customer = customers.find(c => c.id === order.customer_id);
        const statusClass = order.status.toLowerCase();

        return `
            <div class="data-card">
                <h4>Order #${order.id}</h4>
                <p><strong>Customer:</strong> ${customer ? customer.name : 'Unknown'}</p>
                <p><strong>Date:</strong> ${new Date(order.order_date).toLocaleString()}</p>
                <p><strong>Total:</strong> $${parseFloat(order.total_amount).toFixed(2)}</p>
                <p><strong>Status:</strong> <span class="status-badge status-${statusClass}">${order.status}</span></p>
                <p><strong>Items:</strong> ${order.lines.length} product(s)</p>
                
                <div class="actions">
                    ${order.status === 'DRAFT' ?
                `<button class="btn btn-success btn-sm" onclick="confirmOrder(${order.id})">✓ Confirm Order</button>` : ''}
                    ${order.status === 'CONFIRMED' ?
                `<button class="btn btn-danger btn-sm" onclick="cancelOrder(${order.id})">✗ Cancel Order</button>` : ''}
                </div>
            </div>
        `;
    }).join('');
}

async function handleOrderSubmit(e) {
    e.preventDefault();

    const customerId = parseInt(document.getElementById('orderCustomer').value);
    const lines = collectOrderLines();

    if (lines.length === 0) {
        showNotification('Please add at least one product line', 'error');
        return;
    }

    const orderData = {
        customer_id: customerId,
        lines: lines
    };

    try {
        const response = await fetch(`${API_BASE}/orders/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        if (response.ok) {
            showNotification('Order created successfully!', 'success');
            e.target.reset();
            document.getElementById('orderLinesContainer').innerHTML = '';
            document.getElementById('orderTotal').textContent = '0.00';
            await loadOrders();
        } else {
            const error = await response.json();
            showNotification('Failed to create order: ' + (error.detail || 'Unknown error'), 'error');
        }
    } catch (error) {
        showNotification('Error: ' + error.message, 'error');
    }
}

function addOrderLine() {
    const container = document.getElementById('orderLinesContainer');
    const lineId = Date.now();

    const lineHTML = `
        <div class="order-line" data-line-id="${lineId}">
            <div class="order-line-fields">
                <div class="form-group">
                    <label>Product</label>
                    <select class="line-product" required>
                        <option value="">-- Select Product --</option>
                        ${products.map(p => `<option value="${p.id}" data-price="${p.price}">${p.name} ($${parseFloat(p.price).toFixed(2)})</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>Quantity</label>
                    <input type="number" class="line-quantity" min="1" value="1" required>
                </div>
                <div class="form-group">
                    <label>Unit Price</label>
                    <input type="number" class="line-price" step="0.01" readonly>
                </div>
                <button type="button" class="btn btn-danger btn-sm" onclick="removeOrderLine(${lineId})">Remove</button>
            </div>
        </div>
    `;

    container.insertAdjacentHTML('beforeend', lineHTML);

    // Add event listeners
    const line = container.querySelector(`[data-line-id="${lineId}"]`);
    const productSelect = line.querySelector('.line-product');
    const qtyInput = line.querySelector('.line-quantity');
    const priceInput = line.querySelector('.line-price');

    productSelect.addEventListener('change', (e) => {
        const selectedOption = e.target.options[e.target.selectedIndex];
        const price = selectedOption.dataset.price || 0;
        priceInput.value = parseFloat(price).toFixed(2);
        updateOrderTotal();
    });

    qtyInput.addEventListener('input', updateOrderTotal);
}

function removeOrderLine(lineId) {
    document.querySelector(`[data-line-id="${lineId}"]`).remove();
    updateOrderTotal();
}

function collectOrderLines() {
    const lines = [];
    document.querySelectorAll('.order-line').forEach(line => {
        const productId = parseInt(line.querySelector('.line-product').value);
        const quantity = parseInt(line.querySelector('.line-quantity').value);
        const unitPrice = parseFloat(line.querySelector('.line-price').value);

        if (productId && quantity && unitPrice) {
            lines.push({ product_id: productId, quantity, unit_price: unitPrice });
        }
    });
    return lines;
}

function updateOrderTotal() {
    const lines = collectOrderLines();
    const total = lines.reduce((sum, line) => sum + (line.quantity * line.unit_price), 0);
    document.getElementById('orderTotal').textContent = total.toFixed(2);
}

async function confirmOrder(orderId) {
    if (!confirm('Confirm this order? This will reduce inventory stock.')) return;

    try {
        const response = await fetch(`${API_BASE}/orders/${orderId}/confirm`, {
            method: 'POST'
        });

        if (response.ok) {
            showNotification('Order confirmed! Stock updated.', 'success');
            await loadOrders();
            await loadProducts();
        } else {
            const error = await response.json();
            showNotification('Failed to confirm: ' + error.detail, 'error');
        }
    } catch (error) {
        showNotification('Error: ' + error.message, 'error');
    }
}

async function cancelOrder(orderId) {
    if (!confirm('Cancel this order? This will restore inventory stock.')) return;

    try {
        const response = await fetch(`${API_BASE}/orders/${orderId}/cancel`, {
            method: 'POST'
        });

        if (response.ok) {
            showNotification('Order cancelled! Stock restored.', 'success');
            await loadOrders();
            await loadProducts();
        } else {
            const error = await response.json();
            showNotification('Failed to cancel: ' + error.detail, 'error');
        }
    } catch (error) {
        showNotification('Error: ' + error.message, 'error');
    }
}

// ============ HELPERS ============
function updateCustomerDropdown() {
    const select = document.getElementById('orderCustomer');
    select.innerHTML = '<option value="">-- Select Customer --</option>' +
        customers.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
}

function updateProductDropdowns() {
    // Update all product dropdowns in order lines
    document.querySelectorAll('.line-product').forEach(select => {
        const currentValue = select.value;
        select.innerHTML = '<option value="">-- Select Product --</option>' +
            products.map(p => `<option value="${p.id}" data-price="${p.price}">${p.name} ($${parseFloat(p.price).toFixed(2)})</option>`).join('');
        select.value = currentValue;
    });
}

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type} show`;

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}
