import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore'; 
import { Sparkles, ChevronRight, Heart, Star, Clock, Truck, Home as HomeIcon, LayoutGrid, ShoppingBag } from 'lucide-react';

const HomePage = () => {
  const categories = ['All', 'Men', 'Women', 'Unisex', 'Luxury', 'Travel Size'];
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState('home');

  // Store theke magic function gulo nilam
  const { userEmail, addToCart, isCartOpen, toggleCart } = useStore();

  const API_URL = import.meta.env.VITE_API_URL || "https://perfect-fume-backend.perfectfumeofficial.workers.dev";

  // 🔥 Premium Banners for Slider
  const banners = [
    { id: 1, title: "Royal Oud Series", subtitle: "Experience the essence of luxury. Pure, long-lasting, and elegant.", color: "from-purple-900/80 to-black" },
    { id: 2, title: "Midnight Musk", subtitle: "Unleash your dark side with our new signature collection.", color: "from-blue-900/80 to-black" },
    { id: 3, title: "Summer Citrus", subtitle: "Stay fresh all day with 20% OFF on fresh notes.", color: "from-emerald-900/80 to-black" }
  ];

  // Fetch Products
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

  // Auto Slider Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, [banners.length]);

  // Shudhu jhhuri-te add korbe
  const handleAddToCart = (product: any) => {
    if (!userEmail) {
      alert("⚠️ Sobaiprothome upore 'Sign In'-e click kore Login korun!");
      return;
    }
    addToCart(product);
    alert(`✅ ${product.name} apnar Jhhuri-te (Cart) add hoyeche!`);
  };

  // Add to cart korbe r sathe sathe dan dik theke jhhuri khule debe
  const handleBuyNow = (product: any) => {
    if (!userEmail) {
      alert("⚠️ Sobaiprothome upore 'Sign In'-e click kore Login korun!");
      return;
    }
    addToCart(product);
    
    if (!isCartOpen) {
      toggleCart(); 
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-20 pb-24 font-sans selection:bg-purple-500/30">
      
      <main className="max-w-6xl mx-auto px-4">
        
        {/* 🔥 HERO BANNER SLIDER */}
        <div className="relative w-full h-[250px] md:h-[400px] rounded-3xl overflow-hidden mt-4 border border-white/10 shadow-2xl shadow-purple-900/20 group">
          {banners.map((banner, index) => (
            <div 
              key={banner.id} 
              className={`absolute inset-0 bg-gradient-to-r ${banner.color} transition-opacity duration-1000 p-8 md:p-12 flex flex-col justify-center ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            >
              <Sparkles className="text-purple-400 w-6 h-6 mb-3 animate-pulse" />
              <h2 className="text-3xl md:text-5xl font-bold italic tracking-wide mb-2">{banner.title}</h2>
              <p className="text-gray-300 text-sm md:text-lg max-w-md mb-6">{banner.subtitle}</p>
              <button className="bg-white text-black px-6 py-2 rounded-full font-bold text-sm w-fit hover:scale-105 transition-transform shadow-lg">
                Explore Now
              </button>
            </div>
          ))}
          {/* Slider Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {banners.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === currentSlide ? 'w-6 bg-purple-500' : 'w-2 bg-white/30'}`} />
            ))}
          </div>
        </div>

        {/* 🔥 CATEGORIES (Pills) */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar mt-8 pb-2">
          {categories.map((cat, i) => (
            <button key={i} className={`whitespace-nowrap px-5 py-2 rounded-full text-xs font-bold border transition-all ${i === 0 ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-900/40' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'}`}>
              {cat}
            </button>
          ))}
        </div>

        {/* 🔥 TRENDING NOW (Horizontal Scroll & Premium Cards) */}
        <div className="mt-10">
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2">Trending Now <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"/></h3>
            <button className="text-xs text-purple-400 font-bold flex items-center hover:text-purple-300">View All <ChevronRight className="w-4 h-4"/></button>
          </div>
          
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 md:mx-0 md:px-0 snap-x">
            {loading ? (
              [1, 2, 3, 4].map((item) => (
                <div key={item} className="min-w-[220px] h-72 rounded-2xl bg-white/5 border border-white/10 animate-pulse"></div>
              ))
            ) : products.length > 0 ? (
              products.map((product: any) => (
                <div key={product.id} className="snap-start min-w-[200px] md:min-w-[240px] bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col group relative overflow-hidden backdrop-blur-sm hover:border-purple-500/50 transition-all">
                  <button className="absolute top-4 right-4 z-10 p-1.5 bg-black/40 rounded-full backdrop-blur-md border border-white/10 text-gray-400 hover:text-red-500 hover:scale-110 transition-all">
                    <Heart className="w-4 h-4" />
                  </button>
                  <div className="w-full h-36 md:h-44 bg-black rounded-xl mb-3 overflow-hidden">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <p className="text-[10px] text-purple-400 font-bold uppercase tracking-wider mb-1">{product.category || 'Luxury'}</p>
                  <h4 className="font-bold text-sm md:text-base truncate">{product.name}</h4>
                  <div className="flex items-center gap-1 mt-1 mb-2">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /><span className="text-xs text-gray-400">4.8</span>
                  </div>
                  <p className="font-bold text-lg mb-3">₹{product.price}</p>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-auto">
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-white/10 hover:bg-purple-600 text-white text-[10px] md:text-xs font-bold py-2 rounded-lg transition-all"
                    >
                      Add to Cart
                    </button>
                    <button 
                      onClick={() => handleBuyNow(product)}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white text-[10px] md:text-xs font-bold py-2 rounded-lg transition-all shadow-lg shadow-purple-900/20"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 w-full text-center py-10">Kono product pawa jayni.</p>
            )}
          </div>
        </div>

        {/* 🔥 WHY CHOOSE US (Trust Badges) */}
        <div className="mt-10 grid grid-cols-3 gap-4 border-y border-white/10 py-8 mb-8">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-purple-900/30 flex items-center justify-center border border-purple-500/30"><Sparkles className="w-6 h-6 text-purple-400"/></div>
            <p className="text-[10px] md:text-xs font-bold text-gray-300 uppercase tracking-wider">Premium<br/>Quality</p>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-900/30 flex items-center justify-center border border-blue-500/30"><Clock className="w-6 h-6 text-blue-400"/></div>
            <p className="text-[10px] md:text-xs font-bold text-gray-300 uppercase tracking-wider">Long<br/>Lasting</p>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-green-900/30 flex items-center justify-center border border-green-500/30"><Truck className="w-6 h-6 text-green-400"/></div>
            <p className="text-[10px] md:text-xs font-bold text-gray-300 uppercase tracking-wider">Fast<br/>Delivery</p>
          </div>
        </div>
      </main>

      {/* 🔥 BOTTOM NAVIGATION BAR (Mobile Style) */}
      <nav className="fixed bottom-0 left-0 w-full z-50 bg-[#0a0a0a]/90 backdrop-blur-xl border-t border-white/10 px-6 py-3 pb-safe md:hidden">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'home' ? 'text-purple-400 scale-110' : 'text-gray-500 hover:text-gray-300'}`}>
            <HomeIcon className="w-6 h-6" />
            <span className="text-[9px] font-bold">Home</span>
          </button>
          <button onClick={() => setActiveTab('categories')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'categories' ? 'text-purple-400 scale-110' : 'text-gray-500 hover:text-gray-300'}`}>
            <LayoutGrid className="w-6 h-6" />
            <span className="text-[9px] font-bold">Categories</span>
          </button>
          <button onClick={() => setActiveTab('shop')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'shop' ? 'text-purple-400 scale-110' : 'text-gray-500 hover:text-gray-300'}`}>
            <ShoppingBag className="w-6 h-6" />
            <span className="text-[9px] font-bold">Shop</span>
          </button>
          <button onClick={() => setActiveTab('wishlist')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'wishlist' ? 'text-pink-500 scale-110' : 'text-gray-500 hover:text-gray-300'}`}>
            <Heart className="w-6 h-6" />
            <span className="text-[9px] font-bold">Wishlist</span>
          </button>
        </div>
      </nav>

    </div>
  );
};

export default HomePage;
              
