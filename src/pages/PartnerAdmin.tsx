import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, DollarSign, UserPlus, List, Lock, Activity, CheckCircle, X, Banknote, ShieldAlert, Check, Trash2 } from 'lucide-react';

const PartnerAdmin = () => {
  // --- AUTH STATES ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loginStep, setLoginStep] = useState(1); 
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // --- DATA STATES ---
  const [activeTab, setActiveTab] = useState('dashboard');
  const [timeFilter, setTimeFilter] = useState('lifetime');
  const [partners, setPartners] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  
  // 🔥 DYNAMIC REWARD SLABS STATE
  const [rewardSlabs, setRewardSlabs] = useState({
      bronze: { target: 150, rate: 25, bonus: 0 },
      silver: { target: 300, rate: 30, bonus: 1000 },
      gold:   { target: 450, rate: 30, bonus: 3000 }
  });

  // --- ADD PARTNER STATES ---
  const [newPartner, setNewPartner] = useState({ name: '', email: '', phone: '', target: '150', commission: '20', referredBy: '' });
  const [isAdding, setIsAdding] = useState(false);

  const ADMIN_SECRET = "Himanshu@2026"; 
  const ADMIN_EMAIL = "perfectfumeofficial@gmail.com"; 
  const API_URL = import.meta.env.VITE_API_URL || "https://perfect-fume-backend.perfectfumeofficial.workers.dev";

  // --- LOGIN LOGIC ---
  const handleRequestOtp = async (e: any) => {
    e.preventDefault();
    if (password !== ADMIN_SECRET || email !== ADMIN_EMAIL) return alert("⚠️ Vul Email ba Password!");
    setIsProcessing(true);
    try {
      const res = await fetch(`${API_URL}/api/order`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: ADMIN_EMAIL }) });
      if (res.ok) { setLoginStep(2); alert(`✅ Secure OTP sent to ${ADMIN_EMAIL}`); }
    } catch (err) { alert("Network Error!"); }
    setIsProcessing(false);
  };

  const handleVerifyOtp = async (e: any) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const res = await fetch(`${API_URL}/api/verify-otp`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: ADMIN_EMAIL, otp: otp }) });
      const data = await res.json();
      if (data.success) {
        setIsAuthorized(true);
        fetchAllData();
      } else { alert("⚠️ Vul OTP!"); }
    } catch (err) { alert("Network Error!"); }
    setIsProcessing(false);
  };

  // --- DATA FETCHING (UPDATED TO LOAD REWARDS) ---
  const fetchAllData = async () => {
    try {
      const res = await fetch(`${API_URL}/api/partner/admin/all-data`);
      const data = await res.json();
      setPartners(data.partners || []);
      setSales(data.sales || []);
      setPayouts(data.payouts || []);
      
      // 🔥 LOAD REWARD SLABS FROM DATABASE
      if (data.settings && data.settings.reward_slabs) {
          try {
              const savedSlabs = JSON.parse(data.settings.reward_slabs);
              setRewardSlabs(savedSlabs);
          } catch(e) { console.error("Error parsing reward slabs"); }
      }
    } catch (err) { console.error("Failed to load data"); }
  };

  // --- 1. ADD PARTNER FUNCTION ---
  const handleAddPartner = async (e: any) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      const res = await fetch(`${API_URL}/api/partner/admin/add-partner`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newPartner.name, email: newPartner.email, phone: newPartner.phone, 
          target: Number(newPartner.target), commission: Number(newPartner.commission),
          referredBy: newPartner.referredBy // 🔥 Added Referral
        })
      });
      const data = await res.json();
      if (data.success) {
        alert("✅ New Agent Added Successfully!");
        setNewPartner({ name: '', email: '', phone: '', target: '150', commission: '20', referredBy: '' });
        fetchAllData();
      } else { 
        alert("❌ Error: Might be a duplicate email."); 
      }
    } catch (err) { alert("Network Error!"); }
    setIsAdding(false);
  };

  // --- 2. BLOCK / UNBLOCK FUNCTION ---
  const handleToggleStatus = async (email: string, currentStatus: string) => {
    const isBlocked = currentStatus === 'blocked';
    if(!window.confirm(`Are you sure you want to ${isBlocked ? 'UNBLOCK' : 'BLOCK'} this agent?`)) return;
    
    setIsProcessing(true);
    try {
        const res = await fetch(`${API_URL}/api/partner/admin/toggle-status`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, currentStatus: currentStatus || 'active' })
        });
        const data = await res.json();
        if(data.success) {
            alert(`Agent successfully ${data.newStatus === 'active' ? 'Unblocked ✅' : 'Blocked ❌'}!`);
            fetchAllData(); // Auto refresh the list
        } else {
            alert("Error: " + data.error);
        }
    } catch (e) {
        alert("Network Error!");
    }
    setIsProcessing(false);
  };

  // --- 3. DELETE SALE FUNCTION ---
  const handleDeleteSale = async (saleId: number) => {
      if(!window.confirm("Are you sure you want to permanently delete this sale?")) return;
      try {
        const res = await fetch(`${API_URL}/api/partner/admin/delete-sale`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: saleId })
        });
        if((await res.json()).success) { alert("Sale Deleted ✅"); fetchAllData(); }
      } catch(e) { alert("Error deleting sale"); }
  };
  
  // --- 4. PAYOUT APPROVE FUNCTION ---
  const handleApprovePayout = async (payoutId: number) => {
      if(!window.confirm("Approve this payout? Ensure you have sent the money.")) return;
      try {
        const res = await fetch(`${API_URL}/api/partner/admin/approve-payout`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: payoutId })
        });
        if((await res.json()).success) { alert("Payout Approved ✅"); fetchAllData(); }
      } catch(e) { alert("Error"); }
  };

  // --- 5. SETTLE CASH FUNCTION ---
  const handleSettleCash = async (agentEmail: string, amount: number) => {
      if(!window.confirm(`Confirm you received ₹${amount} cash from ${agentEmail}?`)) return;
      try {
        const res = await fetch(`${API_URL}/api/partner/admin/settle-cash`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: agentEmail, amount: amount })
        });
        if((await res.json()).success) { alert("Cash Settled ✅"); fetchAllData(); }
      } catch(e) { alert("Error"); }
  };

  // --- 6. SAVE REWARDS FUNCTION ---
  const handleSaveRewards = async () => {
      setIsProcessing(true);
      try {
          const res = await fetch(`${API_URL}/api/partner/admin/save-rewards`, {
              method: 'POST', 
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(rewardSlabs)
          });
          const data = await res.json();
          if(data.success) {
              alert("🏆 Reward Settings Saved Successfully!");
          } else {
              alert("Error: " + data.error);
          }
      } catch(e) { 
          alert("Network Error!"); 
      }
      setIsProcessing(false);
  };

  // 🔥 TIME FILTER LOGIC (Data filter kora hocche dropdown onujayi)
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const filteredSales = sales.filter((sale: any) => {
      if (timeFilter === 'lifetime') return true;
      const saleDate = new Date(sale.created_at); // Db te created_at column ache dhore nilam
      if (timeFilter === 'this_month') {
          return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
      }
      if (timeFilter === 'last_month') {
          const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
          const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
          return saleDate.getMonth() === lastMonth && saleDate.getFullYear() === lastMonthYear;
      }
      return true;
  });

  const filteredPayouts = payouts.filter((p: any) => {
      if (timeFilter === 'lifetime') return true;
      const pDate = new Date(p.requested_at || p.created_at); 
      if (timeFilter === 'this_month') {
          return pDate.getMonth() === currentMonth && pDate.getFullYear() === currentYear;
      }
      if (timeFilter === 'last_month') {
          const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
          const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
          return pDate.getMonth() === lastMonth && pDate.getFullYear() === lastMonthYear;
      }
      return true;
  });

  // --- CALCULATIONS FOR DASHBOARD ---
  const totalRevenue = filteredSales.reduce((sum: number, sale: any) => sum + (sale.total_amount || 0), 0);
  
  const totalCashDue = filteredSales.reduce((sum: number, sale: any) => {
      if (sale.payment_type === 'Cash' && (!sale.is_settled || sale.is_settled === 0)) {
          return sum + sale.total_amount;
      }
      return sum;
  }, 0);

  const totalPendingPayouts = filteredPayouts.filter((p: any) => p.status === 'pending').reduce((sum: number, p: any) => sum + p.amount, 0);
  
  // 🔥 ADVANCED ANALYTICS: Top Selling Products
  const productSales = filteredSales.reduce((acc: any, sale: any) => {
      acc[sale.product_name] = (acc[sale.product_name] || 0) + sale.quantity;
      return acc;
  }, {});
  
  const topProducts = Object.entries(productSales)
      .sort((a: any, b: any) => (b[1] as number) - (a[1] as number))
      .slice(0, 5); // Top 5 products
  
  const maxProductSales = topProducts.length > 0 ? Number(topProducts[0][1]) : 1;
  

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4 font-sans text-white">
        <div className="bg-[#111] p-8 rounded-3xl border border-indigo-500/20 shadow-2xl shadow-indigo-900/20 w-full max-w-md text-center">
          <Lock className="w-12 h-12 text-indigo-500 mx-auto mb-4 bg-indigo-500/10 p-3 rounded-2xl" />
          <h2 className="text-2xl font-bold italic text-indigo-400">Master Control V2</h2>
          <p className="text-xs text-gray-500 mt-1 mb-8">Classified Access Only</p>
          
          {loginStep === 1 ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <input type="email" required placeholder="Admin Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl py-3.5 px-4 outline-none focus:border-indigo-500 transition-all" />
              <input type="password" required placeholder="Master Key" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl py-3.5 px-4 outline-none focus:border-indigo-500 transition-all" />
              <button type="submit" disabled={isProcessing} className="w-full bg-indigo-600 hover:bg-indigo-700 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-900/50">{isProcessing ? 'Verifying...' : 'Request Access'}</button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <input type="number" required placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl py-3.5 px-4 outline-none text-center tracking-[1em] font-bold text-xl focus:border-green-500 transition-all" />
              <button type="submit" disabled={isProcessing} className="w-full bg-green-600 hover:bg-green-700 py-3.5 rounded-xl font-bold transition-all">Verify & Enter</button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8 font-sans pb-24">
      <div className="max-w-7xl mx-auto mt-20 md:mt-24">
        
        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold italic text-indigo-400 flex items-center gap-3">
              <Activity className="w-8 h-8"/> Partner Engine HQ
            </h1>
            <p className="text-gray-500 mt-1">Enterprise Dashboard V2</p>
          </div>
          <div className="flex flex-wrap gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
            <button onClick={() => setActiveTab('dashboard')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}>Overview</button>
            <button onClick={() => setActiveTab('agents')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'agents' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}>Agents & Cash</button>
            <button onClick={() => setActiveTab('payouts')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'payouts' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white flex items-center gap-1'}`}>Payouts {totalPendingPayouts > 0 && <span className="w-2 h-2 rounded-full bg-red-500"></span>}</button>
            <button onClick={() => setActiveTab('sales')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'sales' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}>Live Sales</button>
            <button onClick={() => setActiveTab('rewards')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-1 ${activeTab === 'rewards' ? 'bg-yellow-600 text-white' : 'text-gray-400 hover:text-white'}`}>🏆 Rewards</button>
          </div>
        </div>

        {/* --- 1. DASHBOARD TAB --- */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gradient-to-r from-purple-900/20 to-[#111] p-4 rounded-2xl border border-indigo-500/20 gap-4">
               <div>
                   <h2 className="text-lg font-bold text-white flex items-center gap-2"><Activity className="w-5 h-5 text-indigo-400"/> Performance Dashboard</h2>
                   <p className="text-xs text-gray-400">Track agent sales & revenue based on time</p>
               </div>
               <select 
                   value={timeFilter}
                   onChange={(e) => setTimeFilter(e.target.value)}
                   className="bg-black border border-white/20 text-white text-sm rounded-xl px-4 py-2 outline-none focus:border-indigo-500 font-bold"
               >
                   <option value="lifetime">All Time (Lifetime)</option>
                   <option value="this_month">This Month</option>
                   <option value="last_month">Last Month</option>
               </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-[#111] p-6 rounded-3xl border border-white/10">
                <Users className="text-blue-400 w-6 h-6 mb-3" />
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Total Agents</h3>
                <p className="text-3xl font-black text-white">{partners.length}</p>
              </div>
              <div className="bg-[#111] p-6 rounded-3xl border border-white/10">
                <TrendingUp className="text-green-400 w-6 h-6 mb-3" />
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Total Offline Revenue</h3>
                <p className="text-3xl font-black text-white">₹{totalRevenue}</p>
              </div>
              <div className="bg-red-900/20 p-6 rounded-3xl border border-red-500/20 relative overflow-hidden">
                 <Banknote className="text-red-400 w-6 h-6 mb-3 relative z-10" />
                 <h3 className="text-red-400/80 text-xs font-bold uppercase tracking-wider mb-1 relative z-10">Total Cash Due</h3>
                 <p className="text-3xl font-black text-red-400 relative z-10">₹{totalCashDue}</p>
                 <ShieldAlert className="absolute -right-4 -bottom-4 w-24 h-24 text-red-500/10" />
              </div>
              <div className="bg-indigo-900/20 p-6 rounded-3xl border border-indigo-500/20">
                <DollarSign className="text-indigo-400 w-6 h-6 mb-3" />
                <h3 className="text-indigo-400/80 text-xs font-bold uppercase tracking-wider mb-1">Pending Payouts</h3>
                <p className="text-3xl font-black text-indigo-400">₹{totalPendingPayouts}</p>
              </div>
            </div>
            
            {/* 🔥 Advanced Analytics Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-[#111] p-6 rounded-3xl border border-white/10">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-400"/> Top Selling Products
                </h3>
                <div className="space-y-4">
                  {topProducts.map(([name, qty]: any, index: number) => (
                    <div key={index}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-300 font-bold">{name}</span>
                        <span className="text-indigo-400 font-bold">{qty} Sold</span>
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-1000" 
                          style={{ width: `${(qty / maxProductSales) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                  {topProducts.length === 0 && <p className="text-xs text-gray-500">No sales data available yet.</p>}
                </div>
              </div>
            </div>
            
            {/* Quick Agent Add Form */}
            <div className="bg-[#111] p-6 rounded-3xl border border-white/10 mt-8">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><UserPlus className="w-5 h-5 text-indigo-400"/> Onboard New Agent</h3>
              <form onSubmit={handleAddPartner} className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <input required placeholder="Agent Name" value={newPartner.name} onChange={(e)=>setNewPartner({...newPartner, name: e.target.value})} className="bg-black border border-white/10 rounded-xl p-3 text-white outline-none focus:border-indigo-500" />
                <input required type="email" placeholder="Email (Login ID)" value={newPartner.email} onChange={(e)=>setNewPartner({...newPartner, email: e.target.value})} className="bg-black border border-white/10 rounded-xl p-3 text-white outline-none focus:border-indigo-500" />
                <input required type="number" placeholder="Phone Number" value={newPartner.phone} onChange={(e)=>setNewPartner({...newPartner, phone: e.target.value})} className="bg-black border border-white/10 rounded-xl p-3 text-white outline-none focus:border-indigo-500" />
                <input placeholder="Referral Code (Optional)" value={newPartner.referredBy} onChange={(e)=>setNewPartner({...newPartner, referredBy: e.target.value})} className="bg-black border border-white/10 rounded-xl p-3 text-white outline-none focus:border-indigo-500" />
                <button type="submit" disabled={isAdding} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl p-3 transition-all">{isAdding ? 'Adding...' : '+ Create Agent'}</button>
              </form>
            </div>
          </div>
        )}
        {/* --- 2. AGENTS & CASH TAB --- */}
        {activeTab === 'agents' && (
          <div className="space-y-4 animate-in slide-in-from-bottom-4">
            <h2 className="text-xl font-bold mb-4 text-indigo-400">Agent Roster & Cash Settlements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {partners.map((partner: any) => {
                const agentSales = filteredSales.filter((s: any) => s.partner_email === partner.email);
                const itemsSold = agentSales.reduce((sum: number, s: any) => sum + s.quantity, 0);
                
                let tier = 'Starter'; let color = 'text-gray-400 bg-gray-500/10';
                if(itemsSold >= rewardSlabs.gold.target) { tier = 'Gold 🥇'; color = 'text-yellow-400 bg-yellow-500/10'; }
                else if(itemsSold >= rewardSlabs.silver.target) { tier = 'Silver 🥈'; color = 'text-gray-200 bg-gray-300/10'; }
                else if(itemsSold >= rewardSlabs.bronze.target) { tier = 'Bronze 🥉'; color = 'text-orange-400 bg-orange-500/10'; }

                const agentCashDue = agentSales.reduce((sum: number, sale: any) => {
                    if (sale.payment_type === 'Cash' && (!sale.is_settled || sale.is_settled === 0)) return sum + sale.total_amount;
                    return sum;
                }, 0);
                
                // Low Performance Alert Logic (Jodi 10 tar kom sale thake)
                const isLowPerforming = itemsSold < 10; 

                return (
                  <div key={partner.id} className="bg-[#111] p-5 rounded-2xl border border-white/10 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="font-bold text-lg text-white flex items-center gap-2">
                                {partner.name}
                                {partner.status === 'blocked' && <span className="bg-red-500/20 text-red-500 px-2 py-0.5 rounded text-[10px] uppercase">Blocked</span>}
                              {isLowPerforming && (
                                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-red-900/40 text-red-400 border border-red-500/30 animate-pulse">
                                      ⚠️ Low Performance
                                  </span>
                              )}
                            </h3>
                            <p className="text-xs text-gray-500 font-mono">{partner.email}</p>
                            
                            <div className="flex items-center gap-2 mt-2">
                                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${color}`}>{tier} ({itemsSold})</span>
                                
                                <button
                                    onClick={() => handleToggleStatus(partner.email, partner.status)}
                                    className={`px-2 py-0.5 text-[10px] font-bold rounded border transition-all ${
                                        partner.status === 'blocked' 
                                        ? 'bg-green-900/20 border-green-500/30 text-green-400 hover:bg-green-900/40' 
                                        : 'bg-red-900/20 border-red-500/30 text-red-400 hover:bg-red-900/40'
                                    }`}
                                >
                                    {partner.status === 'blocked' ? 'Unblock Agent' : 'Block Agent'}
                                </button>
                            </div>
                        </div>
                        <div className="text-right">
                             <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Cash Due</p>
                             <p className={`text-xl font-black ${agentCashDue > 0 ? 'text-red-400' : 'text-green-400'}`}>₹{agentCashDue}</p>
                        </div>
                    </div>
                    
                    {agentCashDue > 0 ? (
                        <button onClick={() => handleSettleCash(partner.email, agentCashDue)} className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors">
                            <Check className="w-4 h-4"/> Mark Cash as Received
                        </button>
                    ) : (
                        <div className="w-full py-2 bg-green-500/10 border border-green-500/20 text-green-500 rounded-lg text-sm font-bold text-center">
                            All Cash Settled ✅
                        </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* --- 3. PAYOUTS TAB --- */}
        {activeTab === 'payouts' && (
          <div className="bg-[#111] p-6 rounded-3xl border border-white/10 animate-in slide-in-from-bottom-4">
            <h2 className="text-xl font-bold mb-6 text-indigo-400">Payout Requests</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="text-gray-500 border-b border-white/10">
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Agent Email</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {payouts.map((p: any) => (
                    <tr key={p.id} className="hover:bg-white/5">
                      <td className="py-4 text-gray-400">{new Date(p.requested_at).toLocaleDateString()}</td>
                      <td className="py-4 text-indigo-300 font-mono">{p.partner_email}</td>
                      <td className="py-4 font-bold text-white">₹{p.amount}</td>
                      <td className="py-4">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${p.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}>
                              {p.status}
                          </span>
                      </td>
                      <td className="py-4 text-right">
                          {p.status === 'pending' ? (
                              <button onClick={() => handleApprovePayout(p.id)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-md text-xs font-bold transition-all">Approve & Pay</button>
                          ) : (
                              <span className="text-xs text-gray-500">Paid on {new Date(p.processed_at).toLocaleDateString()}</span>
                          )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {payouts.length === 0 && <p className="text-center text-gray-500 py-10">No payout requests yet.</p>}
            </div>
          </div>
        )}
        {/* --- 4. REWARDS TAB --- */}
        {activeTab === 'rewards' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4">
            <div className="bg-gradient-to-r from-yellow-900/20 to-[#111] p-6 rounded-3xl border border-yellow-500/20 mb-6">
                <h2 className="text-xl font-black text-white flex items-center gap-2">🏆 Master Reward Settings</h2>
                <p className="text-xs text-gray-400 mt-1">Change target slabs, commission rates, and bonuses for all agents dynamically.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="bg-[#111] p-5 rounded-2xl border border-orange-500/30">
                  <h3 className="font-bold text-lg text-orange-400 mb-4 flex items-center gap-2">🥉 Bronze Tier</h3>
                  <div className="space-y-3">
                     <div>
                        <label className="text-xs text-gray-400">Target Sales</label>
                        <input type="number" value={rewardSlabs.bronze.target} onChange={(e) => setRewardSlabs({...rewardSlabs, bronze: {...rewardSlabs.bronze, target: Number(e.target.value)}})} className="w-full bg-black border border-white/10 rounded-lg p-2 text-white outline-none focus:border-orange-500" />
                     </div>
                     <div>
                        <label className="text-xs text-gray-400">Commission Rate (₹)</label>
                        <input type="number" value={rewardSlabs.bronze.rate} onChange={(e) => setRewardSlabs({...rewardSlabs, bronze: {...rewardSlabs.bronze, rate: Number(e.target.value)}})} className="w-full bg-black border border-white/10 rounded-lg p-2 text-white outline-none focus:border-orange-500" />
                     </div>
                     <div>
                        <label className="text-xs text-gray-400">Extra Bonus (₹)</label>
                        <input type="number" value={rewardSlabs.bronze.bonus} onChange={(e) => setRewardSlabs({...rewardSlabs, bronze: {...rewardSlabs.bronze, bonus: Number(e.target.value)}})} className="w-full bg-black border border-white/10 rounded-lg p-2 text-white outline-none focus:border-orange-500" />
                     </div>
                  </div>
               </div>

               <div className="bg-[#111] p-5 rounded-2xl border border-gray-400/30">
                  <h3 className="font-bold text-lg text-gray-300 mb-4 flex items-center gap-2">🥈 Silver Tier</h3>
                  <div className="space-y-3">
                     <div>
                        <label className="text-xs text-gray-400">Target Sales</label>
                        <input type="number" value={rewardSlabs.silver.target} onChange={(e) => setRewardSlabs({...rewardSlabs, silver: {...rewardSlabs.silver, target: Number(e.target.value)}})} className="w-full bg-black border border-white/10 rounded-lg p-2 text-white outline-none focus:border-gray-400" />
                     </div>
                     <div>
                        <label className="text-xs text-gray-400">Commission Rate (₹)</label>
                        <input type="number" value={rewardSlabs.silver.rate} onChange={(e) => setRewardSlabs({...rewardSlabs, silver: {...rewardSlabs.silver, rate: Number(e.target.value)}})} className="w-full bg-black border border-white/10 rounded-lg p-2 text-white outline-none focus:border-gray-400" />
                     </div>
                     <div>
                        <label className="text-xs text-gray-400">Extra Bonus (₹)</label>
                        <input type="number" value={rewardSlabs.silver.bonus} onChange={(e) => setRewardSlabs({...rewardSlabs, silver: {...rewardSlabs.silver, bonus: Number(e.target.value)}})} className="w-full bg-black border border-white/10 rounded-lg p-2 text-white outline-none focus:border-gray-400" />
                     </div>
                  </div>
               </div>

               <div className="bg-[#111] p-5 rounded-2xl border border-yellow-500/30">
                  <h3 className="font-bold text-lg text-yellow-400 mb-4 flex items-center gap-2">🥇 Gold Tier</h3>
                  <div className="space-y-3">
                     <div>
                        <label className="text-xs text-gray-400">Target Sales</label>
                        <input type="number" value={rewardSlabs.gold.target} onChange={(e) => setRewardSlabs({...rewardSlabs, gold: {...rewardSlabs.gold, target: Number(e.target.value)}})} className="w-full bg-black border border-white/10 rounded-lg p-2 text-white outline-none focus:border-yellow-500" />
                     </div>
                     <div>
                        <label className="text-xs text-gray-400">Commission Rate (₹)</label>
                        <input type="number" value={rewardSlabs.gold.rate} onChange={(e) => setRewardSlabs({...rewardSlabs, gold: {...rewardSlabs.gold, rate: Number(e.target.value)}})} className="w-full bg-black border border-white/10 rounded-lg p-2 text-white outline-none focus:border-yellow-500" />
                     </div>
                     <div>
                        <label className="text-xs text-gray-400">Extra Bonus (₹)</label>
                        <input type="number" value={rewardSlabs.gold.bonus} onChange={(e) => setRewardSlabs({...rewardSlabs, gold: {...rewardSlabs.gold, bonus: Number(e.target.value)}})} className="w-full bg-black border border-white/10 rounded-lg p-2 text-white outline-none focus:border-yellow-500" />
                     </div>
                  </div>
               </div>
            </div>

            <button 
                onClick={handleSaveRewards} 
                disabled={isProcessing}
                className={`w-full py-4 mt-4 text-white font-bold rounded-xl transition-all ${isProcessing ? 'bg-yellow-800' : 'bg-yellow-600 hover:bg-yellow-700'}`}
            >
               {isProcessing ? 'Saving Please Wait...' : '💾 Save Reward Settings'}
            </button>
          </div>
        )}

        {/* --- 5. SALES LOGS TAB --- */}
        {activeTab === 'sales' && (
          <div className="bg-[#111] p-6 rounded-3xl border border-white/10 animate-in slide-in-from-bottom-4">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-indigo-400">Live Global Sales Log</h2>
             </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="text-gray-500 border-b border-white/10">
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Agent</th>
                    <th className="pb-3 font-medium">Product</th>
                    <th className="pb-3 font-medium">Customer Ph.</th>
                    <th className="pb-3 font-medium">Payment</th>
                    <th className="pb-3 font-medium text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {sales.map((sale: any) => (
                    <tr key={sale.id} className="hover:bg-white/5">
                      <td className="py-3 text-gray-400">{new Date(sale.created_at).toLocaleString()}</td>
                      <td className="py-3 text-indigo-300 font-mono text-xs">{sale.partner_email.split('@')[0]}</td>
                      <td className="py-3 font-bold text-white">{sale.product_name} <span className="text-xs text-gray-500">x{sale.quantity}</span></td>
                      <td className="py-3 font-mono text-gray-400">{sale.customer_phone}</td>
                      <td className="py-3"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${sale.payment_type === 'UPI' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}`}>{sale.payment_type}</span></td>
                      <td className="py-3 text-right font-bold text-white flex items-center justify-end gap-3">
                        ₹{sale.total_amount}
                        <button onClick={() => handleDeleteSale(sale.id)} className="text-red-500 hover:bg-red-500/20 p-1.5 rounded-md transition-colors" title="Delete Sale">
                           <Trash2 className="w-4 h-4"/>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {sales.length === 0 && <p className="text-center text-gray-500 py-10">No field sales logged yet.</p>}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default PartnerAdmin;
