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
  const [partners, setPartners] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);

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

  // --- DATA FETCHING ---
  const fetchAllData = async () => {
    try {
      const res = await fetch(`${API_URL}/api/partner/admin/all-data`);
      const data = await res.json();
      setPartners(data.partners || []);
      setSales(data.sales || []);
      setPayouts(data.payouts || []);
    } catch (err) { console.error("Failed to load data"); }
  };

  // --- ACTIONS ---
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
      } else { alert("❌ Error: Might be a duplicate email."); }
    } catch (err) { alert("Network Error!"); }
    setIsAdding(false);
  };

  // 🔥 NEW: Delete Sale Function
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


  // --- CALCULATIONS FOR DASHBOARD ---
  const totalRevenue = sales.reduce((sum: number, sale: any) => sum + (sale.total_amount || 0), 0);
  
  // Calculate total cash due across all agents
  const totalCashDue = sales.reduce((sum: number, sale: any) => {
      // Assuming missing is_settled means 0 (unsettled)
      if (sale.payment_type === 'Cash' && (!sale.is_settled || sale.is_settled === 0)) {
          return sum + sale.total_amount;
      }
      return sum;
  }, 0);

  // Calculate pending payouts globally
  const totalPendingPayouts = payouts.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);


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
          </div>
        </div>

        {/* --- 1. DASHBOARD TAB --- */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in">
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
                 <h3 className="text-red-400/80 text-xs font-bold uppercase tracking-wider mb-1 relative z-10">Total Cash Due (From Agents)</h3>
                 <p className="text-3xl font-black text-red-400 relative z-10">₹{totalCashDue}</p>
                 <ShieldAlert className="absolute -right-4 -bottom-4 w-24 h-24 text-red-500/10" />
              </div>
              <div className="bg-indigo-900/20 p-6 rounded-3xl border border-indigo-500/20">
                <DollarSign className="text-indigo-400 w-6 h-6 mb-3" />
                <h3 className="text-indigo-400/80 text-xs font-bold uppercase tracking-wider mb-1">Pending Payouts</h3>
                <p className="text-3xl font-black text-indigo-400">₹{totalPendingPayouts}</p>
              </div>
            </div>

            {/* Quick Agent Add Form */}
            <div className="bg-[#111] p-6 rounded-3xl border border-white/10 mt-8">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><UserPlus className="w-5 h-5 text-indigo-400"/> Onboard New Agent</h3>
              <form onSubmit={handleAddPartner} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input required placeholder="Agent Name" value={newPartner.name} onChange={(e)=>setNewPartner({...newPartner, name: e.target.value})} className="bg-black border border-white/10 rounded-xl p-3 text-white outline-none focus:border-indigo-500" />
                <input required type="email" placeholder="Email (Login ID)" value={newPartner.email} onChange={(e)=>setNewPartner({...newPartner, email: e.target.value})} className="bg-black border border-white/10 rounded-xl p-3 text-white outline-none focus:border-indigo-500" />
                <input required type="number" placeholder="Phone Number" value={newPartner.phone} onChange={(e)=>setNewPartner({...newPartner, phone: e.target.value})} className="bg-black border border-white/10 rounded-xl p-3 text-white outline-none focus:border-indigo-500" />
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
                const agentSales = sales.filter((s: any) => s.partner_email === partner.email);
                const itemsSold = agentSales.reduce((sum: number, s: any) => sum + s.quantity, 0);
                
                // Tier Logic
                let tier = 'Starter'; let color = 'text-gray-400 bg-gray-500/10';
                if(itemsSold >= 450) { tier = 'Gold 🥇'; color = 'text-yellow-400 bg-yellow-500/10'; }
                else if(itemsSold >= 300) { tier = 'Silver 🥈'; color = 'text-gray-200 bg-gray-300/10'; }
                else if(itemsSold >= 150) { tier = 'Bronze 🥉'; color = 'text-orange-400 bg-orange-500/10'; }

                // Cash Due Logic
                const agentCashDue = agentSales.reduce((sum: number, sale: any) => {
                    if (sale.payment_type === 'Cash' && (!sale.is_settled || sale.is_settled === 0)) return sum + sale.total_amount;
                    return sum;
                }, 0);

                return (
                  <div key={partner.id} className="bg-[#111] p-5 rounded-2xl border border-white/10 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="font-bold text-lg text-white">{partner.name}</h3>
                            <p className="text-xs text-gray-500 font-mono">{partner.email}</p>
                            <span className={`inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-bold ${color}`}>{tier} ({itemsSold} Sales)</span>
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

                {/* --- 4. SALES LOGS TAB --- */}
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
                      <td className="py-3 text-right font-bold text-white">₹{sale.total_amount}</td>
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
