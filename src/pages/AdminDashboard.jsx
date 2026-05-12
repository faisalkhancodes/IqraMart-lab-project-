import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProducts, deleteProduct, getAllOrders, updateOrderStatus } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered'];

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('products');
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [prodRes, ordRes] = await Promise.all([getProducts(), getAllOrders()]);
        setProducts(prodRes.data);
        setOrders(ordRes.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load admin data.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id);
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete product.');
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
    } catch (err) {
      console.error(err);
      alert('Failed to update order status.');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1 className="page-title">⚙️ Admin Dashboard</h1>
        <div className="admin-stats">
          <div className="stat-card"><span className="stat-num">{products.length}</span><span className="stat-label">Products</span></div>
          <div className="stat-card"><span className="stat-num">{orders.length}</span><span className="stat-label">Orders</span></div>
          <div className="stat-card">
            <span className="stat-num">${orders.reduce((s, o) => s + o.total, 0).toFixed(0)}</span>
            <span className="stat-label">Revenue</span>
          </div>
        </div>
      </div>

      <div className="admin-tabs">
        <button className={activeTab === 'products' ? 'tab active' : 'tab'} onClick={() => setActiveTab('products')}>📦 Products</button>
        <button className={activeTab === 'orders' ? 'tab active' : 'tab'} onClick={() => setActiveTab('orders')}>🧾 Orders</button>
      </div>

      {activeTab === 'products' && (
        <div className="admin-section">
          <div className="section-header">
            <h2>All Products</h2>
            <Link to="/admin/product" className="btn-add-product">+ Add Product</Link>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p._id}>
                    <td>
                      <img src={p.imageUrl || 'https://via.placeholder.com/60'} alt={p.name}
                        className="table-product-img" onError={(e) => { e.target.src = 'https://via.placeholder.com/60'; }} />
                    </td>
                    <td className="product-name-cell">{p.name}</td>
                    <td><span className="category-pill">{p.category}</span></td>
                    <td className="price-cell">${p.price.toFixed(2)}</td>
                    <td>
                      <span className={`stock-pill ${p.stock === 0 ? 'stock-out' : p.stock < 10 ? 'stock-low' : 'stock-ok'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td>⭐ {p.rating}</td>
                    <td className="action-cell">
                      <button className="btn-edit" onClick={() => navigate(`/admin/product/${p._id}`)}>✏️ Edit</button>
                      <button className="btn-delete" onClick={() => handleDelete(p._id)}>🗑 Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="admin-section">
          <h2>All Orders</h2>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o._id}>
                    <td className="order-id-cell">#{o._id.slice(-8).toUpperCase()}</td>
                    <td>{o.user?.name}<br /><small>{o.user?.email}</small></td>
                    <td>{o.items.length} item{o.items.length !== 1 ? 's' : ''}</td>
                    <td className="price-cell">${o.total.toFixed(2)}</td>
                    <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td>
                      <select
                        value={o.status}
                        onChange={(e) => handleStatusChange(o._id, e.target.value)}
                        className={`status-select status-${o.status}`}
                      >
                        {STATUS_OPTIONS.map(s => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
