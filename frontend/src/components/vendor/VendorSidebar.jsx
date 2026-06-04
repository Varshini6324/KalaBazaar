import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import authService from '../../features/auth/authService';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  UserCircle,
  LogOut,
  X,
} from 'lucide-react';

const navItems = [
  { to: '/vendor/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/vendor/products', icon: Package, label: 'Products' },
  { to: '/vendor/orders', icon: ShoppingBag, label: 'Orders' },
  { to: '/vendor/profile', icon: UserCircle, label: 'Profile' },
];

const VendorSidebar = ({ isOpen, onClose }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    dispatch(logout());
    navigate('/login');
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-vendor-sidebar
          flex flex-col transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo area */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <h1 className="font-serif text-xl font-bold text-white tracking-wider">
            <span className="text-primary">కళ</span>Bazaar
          </h1>
          <button
            onClick={onClose}
            className="lg:hidden text-white/60 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Vendor info */}
        <div className="px-6 py-4 border-b border-white/10">
          <p className="text-white/90 font-medium text-sm truncate">
            {user?.name || 'Vendor'}
          </p>
          <p className="text-white/50 text-xs mt-0.5">
            {user?.role === 'vendor' ? `Store profile` : 'Vendor Dashboard'}
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? 'bg-primary text-white shadow-md shadow-primary/30'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium
                       text-white/70 hover:bg-red-900/30 hover:text-red-300 transition-all duration-200 w-full cursor-pointer"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl text-accent">
            <h3 className="font-serif text-xl text-primary font-semibold mb-2">
              Confirm Logout
            </h3>
            <p className="text-sm text-accent/70 mb-6">
              Are you sure you want to log out of your account?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 border border-secondary rounded-md text-sm font-medium hover:bg-black/5 transition-colors cursor-pointer text-accent"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  handleLogout();
                }}
                className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-md cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VendorSidebar;
