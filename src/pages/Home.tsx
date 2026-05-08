import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore'; 
import { Heart, Star, Sparkles, ArrowRight } from 'lucide-react';
import QuizModal from '../components/QuizModal';


const HomePage = () => {
  const categories = ['All', 'Men', 'Women', 'Unisex', 'Luxury', 'Travel Size'];
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // 🔥 DYNAMIC BANNERS STATE
  const [banners, setBanners] = useState<string[]>([]);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  const { userEmail, addToCart, isCartOpen, toggleCart, wishlist, toggleWishlist } = useStore();
  const API_URL = import.meta.env.VITE_API_URL || "https://perfect-fume-backend.perfectfumeofficial.workers.dev";

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // 1. Fetch Products
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

    // 2. Fetch Banners (Admin Panel theke)
    const fetchBanners = async () => {
      try {
        const res = await fetch(`${API_URL}/api/banners`);
        const data = await res.json();
        if(data && data.length > 0) {
            setBanners(data);
        } else {
            // Default image jodi DB te kichu na thake
            setBanners(["https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1200&auto=format&fit=crop"]);
        }
      } catch (error) {
        console.error("Banner fetch fail");
      }
    };
    fetchBanners();
  }, []);

  // Slider Logic (4 seconds por por change hobe)
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const handleAddToCart = (product: any) => {
    if (!userEmail) return alert("⚠️ Sobaiprothome upore 'Sign In'-e click kore Login korun!");
    addToCart(product);
    alert(`✅ ${product.name} add hoyeche!`);
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
    <div className="min-h-screen bg-[#050505] text-white pt-20 pb-20 font-sans">
      <main className="max-w-6xl mx-auto">
        
        {/* Category Menu */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 pt-2 pb-4">
          {categories.map((cat, i) => (
            <button 
              key={i} 
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-5 py-1.5 rounded-full text-xs font-bold border transition-all ${selectedCategory === cat ? 'bg-purple-600 border-purple-500 text-white' : 'bg-[#111] border-white/10 text-gray-300 hover:bg-white/10'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 🔥 16:9 RATIO BANNER SECTION 🔥 */}
        {banners.length > 0 && (
          <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden mt-1 group bg-black shadow-2xl">
            {banners.map((imgUrl, index) => (
              <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                <img src={imgUrl} alt={`Banner ${index + 1}`} className="w-full h-full object-cover" />
                {/* Overlay for better text visibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-90"></div>
              </div>
            ))}
        {/* 🔥 Scent Discovery Quiz Button */}
        <div className="px-4 mt-8">
          <div onClick={() => setIsQuizOpen(true)} className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-500/30 p-6 rounded-3xl cursor-pointer hover:scale-[1.02] transition-all group overflow-hidden relative shadow-lg">
            <div className="relative z-10">
              <h3 className="text-xl font-bold italic flex items-center gap-2 mb-1 text-white">
                <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" /> Scent Discovery Quiz
              </h3>
              <p className="text-xs text-gray-400">পারফেক্ট সুবাস খুঁজে পাচ্ছেন না? মাত্র ৩০ সেকেন্ডের কুইজটি খেলে আপনার জন্য সেরা পারফিউমটি বেছে নিন।</p>
            </div>
            <ArrowRight className="absolute right-6 top-1/2 -translate-y-1/2 w-8 h-8 text-white/10 group-hover:text-purple-500/50 group-hover:translate-x-2 transition-all" />
          </div>
        </div>
            
            
            {/* Slider Dots */}
            {banners.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {banners.map((_, i) => (
                    <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === currentSlide ? 'w-8 bg-purple-500' : 'w-2 bg-white/30'}`} />
                ))}
                </div>
            )}
          </div>
        )}

        {/* TRENDING SECTION */}
        <div className="mt-8 px-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold italic tracking-wide">Trending Now</h3>
            <button onClick={() => window.location.href='/shop'} className="text-[10px] uppercase tracking-widest bg-white/5 border border-white/10 text-gray-400 px-4 py-1.5 rounded-full hover:bg-purple-600 hover:text-white transition-all">View All</button>
          </div>
          
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 md:mx-0 md:px-0">
            {loading ? (
              [1, 2, 3].map((item) => <div key={item} className="min-w-[180px] h-64 rounded-2xl bg-[#111] animate-pulse"></div>)
            ) : products.length > 0 ? (
              products.slice(0, 5).map((product: any) => (
                <div key={product.id} className="min-w-[180px] md:min-w-[220px] bg-[#111] border border-white/5 rounded-2xl p-3 flex flex-col relative group hover:border-purple-500/40 transition-all">
                  <button onClick={() => toggleWishlist(product)} className="absolute top-4 right-4 z-20 p-2 bg-black/60 backdrop-blur-md rounded-full text-white hover:text-pink-500 transition-all">
                    <Heart className={`w-4 h-4 ${wishlist?.find((w: any) => w.id === product.id) ? 'fill-pink-500 text-pink-500' : ''}`} />
                  </button>
                  
                  <div onClick={() => window.location.href = '/product/' + product.id} className="cursor-pointer">
                    <div className="w-full h-40 bg-black rounded-xl mb-3 overflow-hidden">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <h4 className="font-bold text-sm truncate mb-1">{product.name}</h4>
                    <div className="flex items-center gap-1 mb-2">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-[10px] text-gray-500 font-bold">4.8</span>
                    </div>
                    <p className="font-bold text-lg mb-3">₹{product.price}</p>
                  </div>

                  <button onClick={() => handleAddToCart(product)} className="w-full bg-white/5 hover:bg-purple-600 text-white text-[10px] font-bold py-2.5 rounded-xl border border-white/10 transition-all uppercase tracking-wider">Add to Cart</button>
                </div>
              ))
            ) : <p className="text-gray-500 text-sm">No products found.</p>}
          </div>
        </div>

        {/* ALL PRODUCTS GRID */}
        <div className="mt-12 px-4 pb-12">
          <h3 className="text-xl font-bold italic mb-6 text-gray-300">{selectedCategory === 'All' ? 'Our Collection' : `${selectedCategory}`}</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {loading ? (
              [1, 2, 3, 4].map((item) => <div key={item} className="h-80 rounded-2xl bg-[#111] animate-pulse"></div>)
            ) : filteredProducts.map((product: any) => (
                <div key={product.id} className="bg-[#111] border border-white/5 rounded-2xl p-3 flex flex-col relative group hover:border-purple-500/40 transition-all">
                  <button onClick={() => toggleWishlist(product)} className="absolute top-4 right-4 z-20 p-2 bg-black/60 backdrop-blur-md rounded-full text-white">
                    <Heart className={`w-4 h-4 ${wishlist?.find((w: any) => w.id === product.id) ? 'fill-pink-500 text-pink-500' : ''}`} />
                  </button>
                  
                  <div onClick={() => window.location.href = '/product/' + product.id} className="cursor-pointer flex-1">
                    <div className="w-full h-44 md:h-56 bg-black rounded-xl mb-3 overflow-hidden relative">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      {product.stock < 5 && (
                        <span className="absolute top-2 left-2 bg-red-600 text-white text-[8px] font-bold px-2 py-0.5 rounded-sm uppercase">Low Stock</span>
                      )}
                    </div>
                    <p className="text-[9px] text-purple-400 font-bold uppercase tracking-widest mb-1">{product.category}</p>
                    <h4 className="font-bold text-sm truncate mb-1">{product.name}</h4>
                    <p className="font-bold text-lg mb-4">₹{product.price}</p>
                  </div>
                  
                  <div className="flex gap-2 relative z-20 mt-auto">
                    <button onClick={() => handleAddToCart(product)} className="flex-1 bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold py-3 rounded-xl border border-white/10 transition-all uppercase">Cart</button>
                    <button onClick={() => handleBuyNow(product)} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-bold py-3 rounded-xl transition-all shadow-lg shadow-purple-900/20 uppercase">Buy Now</button>
                  </div>
                </div>
            ))}
          </div>
        </div>
        <QuizModal 
          isOpen={isQuizOpen} 
          onClose={() => setIsQuizOpen(false)} 
          products={products} 
          addToCart={addToCart} 
        />
        
      </main>
    </div>
  );
};

export default HomePage;
