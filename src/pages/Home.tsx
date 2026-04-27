import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore'; // 🔥 NOTUN: Brain (Store) import kora holo

const HomePage = () => {
  const categories = ['All', 'Men', 'Women', 'Unisex', 'Luxury', 'Travel Size'];
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [checkoutStep, setCheckoutStep] = useState(0); 
  const [isProcessing, setIsProcessing] = useState(false);

  // 🔥 NOTUN: Store theke user data r addToCart function nilam
  const { userEmail, addToCart } = useStore();

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

  // 🔥 NOTUN: Add to Cart Logic
  const handleAddToCart = (product) => {
    if (!userEmail) {
      alert("⚠️ Sobaiprothome upore 'Account'-e click kore Login korun!");
      return;
    }
    addToCart(product);
    alert(`✅ ${product.name} apnar Jhhuri-te (Cart) add hoyeche!`);
  };

  // 🔥 NOTUN: Buy Now Logic (Login Check + Auto Email Fill)
  const handleBuyNow = (product) => {
    if (!userEmail) {
      alert("⚠️ Sobaiprothome upore 'Account'-e click kore Login korun!");
      return;
    }
    setSelectedProduct(product);
    setEmail(userEmail); // Customer er email auto-fill hoye jabe
    setCheckoutStep(1); 
  };

  const sendOtp = async () => {
    if (!email.includes('@')) return alert("Sothik email din!");
    setIsProcessing(true);
    try {
      const res = await fetch(`${API_URL}/api/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          cart: [{ 
            id: selectedProduct?.id, 
            name: selectedProduct?.name, 
            price: selectedProduct?.price, 
            qty: 1 
          }] 
        }) 
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCheckoutStep(2); 
        alert("OTP Pathano hoyeche! Mail check korun.");
      } else {
        alert("Error: " + (data.error || "Backend e somossya"));
      }
    } catch (err) {
      alert("Network Error! Backend live nei ba URL vul achhe.");
    }
    setIsProcessing(false);
  };

  const verifyOtp = async () => {
    if (otp.length < 4) return alert("OTP din!");
    setIsProcessing(true);
    try {
      const res = await fetch(`${API_URL}/api/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        alert("🎉 Order Confirmed! Apnar Admin mail-ta check korun.");
        setCheckoutStep(0); 
        setOtp('');
      } else {
        alert(data.error || "Vul OTP!");
      }
    } catch (err) {
      alert("Network Error!");
    }
    setIsProcessing(false);
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
                  
                  {/* 🔥 NOTUN: Add to Cart r Buy Now Button Duto eksathe */}
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

      {/* Checkout Popup Modal */}
      {checkoutStep > 0 && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 px-4">
          <div className="bg-[#111] border border-white/10 p-6 rounded-2xl w-full max-w-md relative shadow-2xl animate-in zoom-in-95 duration-200">
            <button onClick={() => setCheckoutStep(0)} className="absolute top-4 right-4 text-gray-500 hover:text-white bg-white/5 p-2 rounded-full">✕</button>
            
            <h2 className="text-2xl font-bold mb-4 italic text-purple-400">Express Checkout</h2>
            
            <div className="flex gap-4 mb-6 bg-white/5 p-3 rounded-xl border border-white/10">
              <img src={selectedProduct?.image} className="w-16 h-16 rounded-lg object-cover bg-black" />
              <div>
                <h4 className="font-bold text-sm">{selectedProduct?.name}</h4>
                <p className="text-purple-400 font-bold mt-1">₹{selectedProduct?.price}</p>
              </div>
            </div>

            {checkoutStep === 1 && (
              <div>
                <label className="block text-sm text-gray-400 mb-2">Apnar Email</label>
                <input 
                  type="email" value={email} readOnly 
                  className="w-full bg-black/50 border border-white/5 rounded-lg p-3 outline-none text-gray-500 mb-4 cursor-not-allowed"
                />
                <button onClick={sendOtp} disabled={isProcessing} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-purple-900/20">
                  {isProcessing ? 'Sending...' : 'Send OTP securely'}
                </button>
              </div>
            )}

            {checkoutStep === 2 && (
              <div>
                <p className="text-xs text-green-400 mb-4 bg-green-900/20 p-2 rounded-lg border border-green-500/20">✅ OTP sent to {email}</p>
                <label className="block text-sm text-gray-400 mb-2">OTP Din</label>
                <input 
                  type="number" value={otp} onChange={(e) => setOtp(e.target.value)} 
                  className="w-full bg-black border border-white/10 rounded-lg p-3 outline-none text-white mb-4 text-center tracking-[1em] font-bold text-xl focus:border-green-500"
                  placeholder="----"
                />
                <button onClick={verifyOtp} disabled={isProcessing} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-green-900/20">
                  {isProcessing ? 'Verifying...' : 'Verify & Place Order'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      
    </div>
  );
};

export default HomePage;
