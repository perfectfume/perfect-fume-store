import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { Product, useStore } from '../store/useStore';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const { cart } = useStore();

  // Demo products (Replace with your actual API fetch later)
  useEffect(() => {
    setProducts([
      { id: 1, name: 'Royal Oud', price: 49900, category: 'Men', emoji: '🧴', description: 'Luxury fragrance' },
      { id: 2, name: 'Aqua Fresh', price: 39900, category: 'Women', emoji: '✨', description: 'Refreshing scent' },
      { id: 3, name: 'Night Smoke', price: 59900, category: 'Attar', emoji: '🔥', description: 'Intense evening wear' },
      { id: 4, name: 'Velvet Musk', price: 54900, category: 'Best Seller', emoji: '💎', description: 'Elegant musk' },
    ]);
  }, []);

  // Section 2: Categories Data
  const categories = [
    { name: 'Men', icon: '👨' },
    { name: 'Women', icon: '👩' },
    { name: 'Attar', icon: '💧' },
    { name: 'Pocket Perfume', icon: '🧴' },
    { name: 'Combo', icon: '🎁' },
    { name: 'Best Seller', icon: '🔥' },
  ];

  // Section 4: Features Data
  const features = [
    { title: 'Long Lasting', icon: '⏳', desc: 'Stays with you all day' },
    { title: 'Affordable Luxury', icon: '💎', desc: 'Premium feel, pocket friendly' },
    { title: 'Made in Bengal 🇮🇳', icon: '🐅', desc: 'Crafted with local pride' },
    { title: 'Trusted', icon: '❤️', desc: 'Loved by our customers' },
  ];

  // Calculate cart items for Floating CTA
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#050508] text-white pb-24 font-sans relative overflow-x-hidden">
      
      {/* Background Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#7C6FE9] opacity-[0.05] blur-[150px] rounded-full pointer-events-none"></div>

      {/* =========================================
          SECTION 1: HERO BANNER
          ========================================= */}
      <div className="px-4 pt-12 pb-8 relative z-10">
        <div className="bg-[#12121A] border border-[#2A2A35] rounded-3xl p-8 md:p-12 flex flex-col items-center text-center shadow-2xl">
          <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#7C6FE9] mb-4 tracking-tight leading-tight">
            Smell Different.<br />Feel Confident.
          </h1>
          <p className="text-[#A0A0B0] text-sm md:text-base font-medium mb-8 max-w-md">
            Discover luxury fragrances designed to leave a lasting impression.
          </p>
          <button 
            onClick={() => document.getElementById('trending-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-[#7C6FE9] text-white px-8 py-3.5 rounded-xl font-bold text-lg transition-all hover:bg-[#6A5CDA] shadow-[0_0_20px_rgba(124,111,233,0.4)] active:scale-95"
          >
            Explore Collection
          </button>
        </div>
      </div>

      {/* =========================================
          SECTION 2: QUICK CATEGORIES
          ========================================= */}
      <div className="px-4 mb-12 relative z-10">
        <h2 className="text-xl font-bold mb-4 text-white">Categories</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map((cat, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2 min-w-[80px] cursor-pointer group">
              <div className="w-16 h-16 rounded-2xl bg-[#12121A] border border-[#2A2A35] flex items-center justify-center text-2xl transition-all group-hover:border-[#7C6FE9] group-hover:shadow-[0_0_15px_rgba(124,111,233,0.2)]">
                {cat.icon}
              </div>
              <span className="text-xs font-semibold text-[#A0A0B0] group-hover:text-white text-center whitespace-nowrap">
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================
          SECTION 3: TRENDING PRODUCTS GRID
          ========================================= */}
      <div id="trending-section" className="px-4 mb-16 relative z-10 max-w-5xl mx-auto">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
            Trending Now
          </h2>
          <button className="text-[#7C6FE9] text-sm font-bold hover:underline">
            View All
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* =========================================
          SECTION 4: WHY PERFECT FUME?
          ========================================= */}
      <div className="px-4 mb-12 relative z-10 max-w-5xl mx-auto">
        <div className="bg-[#12121A] border border-[#2A2A35] rounded-3xl p-6 md:p-10">
          <h2 className="text-2xl font-bold text-center mb-8 text-white">Why Perfect Fume?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {features.map((feature, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-[#1A1A24] text-[#7C6FE9] flex items-center justify-center text-2xl mb-3">
                  {feature.icon}
                </div>
                <h3 className="text-sm font-bold text-white mb-1">{feature.title}</h3>
                <p className="text-[10px] md:text-xs text-[#A0A0B0]">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================
          SECTION 5: FLOATING CART CTA
          ========================================= */}
      {totalItems > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50">
          <a 
            href="/checkout" 
            className="bg-[#7C6FE9] text-white rounded-2xl p-4 flex items-center justify-between shadow-[0_10px_40px_rgba(124,111,233,0.3)] hover:scale-[1.02] transition-transform border border-[#6A5CDA]"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white text-[#7C6FE9] h-8 w-8 rounded-full flex items-center justify-center font-extrabold text-sm">
                {totalItems}
              </div>
              <span className="font-bold text-sm md:text-base">Items in Cart</span>
            </div>
            <div className="font-bold text-sm bg-black/20 px-4 py-2 rounded-xl flex items-center gap-2">
              CHECKOUT <span>→</span>
            </div>
          </a>
        </div>
      )}

    </div>
  );
}
