import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore'; 

const HomePage = () => {
  const categories = ['All', 'Men', 'Women', 'Unisex', 'Luxury', 'Travel Size'];
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Store theke notun magic function gulo nilam
  const { userEmail, addToCart, isCartOpen, toggleCart } = useStore();

  const API_URL = import.meta.env.VITE_API_URL || "https://perfect-fume-backend.perfectfumeofficial.workers.dev";

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

  // Shudhu jhhuri-te add korbe
  const handleAddToCart = (product) => {
    if (!userEmail) {
      alert("⚠️ Sobaiprothome upore 'Sign In'-e click kore Login korun!");
      return;
    }
    addToCart(product);
    alert(`✅ ${product.name} apnar Jhhuri-te (Cart) add hoyeche!`);
  };

  // Add to cart korbe r sathe sathe dan dik theke jhhuri khule debe
  const handleBuyNow = (product) => {
    if (!userEmail) {
      alert("⚠️ Sobaiprothome upore 'Sign In'-e click kore Login korun!");
      return;
    }
    addToCart(product);
    
    // Jhhuri bondho thakle khule jabe jate manush 'Proceed to Checkout' dekhte pay
    if (!isCartOpen) {
      toggleCart(); 
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 font-sans">
      
      <section className="px-4 py-6">
        <div className="max-w-7xl mx-auto h-[200px] md:h-[400px] rounded-2xl bg-gradient-to-br from-purple-900/40 to-black border border-white/10 overflow-hidden flex items-center px-8 relative">
          <div className="z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-2 italic">Royal Oud Series</h2>
            <p className="text-gray-400 mb-6 max-w-md text-sm md:text-base">Experience the essence of luxury. Pure, long-lasting, and elegant.</p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-4 flex gap-4 overflow-x-auto no-scrollbar">
        {categories.map((cat) => (
          <button key={cat} className="whitespace-nowrap px-6 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-purple-600 hover:border-purple-500 transition-all text-sm font-semibold">
            {cat}
          </button>
        ))}
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          Trending Now <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {loading ? (
            [1, 2, 3, 4].map((item) => <div key={item} className="h-72 rounded-xl bg-white/5 border border-white/10 animate-pulse"></div>)
          ) : products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className="rounded-xl bg-white/5 border border-white/10 flex flex-col overflow-hidden hover:border-purple-500 transition-colors group">
                <img src={product.image} alt={product.name} className="w-full h-40 object-cover bg-black" />
                <div className="p-4 flex flex-col flex-grow">
                  <p className="text-[10px] uppercase tracking-wider text-purple-400 mb-1 font-bold">{product.category}</p>
                  <h4 className="font-bold text-sm truncate">{product.name}</h4>
                  <p className="text-lg font-bold mt-1 mb-4">₹{product.price}</p>
                  
                  <div className="flex gap-2 mt-auto">
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-white/10 hover:bg-purple-600 text-white text-xs font-bold py-2.5 rounded-lg transition-all"
                    >
                      Add to Cart
                    </button>
                    <button 
                      onClick={() => handleBuyNow(product)}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold py-2.5 rounded-lg transition-all shadow-lg shadow-purple-900/20"
                    >
                      Buy Now
                    </button>
                  </div>

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
          
