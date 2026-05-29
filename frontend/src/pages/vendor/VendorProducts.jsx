import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Plus,
  Pencil,
  Trash2,
  Package,
  Search,
} from 'lucide-react';

const VendorProducts = () => {
  const { user, token } = useSelector((state) => state.auth);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    fetchProducts();
  }, [user._id, token]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts((prev) => prev.filter((p) => p._id !== id));
      setDeleteId(null);
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete product');
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-serif text-accent">My Products</h1>
          <p className="text-accent/60 text-sm mt-1">
            Manage your product catalog
          </p>
        </div>
        <Link
          to="/vendor/products/add"
          className="btn-primary inline-flex items-center gap-2 w-fit"
        >
          <Plus size={18} />
          Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-accent/40"
        />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-secondary/40 rounded-lg
                     text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50
                     transition-all"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-secondary/30 overflow-hidden">
        {loading ? (
          <div className="px-5 py-16 text-center text-accent/50">
            <div className="animate-spin w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full mx-auto mb-3" />
            Loading products...
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <Package size={48} className="mx-auto text-secondary mb-3" />
            <p className="text-accent/60 mb-1 font-medium">
              {search ? 'No products match your search' : 'No products yet'}
            </p>
            {!search && (
              <Link
                to="/vendor/products/add"
                className="text-sm text-primary font-medium hover:underline mt-2 inline-block"
              >
                Add your first product →
              </Link>
            )}
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
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary/20">
                {filtered.map((product) => (
                  <tr
                    key={product._id}
                    className="hover:bg-vendor-bg/30 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover border border-secondary/30"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-secondary/30 flex items-center justify-center">
                            <Package size={16} className="text-accent/40" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-accent">
                            {product.name}
                          </p>
                          {product.storySnippet && (
                            <p className="text-xs text-accent/50 truncate max-w-[200px]">
                              {product.storySnippet}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-medium bg-secondary/30 text-accent/80 px-2.5 py-1 rounded-full">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-accent/80 font-medium">
                      ₹{product.price}
                    </td>
                    <td className="px-5 py-3.5">
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
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() =>
                            navigate(`/vendor/products/edit/${product._id}`)
                          }
                          className="p-2 rounded-lg text-accent/60 hover:text-primary hover:bg-primary/10 transition-all"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteId(product._id)}
                          className="p-2 rounded-lg text-accent/60 hover:text-red-600 hover:bg-red-50 transition-all"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="font-serif text-lg text-accent font-semibold mb-2">
              Delete Product?
            </h3>
            <p className="text-sm text-accent/60 mb-6">
              This action cannot be undone. The product will be permanently
              removed from your catalog.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteId(null)}
                className="btn-secondary text-sm px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium
                           hover:bg-red-700 transition-colors shadow-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorProducts;
