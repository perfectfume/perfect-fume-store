import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Heart, Star, Truck, ShieldCheck, Droplets, Wind, ArrowLeft, CheckCircle } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams(); // URL theke product ID ta nebe
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState('');
  const [gallery, setGallery] = useState<string[]>([]);
  
  const { userEmail, addToCart, isCartOpen, toggleCart } = useStore();
  const API_URL = import.meta.env.VITE_API_URL || "https://perfect-fume-backend.perfectfumeofficial.workers.dev";

  useEffect(() => {
    window.scrollTo(0, 0); // Ekdom top theke page open hobe
    
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/api/catalog`);
        const data = await res.json();
        // ID diye sothik product ta khunje ber kora
        const foundProduct = data.find((p: any) => p.id.toString() === id);
        
        if (foundProduct) {
          setProduct(foundProduct);
          setMainImage(foundProduct.image);
          
          // Gallery images parse kora (Admin panel e jeta add kora hoyechilo)
          let parsedGallery = [];
          try {
            parsedGallery = foundProduct.gallery ? JSON.parse(foundProduct.gallery) : [];
          } catch (e) {}
          setGallery([foundProduct.image, ...parsedGallery]);
        }
      } catch (error) {
        console.error("Failed to fetch product details");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!userEmail) return alert("⚠️ Sobaiprothome upore 'Sign In'-e click kore Login korun!");
    addToCart(product);
    alert(`✅ ${product.name} apnar Jhhuri-te (Cart) add hoyeche!`);
  };

  const handleBuyNow = () => {
    if (!userEmail) return alert("⚠️ Sobaiprothome upore 'Sign In'-e click kore Login korun!");
    addToCart(product);
    if (!isCartOpen) toggleCart();
  };

  if (loading) {
    return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-purple-400 font-bold animate-pulse">Loading Luxury Experience...</div>;
  }

  if (!product) {
    return <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white"><h2 className="text-2xl font-bold mb-4">Product Not Found</h2><button onClick={() => window.location.href = '/shop'} className="bg-purple-600 px-6 py-2 rounded-lg">Back to Shop</button></div>;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-16 md:pt-24 pb-24 font-sans">
      <main className="max-w-6xl mx-auto px-4">
        
        {/* Back Button (Mobile e beshi kaje lage) */}
        <button onClick={() => window.history.back()} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-5 h-5" /> <span className="text-sm font-bold">Back</span>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          
          {/* 🔥 LEFT: Image Gallery */}
          <div className="space-y-4">
            <div className="w-full h-[350px] md:h-[500px] bg-black rounded-2xl border border-white/10 overflow-hidden relative group">
              <img src={mainImage} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <button className="absolute top-4 right-4 p-3 bg-black/40 rounded-full backdrop-blur-md border border-white/10 hover:text-red-500 transition-all text-gray-300">
                <Heart className="w-5 h-5" />
              </button>
            </div>
            
            {/* Thumbnail Images */}
            {gallery.length > 1 && (
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                {gallery.map((img, index) => (
                  <button 
                    key={index} 
                    onClick={() => setMainImage(img)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 bg-black ${mainImage === img ? 'border-purple-500 opacity-100' : 'border-transparent opacity-50 hover:opacity-100'}`}
                  >
                    <img src={img} className="w-full h-full object-cover" alt="thumbnail" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 🔥 RIGHT: Product Info */}
          <div className="flex flex-col">
            <p className="text-purple-400 font-bold uppercase tracking-widest text-xs mb-2">{product.category || 'Luxury Collection'}</p>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">{product.name}</h1>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-1 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-bold">4.8</span>
              </div>
              <span className="text-gray-500 text-sm underline cursor-pointer hover:text-white">Read 124 Reviews</span>
            </div>

            <p className="text-3xl md:text-4xl font-bold text-white mb-6">₹{product.price}</p>

            <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-8">
              {product.description || "Experience a fragrance that defines elegance. Crafted with the finest ingredients, this perfume is designed to leave a lasting impression wherever you go."}
            </p>

            {/* Desktop Action Buttons (Mobile e fixed bottom thakbe) */}
            <div className="hidden md:flex gap-4 mb-10">
              <button onClick={handleAddToCart} className="flex-1 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold py-4 rounded-xl transition-all flex justify-center items-center gap-2">
                Add to Cart
              </button>
              <button onClick={handleBuyNow} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-purple-900/30">
                Buy It Now
              </button>
            </div>

            {/* Stock & Delivery Info */}
            <div className="space-y-4 bg-[#111] p-5 rounded-xl border border-white/5 mb-8">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <p className="text-sm text-gray-300"><span className="text-white font-bold">In Stock.</span> Ships within 24 hours.</p>
              </div>
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-purple-400" />
                <p className="text-sm text-gray-300">Free Pan-India Delivery on prepaid orders.</p>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
                <p className="text-sm text-gray-300">100% Authentic & Premium Quality.</p>
              </div>
            </div>

            {/* 🔥 Fragrance Chemistry (Premium Section) */}
            <h3 className="text-xl font-bold italic text-purple-400 mb-4 border-b border-white/10 pb-2">The Olfactory Journey</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-[#111] p-4 rounded-xl border border-white/5 text-center">
                <Wind className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                <h4 className="font-bold text-sm mb-1">Top Notes</h4>
                <p className="text-xs text-gray-500">First impression (lasts 15-30 mins)</p>
              </div>
              <div className="bg-[#111] p-4 rounded-xl border border-white/5 text-center">
                <Heart className="w-6 h-6 text-pink-500 mx-auto mb-2" />
                <h4 className="font-bold text-sm mb-1">Heart Notes</h4>
                <p className="text-xs text-gray-500">The core character (lasts 2-4 hours)</p>
              </div>
              <div className="bg-[#111] p-4 rounded-xl border border-white/5 text-center">
                <Droplets className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                <h4 className="font-bold text-sm mb-1">Base Notes</h4>
                <p className="text-xs text-gray-500">The lasting memory (lasts 8-12 hours)</p>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* 🔥 MOBILE FIXED BOTTOM BAR (Always visible on product page) */}
      <div className="fixed bottom-0 left-0 w-full bg-[#050505]/90 backdrop-blur-lg border-t border-white/10 p-3 pb-safe z-40 flex gap-3 md:hidden">
        <button onClick={handleAddToCart} className="flex-1 bg-[#111] border border-white/10 text-white text-sm font-bold py-3.5 rounded-xl transition-all">
          Add to Cart
        </button>
        <button onClick={handleBuyNow} className="flex-1 bg-purple-600 text-white text-sm font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-purple-900/30">
          Buy Now
        </button>
      </div>

    </div>
  );
};

export default ProductDetails;
                
