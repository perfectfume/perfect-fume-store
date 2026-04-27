import React, { useState } from 'react';
import { Search, ShoppingCart, User, Menu, X, Trash2 } from 'lucide-react'; 
import { useStore } from '../store/useStore';

const Navbar = () => {
  // Store theke jhhuri r login er info neyoa hocche
  const { cart, isCartOpen, toggleCart, removeFromCart, getTotals, userEmail, setUserEmail } = useStore();
  const { total } = getTotals();
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Login Popup er control
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [emailInput, setEmailInput] = useState('');

  // Dummy Login Function (Pore OTP er sathe jura hobe)
  const handleLogin = (e: any) => {
    e.preventDefault();
    if(emailInput.includes('@')) {
      setUserEmail(emailInput);
      setIsAuthOpen(false);
      alert('✅ Account Logged In: ' + emailInput);
    }
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
            {/* Account Icon */}
            <div onClick={() => !userEmail ? setIsAuthOpen(true) : alert(`Logged in as:\n${userEmail}`)} className="flex flex-col items-center cursor-pointer hover:text-purple-400 transition-colors">
              <User className={`w-6 h-6 ${userEmail ? 'text-green-400' : ''}`} />
              <span className="text-[10px] hidden md:block">{userEmail ? 'Profile' : 'Account'}</span>
            </div>
            
            {/* Cart Icon */}
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

      {/* 🛒 CART DRAWER (Dan dik theke asbe) */}
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
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-lg transition-all shadow-lg shadow-purple-900/20">
                Proceed to Checkout
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 🔐 LOGIN MODAL */}
      {isAuthOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex justify-center items-center px-4">
          <div className="bg-[#111] w-full max-w-sm rounded-2xl border border-white/10 p-6 relative shadow-2xl animate-in zoom-in-95">
            <button onClick={() => setIsAuthOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white bg-white/5 p-2 rounded-full"><X className="w-4 h-4" /></button>
            <div className="text-center mb-6">
              <User className="w-12 h-12 text-purple-500 mx-auto mb-2 bg-purple-500/10 p-2 rounded-full" />
              <h2 className="text-2xl font-bold text-white italic">Sign In</h2>
              <p className="text-gray-400 text-sm mt-1">Access your secure account</p>
            </div>
            <form onSubmit={handleLogin}>
              <input 
                type="email" 
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Enter your Email" 
                className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500 mb-4"
              />
              <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition-all">
                Continue
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
