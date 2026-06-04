import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, CheckCircle, ShoppingBag } from 'lucide-react';
import { removeFromCart, updateQuantity, clearCart } from '../features/cart/cartSlice';

const CartPage = () => {
  const { cartItems } = useSelector((state) => state.cart || { cartItems: [] });
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [checkoutStep, setCheckoutStep] = useState(null); // 'billing' | 'success' | null
  const [billingInfo, setBillingInfo] = useState({
    fullName: '',
    address: '',
    city: '',
    phone: '',
  });

  const S = { fontFamily: 'Georgia, serif' };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingFee = subtotal > 999 || subtotal === 0 ? 0 : 99;
  const total = subtotal + shippingFee;

  const handleQtyChange = (_id, quantity, stock) => {
    if (quantity < 1) return;
    if (stock !== undefined && quantity > stock) return;
    dispatch(updateQuantity({ _id, quantity }));
  };

  const handleRemove = (_id) => {
    dispatch(removeFromCart(_id));
  };

  const handleBillingSubmit = (e) => {
    e.preventDefault();

    try {
      const userId = user ? user._id : 'guest';
      const orderId = 'ORD-' + Math.random().toString(36).substring(2, 11).toUpperCase();
      const newOrder = {
        id: orderId,
        date: new Date().toISOString(),
        items: cartItems.map(item => ({
          _id: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.images?.[0] || null,
          vendor: item.vendor?.vendorDetails?.storeName || item.vendor?.name || 'Artisan'
        })),
        billingInfo: { ...billingInfo },
        subtotal: subtotal,
        shippingFee: shippingFee,
        total: total,
        status: 'Processing'
      };

      const existingOrders = JSON.parse(localStorage.getItem(`orders_${userId}`)) || [];
      existingOrders.unshift(newOrder);
      localStorage.setItem(`orders_${userId}`, JSON.stringify(existingOrders));
    } catch (err) {
      console.error('Failed to save order history:', err);
    }

    setCheckoutStep('success');
  };

  const handleCompleteCheckout = () => {
    dispatch(clearCart());
    setCheckoutStep(null);
    navigate('/shop');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F1E2D1', paddingBottom: '4rem', ...S }}>
      {/* Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #810B38 0%, #5a0828 100%)',
        padding: '2.5rem 1.5rem',
        textAlign: 'center',
        position: 'relative'
      }}>
        <h1 style={{ color: '#fff', fontSize: '2.25rem', margin: 0, fontWeight: 'bold' }}>
          Your Craft Basket
        </h1>
        <p style={{ color: '#e8c9a0', margin: '0.5rem 0 0 0', fontSize: '0.95rem' }}>
          Review and checkout your handcrafted treasures
        </p>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Back Link */}
        <Link to="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#810B38', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          <ArrowLeft size={16} /> Back to Shop
        </Link>

        {cartItems.length === 0 ? (
          <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '4rem 2rem', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <ShoppingBag size={64} style={{ color: '#d4a574', margin: '0 auto 1.5rem' }} />
            <h2 style={{ fontSize: '1.5rem', color: '#2d0f06', margin: '0 0 0.5rem 0' }}>Your basket is empty</h2>
            <p style={{ color: '#7a5c4a', margin: '0 0 2rem 0' }}>Explore our marketplace to find one-of-a-kind artisan creations.</p>
            <Link to="/shop" style={{ display: 'inline-block', backgroundColor: '#810B38', color: '#fff', textDecoration: 'none', padding: '0.8rem 2rem', borderRadius: '8px', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(129,11,56,0.2)' }}>
              Start Shopping
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'start' }}>
            
            {/* Cart Items List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {cartItems.map((item) => {
                const img = item.images?.[0] || null;
                const artisan = item.vendor?.vendorDetails?.storeName || item.vendor?.name || 'Artisan';
                return (
                  <div key={item._id} style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '1rem', display: 'flex', gap: '1rem', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', position: 'relative' }}>
                    
                    {/* Product Image */}
                    <div style={{ width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#f5e6d3', shrink: 0 }}>
                      {img ? (
                        <img src={img} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>🪔</div>
                      )}
                    </div>

                    {/* Details */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1rem', color: '#2d0f06', fontWeight: 'bold' }}>{item.name}</h3>
                        <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.75rem', color: '#a0522d' }}>by {artisan}</p>
                      </div>

                      {/* Quantity Controls */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d4a574', borderRadius: '6px', overflow: 'hidden', height: '28px' }}>
                          <button 
                            onClick={() => handleQtyChange(item._id, item.quantity - 1, item.stock)}
                            style={{ width: '28px', height: '28px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#810B38' }}
                          >
                            <Minus size={12} />
                          </button>
                          <span style={{ minWidth: '24px', textAlign: 'center', fontSize: '0.85rem', fontWeight: 'bold', color: '#2d0f06' }}>{item.quantity}</span>
                          <button 
                            onClick={() => handleQtyChange(item._id, item.quantity + 1, item.stock)}
                            style={{ width: '28px', height: '28px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#810B38' }}
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: '#7a5c4a' }}>
                          {item.stock !== undefined ? `${item.stock} in stock` : ''}
                        </span>
                      </div>
                    </div>

                    {/* Price and Delete */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'end', justifyContent: 'space-between', minWidth: '80px' }}>
                      <button 
                        onClick={() => handleRemove(item._id)}
                        style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#aaa', transition: 'color 0.2s' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#e74c3c'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#aaa'}
                        title="Remove"
                      >
                        <Trash2 size={18} />
                      </button>
                      <span style={{ fontWeight: 'bold', color: '#810B38', fontSize: '1.05rem' }}>
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Checkout Summary panel */}
            <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h2 style={{ fontSize: '1.3rem', color: '#2d0f06', margin: 0, fontWeight: 'bold', borderBottom: '1px solid #f0ddd0', paddingBottom: '0.75rem' }}>
                Summary
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: '#5a3e2b' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Items Subtotal</span>
                  <strong>₹{subtotal.toLocaleString('en-IN')}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Delivery Charges</span>
                  <strong>{shippingFee === 0 ? <span style={{ color: '#2d7a33' }}>FREE</span> : `₹${shippingFee}`}</strong>
                </div>
                {shippingFee > 0 && (
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#a0522d', fontStyle: 'italic' }}>
                    Add ₹{1000 - subtotal} more to unlock FREE shipping!
                  </p>
                )}
              </div>

              <div style={{ borderTop: '1px solid #f0ddd0', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', color: '#2d0f06', fontWeight: 'bold' }}>
                <span>Grand Total</span>
                <span style={{ color: '#810B38' }}>₹{total.toLocaleString('en-IN')}</span>
              </div>

              <button 
                onClick={() => setCheckoutStep('billing')}
                style={{ backgroundColor: '#810B38', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.9rem', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', transition: 'background-color 0.2s', width: '100%', textAlign: 'center', boxShadow: '0 4px 12px rgba(129,11,56,0.2)' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6b092f'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#810B38'}
              >
                Proceed to Checkout
              </button>
            </div>

          </div>
        )}
      </div>

      {/* Billing Modal Dialog */}
      {checkoutStep === 'billing' && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '2rem', maxWidth: '450px', width: '100%', boxShadow: '0 8px 32px rgba(0,0,0,0.15)', maxH: '90vh', overflowY: 'auto' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontStyle: 'normal', fontSize: '1.4rem', color: '#2d0f06', fontWeight: 'bold' }}>
              Shipping & Delivery
            </h3>
            <p style={{ color: '#7a5c4a', margin: '0 0 1.5rem 0', fontSize: '0.85rem' }}>
              Please enter your shipping address details.
            </p>

            <form onSubmit={handleBillingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', color: '#5a3e2b', marginBottom: '0.25rem' }}>Full Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. John Doe"
                  value={billingInfo.fullName}
                  onChange={(e) => setBillingInfo({ ...billingInfo, fullName: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', border: '1px solid #d4a574', borderRadius: '6px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', color: '#5a3e2b', marginBottom: '0.25rem' }}>Street Address</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. 123 Artisan Lane"
                  value={billingInfo.address}
                  onChange={(e) => setBillingInfo({ ...billingInfo, address: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', border: '1px solid #d4a574', borderRadius: '6px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', color: '#5a3e2b', marginBottom: '0.25rem' }}>City</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Hyderabad"
                    value={billingInfo.city}
                    onChange={(e) => setBillingInfo({ ...billingInfo, city: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', border: '1px solid #d4a574', borderRadius: '6px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', color: '#5a3e2b', marginBottom: '0.25rem' }}>Phone</label>
                  <input 
                    type="tel" 
                    required
                    placeholder="e.g. 9876543210"
                    value={billingInfo.phone}
                    onChange={(e) => setBillingInfo({ ...billingInfo, phone: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', border: '1px solid #d4a574', borderRadius: '6px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'end' }}>
                <button 
                  type="button" 
                  onClick={() => setCheckoutStep(null)}
                  style={{ padding: '0.6rem 1.25rem', border: '1px solid #d4a574', background: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={{ padding: '0.6rem 1.5rem', border: 'none', backgroundColor: '#810B38', color: '#fff', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 'bold' }}
                >
                  Place Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal Dialog */}
      {checkoutStep === 'success' && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 101, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '2.5rem 2rem', maxWidth: '400px', width: '100%', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
            <CheckCircle size={56} style={{ color: '#2d7a33', margin: '0 auto 1rem' }} />
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', color: '#2d0f06', fontWeight: 'bold' }}>
              Order Placed!
            </h3>
            <p style={{ color: '#5a3e2b', fontSize: '0.9rem', lineHeight: 1.6, margin: '0 0 2rem 0' }}>
              Thank you, <strong>{billingInfo.fullName}</strong>! Your order of <strong>₹{total.toLocaleString('en-IN')}</strong> has been registered successfully. Our artisans are getting it ready for you!
            </p>
            <button 
              onClick={handleCompleteCheckout}
              style={{ backgroundColor: '#810B38', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.8rem 2.5rem', fontSize: '0.95rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(129,11,56,0.25)' }}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
