import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { ShoppingCart, Zap, ArrowLeft, Star, Plus, Minus, CheckCircle, Package, Truck, Shield } from 'lucide-react';
// Cart feature not present in this project right now
// import { addToCart } from '../features/cart/cartSlice';

const StarRow = ({ rating, count }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
    {[1, 2, 3, 4, 5].map((s) => (
      <Star key={s} size={16} fill={s <= Math.round(rating) ? '#f0a500' : 'none'} color={s <= Math.round(rating) ? '#f0a500' : '#ccc'} />
    ))}
    <span style={{ fontSize: '0.85rem', color: '#7a5c4a', marginLeft: '0.25rem' }}>
      {rating?.toFixed(1)} · {count} {count === 1 ? 'review' : 'reviews'}
    </span>
  </div>
);

const TrustBadge = ({ icon: Icon, label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b3a2a', fontSize: '0.78rem' }}>
    <Icon size={15} color="#810B38" />{label}
  </div>
);

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [toast, setToast] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data.data || data);
      } catch (err) {
        setError(err.response?.data?.message || 'Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const handleAddToCart = () => { dispatch(addToCart({ ...product, quantity: qty })); showToast('Added to cart!'); };
  const handleBuyNow = () => { dispatch(addToCart({ ...product, quantity: qty })); navigate('/cart'); };

  const S = { fontFamily: 'Georgia, serif' };

  if (loading) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F1E2D1', display: 'flex', alignItems: 'center', justifyContent: 'center', ...S }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, border: '4px solid #d4a574', borderTopColor: '#810B38', borderRadius: '50%', margin: '0 auto 1rem', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ color: '#810B38', fontStyle: 'italic' }}>Loading product...</p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );

  if (error) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F1E2D1', display: 'flex', alignItems: 'center', justifyContent: 'center', ...S }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🪔</p>
        <p style={{ color: '#810B38', fontSize: '1.1rem', marginBottom: '1.5rem' }}>{error}</p>
        <button onClick={() => navigate('/shop')} style={{ padding: '0.6rem 1.5rem', backgroundColor: '#810B38', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', ...S }}>
          Back to Shop
        </button>
      </div>
    </div>
  );

  const images = product.images?.length ? product.images : [null];
  const vendorName = product.vendor?.vendorDetails?.storeName || product.vendor?.name || 'Artisan';
  const inStock = product.stock > 0;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F1E2D1', ...S }}>

      {/* Breadcrumb */}
      <div style={{ backgroundColor: '#810B38', padding: '0.75rem 1.5rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'none', border: 'none', color: '#e8c9a0', cursor: 'pointer', fontSize: '0.85rem', ...S, padding: 0 }}>
            <ArrowLeft size={14} /> Back to Shop
          </button>
          <span style={{ color: '#e8c9a0', opacity: 0.4 }}>›</span>
          <span style={{ color: '#e8c9a0', fontSize: '0.85rem', opacity: 0.75 }}>{product.category}</span>
          <span style={{ color: '#e8c9a0', opacity: 0.4 }}>›</span>
          <span style={{ color: '#fff', fontSize: '0.85rem' }}>{product.name}</span>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2.5rem 1.5rem' }}>

        {/* Main card */}
        <div style={{ backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 32px rgba(129,11,56,0.10)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))' }}>

          {/* LEFT: Image */}
          <div style={{ backgroundColor: '#fdf6ef', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ borderRadius: 12, overflow: 'hidden', backgroundColor: '#f5e6d3', aspectRatio: '1/1', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {images[activeImg] ? (
                <img src={images[activeImg]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ textAlign: 'center', color: '#c4996a' }}>
                  <div style={{ fontSize: '5rem' }}>🪔</div>
                  <p style={{ fontSize: '0.8rem', fontStyle: 'italic' }}>No image available</p>
                </div>
              )}
              <span style={{ position: 'absolute', top: 12, left: 12, backgroundColor: '#810B38', color: '#fff', padding: '0.2rem 0.7rem', borderRadius: 999, fontSize: '0.7rem', letterSpacing: '0.06em' }}>
                {product.category}
              </span>
              {!inStock && (
                <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.1rem', letterSpacing: '0.12em' }}>OUT OF STOCK</span>
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)} style={{ width: 60, height: 60, borderRadius: 8, overflow: 'hidden', padding: 0, cursor: 'pointer', border: `2px solid ${activeImg === i ? '#810B38' : '#d4a574'}`, backgroundColor: '#f5e6d3' }}>
                    {img ? <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '1.5rem' }}>🪔</span>}
                  </button>
                ))}
              </div>
            )}

            <div style={{ padding: '0.9rem 1rem', backgroundColor: '#fff7f0', border: '1px solid #e8d5c0', borderRadius: 10, display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              <TrustBadge icon={CheckCircle} label="Authentic handmade product" />
              <TrustBadge icon={Package} label="Carefully packed & shipped" />
              <TrustBadge icon={Truck} label="Free shipping above ₹999" />
              <TrustBadge icon={Shield} label="Secure checkout" />
            </div>
          </div>

          {/* RIGHT: Details + Actions */}
          <div style={{ padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            <p style={{ margin: 0, color: '#a0522d', fontSize: '0.78rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>by {vendorName}</p>

            <h1 style={{ margin: 0, fontSize: 'clamp(1.6rem,4vw,2.2rem)', color: '#2d0f06', fontWeight: 'bold', lineHeight: 1.2 }}>
              {product.name}
            </h1>

            {product.numReviews > 0 && <StarRow rating={product.rating} count={product.numReviews} />}

            {product.storySnippet && (
              <p style={{ margin: 0, fontStyle: 'italic', color: '#7a5c4a', fontSize: '0.9rem', lineHeight: 1.7, borderLeft: '3px solid #d4a574', paddingLeft: '0.75rem' }}>
                "{product.storySnippet}"
              </p>
            )}

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
              <span style={{ fontSize: '2.2rem', fontWeight: 'bold', color: '#810B38' }}>₹{product.price?.toLocaleString('en-IN')}</span>
              <span style={{ fontSize: '0.8rem', color: '#a0785a' }}>incl. all taxes</span>
            </div>

            {inStock ? (
              <span style={{ display: 'inline-block', backgroundColor: '#f0faf0', border: '1px solid #86c98a', color: '#2d7a33', borderRadius: 999, padding: '0.2rem 0.85rem', fontSize: '0.78rem', alignSelf: 'flex-start' }}>
                ✓ In Stock — {product.stock} available
              </span>
            ) : (
              <span style={{ display: 'inline-block', backgroundColor: '#fff2f2', border: '1px solid #f5a0a0', color: '#c0392b', borderRadius: 999, padding: '0.2rem 0.85rem', fontSize: '0.78rem', alignSelf: 'flex-start' }}>
                ✗ Out of Stock
              </span>
            )}

            <div style={{ borderTop: '1px solid #f0ddd0' }} />

            {/* Qty */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#5a3e2b', fontWeight: 'bold' }}>Qty:</span>
              <div style={{ display: 'flex', alignItems: 'center', border: '2px solid #d4a574', borderRadius: 10, overflow: 'hidden' }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} disabled={!inStock} style={{ width: 38, height: 38, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#810B38' }}>
                  <Minus size={14} />
                </button>
                <span style={{ width: 36, textAlign: 'center', fontWeight: 'bold', color: '#2d0f06' }}>{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} disabled={!inStock} style={{ width: 38, height: 38, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#810B38' }}>
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={handleAddToCart} disabled={!inStock}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', border: '2px solid #810B38', backgroundColor: 'transparent', color: '#810B38', padding: '0.85rem 1rem', borderRadius: 10, fontSize: '0.9rem', ...S, cursor: inStock ? 'pointer' : 'not-allowed', opacity: inStock ? 1 : 0.4, fontWeight: 'bold' }}
              >
                <ShoppingCart size={17} /> Add to Cart
              </button>
              <button
                onClick={handleBuyNow} disabled={!inStock}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', backgroundColor: inStock ? '#810B38' : '#ccc', color: '#fff', border: 'none', padding: '0.85rem 1rem', borderRadius: 10, fontSize: '0.9rem', ...S, cursor: inStock ? 'pointer' : 'not-allowed', fontWeight: 'bold', boxShadow: inStock ? '0 4px 16px rgba(129,11,56,0.28)' : 'none' }}
              >
                <Zap size={17} /> Buy Now
              </button>
            </div>

            {toast && (
              <div style={{ backgroundColor: '#f0faf0', border: '1px solid #86c98a', color: '#2d7a33', borderRadius: 8, padding: '0.6rem 1rem', fontSize: '0.85rem', textAlign: 'center', animation: 'fadeIn 0.3s ease' }}>
                🛒 {toast}
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ backgroundColor: '#fff', borderRadius: 16, marginTop: '1.5rem', overflow: 'hidden', boxShadow: '0 2px 16px rgba(129,11,56,0.07)' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid #f0ddd0' }}>
            {[
              { key: 'description', label: 'Description' },
              { key: 'story', label: 'Artisan Story' },
              { key: 'reviews', label: `Reviews (${product.numReviews || 0})` },
            ].map(({ key, label }) => (
              <button key={key} onClick={() => setActiveTab(key)} style={{ padding: '1rem 1.5rem', background: 'none', border: 'none', borderBottom: `2px solid ${activeTab === key ? '#810B38' : 'transparent'}`, cursor: 'pointer', ...S, fontSize: '0.9rem', fontWeight: activeTab === key ? 'bold' : 'normal', color: activeTab === key ? '#810B38' : '#7a5c4a', marginBottom: '-1px' }}>
                {label}
              </button>
            ))}
          </div>

          <div style={{ padding: '2rem' }}>
            {activeTab === 'description' && (
              <p style={{ margin: 0, color: '#5a3e2b', lineHeight: 1.8, fontSize: '0.95rem', maxWidth: 700 }}>
                {product.description || 'No description provided.'}
              </p>
            )}

            {activeTab === 'story' && (
              product.storySnippet
                ? <p style={{ margin: 0, fontStyle: 'italic', color: '#5a3e2b', lineHeight: 1.8, fontSize: '0.95rem', maxWidth: 700 }}>"{product.storySnippet}"</p>
                : <p style={{ margin: 0, color: '#a07a5a', fontStyle: 'italic' }}>No artisan story available for this product.</p>
            )}

            {activeTab === 'reviews' && (
              product.reviews?.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {product.reviews.map((r, i) => (
                    <div key={i} style={{ backgroundColor: '#fdf6ef', borderRadius: 10, padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: '#810B38', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 'bold' }}>
                          {r.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p style={{ margin: 0, fontWeight: 'bold', color: '#2d0f06', fontSize: '0.9rem' }}>{r.name || 'Customer'}</p>
                          <div style={{ display: 'flex', gap: 2, marginTop: 2 }}>
                            {[1,2,3,4,5].map(s => <Star key={s} size={12} fill={s <= r.rating ? '#f0a500' : 'none'} color={s <= r.rating ? '#f0a500' : '#ccc'} />)}
                          </div>
                        </div>
                      </div>
                      <p style={{ margin: 0, color: '#5a3e2b', fontSize: '0.88rem', lineHeight: 1.6 }}>{r.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ margin: 0, color: '#a07a5a', fontStyle: 'italic' }}>No reviews yet. Be the first to review this product!</p>
              )
            )}
          </div>
        </div>
      </div>

      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
};

export default ProductDetailPage;