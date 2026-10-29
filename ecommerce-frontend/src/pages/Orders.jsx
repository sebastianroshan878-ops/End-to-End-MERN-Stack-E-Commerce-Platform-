import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  FaBoxOpen,
  FaCheckCircle,
  FaClock,
  FaTruck,
  FaMapMarkerAlt,
  FaCreditCard,
  FaCalendarAlt,
} from 'react-icons/fa';
import { getMyOrdersThunk } from '../redux/thunks/orderThunks';

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMyOrdersThunk());
  }, [dispatch]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return <span className="badge badge-success"><FaCheckCircle size={10} /> Delivered</span>;
      case 'Processing':
        return <span className="badge badge-warning"><FaClock size={10} /> Processing</span>;
      case 'Shipped':
        return <span className="badge" style={{ backgroundColor: 'rgba(99, 102, 241, 0.2)', color: 'var(--accent-primary)' }}><FaTruck size={10} /> Shipped</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem 5rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>
          My <span className="gradient-text">Orders</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Review and track all your active shipments and previous order history for {userInfo?.name}.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
          Fetching order records...
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--accent-rose)' }}>
          Error retrieving orders: {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem', maxWidth: '500px', margin: '0 auto' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(99, 102, 241, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            color: 'var(--accent-primary)',
            fontSize: '1.75rem',
          }}>
            <FaBoxOpen />
          </div>
          <h3 style={{ marginBottom: '0.5rem' }}>No Orders Found</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            You haven't placed any orders yet. Check out our latest products!
          </p>
          <Link to="/" className="btn btn-primary">
            Explore Catalog
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {orders.map((order) => (
            <div key={order._id} className="glass-panel" style={{ padding: '1.75rem', overflow: 'hidden' }}>
              {/* Order Header */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                paddingBottom: '1.25rem',
                borderBottom: '1px solid var(--border-color)',
                marginBottom: '1.25rem',
              }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>
                    Order Reference ID
                  </span>
                  <span style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                    #{order._id}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <FaCalendarAlt size={12} color="var(--text-muted)" />
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>

                  <div>
                    {getStatusBadge(order.status)}
                  </div>

                  <div style={{ fontSize: '1.15rem', fontWeight: '700', color: '#fff' }}>
                    ${order.totalPrice.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Order Items Grid */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                {order.orderItems.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: '56px',
                          height: '56px',
                          objectFit: 'cover',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border-color)',
                          backgroundColor: 'var(--bg-secondary)',
                        }}
                      />
                      <div>
                        <div style={{ fontSize: '0.92rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Qty: {item.qty} × ${item.price.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                      ${(item.qty * item.price).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Delivery & Payment Footer Details */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                paddingTop: '1rem',
                borderTop: '1px solid var(--border-color)',
                fontSize: '0.82rem',
                color: 'var(--text-secondary)',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <FaMapMarkerAlt color="var(--accent-primary)" style={{ marginTop: '3px' }} />
                  <div>
                    <strong style={{ color: 'var(--text-primary)', display: 'block' }}>Delivery Address:</strong>
                    {order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <FaCreditCard color="var(--accent-emerald)" style={{ marginTop: '3px' }} />
                  <div>
                    <strong style={{ color: 'var(--text-primary)', display: 'block' }}>Payment:</strong>
                    {order.paymentMethod} • <span style={{ color: 'var(--accent-emerald)' }}>Paid</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
