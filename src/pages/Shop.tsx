import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Heart, Star, Filter, Home as HomeIcon, LayoutGrid, ShoppingBag } from 'lucide-react';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const { userEmail, addToCart, isCartOpen, toggleCart } = useStore();
  const API_URL = import.meta.env.VITE_API_URL || "https://perfect-fume-backend.perfectfumeofficial.workers.dev";
  const categories = ['All', 'Men', 'Women', 'Unisex', 'Luxury', 'Travel Size'];

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/api/catalog`);
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product: any) => {
    if (!userEmail) return alert("⚠️ Sobaiprothome upore 'Sign In'-e click kore Login korun!");
    addToCart(product);
    alert(`✅ ${product.name} apnar Jhhuri-te (Cart) add hoyeche!`);
  };

  const handleBuyNow = (product: any) => {
    if (!userEmail) return alert("⚠️ Sobaiprothome upore 'Sign In'-e click kore Login korun!");
    addToCart(product);
    if (!isCartOpen) toggleCart();
  };

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter((p: any) => p.category?.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-24 font-sans">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Page Header */}
        <div className="mb-8 bg-gradient-to-r from-purple-900/40 to-transparent p-6 rounded-2xl border border-white/10">
          <h1 className="text-3xl font-bold italic text-white mb-2">Our Collection</h1>
          <p className="text-gray-400 text-sm">Discover your perfect signature scent from our premium range.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Filters Sidebar (Desktop) / Top Bar (Mobile) */}
          <div className="md:w-1/4">
            <div className="bg-[#111] border border-white/5 rounded-xl p-4 sticky top-28">
              <h3 className="font-bold flex items-center gap-2 mb-4 text-purple-400"><Filter className="w-4 h-4"/> Categories</h3>
              <div className="flex md:flex-col gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
                {categories.map((cat, i) => (
                  <button 
                    key={i} 
                    onClick={() => setSelectedCategory(cat)}
                    className={`whitespace-nowrap text-left px-4 py-2 rounded-lg text-sm font-bold transition-all ${selectedCategory === cat ? 'bg-purple-600 text-white' : 'bg-black text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="md:w-3/4">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-400">Showing <span className="text-white font-bold">{filteredProducts.length}</span> products</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {loading ? (
                [1, 2, 3, 4, 5, 6].map((item) => <div key={item} className="h-72 rounded-xl bg-[#111] animate-pulse"></div>)
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product: any) => (
                  <div key={product.id} className="bg-[#111] border border-white/5 rounded-xl p-2.5 flex flex-col relative group hover:border-purple-500/50 transition-all">
                    <button className="absolute top-3 right-3 z-10 p-1.5 bg-black/50 rounded-full text-gray-400 hover:text-red-500"><Heart className="w-4 h-4" /></button>
                    <div className="w-full h-36 md:h-48 bg-black rounded-lg mb-3 overflow-hidden relative">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      {product.stock !== undefined && product.stock < 5 && (
                        <span className="absolute bottom-2 left-2 bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-sm">Only {product.stock} left</span>
                      )}
                    </div>
                    <p className="text-[9px] text-purple-400 font-bold uppercase tracking-wider mb-1">{product.category || 'Luxury'}</p>
                    <h4 className="font-bold text-sm truncate">{product.name}</h4>
                    <div className="flex items-center gap-1 mt-1 mb-2"><Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /><span className="text-[10px] text-gray-400">4.8</span></div>
                    <p className="font-bold text-lg mb-3">₹{product.price}</p>
                    
                    <div className="flex gap-1.5 mt-auto">
                      <button onClick={() => handleAddToCart(product)} className="w-full bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold py-2 rounded-lg transition-all">Cart</button>
                      <button onClick={() => handleBuyNow(product)} className="w-full bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-bold py-2 rounded-lg transition-all shadow-lg shadow-purple-900/20">Buy Now</button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 col-span-2 lg:col-span-3 text-center py-10">No products found in this category.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 🔥 BOTTOM NAV BAR FOR SHOP PAGE (Mobile) */}
      <nav className={`fixed bottom-0 left-0 w-full z-40 bg-[#000000] border-t border-[#222] px-2 py-1.5 pb-safe md:hidden ${isCartOpen ? 'hidden' : 'block'}`}>
        <div className="flex justify-around items-center">
          <button onClick={() => window.location.href = "/"} className="flex flex-col items-center gap-1 p-2 w-16 transition-all text-gray-400 hover:text-white">
            <HomeIcon className="w-5 h-5" />
            <span className="text-[10px] font-medium">Home</span>
          </button>
          <button onClick={() => window.location.href = "/"} className="flex flex-col items-center gap-1 p-2 w-16 transition-all text-gray-400 hover:text-white">
            <LayoutGrid className="w-5 h-5" />
            <span className="text-[10px] font-medium">Categories</span>
          </button>
          <button onClick={() => window.location.href = "/shop"} className="flex flex-col items-center gap-1 p-2 w-16 transition-all text-purple-500">
            <ShoppingBag className="w-5 h-5" />
            <span className="text-[10px] font-medium">Shop</span>
          </button>
          <button onClick={() => window.location.href = "/"} className="flex flex-col items-center gap-1 p-2 w-16 transition-all text-gray-400 hover:text-white">
            <Heart className="w-5 h-5" />
            <span className="text-[10px] font-medium">Wishlist</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Shop;
