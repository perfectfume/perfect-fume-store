import React, { useState } from 'react';
import { Search, ShoppingCart, User, Menu, X, Trash2, LogOut, MapPin } from 'lucide-react'; 
import { useStore } from '../store/useStore';

const Navbar = () => {
  const { cart, isCartOpen, toggleCart, removeFromCart, getTotals, userName, userEmail, userPhone, setUserAuth, logout, clearCart } = useStore();
  const { total } = getTotals();
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Login States
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [loginStep, setLoginStep] = useState(1); 
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  
  // Checkout States
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1); // 1: Address, 2: OTP
  const [checkoutOtp, setCheckoutOtp] = useState('');
  
  // Flipkart Style Address Form State
  const [addressForm, setAddressForm] = useState({
    flat: '', area: '', pincode: '', city: 'Kolkata', name: userName || '', phone: userPhone || '', altPhone: '', type: 'Home'
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || "https://perfect-fume-backend.perfectfumeofficial.workers.dev";

  // --- LOGIN LOGIC ---
  const handleSendOtp = async (e: any) => {
    e.preventDefault();
    if (!nameInput || !emailInput.includes('@') || phoneInput.length !== 10) {
      return alert("⚠️ Name, Email ebong 10-digit Phone Number din!");
    }
    setIsProcessing(true);
    try {
      const res = await fetch(`${API_URL}/api/order`, { method: 'POST', body: JSON.stringify({ email: emailInput }) });
      if (res.ok) setLoginStep(2);
    } catch (err) { alert("Network Error!"); }
    setIsProcessing(false);
  };

  const handleVerifyOtp = async (e: any) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const res = await fetch(`${API_URL}/api/verify-otp`, { method: 'POST', body: JSON.stringify({ email: emailInput, otp: otpInput }) });
      const data = await res.json();
      if (data.success) {
        setUserAuth(nameInput, emailInput, phoneInput); 
        setIsAuthOpen(false); setLoginStep(1); setOtpInput('');
      } else { alert("Vul OTP!"); }
    } catch (err) { alert("Network Error!"); }
    setIsProcessing(false);
  };

  // --- CHECKOUT LOGIC (ADDRESS -> OTP) ---
  const handleProceedToAddress = () => {
    if (cart.length === 0) return alert("Jhhuri faka!");
    setAddressForm({ ...addressForm, name: userName || '', phone: userPhone || '' });
    setIsCheckoutOpen(true);
    setCheckoutStep(1);
    toggleCart(); 
  };

  const handleSaveAddressAndSendOtp = async (e: any) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const res = await fetch(`${API_URL}/api/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, cart: cart, address: addressForm }) 
      });
      if (res.ok) {
        setCheckoutStep(2); 
        alert(`✅ Order OTP sent to ${userEmail}`);
      }
    } catch (err) { alert("Network Error!"); }
    setIsProcessing(false);
  };

  const handleVerifyCheckoutOtp = async (e: any) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const res = await fetch(`${API_URL}/api/verify-otp`, { method: 'POST', body: JSON.stringify({ email: userEmail, otp: checkoutOtp }) });
      const data = await res.json();
      if (data.success) {
        alert("🎉 Order Confirmed! Admin kache details chole geche.");
        setIsCheckoutOpen(false); setCheckoutOtp(''); clearCart(); 
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
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">PERFECT FUME</h1>
          </div>
          <div className="hidden md:flex flex-1 max-w-2xl relative">
            <input type="text" placeholder="Search for premium perfumes..." className="w-full bg-white/10 border border-white/20 rounded-md py-2 px-4 pl-10 text-white" />
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          </div>
          <div className="flex items-center gap-6 text-white">
            {!userEmail ? (
              <div onClick={() => setIsAuthOpen(true)} className="flex flex-col items-center cursor-pointer hover:text-purple-400"><User className="w-6 h-6" /><span className="text-[10px] hidden md:block">Sign In</span></div>
            ) : (
              <div onClick={() => { if(window.confirm("Logout korben?")) logout() }} className="flex flex-col items-center cursor-pointer text-green-400"><LogOut className="w-6 h-6" /><span className="text-[10px] hidden md:block">Logout</span></div>
            )}
            <div onClick={toggleCart} className="flex flex-col items-center cursor-pointer relative"><ShoppingCart className="w-6 h-6" /><span className="text-[10px] hidden md:block">Cart</span>
              {cartCount > 0 && <span className="absolute -top-1 -right-2 bg-pink-600 text-[10px] rounded-full w-4 h-4 flex items-center justify-center animate-pulse">{cartCount}</span>}
            </div>
          </div>
        </div>
      </nav>

      {/* CART DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-full max-w-md bg-[#111] h-full border-l border-white/10 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/50"><h2 className="text-xl font-bold text-white flex items-center gap-2"><ShoppingCart /> Your Cart</h2><button onClick={toggleCart} className="text-gray-400 hover:text-white bg-white/5 p-2 rounded-full"><X className="w-5 h-5" /></button></div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex gap-4 bg-white/5 p-3 rounded-xl border border-white/10 relative group">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg bg-black" />
                  <div className="flex-1 text-white"><h4 className="font-bold text-sm">{item.name}</h4><p className="text-purple-400 font-bold mt-1">₹{item.price}</p><p className="text-xs text-gray-400 mt-1">Qty: {item.quantity}</p></div>
                  <button onClick={() => removeFromCart(item.id)} className="absolute bottom-3 right-3 text-red-400"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
            <div className="p-6 border-t border-white/10 bg-black/50">
              <div className="flex justify-between text-white font-bold text-lg mb-4"><span>Total:</span><span className="text-purple-400">₹{total}</span></div>
              <button onClick={handleProceedToAddress} disabled={cart.length === 0} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-lg">Proceed to Checkout</button>
            </div>
          </div>
        </div>
      )}

      {/* FLIPKART STYLE CHECKOUT MODAL */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex justify-center items-end md:items-center px-4 pb-4 md:pb-0">
          <div className="bg-white w-full max-w-md rounded-2xl relative shadow-2xl animate-in slide-in-from-bottom text-black overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold flex items-center gap-2">{checkoutStep === 1 ? <><MapPin className="w-5 h-5 text-blue-600"/> Deliver To</> : 'Confirm Order'}</h2>
              <button onClick={() => setIsCheckoutOpen(false)} className="p-2 bg-gray-100 rounded-full"><X className="w-4 h-4" /></button>
            </div>
            
            <div className="p-4 overflow-y-auto">
              {checkoutStep === 1 ? (
                <form onSubmit={handleSaveAddressAndSendOtp} className="space-y-4">
                  <p className="text-xs text-yellow-700 bg-yellow-50 p-2 rounded-lg border border-yellow-200">ℹ️ Ensure your details are accurate for smooth delivery.</p>
                  
                  <input required placeholder="Flat / House / Building name *" value={addressForm.flat} onChange={(e) => setAddressForm({...addressForm, flat: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:border-blue-600 focus:outline-none" />
                  <input required placeholder="Area / Sector / Locality *" value={addressForm.area} onChange={(e) => setAddressForm({...addressForm, area: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:border-blue-600 focus:outline-none" />
                  <div className="flex gap-2">
                    <input required placeholder="Pincode *" value={addressForm.pincode} onChange={(e) => setAddressForm({...addressForm, pincode: e.target.value})} className="w-1/2 border border-gray-300 rounded-lg p-3 text-sm focus:border-blue-600 focus:outline-none" />
                    <input required placeholder="City *" value={addressForm.city} onChange={(e) => setAddressForm({...addressForm, city: e.target.value})} className="w-1/2 border border-gray-300 rounded-lg p-3 text-sm focus:border-blue-600 focus:outline-none" />
                  </div>
                  <input required placeholder="Full Name *" value={addressForm.name} onChange={(e) => setAddressForm({...addressForm, name: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:border-blue-600 focus:outline-none" />
                  <input required type="number" placeholder="10-digit mobile number *" value={addressForm.phone} onChange={(e) => setAddressForm({...addressForm, phone: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:border-blue-600 focus:outline-none" />
                  <input placeholder="Alternate phone number (Optional)" value={addressForm.altPhone} onChange={(e) => setAddressForm({...addressForm, altPhone: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:border-blue-600 focus:outline-none" />
                  
                  <div className="flex gap-2 pt-2">
                    <span onClick={() => setAddressForm({...addressForm, type: 'Home'})} className={`px-4 py-1.5 border rounded-full text-sm cursor-pointer ${addressForm.type === 'Home' ? 'bg-blue-50 border-blue-600 text-blue-600 font-bold' : 'text-gray-500'}`}>🏠 Home</span>
                    <span onClick={() => setAddressForm({...addressForm, type: 'Work'})} className={`px-4 py-1.5 border rounded-full text-sm cursor-pointer ${addressForm.type === 'Work' ? 'bg-blue-50 border-blue-600 text-blue-600 font-bold' : 'text-gray-500'}`}>🏢 Work</span>
                  </div>
                  
                  <div className="pt-4 sticky bottom-0 bg-white">
                    <button type="submit" disabled={isProcessing} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-lg shadow-lg">
                      {isProcessing ? 'Saving...' : 'Save Address & Continue'}
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleVerifyCheckoutOtp}>
                  <p className="text-sm text-green-600 mb-4 text-center bg-green-50 p-2 rounded-lg">✅ OTP sent to {userEmail}</p>
                  <input type="number" required value={checkoutOtp} onChange={(e) => setCheckoutOtp(e.target.value)} placeholder="Enter 4-digit OTP" className="w-full border border-gray-300 rounded-lg p-3 text-center tracking-[1em] font-bold text-xl focus:outline-none focus:border-blue-600 mb-4" />
                  <button type="submit" disabled={isProcessing} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-lg shadow-lg">
                    {isProcessing ? 'Verifying...' : 'Verify & Place Order'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* LOGIN MODAL */}
      {isAuthOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex justify-center items-center px-4">
          <div className="bg-[#111] w-full max-w-sm rounded-2xl border border-white/10 p-6 relative shadow-2xl">
            <button onClick={() => {setIsAuthOpen(false); setLoginStep(1);}} className="absolute top-4 right-4 text-gray-500 hover:text-white bg-white/5 p-2 rounded-full"><X className="w-4 h-4" /></button>
            <div className="text-center mb-6"><User className="w-12 h-12 text-purple-500 mx-auto mb-2 bg-purple-500/10 p-2 rounded-full" /><h2 className="text-2xl font-bold text-white italic">Sign In</h2></div>
            {loginStep === 1 ? (
              <form onSubmit={handleSendOtp}>
                <input required placeholder="Your Name" value={nameInput} onChange={(e) => setNameInput(e.target.value)} className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-purple-500 mb-3" />
                <input type="email" required placeholder="Email Address" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-purple-500 mb-3" />
                <input type="number" required placeholder="Phone (10 digits)" value={phoneInput} onChange={(e) => setPhoneInput(e.target.value)} className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-purple-500 mb-4" />
                <button type="submit" disabled={isProcessing} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg">{isProcessing ? 'Sending...' : 'Get OTP'}</button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp}>
                <input type="number" required placeholder="Enter 4-digit OTP" value={otpInput} onChange={(e) => setOtpInput(e.target.value)} className="w-full bg-black border border-white/10 rounded-lg p-3 text-white text-center tracking-[1em] font-bold text-xl focus:border-green-500 mb-4" />
                <button type="submit" disabled={isProcessing} className="w-full bg-green-600 text-white font-bold py-3 rounded-lg">Verify & Login</button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
                                                         
