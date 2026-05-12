import { useState } from 'react';
import { CartContext } from './cartContextInstance';

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  const persist = (updated) => {
    localStorage.setItem('cart', JSON.stringify(updated));
    setCart(updated);
  };

  const addToCart = (product, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i.product._id === product._id);
      const updated = existing
        ? prev.map(i => i.product._id === product._id
            ? { ...i, quantity: i.quantity + qty } : i)
        : [...prev, { product, quantity: qty }];
      localStorage.setItem('cart', JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromCart = (productId) => {
    const updated = cart.filter(i => i.product._id !== productId);
    persist(updated);
  };

  const updateQuantity = (productId, qty) => {
    if (qty < 1) { removeFromCart(productId); return; }
    const updated = cart.map(i =>
      i.product._id === productId ? { ...i, quantity: qty } : i
    );
    persist(updated);
  };

  const clearCart = () => persist([]);

  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

// `useCart` moved to a dedicated hook file to keep this file exporting only components
