import { Link } from 'react-router-dom';

export default function SidebarMenu({ isOpen, onClose, userInfo }) {
  if (!isOpen) return null;

  return (
    <>
      <div className="sidebar-overlay" onClick={onClose}>
        <button className="sidebar-close-btn" onClick={onClose}>✕</button>
      </div>
      <div className={`sidebar-panel ${isOpen ? 'open' : ''}`}>
        
        <div className="sidebar-header">
          <span className="sidebar-user-icon">👤</span>
          <h3>Hello, {userInfo ? userInfo.name.split(' ')[0] : 'sign in'}</h3>
        </div>

        <div className="sidebar-content">
          <div className="sidebar-section">
            <h4>Digital Content & Devices</h4>
            <Link to="/" onClick={onClose} className="sidebar-item">Prime Video <span className="arrow">›</span></Link>
            <Link to="/" onClick={onClose} className="sidebar-item">Amazon Music <span className="arrow">›</span></Link>
            <Link to="/" onClick={onClose} className="sidebar-item">Kindle E-readers & Books <span className="arrow">›</span></Link>
            <Link to="/" onClick={onClose} className="sidebar-item">Amazon Appstore <span className="arrow">›</span></Link>
          </div>

          <div className="sidebar-section">
            <h4>Shop by Department</h4>
            <Link to="/?category=Electronics" onClick={onClose} className="sidebar-item">Electronics <span className="arrow">›</span></Link>
            <Link to="/?category=Computers" onClick={onClose} className="sidebar-item">Computers <span className="arrow">›</span></Link>
            <Link to="/?category=Home" onClick={onClose} className="sidebar-item">Smart Home <span className="arrow">›</span></Link>
            <Link to="/?category=Toys" onClick={onClose} className="sidebar-item">Arts & Crafts <span className="arrow">›</span></Link>
            <Link to="/" onClick={onClose} className="sidebar-item">See all <span className="arrow down">⌄</span></Link>
          </div>

          <div className="sidebar-section">
            <h4>Programs & Features</h4>
            <Link to="/" onClick={onClose} className="sidebar-item">Gift Cards</Link>
            <Link to="/" onClick={onClose} className="sidebar-item">Shop By Interest</Link>
            <Link to="/" onClick={onClose} className="sidebar-item">Amazon Live</Link>
            <Link to="/" onClick={onClose} className="sidebar-item">International Shopping</Link>
            <Link to="/" onClick={onClose} className="sidebar-item">See all <span className="arrow down">⌄</span></Link>
          </div>

          <div className="sidebar-section">
            <h4>Help & Settings</h4>
            <Link to="/orders" onClick={onClose} className="sidebar-item">Your Account</Link>
            <Link to="/" onClick={onClose} className="sidebar-item">🌐 English</Link>
            <Link to="/" onClick={onClose} className="sidebar-item">🇺🇸 United States</Link>
            <Link to="/" onClick={onClose} className="sidebar-item">Customer Service</Link>
            {!userInfo ? (
              <Link to="/login" onClick={onClose} className="sidebar-item">Sign in</Link>
            ) : (
              <button onClick={onClose} className="sidebar-item" style={{width: '100%', textAlign: 'left', background: 'none'}}>Sign Out</button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
