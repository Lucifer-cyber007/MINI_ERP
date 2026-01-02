import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, TrendingUp, AlertCircle } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import StatusBadge from '../components/StatusBadge';
import { productsAPI, customersAPI, ordersAPI } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [productsRes, customersRes, ordersRes] = await Promise.all([
                productsAPI.getAll(),
                customersAPI.getAll(),
                ordersAPI.getAll(),
            ]);
            setProducts(productsRes.data);
            setCustomers(customersRes.data);
            setOrders(ordersRes.data);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const lowStockProducts = products.filter(p => p.stock_quantity < 10);
    const recentOrders = orders.slice(0, 5);

    const handleConfirmOrder = async (orderId) => {
        try {
            await ordersAPI.confirm(orderId);
            loadData();
        } catch (error) {
            alert(error.response?.data?.detail || 'Failed to confirm order');
        }
    };

    const handleCancelOrder = async (orderId) => {
        try {
            await ordersAPI.cancel(orderId);
            loadData();
        } catch (error) {
            alert(error.response?.data?.detail || 'Failed to cancel order');
        }
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>Dashboard Overview</h1>
            </div>

            <div className="metrics-grid">
                <MetricCard
                    title="Total Products"
                    value={products.length}
                    change={{ text: '12% new this month', type: 'positive', icon: '↗' }}
                />
                <MetricCard
                    title="Total Customers"
                    value={customers.length}
                    change={{ text: '5% increase', type: 'positive', icon: '↗' }}
                />
                <MetricCard
                    title="Total Sales Orders"
                    value={orders.length}
                    change={{ text: 'High volume', type: 'positive', icon: '↗' }}
                    variant="success"
                />
                <MetricCard
                    title="Low Stock Items"
                    value={lowStockProducts.length}
                    change={{ text: 'Action needed', type: 'negative', icon: '⚠' }}
                    variant="warning"
                />
            </div>

            <div className="dashboard-section">
                <div className="section-header">
                    <h2>Recent Sales Orders</h2>
                    <button className="btn btn-primary" onClick={() => navigate('/orders')}>
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
                                <th>Total Amount</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map((order) => {
                                const customer = customers.find(c => c.id === order.customer_id);
                                return (
                                    <tr key={order.id}>
                                        <td>#{order.id}</td>
                                        <td>{customer?.name || 'Unknown'}</td>
                                        <td>{new Date(order.order_date).toLocaleDateString()}</td>
                                        <td>${parseFloat(order.total_amount).toFixed(2)}</td>
                                        <td><StatusBadge status={order.status} /></td>
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
                                                <button className="btn btn-secondary btn-sm" onClick={() => navigate('/orders')}>
                                                    View
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="dashboard-section">
                <div className="section-header">
                    <h2>Inventory Alerts (Low Stock)</h2>
                    <button className="btn btn-secondary" onClick={() => navigate('/products')}>
                        View All Products
                    </button>
                </div>

                <div className="card">
                    <table>
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>SKU</th>
                                <th>Price</th>
                                <th>Stock Quantity</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lowStockProducts.map((product) => (
                                <tr key={product.id}>
                                    <td>{product.name}</td>
                                    <td>SKU-{product.id}</td>
                                    <td>${parseFloat(product.price).toFixed(2)}</td>
                                    <td className="text-danger">{product.stock_quantity} units</td>
                                    <td>
                                        <span className={`status-badge ${product.stock_quantity === 0 ? 'status-cancelled' : 'status-draft'}`}>
                                            {product.stock_quantity === 0 ? 'Out of Stock' : 'Low Stock'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {lowStockProducts.length === 0 && (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                                        All products have sufficient stock
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
