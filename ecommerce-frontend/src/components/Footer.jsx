import React from 'react';
import { Link } from 'react-router-dom';
import { FaShieldAlt, FaTruck, FaUndo, FaBrain, FaHeart } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-color)',
      marginTop: 'auto',
      padding: '4rem 0 2rem',
    }}>
      <div className="container">
        {/* Value Proposition Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2rem',
          paddingBottom: '3rem',
          borderBottom: '1px solid var(--border-color)',
          marginBottom: '3rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(99, 102, 241, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-primary)',
              fontSize: '1.25rem',
            }}>
              <FaTruck />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '600' }}>Express Shipping</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Free on orders above ₹999</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-emerald)',
              fontSize: '1.25rem',
            }}>
              <FaShieldAlt />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '600' }}>Secure Checkout</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>JWT + Encrypted Payments</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(236, 72, 153, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ec4899',
              fontSize: '1.25rem',
            }}>
              <FaBrain />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '600' }}>RapidMiner AI Recommender</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>FP-Growth Association Mining</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(245, 158, 11, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-amber)',
              fontSize: '1.25rem',
            }}>
              <FaUndo />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '600' }}>30-Day Easy Returns</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Hassle-free money back</p>
            </div>
          </div>
        </div>

        {/* Links & Information */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{
                width: '30px',
                height: '30px',
                borderRadius: '8px',
                background: 'var(--accent-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '0.9rem',
              }}>
                N
              </div>
              <h3 style={{ fontSize: '1.15rem' }}>NEXUS<span className="gradient-text">STORE</span></h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Enterprise-grade MERN Stack e-commerce architecture integrating automated RapidMiner association intelligence, JWT role-based security, and React Redux state orchestration.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '1rem', letterSpacing: '0.05em' }}>
              Quick Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <li><Link to="/" style={{ color: 'var(--text-secondary)' }}>All Products</Link></li>
              <li><Link to="/cart" style={{ color: 'var(--text-secondary)' }}>Shopping Cart</Link></li>
              <li><Link to="/orders" style={{ color: 'var(--text-secondary)' }}>Order History</Link></li>
              <li><Link to="/contact" style={{ color: 'var(--text-secondary)' }}>Support & Inquiries</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '1rem', letterSpacing: '0.05em' }}>
              Tech Architecture
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <li>• Frontend: React 19 + Redux Toolkit + Vite</li>
              <li>• Backend: Node.js + Express 5 + RESTful APIs</li>
              <li>• Database: MongoDB + Mongoose Schemas</li>
              <li>• Recommendation: RapidMiner FP-Growth Engine</li>
              <li>• Security: JWT Bearer Tokens + bcryptjs</li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid var(--border-color)',
          fontSize: '0.82rem',
          color: 'var(--text-muted)',
        }}>
          <div>
            © {new Date().getFullYear()} NexusStore Inc. Full Stack Development Assignment V8.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            Built with <FaHeart color="#ec4899" size={12} /> for Entri Module-End Evaluation
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
