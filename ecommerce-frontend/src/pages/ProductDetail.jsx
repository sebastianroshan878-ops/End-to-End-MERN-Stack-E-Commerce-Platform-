import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  FaStar,
  FaShoppingCart,
  FaCheck,
  FaArrowLeft,
  FaBrain,
  FaShieldAlt,
  FaTruck,
  FaBox,
} from 'react-icons/fa';
import {
  fetchProductDetailThunk,
  fetchProductRecommendationsThunk,
} from '../redux/thunks/productThunks';
import { addItem } from '../redux/slices/cartSlice';
import ProductCard from '../components/ProductCard';

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { product, detailLoading, error, relatedRecommendations } = useSelector(
    (state) => state.products
  );

  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetailThunk(id));
      dispatch(fetchProductRecommendationsThunk(id));
      window.scrollTo(0, 0);
    }
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (product) {
      dispatch(
        addItem({
          product: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          stock: product.stock,
          category: product.category,
          qty: Number(qty),
        })
      );
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  if (detailLoading) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading product details...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--accent-rose)', marginBottom: '1rem' }}>Product Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          {error || "The requested product does not exist or may have been removed."}
        </p>
        <Link to="/" className="btn btn-primary">Back to Catalog</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 5rem' }}>
      {/* Breadcrumb / Back Navigation */}
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
          <FaArrowLeft size={12} /> Back to Catalog
        </Link>
      </div>

      {/* Product Main Showcase Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '3.5rem',
        alignItems: 'start',
        marginBottom: '5rem',
      }}>
        {/* Left: Product Image */}
        <div className="glass-panel" style={{
          overflow: 'hidden',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          backgroundColor: '#0f172a',
          border: '1px solid var(--border-color)',
        }}>
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: '100%',
              maxHeight: '460px',
              objectFit: 'contain',
              borderRadius: 'var(--radius-md)',
            }}
          />
        </div>

        {/* Right: Product Details & Purchase Form */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
            <span className="badge" style={{ backgroundColor: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-primary)' }}>
              {product.category}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Brand: <strong>{product.brand}</strong>
            </span>
          </div>

          <h1 style={{ fontSize: '2.1rem', marginBottom: '1rem', lineHeight: 1.25 }}>
            {product.name}
          </h1>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', color: '#f59e0b', gap: '2px' }}>
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} color={i < Math.floor(product.rating) ? '#f59e0b' : '#475569'} />
              ))}
            </div>
            <span style={{ fontWeight: '600' }}>{product.rating}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              ({product.numReviews} customer verified reviews)
            </span>
          </div>

          {/* Price & Stock */}
          <div style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '1.25rem',
            marginBottom: '1.75rem',
            paddingBottom: '1.5rem',
            borderBottom: '1px solid var(--border-color)',
          }}>
            <span style={{ fontSize: '2.4rem', fontWeight: '800', color: '#fff' }}>
              ${product.price.toFixed(2)}
            </span>
            <span className={`badge ${product.stock > 0 ? 'badge-success' : 'badge-warning'}`}>
              <FaBox size={10} /> {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
            </span>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.05rem', marginBottom: '0.65rem' }}>Overview</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.98rem' }}>
              {product.description}
            </p>
          </div>

          {/* Quantity & Add to Cart Action */}
          {product.stock > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <label htmlFor="product-qty-select" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Qty:
                </label>
                <select
                  id="product-qty-select"
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="form-select"
                  style={{ width: '80px', padding: '0.6rem 0.75rem' }}
                >
                  {[...Array(Math.min(product.stock, 10))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              <button
                id="add-to-cart-action-btn"
                onClick={handleAddToCart}
                className={`btn ${added ? 'btn-secondary' : 'btn-primary'} btn-lg`}
                style={{
                  flex: 1,
                  minWidth: '200px',
                  backgroundColor: added ? 'var(--accent-emerald)' : undefined,
                  borderColor: added ? 'var(--accent-emerald)' : undefined,
                }}
              >
                {added ? (
                  <>
                    <FaCheck /> Added to Cart!
                  </>
                ) : (
                  <>
                    <FaShoppingCart /> Add to Shopping Cart
                  </>
                )}
              </button>
            </div>
          ) : (
            <div style={{
              padding: '1rem',
              backgroundColor: 'rgba(244, 63, 94, 0.1)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--accent-rose)',
              marginBottom: '2rem',
            }}>
              This product is temporarily out of stock. Please check back later.
            </div>
          )}

          {/* Value Badges */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--border-color)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <FaTruck color="var(--accent-primary)" /> Express Global Delivery
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <FaShieldAlt color="var(--accent-emerald)" /> 2-Year Official Warranty
            </div>
          </div>
        </div>
      </div>

      {/* Frequently Bought Together (RapidMiner Association Rules) */}
      {relatedRecommendations && relatedRecommendations.length > 0 && (
        <section style={{
          paddingTop: '3rem',
          borderTop: '1px solid var(--border-color)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
            <span className="badge badge-ai">
              <FaBrain /> RapidMiner Association Mining
            </span>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Customers who viewed this item also bought
            </span>
          </div>

          <h2 style={{ fontSize: '1.75rem', marginBottom: '2rem' }}>
            Frequently Paired Together
          </h2>

          <div className="grid-products">
            {relatedRecommendations.slice(0, 4).map((recProduct) => (
              <ProductCard key={recProduct._id} product={recProduct} isAiRecommended={true} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
