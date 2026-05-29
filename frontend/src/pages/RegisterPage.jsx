import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../features/auth/authService';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRoleChange = (role) => {
    setFormData((prev) => ({ ...prev, role }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await authService.register(formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-background px-4 py-8">
      <div className="card w-full max-w-md p-8">
        <h2 className="text-3xl font-serif text-primary text-center mb-2">Create Account</h2>
        <p className="text-center text-accent/80 mb-6">Join the Artisan Marketplace</p>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-accent font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-accent font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Enter your email"
            />
          </div>
          
          <div>
            <label className="block text-accent font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Create a password"
            />
          </div>

          <div className="pt-2">
            <label className="block text-accent font-medium mb-2">I want to join as a:</label>
            <div className="grid grid-cols-2 gap-4">
              <div 
                onClick={() => handleRoleChange('customer')}
                className={`cursor-pointer border-2 rounded-lg p-4 text-center transition-all ${formData.role === 'customer' ? 'border-primary bg-primary/5' : 'border-secondary hover:border-primary/50'}`}
              >
                <div className="font-semibold text-primary">Customer</div>
                <div className="text-xs text-accent/70 mt-1">I want to buy unique crafts</div>
              </div>
              
              <div 
                onClick={() => handleRoleChange('vendor')}
                className={`cursor-pointer border-2 rounded-lg p-4 text-center transition-all ${formData.role === 'vendor' ? 'border-primary bg-primary/5' : 'border-secondary hover:border-primary/50'}`}
              >
                <div className="font-semibold text-primary">Vendor</div>
                <div className="text-xs text-accent/70 mt-1">I want to sell my creations</div>
              </div>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full mt-6"
          >
            {isLoading ? 'Creating Account...' : 'Register'}
          </button>
        </form>
        
        <p className="mt-6 text-center text-accent/80">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
