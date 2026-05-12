import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import OrderHistory from './pages/OrderHistory';
import AdminDashboard from './pages/AdminDashboard';
import EditProduct from './pages/EditProduct';
// navigation/search handled inside pages when needed
function AppInner() {
  // kept minimal; navigation handled in individual pages

  return (
    <>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/orders" element={
            <ProtectedRoute><OrderHistory /></ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/admin/product" element={
            <ProtectedRoute adminOnly={true}><EditProduct /></ProtectedRoute>
          } />
          <Route path="/admin/product/:id" element={
            <ProtectedRoute adminOnly={true}><EditProduct /></ProtectedRoute>
          } />
          <Route path="*" element={
            <div className="not-found">
              <h2>404 — Page Not Found</h2>
              <a href="/">Go Home</a>
            </div>
          } />
        </Routes>
      </main>
      <footer className="footer">
        <p>© 2026 IqraMart. Built by Engr. Faisal Khan</p>
      </footer>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppInner />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
