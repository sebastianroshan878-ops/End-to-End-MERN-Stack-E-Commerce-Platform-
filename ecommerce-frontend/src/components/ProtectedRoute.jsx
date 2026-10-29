import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!userInfo) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (adminOnly && userInfo.role !== 'admin') {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <div className="glass-panel" style={{ maxWidth: '500px', margin: '0 auto', padding: '3rem' }}>
          <h2 style={{ color: 'var(--accent-rose)', marginBottom: '1rem' }}>Access Denied</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Administrator privileges are required to view this resource.
          </p>
          <a href="/" className="btn btn-primary">Return to Store</a>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
