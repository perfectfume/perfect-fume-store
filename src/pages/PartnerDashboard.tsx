import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, ShoppingBag, Flame, Trophy, Copy, CheckCircle, Bell, User, Clock, Check, Users } from 'lucide-react';

const PartnerDashboard = () => {
  // --- AUTH STATES ---
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loginStep, setLoginStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [agent, setAgent] = useState<any>(null); // Logged in agent info

  // --- APP STATES ---
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  
  // --- DATA STATES ---
  const [products, setProducts] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalSales: 0, target: 50, earnings: 0, recentSales: [] });
  
  // --- LOG SALE STATES ---
  const [saleProduct, setSaleProduct] = useState('');
  const [saleQty, setSaleQty] = useState('1');
  const [salePhone, setSalePhone] = useState('');
  const [salePayment, setSalePayment] = useState('Cash');
  const [saleSuccessMessage, setSaleSuccessMessage] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || "https://perfect-fume-backend.perfectfumeofficial.workers.dev";

  // --- 1. AUTHENTICATION ---
  const handleRequestOtp = async (e: any) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const res = await fetch(`${API_URL}/api/partner/send-otp`, { method: 'POST', body: JSON.stringify({ email }) });
      const data = await res.json();
      if (data.success) { setLoginStep(2); } 
      else { alert(data.error || "Email not registered as Agent!"); }
    } catch (err) { alert("Network Error!"); }
    setIsProcessing(false);
  };

  const handleVerifyOtp = async (e: any) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const res = await fetch(`${API_URL}/api/partner/verify-otp`, { method: 'POST', body: JSON.stringify({ email, otp }) });
      const data = await res.json();
      if (data.success) {
        setAgent(data.partner);
        fetchProducts();
        fetchStats(data.partner.email);
      } else { alert("Invalid OTP!"); }
    } catch (err) { alert("Network Error!"); }
    setIsProcessing(false);
  };

  // --- 2. FETCH DATA ---
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/catalog`);
      const data = await res.json();
      setProducts(data);
      if(data.length > 0) setSaleProduct(data[0].id); // Default select first product
    } catch (e) {}
  };

  const fetchStats = async (agentEmail: string) => {
    try {
      const res = await fetch(`${API_URL}/api/partner/stats?email=${agentEmail}`);
      const data = await res.json();
      setStats(data);
    } catch (e) {}
  };

  // --- 3. QUICK LOG SALE ---
  const handleLogSale = async (e: any) => {
    e.preventDefault();
    if(salePhone.length !== 10) return alert("Valid 10-digit Customer Phone required!");
    setIsProcessing(true);
    
    const prod = products.find(p => p.id === saleProduct || p.id?.toString() === saleProduct);
    if(!prod) return;

    try {
      const res = await fetch(`${API_URL}/api/partner/log-sale`, {
        method: 'POST',
        body: JSON.stringify({
          partner_email: agent.email,
          product_id: prod.id,
          product_name: prod.name,
          price: prod.price,
          quantity: Number(saleQty),
          customer_phone: salePhone,
          payment_type: salePayment
        })
      });
      const data = await res.json();
      if(data.success) {
        setSaleSuccessMessage("Sale Logged Successfully 🔥");
        fetchStats(agent.email); // Refresh stats
        setTimeout(() => {
          setSaleSuccessMessage('');
          setIsSaleModalOpen(false);
          setSalePhone(''); setSaleQty('1'); // Reset form
        }, 2000);
      }
    } catch(err) { alert("Failed to log sale."); }
    setIsProcessing(false);
  };

  const copyPitch = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Pitch copied to clipboard! 📋");
  };

  // --- DERIVED UI DATA ---
  const targetProgress = Math.min((stats.totalSales / stats.target) * 100, 100);
  const remainingTarget = stats.target - stats.totalSales;

  // ----------------------------------------------------
  // LOGIN SCREEN
  // ----------------------------------------------------
  if (!agent) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4 text-white font-sans">
        <div className="bg-[#111] p-8 rounded-3xl border border-white/10 shadow-2xl w-full max-w-sm text-center animate-in zoom-in-95">
          <div className="bg-gradient-to-br from-purple-600 to-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-900/50">
            <Flame className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-black italic">Sales Partner</h2>
          <p className="text-gray-400 text-sm mt-1 mb-8">Login to your field agent dashboard</p>
          
          {loginStep === 1 ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <input type="email" required placeholder="Agent Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl p-4 outline-none focus:border-purple-500 font-medium" />
              <button type="submit" disabled={isProcessing} className="w-full bg-purple-600 hover:bg-purple-700 py-4 rounded-xl font-bold transition-all">{isProcessing ? 'Sending...' : 'Send Login Code'}</button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <input type="number" required placeholder="Enter 6-digit OTP" value={otp} onChange={e => setOtp(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl p-4 outline-none focus:border-green-500 text-center tracking-[0.5em] font-bold text-xl" />
              <button type="submit" disabled={isProcessing} className="w-full bg-green-600 hover:bg-green-700 py-4 rounded-xl font-bold transition-all">{isProcessing ? 'Verifying...' : 'Start Selling 🔥'}</button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // MAIN AGENT APP UI
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans pb-24">
      {/* APP HEADER */}
      <div className="bg-[#111] p-4 border-b border-white/10 sticky top-0 z-10 flex justify-between items-center">
        <div>
          <h1 className="font-black italic text-lg tracking-wider text-purple-400">PARTNER HUB</h1>
          <p className="text-xs text-gray-400">Welcome, {agent.name.split(' ')[0]} 👋</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-orange-500/30">
            <Flame className="w-3 h-3" /> 3 Day Streak
          </div>
        </div>
      </div>

      {/* DYNAMIC TAB CONTENT */}
      <div className="p-4 max-w-lg mx-auto space-y-6">

        {/* --- 1. DASHBOARD OVERVIEW --- */}
        {activeTab === 'dashboard' && (
          <div className="animate-in fade-in duration-200">
            {/* Motivation Alert */}
            {stats.totalSales === 0 ? (
              <div className="bg-blue-900/30 border border-blue-500/30 p-3 rounded-xl mb-6 flex items-center gap-3">
                <Bell className="text-blue-400 w-5 h-5" />
                <p className="text-sm font-medium text-blue-200">Aaj kono sale hoyni. Let's make the first one! 💪</p>
              </div>
            ) : (
              <div className="bg-green-900/30 border border-green-500/30 p-3 rounded-xl mb-6 flex items-center gap-3">
                <CheckCircle className="text-green-400 w-5 h-5" />
                <p className="text-sm font-medium text-green-200">Great job! {stats.totalSales} sales logged so far.</p>
              </div>
            )}

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-[#111] border border-white/5 p-4 rounded-2xl relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 opacity-5"><TrendingUp className="w-24 h-24" /></div>
                <p className="text-gray-400 text-xs font-bold uppercase">My Earnings</p>
                <p className="text-2xl font-black mt-1 text-green-400">₹{stats.earnings}</p>
              </div>
              <div className="bg-[#111] border border-white/5 p-4 rounded-2xl relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 opacity-5"><Trophy className="w-24 h-24" /></div>
                <p className="text-gray-400 text-xs font-bold uppercase">My Rank</p>
                <p className="text-2xl font-black mt-1 text-yellow-400">#3 <span className="text-sm text-gray-500 font-normal">in area</span></p>
              </div>
            </div>

            {/* Monthly Target Card */}
            <div className="bg-gradient-to-br from-[#1a1a2e] to-[#111] border border-indigo-500/20 p-5 rounded-3xl mb-6 shadow-lg shadow-indigo-900/10">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <h3 className="font-bold text-gray-300 flex items-center gap-2"><Target className="w-4 h-4 text-indigo-400"/> Monthly Target</h3>
                  <p className="text-3xl font-black text-white mt-1">{stats.totalSales} <span className="text-lg text-gray-500 font-medium">/ {stats.target}</span></p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-indigo-300 font-bold bg-indigo-500/20 px-2 py-1 rounded-lg">
                    {remainingTarget > 0 ? `${remainingTarget} more to goal` : 'Goal Reached! 🎉'}
                  </p>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="h-3 w-full bg-black rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000 ease-out relative" style={{ width: `${targetProgress}%` }}>
                  <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/20 animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Repeat Customers Highlight */}
            <div className="bg-[#111] p-4 rounded-2xl border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-pink-500/20 p-2 rounded-lg"><Users className="text-pink-400 w-5 h-5"/></div>
                <div><h4 className="font-bold text-sm">Saved Customers</h4><p className="text-xs text-gray-400">Build repeat sales</p></div>
              </div>
              <button className="text-xs bg-white/10 px-3 py-1.5 rounded-full font-bold">View List</button>
            </div>
          </div>
        )}

        {/* --- 2. PRODUCTS CATALOG (With Pitch) --- */}
        {activeTab === 'products' && (
          <div className="animate-in fade-in duration-200">
            <h2 className="text-xl font-bold mb-4">Infinite Catalog</h2>
            <div className="space-y-4">
              {products.map(p => (
                <div key={p.id} className="bg-[#111] border border-white/10 rounded-2xl p-4 flex gap-4">
                  <img src={p.image} className="w-20 h-20 object-cover rounded-xl bg-black" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-sm leading-tight">{p.name}</h3>
                      <span className="bg-red-500/20 text-red-400 text-[10px] px-2 py-0.5 rounded uppercase font-bold">🔥 Hot</span>
                    </div>
                    <p className="text-purple-400 font-bold text-sm mt-1">₹{p.price}</p>
                    
                    {/* Pitch Helper */}
                    <div className="mt-3 bg-white/5 p-2 rounded-lg border border-white/5 relative group">
                      <p className="text-[10px] text-gray-400 italic pr-6">"Premium long-lasting fragrance. Best for daily office wear & parties."</p>
                      <button onClick={() => copyPitch("Premium long-lasting fragrance. Best for daily office wear & parties.")} className="absolute right-2 top-2 text-gray-500 hover:text-white"><Copy className="w-3 h-3" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- 3. MY SALES (History) --- */}
        {activeTab === 'sales' && (
          <div className="animate-in fade-in duration-200">
            <h2 className="text-xl font-bold mb-4">My Sales History</h2>
            <div className="bg-[#111] rounded-2xl border border-white/10 overflow-hidden">
              {stats.recentSales?.length > 0 ? (
                <div className="divide-y divide-white/5">
                  {stats.recentSales.map((sale: any, idx) => (
                    <div key={idx} className="p-4 flex justify-between items-center hover:bg-white/5">
                      <div>
                        <p className="font-bold text-sm">{sale.product_name} <span className="text-xs text-gray-500">x{sale.quantity}</span></p>
                        <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1"><Clock className="w-3 h-3"/> {new Date(sale.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-400">₹{sale.total_amount}</p>
                        <p className="text-[10px] bg-white/10 inline-block px-2 py-0.5 rounded mt-1 text-gray-300">{sale.payment_type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500 text-sm">No sales logged yet. Start selling!</div>
              )}
            </div>
          </div>
        )}

        {/* --- 4. PROFILE & PAYOUT --- */}
        {activeTab === 'profile' && (
          <div className="animate-in fade-in duration-200 space-y-4">
            <div className="bg-[#111] border border-white/10 rounded-3xl p-6 text-center">
              <div className="w-20 h-20 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-full mx-auto flex items-center justify-center mb-4 text-2xl font-black shadow-lg shadow-purple-900/30">{agent.name.charAt(0)}</div>
              <h2 className="text-xl font-bold">{agent.name}</h2>
              <p className="text-gray-400 text-sm">{agent.phone}</p>
              <div className="mt-4 flex justify-center gap-4 text-sm font-bold">
                <span className="bg-white/5 px-4 py-2 rounded-xl border border-white/5">Comm: {agent.commission_rate}%</span>
                <span className="bg-white/5 px-4 py-2 rounded-xl border border-white/5">Target: {agent.target}</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-900/30 to-[#111] border border-green-500/20 rounded-2xl p-5 shadow-lg">
              <h3 className="text-gray-400 text-sm font-bold uppercase mb-1">Available to Payout</h3>
              <p className="text-3xl font-black text-white mb-4">₹{stats.earnings}</p>
              <button onClick={() => alert("Payout request sent to Admin! 💸")} className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition-all">Request Payout</button>
            </div>
          </div>
        )}

      </div>

      {/* =========================================
          🚀 FLOATING "LOG SALE" MODAL (FAST UI)
          ========================================= */}
      {isSaleModalOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-sm">
          <div className="bg-[#111] w-full max-w-md h-[85vh] sm:h-auto sm:max-h-[90vh] rounded-t-3xl sm:rounded-3xl border border-white/10 flex flex-col animate-in slide-in-from-bottom duration-300">
            
            {/* Header */}
            <div className="p-5 border-b border-white/10 flex justify-between items-center bg-black/50 rounded-t-3xl">
              <h2 className="text-xl font-black text-white flex items-center gap-2">Log New Sale ⚡</h2>
              <button onClick={() => setIsSaleModalOpen(false)} className="bg-white/10 p-2 rounded-full text-gray-400 hover:text-white"><Check className="w-5 h-5 rotate-45" /></button>
            </div>

            {saleSuccessMessage ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in zoom-in-95">
                <div className="bg-green-500/20 p-4 rounded-full mb-4"><CheckCircle className="w-16 h-16 text-green-400" /></div>
                <h3 className="text-2xl font-black text-white">{saleSuccessMessage}</h3>
                <p className="text-gray-400 mt-2">Target updated automatically.</p>
              </div>
            ) : (
              <form onSubmit={handleLogSale} className="p-5 overflow-y-auto flex-1 space-y-6">
                
                {/* Product Select (Fast) */}
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Select Product</label>
                  <select required value={saleProduct} onChange={(e) => setSaleProduct(e.target.value)} className="w-full bg-black border border-white/20 rounded-xl p-4 text-white font-bold outline-none focus:border-purple-500 appearance-none">
                    {products.map(p => <option key={p.id} value={p.id}>{p.name} - ₹{p.price}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Quantity */}
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Qty</label>
                    <input type="number" required min="1" value={saleQty} onChange={(e) => setSaleQty(e.target.value)} className="w-full bg-black border border-white/20 rounded-xl p-4 text-white font-bold outline-none text-center focus:border-purple-500" />
                  </div>
                  {/* Payment Type */}
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Payment</label>
                    <div className="flex bg-black border border-white/20 rounded-xl overflow-hidden p-1">
                      <button type="button" onClick={() => setSalePayment('Cash')} className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${salePayment === 'Cash' ? 'bg-green-600 text-white' : 'text-gray-500'}`}>CASH</button>
                      <button type="button" onClick={() => setSalePayment('UPI')} className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${salePayment === 'UPI' ? 'bg-blue-600 text-white' : 'text-gray-500'}`}>UPI</button>
                    </div>
                  </div>
                </div>

                {/* Customer Phone (Mandatory for fraud check) */}
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block flex justify-between">Customer Phone <span className="text-red-400">* Mandatory</span></label>
                  <input type="number" required placeholder="10-digit number" value={salePhone} onChange={(e) => setSalePhone(e.target.value)} className="w-full bg-black border border-white/20 rounded-xl p-4 text-white font-bold outline-none focus:border-purple-500" />
                </div>

                <div className="pt-4">
                  <button type="submit" disabled={isProcessing} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-lg py-5 rounded-2xl shadow-xl shadow-purple-900/30 transition-transform active:scale-95 flex items-center justify-center gap-2">
                    {isProcessing ? 'Processing...' : <><CheckCircle className="w-6 h-6"/> CONFIRM SALE</>}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* =========================================
          BOTTOM NAVIGATION BAR (Mobile App Feel)
          ========================================= */}
      <div className="fixed bottom-0 w-full bg-[#050505] border-t border-white/10 flex justify-between px-2 py-2 pb-safe z-40">
        <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center flex-1 py-2 ${activeTab === 'dashboard' ? 'text-purple-400' : 'text-gray-500'}`}>
          <Target className="w-6 h-6" /><span className="text-[10px] mt-1 font-bold">Home</span>
        </button>
        <button onClick={() => setActiveTab('products')} className={`flex flex-col items-center flex-1 py-2 ${activeTab === 'products' ? 'text-purple-400' : 'text-gray-500'}`}>
          <ShoppingBag className="w-6 h-6" /><span className="text-[10px] mt-1 font-bold">Catalog</span>
        </button>
        
        {/* HUGE CENTRAL "LOG SALE" FAB */}
        <div className="relative -top-6 flex-1 flex justify-center">
          <button onClick={() => setIsSaleModalOpen(true)} className="bg-gradient-to-tr from-purple-600 to-indigo-600 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg shadow-purple-900/50 border-4 border-[#050505] hover:scale-105 transition-transform">
            <span className="text-3xl font-light mb-1">+</span>
          </button>
          <span className="absolute -bottom-1 text-[10px] font-black text-white mt-1 uppercase tracking-widest text-center w-full">Log Sale</span>
        </div>

        <button onClick={() => setActiveTab('sales')} className={`flex flex-col items-center flex-1 py-2 ${activeTab === 'sales' ? 'text-purple-400' : 'text-gray-500'}`}>
          <TrendingUp className="w-6 h-6" /><span className="text-[10px] mt-1 font-bold">History</span>
        </button>
        <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center flex-1 py-2 ${activeTab === 'profile' ? 'text-purple-400' : 'text-gray-500'}`}>
          <User className="w-6 h-6" /><span className="text-[10px] mt-1 font-bold">Profile</span>
        </button>
      </div>

    </div>
  );
};

export default PartnerDashboard;
