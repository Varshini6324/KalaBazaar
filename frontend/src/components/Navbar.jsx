import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import authService from '../features/auth/authService';
import { ShoppingCart, User, Menu, LogOut, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-primary text-background sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="font-serif text-2xl font-bold tracking-wider">
              <span>కళ</span>Bazaar
            </Link>
          </div>
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="hover:text-secondary transition-colors font-medium">Home</Link>
            <Link to="/shop" className="hover:text-secondary transition-colors font-medium">Shop</Link>
            <Link to="/artisans" className="hover:text-secondary transition-colors font-medium">Artisans</Link>
            <Link to="/our-story" className="hover:text-secondary transition-colors font-medium">Our Story</Link>
          </div>
          <div className="flex items-center space-x-6">
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-background/80 hidden sm:inline-block">
                  Hi, {user.name.split(' ')[0]}
                </span>
                {user.role === 'vendor' && (
                  <Link
                    to="/vendor/dashboard"
                    className="flex items-center gap-1 hover:text-secondary transition-colors text-sm font-medium border border-background/20 px-3 py-1.5 rounded-md hover:border-secondary"
                  >
                    <LayoutDashboard size={16} />
                    <span className="hidden lg:inline">Dashboard</span>
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="hover:text-secondary transition-colors flex items-center gap-1 text-sm font-medium cursor-pointer"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="hover:text-secondary transition-colors" title="Login">
                <User size={24} />
              </Link>
            )}
            <button className="hover:text-secondary transition-colors relative">
              <ShoppingCart size={24} />
              <span className="absolute -top-2 -right-2 bg-accent text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                0
              </span>
            </button>
            <button className="md:hidden hover:text-secondary transition-colors">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;