import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Search, SlidersHorizontal, X } from 'lucide-react';

const CATEGORIES = ['All', 'Textiles', 'Pottery', 'Jewelry', 'Woodwork', 'Metalwork', 'Other'];

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products');
        setProducts(data.data);
        setFiltered(data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = [...products];

    if (activeCategory !== 'All') {
      result = result.filter((p) => p.category === activeCategory);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating') result.sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'newest') result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setFiltered(result);
  }, [search, activeCategory, sortBy, products]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F1E2D1', fontFamily: 'Georgia, serif' }}>

      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #810B38 0%, #5a0828 100%)',
        padding: '3rem 2rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.07,
          backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)',
          backgroundSize: '20px 20px',
        }} />
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
          <p style={{ color: '#f0b87a', letterSpacing: '0.2em', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Handcrafted with Soul
          </p>
          <h1 style={{ color: '#fff', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 'bold', margin: 0, lineHeight: 1.1 }}>
            The Artisan Marketplace
          </h1>
          <p style={{ color: '#e8c9a0', marginTop: '0.75rem', fontSize: '1rem', maxWidth: '500px' }}>
            Discover unique handmade treasures crafted by skilled artisans from across India.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>

        {/* Search + Filter Bar */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#810B38' }} />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem',
                border: '2px solid #d4a574', borderRadius: '8px',
                backgroundColor: '#fff', fontFamily: 'Georgia, serif',
                fontSize: '0.95rem', color: '#3d1a0a', outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#810B38' }}>
                <X size={16} />
              </button>
            )}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '0.75rem 1rem', border: '2px solid #d4a574', borderRadius: '8px',
              backgroundColor: '#fff', fontFamily: 'Georgia, serif', fontSize: '0.95rem',
              color: '#3d1a0a', outline: 'none', cursor: 'pointer',
            }}
          >
            <option value="default">Sort: Default</option>
            <option value="newest">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '0.4rem 1.1rem', borderRadius: '999px', border: '2px solid #810B38',
                backgroundColor: activeCategory === cat ? '#810B38' : 'transparent',
                color: activeCategory === cat ? '#fff' : '#810B38',
                fontFamily: 'Georgia, serif', fontSize: '0.875rem', cursor: 'pointer',
                transition: 'all 0.2s ease', fontWeight: activeCategory === cat ? 'bold' : 'normal',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results Count */}
        {!loading && !error && (
          <p style={{ color: '#6b3a2a', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Showing <strong>{filtered.length}</strong> {filtered.length === 1 ? 'product' : 'products'}
            {activeCategory !== 'All' && ` in ${activeCategory}`}
            {search && ` for "${search}"`}
          </p>
        )}

        {/* States */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <div style={{
              width: '48px', height: '48px', border: '4px solid #d4a574',
              borderTopColor: '#810B38', borderRadius: '50%', margin: '0 auto 1rem',
              animation: 'spin 0.8s linear infinite',
            }} />
            <p style={{ color: '#810B38', fontStyle: 'italic' }}>Loading artisan treasures...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {error && (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <p style={{ color: '#810B38', fontSize: '1.1rem', marginBottom: '1rem' }}>{error}</p>
            <button
              onClick={() => window.location.reload()}
              style={{ padding: '0.6rem 1.5rem', backgroundColor: '#810B38', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: 'Georgia, serif' }}
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🪔</p>
            <p style={{ color: '#810B38', fontSize: '1.1rem', fontStyle: 'italic' }}>No products found.</p>
            <button
              onClick={() => { setSearch(''); setActiveCategory('All'); }}
              style={{ marginTop: '1rem', padding: '0.6rem 1.5rem', backgroundColor: '#810B38', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: 'Georgia, serif' }}
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Product Grid */}
        {!loading && !error && filtered.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
            gap: '1.75rem',
          }}>
            {filtered.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ProductCard = ({ product }) => {
  const [hovered, setHovered] = useState(false);

  const imageUrl = product.images?.[0] || null;
  const vendorName = product.vendor?.vendorDetails?.storeName || product.vendor?.name || 'Artisan';

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: hovered ? '0 12px 40px rgba(129,11,56,0.18)' : '0 2px 12px rgba(0,0,0,0.08)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: '220px', backgroundColor: '#f5e6d3', overflow: 'hidden' }}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease', transform: hovered ? 'scale(1.05)' : 'scale(1)' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
            🪔
          </div>
        )}
        {/* Category Badge */}
        <span style={{
          position: 'absolute', top: '0.75rem', left: '0.75rem',
          backgroundColor: '#810B38', color: '#fff',
          padding: '0.2rem 0.7rem', borderRadius: '999px', fontSize: '0.7rem',
          fontFamily: 'Georgia, serif', letterSpacing: '0.05em',
        }}>
          {product.category}
        </span>
        {/* Out of stock */}
        {product.stock === 0 && (
          <div style={{
            position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '1rem', letterSpacing: '0.1em' }}>OUT OF STOCK</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '1.1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <p style={{ color: '#a0522d', fontSize: '0.75rem', margin: 0, letterSpacing: '0.05em' }}>by {vendorName}</p>
        <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#2d0f06', fontWeight: 'bold', lineHeight: 1.3 }}>
          {product.name}
        </h3>

        {product.storySnippet && (
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#7a5c4a', fontStyle: 'italic', lineHeight: 1.5 }}>
            "{product.storySnippet}"
          </p>
        )}

        {/* Rating */}
        {product.numReviews > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Star size={13} fill="#f0a500" color="#f0a500" />
            <span style={{ fontSize: '0.8rem', color: '#5a3e2b' }}>
              {product.rating.toFixed(1)} ({product.numReviews})
            </span>
          </div>
        )}

        {/* Price + CTA */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.75rem' }}>
          <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#810B38' }}>
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          <Link
            to={`/products/${product._id}`}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              backgroundColor: product.stock > 0 ? '#810B38' : '#ccc',
              color: '#fff', padding: '0.45rem 1rem', borderRadius: '8px',
              fontSize: '0.8rem', textDecoration: 'none', fontFamily: 'Georgia, serif',
              pointerEvents: product.stock === 0 ? 'none' : 'auto',
              transition: 'background 0.2s',
            }}
          >
            <ShoppingCart size={14} />
            View
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;