import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, Leaf, ArrowRight, ShoppingBag } from 'lucide-react';

const HomePage = () => {
  const categories = [
    { name: 'Textiles', image: 'https://images.unsplash.com/photo-1590736969955-71cb9490114d?q=80&w=600&auto=format&fit=crop', desc: 'Handloom fabrics & prints' },
    { name: 'Pottery', image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=600&auto=format&fit=crop', desc: 'Clay crafts & kitchenware' },
    { name: 'Jewelry', image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=600&auto=format&fit=crop', desc: 'Traditional silver & beads' },
    { name: 'Woodwork', image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=600&auto=format&fit=crop', desc: 'Carved decor & toys' },
  ];

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Banner */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=2000&auto=format&fit=crop")',
          }}
        >
          <div className="absolute inset-0 bg-primary/75 mix-blend-multiply"></div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto text-background">
          <p className="text-secondary tracking-widest text-xs sm:text-sm font-semibold uppercase mb-4 animate-fade-in">
            Preserving Heritage · Empowering Communities
          </p>
          <h1 className="text-4xl sm:text-6xl text-background font-bold mb-6 tracking-wide leading-tight drop-shadow-md">
            Handcrafted Stories <br className="hidden sm:inline" /> Designed for Modern Lives
          </h1>
          <p className="text-md sm:text-xl text-background/85 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            Shop directly from skilled Indian artisans. Bring home authentic, ethically crafted treasures that tell a story of tradition.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/shop" className="bg-white text-primary px-8 py-3 rounded-md hover:bg-secondary/40 hover:text-white font-bold transition-all shadow-lg text-lg flex items-center justify-center gap-2">
              <ShoppingBag size={20} />
              Shop Catalog
            </Link>
            <Link to="/our-story" className="border-2 border-background text-background px-8 py-3 rounded-md hover:bg-background hover:text-accent font-bold transition-all text-lg flex items-center justify-center gap-1">
              Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <span className="text-primary font-bold uppercase tracking-wider text-xs">Our Values</span>
          <h2 className="text-3xl sm:text-4xl mt-2 font-serif text-accent font-bold">Why Choose KalaBazaar?</h2>
          <div className="w-16 h-1 bg-primary mx-auto mt-4 rounded"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl border border-secondary/30 text-center flex flex-col items-center shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-primary/10 text-primary p-4 rounded-full mb-6">
              <Heart size={28} />
            </div>
            <h3 className="text-xl font-bold text-accent mb-3">Empowering Artisans</h3>
            <p className="text-accent/70 text-sm leading-relaxed">
              We cut out middlemen entirely. Up to 80% of every sale goes directly to the weavers, potters, and metalworkers.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl border border-secondary/30 text-center flex flex-col items-center shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-primary/10 text-primary p-4 rounded-full mb-6">
              <Sparkles size={28} />
            </div>
            <h3 className="text-xl font-bold text-accent mb-3">Authentic Heritage</h3>
            <p className="text-accent/70 text-sm leading-relaxed">
              Every item is certified handmade, carrying the GI tag or traditional signature of heritage communities.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl border border-secondary/30 text-center flex flex-col items-center shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-primary/10 text-primary p-4 rounded-full mb-6">
              <Leaf size={28} />
            </div>
            <h3 className="text-xl font-bold text-accent mb-3">Sustainably Crafted</h3>
            <p className="text-accent/70 text-sm leading-relaxed">
              Our products are crafted using eco-friendly processes, natural dyes, and organically harvested local materials.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Spotlight */}
      <section className="bg-secondary/20 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-12">
            <div>
              <span className="text-primary font-bold uppercase tracking-wider text-xs">Categories</span>
              <h2 className="text-3xl font-serif text-accent font-bold mt-1">Shop by Craft Type</h2>
            </div>
            <Link to="/shop" className="text-primary font-semibold hover:underline flex items-center gap-1 mt-4 sm:mt-0">
              View All Crafts <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link 
                key={cat.name} 
                to="/shop" 
                state={{ category: cat.name }}
                className="group relative h-72 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url(${cat.image})` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-accent/90 via-accent/30 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 text-background">
                  <h3 className="text-lg font-bold text-background mb-1">{cat.name}</h3>
                  <p className="text-secondary text-xs opacity-90">{cat.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Artisan Spotlight */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-white rounded-2xl border border-secondary/30 overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-2">
          <div 
            className="h-80 lg:h-auto bg-cover bg-center"
            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?q=80&w=800&auto=format&fit=crop")' }}
          ></div>
          <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
            <span className="text-primary font-bold uppercase tracking-wider text-xs">Artisan In Focus</span>
            <h2 className="text-3xl font-serif text-accent font-bold mt-2 mb-6">Meet Master Artisan Meera</h2>
            <p className="text-accent/80 leading-relaxed mb-6 font-light">
              "For over three generations, my family has practiced the art of block printing and natural Indigo dyeing. Partnering with KalaBazaar has allowed me to keep this heritage alive and sponsor my daughter's education."
            </p>
            <p className="text-sm font-semibold text-accent mb-8">
              Meera Bai · Indigo Weaver, Jaipur
            </p>
            <Link to="/our-story" className="btn-primary w-fit flex items-center gap-2">
              Discover Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* Join Community CTA */}
      <section className="bg-primary text-background text-center py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl text-background font-serif font-bold mb-4">
            Are You an Artisan Creator?
          </h2>
          <p className="text-secondary/90 leading-relaxed mb-8 max-w-xl mx-auto font-light">
            Showcase your skills to art lovers worldwide. Register as a vendor on KalaBazaar, get digital support, and earn fair direct wages.
          </p>
          <Link to="/register" className="bg-background text-primary px-8 py-3 rounded-md hover:bg-secondary/30 hover:text-white font-bold transition-all shadow-lg text-lg inline-block">
            Register as a Vendor
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
