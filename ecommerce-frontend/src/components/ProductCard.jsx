import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FaStar, FaShoppingCart, FaCheck, FaBrain } from 'react-icons/fa';
import { addItem } from '../redux/slices/cartSlice';
import { formatINR, FALLBACK_PRODUCT_IMAGE } from '../utils/formatCurrency';

const ProductCard = ({ product, isAiRecommended = false }) => {
  const dispatch = useDispatch();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch(
      addItem({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        stock: product.stock,
        category: product.category,
        qty: 1,
      })
    );

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div
      className="glass-panel"
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'transform var(--transition-normal), box-shadow var(--transition-normal), border-color var(--transition-normal)',
        position: 'relative',
        height: '100%',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.borderColor = 'var(--border-color-hover)';
        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'var(--border-color)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
    >
      {/* Top Badges */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '12px',
        right: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        zIndex: 10,
        pointerEvents: 'none',
      }}>
        <span className="badge" style={{
          backgroundColor: 'rgba(10, 13, 20, 0.75)',
          backdropFilter: 'blur(8px)',
          color: 'var(--text-secondary)',
          border: '1px solid var(--border-color)',
        }}>
          {product.category}
        </span>

        {isAiRecommended && (
          <span className="badge badge-ai" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <FaBrain size={10} /> RapidMiner Pick
          </span>
        )}
      </div>

      {/* Product Image Link */}
      <Link to={`/product/${product._id}`} style={{ display: 'block', overflow: 'hidden', height: '210px', backgroundColor: '#0f172a' }}>
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = FALLBACK_PRODUCT_IMAGE;
          }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.08)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        />
      </Link>

      {/* Content */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Brand & Rating */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {product.brand}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#f59e0b', fontSize: '0.82rem' }}>
            <FaStar />
            <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{product.rating}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>({product.numReviews})</span>
          </div>
        </div>

        {/* Title */}
        <Link to={`/product/${product._id}`} style={{ marginBottom: '0.65rem' }}>
          <h3 style={{
            fontSize: '1rem',
            fontWeight: '600',
            lineHeight: 1.35,
            color: 'var(--text-primary)',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            minHeight: '2.7em',
          }}>
            {product.name}
          </h3>
        </Link>

        {/* Description snippet */}
        <p style={{
          fontSize: '0.82rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.5,
          marginBottom: '1rem',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}>
          {product.description}
        </p>

        {/* Bottom Price & Add to Cart Action */}
        <div style={{
          marginTop: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '0.75rem',
          borderTop: '1px solid var(--border-color)',
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', lineHeight: 1 }}>
              Price
            </span>
            <span style={{ fontSize: '1.25rem', fontWeight: '700', color: '#fff' }}>
              {formatINR(product.price)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`btn ${added ? 'btn-secondary' : 'btn-primary'} btn-sm`}
            style={{
              borderRadius: 'var(--radius-sm)',
              padding: '0.5rem 0.9rem',
              backgroundColor: added ? 'var(--accent-emerald)' : undefined,
              borderColor: added ? 'var(--accent-emerald)' : undefined,
            }}
          >
            {added ? (
              <>
                <FaCheck /> Added
              </>
            ) : product.stock === 0 ? (
              'Sold Out'
            ) : (
              <>
                <FaShoppingCart size={13} /> Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
