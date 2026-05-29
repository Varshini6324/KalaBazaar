import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { MapPin, Scissors, CheckCircle, Search, X } from 'lucide-react';

const ArtisansPage = () => {
  const [artisans, setArtisans] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [activeCraft, setActiveCraft] = useState('All');

  useEffect(() => {
    const fetchArtisans = async () => {
      try {
        const { data } = await axios.get('/api/users/artisans');
        setArtisans(data.data);
        setFiltered(data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load artisans');
      } finally {
        setLoading(false);
      }
    };
    fetchArtisans();
  }, []);

  // Derive craft types from data
  const craftTypes = ['All', ...new Set(
    artisans.map((a) => a.vendorDetails?.craftType).filter(Boolean)
  )];

  useEffect(() => {
    let result = [...artisans];

    if (activeCraft !== 'All') {
      result = result.filter((a) => a.vendorDetails?.craftType === activeCraft);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.name?.toLowerCase().includes(q) ||
          a.vendorDetails?.storeName?.toLowerCase().includes(q) ||
          a.vendorDetails?.craftType?.toLowerCase().includes(q) ||
          a.vendorDetails?.address?.toLowerCase().includes(q)
      );
    }

    setFiltered(result);
  }, [search, activeCraft, artisans]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F1E2D1', fontFamily: 'Georgia, serif' }}>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #5a0828 0%, #810B38 60%, #a0522d 100%)',
        padding: '3.5rem 2rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.06,
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }} />
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
          <p style={{ color: '#f0b87a', letterSpacing: '0.2em', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            The Makers Behind the Magic
          </p>
          <h1 style={{ color: '#fff', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 'bold', margin: 0, lineHeight: 1.1 }}>
            Meet Our Artisans
          </h1>
          <p style={{ color: '#e8c9a0', marginTop: '0.75rem', fontSize: '1rem', maxWidth: '520px' }}>
            Each artisan brings generations of craft knowledge and passion to every piece they create.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>

        {/* Search */}
        <div style={{ position: 'relative', maxWidth: '480px', marginBottom: '1.5rem' }}>
          <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#810B38' }} />
          <input
            type="text"
            placeholder="Search by name, craft, or location..."
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

        {/* Craft Filter Pills */}
        {craftTypes.length > 1 && (
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            {craftTypes.map((craft) => (
              <button
                key={craft}
                onClick={() => setActiveCraft(craft)}
                style={{
                  padding: '0.4rem 1.1rem', borderRadius: '999px',
                  border: '2px solid #810B38',
                  backgroundColor: activeCraft === craft ? '#810B38' : 'transparent',
                  color: activeCraft === craft ? '#fff' : '#810B38',
                  fontFamily: 'Georgia, serif', fontSize: '0.875rem',
                  cursor: 'pointer', transition: 'all 0.2s ease',
                  fontWeight: activeCraft === craft ? 'bold' : 'normal',
                }}
              >
                {craft}
              </button>
            ))}
          </div>
        )}

        {/* Count */}
        {!loading && !error && (
          <p style={{ color: '#6b3a2a', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Showing <strong>{filtered.length}</strong> verified {filtered.length === 1 ? 'artisan' : 'artisans'}
            {activeCraft !== 'All' && ` in ${activeCraft}`}
          </p>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <div style={{
              width: '48px', height: '48px', border: '4px solid #d4a574',
              borderTopColor: '#810B38', borderRadius: '50%',
              margin: '0 auto 1rem', animation: 'spin 0.8s linear infinite',
            }} />
            <p style={{ color: '#810B38', fontStyle: 'italic' }}>Finding our artisans...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* Error */}
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

        {/* Empty */}
        {!loading && !error && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧵</p>
            <p style={{ color: '#810B38', fontSize: '1.1rem', fontStyle: 'italic' }}>No artisans found.</p>
            <button
              onClick={() => { setSearch(''); setActiveCraft('All'); }}
              style={{ marginTop: '1rem', padding: '0.6rem 1.5rem', backgroundColor: '#810B38', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: 'Georgia, serif' }}
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Artisan Grid */}
        {!loading && !error && filtered.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.75rem',
          }}>
            {filtered.map((artisan) => (
              <ArtisanCard key={artisan._id} artisan={artisan} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ArtisanCard = ({ artisan }) => {
  const [hovered, setHovered] = useState(false);
  const details = artisan.vendorDetails || {};
  const initials = artisan.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: '#fff',
        borderRadius: '14px',
        overflow: 'hidden',
        boxShadow: hovered ? '0 12px 40px rgba(129,11,56,0.18)' : '0 2px 12px rgba(0,0,0,0.08)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top colored band + avatar */}
      <div style={{
        background: 'linear-gradient(135deg, #810B38, #a0522d)',
        padding: '1.5rem 1.5rem 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <div style={{
          width: '80px', height: '80px', borderRadius: '50%',
          border: '3px solid #f0b87a',
          overflow: 'hidden',
          backgroundColor: '#5a0828',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '0',
        }}>
          {details.logoUrl ? (
            <img src={details.logoUrl} alt={artisan.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ color: '#f0b87a', fontSize: '1.5rem', fontWeight: 'bold' }}>{initials}</span>
          )}
        </div>
        {/* Verified badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.3rem',
          backgroundColor: 'rgba(255,255,255,0.15)',
          padding: '0.2rem 0.6rem', borderRadius: '999px',
          marginTop: '0.6rem', marginBottom: '1rem',
        }}>
          <CheckCircle size={12} color="#f0b87a" />
          <span style={{ color: '#f0b87a', fontSize: '0.7rem', letterSpacing: '0.05em' }}>Verified Artisan</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#2d0f06', fontWeight: 'bold', textAlign: 'center' }}>
          {details.storeName || artisan.name}
        </h3>
        {details.storeName && (
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#a0522d', textAlign: 'center' }}>by {artisan.name}</p>
        )}

        {details.craftType && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center', marginTop: '0.25rem' }}>
            <Scissors size={13} color="#810B38" />
            <span style={{ fontSize: '0.85rem', color: '#810B38', fontWeight: 'bold' }}>{details.craftType}</span>
          </div>
        )}

        {details.address && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center' }}>
            <MapPin size={13} color="#7a5c4a" />
            <span style={{ fontSize: '0.8rem', color: '#7a5c4a' }}>{details.address}</span>
          </div>
        )}

        {details.description && (
          <p style={{
            margin: '0.5rem 0 0', fontSize: '0.82rem', color: '#5a3e2b',
            fontStyle: 'italic', lineHeight: 1.6, textAlign: 'center',
            display: '-webkit-box', WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            "{details.description}"
          </p>
        )}

        {/* Shop link */}
        <Link
          to={`/shop?vendor=${artisan._id}`}
          style={{
            display: 'block', textAlign: 'center', marginTop: 'auto', paddingTop: '1rem',
            backgroundColor: hovered ? '#810B38' : 'transparent',
            color: hovered ? '#fff' : '#810B38',
            border: '2px solid #810B38',
            padding: '0.5rem 1rem', borderRadius: '8px',
            fontSize: '0.85rem', textDecoration: 'none',
            fontFamily: 'Georgia, serif', transition: 'all 0.2s ease',
            marginTop: '1rem',
          }}
        >
          View Products →
        </Link>
      </div>
    </div>
  );
};

export default ArtisansPage;