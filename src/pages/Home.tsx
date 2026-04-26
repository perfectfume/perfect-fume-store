import React from 'react';

const HomePage = () => {
  // Category list
  const categories = ['All', 'Men', 'Women', 'Unisex', 'Luxury', 'Travel Size'];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-20">
      
      {/* 1. Hero Slider Section */}
      <section className="px-4 py-6">
        <div className="max-w-7xl mx-auto h-[200px] md:h-[400px] rounded-2xl bg-gradient-to-br from-purple-900/40 to-black border border-white/10 overflow-hidden flex items-center px-8 relative">
          <div className="z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-2 italic">Royal Oud Series</h2>
            <p className="text-gray-400 mb-6 max-w-md text-sm md:text-base">
              Experience the essence of luxury. Pure, long-lasting, and elegant.
            </p>
            <button className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-purple-500 hover:text-white transition-all shadow-lg shadow-white/5">
              Shop Now
            </button>
          </div>
          {/* Transparent Blur Circle for Design */}
          <div className="absolute right-[-50px] top-[-50px] w-64 h-64 bg-purple-600/20 rounded-full blur-[80px]"></div>
        </div>
      </section>

      {/* 2. Category Tabs (Flipkart Style Scroll) */}
      <section className="max-w-7xl mx-auto px-4 py-4 flex gap-4 overflow-x-auto no-scrollbar">
        {categories.map((cat) => (
          <button 
            key={cat} 
            className="whitespace-nowrap px-6 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-purple-600/20 hover:border-purple-500 transition-all text-sm"
          >
            {cat}
          </button>
        ))}
      </section>

      {/* 3. Product Grid Placeholder */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          Trending Now <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Skeleton Loaders (Temporary placeholders) */}
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-64 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-2 overflow-hidden">
               <div className="w-full h-40 bg-white/5 animate-pulse"></div>
               <div className="w-3/4 h-4 bg-white/10 rounded animate-pulse"></div>
               <div className="w-1/2 h-4 bg-white/10 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Bottom Navbar Placeholder (Mobile Version) */}
      <div className="md:hidden fixed bottom-0 w-full bg-black/40 backdrop-blur-xl border-t border-white/10 flex justify-around py-3">
          <div className="text-[10px] flex flex-col items-center opacity-100 text-purple-400"><span>Home</span></div>
          <div className="text-[10px] flex flex-col items-center opacity-60"><span>Category</span></div>
          <div className="text-[10px] flex flex-col items-center opacity-60"><span>Cart</span></div>
          <div className="text-[10px] flex flex-col items-center opacity-60"><span>Account</span></div>
      </div>
    </div>
  );
};

export default HomePage;
