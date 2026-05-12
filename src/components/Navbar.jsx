import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useState } from 'react';
import SidebarMenu from './SidebarMenu';

export default function Navbar() {
  const { userInfo, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setUserDropdownOpen(false);
  };

  return (
    <nav className="navbar">
      {/* Primary Header (Nav Belt) */}
      <div className="nav-belt">
        <Link to="/" className="nav-logo">
          <span className="logo-text">IqraMart</span>
          <span className="logo-smile">➜</span>
        </Link>

        <div className="nav-location">
          <span className="loc-icon">📍</span>
          <div className="loc-text">
            <span className="loc-line-1">Deliver to</span>
            <span className="loc-line-2">Pakistan</span>
          </div>
        </div>

        <form className="nav-search" onSubmit={handleSearch}>
          <select className="search-dropdown">
            <option value="All">All</option>
          </select>
          <input
            type="text"
            placeholder="Search IqraMart"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="search-btn">🔍</button>
        </form>

        <div className="nav-tools">
          <div className="nav-tool-item">
            <span className="nav-line-1" style={{paddingTop: '10px'}}>🇺🇸 EN</span>
          </div>

          <div 
            className="nav-tool-item" 
            onMouseEnter={() => setUserDropdownOpen(true)}
            onMouseLeave={() => setUserDropdownOpen(false)}
          >
            <span className="nav-line-1">Hello, {userInfo ? userInfo.name.split(' ')[0] : 'sign in'}</span>
            <span className="nav-line-2">Account & Lists ▾</span>
            
            {userDropdownOpen && (
              <div className="user-dropdown">
                {userInfo ? (
                  <>
                    <Link to="/orders" onClick={() => setUserDropdownOpen(false)}>My Orders</Link>
                    {userInfo.role === 'admin' && (
                      <Link to="/admin" onClick={() => setUserDropdownOpen(false)}>Admin Panel</Link>
                    )}
                    <button onClick={handleLogout}>Sign Out</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setUserDropdownOpen(false)}>Sign In</Link>
                    <Link to="/register" onClick={() => setUserDropdownOpen(false)}>Start here.</Link>
                  </>
                )}
              </div>
            )}
          </div>

          <Link to="/orders" className="nav-tool-item">
            <span className="nav-line-1">Returns</span>
            <span className="nav-line-2">& Orders</span>
          </Link>

          <Link to="/cart" className="nav-cart">
            <div className="cart-icon-wrapper">
              🛒
              <span className="cart-count">{totalItems}</span>
            </div>
            <span className="cart-text">Cart</span>
          </Link>
        </div>
      </div>

      {/* Secondary Header (Nav Main) */}
      <div className="nav-main">
        <button className="nav-all" onClick={() => setIsSidebarOpen(true)}>☰ All</button>
        <Link to="/?category=Electronics">Electronics</Link>
        <Link to="/?category=Clothing">Clothing</Link>
        <Link to="/?category=Footwear">Footwear</Link>
        <Link to="/?category=Kitchen">Kitchen</Link>
        <Link to="/?category=Books">Books</Link>
        <Link to="/?category=Home">Home</Link>
        <Link to="/?category=Sports">Sports</Link>
        <Link to="/?category=Toys">Toys</Link>
      </div>

      <SidebarMenu 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        userInfo={userInfo} 
      />
    </nav>
  );
}
