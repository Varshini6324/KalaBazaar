import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Save, Loader2, Upload, X, ImagePlus } from 'lucide-react';

const categories = ['Textiles', 'Pottery', 'Jewelry', 'Woodwork', 'Metalwork', 'Other'];

const emptyForm = {
  name: '',
  description: '',
  price: '',
  category: '',
  stock: '',
  storySnippet: '',
  artisanStory: '',
};

const VendorProductForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState(emptyForm);
  const [images, setImages] = useState([]); // { file, preview } for new uploads, { url } for existing
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);

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
            stock: p.stock || '',
            storySnippet: p.storySnippet || '',
            artisanStory: p.artisanStory || '',
          });
          // Load existing images as url-type entries
          if (p.images?.length) {
            setImages(p.images.map((url) => ({ url })));
          }
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

  const handleFiles = (files) => {
    const valid = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (images.length + valid.length > 5) {
      setError('Maximum 5 images allowed');
      return;
    }
    const newImages = valid.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const handleFileInput = (e) => handleFiles(e.target.files);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeImage = (index) => {
    setImages((prev) => {
      const updated = [...prev];
      if (updated[index].preview) URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  // Convert file to base64 for sending to backend
  // In a real setup you'd upload to Cloudinary/S3 and get back a URL.
  // Here we convert to base64 data URLs as image strings.
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    if (images.length === 0) {
      setError('Please add at least one product image');
      setSaving(false);
      return;
    }

    try {
      // Convert new file uploads to base64; keep existing URLs as-is
      const imageStrings = await Promise.all(
        images.map((img) => (img.file ? toBase64(img.file) : Promise.resolve(img.url)))
      );

      const payload = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category,
        images: imageStrings,
        stock: Number(formData.stock),
        storySnippet: formData.storySnippet,
        artisanStory: formData.artisanStory,
      };

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
      setError(err.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} product`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5rem 0' }}>
        <div style={{
          width: '36px', height: '36px', border: '3px solid #d4a574',
          borderTopColor: '#810B38', borderRadius: '50%', animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', fontFamily: 'Georgia, serif' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
        <button
          onClick={() => navigate('/vendor/products')}
          style={{
            padding: '0.5rem', borderRadius: '8px', border: 'none',
            backgroundColor: 'transparent', cursor: 'pointer', color: '#810B38',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fff'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 style={{ color: '#2d0f06', fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p style={{ color: '#7a5c4a', fontSize: '0.85rem', margin: '2px 0 0' }}>
            {isEdit ? 'Update your product details' : 'Fill in the details to list a new product'}
          </p>
        </div>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#fef2f2', border: '1px solid #fecaca',
          color: '#b91c1c', padding: '0.75rem 1rem', borderRadius: '8px',
          marginBottom: '1.25rem', fontSize: '0.875rem',
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{
          backgroundColor: '#fff', borderRadius: '12px',
          border: '1px solid #e8d5c0', padding: '1.75rem',
          display: 'flex', flexDirection: 'column', gap: '1.25rem',
        }}>

          {/* Image Upload */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', color: '#2d0f06', marginBottom: '0.6rem' }}>
              Product Images <span style={{ color: '#dc2626' }}>*</span>
              <span style={{ color: '#7a5c4a', fontWeight: 'normal', marginLeft: '0.5rem' }}>(up to 5)</span>
            </label>

            {/* Drop Zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              style={{
                border: `2px dashed ${dragOver ? '#810B38' : '#d4a574'}`,
                borderRadius: '10px',
                padding: '2rem',
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: dragOver ? '#fdf0e8' : '#fdf6ee',
                transition: 'all 0.2s',
                marginBottom: '1rem',
              }}
            >
              <ImagePlus size={32} color="#a0522d" style={{ margin: '0 auto 0.5rem' }} />
              <p style={{ color: '#810B38', fontWeight: 'bold', margin: '0 0 0.25rem', fontSize: '0.9rem' }}>
                Click to upload or drag & drop
              </p>
              <p style={{ color: '#7a5c4a', fontSize: '0.8rem', margin: 0 }}>
                PNG, JPG, WEBP up to 5MB each
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileInput}
                style={{ display: 'none' }}
              />
            </div>

            {/* Image Previews */}
            {images.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {images.map((img, i) => (
                  <div key={i} style={{ position: 'relative', width: '90px', height: '90px' }}>
                    <img
                      src={img.preview || img.url}
                      alt={`preview-${i}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', border: '2px solid #d4a574' }}
                    />
                    {i === 0 && (
                      <span style={{
                        position: 'absolute', bottom: '4px', left: '4px',
                        backgroundColor: '#810B38', color: '#fff',
                        fontSize: '0.6rem', padding: '1px 5px', borderRadius: '4px',
                      }}>
                        Main
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      style={{
                        position: 'absolute', top: '-6px', right: '-6px',
                        width: '20px', height: '20px', borderRadius: '50%',
                        backgroundColor: '#dc2626', border: 'none',
                        color: '#fff', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <X size={11} />
                    </button>
                  </div>
                ))}
                {images.length < 5 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      width: '90px', height: '90px', borderRadius: '8px',
                      border: '2px dashed #d4a574', backgroundColor: '#fdf6ee',
                      cursor: 'pointer', display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center', gap: '0.25rem',
                      color: '#a0522d',
                    }}
                  >
                    <Upload size={18} />
                    <span style={{ fontSize: '0.7rem' }}>Add more</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Name */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', color: '#2d0f06', marginBottom: '0.4rem' }}>
              Product Name <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input
              type="text" name="name" value={formData.name}
              onChange={handleChange} required
              placeholder="e.g. Hand-woven Silk Saree"
              style={inputStyle}
            />
          </div>

          {/* Description */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', color: '#2d0f06', marginBottom: '0.4rem' }}>
              Description <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <textarea
              name="description" value={formData.description}
              onChange={handleChange} required rows={4}
              placeholder="Describe your product in detail..."
              style={{ ...inputStyle, resize: 'none' }}
            />
          </div>

          {/* Price + Category */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', color: '#2d0f06', marginBottom: '0.4rem' }}>
                Price (₹) <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="number" name="price" value={formData.price}
                onChange={handleChange} required min="0" placeholder="0"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', color: '#2d0f06', marginBottom: '0.4rem' }}>
                Category <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <select
                name="category" value={formData.category}
                onChange={handleChange} required
                style={{ ...inputStyle, backgroundColor: '#fff' }}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Stock */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', color: '#2d0f06', marginBottom: '0.4rem' }}>
              Stock Quantity <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input
              type="number" name="stock" value={formData.stock}
              onChange={handleChange} required min="0" placeholder="1"
              style={{ ...inputStyle, maxWidth: '180px' }}
            />
          </div>

          {/* Story Snippet */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', color: '#2d0f06', marginBottom: '0.4rem' }}>
              Story Snippet
              <span style={{ color: '#7a5c4a', fontWeight: 'normal', marginLeft: '0.5rem', fontSize: '0.8rem' }}>shown on product card</span>
            </label>
            <input
              type="text" name="storySnippet" value={formData.storySnippet}
              onChange={handleChange} maxLength={150}
              placeholder="A short story shown on the product card (max 150 chars)"
              style={inputStyle}
            />
            <p style={{ textAlign: 'right', fontSize: '0.75rem', color: '#7a5c4a', margin: '4px 0 0' }}>
              {formData.storySnippet.length}/150
            </p>
          </div>

          {/* Artisan Story */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', color: '#2d0f06', marginBottom: '0.4rem' }}>
              Artisan Story
              <span style={{ color: '#7a5c4a', fontWeight: 'normal', marginLeft: '0.5rem', fontSize: '0.8rem' }}>shown on product detail page</span>
            </label>
            <textarea
              name="artisanStory" value={formData.artisanStory}
              onChange={handleChange} rows={3}
              placeholder="Tell the full story behind this product..."
              style={{ ...inputStyle, resize: 'none' }}
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '0.5rem' }}>
            <button
              type="button"
              onClick={() => navigate('/vendor/products')}
              style={{
                padding: '0.6rem 1.25rem', borderRadius: '8px',
                border: '2px solid #d4a574', backgroundColor: 'transparent',
                color: '#810B38', cursor: 'pointer', fontFamily: 'Georgia, serif',
                fontSize: '0.875rem', transition: 'all 0.2s',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              style={{
                padding: '0.6rem 1.5rem', borderRadius: '8px',
                border: 'none', backgroundColor: saving ? '#a0522d' : '#810B38',
                color: '#fff', cursor: saving ? 'not-allowed' : 'pointer',
                fontFamily: 'Georgia, serif', fontSize: '0.875rem',
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                transition: 'background 0.2s',
              }}
            >
              {saving ? (
                <>
                  <Loader2 size={16} style={{ animation: 'spin 0.8s linear infinite' }} />
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
        </div>
      </form>
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: '0.6rem 0.9rem',
  border: '1.5px solid #d4a574',
  borderRadius: '8px',
  fontSize: '0.875rem',
  fontFamily: 'Georgia, serif',
  color: '#2d0f06',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
};

export default VendorProductForm;