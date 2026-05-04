import React, { useEffect, useState } from 'react';
import { User, Package, Gift, Edit3, LogOut, ExternalLink, Copy, CheckCircle, X, ChevronDown, ChevronUp, Info, Share2, MessageCircle, Facebook, MapPin, Mail, Phone } from 'lucide-react';
import { useStore } from '../store/useStore';

const Account = () => {
  const { userName, userEmail, userPhone, setUserAuth, logout } = useStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // 🔥 View All Orders State
  const [showAllOrders, setShowAllOrders] = useState(false);

  // 🔥 Edit Profile States (All Details)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(userName || '');
  const [editEmail, setEditEmail] = useState(userEmail || '');
  const [editPhone, setEditPhone] = useState(userPhone || '');
  const [editFlat, setEditFlat] = useState(localStorage.getItem('userFlat') || '');
  const [editArea, setEditArea] = useState(localStorage.getItem('userArea') || '');
  const [editCity, setEditCity] = useState(localStorage.getItem('userCity') || 'Kolkata');
  const [editPincode, setEditPincode] = useState(localStorage.getItem('userPincode') || '');

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
    if (editEmail) {
      setUserAuth(editName, editEmail, editPhone);
      // Extra details gulo localStorage e save korlam
      localStorage.setItem('userFlat', editFlat);
      localStorage.setItem('userArea', editArea);
      localStorage.setItem('userCity', editCity);
      localStorage.setItem('userPincode', editPincode);
      
      setIsEditModalOpen(false);
      alert("✅ All Profile Details Updated Successfully!");
    }
  };

  const getOrderTotal = (order: any) => {
    if (order.totalAmount && order.totalAmount > 0) return order.totalAmount;
    try {
      const items = JSON.parse(order.cart_details);
      return items.reduce((sum: number, i: any) => sum + (Number(i.price) * (i.quantity || i.qty || 1)), 0);
    } catch (e) { return '---'; }
  };

  const handleTrackOrder = (id: string) => {
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
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-24 font-sans relative">
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
             {(editFlat || editCity) && (
               <p className="text-gray-500 text-xs mt-2 italic">📍 {editFlat}, {editCity}</p>
             )}
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
                  <li>• Apni peye jaben <span className="text-green-400 font-bold">40% FLAT Discount</span> apnar next purchase-e!</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* RECENT ORDERS (Preview 3 orders) */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6 px-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400"><Package className="w-5 h-5" /></div>
              <h3 className="text-xl font-bold">Recent Orders</h3>
            </div>
            {/* 🔥 VIEW ALL BUTTON ACTIVE KORA HOLO */}
            {orders.length > 3 && (
              <button onClick={() => setShowAllOrders(true)} className="text-xs font-bold text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full hover:bg-purple-500/20 transition-colors uppercase tracking-widest cursor-pointer">
                View All ({orders.length})
              </button>
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

        {/* 🔥 1. FULL DETAILS EDIT PROFILE MODAL */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex justify-center items-center px-4 py-4 overflow-y-auto">
            <div className="bg-[#111] w-full max-w-md rounded-2xl border border-white/10 p-6 relative shadow-2xl animate-in zoom-in duration-200 mt-10 md:mt-0">
              <button onClick={() => setIsEditModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white bg-white/5 p-2 rounded-full z-10"><X className="w-4 h-4" /></button>
              
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Edit3 className="w-6 h-6 text-purple-500" />
                </div>
                <h2 className="text-xl font-bold text-white italic">Complete Profile</h2>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {/* Personal Info */}
                <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-3">
                  <h3 className="text-xs text-purple-400 font-bold uppercase tracking-widest mb-2 border-b border-white/10 pb-2">Personal</h3>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 ml-1 block"><User className="w-3 h-3 inline mr-1"/> Full Name</label>
                    <input required value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full bg-black border border-white/10 rounded-lg p-2.5 text-white text-sm focus:border-purple-500 outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 ml-1 block"><Mail className="w-3 h-3 inline mr-1"/> Email Address</label>
                    <input required type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className="w-full bg-black border border-white/10 rounded-lg p-2.5 text-white text-sm focus:border-purple-500 outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 ml-1 block"><Phone className="w-3 h-3 inline mr-1"/> Phone Number</label>
                    <input required type="number" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} className="w-full bg-black border border-white/10 rounded-lg p-2.5 text-white text-sm focus:border-purple-500 outline-none" />
                  </div>
                </div>

                {/* Address Info */}
                <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-3">
                  <h3 className="text-xs text-purple-400 font-bold uppercase tracking-widest mb-2 border-b border-white/10 pb-2">Default Address</h3>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 ml-1 block">Flat / House No.</label>
                    <input value={editFlat} onChange={(e) => setEditFlat(e.target.value)} placeholder="E.g. Flat 4B, Block 2" className="w-full bg-black border border-white/10 rounded-lg p-2.5 text-white text-sm focus:border-purple-500 outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 ml-1 block">Area / Locality</label>
                    <input value={editArea} onChange={(e) => setEditArea(e.target.value)} placeholder="E.g. Salt Lake Sector 5" className="w-full bg-black border border-white/10 rounded-lg p-2.5 text-white text-sm focus:border-purple-500 outline-none" />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 ml-1 block">City</label>
                      <input value={editCity} onChange={(e) => setEditCity(e.target.value)} className="w-full bg-black border border-white/10 rounded-lg p-2.5 text-white text-sm focus:border-purple-500 outline-none" />
                    </div>
                    <div className="flex-1">
                      <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 ml-1 block">Pincode</label>
                      <input type="number" value={editPincode} onChange={(e) => setEditPincode(e.target.value)} className="w-full bg-black border border-white/10 rounded-lg p-2.5 text-white text-sm focus:border-purple-500 outline-none" />
                    </div>
                  </div>
                </div>

                <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3.5 rounded-xl mt-4 shadow-lg shadow-purple-900/20 sticky bottom-0">Save All Details</button>
              </form>
            </div>
          </div>
        )}

        {/* 🔥 2. VIEW ALL ORDERS POPUP MODAL */}
        {showAllOrders && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex flex-col items-center pt-20 px-4 pb-4 overflow-hidden">
            <div className="w-full max-w-2xl bg-[#111] border border-white/10 rounded-2xl flex flex-col max-h-full animate-in slide-in-from-bottom-8">
              
              <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/50 rounded-t-2xl">
                <h2 className="text-lg font-bold flex items-center gap-2"><Package className="text-purple-400"/> All Order History</h2>
                <button onClick={() => setShowAllOrders(false)} className="bg-white/10 p-2 rounded-full hover:bg-white/20"><X className="w-4 h-4"/></button>
              </div>

              <div className="p-4 overflow-y-auto space-y-3 custom-scrollbar flex-1">
                {orders.map((order) => (
                  <div key={order.id} className="bg-[#0a0a0a] border border-white/5 p-5 rounded-xl flex justify-between items-center hover:border-purple-500/50 transition-all">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-bold text-white text-sm">#OR-{order.id}</span>
                        <span className={`text-[8px] px-2 py-0.5 rounded-full uppercase font-bold ${order.status === 'delivered' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{new Date(order.created_at).toLocaleDateString('en-IN', {day: 'numeric', month: 'short', year: 'numeric'})}</p>
                      
                      <button onClick={() => {setShowAllOrders(false); handleTrackOrder(order.id);}} className="text-[10px] font-bold bg-purple-600/20 text-purple-400 px-3 py-1.5 rounded-md flex items-center gap-1 hover:bg-purple-600/40 transition-colors uppercase tracking-widest">
                        Track Now <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-bold text-white text-lg">₹{getOrderTotal(order)}</p>
                      <p className="text-[10px] text-gray-500 uppercase mt-1">Paid via {order.status === 'paid' ? 'Online' : 'COD'}</p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default Account;
