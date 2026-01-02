import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Products API
export const productsAPI = {
    getAll: () => api.get('/products/'),
    create: (data) => api.post('/products/', data),
};

// Customers API
export const customersAPI = {
    getAll: () => api.get('/customers/'),
    create: (data) => api.post('/customers/', data),
};

// Orders API
export const ordersAPI = {
    getAll: () => api.get('/orders/'),
    getById: (id) => api.get(`/orders/${id}`),
    create: (data) => api.post('/orders/', data),
    confirm: (id) => api.post(`/orders/${id}/confirm`),
    cancel: (id) => api.post(`/orders/${id}/cancel`),
};

export default api;
