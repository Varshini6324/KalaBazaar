import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';

const CustomerDashboard = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
        <User size={32} />
        {user.name}'s Dashboard
      </h1>
      <div className="bg-white rounded-xl shadow-sm p-4 border border-secondary/30">
        <p className="text-lg font-medium text-accent">Name: <span className="text-primary">{user.name}</span></p>
        <p className="text-lg font-medium text-accent mt-2">Email: <span className="text-primary">{user.email}</span></p>
        <p className="text-lg font-medium text-accent mt-2">Role: <span className="text-primary capitalize">{user.role}</span></p>
      </div>
    </div>
  );
};

export default CustomerDashboard;
