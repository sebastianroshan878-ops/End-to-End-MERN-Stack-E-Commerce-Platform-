import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import {
  FaSearch,
  FaFilter,
  FaBrain,
  FaArrowRight,
  FaStar,
  FaSlidersH,
} from 'react-icons/fa';
import {
  fetchProductsThunk,
  fetchCategoriesThunk,
  fetchRapidMinerRecommendationsThunk,
} from '../redux/thunks/productThunks';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    products,
    loading,
    error,
    categories,
    recommendations,
    recommendationMeta,
    recommendationsLoading,
    pages,
    totalCount,
  } = useSelector((state) => state.products);

  // Search & Filter State
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);

  // Trigger catalog fetch when parameters change
  useEffect(() => {
    const params = {
      page: currentPage,
      limit: 8,
      sortBy,
    };
    if (keyword.trim()) params.keyword = keyword.trim();
    if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;

    dispatch(fetchProductsThunk(params));
  }, [dispatch, keyword, selectedCategory, sortBy, currentPage]);

  // Initial load: categories & RapidMiner recommendations
  useEffect(() => {
    dispatch(fetchCategoriesThunk());
    dispatch(fetchRapidMinerRecommendationsThunk());
  }, [dispatch]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    const params = {};
    if (keyword.trim()) params.keyword = keyword.trim();
    if (selectedCategory !== 'All') params.category = selectedCategory;
    setSearchParams(params);
  };

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
    const params = {};
    if (keyword.trim()) params.keyword = keyword.trim();
    if (cat !== 'All') params.category = cat;
    setSearchParams(params);
  };

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99, 102, 241, 0.28), transparent)',
        padding: '4.5rem 0 3.5rem',
        borderBottom: '1px solid var(--border-color)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            borderRadius: 'var(--radius-full)',
            background: 'var(--accent-gradient-subtle)',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            marginBottom: '1.5rem',
          }}>
            <FaBrain color="#ec4899" />
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#f472b6' }}>
              RapidMiner AI Powered Recommendation Engine Active
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
            fontWeight: '800',
            letterSpacing: '-0.03em',
            marginBottom: '1.25rem',
            maxWidth: '900px',
            margin: '0 auto 1.25rem',
          }}>
            The Future of Shopping, <br />
            Curated by <span className="gradient-text">Machine Intelligence</span>
          </h1>

          <p style={{
            fontSize: '1.1rem',
            color: 'var(--text-secondary)',
            maxWidth: '680px',
            margin: '0 auto 2.5rem',
            lineHeight: 1.6,
          }}>
            Discover enterprise hardware, audio gear, and lifestyle technology with automated association mining, real-time cart orchestration, and verified JWT security.
          </p>

          {/* Quick search input in hero */}
          <form
            onSubmit={handleSearchSubmit}
            style={{
              maxWidth: '600px',
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              padding: '0.35rem 0.45rem',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <div style={{ padding: '0 0.85rem', color: 'var(--text-muted)' }}>
              <FaSearch />
            </div>
            <input
              type="text"
              id="hero-search-input"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search MacBook, Sony headphones, Apple watch..."
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '0.95rem',
                outline: 'none',
              }}
            />
            <button type="submit" className="btn btn-primary btn-sm" id="hero-search-btn">
              Search
            </button>
          </form>
        </div>
      </section>

      {/* RapidMiner AI Recommendations Section */}
      <section id="ai-recommendations" style={{
        padding: '3.5rem 0 4rem',
        backgroundColor: 'rgba(17, 23, 38, 0.65)',
        borderBottom: '1px solid var(--border-color)',
      }}>
        <div className="container">
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '1.5rem',
            marginBottom: '2.5rem',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <span className="badge badge-ai">
                  <FaBrain /> RapidMiner FP-Growth
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Avg. Confidence: {recommendationMeta?.confidence || '83.4%'} | Lift: {recommendationMeta?.lift || '2.12'}
                </span>
              </div>
              <h2 style={{ fontSize: '1.85rem' }}>Tailored For You by RapidMiner AI</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                Generated using transaction co-occurrence mining across cross-category item baskets.
              </p>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontSize: '0.82rem',
              color: 'var(--text-muted)',
              background: 'var(--bg-input)',
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
            }}>
              <span>Algorithm: <strong>FP-Growth Association</strong></span>
              <span>•</span>
              <span>Min Support: <strong>0.05</strong></span>
            </div>
          </div>

          {/* Recommendations Grid */}
          {recommendationsLoading ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
              Analyzing association graphs & generating recommendations...
            </div>
          ) : (
            <div className="grid-products">
              {recommendations.slice(0, 4).map((product) => (
                <ProductCard key={product._id} product={product} isAiRecommended={true} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Main Catalog Section */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          {/* Controls Bar: Category Pills + Sort Dropdown */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.25rem',
            marginBottom: '2.5rem',
          }}>
            {/* Category Filter Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {['All', ...categories].map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    backgroundColor: selectedCategory === cat ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                    color: selectedCategory === cat ? '#fff' : 'var(--text-secondary)',
                    border: `1px solid ${selectedCategory === cat ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <FaSlidersH /> Sort:
              </span>
              <select
                id="catalog-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-select"
                style={{
                  width: 'auto',
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.85rem',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-desc">Customer Rating</option>
              </select>
            </div>
          </div>

          {/* Product Results Info */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            fontSize: '0.88rem',
            color: 'var(--text-secondary)',
          }}>
            <span>Showing {products.length} of {totalCount} products</span>
            {keyword && (
              <span>Filter: Matching "<strong>{keyword}</strong>"</span>
            )}
          </div>

          {/* Catalog Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
              Loading products catalog...
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--accent-rose)' }}>
              Failed to load products: {error}
            </div>
          ) : products.length === 0 ? (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <h3>No products found</h3>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                Try modifying your search or choosing a different category.
              </p>
              <button
                onClick={() => {
                  setKeyword('');
                  setSelectedCategory('All');
                }}
                className="btn btn-secondary btn-sm"
                style={{ marginTop: '1.25rem' }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid-products">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {pages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '3.5rem' }}>
              {Array.from({ length: pages }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => setCurrentPage(num)}
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                    background: currentPage === num ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                    color: '#fff',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  {num}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
