import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  FaArrowLeft,
  FaShoppingBag,
  FaShieldAlt,
  FaCheckCircle,
  FaTruck,
} from 'react-icons/fa';
import CartItem from '../components/CartItem';
import { saveShippingAddress } from '../redux/slices/cartSlice';
import { createOrderThunk } from '../redux/thunks/orderThunks';

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cartItems, itemsPrice, shippingPrice, taxPrice, totalPrice, shippingAddress } =
    useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const { loading: orderLoading, error: orderError } = useSelector((state) => state.orders);

  // Checkout address state
  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || 'India');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card / UPI');
  const [formError, setFormError] = useState('');

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (!userInfo) {
      navigate('/login?redirect=/cart');
      return;
    }

    if (!address.trim() || !city.trim() || !postalCode.trim()) {
      setFormError('Please enter a complete delivery address.');
      return;
    }

    const addressPayload = { address, city, postalCode, country };
    dispatch(saveShippingAddress(addressPayload));

    const orderData = {
      orderItems: cartItems,
      shippingAddress: addressPayload,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    };

    const resultAction = await dispatch(createOrderThunk(orderData));
    if (createOrderThunk.fulfilled.match(resultAction)) {
      navigate('/orders');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <div className="glass-panel" style={{ maxWidth: '540px', margin: '0 auto', padding: '3.5rem 2rem' }}>
          <div style={{
            width: '70px',
            height: '70px',
            borderRadius: '50%',
            background: 'rgba(99, 102, 241, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            color: 'var(--accent-primary)',
            fontSize: '1.8rem',
          }}>
            <FaShoppingBag />
          </div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>Your Cart is Empty</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.6 }}>
            Looks like you haven't added anything to your cart yet. Explore our curated catalog of cutting-edge technology!
          </p>
          <Link to="/" className="btn btn-primary btn-lg">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
          }}
        >
          <FaArrowLeft size={12} /> Continue Shopping
        </Link>
      </div>

      <h1 style={{ fontSize: '2.2rem', marginBottom: '2.5rem' }}>
        Shopping <span className="gradient-text">Cart</span> ({cartItems.reduce((acc, i) => acc + i.qty, 0)} items)
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2.5rem',
        alignItems: 'start',
      }}>
        {/* Left: Cart Items List */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            paddingBottom: '1rem',
            borderBottom: '1px solid var(--border-color)',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            <span>Item Details</span>
            <span>Quantity & Subtotal</span>
          </div>

          <div>
            {cartItems.map((item) => (
              <CartItem key={item.product} item={item} />
            ))}
          </div>

          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'rgba(99, 102, 241, 0.08)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
          }}>
            <FaTruck color="var(--accent-primary)" size={18} />
            <span>
              {itemsPrice >= 100
                ? '🎉 Congratulations! You have unlocked Free Express Shipping.'
                : `Add $${(100 - itemsPrice).toFixed(2)} more to qualify for Free Shipping.`}
            </span>
          </div>
        </div>

        {/* Right: Checkout & Order Summary Card */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
            Order Summary
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Items Subtotal:</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>${itemsPrice.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Estimated Shipping:</span>
              <span style={{ color: shippingPrice === 0 ? 'var(--accent-emerald)' : 'var(--text-primary)', fontWeight: '600' }}>
                {shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}`}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Estimated GST / Tax (10%):</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>${taxPrice.toFixed(2)}</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingTop: '1rem',
              borderTop: '1px solid var(--border-color)',
              fontSize: '1.25rem',
              fontWeight: '700',
            }}>
              <span>Total Price:</span>
              <span style={{ color: '#fff' }}>${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Delivery & Payment Details Form */}
          <form onSubmit={handleCheckout}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              Shipping Details
            </h4>

            {formError && (
              <div style={{
                padding: '0.65rem 0.85rem',
                backgroundColor: 'rgba(244, 63, 94, 0.15)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--accent-rose)',
                fontSize: '0.82rem',
                marginBottom: '1rem',
              }}>
                {formError}
              </div>
            )}

            {orderError && (
              <div style={{
                padding: '0.65rem 0.85rem',
                backgroundColor: 'rgba(244, 63, 94, 0.15)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--accent-rose)',
                fontSize: '0.82rem',
                marginBottom: '1rem',
              }}>
                {orderError}
              </div>
            )}

            <div className="form-group">
              <input
                type="text"
                className="form-input"
                placeholder="Street address (e.g. 42 Silicon Blvd)"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  setFormError('');
                }}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <input
                type="text"
                className="form-input"
                placeholder="City (e.g. Bengaluru)"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
              <input
                type="text"
                className="form-input"
                placeholder="Postal Code"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Payment Method</label>
              <select
                className="form-select"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="Credit Card / UPI">Credit Card / Debit Card / UPI</option>
                <option value="Net Banking">Net Banking</option>
                <option value="Cash on Delivery">Cash on Delivery</option>
              </select>
            </div>

            <button
              type="submit"
              id="place-order-checkout-btn"
              disabled={orderLoading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem', fontSize: '1rem' }}
            >
              {orderLoading ? (
                'Processing Order...'
              ) : userInfo ? (
                'Confirm & Place Order'
              ) : (
                'Sign In to Checkout'
              )}
            </button>
          </form>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            marginTop: '1.25rem',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
          }}>
            <FaShieldAlt color="var(--accent-emerald)" /> End-to-end encrypted SSL checkout
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
