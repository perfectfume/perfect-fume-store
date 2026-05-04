import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, DollarSign, UserPlus, List, Lock, Activity, CheckCircle, X } from 'lucide-react';

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
  const [partners, setPartners] = useState([]);
  const [sales, setSales] = useState([]);

  // --- ADD PARTNER STATES ---
  const [newPartner, setNewPartner] = useState({ name: '', email: '', phone: '', target: '50', commission: '10' });
  const [isAdding, setIsAdding] = useState(false);

  const ADMIN_SECRET = "Himanshu@2026"; 
  const ADMIN_EMAIL = "perfectfumeofficial@gmail.com"; 
  const API_URL = import.meta.env.VITE_API_URL || "https://perfect-fume-backend.perfectfumeofficial.workers.dev";

  // --- LOGIN LOGIC (Same as main admin for security) ---
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
    } catch (err) { console.error("Failed to load data"); }
  };

  // --- ADD PARTNER ---
  const handleAddPartner = async (e: any) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      const res = await fetch(`${API_URL}/api/partner/admin/add-partner`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newPartner.name, email: newPartner.email, phone: newPartner.phone, 
          target: Number(newPartner.target), commission: Number(newPartner.commission)
        })
      });
      const data = await res.json();
      if (data.success) {
        alert("✅ New Agent/Partner Added Successfully!");
        setNewPartner({ name: '', email: '', phone: '', target: '50', commission: '10' });
        fetchAllData();
        setActiveTab('agents');
      } else {
        alert("❌ Error: Might be a duplicate email.");
      }
    } catch (err) { alert("Network Error!"); }
    setIsAdding(false);
  };

  // --- CALCULATIONS ---
  const totalRevenue = sales.reduce((sum: number, sale: any) => sum + (sale.total_amount || 0), 0);
  const totalCommissionToPay = sales.reduce((sum: number, sale: any) => {
    const agent = partners.find((p: any) => p.email === sale.partner_email) as any;
    const rate = agent ? agent.commission_rate : 10;
    return sum + ((sale.total_amount * rate) / 100);
  }, 0);


  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4 font-sans text-white">
        <div className="bg-[#111] p-8 rounded-3xl border border-indigo-500/20 shadow-2xl shadow-indigo-900/20 w-full max-w-md text-center">
          <Lock className="w-12 h-12 text-indigo-500 mx-auto mb-4 bg-indigo-500/10 p-3 rounded-2xl" />
          <h2 className="text-2xl font-bold italic text-indigo-400">Master Partner Hub</h2>
          <p className="text-xs text-gray-500 mt-1 mb-8">Classified Access Only</p>
          
          {loginStep === 1 ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <input type="email" required placeholder="Admin Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl py-3.5 px-4 outline-none focus:border-indigo-500 transition-all" />
              <input type="password" required placeholder="Master Key" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl py-3.5 px-4 outline-none focus:border-indigo-500 transition-all" />
              <button type="submit" disabled={isProcessing} className="w-full bg-indigo-600 hover:bg-indigo-700 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-900/50">{isProcessing ? 'Verifying...' : 'Request Access'}</button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <p className="text-sm text-green-400 mb-4">OTP Sent to Admin Mail</p>
              <input type="number" required placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl py-3.5 px-4 outline-none text-center tracking-[1em] font-bold text-xl focus:border-green-500 transition-all" />
              <button type="submit" disabled={isProcessing} className="w-full bg-green-600 hover:bg-green-700 py-3.5 rounded-xl font-bold transition-all">{isProcessing ? 'Unlocking...' : 'Verify & Enter'}</button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8 font-sans pb-24">
      <div className="max-w-6xl mx-auto mt-20 md:mt-24">
        
        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold italic text-indigo-400 flex items-center gap-3">
              <Activity className="w-8 h-8"/> Partner Engine HQ
            </h1>
            <p className="text-gray-500 mt-1">Manage your offline sales army</p>
          </div>
          <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
            <button onClick={() => setActiveTab('dashboard')} className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}>Dashboard</button>
            <button onClick={() => setActiveTab('agents')} className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'agents' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}>Agents</button>
            <button onClick={() => setActiveTab('sales')} className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'sales' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}>Sales Logs</button>
          </div>
        </div>

        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-indigo-900/40 to-black p-6 rounded-3xl border border-indigo-500/20">
                <Users className="text-indigo-400 w-8 h-8 mb-4" />
                <h3 className="text-gray-400 font-bold mb-1">Total Active Agents</h3>
                <p className="text-4xl font-bold text-white">{partners.length}</p>
              </div>
              <div className="bg-gradient-to-br from-green-900/40 to-black p-6 rounded-3xl border border-green-500/20">
                <TrendingUp className="text-green-400 w-8 h-8 mb-4" />
                <h3 className="text-gray-400 font-bold mb-1">Partner Revenue</h3>
                <p className="text-4xl font-bold text-white">₹{totalRevenue}</p>
              </div>
              <div className="bg-gradient-to-br from-pink-900/40 to-black p-6 rounded-3xl border border-pink-500/20">
                <DollarSign className="text-pink-400 w-8 h-8 mb-4" />
                <h3 className="text-gray-400 font-bold mb-1">Pending Commission</h3>
                <p className="text-4xl font-bold text-white">₹{totalCommissionToPay.toFixed(0)}</p>
              </div>
            </div>

            {/* Quick Agent Add Form */}
            <div className="bg-[#111] p-6 rounded-3xl border border-white/10 mt-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><UserPlus className="w-5 h-5 text-indigo-400"/> Onboard New Agent</h3>
              <form onSubmit={handleAddPartner} className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <input required placeholder="Agent Name" value={newPartner.name} onChange={(e)=>setNewPartner({...newPartner, name: e.target.value})} className="bg-black border border-white/10 rounded-xl p-3 text-white outline-none focus:border-indigo-500" />
                <input required type="email" placeholder="Agent Email (For Login)" value={newPartner.email} onChange={(e)=>setNewPartner({...newPartner, email: e.target.value})} className="bg-black border border-white/10 rounded-xl p-3 text-white outline-none focus:border-indigo-500" />
                <input required type="number" placeholder="Phone Number" value={newPartner.phone} onChange={(e)=>setNewPartner({...newPartner, phone: e.target.value})} className="bg-black border border-white/10 rounded-xl p-3 text-white outline-none focus:border-indigo-500" />
                <div className="flex gap-2">
                  <input required type="number" placeholder="Target" value={newPartner.target} onChange={(e)=>setNewPartner({...newPartner, target: e.target.value})} className="w-1/2 bg-black border border-white/10 rounded-xl p-3 text-white outline-none focus:border-indigo-500" title="Monthly Target" />
                  <input required type="number" placeholder="Comm %" value={newPartner.commission} onChange={(e)=>setNewPartner({...newPartner, commission: e.target.value})} className="w-1/2 bg-black border border-white/10 rounded-xl p-3 text-white outline-none focus:border-indigo-500" title="Commission %" />
                </div>
                <button type="submit" disabled={isAdding} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl p-3 transition-all">{isAdding ? 'Adding...' : 'Create Agent'}</button>
              </form>
            </div>
          </div>
        )}

        {/* AGENTS TAB */}
        {activeTab === 'agents' && (
          <div className="bg-[#111] p-6 rounded-3xl border border-white/10 animate-in slide-in-from-bottom-4">
            <h2 className="text-xl font-bold mb-6 text-indigo-400">Agent Roster</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {partners.map((partner: any) => {
                const agentSales = sales.filter((s: any) => s.partner_email === partner.email);
                const agentRevenue = agentSales.reduce((sum: number, s: any) => sum + s.total_amount, 0);
                const itemsSold = agentSales.reduce((sum: number, s: any) => sum + s.quantity, 0);

                return (
                  <div key={partner.id} className="bg-black/50 p-5 rounded-2xl border border-white/5 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                    <div>
                      <h3 className="font-bold text-lg text-white flex items-center gap-2">{partner.name} <span className="bg-green-500/20 text-green-400 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">Active</span></h3>
                      <p className="text-sm text-gray-500 font-mono">{partner.email}</p>
                      <div className="flex gap-3 mt-3 text-xs font-bold">
                        <span className="bg-white/10 px-3 py-1 rounded-lg text-gray-300">Target: {partner.target}</span>
                        <span className="bg-indigo-500/10 px-3 py-1 rounded-lg text-indigo-400">Comm: {partner.commission_rate}%</span>
                      </div>
                    </div>
                    <div className="text-left md:text-right bg-white/5 p-3 rounded-xl w-full md:w-auto">
                      <p className="text-xs text-gray-400 uppercase tracking-widest">Total Sales</p>
                      <p className="text-xl font-bold text-white">₹{agentRevenue}</p>
                      <p className="text-xs text-green-400 mt-1">{itemsSold} Items Sold</p>
                    </div>
                  </div>
                );
              })}
              {partners.length === 0 && <p className="text-gray-500 p-4">No agents added yet.</p>}
            </div>
          </div>
        )}

        {/* SALES LOGS TAB */}
        {activeTab === 'sales' && (
          <div className="bg-[#111] p-6 rounded-3xl border border-white/10 animate-in slide-in-from-bottom-4">
            <h2 className="text-xl font-bold mb-6 text-indigo-400">Live Field Sales</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="text-gray-500 border-b border-white/10">
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Agent Email</th>
                    <th className="pb-3 font-medium">Product</th>
                    <th className="pb-3 font-medium">Customer Ph.</th>
                    <th className="pb-3 font-medium">Payment</th>
                    <th className="pb-3 font-medium text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {sales.map((sale: any) => (
                    <tr key={sale.id} className="hover:bg-white/5">
                      <td className="py-4 text-gray-400">{new Date(sale.created_at).toLocaleDateString()}</td>
                      <td className="py-4 text-indigo-300">{sale.partner_email}</td>
                      <td className="py-4 font-bold text-white">{sale.product_name} <span className="text-xs text-gray-500">x{sale.quantity}</span></td>
                      <td className="py-4 font-mono text-gray-400">{sale.customer_phone}</td>
                      <td className="py-4"><span className={`px-2 py-1 rounded text-xs font-bold ${sale.payment_type === 'UPI' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}`}>{sale.payment_type}</span></td>
                      <td className="py-4 text-right font-bold text-white">₹{sale.total_amount}</td>
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
      
