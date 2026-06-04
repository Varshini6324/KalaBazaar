import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  User, 
  ShoppingBag, 
  CreditCard, 
  Settings, 
  ChevronDown, 
  ChevronUp, 
  MapPin, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Sparkles, 
  ArrowRight,
  Shield,
  Phone,
  Mail,
  Loader2,
  Lock
} from 'lucide-react';
import { updateProfile } from '../features/auth/authSlice';

const CustomerDashboard = () => {
  const { user, isAuthenticated, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  
  // Profile update form state
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [updating, setUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        confirmPassword: '',
      });

      // Load orders from localStorage
      const savedOrders = localStorage.getItem(`orders_${user._id}`);
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      } else {
        // Create 2 realistic dummy orders to make the dashboard look beautiful from the start
        const dummyOrders = [
          {
            id: 'ORD-A9F32K8B',
            date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
            items: [
              {
                _id: 'dummy1',
                name: 'Handcrafted Blue Pottery Vase',
                price: 1299,
                quantity: 1,
                image: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&q=80&w=400',
                vendor: 'Jaipur Blue Clay'
              },
              {
                _id: 'dummy2',
                name: 'Traditional Jute Rug (Small)',
                price: 850,
                quantity: 1,
                image: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&q=80&w=400',
                vendor: 'EcoWeaves'
              }
            ],
            billingInfo: {
              fullName: user.name,
              address: 'Block 4, Jubilee Hills',
              city: 'Hyderabad',
              phone: '9876543210'
            },
            subtotal: 2149,
            shippingFee: 0,
            total: 2149,
            status: 'Delivered'
          },
          {
            id: 'ORD-W3P92M5D',
            date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
            items: [
              {
                _id: 'dummy3',
                name: 'Organic Sandalwood Incense Cones',
                price: 250,
                quantity: 3,
                image: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&q=80&w=400',
                vendor: 'Sattvic Aromas'
              }
            ],
            billingInfo: {
              fullName: user.name,
              address: 'Block 4, Jubilee Hills',
              city: 'Hyderabad',
              phone: '9876543210'
            },
            subtotal: 750,
            shippingFee: 99,
            total: 849,
            status: 'Delivered'
          }
        ];
        setOrders(dummyOrders);
        localStorage.setItem(`orders_${user._id}`, JSON.stringify(dummyOrders));
      }
    }
  }, [isAuthenticated, user, navigate]);

  if (!user) return null;

  // Calculate statistics
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrdersCount = orders.length;
  
  // Custom Membership level based on order count
  let membershipLevel = 'Artisan Supporter';
  let membershipColor = 'bg-amber-100 text-amber-800 border-amber-300';
  if (totalOrdersCount >= 5) {
    membershipLevel = 'Elite Collector';
    membershipColor = 'bg-indigo-100 text-indigo-800 border-indigo-300';
  } else if (totalOrdersCount >= 3) {
    membershipLevel = 'Heritage Patron';
    membershipColor = 'bg-primary/10 text-primary border-primary/20';
  }

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleProfileChange = (e) => {
    setProfileData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setErrorMsg('');
    setSuccessMsg('');

    if (profileData.password && profileData.password !== profileData.confirmPassword) {
      setErrorMsg('Passwords do not match.');
      setUpdating(false);
      return;
    }

    try {
      const payload = {
        name: profileData.name,
        email: profileData.email,
      };
      if (profileData.password) {
        payload.password = profileData.password;
      }

      const res = await axios.put('/api/users/profile', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        dispatch(updateProfile({ name: res.data.data.name, email: res.data.data.email }));
        setSuccessMsg('Profile updated successfully!');
        setProfileData(prev => ({ ...prev, password: '', confirmPassword: '' }));
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setUpdating(false);
    }
  };

  const toggleOrderExpand = (id) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-background min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Profile Banner */}
        <div className="bg-white rounded-2xl border border-secondary/30 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 text-primary border-2 border-primary/20 rounded-full flex items-center justify-center text-2xl sm:text-3xl font-serif font-bold shadow-inner">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center flex-wrap gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-serif text-accent m-0 leading-tight">
                  {getGreeting()}, {user.name.split(' ')[0]}
                </h1>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${membershipColor}`}>
                  {membershipLevel}
                </span>
              </div>
              <p className="text-accent/60 text-sm mt-1 sm:mt-1.5 flex items-center gap-1.5">
                <Mail size={14} className="text-secondary" /> {user.email}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
            <button 
              onClick={() => setActiveTab('profile')} 
              className="flex items-center gap-1.5 text-xs font-semibold bg-secondary/20 hover:bg-secondary/40 text-accent px-4 py-2.5 rounded-lg border border-secondary/40 cursor-pointer transition-colors"
            >
              <Settings size={14} /> Edit Profile
            </button>
            <Link 
              to="/shop" 
              className="flex items-center gap-1.5 text-xs font-semibold bg-primary text-background hover:bg-primary/95 px-4 py-2.5 rounded-lg shadow-sm hover:shadow transition-colors"
            >
              Shop Crafts <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Dashboard Tabs & Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Dashboard Navigation Sidebar */}
          <div className="lg:col-span-1 space-y-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all border cursor-pointer text-left ${
                activeTab === 'overview'
                  ? 'bg-accent text-background border-accent shadow-md shadow-accent/10'
                  : 'bg-white text-accent hover:bg-secondary/20 border-secondary/30'
              }`}
            >
              <Sparkles size={18} />
              <span>Overview</span>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all border cursor-pointer text-left ${
                activeTab === 'orders'
                  ? 'bg-accent text-background border-accent shadow-md shadow-accent/10'
                  : 'bg-white text-accent hover:bg-secondary/20 border-secondary/30'
              }`}
            >
              <ShoppingBag size={18} />
              <span>My Orders</span>
              {orders.length > 0 && (
                <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
                  activeTab === 'orders' ? 'bg-background/20 text-background' : 'bg-primary/10 text-primary'
                }`}>
                  {orders.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all border cursor-pointer text-left ${
                activeTab === 'profile'
                  ? 'bg-accent text-background border-accent shadow-md shadow-accent/10'
                  : 'bg-white text-accent hover:bg-secondary/20 border-secondary/30'
              }`}
            >
              <User size={18} />
              <span>Account Settings</span>
            </button>
          </div>

          {/* Active Tab Component */}
          <div className="lg:col-span-3">
            
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                
                {/* Statistics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white p-5 rounded-xl border border-secondary/30 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                      <ShoppingBag size={22} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-accent/50 uppercase tracking-wider">Total Orders</p>
                      <h3 className="text-2xl font-serif font-bold text-accent mt-0.5">{totalOrdersCount}</h3>
                    </div>
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-secondary/30 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                      <CreditCard size={22} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-accent/50 uppercase tracking-wider">Total Invested</p>
                      <h3 className="text-2xl font-serif font-bold text-accent mt-0.5">₹{totalSpent.toLocaleString('en-IN')}</h3>
                    </div>
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-secondary/30 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600">
                      <Shield size={22} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-accent/50 uppercase tracking-wider">Patron Status</p>
                      <h3 className="text-lg font-serif font-bold text-accent mt-0.5 truncate">{membershipLevel}</h3>
                    </div>
                  </div>
                </div>

                {/* Banner & Bio */}
                <div className="bg-white rounded-xl border border-secondary/30 p-6 shadow-sm relative overflow-hidden">
                  <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-48 h-48 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
                  <h3 className="text-lg font-serif text-primary font-bold mb-2 flex items-center gap-2">
                    🏮 Embracing Heritage & Crafts
                  </h3>
                  <p className="text-sm text-accent/80 leading-relaxed mb-4">
                    By purchasing from kalaBazaar, you are directly funding rural artisans, keeping ancient traditional techniques alive, and preserving unique cultural heritage. Every thread, glaze, and carve tells a story of years of hard-earned craftsmanship. Thank you for your continued support!
                  </p>
                  <Link to="/shop" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                    Discover new handcrafted masterpieces <ArrowRight size={12} />
                  </Link>
                </div>

                {/* Recent Order Preview */}
                <div className="bg-white rounded-xl border border-secondary/30 shadow-sm overflow-hidden">
                  <div className="border-b border-secondary/20 px-5 py-4 bg-vendor-bg/30 flex justify-between items-center">
                    <h3 className="text-sm font-serif font-semibold text-accent">Recent Order Activity</h3>
                    <button onClick={() => setActiveTab('orders')} className="text-xs text-primary font-semibold hover:underline">
                      View all orders
                    </button>
                  </div>
                  {orders.length === 0 ? (
                    <div className="p-8 text-center text-accent/50 text-sm">
                      No order activity yet.
                    </div>
                  ) : (
                    <div className="divide-y divide-secondary/10">
                      {orders.slice(0, 1).map((order) => (
                        <div key={order.id} className="p-5 space-y-4">
                          <div className="flex justify-between items-start flex-wrap gap-2 text-xs">
                            <div>
                              <p className="text-accent/40 font-medium">Order ID</p>
                              <p className="font-bold text-accent mt-0.5">{order.id}</p>
                            </div>
                            <div>
                              <p className="text-accent/40 font-medium">Date Placed</p>
                              <p className="font-semibold text-accent mt-0.5">{formatDate(order.date)}</p>
                            </div>
                            <div>
                              <p className="text-accent/40 font-medium">Status</p>
                              <span className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-full mt-0.5 ${
                                order.status === 'Delivered' 
                                  ? 'bg-emerald-50 text-emerald-700' 
                                  : 'bg-indigo-50 text-indigo-700 animate-pulse'
                              }`}>
                                {order.status === 'Delivered' ? <CheckCircle size={10} /> : <Clock size={10} />}
                                {order.status}
                              </span>
                            </div>
                            <div>
                              <p className="text-accent/40 font-medium">Total Price</p>
                              <p className="font-bold text-primary mt-0.5">₹{order.total.toLocaleString('en-IN')}</p>
                            </div>
                          </div>
                          
                          {/* Order Products Preview */}
                          <div className="flex gap-4 overflow-x-auto py-1">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-3 bg-secondary/10 rounded-lg p-2.5 min-w-[240px] border border-secondary/20">
                                <div className="w-12 h-12 rounded bg-white overflow-hidden shrink-0 border border-secondary/30">
                                  {item.image ? (
                                    <img src={item.image} alt={item.name} className="w-100 h-100 object-cover" />
                                  ) : (
                                    <div className="w-100 h-100 flex items-center justify-center text-lg">🪔</div>
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs font-bold text-accent truncate">{item.name}</p>
                                  <p className="text-[10px] text-accent/50 truncate">by {item.vendor}</p>
                                  <p className="text-[11px] font-semibold text-primary mt-0.5">
                                    ₹{item.price} × {item.quantity}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* MY ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <div className="mb-2">
                  <h2 className="text-xl font-serif text-accent m-0">Purchase History</h2>
                  <p className="text-accent/60 text-xs mt-1">Review detail logs of your handmade purchases</p>
                </div>
                {orders.length === 0 ? (
                  <div className="bg-white rounded-xl border border-secondary/30 p-12 text-center shadow-sm">
                    <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ShoppingBag size={28} className="text-secondary" />
                    </div>
                    <h3 className="font-serif text-lg text-accent mb-2">No orders placed yet</h3>
                    <p className="text-accent/50 text-sm max-w-sm mx-auto mb-6">
                      Discover and support traditional artisans from all across the country.
                    </p>
                    <Link to="/shop" className="btn-primary inline-block text-xs font-semibold py-2.5 px-6">
                      Explore Products
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => {
                      const isExpanded = expandedOrderId === order.id;
                      return (
                        <div key={order.id} className="bg-white rounded-xl border border-secondary/30 shadow-sm overflow-hidden transition-all duration-300">
                          
                          {/* Order Brief Row */}
                          <div 
                            onClick={() => toggleOrderExpand(order.id)} 
                            className="p-5 flex flex-wrap justify-between items-center gap-4 cursor-pointer hover:bg-secondary/5 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-primary/5 rounded-lg flex items-center justify-center text-primary border border-primary/10">
                                <ShoppingBag size={18} />
                              </div>
                              <div>
                                <h4 className="text-sm font-bold text-accent m-0">{order.id}</h4>
                                <p className="text-xs text-accent/50 mt-0.5">{formatDate(order.date)}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-6">
                              <div className="text-right hidden sm:block">
                                <p className="text-xs text-accent/40">Total Amount</p>
                                <p className="text-sm font-bold text-primary mt-0.5">₹{order.total.toLocaleString('en-IN')}</p>
                              </div>
                              <div>
                                <span className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full ${
                                  order.status === 'Delivered' 
                                    ? 'bg-emerald-100 text-emerald-800' 
                                    : 'bg-indigo-100 text-indigo-800 animate-pulse'
                                }`}>
                                  {order.status === 'Delivered' ? <CheckCircle size={12} /> : <Clock size={12} />}
                                  {order.status}
                                </span>
                              </div>
                              <div className="text-accent/40">
                                {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                              </div>
                            </div>
                          </div>

                          {/* Expanded Order Details */}
                          {isExpanded && (
                            <div className="border-t border-secondary/20 bg-vendor-bg/10 p-5 space-y-6">
                              
                              {/* Order Items Table */}
                              <div className="space-y-3">
                                <h4 className="text-xs font-semibold text-accent/50 uppercase tracking-wider">Ordered Items</h4>
                                <div className="space-y-2.5">
                                  {order.items.map((item, idx) => (
                                    <div key={idx} className="bg-white rounded-lg border border-secondary/20 p-3 flex justify-between items-center gap-4 shadow-sm">
                                      <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded overflow-hidden shrink-0 border border-secondary/30 bg-secondary/10">
                                          {item.image ? (
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                          ) : (
                                            <div className="w-full h-full flex items-center justify-center text-lg">🪔</div>
                                          )}
                                        </div>
                                        <div>
                                          <p className="text-xs sm:text-sm font-bold text-accent">{item.name}</p>
                                          <p className="text-[10px] sm:text-xs text-accent/50">Crafted by: <span className="text-primary font-medium">{item.vendor}</span></p>
                                        </div>
                                      </div>
                                      <div className="text-right shrink-0">
                                        <p className="text-xs sm:text-sm font-bold text-accent">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                                        <p className="text-[10px] sm:text-xs text-accent/40">₹{item.price} × {item.quantity}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                
                                {/* Delivery Address */}
                                <div className="bg-white p-4 rounded-lg border border-secondary/20 shadow-sm space-y-2.5">
                                  <h4 className="text-xs font-semibold text-accent/50 uppercase tracking-wider flex items-center gap-1">
                                    <MapPin size={12} className="text-secondary" /> Delivery details
                                  </h4>
                                  <div className="text-xs text-accent/80 space-y-1">
                                    <p className="font-bold text-accent">{order.billingInfo.fullName}</p>
                                    <p>{order.billingInfo.address}</p>
                                    <p>{order.billingInfo.city}</p>
                                    <p className="pt-1 flex items-center gap-1.5 text-accent/60">
                                      <Phone size={10} className="text-secondary" /> {order.billingInfo.phone}
                                    </p>
                                  </div>
                                </div>

                                {/* Cost Breakdown */}
                                <div className="bg-white p-4 rounded-lg border border-secondary/20 shadow-sm space-y-2.5">
                                  <h4 className="text-xs font-semibold text-accent/50 uppercase tracking-wider">Payment Breakdown</h4>
                                  <div className="text-xs text-accent/80 space-y-2">
                                    <div className="flex justify-between">
                                      <span>Items Subtotal</span>
                                      <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Delivery Fee</span>
                                      <span>{order.shippingFee === 0 ? <span className="text-emerald-600 font-medium">FREE</span> : `₹${order.shippingFee}`}</span>
                                    </div>
                                    <div className="flex justify-between border-t border-secondary/20 pt-2 font-bold text-accent text-sm">
                                      <span>Grand Total</span>
                                      <span className="text-primary">₹{order.total.toLocaleString('en-IN')}</span>
                                    </div>
                                  </div>
                                </div>

                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-xl border border-secondary/30 p-6 shadow-sm space-y-6">
                <div>
                  <h2 className="text-xl font-serif text-accent m-0">Profile Settings</h2>
                  <p className="text-accent/60 text-xs mt-1">Manage your basic customer credentials</p>
                </div>

                {successMsg && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg text-xs flex items-center gap-1.5">
                    <CheckCircle size={14} /> {successMsg}
                  </div>
                )}
                {errorMsg && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-xs">
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-accent/70 mb-1.5">Full Name</label>
                      <div className="relative">
                        <input
                          type="text"
                          name="name"
                          value={profileData.name}
                          onChange={handleProfileChange}
                          required
                          className="w-full pl-9 pr-4 py-2 border border-secondary/40 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all text-accent"
                        />
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-accent/40" size={14} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-accent/70 mb-1.5">Email Address</label>
                      <div className="relative">
                        <input
                          type="email"
                          name="email"
                          value={profileData.email}
                          onChange={handleProfileChange}
                          required
                          className="w-full pl-9 pr-4 py-2 border border-secondary/40 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all text-accent"
                        />
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-accent/40" size={14} />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-secondary/10 pt-4 mt-2">
                    <h3 className="text-xs font-semibold text-accent/50 uppercase tracking-wider mb-3 flex items-center gap-1">
                      <Lock size={12} className="text-secondary" /> Change Password (Optional)
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-medium text-accent/60 mb-1.5">New Password</label>
                        <input
                          type="password"
                          name="password"
                          value={profileData.password}
                          onChange={handleProfileChange}
                          placeholder="Leave blank to keep current"
                          className="w-full px-4 py-2 border border-secondary/40 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all text-accent"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-accent/60 mb-1.5">Confirm Password</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={profileData.confirmPassword}
                          onChange={handleProfileChange}
                          placeholder="Leave blank to keep current"
                          className="w-full px-4 py-2 border border-secondary/40 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all text-accent"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-3 border-t border-secondary/10">
                    <button
                      type="submit"
                      disabled={updating}
                      className="btn-primary inline-flex items-center gap-1.5 text-xs px-5 py-2.5 disabled:opacity-60 cursor-pointer"
                    >
                      {updating ? (
                        <><Loader2 size={12} className="animate-spin" /> Saving Changes...</>
                      ) : (
                        <>Save Changes</>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

export default CustomerDashboard;
