const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-20">
      
      {/* 1. Hero Slider Section */}
      <section className="px-4 py-6">
        <div className="max-w-7xl mx-auto h-[200px] md:h-[400px] rounded-2xl bg-gradient-to-br from-purple-900/40 to-black border border-white/10 overflow-hidden flex items-center px-8 relative">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold mb-2 italic">Royal Oud Series</h2>
            <p className="text-gray-400 mb-6 max-w-md">Experience the essence of luxury. Pure, long-lasting, and elegant.</p>
            <button className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-purple-500 hover:text-white transition-all">
              Shop Now
            </button>
          </div>
          {/* Ekhane boro ekta perfume bottle-er transparent image thakbe */}
        </div>
      </section>

      {/* 2. Category Tabs (Flipkart Style) */}
      <section className="max-w-7xl mx-auto px-4 py-4 flex gap-4 overflow-x-auto no-scrollbar">
        {['All', 'Men', 'Women', 'Unisex', 'Luxury', 'Travel Size'].map((cat) => (
          <button key={cat} className="whitespace-nowrap px-6 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-purple-600/20 hover:border-purple-500 transition-all">
            {cat}
          </button>
        ))}
      </section>

      {/* 3. Product Grid Holder */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h3 className="text-xl font-semibold mb-6">Trending Now</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Product Cards ekhane automatic load hobe database theke */}
          <div className="h-64 rounded-xl bg-white/5 border border-white/10 animate-pulse"></div>
          <div className="h-64 rounded-xl bg-white/5 border border-white/10 animate-pulse"></div>
          <div className="h-64 rounded-xl bg-white/5 border border-white/10 animate-pulse"></div>
          <div className="h-64 rounded-xl bg-white/5 border border-white/10 animate-pulse"></div>
        </div>
      </section>
    </div>
  );
};
