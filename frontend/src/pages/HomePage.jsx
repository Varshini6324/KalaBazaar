import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="relative bg-background h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=2000&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-primary/70 mix-blend-multiply"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl text-background font-bold mb-6 drop-shadow-md">
          Discover Handmade Stories
        </h1>
        <p className="text-lg md:text-xl text-secondary mb-10 font-light max-w-2xl mx-auto">
          Preserving Traditions, Empowering Artisans. Shop authentic, ethically crafted treasures from rural India directly from the creators.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/login" className="bg-accent text-background px-8 py-3 rounded hover:bg-white hover:text-accent font-semibold transition-all shadow-lg text-lg inline-block">
            Login
          </Link>
          <Link to="/register" className="border-2 border-background text-background px-8 py-3 rounded hover:bg-background hover:text-primary font-semibold transition-all text-lg inline-block">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
