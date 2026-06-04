import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import VendorRoute from './components/VendorRoute';
import VendorDashboard from './pages/vendor/VendorDashboard';
import VendorLayout from './components/vendor/VendorLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import ShopPage from './pages/ShopPage';
import CartPage from './pages/CartPage';
import ArtisansPage from './pages/ArtisansPage';
import OurStoryPage from './pages/OurStoryPage';
import ProductDetailPage from './pages/Productdetailpage';

import CustomerDashboard from './pages/CustomerDashboard';

import VendorProducts from './pages/vendor/VendorProducts';
import VendorProductForm from './pages/vendor/VendorProductForm';
import VendorOrders from './pages/vendor/VendorOrders';
import VendorProfile from './pages/vendor/VendorProfile';

function App() {
  return (
    <Routes>
      {/* Vendor Dashboard — completely separate layout, no Navbar/Footer */}
      <Route element={<VendorRoute />}>
        <Route path="/vendor" element={<VendorLayout />}>
          <Route path="dashboard" element={<VendorDashboard />} />
          <Route path="products" element={<VendorProducts />} />
          <Route path="products/add" element={<VendorProductForm />} />
          <Route path="products/edit/:id" element={<VendorProductForm />} />
          <Route path="orders" element={<VendorOrders />} />
          <Route path="profile" element={<VendorProfile />} />
        </Route>
      </Route>

      {/* Customer-facing storefront */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Ensure these exist for client-side routing on Vercel */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/artisans" element={<ArtisansPage />} />
                <Route path="/our-story" element={<OurStoryPage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />
                <Route path="/dashboard" element={<CustomerDashboard />} />
              </Routes>
            </main>
          </div>
        }
      />
    </Routes>
  );
}

export default App;