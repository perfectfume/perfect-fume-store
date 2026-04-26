import React, { useState, useEffect } from 'react';

const HomePage = () => {
  const categories = ['All', 'Men', 'Women', 'Unisex', 'Luxury', 'Travel Size'];
  
  // Product dhore rakhar state
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Backend theke data anar logic
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "https://perfect-fume-backend.perfectfumeofficial.workers.dev";
        const res = await fetch(`${API_URL}/api/catalog`);
        const data = await res.json();
        setProducts(data); // Database theke asa product set kora holo
      } catch (error) {
        console.error("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

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
          <div className="absolute right-[-50px] top-[-50px] w-64 h-64 bg-purple-600/20 rounded-full blur-[80px]"></div>
        </div>
      </section>

      {/* 2. Category Tabs */}
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

      {/* 3. Dynamic Product Grid */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          Trending Now <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {loading ? (
            // Loading thakle skeleton dekhabe
            [1, 2, 3, 4].map((item) => (
              <div key={item} className="h-64 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-2 overflow-hidden animate-pulse">
              </div>
            ))
          ) : products.length > 0 ? (
            // Asol product dekhabe
            products.map((product) => (
              <div key={product.id} className="rounded-xl bg-white/5 border border-white/10 flex flex-col overflow-hidden hover:border-purple-500 transition-colors">
                <img src={product.image} alt={product.name} className="w-full h-40 object-cover bg-black" />
                <div className="p-4">
                  <p className="text-xs text-purple-400 mb-1">{product.category}</p>
                  <h4 className="font-semibold text-sm truncate">{product.name}</h4>
                  <p className="text-lg font-bold mt-2">₹{product.price}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">Kono product pawa jayni.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
