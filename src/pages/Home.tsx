import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore'; 
import { Heart, Star, ChevronRight, Home as HomeIcon, LayoutGrid, ShoppingBag } from 'lucide-react';

const HomePage = () => {
  const categories = ['All', 'Men', 'Women', 'Unisex', 'Luxury', 'Travel Size'];
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState('home');
  
  // 🔥 NOTUN: Category select korar state
  const [selectedCategory, setSelectedCategory] = useState('All');

  const { userEmail, addToCart, isCartOpen, toggleCart } = useStore();
  const API_URL = import.meta.env.VITE_API_URL || "https://perfect-fume-backend.perfectfumeofficial.workers.dev";

  const banners = [
    "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=1200&auto=format&fit=crop"
  ];

  useEffect(() => {
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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const handleAddToCart = (product: any) => {
    if (!userEmail) {
      alert("⚠️ Sobaiprothome upore 'Sign In'-e click kore Login korun!");
      return;
    }
    addToCart(product);
    alert(`✅ ${product.name} apnar Jhhuri-te (Cart) add hoyeche!`);
  };

  const handleBuyNow = (product: any) => {
    if (!userEmail) {
      alert("⚠️ Sobaiprothome upore 'Sign In'-e click kore Login korun!");
      return;
    }
    addToCart(product);
    if (!isCartOpen) toggleCart(); 
  };

  // 🔥 NOTUN: Category onujayi product filter kora
  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter((p: any) => p.category?.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-20 pb-20 font-sans">
      <main className="max-w-6xl mx-auto">
        
        {/* 🔥 CATEGORIES BAR (Clickable) */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 pt-2 pb-4">
          {categories.map((cat, i) => (
            <button 
              key={i} 
              onClick={() => setSelectedCategory(cat)} // 🔥 NOTUN: Click korle state change hobe
              className={`whitespace-nowrap px-5 py-1.5 rounded-full text-xs font-bold border transition-all ${selectedCategory === cat ? 'bg-purple-600 border-purple-500 text-white' : 'bg-[#111] border-white/10 text-gray-300 hover:bg-white/10'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* HERO BANNER SLIDER */}
        <div className="relative w-full h-[180px] md:h-[400px] overflow-hidden mt-1 group">
          {banners.map((imgUrl, index) => (
            <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
              <img src={imgUrl} alt={`Banner ${index + 1}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80"></div>
            </div>
          ))}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
            {banners.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === currentSlide ? 'w-6 bg-purple-500' : 'w-2 bg-white/50'}`} />
            ))}
          </div>
        </div>

        {/* TRENDING NOW (Shudhu Top 4) */}
        <div className="mt-8 px-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Trending Products</h3>
            <button className="text-xs bg-purple-600/20 text-purple-400 px-3 py-1 rounded-full font-bold">View All</button>
          </div>
          
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 md:mx-0 md:px-0 snap-x">
            {loading ? (
              [1, 2, 3].map((item) => <div key={item} className="min-w-[160px] h-60 rounded-xl bg-[#111] animate-pulse"></div>)
            ) : products.length > 0 ? (
              products.slice(0, 4).map((product: any) => (
                <div key={product.id} className="snap-start min-w-[160px] md:min-w-[200px] bg-[#111] border border-white/5 rounded-xl p-2 flex flex-col relative">
                  <button className="absolute top-2 right-2 z-10 p-1.5 bg-black/50 rounded-full text-gray-400 hover:text-red-500"><Heart className="w-3.5 h-3.5" /></button>
                  <div className="w-full h-32 md:h-40 bg-black rounded-lg mb-2 overflow-hidden">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <h4 className="font-bold text-sm truncate">{product.name}</h4>
                  <div className="flex items-center gap-1 mt-0.5 mb-1"><Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /><span className="text-[10px] text-gray-400">4.8</span></div>
                  <p className="font-bold text-base mt-auto mb-2">₹{product.price}</p>
                  <button onClick={() => handleAddToCart(product)} className="w-full bg-white/10 hover:bg-purple-600 text-white text-[10px] font-bold py-2 rounded-lg transition-all">Add to Cart</button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No products found.</p>
            )}
          </div>
        </div>

        {/* 🔥 ALL PRODUCTS (Filtered) */}
        <div className="mt-8 px-4 pb-6">
          <h3 className="text-lg font-bold mb-4">{selectedCategory === 'All' ? 'All Products' : `${selectedCategory} Collection`}</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {loading ? (
              [1, 2, 3, 4].map((item) => <div key={item} className="h-72 rounded-xl bg-[#111] animate-pulse"></div>)
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product: any) => (
                <div key={`all-${product.id}`} className="bg-[#111] border border-white/5 rounded-xl p-2.5 flex flex-col relative group hover:border-purple-500/50 transition-all">
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
              <p className="text-gray-500 col-span-2 md:col-span-4 text-center py-8">Ei category te kono product nei.</p>
            )}
          </div>
        </div>
      </main>
   {/* 🔥 BOTTOM NAV BAR (Mobile Fix - Link added) */}
      <nav className={`fixed bottom-0 left-0 w-full z-40 bg-[#000000] border-t border-[#222] px-2 py-1.5 pb-safe md:hidden ${isCartOpen ? 'hidden' : 'block'}`}>
        <div className="flex justify-around items-center">
          <button onClick={() => window.location.href = "/"} className="flex flex-col items-center gap-1 p-2 w-16 transition-all text-purple-500">
            <HomeIcon className="w-5 h-5" />
            <span className="text-[10px] font-medium">Home</span>
          </button>
          <button onClick={() => window.location.href = "/"} className="flex flex-col items-center gap-1 p-2 w-16 transition-all text-gray-400 hover:text-white">
            <LayoutGrid className="w-5 h-5" />
            <span className="text-[10px] font-medium">Categories</span>
          </button>
          <button onClick={() => window.location.href = "/shop"} className="flex flex-col items-center gap-1 p-2 w-16 transition-all text-gray-400 hover:text-white">
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

export default HomePage;
                       
