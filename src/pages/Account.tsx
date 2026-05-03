import React, { useEffect, useState } from 'react';
import { User, Package, Gift, Edit3, LogOut, ExternalLink, Copy, CheckCircle, X, ChevronDown, ChevronUp, Info, Share2, MessageCircle, Facebook } from 'lucide-react';
import { useStore } from '../store/useStore';

const Account = () => {
  const { userName, userEmail, userPhone, setUserAuth, logout } = useStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(userName || '');
  const [editPhone, setEditPhone] = useState(userPhone || '');
  const [showTerms, setShowTerms] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "https://perfect-fume-backend.perfectfumeofficial.workers.dev";
  const referralCode = userEmail ? btoa(userEmail).substring(0, 8).toUpperCase() : "PFUSER";
  const referralLink = `https://${window.location.host}/signup?ref=${referralCode}`;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (userEmail) fetchOrders();
  }, [userEmail]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/orders`); 
      const data = await res.json();
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

  const shareWhatsApp = () => {
    const msg = `Hey! Check out Perfect Fume for premium fragrances. Use my link to get exclusive discounts: ${referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`, '_blank');
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (userEmail) {
      setUserAuth(editName, userEmail, editPhone);
      setIsEditModalOpen(false);
      alert("✅ Profile updated successfully!");
    }
  };

  // 🔥 Smart calculation logic for missing amounts
  const getOrderTotal = (order: any) => {
    if (order.totalAmount && order.totalAmount > 0) return order.totalAmount;
    try {
      const items = JSON.parse(order.cart_details);
      return items.reduce((sum: number, i: any) => sum + (Number(i.price) * (i.quantity || i.qty || 1)), 0);
    } catch (e) { return '---'; }
  };

  const handleTrackOrder = (id: string) => {
    // SessionStorage e id rakha jate track page automatic ota niye track kore
    sessionStorage.setItem('autoTrackId', id);
    window.location.href = '/track-order';
  };

  if (!userEmail) {
    return (
      <div className="min-h-screen bg-[#050505] text-white pt-32 pb-24 flex flex-col items-center text-center px-4 font-sans">
        <div className="w-24 h-24 bg-purple-900/20 rounded-full flex items-center justify-center mb-6 border border-purple-500/20">
          <User className="w-12 h-12 text-purple-500" />
        </div>
        <h2 className="text-3xl font-bold mb-4 italic">Please Sign In</h2>
        <button onClick={() => document.getElementById('nav-login-btn')?.click()} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 px-10 rounded-full transition-all shadow-lg shadow-purple-900/50">Sign In Now</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-24 font-sans">
      <main className="max-w-4xl mx-auto px-4">
        
        {/* PROFILE HEADER */}
        <div className="flex justify-between items-end mb-8 px-2">
          <h1 className="text-3xl font-bold italic text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">My Profile</h1>
          <button onClick={() => setIsEditModalOpen(true)} className="flex items-center gap-2 text-xs font-bold text-purple-400 bg-purple-400/10 px-4 py-2 rounded-lg border border-purple-400/20 hover:bg-purple-400/20 transition-all shadow-lg shadow-purple-900/10">
            <Edit3 className="w-3.5 h-3.5" /> Edit Profile
          </button>
        </div>

        {/* USER CARD */}
        <div className="bg-[#111] border border-white/5 p-6 md:p-8 rounded-3xl mb-8 flex flex-col md:flex-row items-center gap-6 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-5"><User className="w-32 h-32 text-white" /></div>
           <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center border-4 border-black shrink-0 shadow-xl">
             <span className="text-3xl font-bold uppercase">{userName?.charAt(0)}</span>
           </div>
           <div className="z-10 text-center md:text-left">
             <h2 className="text-2xl font-bold text-white mb-1">{userName}</h2>
             <p className="text-gray-400 text-sm mb-1">{userEmail}</p>
             <p className="text-gray-500 text-sm font-mono tracking-widest">{userPhone}</p>
           </div>
        </div>

        {/* REFERRAL SECTION */}
        <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/20 p-6 rounded-3xl mb-8 relative overflow-hidden group">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400"><Gift className="w-5 h-5" /></div>
            <h3 className="text-lg font-bold">Refer & Earn Rewards</h3>
          </div>
          
          <div className="flex gap-2 mb-4 relative z-10">
            <div className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-gray-300 truncate">
              {referralLink}
            </div>
            <button onClick={copyToClipboard} className={`px-4 rounded-xl flex items-center justify-center transition-all ${copied ? 'bg-green-600 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
              {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6 relative z-10">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mr-2">Share on:</p>
            <button onClick={shareWhatsApp} className="p-3 bg-[#25D366]/10 text-[#25D366] rounded-xl border border-[#25D366]/20 hover:bg-[#25D366]/20 transition-all"><MessageCircle className="w-5 h-5" /></button>
            <button onClick={shareFacebook} className="p-3 bg-[#1877F2]/10 text-[#1877F2] rounded-xl border border-[#1877F2]/20 hover:bg-[#1877F2]/20 transition-all"><Facebook className="w-5 h-5" /></button>
            <button onClick={() => { if(navigator.share) { navigator.share({title: 'Perfect Fume', text: 'Check out Perfect Fume!', url: referralLink}) }}} className="p-3 bg-white/5 text-white rounded-xl border border-white/10 hover:bg-white/10 transition-all"><Share2 className="w-5 h-5" /></button>
          </div>

          <div className="border-t border-white/10 pt-4">
            <button onClick={() => setShowTerms(!showTerms)} className="flex items-center gap-2 text-xs font-bold text-indigo-300 hover:text-white transition-colors">
              <Info className="w-3.5 h-3.5" /> How to earn 40% Discount?
              {showTerms ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            {showTerms && (
              <div className="mt-3 bg-black/30 p-4 rounded-xl border border-white/5 animate-in fade-in slide-in-from-top-2">
                <ul className="text-xs text-gray-400 space-y-2 leading-relaxed">
                  <li>• Jabe refer korchen, se account kholar <span className="text-white font-bold">7 diner</span> modhe <span className="text-white font-bold">₹999</span> shopping korle...</li>
                  <li>• Apni peye jaben <span className="text-green-400 font-bold">40% FLAT Discount</span> apnar next <span className="text-white font-bold">₹1200+</span> purchase-e!</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* ORDER HISTORY */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6 px-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400"><Package className="w-5 h-5" /></div>
              <h3 className="text-xl font-bold">Recent Orders</h3>
            </div>
            {orders.length > 3 && (
              <button className="text-xs font-bold text-gray-500 hover:text-purple-400 transition-colors uppercase tracking-widest">View All</button>
            )}
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2].map(i => <div key={i} className="h-24 bg-[#111] animate-pulse rounded-2xl border border-white/5"></div>)}
            </div>
          ) : orders.length > 0 ? (
            <div className="space-y-4">
              {orders.slice(0, 3).map((order) => (
                <div key={order.id} className="bg-[#0a0a0a] border border-white/5 p-5 rounded-2xl flex justify-between items-center group hover:border-purple-500/30 transition-all shadow-lg">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-mono font-bold text-white text-sm">#OR-{order.id}</span>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full uppercase font-bold ${order.status === 'delivered' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString('en-IN', {day: 'numeric', month: 'short', year: 'numeric'})}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white mb-2 text-lg">₹{getOrderTotal(order)}</p>
                    <button onClick={() => handleTrackOrder(order.id)} className="text-[10px] font-bold text-purple-400 flex items-center gap-1 hover:underline ml-auto uppercase tracking-tighter">
                      Track Order <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-[#111] rounded-3xl border border-dashed border-white/10">
              <Package className="w-12 h-12 text-gray-700 mx-auto mb-4" />
              <p className="text-gray-500 text-sm">No orders yet.</p>
              <button onClick={() => window.location.href='/shop'} className="mt-4 text-purple-400 font-bold text-sm">Shop Premium Perfumes</button>
            </div>
          )}
        </div>

        <button onClick={() => { if(window.confirm("Logout korben?")) logout() }} className="w-full bg-red-600/10 hover:bg-red-600/20 text-red-500 font-bold py-4 rounded-2xl border border-red-500/20 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
          <LogOut className="w-4 h-4" /> Log Out Account
        </button>

        {/* EDIT PROFILE MODAL */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex justify-center items-center px-4">
            <div className="bg-[#111] w-full max-w-sm rounded-2xl border border-white/10 p-6 relative shadow-2xl animate-in zoom-in duration-200">
              <button onClick={() => setIsEditModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white bg-white/5 p-2 rounded-full"><X className="w-4 h-4" /></button>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Edit3 className="w-8 h-8 text-purple-500" />
                </div>
                <h2 className="text-2xl font-bold text-white italic">Edit Profile</h2>
              </div>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 ml-1 block">Full Name</label>
                  <input required value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-purple-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 ml-1 block">Phone Number</label>
                  <input required type="number" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-purple-500 outline-none transition-all" />
                </div>
                <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3.5 rounded-xl mt-2 shadow-lg shadow-purple-900/20">Save Changes</button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Account;
