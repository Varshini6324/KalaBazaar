import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Save, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const VendorProfile = () => {
  const { token } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    storeName: '',
    description: '',
    address: '',
    craftType: '',
    logoUrl: '',
  });
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/api/users/vendor-profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const d = res.data.data || {};
        setFormData({
          storeName: d.storeName || '',
          description: d.description || '',
          address: d.address || '',
          craftType: d.craftType || '',
          logoUrl: d.logoUrl || '',
        });
        setIsVerified(res.data.isVendorVerified || false);
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await axios.put('/api/users/vendor-profile', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-serif text-accent">Vendor Profile</h1>
          <p className="text-accent/60 text-sm mt-1">
            Manage your store information
          </p>
        </div>
        <div
          className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${
            isVerified
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-amber-100 text-amber-700'
          }`}
        >
          {isVerified ? (
            <>
              <CheckCircle size={14} />
              Verified
            </>
          ) : (
            <>
              <AlertCircle size={14} />
              Pending Verification
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg mb-6 text-sm flex items-center gap-2">
          <CheckCircle size={16} />
          {success}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border border-secondary/30 p-6 space-y-5"
      >
        {/* Store Name */}
        <div>
          <label className="block text-sm font-medium text-accent mb-1.5">
            Store Name
          </label>
          <input
            type="text"
            name="storeName"
            value={formData.storeName}
            onChange={handleChange}
            placeholder="e.g. Lakshmi's Handlooms"
            className="w-full px-4 py-2.5 border border-secondary/40 rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-accent mb-1.5">
            Store Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Tell customers about your craft and store..."
            className="w-full px-4 py-2.5 border border-secondary/40 rounded-lg text-sm resize-none
                       focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-accent mb-1.5">
            Address
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Village/Town, District, State"
            className="w-full px-4 py-2.5 border border-secondary/40 rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
          />
        </div>

        {/* Craft Type */}
        <div>
          <label className="block text-sm font-medium text-accent mb-1.5">
            Craft Type
          </label>
          <input
            type="text"
            name="craftType"
            value={formData.craftType}
            onChange={handleChange}
            placeholder="e.g. Handloom Weaving, Block Printing, Pottery"
            className="w-full px-4 py-2.5 border border-secondary/40 rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
          />
        </div>

        {/* Logo URL */}
        <div>
          <label className="block text-sm font-medium text-accent mb-1.5">
            Logo URL
          </label>
          <input
            type="text"
            name="logoUrl"
            value={formData.logoUrl}
            onChange={handleChange}
            placeholder="https://example.com/logo.png"
            className="w-full px-4 py-2.5 border border-secondary/40 rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
          />
          {formData.logoUrl && (
            <div className="mt-3">
              <img
                src={formData.logoUrl}
                alt="Store logo preview"
                className="w-16 h-16 object-cover rounded-lg border border-secondary/30"
                onError={(e) => (e.target.style.display = 'none')}
              />
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary inline-flex items-center gap-2 text-sm px-5 py-2.5"
          >
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save Profile
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VendorProfile;
