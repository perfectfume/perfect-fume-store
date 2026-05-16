import { useState, useEffect } from "react";
import { Lock, Users, Package, CheckCircle, TrendingUp, DollarSign } from 'lucide-react';

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

  // --- DASHBOARD STATES ---
  const [activeTab, setActiveTab] = useState("dashboard");
  const [pendingProducts, setPendingProducts] = useState([]);
  const [warehouseOrders, setWarehouseOrders] = useState([]);
  const [stockInput, setStockInput] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    if (isAuthorized) {
      if (activeTab === "approvals" || activeTab === "warehouse") fetchPendingProducts();
      if (activeTab === "orders") fetchWarehouseOrders();
    }
  }, [activeTab, isAuthorized]);

  // --- LOGIN LOGIC ---
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
      if (res.ok) { 
        setLoginStep(2); 
        alert(`Secure OTP sent to ${ADMIN_EMAIL}`); 
      }
    } catch (err) { 
      alert("Network Error!"); 
    }
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
      if (data.success) {
        setIsAuthorized(true);
      } else { 
        alert("Invalid OTP!"); 
      }
    } catch (err) { 
      alert("Network Error!"); 
    }
    setIsProcessing(false);
  };

  // --- DATA FETCHING ---
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
      if (Array.isArray(data)) setWarehouseOrders(data);
    } catch (err) {
      console.error("Failed to fetch orders");
    }
  };

  const handleApproveProduct = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/approve-product`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Product Approved!");
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
        alert(`Stock of ${qty} added to warehouse!`);
        setStockInput({ ...stockInput, [id]: 0 });
      }
    } catch (err) {
      alert("Error updating stock.");
    }
  };

  // --- UI: LOGIN SCREEN ---
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 font-sans text-white">
        <div className="bg-[#111] p-8 rounded-2xl border border-white/10 shadow-2xl w-full max-w-md animate-in zoom-in-95">
          <div className="text-center mb-6">
            <Lock className="w-12 h-12 text-red-500 mx-auto mb-4" /> 
            <h2 className="text-2xl font-bold italic text-red-500">Warehouse Admin</h2>
            <p className="text-xs text-gray-500 mt-1">Multi-Vendor Control Center</p>
          </div>
          {loginStep === 1 ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <input type="email" required placeholder="Admin Email" className="w-full bg-black border border-white/10 rounded-lg py-3 px-4 outline-none focus:border-red-500" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input type="password" required placeholder="Secret Master Key" className="w-full bg-black border border-white/10 rounded-lg py-3 px-4 outline-none focus:border-red-500" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="submit" disabled={isProcessing} className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg font-bold shadow-lg transition-all text-white">{isProcessing ? 'Verifying...' : 'Request Access'}</button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <p className="text-xs text-green-400 mb-4 bg-green-900/20 p-2 rounded-lg border border-green-500/20 text-center">OTP Sent to Admin Mail</p>
              <input type="number" required placeholder="Enter 4-Digit OTP" className="w-full bg-black border border-white/10 rounded-lg py-3 px-4 outline-none text-center tracking-[1em] font-bold text-xl focus:border-green-500" value={otp} onChange={(e) => setOtp(e.target.value)} />
              <button type="submit" disabled={isProcessing} className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-lg font-bold shadow-lg transition-all text-white">{isProcessing ? 'Unlocking...' : 'Verify & Enter'}</button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // --- UI: MAIN WAREHOUSE DASHBOARD ---
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 p-4 md:p-8 font-sans">
      <div className="bg-red-900/20 backdrop-blur-xl border border-red-500/20 rounded-2xl p-6 mb-8 flex justify-between items-center shadow-2xl">
        <div>
          <h1 className="text-3xl font-bold text-red-400">Warehouse Control Hub</h1>
          <p className="text-gray-400 mt-1">Multi-Vendor Management System</p>
        </div>
        <button onClick={() => setIsAuthorized(false)} className="text-sm bg-white/5 border border-white/10 px-4 py-2 rounded-lg hover:bg-white/10">Lock Screen</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        
        {/* Navigation Sidebar (Expanded List) */}
        <div className="md:col-span-1 space-y-2">
          {[
            { id: "dashboard", label: "Dashboard", icon: <TrendingUp className="w-4 h-4 inline mr-2"/> },
            { id: "sellers", label: "Manage Sellers", icon: <Users className="w-4 h-4 inline mr-2"/> },
            { id: "approvals", label: "Product Approvals", icon: <CheckCircle className="w-4 h-4 inline mr-2"/> },
            { id: "warehouse", label: "Stock Receiving", icon: <Package className="w-4 h-4 inline mr-2"/> },
            { id: "orders", label: "Order & Shipping", icon: <Package className="w-4 h-4 inline mr-2"/> },
            { id: "commission", label: "Commission Report", icon: <DollarSign className="w-4 h-4 inline mr-2"/> },
            { id: "payouts", label: "Seller Payouts", icon: <DollarSign className="w-4 h-4 inline mr-2"/> }
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

        {/* Content Area */}
        <div className="md:col-span-4">
          
          {/* TAB: MAIN DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Platform Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                  <h3 className="text-gray-400 text-sm mb-2">Total Sellers</h3>
                  <p className="text-4xl font-bold text-white">1</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                  <h3 className="text-gray-400 text-sm mb-2">Total Vendor Products</h3>
                  <p className="text-4xl font-bold text-white">0</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                  <h3 className="text-gray-400 text-sm mb-2">Platform Commission Earned</h3>
                  <p className="text-4xl font-bold text-green-400">₹ 0</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB: SELLERS */}
          {activeTab === "sellers" && (
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6 text-white">Seller Management</h2>
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400">
                    <th className="pb-3">Brand Name</th>
                    <th className="pb-3">Email</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/5">
                    <td className="py-4 text-white">Premium Fragrance</td>
                    <td className="py-4 text-gray-400">test@email.com</td>
                    <td className="py-4"><span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-md text-xs">Approved</span></td>
                    <td className="py-4"><button className="text-red-400 hover:text-red-300 text-xs font-bold">Suspend</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* TAB: APPROVALS */}
          {activeTab === "approvals" && (
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6 text-white">Pending Product Approvals</h2>
              {pendingProducts.length === 0 ? (
                <p className="text-gray-500">No pending products to approve.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pendingProducts.map((p: any) => (
                    <div key={p.id} className="bg-[#111] p-4 rounded-xl border border-white/5 flex flex-col justify-between">
                      <div className="mb-4">
                        <h4 className="font-bold text-white">{p.name} <span className="text-xs text-purple-400">({p.category})</span></h4>
                        <p className="text-xs text-gray-400 mt-1">Seller: {p.seller_email}</p>
                        <p className="text-sm text-green-400 mt-2 font-bold">Price: ₹{p.price}</p>
                      </div>
                      <button onClick={() => handleApproveProduct(p.id)} className="w-full bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-bold">
                        Approve Product
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: WAREHOUSE */}
          {activeTab === "warehouse" && (
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6 text-white">Warehouse Stock Receiving</h2>
              <p className="text-sm text-gray-400 mb-6">Update stock here only when you physically receive the perfume bottles from the seller.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingProducts.map((p: any) => (
                  <div key={p.id} className="bg-[#111] p-4 rounded-xl border border-white/5 flex flex-col gap-4">
                    <div>
                      <h4 className="font-bold text-white">{p.name}</h4>
                      <p className="text-xs text-gray-400">Current Stock: {p.stock} pcs</p>
                    </div>
                    <div className="flex gap-2">
                      <input 
                        type="number" 
                        placeholder="Qty Received" 
                        value={stockInput[p.id] || ""}
                        onChange={(e) => setStockInput({ ...stockInput, [p.id]: parseInt(e.target.value) })}
                        className="bg-black border border-white/10 rounded-lg p-2 text-white w-full focus:border-red-500 focus:outline-none text-sm" 
                      />
                      <button onClick={() => handleReceiveStock(p.id)} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap">
                        Add Stock
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: ORDERS */}
          {activeTab === "orders" && (
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6 text-white">Centralized Packing & Shipping</h2>
              <p className="text-gray-500 text-sm">Customer orders containing vendor products will appear here. You will pack the box and assign a tracking ID.</p>
            </div>
          )}

          {/* TAB: COMMISSION */}
          {activeTab === "commission" && (
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6 text-white">Platform Commission Report</h2>
              <p className="text-gray-500 text-sm mb-4">You are charging 10% commission on all vendor sales.</p>
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400">
                    <th className="pb-3">Order ID</th>
                    <th className="pb-3">Total Amount</th>
                    <th className="pb-3 text-green-400">Your Cut (10%)</th>
                    <th className="pb-3">Seller Cut (90%)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td colSpan={4} className="py-8 text-center text-gray-500">No transactions yet.</td></tr>
                </tbody>
              </table>
            </div>
          )}

          {/* TAB: PAYOUTS */}
          {activeTab === "payouts" && (
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6 text-white">Seller Payout Requests</h2>
              <p className="text-gray-500 text-sm">Approve withdrawal requests here after you have transferred the money to the seller's bank account.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
                      }
                
