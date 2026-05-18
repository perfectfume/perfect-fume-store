import { useState, useEffect } from "react";
import { Lock, Users, Package, CheckCircle, TrendingUp, DollarSign, Settings, FileText, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function WarehouseAdmin() {
  // --- AUTH STATES ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loginStep, setLoginStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // --- ADMIN CREDENTIALS ---
  const ADMIN_SECRET = "Himanshu@2026"; 
  const ADMIN_EMAIL = "perfectfumeofficial@gmail.com";
  const API_BASE_URL = "https://perfect-fume-backend.perfectfumeofficial.workers.dev";

  // --- DATA STATES ---
  const [activeTab, setActiveTab] = useState("dashboard");
  const [pendingProducts, setPendingProducts] = useState([]);
  const [warehouseOrders, setWarehouseOrders] = useState([]);
  const [sellersList, setSellersList] = useState([
    { email: "vendor1@email.com", brand_name: "Oud Majestic", owner_name: "Ayan Chatterjee", phone: "9876543210", status: "approved", badge: true }
  ]);
  const [payoutRequests, setPayoutRequests] = useState([
    { id: 1, seller_email: "vendor1@email.com", amount: 4500, status: "pending", requested_at: "2026-05-15" }
  ]);
  const [stockInput, setStockInput] = useState<{ [key: string]: number }>({});
  const [trackingInputs, setTrackingInputs] = useState<{ [key: string]: string }>({});
  const [commissionRule, setCommissionRule] = useState(10);

  // --- MODAL AND INTERACTIVE SELLER STATES ---
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSeller, setNewSeller] = useState({ brand_name: '', owner_name: '', email: '', phone: '' });

  useEffect(() => {
    if (isAuthorized) {
      if (activeTab === "approvals" || activeTab === "warehouse") fetchPendingProducts();
      if (activeTab === "orders") fetchWarehouseOrders();
    }
  }, [activeTab, isAuthorized]);

  // --- API CALLS ---
  const fetchPendingProducts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/pending-products`);
      const data = await res.json();
      if (Array.isArray(data)) setPendingProducts(data);
    } catch (err) {
      console.error("Failed to fetch products");
    }
  };

  const fetchWarehouseOrders = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/warehouse-orders`);
      const data = await res.json();
      if (Array.isArray(data)) {
        const realOrders = data.filter((o: any) => o.status !== 'pending' && o.status !== 'expired' && o.email);
        setWarehouseOrders(realOrders);
      }
    } catch (err) {
      console.error("Failed to fetch orders");
    }
  };

  // --- ACTIONS ---
  const handleApproveProduct = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/approve-product`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Product Approved Successfully!");
        fetchPendingProducts();
      }
    } catch (err) {
      alert("Error approving product.");
    }
  };

  const handleReceiveStock = async (id: string) => {
    const qty = stockInput[id];
    if (!qty || qty <= 0) return alert("Please enter a valid quantity.");
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/receive-stock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, quantity: qty }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Stock updated in warehouse successfully.");
        setStockInput({ ...stockInput, [id]: 0 });
        fetchPendingProducts();
      }
    } catch (err) {
      alert("Error updating stock.");
    }
  };

  const handleUpdateOrderTracking = async (orderId: string) => {
    const trackingId = trackingInputs[orderId];
    if (!trackingId) return alert("Please enter a tracking ID first.");
    alert("Tracking ID " + trackingId + " linked to Order #OR-" + orderId + ". Notification sent to customer.");
  };

  const handleToggleSellerStatus = (email: string, currentStatus: string) => {
    const newStatus = currentStatus === 'approved' ? 'suspended' : 'approved';
    setSellersList(prev => prev.map(seller => 
      seller.email === email ? { ...seller, status: newStatus } : seller
    ));
    alert("Status changed to " + newStatus + " successfully!");
  };

  const handleApprovePayout = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/approve-payout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Payout marked as paid successfully!");
        setPayoutRequests(prev => prev.map(req => 
          req.id === id ? { ...req, status: 'paid' } : req
        ));
      }
    } catch (err) {
      alert("Error approving payout.");
    }
  };

  const handleAddSellerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSeller.brand_name || !newSeller.email) return alert("Please fill all details");
    
    setSellersList(prev => [...prev, { ...newSeller, status: 'approved', badge: false }]);
    setIsAddModalOpen(false);
    setNewSeller({ brand_name: '', owner_name: '', email: '', phone: '' });
    alert("New Seller Added Successfully!");
  };

  const handleToggleBadge = (email: string) => {
    setSellersList(prev => prev.map(seller => 
      seller.email === email ? { ...seller, badge: !seller.badge } : seller
    ));
  };

  // --- LOGIN HANDLERS ---
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== ADMIN_SECRET || email !== ADMIN_EMAIL) return alert("Wrong Email or Password!");
    setIsProcessing(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/order`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ email: ADMIN_EMAIL }) 
      });
      if (res.ok) { setLoginStep(2); alert("Secure OTP sent to " + ADMIN_EMAIL); }
    } catch (err) { alert("Network Error!"); }
    setIsProcessing(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/verify-otp`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ email: ADMIN_EMAIL, otp: otp }) 
      });
      const data = await res.json();
      if (data.success) setIsAuthorized(true);
      else alert("Invalid OTP!");
    } catch (err) { alert("Network Error!"); }
    setIsProcessing(false);
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 font-sans text-white">
        <div className="bg-[#111] p-8 rounded-2xl border border-white/10 shadow-2xl w-full max-w-md animate-in zoom-in-95">
          <div className="text-center mb-6">
            <Lock className="w-12 h-12 text-red-500 mx-auto mb-4" /> 
            <h2 className="text-2xl font-bold italic text-red-500">Warehouse Admin</h2>
            <p className="text-xs text-gray-500 mt-1">Level 4 Multi-Vendor Clearance Required</p>
          </div>
          {loginStep === 1 ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <input type="email" required placeholder="Admin Email" className="w-full bg-black border border-white/10 rounded-lg py-3 px-4 outline-none focus:border-red-500" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input type="password" required placeholder="Secret Master Key" className="w-full bg-black border border-white/10 rounded-lg py-3 px-4 outline-none focus:border-red-500" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="submit" disabled={isProcessing} className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg font-bold shadow-lg transition-all text-white">{isProcessing ? 'Verifying...' : 'Request Access'}</button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <p className="text-xs text-green-400 mb-4 bg-green-900/20 p-2 rounded-lg border border-green-500/20 text-center">Master OTP Sent to Admin Mail</p>
              <input type="number" required placeholder="Enter 4-Digit OTP" className="w-full bg-black border border-white/10 rounded-lg py-3 px-4 outline-none text-center tracking-[1em] font-bold text-xl focus:border-green-500" value={otp} onChange={(e) => setOtp(e.target.value)} />
              <button type="submit" disabled={isProcessing} className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg font-bold shadow-lg transition-all text-white">{isProcessing ? 'Unlocking...' : 'Verify & Enter'}</button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 p-4 md:p-8 font-sans">
      <div className="bg-red-900/20 backdrop-blur-xl border border-red-500/20 rounded-2xl p-6 mb-8 flex justify-between items-center shadow-2xl">
        <div>
          <h1 className="text-3xl font-bold text-red-400">Warehouse Control Hub</h1>
          <p className="text-gray-400 mt-1">Multi-Vendor Management System</p>
        </div>
        <button onClick={() => setIsAuthorized(false)} className="text-sm bg-white/5 border border-white/10 px-4 py-2 rounded-lg hover:bg-white/10">Lock Center</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="md:col-span-1 space-y-2">
          {[
            { id: "dashboard", label: "Dashboard", icon: <TrendingUp className="w-4 h-4 inline mr-2"/> },
            { id: "sellers", label: "Seller Management", icon: <Users className="w-4 h-4 inline mr-2"/> },
            { id: "approvals", label: "Product Approvals", icon: <CheckCircle className="w-4 h-4 inline mr-2"/> },
            { id: "warehouse", label: "Warehouse Inventory", icon: <Package className="w-4 h-4 inline mr-2"/> },
            { id: "orders", label: "Fulfillment & Packing", icon: <FileText className="w-4 h-4 inline mr-2"/> },
            { id: "payouts", label: "Payout Management", icon: <DollarSign className="w-4 h-4 inline mr-2"/> },
            { id: "settings", label: "Global Settings", icon: <Settings className="w-4 h-4 inline mr-2"/> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 font-medium text-sm ${
                activeTab === tab.id 
                  ? "bg-red-600/20 text-red-400 border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]" 
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-transparent"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Content Panel */}
        <div className="md:col-span-4">
          
          {/* TAB: MAIN DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white uppercase tracking-wider">Main Panel Analytics</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                  <h3 className="text-gray-400 text-xs uppercase mb-2">Total Sellers</h3>
                  <p className="text-3xl font-bold text-white">{sellersList.length}</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                  <h3 className="text-gray-400 text-xs uppercase mb-2">Pending Approvals</h3>
                  <p className="text-3xl font-bold text-yellow-400">{pendingProducts.length}</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                  <h3 className="text-gray-400 text-xs uppercase mb-2">Fulfillment Orders</h3>
                  <p className="text-3xl font-bold text-white">{warehouseOrders.length}</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                  <h3 className="text-gray-400 text-xs uppercase mb-2">Commission Revenue</h3>
                  <p className="text-3xl font-bold text-green-400">₹ 0</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB: SELLER MANAGEMENT */}
          {activeTab === "sellers" && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Platform Sellers</h2>
                <button onClick={() => setIsAddModalOpen(true)} className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-bold">
                  + Add New Seller
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-400">
                      <th className="pb-3 pl-2">Brand Name</th>
                      <th className="pb-3">Owner Details</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right pr-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sellersList.map((seller: any, idx) => (
                      <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-4 pl-2 font-medium text-white flex items-center gap-1">
                          {seller.brand_name}
                          {seller.badge && <ShieldCheck className="w-4 h-4 text-blue-400 inline"/>}
                        </td>
                        <td className="py-4">
                          <p className="text-gray-200">{seller.owner_name}</p>
                          <p className="text-xs text-gray-500">{seller.email} | {seller.phone}</p>
                        </td>
                        <td className="py-4">
                          <span className={`px-2 py-0.5 rounded text-xs uppercase font-bold tracking-wider ${seller.status === 'approved' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                            {seller.status}
                          </span>
                        </td>
                        <td className="py-4 text-right pr-2 space-x-2">
                          <button onClick={() => handleToggleBadge(seller.email)} className="text-xs text-blue-400 hover:underline">Toggle Badge</button>
                          <button onClick={() => handleToggleSellerStatus(seller.email, seller.status)} className={`text-xs hover:underline font-bold ${seller.status === 'approved' ? 'text-red-400 hover:text-red-300' : 'text-green-400 hover:text-green-300'}`}>
                            {seller.status === 'approved' ? 'Suspend' : 'Unsuspend'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: PRODUCT APPROVALS */}
          {activeTab === "approvals" && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6 text-white">Pending Approvals</h2>
              {pendingProducts.length === 0 ? (
                <p className="text-gray-500 text-sm">No uploaded products waiting for clearance.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {pendingProducts.map((p: any) => (
                    <div key={p.id} className="bg-black/40 p-4 rounded-xl border border-white/5 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-white text-base">{p.name}</h4>
                        <span className="text-xs bg-purple-500/10 border border-purple-500/20 text-purple-400 px-2 py-0.5 rounded mt-1 inline-block">{p.category}</span>
                        <p className="text-xs text-gray-400 mt-2">Owner: {p.seller_email}</p>
                        <p className="text-sm text-fuchsia-400 mt-2 font-bold">Base Price: ₹{p.price}</p>
                      </div>
                      <button onClick={() => handleApproveProduct(p.id)} className="w-full mt-4 bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg text-xs font-bold transition-colors">
                        Approve Product
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: WAREHOUSE INVENTORY */}
          {activeTab === "warehouse" && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-2 text-white">Warehouse Physical Receiving</h2>
              <p className="text-xs text-gray-400 mb-6">Receive perfumes physically at your hub to instantly update marketplace inventory listings.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {pendingProducts.map((p: any) => (
                  <div key={p.id} className="bg-black/40 p-4 rounded-xl border border-white/5 flex flex-col gap-4">
                    <div>
                      <h4 className="font-bold text-white">{p.name}</h4>
                      <p className="text-xs text-gray-400">Current Stock: {p.stock} units</p>
                    </div>
                    <div className="flex gap-2">
                      <input 
                        type="number" 
                        placeholder="Units Recv" 
                        value={stockInput[p.id] || ""}
                        onChange={(e) => setStockInput({ ...stockInput, [p.id]: parseInt(e.target.value) })}
                        className="bg-black border border-white/10 rounded-lg p-2 text-white w-full focus:border-red-500 focus:outline-none text-xs" 
                      />
                      <button onClick={() => handleReceiveStock(p.id)} className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-lg text-xs font-bold transition-colors">
                        Log Entry
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: FULFILLMENT & PACKING */}
          {activeTab === "orders" && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-2 text-white">Fulfillment Queue</h2>
              <p className="text-xs text-gray-400 mb-6">Pack multibrand client orders here. Print your packaging slips and include custom invoice logs.</p>
              
              {warehouseOrders.length === 0 ? (
                <div className="text-center py-8 bg-[#111] rounded-xl border border-white/5">
                  <p className="text-sm text-gray-500">Fulfillment dispatch queue is clear. No active orders found.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {warehouseOrders.map((order: any) => (
                    <div key={order.id} className="bg-black/40 border border-white/5 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <span className="text-xs text-red-400 font-mono font-bold">#OR-{order.id}</span>
                        <p className="text-sm text-white font-medium mt-1">Client: {order.email}</p>
                        <p className="text-xs text-gray-500">Status: <span className="text-yellow-400 font-bold uppercase">{order.status}</span></p>
                      </div>
                      <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
                        <input 
                          type="text"
                          placeholder="Courier Tracking ID"
                          value={trackingInputs[order.id] || ""}
                          onChange={(e) => setTrackingInputs({ ...trackingInputs, [order.id]: e.target.value })}
                          className="bg-black border border-white/10 rounded-lg p-2 text-white text-xs outline-none focus:border-red-500 w-44"
                        />
                        <button onClick={() => handleUpdateOrderTracking(order.id)} className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-2 rounded-lg transition-all">
                          Ship Package
                        </button>
                        <button onClick={() => window.print()} className="bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-xs px-3 py-2 rounded-lg transition-all">
                          Slip
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: PAYOUT MANAGEMENT */}
          {activeTab === "payouts" && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4 text-white">Vendor Withdrawals</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-400">
                      <th className="pb-3 pl-2">Vendor Log</th>
                      <th className="pb-3">Amount Requested</th>
                      <th className="pb-3">Timestamp</th>
                      <th className="pb-3 text-right pr-2">Clearance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payoutRequests.map((req) => (
                      <tr key={req.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-4 pl-2 font-medium text-white">{req.seller_email}</td>
                        <td className="py-4 text-green-400 font-bold">₹{req.amount}</td>
                        <td className="py-4 text-gray-500 text-xs">{req.requested_at}</td>
                        <td className="py-4 text-right pr-2">
                          {req.status === 'pending' ? (
                            <button onClick={() => handleApprovePayout(req.id)} className="bg-green-600/20 text-green-400 hover:bg-green-600 hover:text-white px-3 py-1 rounded text-xs font-bold transition-all">
                              Mark As Paid
                            </button>
                          ) : (
                            <span className="text-gray-500 text-xs font-bold uppercase">Paid</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: GLOBAL SETTINGS */}
          {activeTab === "settings" && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-2 text-white">Global Platform Rules</h2>
              <p className="text-xs text-gray-400 mb-6">Modify system parameters, transactional distribution models, and platform rule bounds here.</p>
              
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Base Platform Commission % (MRP)</label>
                  <div className="flex gap-2">
                    <input 
                      type="number" 
                      value={commissionRule} 
                      onChange={(e) => setCommissionRule(parseInt(e.target.value))}
                      className="bg-black border border-white/10 rounded-lg p-3 text-white text-sm outline-none focus:border-red-500 w-full"
                    />
                    <button onClick={() => alert("Global platform distribution commission rate updated to " + commissionRule + "%")} className="bg-red-600 hover:bg-red-700 font-bold text-xs text-white px-4 rounded-lg transition-all whitespace-nowrap">
                      Update Rule
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ADD SELLER POPUP MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-center items-center px-4">
          <div className="bg-[#111] w-full max-w-md rounded-2xl border border-white/10 p-6 relative shadow-2xl text-white">
            <button onClick={() => setIsAddModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white bg-white/5 p-2 rounded-full">✕</button>
            <h2 className="text-xl font-bold text-red-400 mb-6 italic">Add New Brand / Seller</h2>
            
            <form onSubmit={handleAddSellerSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-gray-400 mb-1">Brand Name</label>
                <input type="text" required value={newSeller.brand_name} onChange={e => setNewSeller({...newSeller, brand_name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 outline-none focus:border-red-500" placeholder="e.g. Oud Majestic" />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Owner Name</label>
                <input type="text" required value={newSeller.owner_name} onChange={e => setNewSeller({...newSeller, owner_name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 outline-none focus:border-red-500" placeholder="Ayan Chatterjee" />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Email Address</label>
                <input type="email" required value={newSeller.email} onChange={e => setNewSeller({...newSeller, email: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 outline-none focus:border-red-500" placeholder="vendor@email.com" />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Phone Number</label>
                <input type="text" required value={newSeller.phone} onChange={e => setNewSeller({...newSeller, phone: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 outline-none focus:border-red-500" placeholder="9876543210" />
              </div>
              <div className="flex gap-4 mt-6">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="w-full bg-white/5 hover:bg-white/10 py-2.5 rounded-lg font-bold">Cancel</button>
                <button type="submit" className="w-full bg-red-600 hover:bg-red-700 py-2.5 rounded-lg font-bold text-white shadow-lg shadow-red-900/30">Save Seller</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
