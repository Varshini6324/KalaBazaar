import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Package,
  ShoppingBag,
  IndianRupee,
  Clock,
  Plus,
  TrendingUp,
} from 'lucide-react';

const statCards = [
  {
    key: 'products',
    label: 'Total Products',
    icon: Package,
    color: 'bg-primary/10 text-primary',
    iconBg: 'bg-primary/20',
  },
  {
    key: 'orders',
    label: 'Total Orders',
    icon: ShoppingBag,
    color: 'bg-emerald-50 text-emerald-700',
    iconBg: 'bg-emerald-100',
  },
  {
    key: 'revenue',
    label: 'Total Revenue',
    icon: IndianRupee,
    color: 'bg-amber-50 text-amber-700',
    iconBg: 'bg-amber-100',
  },
  {
    key: 'pending',
    label: 'Pending Orders',
    icon: Clock,
    color: 'bg-blue-50 text-blue-700',
    iconBg: 'bg-blue-100',
  },
];

const VendorDashboard = () => {
  const { user, token } = useSelector((state) => state.auth);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`/api/products?vendor=${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(res.data.data || []);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [user._id, token]);

  const stats = {
    products: products.length,
    orders: 0,
    revenue: '₹0',
    pending: 0,
  };

  const formatValue = (key, value) => {
    if (key === 'revenue') return value;
    return value;
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-serif text-accent">
          Welcome back, <span className="text-primary">{user?.name}</span>
        </h1>
        <p className="text-accent/60 mt-1 text-sm">
          Here's what's happening with your store today.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {statCards.map(({ key, label, icon: Icon, color, iconBg }) => (
          <div
            key={key}
            className={`rounded-xl p-5 ${color} border border-black/5 transition-transform duration-200 hover:scale-[1.02]`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`${iconBg} p-2.5 rounded-lg`}>
                <Icon size={20} />
              </div>
              <TrendingUp size={16} className="opacity-40" />
            </div>
            <p className="text-2xl font-bold">{formatValue(key, stats[key])}</p>
            <p className="text-sm opacity-70 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Recent products */}
      <div className="bg-white rounded-xl border border-secondary/30 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-secondary/20">
          <h2 className="font-serif text-lg text-accent font-semibold">
            Recent Products
          </h2>
          <Link
            to="/vendor/products/add"
            className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            <Plus size={16} />
            Add New
          </Link>
        </div>

        {loading ? (
          <div className="px-5 py-12 text-center text-accent/50">
            <div className="animate-spin w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full mx-auto mb-3" />
            Loading...
          </div>
        ) : products.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <Package size={48} className="mx-auto text-secondary mb-3" />
            <p className="text-accent/60 mb-4">No products yet.</p>
            <Link
              to="/vendor/products/add"
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus size={16} />
              Add Your First Product
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-vendor-bg/50 text-left text-xs font-medium text-accent/60 uppercase tracking-wider">
                  <th className="px-5 py-3">Product</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Price</th>
                  <th className="px-5 py-3">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary/20">
                {products.slice(0, 5).map((product) => (
                  <tr
                    key={product._id}
                    className="hover:bg-vendor-bg/30 transition-colors"
                  >
                    <td className="px-5 py-3 text-sm font-medium text-accent">
                      {product.name}
                    </td>
                    <td className="px-5 py-3 text-sm text-accent/70">
                      {product.category}
                    </td>
                    <td className="px-5 py-3 text-sm text-accent/70">
                      ₹{product.price}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${
                          product.stock > 0
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {product.stock > 0
                          ? `${product.stock} in stock`
                          : 'Out of stock'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {products.length > 5 && (
              <div className="px-5 py-3 border-t border-secondary/20 text-center">
                <Link
                  to="/vendor/products"
                  className="text-sm text-primary font-medium hover:underline"
                >
                  View all {products.length} products →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorDashboard;
