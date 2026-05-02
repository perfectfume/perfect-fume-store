import React, { useEffect, useState } from 'react';
import { User, Package, Gift, Edit3, LogOut, ExternalLink, Copy, CheckCircle } from 'lucide-react';
import { useStore } from '../store/useStore';

const Account = () => {
  const { userName, userEmail, userPhone, logout } = useStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "https://perfect-fume-backend.perfectfumeofficial.workers.dev";
  
  // 🔥 Unique Referral Link Generator (User-er email base kore)
  const referralCode = userEmail ? btoa(userEmail).substring(0, 8).toUpperCase() : "PFUSER";
  const referralLink = `https://${window.location.host}/signup?ref=${referralCode}`;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (userEmail) {
      fetchOrders();
    }
  }, [userEmail]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Backend e user orders route thakle eta kaj korbe
      const res = await fetch(`${API_URL}/api/admin/orders`); 
      const data = await res.json();
      // Shudhu ei user-er order gulo filter kora hocche
      const userOrders = data.filter((o: any) => o.email === userEmail);
      setOrders(userOrders);
    } catch (error) {
      console.error("Orders fetch failed");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!userEmail) {
    return (
      <div className="min-h-screen bg-[#050505] text-white pt-32 pb-24 flex flex-col items-center text-center px-4">
        <div className="w-24 h-24 bg-purple-900/20 rounded-full flex items-center justify-center mb-6 border border-purple-500/20">
          <User className="w-12 h-12 text-purple-500" />
        </div>
        <h2 className="text-3xl font-bold mb-4 italic">Please Sign In</h2>
        <button 
          onClick={() => document.getElementById('nav-login-btn')?.click()} 
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 px-10 rounded-full transition-all"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-24 font-sans">
      <main className="max-w-4xl mx-auto px-4">
        
        {/* --- PROFILE SECTION --- */}
        <div className="flex justify-between items-end mb-8 px-2">
          <h1 className="text-3xl font-bold italic text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">My Profile</h1>
          <button className="flex items-center gap-2 text-xs font-bold text-purple-400 bg-purple-400/10 px-4 py-2 rounded-lg border border-purple-400/20 hover:bg-purple-400/20 transition-all">
            <Edit3 className="w-3.5 h-3.5" /> Edit Profile
          </button>
        </div>

        <div className="bg-[#111] border border-white/5 p-6 md:p-8 rounded-3xl mb-8 flex flex-col md:flex-row items-center gap-6 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10"><User className="w-32 h-32 text-white" /></div>
           <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center border-4 border-black shrink-0 shadow-xl">
             <span className="text-3xl font-bold uppercase">{userName?.charAt(0)}</span>
           </div>
           <div className="z-10 text-center md:text-left">
             <h2 className="text-2xl font-bold text-white mb-1">{userName}</h2>
             <p className="text-gray-400 text-sm mb-1">{userEmail}</p>
             <p className="text-gray-500 text-sm font-mono">{userPhone}</p>
           </div>
        </div>

        {/* --- REFERRAL SECTION --- */}
        <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/20 p-6 rounded-3xl mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400"><Gift className="w-5 h-5" /></div>
            <h3 className="text-lg font-bold">Refer & Earn</h3>
          </div>
          <p className="text-gray-400 text-sm mb-6">Share your unique link with friends. When they buy, you get exclusive discounts! 🎁</p>
          
          <div className="flex gap-2">
            <div className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-gray-300 truncate">
              {referralLink}
            </div>
            <button 
              onClick={copyToClipboard}
              className={`px-4 rounded-xl flex items-center justify-center transition-all ${copied ? 'bg-green-600 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
            >
              {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* --- ORDER HISTORY --- */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6 px-2">
            <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400"><Package className="w-5 h-5" /></div>
            <h3 className="text-xl font-bold">Order History</h3>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2].map(i => <div key={i} className="h-24 bg-[#111] animate-pulse rounded-2xl border border-white/5"></div>)}
            </div>
          ) : orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-[#0a0a0a] border border-white/5 p-5 rounded-2xl flex justify-between items-center group hover:border-purple-500/30 transition-all">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-mono font-bold text-white text-sm">#OR-{order.id}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${order.status === 'delivered' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">Placed on: {new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white mb-2">₹{order.totalAmount || '---'}</p>
                    <button 
                      onClick={() => window.location.href = `/track-order`}
                      className="text-[10px] font-bold text-purple-400 flex items-center gap-1 hover:underline ml-auto"
                    >
                      Details <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-[#111] rounded-3xl border border-dashed border-white/10">
              <Package className="w-12 h-12 text-gray-700 mx-auto mb-4" />
              <p className="text-gray-500 text-sm font-medium">No orders found yet.</p>
              <button onClick={() => window.location.href='/shop'} className="mt-4 text-purple-400 font-bold text-sm">Start Shopping →</button>
            </div>
          )}
        </div>

        <button 
          onClick={() => { if(window.confirm("Logout korben?")) logout() }} 
          className="w-full bg-red-600/10 hover:bg-red-600/20 text-red-500 font-bold py-4 rounded-xl border border-red-500/20 transition-all flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" /> Log Out
        </button>

      </main>
    </div>
  );
};

export default Account;
          
