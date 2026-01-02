import { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { productsAPI, customersAPI, ordersAPI } from '../services/api';
import './SalesOrders.css';

const SalesOrders = () => {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [notification, setNotification] = useState(null);

    const [orderForm, setOrderForm] = useState({
        customer_id: '',
        lines: [{ product_id: '', quantity: 1, unit_price: 0 }],
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [ordersRes, productsRes, customersRes] = await Promise.all([
                ordersAPI.getAll(),
                productsAPI.getAll(),
                customersAPI.getAll(),
            ]);
            setOrders(ordersRes.data);
            setProducts(productsRes.data);
            setCustomers(customersRes.data);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddLine = () => {
        setOrderForm({
            ...orderForm,
            lines: [...orderForm.lines, { product_id: '', quantity: 1, unit_price: 0 }],
        });
    };

    const handleRemoveLine = (index) => {
        const newLines = orderForm.lines.filter((_, i) => i !== index);
        setOrderForm({ ...orderForm, lines: newLines });
    };

    const handleLineChange = (index, field, value) => {
        const newLines = [...orderForm.lines];
        newLines[index][field] = value;

        if (field === 'product_id') {
            const product = products.find(p => p.id === parseInt(value));
            if (product) {
                newLines[index].unit_price = parseFloat(product.price);
            }
        }

        setOrderForm({ ...orderForm, lines: newLines });
    };

    const calculateTotal = () => {
        return orderForm.lines.reduce((sum, line) => {
            return sum + (line.quantity * line.unit_price);
        }, 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const orderData = {
                customer_id: parseInt(orderForm.customer_id),
                lines: orderForm.lines.map(line => ({
                    product_id: parseInt(line.product_id),
                    quantity: parseInt(line.quantity),
                    unit_price: parseFloat(line.unit_price),
                })),
            };

            await ordersAPI.create(orderData);
            setShowModal(false);
            setOrderForm({
                customer_id: '',
                lines: [{ product_id: '', quantity: 1, unit_price: 0 }],
            });
            showNotification('Order created successfully!', 'success');
            loadData();
        } catch (error) {
            showNotification(error.response?.data?.detail || 'Failed to create order', 'error');
        }
    };

    const handleConfirmOrder = async (orderId) => {
        try {
            await ordersAPI.confirm(orderId);
            showNotification('Order confirmed successfully!', 'success');
            loadData();
        } catch (error) {
            showNotification(error.response?.data?.detail || 'Failed to confirm order', 'error');
        }
    };

    const handleCancelOrder = async (orderId) => {
        try {
            await ordersAPI.cancel(orderId);
            showNotification('Order cancelled successfully!', 'success');
            loadData();
        } catch (error) {
            showNotification(error.response?.data?.detail || 'Failed to cancel order', 'error');
        }
    };

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="sales-orders-page">
            <div className="page-header">
                <h1>Sales Orders</h1>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <Plus size={16} />
                    Create Order
                </button>
            </div>

            <div className="card">
                <table>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Total</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => {
                            const customer = customers.find(c => c.id === order.customer_id);
                            return (
                                <tr key={order.id}>
                                    <td>#SO-{order.id}</td>
                                    <td>{customer?.name || 'Unknown'}</td>
                                    <td>{new Date(order.order_date).toLocaleDateString()}</td>
                                    <td><StatusBadge status={order.status} /></td>
                                    <td>${parseFloat(order.total_amount).toFixed(2)}</td>
                                    <td>
                                        <div className="action-buttons">
                                            {order.status === 'DRAFT' && (
                                                <button
                                                    className="btn btn-success btn-sm"
                                                    onClick={() => handleConfirmOrder(order.id)}
                                                >
                                                    Confirm
                                                </button>
                                            )}
                                            {order.status === 'CONFIRMED' && (
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleCancelOrder(order.id)}
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>New Sales Order</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label className="form-label">Customer</label>
                                    <select
                                        className="form-select"
                                        value={orderForm.customer_id}
                                        onChange={(e) => setOrderForm({ ...orderForm, customer_id: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Customer...</option>
                                        {customers.map((customer) => (
                                            <option key={customer.id} value={customer.id}>
                                                {customer.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="order-lines-section">
                                    <h3>Order Lines</h3>
                                    {orderForm.lines.map((line, index) => (
                                        <div key={index} className="order-line">
                                            <div className="order-line-fields">
                                                <div className="form-group">
                                                    <label className="form-label">Product</label>
                                                    <select
                                                        className="form-select"
                                                        value={line.product_id}
                                                        onChange={(e) => handleLineChange(index, 'product_id', e.target.value)}
                                                        required
                                                    >
                                                        <option value="">Select Product...</option>
                                                        {products.map((product) => (
                                                            <option key={product.id} value={product.id}>
                                                                {product.name} (${parseFloat(product.price).toFixed(2)})
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">Quantity</label>
                                                    <input
                                                        type="number"
                                                        className="form-input"
                                                        min="1"
                                                        value={line.quantity}
                                                        onChange={(e) => handleLineChange(index, 'quantity', e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">Unit Price</label>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        className="form-input"
                                                        value={line.unit_price}
                                                        readOnly
                                                    />
                                                </div>
                                                {orderForm.lines.length > 1 && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger btn-sm remove-line-btn"
                                                        onClick={() => handleRemoveLine(index)}
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    <button type="button" className="btn btn-secondary" onClick={handleAddLine}>
                                        <Plus size={16} />
                                        Add Line
                                    </button>
                                </div>

                                <div className="order-total">
                                    <strong>Total Amount: ${calculateTotal().toFixed(2)}</strong>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Create Order
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {notification && (
                <div className={`notification ${notification.type}`}>
                    {notification.message}
                </div>
            )}
        </div>
    );
};

export default SalesOrders;
