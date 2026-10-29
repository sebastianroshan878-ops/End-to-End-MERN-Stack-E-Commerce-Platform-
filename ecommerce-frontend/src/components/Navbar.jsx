import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  FaShoppingCart,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaBrain,
  FaShieldAlt,
  FaBoxOpen,
} from 'react-icons/fa';
import { logout } from '../redux/slices/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const handleLogout = () => {
    dispatch(logout());
    setUserDropdownOpen(false);
    navigate('/login');
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      backgroundColor: 'rgba(10, 13, 20, 0.88)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-color)',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '74px',
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: '800',
            fontSize: '1.2rem',
            boxShadow: 'var(--shadow-glow)',
          }}>
            N
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.02em' }}>
              NEXUS<span className="gradient-text">STORE</span>
            </span>
            <span style={{
              display: 'block',
              fontSize: '0.65rem',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              lineHeight: 1,
            }}>
              MERN + RapidMiner
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.75rem',
          fontSize: '0.95rem',
          fontWeight: '500',
        }}>
          <Link to="/" style={{ color: 'var(--text-secondary)' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>
            Shop
          </Link>
          <Link to="/contact" style={{ color: 'var(--text-secondary)' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>
            Contact
          </Link>
          <a
            href="#ai-recommendations"
            onClick={(e) => {
              if (window.location.pathname !== '/') {
                e.preventDefault();
                navigate('/#ai-recommendations');
              }
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: '#f472b6',
              fontWeight: '600',
            }}
          >
            <FaBrain /> AI Insights
          </a>
        </nav>

        {/* Right Actions: Cart & Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {/* Cart Icon */}
          <Link
            to="/cart"
            id="nav-cart-btn"
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
            }}
          >
            <FaShoppingCart size={17} />
            {totalCartCount > 0 && (
              <span
                id="cart-badge-count"
                style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  backgroundColor: 'var(--accent-primary)',
                  color: '#fff',
                  fontSize: '0.72rem',
                  fontWeight: '700',
                  minWidth: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '2px',
                  boxShadow: '0 0 10px rgba(99, 102, 241, 0.6)',
                }}
              >
                {totalCartCount}
              </span>
            )}
          </Link>

          {/* User Auth Info / Dropdown */}
          {userInfo ? (
            <div style={{ position: 'relative' }}>
              <button
                id="user-profile-menu-button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.45rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                }}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: userInfo.role === 'admin' ? 'linear-gradient(135deg, #f59e0b, #ef4444)' : 'var(--accent-gradient)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                }}>
                  {userInfo.name.charAt(0).toUpperCase()}
                </div>
                <div style={{ textAlign: 'left', lineHeight: 1.1 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>
                    {userInfo.name.split(' ')[0]}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: userInfo.role === 'admin' ? '#f59e0b' : 'var(--text-muted)' }}>
                    {userInfo.role === 'admin' ? 'Admin' : 'Customer'}
                  </div>
                </div>
              </button>

              {userDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: '210px',
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    boxShadow: 'var(--shadow-lg)',
                    padding: '0.5rem',
                    zIndex: 1100,
                  }}
                >
                  <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.35rem' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>{userInfo.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {userInfo.email}
                    </div>
                  </div>

                  <Link
                    to="/orders"
                    onClick={() => setUserDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      padding: '0.6rem 0.75rem',
                      borderRadius: '4px',
                      fontSize: '0.88rem',
                      color: 'var(--text-primary)',
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    <FaBoxOpen color="var(--accent-primary)" /> My Orders
                  </Link>

                  <button
                    onClick={handleLogout}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      width: '100%',
                      padding: '0.6rem 0.75rem',
                      borderRadius: '4px',
                      fontSize: '0.88rem',
                      color: 'var(--accent-rose)',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(244, 63, 94, 0.1)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    <FaSignOutAlt /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm" id="nav-login-btn">
              <FaUser size={13} /> Sign In
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none', // Shown via media query if needed
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              fontSize: '1.25rem',
              cursor: 'pointer',
            }}
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
