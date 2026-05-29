import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

const categories = ['Textiles', 'Pottery', 'Jewelry', 'Woodwork', 'Metalwork', 'Other'];

const emptyForm = {
  name: '',
  description: '',
  price: '',
  category: '',
  images: '',
  stock: '',
  storySnippet: '',
  artisanStory: '',
};

const VendorProductForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      const fetchProduct = async () => {
        try {
          const res = await axios.get(`/api/products/${id}`);
          const p = res.data.data;
          setFormData({
            name: p.name || '',
            description: p.description || '',
            price: p.price || '',
            category: p.category || '',
            images: (p.images || []).join(', '),
            stock: p.stock || '',
            storySnippet: p.storySnippet || '',
            artisanStory: p.artisanStory || '',
          });
        } catch (err) {
          setError('Failed to load product');
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      category: formData.category,
      images: formData.images
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      stock: Number(formData.stock),
      storySnippet: formData.storySnippet,
      artisanStory: formData.artisanStory,
    };

    try {
      if (isEdit) {
        await axios.put(`/api/products/${id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post('/api/products', payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      navigate('/vendor/products');
    } catch (err) {
      setError(
        err.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} product`
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/vendor/products')}
          className="p-2 rounded-lg text-accent/60 hover:text-accent hover:bg-white transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-serif text-accent">
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="text-accent/60 text-sm mt-0.5">
            {isEdit
              ? 'Update your product details'
              : 'Fill in the details to list a new product'}
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border border-secondary/30 p-6 space-y-5"
      >
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-accent mb-1.5">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g. Hand-woven Silk Saree"
            className="w-full px-4 py-2.5 border border-secondary/40 rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-accent mb-1.5">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            placeholder="Describe your product in detail..."
            className="w-full px-4 py-2.5 border border-secondary/40 rounded-lg text-sm resize-none
                       focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
          />
        </div>

        {/* Price + Category row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-accent mb-1.5">
              Price (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              placeholder="0"
              className="w-full px-4 py-2.5 border border-secondary/40 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-accent mb-1.5">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-secondary/40 rounded-lg text-sm bg-white
                         focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stock */}
        <div>
          <label className="block text-sm font-medium text-accent mb-1.5">
            Stock Quantity <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
            min="0"
            placeholder="1"
            className="w-full px-4 py-2.5 border border-secondary/40 rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
          />
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-accent mb-1.5">
            Image URLs <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="images"
            value={formData.images}
            onChange={handleChange}
            required
            placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
            className="w-full px-4 py-2.5 border border-secondary/40 rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
          />
          <p className="text-xs text-accent/50 mt-1">
            Separate multiple image URLs with commas
          </p>
        </div>

        {/* Story Snippet */}
        <div>
          <label className="block text-sm font-medium text-accent mb-1.5">
            Story Snippet
          </label>
          <input
            type="text"
            name="storySnippet"
            value={formData.storySnippet}
            onChange={handleChange}
            maxLength={150}
            placeholder="A short story shown on the product card (max 150 chars)"
            className="w-full px-4 py-2.5 border border-secondary/40 rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
          />
          <p className="text-xs text-accent/50 mt-1 text-right">
            {formData.storySnippet.length}/150
          </p>
        </div>

        {/* Artisan Story */}
        <div>
          <label className="block text-sm font-medium text-accent mb-1.5">
            Artisan Story
          </label>
          <textarea
            name="artisanStory"
            value={formData.artisanStory}
            onChange={handleChange}
            rows={3}
            placeholder="Tell the full story behind this product..."
            className="w-full px-4 py-2.5 border border-secondary/40 rounded-lg text-sm resize-none
                       focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
          />
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/vendor/products')}
            className="btn-secondary text-sm px-5 py-2.5"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="btn-primary inline-flex items-center gap-2 text-sm px-5 py-2.5"
          >
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                {isEdit ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <Save size={16} />
                {isEdit ? 'Update Product' : 'Create Product'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VendorProductForm;
