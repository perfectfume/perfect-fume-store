import React, { useState } from 'react';
import { Search, ShoppingCart, User, Menu, X, Trash2, LogOut } from 'lucide-react'; 
import { useStore } from '../store/useStore';

const Navbar = () => {
  const { cart, isCartOpen, toggleCart, removeFromCart, getTotals, userEmail, userPhone, setUserAuth, logout, clearCart } = useStore();
  const { total } = getTotals();
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Login Modal States
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [loginStep, setLoginStep] = useState(1); 
  const [emailInput, setEmailInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  
  // 🔥 NOTUN: Checkout Modal States
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutOtp, setCheckoutOtp] = useState('');
  
  const [isProcessing, setIsProcessing] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "https://perfect-fume-backend.perfectfumeofficial.workers.dev";

  // --- LOGIN LOGIC ---
  const handleSendOtp = async (e: any) => {
    e.preventDefault();
    if (!emailInput.includes('@') || phoneInput.length !== 10) {
      return alert("⚠️ Sothik Email ebong ekdom 10 digit Phone Number din!");
    }
    setIsProcessing(true);
    try {
      const res = await fetch(`${API_URL}/api/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setLoginStep(2);
        alert(`✅ OTP pathano hoyeche: ${emailInput} e! Mail check korun.`);
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) { alert("Network Error!"); }
    setIsProcessing(false);
  };

  const handleVerifyOtp = async (e: any) => {
    e.preventDefault();
    if (otpInput.length < 4) return alert("OTP din!");
    setIsProcessing(true);
    try {
      const res = await fetch(`${API_URL}/api/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput, otp: otpInput })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUserAuth(emailInput, phoneInput); 
        setIsAuthOpen(false);
        setLoginStep(1);
        setOtpInput('');
        alert("🎉 Secure Login Successful!");
      } else { alert("Vul OTP!"); }
    } catch (err) { alert("Network Error!"); }
    setIsProcessing(false);
  };

  const handleLogout = () => {
    if(window.confirm("Sotti Logout korben?")) { logout(); }
  };

  // --- 🔥 NOTUN: CHECKOUT LOGIC ---
  const handleProceedToCheckout = async () => {
    if (cart.length === 0) return alert("Apnar Jhhuri faka ache!");
    setIsProcessing(true);
    try {
      // Puro Cart-ta OTP er sathe pathano hocche
      const res = await fetch(`${API_URL}/api/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, cart: cart }) 
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsCheckoutOpen(true); // OTP Modal khulbe
        toggleCart(); // Cart Drawer bondho hobe
        alert(`✅ Order Confirm korar jonno ${userEmail} e OTP pathano hoyeche!`);
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) { alert("Network Error!"); }
    setIsProcessing(false);
  };

  const handleVerifyCheckoutOtp = async (e: any) => {
    e.preventDefault();
    if (checkoutOtp.length < 4) return alert("OTP din!");
    setIsProcessing(true);
    try {
      const res = await fetch(`${API_URL}/api/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, otp: checkoutOtp })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert("🎉 Order Confirmed! Apnar Admin mail check korun.");
        setIsCheckoutOpen(false);
        setCheckoutOtp('');
        clearCart(); // 🔥 Order hoye gele jhhuri faka hoye jabe
      } else { alert("Vul OTP!"); }
    } catch (err) { alert("Network Error!"); }
    setIsProcessing(false);
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-40 bg-black/80 backdrop-blur-lg border-b border-white/10 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-2">
            <Menu className="text-white md:hidden cursor-pointer" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              PERFECT FUME
            </h1>
          </div>

          <div className="hidden md:flex flex-1 max-w-2xl relative">
            <input 
              type="text" 
              placeholder="Search for premium perfumes..." 
              className="w-full bg-white/10 border border-white/20 rounded-md py-2 px-4 pl-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          </div>

          <div className="flex items-center gap-6 text-white">
            {!userEmail ? (
              <div onClick={() => setIsAuthOpen(true)} className="flex flex-col items-center cursor-pointer hover:text-purple-400 transition-colors">
                <User className="w-6 h-6" />
                <span className="text-[10px] hidden md:block">Sign In</span>
              </div>
            ) : (
              <div onClick={handleLogout} className="flex flex-col items-center cursor-pointer text-green-400 hover:text-red-400 transition-colors" title={userEmail}>
                <LogOut className="w-6 h-6" />
                <span className="text-[10px] hidden md:block">Logout</span>
              </div>
            )}
            
            <div onClick={toggleCart} className="flex flex-col items-center cursor-pointer hover:text-purple-400 transition-colors relative">
              <ShoppingCart className="w-6 h-6" />
              <span className="text-[10px] hidden md:block">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-pink-600 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-pulse">{cartCount}</span>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* 🛒 CART DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-full max-w-md bg-[#111] h-full border-l border-white/10 flex flex-col animate-in slide-in-from-right duration-300">
            
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/50">
              <h2 className="text-xl font-bold text-white flex items-center gap-2"><ShoppingCart /> Your Cart</h2>
              <button onClick={toggleCart} className="text-gray-400 hover:text-white bg-white/5 p-2 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full opacity-50 text-white">
                  <ShoppingCart className="w-16 h-16 mb-4" />
                  <p>Your cart is empty.</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex gap-4 bg-white/5 p-3 rounded-xl border border-white/10 relative group">
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg bg-black" />
                    <div className="flex-1 text-white">
                      <h4 className="font-bold text-sm">{item.name}</h4>
                      <p className="text-purple-400 font-bold mt-1">₹{item.price}</p>
                      <p className="text-xs text-gray-400 mt-1">Qty: {item.quantity}</p>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="absolute bottom-3 right-3 text-red-400 opacity-0 group-hover:opacity-100 bg-red-400/10 p-2 rounded-lg transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="p-6 border-t border-white/10 bg-black/50">
              <div className="flex justify-between text-white font-bold text-lg mb-4">
                <span>Total:</span>
                <span className="text-purple-400">₹{total}</span>
              </div>
              {/* 🔥 NOTUN: Proceed to Checkout Button e action jora hoyeche */}
              <button 
                onClick={handleProceedToCheckout} 
                disabled={isProcessing || cart.length === 0}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-lg transition-all shadow-lg shadow-purple-900/20"
              >
                {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 💳 CHECKOUT OTP MODAL (Order Confirm korar jonno) */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex justify-center items-center px-4">
          <div className="bg-[#111] w-full max-w-sm rounded-2xl border border-white/10 p-6 relative shadow-2xl animate-in zoom-in-95">
            <button onClick={() => setIsCheckoutOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white bg-white/5 p-2 rounded-full"><X className="w-4 h-4" /></button>
            
            <div className="text-center mb-6">
              <ShoppingCart className="w-12 h-12 text-green-500 mx-auto mb-2 bg-green-500/10 p-2 rounded-full" />
              <h2 className="text-2xl font-bold text-white italic">Confirm Order</h2>
              <p className="text-gray-400 text-sm mt-1">Total Amount: <span className="text-purple-400 font-bold">₹{total}</span></p>
            </div>

            <form onSubmit={handleVerifyCheckoutOtp}>
              <p className="text-xs text-green-400 mb-4 bg-green-900/20 p-2 rounded-lg border border-green-500/20 text-center">✅ OTP sent to {userEmail}</p>
              <input 
                type="number" required value={checkoutOtp} onChange={(e) => setCheckoutOtp(e.target.value)}
                placeholder="Enter 4-digit OTP" 
                className="w-full bg-black border border-white/10 rounded-lg p-3 text-white text-center tracking-[1em] font-bold text-xl focus:outline-none focus:border-green-500 mb-4"
              />
              <button type="submit" disabled={isProcessing} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-green-900/20">
                {isProcessing ? 'Verifying...' : 'Verify & Place Order'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 🔐 SECURE LOGIN MODAL */}
      {isAuthOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex justify-center items-center px-4">
          <div className="bg-[#111] w-full max-w-sm rounded-2xl border border-white/10 p-6 relative shadow-2xl animate-in zoom-in-95">
            <button onClick={() => {setIsAuthOpen(false); setLoginStep(1);}} className="absolute top-4 right-4 text-gray-500 hover:text-white bg-white/5 p-2 rounded-full"><X className="w-4 h-4" /></button>
            
            <div className="text-center mb-6">
              <User className="w-12 h-12 text-purple-500 mx-auto mb-2 bg-purple-500/10 p-2 rounded-full" />
              <h2 className="text-2xl font-bold text-white italic">Secure Login</h2>
              <p className="text-gray-400 text-sm mt-1">Welcome back to Perfect Fume</p>
            </div>

            {loginStep === 1 ? (
              <form onSubmit={handleSendOtp}>
                <input 
                  type="email" required value={emailInput} onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Email Address" 
                  className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500 mb-3"
                />
                <input 
                  type="number" required value={phoneInput} onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="Phone Number (10 digits)" 
                  className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500 mb-4"
                />
                <button type="submit" disabled={isProcessing} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition-all">
                  {isProcessing ? 'Sending OTP...' : 'Get OTP on Email'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp}>
                <p className="text-xs text-green-400 mb-4 bg-green-900/20 p-2 rounded-lg border border-green-500/20 text-center">✅ OTP sent to {emailInput}</p>
                <input 
                  type="number" required value={otpInput} onChange={(e) => setOtpInput(e.target.value)}
                  placeholder="Enter 4-digit OTP" 
                  className="w-full bg-black border border-white/10 rounded-lg p-3 text-white text-center tracking-[1em] font-bold text-xl focus:outline-none focus:border-green-500 mb-4"
                />
                <button type="submit" disabled={isProcessing} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-green-900/20">
                  {isProcessing ? 'Verifying...' : 'Verify & Login'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
          
