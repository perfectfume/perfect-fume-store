import React, { useEffect } from 'react';
import { Heart, Trash2, ShoppingCart, ArrowRight } from 'lucide-react';
import { useStore } from '../store/useStore';

const Wishlist = () => {
  const { wishlist, toggleWishlist, addToCart, userEmail, isCartOpen, toggleCart } = useStore();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBuyNow = (product: any) => {
    addToCart(product);
    if (!isCartOpen) toggleCart();
  };

  // 🔥 LOGIN NA KORA THAKLE ETA DEKHABE
  if (!userEmail) {
    return (
      <div className="min-h-screen bg-[#050505] text-white pt-32 pb-24 flex flex-col items-center justify-center text-center px-4 font-sans">
        <div className="w-24 h-24 bg-pink-900/20 rounded-full flex items-center justify-center mb-6 border border-pink-500/20">
          <Heart className="w-12 h-12 text-pink-500" />
        </div>
        <h2 className="text-3xl font-bold mb-4 italic">Please Sign In</h2>
        <p className="text-gray-400 mb-8 max-w-sm">You need to be logged in to view and save items to your wishlist.</p>
        <p className="text-pink-400 font-bold border border-pink-500/30 px-6 py-3 rounded-full bg-pink-900/10">👆 Click 'Sign In' at the top right corner</p>
      </div>
    );
  }

  // 🔥 LOGIN KORA THAKLE ETA DEKHABE
  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-24 font-sans">
      <main className="max-w-6xl mx-auto px-4">
        
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-pink-900/30 rounded-2xl flex items-center justify-center border border-pink-500/30 mx-auto mb-6">
            <Heart className="w-8 h-8 text-pink-400 fill-pink-400" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold italic mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-600">
            Your Wishlist
          </h1>
          <p className="text-gray-400">Products you've loved and saved for later.</p>
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center bg-[#111] border border-white/5 p-12 rounded-3xl max-w-2xl mx-auto">
            <Heart className="w-16 h-16 text-gray-600 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-white mb-3">Your wishlist is empty</h3>
            <p className="text-gray-400 mb-8">Explore our collection and add your favorite fragrances here to easily find them later.</p>
            <button onClick={() => window.location.href='/shop'} className="bg-white text-black font-bold px-8 py-3.5 rounded-full hover:bg-pink-600 hover:text-white transition-all shadow-lg flex justify-center items-center gap-2 mx-auto">
              Go to Shop <ArrowRight className="w-4 h-4"/>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {wishlist.map((product) => (
              <div key={product.id} className="bg-[#111] border border-white/5 rounded-2xl p-3 md:p-4 flex flex-col relative group hover:border-pink-500/30 transition-all">
                <button 
                  onClick={() => toggleWishlist(product)} 
                  className="absolute top-4 right-4 z-20 p-2 bg-black/60 backdrop-blur-md rounded-full text-pink-500 hover:bg-pink-500 hover:text-white transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                
                <div onClick={() => window.location.href = `/product/${product.id}`} className="cursor-pointer flex flex-col flex-1">
                  <div className="w-full h-40 md:h-48 bg-black rounded-xl mb-3 overflow-hidden relative">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <p className="text-[10px] text-pink-400 font-bold uppercase tracking-wider mb-1">{product.category}</p>
                  <h4 className="font-bold text-sm truncate mb-1 text-white group-hover:text-pink-400 transition-colors">{product.name}</h4>
                  <p className="font-bold text-lg mb-4">₹{product.price}</p>
                </div>
                
                <div className="flex gap-2 mt-auto">
                  <button onClick={() => { addToCart(product); alert(`✅ ${product.name} added to cart!`); }} className="flex-1 bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-2.5 rounded-lg transition-all flex justify-center items-center">
                    <ShoppingCart className="w-4 h-4"/>
                  </button>
                  <button onClick={() => handleBuyNow(product)} className="flex-1 bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold py-2.5 rounded-lg transition-all shadow-lg shadow-pink-900/30">
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Wishlist;
