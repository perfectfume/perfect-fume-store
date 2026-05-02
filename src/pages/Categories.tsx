import React, { useState, useEffect } from 'react';
import { LayoutGrid, ArrowRight } from 'lucide-react';

const Categories = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || "https://perfect-fume-backend.perfectfumeofficial.workers.dev";

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/api/catalog`);
        const data = await res.json();
        // Data theke unique categories ber kora (jate duplicate na ase)
        const uniqueCats = [...new Set(data.map((p: any) => p.category))].filter(Boolean) as string[];
        setCategories(uniqueCats);
      } catch (error) {
        console.error("Failed to fetch categories");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Category onujayi chobi dewar smart logic
  const getCategoryImg = (cat: string) => {
    const lowerCat = cat.toLowerCase();
    if(lowerCat.includes('men')) return 'https://images.unsplash.com/photo-1610461888750-10bfc601b874?q=80&w=600';
    if(lowerCat.includes('women')) return 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600';
    if(lowerCat.includes('unisex')) return 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=600';
    if(lowerCat.includes('luxury')) return 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=600';
    if(lowerCat.includes('travel')) return 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=600';
    return 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=600'; // Default
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-24 font-sans">
      <main className="max-w-6xl mx-auto px-4">
        
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4">
          <div className="w-16 h-16 bg-purple-900/30 rounded-2xl flex items-center justify-center border border-purple-500/30 mx-auto mb-6">
            <LayoutGrid className="w-8 h-8 text-purple-400" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold italic mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Explore Categories
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">Find the perfect fragrance for every occasion and personality.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-56 bg-[#111] animate-pulse rounded-3xl border border-white/5"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.length > 0 ? categories.map((cat, i) => (
              <div key={i} onClick={() => window.location.href = `/shop`} className="group cursor-pointer relative h-56 rounded-3xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all shadow-xl shadow-purple-900/10">
                <img src={getCategoryImg(cat)} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={cat} />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                  <h3 className="text-2xl md:text-3xl font-bold text-white tracking-wide">{cat}</h3>
                  <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-purple-600 transition-colors">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            )) : (
              <p className="text-gray-500 col-span-3 text-center py-10">No categories found. Add some products first!</p>
            )}
          </div>
        )}
        
      </main>
    </div>
  );
};

export default Categories;
