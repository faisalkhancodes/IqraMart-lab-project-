import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { placeOrder } from '../api';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart, totalPrice, totalItems } = useCart();
  const { userInfo } = useAuth();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handlePlaceOrder = async () => {
    if (!userInfo) { navigate('/login'); return; }
    setPlacing(true);
    setError('');
    try {
      const items = cart.map(i => ({
        product: i.product._id,
        quantity: i.quantity,
        price: i.product.price
      }));
      await placeOrder({ items, total: totalPrice });
      clearCart();
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order.');
    } finally {
      setPlacing(false);
    }
  };

  if (success) {
    return (
      <div className="success-page">
        <div className="success-card">
          <div className="success-icon">🎉</div>
          <h2>Order Placed Successfully!</h2>
          <p>Thank you for your purchase. Your order is being processed.</p>
          <div className="success-actions">
            <Link to="/orders" className="btn-primary">View My Orders</Link>
            <Link to="/" className="btn-ghost-dark">Continue Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <div className="empty-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Add some products to get started!</p>
        <Link to="/" className="btn-primary">Start Shopping</Link>
      </div>
    );
  }

  const shipping = totalPrice > 100 ? 0 : 9.99;
  const tax = totalPrice * 0.08;
  const grandTotal = totalPrice + shipping + tax;

  return (
    <div className="cart-page">
      <h1 className="page-title">Shopping Cart <span className="cart-count">({totalItems} items)</span></h1>

      <div className="cart-layout">
        {/* Cart Items */}
        <div className="cart-items">
          {cart.map(({ product, quantity }) => (
            <div key={product._id} className="cart-item">
              <img
                src={product.imageUrl || 'https://via.placeholder.com/100'}
                alt={product.name}
                className="cart-item-img"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/100'; }}
              />
              <div className="cart-item-info">
                <Link to={`/products/${product._id}`} className="cart-item-name">{product.name}</Link>
                <p className="cart-item-price">${product.price.toFixed(2)} each</p>
                <div className="cart-qty-controls">
                  <button onClick={() => updateQuantity(product._id, quantity - 1)}>−</button>
                  <span>{quantity}</span>
                  <button onClick={() => updateQuantity(product._id, quantity + 1)}>+</button>
                </div>
              </div>
              <div className="cart-item-right">
                <p className="cart-item-subtotal">${(product.price * quantity).toFixed(2)}</p>
                <button className="remove-btn" onClick={() => removeFromCart(product._id)}>🗑 Remove</button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="summary-line"><span>Subtotal</span><span>${totalPrice.toFixed(2)}</span></div>
          <div className="summary-line"><span>Shipping</span><span>{shipping === 0 ? '🎉 FREE' : `$${shipping.toFixed(2)}`}</span></div>
          <div className="summary-line"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
          <div className="summary-total"><span>Total</span><span>${grandTotal.toFixed(2)}</span></div>

          {shipping > 0 && (
            <p className="free-shipping-note">Add ${(100 - totalPrice).toFixed(2)} more for FREE shipping!</p>
          )}

          {error && <p className="cart-error">{error}</p>}

          <button
            className="place-order-btn"
            onClick={handlePlaceOrder}
            disabled={placing}
          >
            {placing ? 'Placing Order...' : userInfo ? '✓ Place Order' : '🔒 Login to Order'}
          </button>
          <Link to="/" className="continue-shopping">← Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
