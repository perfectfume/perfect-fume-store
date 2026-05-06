import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, ShoppingBag, Flame, Trophy, Copy, CheckCircle, Bell, User, Clock, Check, Users, X, Edit3, HelpCircle, AlertCircle, Share2, Award } from 'lucide-react';

const PartnerDashboard = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loginStep, setLoginStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [agent, setAgent] = useState<any>(null); 

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [isCustomersModalOpen, setIsCustomersModalOpen] = useState(false);
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  
  
  // 🔥 EDIT MODAL STATES
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editSaleData, setEditSaleData] = useState<any>(null);

  const [products, setProducts] = useState<any[]>([]);
  const [stats, setStats] = useState({ 
    totalSales: 0, todaySalesCount: undefined, target: 50, earnings: 0, rank: 0, streak: 0, cashCollected: 0, customers: [], recentSales: [], totalPayoutsTaken: 0, payoutsHistory: [] 
  });

  
  const [saleProduct, setSaleProduct] = useState('');
  const [saleQty, setSaleQty] = useState('1');
  const [salePhone, setSalePhone] = useState('');
  const [salePayment, setSalePayment] = useState('Cash');
  const [saleSuccessMessage, setSaleSuccessMessage] = useState('');

  // 👇 Ei useEffect ta add korun 👇
  useEffect(() => {
    const savedAgent = localStorage.getItem('partner_agent');
    if (savedAgent) {
      const agentData = JSON.parse(savedAgent);
      setAgent(agentData);
      fetchProducts();
      fetchStats(agentData.email);
    }
  }, []);
  // 👆 ---------------------- 👆

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
        localStorage.setItem('partner_agent', JSON.stringify(data.partner)); // 🔥 NEW
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
      if(data.length > 0) setSaleProduct(data[0].id);
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
          partner_email: agent.email, product_id: prod.id, product_name: prod.name,
          price: prod.price, quantity: Number(saleQty), customer_phone: salePhone, payment_type: salePayment
        })
      });
      const data = await res.json();
      if(data.success) {
        setSaleSuccessMessage("Sale Logged Successfully 🔥");
        fetchStats(agent.email); 
        setTimeout(() => {
          setSaleSuccessMessage('');
          setIsSaleModalOpen(false);
          setSalePhone(''); setSaleQty('1');
        }, 2000);
      }
    } catch(err) { alert("Failed to log sale."); }
    setIsProcessing(false);
  };

  // --- 4. EDIT SALE LOGIC (TIMEZONE FIXED FOR 10 MINS) ---
  const checkIsEditable = (createdAt: string) => {
    if (!createdAt) return false;
    const dateStr = createdAt.includes('Z') ? createdAt : createdAt.replace(' ', 'T') + 'Z';
    const saleTime = new Date(dateStr).getTime();
    const now = new Date().getTime();
    return (now - saleTime) <= 10 * 60 * 1000 && (now - saleTime) >= -60000;
  };

  const openEditModal = (sale: any) => {
    if (!checkIsEditable(sale.created_at)) return alert("Editing is locked! You can only edit within 10 minutes of logging.");
    setEditSaleData({ id: sale.id, quantity: sale.quantity, payment_type: sale.payment_type, price: sale.price });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: any) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const res = await fetch(`${API_URL}/api/partner/edit-sale`, {
        method: 'POST', body: JSON.stringify(editSaleData)
      });
      const data = await res.json();
      if(data.success) {
        alert("Sale Updated! ✅");
        setIsEditModalOpen(false);
        fetchStats(agent.email);
      } else { alert("Update failed."); }
    } catch(err) { alert("Network Error!"); }
    setIsProcessing(false);
  };

  const copyText = (text: string, msg: string) => { navigator.clipboard.writeText(text); alert(msg); };

    // ====================================================================
  // 🔥 DYNAMIC CALCULATIONS (NEW SLAB & TIER SYSTEM)
  // ====================================================================
  const salesQty = stats.totalSales || 0;

  // 1. Determine Tier & Per Product Rate
  let perProductRate = 20; 
  let currentTierName = 'Starter';
  let nextTierTarget = 150;
  let tierColor = 'text-gray-400';

  if (salesQty >= 450) { 
    perProductRate = 30; currentTierName = 'Gold Level 🥇'; nextTierTarget = 450; tierColor = 'text-yellow-400'; 
  } else if (salesQty >= 300) { 
    perProductRate = 30; currentTierName = 'Silver Level 🥈'; nextTierTarget = 450; tierColor = 'text-gray-300'; 
  } else if (salesQty >= 150) { 
    perProductRate = 25; currentTierName = 'Bronze Level 🥉'; nextTierTarget = 300; tierColor = 'text-orange-400'; 
  }

  // 2. Earnings Calculation
  const baseEarnings = salesQty * perProductRate;
  
  // 3. Performance Bonus Calculation
  let perfBonus = 0;
  if (salesQty >= 450) perfBonus = 3000;
  else if (salesQty >= 400) perfBonus = 2000;
  else if (salesQty >= 300) perfBonus = 1000;

  const finalEarnings = baseEarnings + perfBonus; // 🔥 Ei line ta add korun
  const lifetimeEarnings = baseEarnings + perfBonus;
  const availableBalance = lifetimeEarnings - (stats.totalPayoutsTaken || 0);
  const maxEarlyPayout = availableBalance * 0.70; // 70% Limit


  // 4. Daily Target & Target Progress (🔥 COMPULSORY 12 SALES)
  const actualTodaySales = stats.todaySalesCount !== undefined ? stats.todaySalesCount : (
    stats.recentSales?.filter((s: any) => {
      const d = s.created_at.includes('Z') ? new Date(s.created_at) : new Date(s.created_at.replace(' ', 'T') + 'Z');
      return d.toLocaleDateString() === new Date().toLocaleDateString();
    }).reduce((sum: number, s: any) => sum + s.quantity, 0) || 0
  );

  const dailyTarget = 12; // 🔥 HARDCODED TO 12 AS REQUESTED
  const dailyTargetProgress = Math.min((actualTodaySales / dailyTarget) * 100, 100);
  const remainingDaily = dailyTarget - actualTodaySales;

  const targetProgress = Math.min((salesQty / nextTierTarget) * 100, 100);
  const remainingTarget = nextTierTarget - salesQty;

  // 5. Cash Collected (Company Due - 🔥 DIRECT FROM BACKEND)
  const cashCollected = stats.cashCollected || 0;

  

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
          <h2 className="text-2xl font-black italic">Partner</h2>
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

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans pb-24">
      {/* APP HEADER */}
      <div className="pt-20 px-4 pb-4 bg-[#111] border-b border-white/10 z-10 flex justify-between items-end shadow-md">
        <div>
          <h1 className="text-2xl text-gray-300">Welcome,</h1>
          <p className="text-2xl font-black italic text-purple-400">{agent.name}</p>
        </div>
        <div className="flex gap-3">
          <div className={`${stats.streak > 0 ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' : 'bg-gray-800 text-gray-400 border-gray-700'} px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 border`}>
            <Flame className={`w-4 h-4 ${stats.streak > 0 ? 'animate-pulse' : ''}`} /> {stats.streak} Day Streak
          </div>
        </div>
      </div>

      <div className="p-4 max-w-lg mx-auto space-y-6">

        {/* --- 1. DASHBOARD OVERVIEW --- */}
        {activeTab === 'dashboard' && (
          <div className="animate-in fade-in duration-200">
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-[#111] border border-white/5 p-4 rounded-2xl relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 opacity-5"><TrendingUp className="w-24 h-24" /></div>
                <p className="text-gray-400 text-xs font-bold uppercase">My Earnings</p>
                <p className="text-2xl font-black mt-1 text-green-400">₹{finalEarnings}</p>
              </div>
              <div className="bg-[#111] border border-white/5 p-4 rounded-2xl relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 opacity-5"><Award className="w-24 h-24" /></div>
                <p className="text-gray-400 text-xs font-bold uppercase">Current Tier</p>
                <p className={`text-xl font-black mt-1 leading-tight ${tierColor}`}>{currentTierName}</p>
              </div>
            </div>

            {/* DAILY TARGET CARD */}
            <div className="bg-gradient-to-br from-[#1a2e1a] to-[#111] border border-green-500/20 p-5 rounded-3xl mb-4 shadow-lg">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <h3 className="font-bold text-gray-300 flex items-center gap-2"><Target className="w-4 h-4 text-green-400"/> Daily Target</h3>
                  <p className="text-3xl font-black text-white mt-1">{actualTodaySales} <span className="text-lg text-gray-500 font-medium">/ {dailyTarget}</span></p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-green-300 font-bold bg-green-500/20 px-2 py-1 rounded-lg">
                    {remainingDaily > 0 ? `${remainingDaily} left today` : 'Daily Target Hit! 🔥'}
                  </p>
                </div>
              </div>
              <div className="h-2 w-full bg-black rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-green-500 transition-all duration-1000 ease-out" style={{ width: `${dailyTargetProgress}%` }}></div>
              </div>
            </div>

            {/* MONTHLY PROGRESS CARD (Dynamic Tier Target) */}
            <div className="bg-gradient-to-br from-[#1a1a2e] to-[#111] border border-indigo-500/20 p-5 rounded-3xl mb-6 shadow-lg">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <h3 className="font-bold text-gray-300 flex items-center gap-2"><Target className="w-4 h-4 text-indigo-400"/> Monthly Progress</h3>
                  <p className="text-3xl font-black text-white mt-1">{salesQty} <span className="text-lg text-gray-500 font-medium">/ {nextTierTarget}</span></p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-indigo-300 font-bold bg-indigo-500/20 px-2 py-1 rounded-lg">
                    {salesQty >= 450 ? 'Max Tier Reached! 🎉' : `${remainingTarget} more for next tier`}
                  </p>
                </div>
              </div>
              <div className="h-2 w-full bg-black rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000 ease-out" style={{ width: `${targetProgress}%` }}></div>
              </div>
            </div>

            <div className="bg-[#111] p-4 rounded-2xl border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-pink-500/20 p-2 rounded-lg"><Users className="text-pink-400 w-5 h-5"/></div>
                <div><h4 className="font-bold text-sm">Saved Customers ({stats.customers?.length || 0})</h4><p className="text-xs text-gray-400">Build repeat sales</p></div>
              </div>
              <button onClick={() => setIsCustomersModalOpen(true)} className="text-xs bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full font-bold">View List</button>
            </div>
          </div>
        )}

        {/* --- 2. PRODUCTS CATALOG --- */}
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
                    <div className="mt-3 bg-white/5 p-2 rounded-lg border border-white/5 relative group">
                      <p className="text-[10px] text-gray-400 italic pr-6">"Premium long-lasting fragrance. Best for daily office wear & parties."</p>
                      <button onClick={() => copyText("Premium long-lasting fragrance. Best for daily office wear & parties.", "Pitch copied! 📋")} className="absolute right-2 top-2 text-gray-500 hover:text-white"><Copy className="w-3 h-3" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- 3. MY SALES (WITH EDIT OPTION) --- */}
        {activeTab === 'sales' && (
          <div className="animate-in fade-in duration-200">
            <h2 className="text-xl font-bold mb-4">My Sales History</h2>
            <div className="bg-[#111] rounded-2xl border border-white/10 overflow-hidden">
              {stats.recentSales?.length > 0 ? (
                <div className="divide-y divide-white/5">
                  {stats.recentSales.map((sale: any, idx) => (
                    <div key={idx} className="p-4 flex justify-between items-center hover:bg-white/5 relative group">
                      <div>
                        <p className="font-bold text-sm">{sale.product_name} <span className="text-xs text-gray-500">x{sale.quantity}</span></p>
                        <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1"><Clock className="w-3 h-3"/> {new Date(sale.created_at).toLocaleString()}</p>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <p className="font-bold text-green-400">₹{sale.total_amount}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-300">{sale.payment_type}</span>
                          {/* 🔥 EDIT BUTTON */}
                          {checkIsEditable(sale.created_at) && (
                            <button onClick={() => openEditModal(sale)} className="text-blue-400 bg-blue-500/20 p-1 rounded-md hover:bg-blue-600 hover:text-white transition-all"><Edit3 className="w-3 h-3" /></button>
                          )}
                        </div>
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

        {/* --- 4. PROFILE, EARNINGS & FAQ --- */}
        {activeTab === 'profile' && (
          <div className="animate-in fade-in duration-200 space-y-4">
            <div className="bg-[#111] border border-white/10 rounded-3xl p-6 text-center">
              <div className="w-20 h-20 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-full mx-auto flex items-center justify-center mb-4 text-2xl font-black shadow-lg shadow-purple-900/30">{agent.name.charAt(0)}</div>
              <h2 className="text-xl font-bold">{agent.name}</h2>
              <p className="text-gray-400 text-sm">{agent.phone}</p>
              <div className="mt-3 flex justify-center">
                <span className={`px-4 py-1 rounded-full text-xs font-bold border border-white/10 ${tierColor} bg-black`}>Current Status: {currentTierName}</span>
              </div>
            </div>

            {/* CASH DUE TO COMPANY CARD */}
            <div className="bg-red-900/20 border border-red-500/20 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-red-400 uppercase tracking-widest mb-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> Cash Collected</h3>
                <p className="text-gray-400 text-[10px]">Due to Company</p>
              </div>
              <p className="text-xl font-black text-red-400">₹{cashCollected}</p>
            </div>

            {/* PAYOUT CARD WITH EARNINGS BREAKDOWN */}
            <div className="bg-gradient-to-r from-green-900/30 to-[#111] border border-green-500/20 rounded-2xl p-5 shadow-lg">
              <div className="flex justify-between items-start mb-2">
                 <h3 className="text-gray-400 text-sm font-bold uppercase">Available to Payout</h3>
                 <div className="text-right">
                    <p className="text-[10px] text-gray-500 uppercase">Lifetime Earnings</p>
                    <p className="text-sm font-bold text-green-300">₹{lifetimeEarnings}</p>
                 </div>
              </div>
              <p className="text-4xl font-black text-white mb-3">₹{availableBalance}</p>
              
              <div className="space-y-1 mb-4 border-t border-green-500/20 pt-3 text-xs text-gray-300">
                <div className="flex justify-between"><span>Base Commission:</span> <span className="font-bold">₹{baseEarnings}</span></div>
                {perfBonus > 0 && <div className="flex justify-between text-yellow-400"><span>Performance Bonus:</span> <span className="font-bold">+ ₹{perfBonus}</span></div>}
                <div className="flex justify-between text-red-400 pt-1 border-t border-white/5 mt-1"><span>Total Payouts Taken:</span> <span className="font-bold">- ₹{stats.totalPayoutsTaken || 0}</span></div>
              </div>

              {actualTodaySales >= dailyTarget ? (
                 <button onClick={() => setIsPayoutModalOpen(true)} className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition-all shadow-lg">Request Early Payout</button>
              ) : (
                <div className="w-full bg-gray-800/50 text-gray-500 font-bold py-3 rounded-xl text-center border border-gray-700">
                  <p className="text-sm">🔒 Payout Locked</p>
                  <p className="text-[10px] mt-1 font-normal text-gray-400">Complete daily target ({dailyTarget} sales) to unlock.</p>
                </div>
              )}
            </div>

            {/* 🔥 LOGOUT BUTTON */}
            <button onClick={() => {
                if(window.confirm("Are you sure you want to log out?")) {
                    localStorage.removeItem('partner_agent');
                    window.location.reload();
                }
            }} className="w-full bg-red-900/20 border border-red-500/20 text-red-400 font-bold py-3 rounded-xl hover:bg-red-900/40 transition-all mt-4 mb-4">
                Secure Log Out
            </button>
                

            {/* 🔥 REFERRAL SYSTEM BANNER */}
            <div className="bg-gradient-to-tr from-indigo-900/40 to-[#111] border border-indigo-500/30 rounded-2xl p-5 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-lg font-bold text-indigo-400 flex items-center gap-2"><Share2 className="w-5 h-5"/> Refer & Earn ₹500</h3>
                <p className="text-xs text-gray-300 mt-1 mb-3 leading-relaxed">Bring a new active partner to our network and get a flat ₹500 bonus directly to your payout!</p>
                <div className="flex items-center gap-2">
                  <div className="bg-black border border-indigo-500/30 px-3 py-2 rounded-lg flex-1 text-center font-mono text-sm tracking-widest text-indigo-200">
                    REF-{agent.name.substring(0,4).toUpperCase()}500
                  </div>
                  <button onClick={() => copyText(`Join Perfect Fume Partner Network & earn big! Use my code: REF-${agent.name.substring(0,4).toUpperCase()}500`, "Referral Code Copied! 🤝")} className="bg-indigo-600 hover:bg-indigo-700 p-2.5 rounded-lg transition-colors"><Copy className="w-4 h-4 text-white"/></button>
                </div>
              </div>
            </div>

            {/* FAQ SECTION (UPDATED FOR NEW RULES) */}
            <div className="bg-[#111] rounded-2xl border border-white/10 p-5 mt-6">
              <h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-purple-400"><HelpCircle className="w-5 h-5"/> Partner Rules & FAQ</h3>
              <div className="space-y-4 text-sm text-gray-300">
                <div className="border-b border-white/5 pb-3">
                  <p className="font-bold text-white">How is my Commission calculated?</p>
                  <p className="text-xs mt-1 text-gray-400 leading-relaxed">
                    Your per-product commission increases based on your total monthly sales:<br/>
                    • <strong>Under 150 sales:</strong> ₹20 per product.<br/>
                    • <strong>Bronze (150 - 299):</strong> ₹25 per product.<br/>
                    • <strong>Silver/Gold (300+):</strong> ₹30 per product.
                  </p>
                </div>
                <div className="border-b border-white/5 pb-3">
                  <p className="font-bold text-white">Is there a Performance Bonus?</p>
                  <p className="text-xs mt-1 text-gray-400 leading-relaxed">
                    Yes! You get extra cash bonuses based on major monthly milestones:<br/>
                    • Hit <strong>300+ sales:</strong> ₹1000 Bonus<br/>
                    • Hit <strong>400+ sales:</strong> ₹2000 Bonus<br/>
                    • Hit <strong>450+ sales:</strong> ₹3000 Bonus
                  </p>
                </div>
                <div className="border-b border-white/5 pb-3">
                  <p className="font-bold text-white">How does the Referral System work?</p>
                  <p className="text-xs mt-1 text-gray-400 leading-relaxed">Share your unique Referral Code with someone. If they join and start selling, a flat ₹500 bonus will be added to your earnings!</p>
                </div>
                <div className="border-b border-white/5 pb-3">
                  <p className="font-bold text-white">How do I request a payout?</p>
                  <p className="text-xs mt-1 text-gray-400">You must hit your "Daily Target" to unlock the Request Payout button. This ensures regular activity.</p>
                </div>
                <div className="pb-1">
                  <p className="font-bold text-white">What is "Cash Collected"?</p>
                  <p className="text-xs mt-1 text-gray-400">Total offline cash you collected. You must deposit this to the company.</p>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* 🔥 EDIT SALE MODAL (10 MINS) */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#111] w-full max-w-sm rounded-3xl border border-white/10 flex flex-col p-6 animate-in zoom-in-95">
            <h2 className="text-xl font-bold mb-4">Edit Sale Details</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-gray-400">Edit Quantity</label>
                <input type="number" required min="1" value={editSaleData?.quantity || ''} onChange={(e) => setEditSaleData({...editSaleData, quantity: e.target.value})} className="w-full bg-black border border-white/20 rounded-xl p-3 text-white mt-1" />
              </div>
              <div>
                <label className="text-xs text-gray-400">Payment Type</label>
                <div className="flex bg-black border border-white/20 rounded-xl overflow-hidden mt-1 p-1">
                  <button type="button" onClick={() => setEditSaleData({...editSaleData, payment_type: 'Cash'})} className={`flex-1 py-2 text-sm font-bold rounded-lg ${editSaleData?.payment_type === 'Cash' ? 'bg-green-600 text-white' : 'text-gray-500'}`}>CASH</button>
                  <button type="button" onClick={() => setEditSaleData({...editSaleData, payment_type: 'UPI'})} className={`flex-1 py-2 text-sm font-bold rounded-lg ${editSaleData?.payment_type === 'UPI' ? 'bg-blue-600 text-white' : 'text-gray-500'}`}>UPI</button>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 bg-white/10 hover:bg-white/20 py-3 rounded-xl font-bold">Cancel</button>
                <button type="submit" disabled={isProcessing} className="flex-1 bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-bold">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CUSTOMERS MODAL (DYNAMIC LIST) */}
      {isCustomersModalOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-sm">
           <div className="bg-[#111] w-full max-w-md h-[85vh] sm:h-auto sm:max-h-[80vh] rounded-t-3xl sm:rounded-3xl border border-white/10 flex flex-col animate-in slide-in-from-bottom duration-200">
              <div className="p-5 border-b border-white/10 flex justify-between items-center bg-black/50 rounded-t-3xl">
                <h2 className="text-xl font-black text-white flex items-center gap-2">Saved Customers</h2>
                <button onClick={() => setIsCustomersModalOpen(false)} className="bg-white/10 p-2 rounded-full text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-5 overflow-y-auto flex-1">
                {stats.customers?.length > 0 ? (
                  <div className="space-y-3">
                    {stats.customers.map((c: any, idx) => (
                      <div key={idx} className="bg-black border border-white/10 p-4 rounded-xl flex justify-between items-center">
                        <div>
                          <p className="font-bold font-mono tracking-wider">{c.customer_phone}</p>
                          <p className="text-xs text-gray-400 mt-1">Last Order: {new Date(c.last_order).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-400">₹{c.total_spent}</p>
                          <div className="mt-1">
                            {c.orders > 1 ? (
                              <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full font-bold">🔁 Repeat ({c.orders}x)</span>
                            ) : (
                              <span className="text-[10px] bg-white/10 text-gray-300 px-2 py-0.5 rounded-full">1 Order</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-10">No customers saved yet.</p>
                )}
              </div>
           </div>
        </div>
      )}

      {/* FLOATING "LOG SALE" MODAL */}
      {isSaleModalOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-sm">
          <div className="bg-[#111] w-full max-w-md h-[85vh] sm:h-auto sm:max-h-[90vh] rounded-t-3xl sm:rounded-3xl border border-white/10 flex flex-col animate-in slide-in-from-bottom duration-300">
            <div className="p-5 border-b border-white/10 flex justify-between items-center bg-black/50 rounded-t-3xl">
              <h2 className="text-xl font-black text-white flex items-center gap-2">Log New Sale ⚡</h2>
              <button onClick={() => setIsSaleModalOpen(false)} className="bg-white/10 p-2 rounded-full text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            {saleSuccessMessage ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in zoom-in-95">
                <div className="bg-green-500/20 p-4 rounded-full mb-4"><CheckCircle className="w-16 h-16 text-green-400" /></div>
                <h3 className="text-2xl font-black text-white">{saleSuccessMessage}</h3>
                <p className="text-gray-400 mt-2">Target & Streak updated automatically.</p>
              </div>
            ) : (
              <form onSubmit={handleLogSale} className="p-5 overflow-y-auto flex-1 space-y-6">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Select Product</label>
                  <select required value={saleProduct} onChange={(e) => setSaleProduct(e.target.value)} className="w-full bg-black border border-white/20 rounded-xl p-4 text-white font-bold outline-none focus:border-purple-500 appearance-none">
                    {products.map(p => <option key={p.id} value={p.id}>{p.name} - ₹{p.price}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Qty</label>
                    <input type="number" required min="1" value={saleQty} onChange={(e) => setSaleQty(e.target.value)} className="w-full bg-black border border-white/20 rounded-xl p-4 text-white font-bold outline-none text-center focus:border-purple-500" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Payment</label>
                    <div className="flex bg-black border border-white/20 rounded-xl overflow-hidden p-1">
                      <button type="button" onClick={() => setSalePayment('Cash')} className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${salePayment === 'Cash' ? 'bg-green-600 text-white' : 'text-gray-500'}`}>CASH</button>
                      <button type="button" onClick={() => setSalePayment('UPI')} className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${salePayment === 'UPI' ? 'bg-blue-600 text-white' : 'text-gray-500'}`}>UPI</button>
                    </div>
                  </div>
                </div>
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
      {/* 🔥 PAYOUT MODAL & HISTORY */}
      {isPayoutModalOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-sm">
           <div className="bg-[#111] w-full max-w-md h-[85vh] sm:h-auto sm:max-h-[80vh] rounded-t-3xl sm:rounded-3xl border border-white/10 flex flex-col animate-in slide-in-from-bottom duration-200">
              <div className="p-5 border-b border-white/10 flex justify-between items-center bg-black/50 rounded-t-3xl">
                <h2 className="text-xl font-black text-white">Withdrawal & History</h2>
                <button onClick={() => setIsPayoutModalOpen(false)} className="bg-white/10 p-2 rounded-full text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-5 overflow-y-auto flex-1 space-y-6">
                 
                 {/* Withdrawal Form */}
                 <div className="bg-green-900/10 border border-green-500/20 p-4 rounded-2xl">
                    <h3 className="font-bold text-sm text-green-400 mb-2">Request Early Payout</h3>
                    <p className="text-xs text-gray-400 mb-4 leading-relaxed">You can apply for up to <span className="font-bold text-white">70% (₹{Math.floor(maxEarlyPayout)})</span> of your available payout. <span className="text-red-400 font-bold">Note: 2% TDS will be deducted</span> from early payouts.</p>
                    
                    <input 
                      type="number" 
                      placeholder={`Enter amount (Max: ₹${Math.floor(maxEarlyPayout)})`}
                      value={payoutAmount} 
                      onChange={(e) => setPayoutAmount(e.target.value)} 
                      className="w-full bg-black border border-white/20 rounded-xl p-3 text-white font-bold outline-none focus:border-green-500 mb-3" 
                    />
                    
                    <button 
                      onClick={async () => {
                         const reqAmt = Number(payoutAmount);
                         if(reqAmt <= 0 || reqAmt > maxEarlyPayout) return alert(`Amount must be between ₹1 and ₹${Math.floor(maxEarlyPayout)}`);
                         setIsProcessing(true);
                         try {
                             const res = await fetch(`${API_URL}/api/partner/request-payout`, {
                                 method: 'POST', headers: { 'Content-Type': 'application/json' },
                                 body: JSON.stringify({ email: agent.email, amount: reqAmt })
                             });
                             if((await res.json()).success) {
                                 alert("Payout request sent to Admin successfully! 💸");
                                 setIsPayoutModalOpen(false);
                                 setPayoutAmount('');
                                 fetchStats(agent.email);
                             }
                         } catch(e) { alert("Error sending request."); }
                         setIsProcessing(false);
                      }}
                      disabled={isProcessing} 
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-all">
                      {isProcessing ? 'Processing...' : 'Submit Request'}
                    </button>
                 </div>

                 {/* Month-wise History */}
                 <div>
                    <h3 className="font-bold text-sm text-gray-300 mb-3 border-b border-white/10 pb-2">Last 1 Year History</h3>
                    <div className="space-y-3">
                       {(() => {
                           const historyMap: any = {};
                           // Group Sales
                           (stats.recentSales || []).forEach((s: any) => {
                              const m = new Date(s.created_at).toLocaleString('default', { month: 'short', year: 'numeric' });
                              if (!historyMap[m]) historyMap[m] = { items: 0, payouts: 0 };
                              historyMap[m].items += s.quantity;
                           });
                           // Group Payouts
                           (stats.payoutsHistory || []).forEach((p: any) => {
                              const m = new Date(p.requested_at).toLocaleString('default', { month: 'short', year: 'numeric' });
                              if (!historyMap[m]) historyMap[m] = { items: 0, payouts: 0 };
                              if(p.status === 'paid') historyMap[m].payouts += p.amount;
                           });

                           return Object.keys(historyMap).map((k, idx) => {
                               const items = historyMap[k].items;
                               let rate = 20; let bonus = 0;
                               if(items >= 450) { rate = 30; bonus = 3000; }
                               else if(items >= 300) { rate = 30; bonus = 1000; }
                               else if(items >= 150) { rate = 25; }
                               const earned = (items * rate) + bonus;

                               return (
                                  <div key={idx} className="bg-black border border-white/5 p-3 rounded-xl">
                                     <h4 className="font-bold text-indigo-400 mb-1">{k}</h4>
                                     <div className="flex justify-between text-xs text-gray-400">
                                        <span>Work: ₹{(items * rate)} {bonus > 0 ? `(+₹${bonus} Bonus)` : ''}</span>
                                        <span className="font-bold text-white">Total: ₹{earned}</span>
                                     </div>
                                     <div className="flex justify-between text-xs text-red-400 mt-1 pt-1 border-t border-white/5">
                                        <span>Early Payout Taken:</span>
                                        <span className="font-bold">₹{historyMap[k].payouts}</span>
                                     </div>
                                  </div>
                               );
                           });
                       })()}
                    </div>
                 </div>

              </div>
           </div>
        </div>
      )}
                            
      {/* BOTTOM NAVIGATION BAR */}
      <div className="fixed bottom-0 w-full bg-[#050505] border-t border-white/10 flex justify-between px-2 py-2 pb-safe z-40">
        <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center flex-1 py-2 ${activeTab === 'dashboard' ? 'text-purple-400' : 'text-gray-500'}`}>
          <Target className="w-6 h-6" /><span className="text-[10px] mt-1 font-bold">Home</span>
        </button>
        <button onClick={() => setActiveTab('products')} className={`flex flex-col items-center flex-1 py-2 ${activeTab === 'products' ? 'text-purple-400' : 'text-gray-500'}`}>
          <ShoppingBag className="w-6 h-6" /><span className="text-[10px] mt-1 font-bold">Catalog</span>
        </button>
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
