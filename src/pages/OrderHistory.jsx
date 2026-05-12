import { useState, useEffect } from 'react';
import { getMyOrders } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const STATUS_COLORS = {
  pending: '#f59e0b',
  processing: '#3b82f6',
  shipped: '#8b5cf6',
  delivered: '#10b981'
};

const STATUS_ICONS = {
  pending: '⏳',
  processing: '⚙️',
  shipped: '🚚',
  delivered: '✅'
};

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await getMyOrders();
        setOrders(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load orders.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="orders-page">
      <h1 className="page-title">My Orders</h1>

      {orders.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📦</span>
          <h3>No orders yet</h3>
          <p>Start shopping to place your first order!</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div>
                  <span className="order-id">Order #{order._id.slice(-8).toUpperCase()}</span>
                  <span className="order-date">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <span
                  className="status-badge"
                  style={{ backgroundColor: STATUS_COLORS[order.status] }}
                >
                  {STATUS_ICONS[order.status]} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>

              <div className="order-items">
                {order.items.map((item, idx) => (
                  <div key={idx} className="order-item-row">
                    {item.product?.imageUrl && (
                      <img src={item.product.imageUrl} alt={item.product?.name} className="order-item-img"
                        onError={(e) => { e.target.style.display = 'none'; }} />
                    )}
                    <span className="order-item-name">{item.product?.name || 'Product removed'}</span>
                    <span className="order-item-qty">×{item.quantity}</span>
                    <span className="order-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="order-footer">
                <span>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                <span className="order-total">Total: <strong>${order.total.toFixed(2)}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
