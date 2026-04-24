import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useStore } from '../store/useStore';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const { cart } = useStore();

  // Demo products data
  useEffect(() => {
    setProducts([
      { id: 1, name: 'Royal Oud', price: 499, image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500', category: 'Men' },
      { id: 2, name: 'Aqua Fresh', price: 399, image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500', category: 'Women' },
      { id: 3, name: 'Night Smoke', price: 599, image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500', category: 'Attar' },
      { id: 4, name: 'Velvet Musk', price: 549, image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500', category: 'Best Seller' },
    ]);
  }, []);

  const categories = [
    { name: 'Men', icon: '👨' },
    { name: 'Women', icon: '👩' },
    { name: 'Attar', icon: '💧' },
    { name: 'Pocket Perfume', icon: '🧴' },
    { name: 'Combo', icon: '🎁' },
    { name: 'Best Seller', icon: '🔥' },
  ];

  const features = [
    { title: 'Long Lasting', icon: '⏳', desc: 'Stays with you all day' },
    { title: 'Affordable Luxury', icon: '💎', desc: 'Premium feel, pocket friendly' },
    { title: 'Made in Bengal 🇮🇳', icon: '🐅', desc: 'Crafted with local pride' },
    { title: 'Trusted', icon: '❤️', desc: 'Loved by our customers' },
  ];

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#050508] text-white pb-24 font-sans relative overflow-x-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#7C6FE9] opacity-[0.05] blur-[150px] rounded-full pointer-events-none"></div>

      {/* HERO SECTION */}
      <div className="px-4 pt-12 pb-8 relative z-10">
        <div className="bg-[#12121A] border border-[#2A2A35] rounded-3xl p-8 md:p-12 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#7C6FE9] mb-4">
            Smell Different.<br />Feel Confident.
          </h1>
          <p className="text-[#A0A0B0] text-sm mb-8 max-w-md">
            Discover luxury fragrances designed to leave a lasting impression.
          </p>
          <button 
            onClick={() => document.getElementById('trending-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-[#7C6FE9] text-white px-8 py-3.5 rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(124,111,233,0.4)]"
          >
            Explore Collection
          </button>
        </div>
      </div>

      {/* CATEGORIES */}
      <div className="px-4 mb-12 relative z-10">
        <h2 className="text-xl font-bold mb-4">Categories</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map((cat, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2 min-w-[80px]">
              <div className="w-16 h-16 rounded-2xl bg-[#12121A] border border-[#2A2A35] flex items-center justify-center text-2xl hover:border-[#7C6FE9] transition-all">
                {cat.icon}
              </div>
              <span className="text-xs font-semibold text-[#A0A0B0]">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* TRENDING PRODUCTS */}
      <div id="trending-section" className="px-4 mb-16 relative z-10 max-w-5xl mx-auto">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-bold">Trending Now</h2>
          <button className="text-[#7C6FE9] text-sm font-bold">View All</button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* WHY US */}
      <div className="px-4 mb-12 relative z-10 max-w-5xl mx-auto">
        <div className="bg-[#12121A] border border-[#2A2A35] rounded-3xl p-6">
          <h2 className="text-2xl font-bold text-center mb-8">Why Perfect Fume?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {features.map((feature, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-[#1A1A24] text-[#7C6FE9] flex items-center justify-center text-2xl mb-3">
                  {feature.icon}
                </div>
                <h3 className="text-sm font-bold mb-1">{feature.title}</h3>
                <p className="text-[10px] text-[#A0A0B0]">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FLOATING CART CTA */}
      {totalItems > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50">
          <Link 
            to="/checkout" 
            className="bg-[#7C6FE9] text-white rounded-2xl p-4 flex items-center justify-between shadow-[0_10px_40px_rgba(124,111,233,0.3)] border border-[#6A5CDA]"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white text-[#7C6FE9] h-8 w-8 rounded-full flex items-center justify-center font-extrabold">
                {totalItems}
              </div>
              <span className="font-bold">Items in Cart</span>
            </div>
            <div className="font-bold text-sm bg-black/20 px-4 py-2 rounded-xl flex items-center gap-2">
              CHECKOUT <span>→</span>
            </div>
          </Link>
        </div>
      )}

    </div>
  );
}
