import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { updateQuantity, removeItem } from '../redux/slices/cartSlice';
import { formatINR, FALLBACK_PRODUCT_IMAGE } from '../utils/formatCurrency';

const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  const handleIncrement = () => {
    if (item.qty < item.stock) {
      dispatch(updateQuantity({ productId: item.product, qty: item.qty + 1 }));
    }
  };

  const handleDecrement = () => {
    if (item.qty > 1) {
      dispatch(updateQuantity({ productId: item.product, qty: item.qty - 1 }));
    } else {
      dispatch(removeItem(item.product));
    }
  };

  const handleRemove = () => {
    dispatch(removeItem(item.product));
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.25rem 0',
        borderBottom: '1px solid var(--border-color)',
        gap: '1.25rem',
        flexWrap: 'wrap',
      }}
    >
      {/* Product Image & Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '220px', flex: 2 }}>
        <img
          src={item.image}
          alt={item.name}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = FALLBACK_PRODUCT_IMAGE;
          }}
          style={{
            width: '74px',
            height: '74px',
            objectFit: 'cover',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-secondary)',
          }}
        />
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            {item.category || 'Product'}
          </span>
          <Link to={`/product/${item.product}`}>
            <h4 style={{
              fontSize: '0.95rem',
              fontWeight: '600',
              lineHeight: 1.3,
              color: 'var(--text-primary)',
              marginBottom: '0.3rem',
            }}>
              {item.name}
            </h4>
          </Link>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {formatINR(item.price)} each
          </div>
        </div>
      </div>

      {/* Quantity Selector */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        backgroundColor: 'var(--bg-secondary)',
        padding: '0.25rem 0.5rem',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-color)',
      }}>
        <button
          onClick={handleDecrement}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-primary)',
            padding: '0.35rem 0.5rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
          title="Decrease quantity"
        >
          <FaMinus size={11} />
        </button>

        <span style={{
          minWidth: '24px',
          textAlign: 'center',
          fontWeight: '600',
          fontSize: '0.9rem',
        }}>
          {item.qty}
        </span>

        <button
          onClick={handleIncrement}
          disabled={item.qty >= item.stock}
          style={{
            background: 'transparent',
            border: 'none',
            color: item.qty >= item.stock ? 'var(--text-muted)' : 'var(--text-primary)',
            padding: '0.35rem 0.5rem',
            cursor: item.qty >= item.stock ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
          title="Increase quantity"
        >
          <FaPlus size={11} />
        </button>
      </div>

      {/* Item Line Total */}
      <div style={{ minWidth: '85px', textAlign: 'right' }}>
        <div style={{ fontSize: '1.05rem', fontWeight: '700', color: '#fff' }}>
          {formatINR(item.price * item.qty)}
        </div>
      </div>

      {/* Remove Button */}
      <button
        onClick={handleRemove}
        className="btn-danger"
        style={{
          width: '36px',
          height: '36px',
          borderRadius: 'var(--radius-sm)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
        title="Remove item"
      >
        <FaTrash size={13} />
      </button>
    </div>
  );
};

export default CartItem;
