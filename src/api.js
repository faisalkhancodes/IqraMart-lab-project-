import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

// Attach token to every request if present
API.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Products
export const getProducts = (params) => API.get('/products', { params });
export const getProduct  = (id)     => API.get(`/products/${id}`);
export const createProduct = (data) => API.post('/products', data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id)   => API.delete(`/products/${id}`);

// Auth
export const register = (data) => API.post('/auth/register', data);
export const login    = (data) => API.post('/auth/login', data);
export const getMe    = ()     => API.get('/auth/me');

// Orders
export const placeOrder    = (data) => API.post('/orders', data);
export const getMyOrders   = ()     => API.get('/orders/my');
export const getAllOrders   = ()     => API.get('/orders');
export const updateOrderStatus = (id, status) => API.put(`/orders/${id}`, { status });

export default API;
