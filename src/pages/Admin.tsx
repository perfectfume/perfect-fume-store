import { useState, useEffect } from 'react';
import { Download, AlertTriangle, TrendingUp, Package, Users, Calendar, Filter, Inbox, Clock, Truck, CheckCircle, Pencil, X } from 'lucide-react';
const AdminPanel = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loginStep, setLoginStep] = useState(1); 
  const [isProcessing, setIsProcessing] = useState(false);

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard'); 
  
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Men');
  const [stock, setStock] = useState(''); 
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [extraImages, setExtraImages] = useState<string[]>([]); // 🔥 NOTUN: Gallery images
  
  const [isUploading, setIsUploading] = useState(false);
    // 🔥 EDIT PRODUCT STATES
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editCategory, setEditCategory] = useState('Men');
  const [editStock, setEditStock] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editImage, setEditImage] = useState('');
  const [editExtraImages, setEditExtraImages] = useState<string[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [trackingLinks, setTrackingLinks] = useState<any>({}); 
  
  // 🔥 FILTER STATES
  const [dateFilter, setDateFilter] = useState('all'); // all, 7days, 30days, custom
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

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
        fetchProducts(); fetchOrders();
      } else { alert("⚠️ Vul OTP!"); }
    } catch (err) { alert("Network Error!"); }
    setIsProcessing(false);
  };

  // --- DATA FETCHING ---
  const fetchProducts = async () => {
    const res = await fetch(`${API_URL}/api/catalog`);
    const data = await res.json();
    setProducts(data);
  };

    // 🔥 FIX: Filter ghost orders (Login requests without cart items)
  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/orders`);
      const data = await res.json();
      const realOrders = data.filter((o: any) => o.cart_details && o.cart_details !== "null" && o.cart_details !== "[]");
      setOrders(realOrders);
    } catch (err) { console.error("Order load hoyni"); }
  };
  
  // --- PRODUCT ACTIONS ---
    const handleAddProduct = async (e: any) => {
    e.preventDefault();
    setIsUploading(true);
    
    // Faka URL gulo bad diye shudhu asol link gulo nebo
    const cleanGallery = extraImages.filter(url => url.trim() !== '');

    const res = await fetch(`${API_URL}/api/add-product`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        name: title, price: Number(price), description, image, category, stock: Number(stock), 
        gallery: cleanGallery // 🔥 NOTUN
      })
    });
    const data = await res.json();
    if (data.success) { 
      alert("✅ Product & Gallery Uploaded!"); 
      setTitle(''); setPrice(''); setStock(''); setDescription(''); setImage(''); 
      setExtraImages([]); // 🔥 NOTUN: Form reset
      fetchProducts(); 
    }
    setIsUploading(false);
  };
  

  const handleDelete = async (id: string) => {
    if (!window.confirm("Sotti Delete korben?")) return;
    const res = await fetch(`${API_URL}/api/delete-product`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    if (res.ok) fetchProducts();
  };
    // 🔥 EDIT PRODUCT LOGIC
  const openEditModal = (product: any) => {
    setEditingProductId(product.id);
    setEditTitle(product.name);
    setEditPrice(product.price.toString());
    setEditCategory(product.category || 'Men');
    setEditStock(product.stock !== undefined ? product.stock.toString() : '0');
    setEditDescription(product.description || '');
    setEditImage(product.image);
    try {
      const gallery = product.gallery ? JSON.parse(product.gallery) : [];
      setEditExtraImages(gallery);
    } catch (e) { setEditExtraImages([]); }
    setIsEditModalOpen(true);
  };

  const handleUpdateProduct = async (e: any) => {
    e.preventDefault();
    if (!editingProductId) return;
    setIsUpdating(true);
    const cleanGallery = editExtraImages.filter(url => url.trim() !== '');

    try {
      const res = await fetch(`${API_URL}/api/update-product`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingProductId, name: editTitle, price: Number(editPrice), description: editDescription, image: editImage, category: editCategory, stock: Number(editStock), gallery: cleanGallery })
      });
      const data = await res.json();
      if (data.success) {
        alert("✅ Product Updated Successfully!");
        setIsEditModalOpen(false); 
        fetchProducts(); 
      } else { alert(`❌ Update failed: ${data.error}`); }
    } catch (err) { alert("Network Error!"); }
    setIsUpdating(false);
  };
  
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    let trackingUrl = trackingLinks[orderId] || "";
    if (newStatus === 'shipped' && !trackingUrl) {
      const askLink = prompt("📦 Shipped korte chaichen! Courier er Tracking Link (URL) thakle din, nahole faka rakhun:");
      if (askLink) trackingUrl = askLink;
    }

    try {
      const res = await fetch(`${API_URL}/api/admin/update-order`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: newStatus, trackingUrl })
      });
      const data = await res.json();
      if (data.success) { 
        fetchOrders(); 
        if (newStatus === 'shipped' && trackingUrl) alert("✅ Customer-ke tracking link e-mail e pathano hoyeche!");
      } 
    } catch (err) { alert("Network Error!"); }
  };

  // --- 🔥 FILTER LOGIC ---
  const getFilteredOrders = () => {
    let filtered = [...orders];
    const now = new Date();
    
    if (dateFilter === '7days') {
      const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
      filtered = filtered.filter((o: any) => new Date(o.created_at) >= sevenDaysAgo);
    } else if (dateFilter === '30days') {
      const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
      filtered = filtered.filter((o: any) => new Date(o.created_at) >= thirtyDaysAgo);
    } else if (dateFilter === 'custom' && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter((o: any) => {
        const orderDate = new Date(o.created_at);
        return orderDate >= start && orderDate <= end;
      });
    }
    return filtered;
  };

  const currentOrders = getFilteredOrders();

  // --- 🔥 ANALYTICS (Update Logic) ---
  const deliveredOrders = currentOrders.filter((o: any) => o.status === 'delivered');
  
  // Revenue Ekhon Shudhu Delivered order theke asbe
  const totalRevenue = deliveredOrders.reduce((total, order: any) => {
    let amt = 0;
    if (order.cart_details) {
      try {
        const items = JSON.parse(order.cart_details);
        amt = items.reduce((acc: number, item: any) => acc + (item.price * (item.quantity || item.qty)), 0);
      } catch(e){}
    }
    return total + amt;
  }, 0);

  // Status Breakdown Count
  const statusCounts = {
    received: currentOrders.filter((o: any) => o.status === 'verified').length,
    processing: currentOrders.filter((o: any) => o.status === 'processing').length,
    shipped: currentOrders.filter((o: any) => o.status === 'shipped').length,
    delivered: deliveredOrders.length,
  };

  const lowStockProducts = products.filter((p: any) => p.stock !== undefined && p.stock < 5);

  const downloadExcel = () => {
    let csv = "Order ID,Date,Customer Name,Email,Phone,City,Order Amount,Status\n";
    
    currentOrders.forEach((order: any) => {
      let addr = { name: 'N/A', phone: 'N/A', city: 'N/A' };
      if (order.address_details) { try { addr = JSON.parse(order.address_details); } catch(e){} }
      
      let amount = 0;
      if (order.cart_details) {
        try {
          const items = JSON.parse(order.cart_details);
          amount = items.reduce((acc: number, item: any) => acc + (item.price * (item.quantity || item.qty)), 0);
        } catch(e){}
      }
      
      const date = new Date(order.created_at).toLocaleDateString();
      csv += `"#OR-${order.id}","${date}","${addr.name}","${order.email}","${addr.phone}","${addr.city}","Rs. ${amount}","${order.status}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `PerfectFume_Orders_${dateFilter}_${new Date().toLocaleDateString()}.csv`);
    a.click();
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'verified': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'processing': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'shipped': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case 'delivered': return 'bg-green-500/20 text-green-400 border-green-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };


  // --- SECURE LOGIN UI ---
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 font-sans text-white">
        <div className="bg-[#111] p-8 rounded-2xl border border-white/10 shadow-2xl w-full max-w-md animate-in zoom-in-95">
          <div className="text-center mb-6"><h2 className="text-2xl font-bold italic text-purple-400">CEO Control Panel</h2><p className="text-xs text-gray-500 mt-1">Level 4 Security Clearance Required</p></div>
          {loginStep === 1 ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <input type="email" required placeholder="Admin Email" className="w-full bg-black border border-white/10 rounded-lg py-3 px-4 outline-none focus:border-purple-500" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input type="password" required placeholder="Secret Master Key" className="w-full bg-black border border-white/10 rounded-lg py-3 px-4 outline-none focus:border-purple-500" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="submit" disabled={isProcessing} className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-lg font-bold shadow-lg transition-all">{isProcessing ? 'Verifying...' : 'Request Access'}</button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <p className="text-xs text-green-400 mb-4 bg-green-900/20 p-2 rounded-lg border border-green-500/20 text-center">✅ OTP Sent to Admin Mail</p>
              <input type="number" required placeholder="Enter 4-Digit OTP" className="w-full bg-black border border-white/10 rounded-lg py-3 px-4 outline-none text-center tracking-[1em] font-bold text-xl focus:border-green-500" value={otp} onChange={(e) => setOtp(e.target.value)} />
              <button type="submit" disabled={isProcessing} className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-lg font-bold shadow-lg transition-all">{isProcessing ? 'Unlocking...' : 'Verify & Enter'}</button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // --- DASHBOARD UI ---
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8 font-sans pb-24">
      <div className="max-w-6xl mx-auto mt-20 md:mt-24">
        
        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8 bg-white/5 p-1 rounded-xl border border-white/10 w-fit overflow-x-auto">
          <button onClick={() => setActiveTab('dashboard')} className={`px-6 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${activeTab === 'dashboard' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}>Dashboard</button>
          <button onClick={() => setActiveTab('products')} className={`px-6 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${activeTab === 'products' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}>Products</button>
          <button onClick={() => { setActiveTab('orders'); fetchOrders(); }} className={`px-6 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${activeTab === 'orders' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}>Orders</button>
        </div>

        {/* 🔥 DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Filter Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
              <h2 className="text-2xl font-bold italic text-white flex items-center gap-2"><Filter className="w-5 h-5 text-purple-400"/> Filter Analytics</h2>
              
              <div className="flex flex-wrap items-center gap-3">
                <select 
                  value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}
                  className="bg-black border border-white/20 rounded-lg px-4 py-2 text-sm outline-none focus:border-purple-500"
                >
                  <option value="all">All Time</option>
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                  <option value="custom">Custom Date</option>
                </select>

                {dateFilter === 'custom' && (
                  <div className="flex items-center gap-2">
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-black border border-white/20 rounded-lg px-3 py-1.5 text-sm outline-none [color-scheme:dark]" />
                    <span className="text-gray-500">to</span>
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-black border border-white/20 rounded-lg px-3 py-1.5 text-sm outline-none [color-scheme:dark]" />
                  </div>
                )}
              </div>
            </div>

            {/* Main Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-purple-900/50 to-black p-6 rounded-2xl border border-purple-500/30 shadow-lg shadow-purple-900/20">
                <div className="flex justify-between items-center mb-4"><h3 className="text-gray-300 font-bold">Delivered Revenue</h3><TrendingUp className="text-purple-400" /></div>
                <p className="text-4xl font-bold text-white">₹{totalRevenue}</p>
                <p className="text-xs text-purple-300 mt-2">Earned from {statusCounts.delivered} completed orders</p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-900/50 to-black p-6 rounded-2xl border border-blue-500/30 shadow-lg shadow-blue-900/20">
                <div className="flex justify-between items-center mb-4"><h3 className="text-gray-300 font-bold">Total Orders</h3><Package className="text-blue-400" /></div>
                <p className="text-4xl font-bold text-white">{currentOrders.length}</p>
                <p className="text-xs text-blue-300 mt-2">In selected time period</p>
              </div>

              <div className="bg-gradient-to-br from-green-900/50 to-black p-6 rounded-2xl border border-green-500/30 shadow-lg shadow-green-900/20 flex flex-col justify-center items-center cursor-pointer hover:scale-105 transition-transform" onClick={downloadExcel}>
                <Users className="text-green-400 w-8 h-8 mb-2" />
                <h3 className="text-white font-bold text-center">Export {currentOrders.length} Customers</h3>
                <p className="text-xs text-green-400 mt-1">Download filtered CSV</p>
              </div>
            </div>

            {/* 🔥 Status Breakdown Cards */}
            <h3 className="text-lg font-bold italic mt-8 mb-4 text-gray-300">Order Status Breakdown</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-black p-4 rounded-xl border border-yellow-500/30 flex items-center gap-4">
                <div className="bg-yellow-500/20 p-3 rounded-lg"><Inbox className="text-yellow-500 w-6 h-6"/></div>
                <div><p className="text-gray-400 text-sm">Received</p><p className="text-2xl font-bold">{statusCounts.received}</p></div>
              </div>
              <div className="bg-black p-4 rounded-xl border border-blue-500/30 flex items-center gap-4">
                <div className="bg-blue-500/20 p-3 rounded-lg"><Clock className="text-blue-500 w-6 h-6"/></div>
                <div><p className="text-gray-400 text-sm">Processing</p><p className="text-2xl font-bold">{statusCounts.processing}</p></div>
              </div>
              <div className="bg-black p-4 rounded-xl border border-purple-500/30 flex items-center gap-4">
                <div className="bg-purple-500/20 p-3 rounded-lg"><Truck className="text-purple-500 w-6 h-6"/></div>
                <div><p className="text-gray-400 text-sm">Shipped</p><p className="text-2xl font-bold">{statusCounts.shipped}</p></div>
              </div>
              <div className="bg-black p-4 rounded-xl border border-green-500/30 flex items-center gap-4">
                <div className="bg-green-500/20 p-3 rounded-lg"><CheckCircle className="text-green-500 w-6 h-6"/></div>
                <div><p className="text-gray-400 text-sm">Delivered</p><p className="text-2xl font-bold">{statusCounts.delivered}</p></div>
              </div>
            </div>

            {/* Low Stock Alert */}
            {lowStockProducts.length > 0 && (
              <div className="mt-8 bg-red-900/20 border border-red-500/30 p-6 rounded-2xl">
                <h3 className="text-xl font-bold text-red-400 flex items-center gap-2 mb-4"><AlertTriangle /> Low Stock Alerts</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {lowStockProducts.map((p: any) => (
                    <div key={p.id} className="flex justify-between items-center bg-black/50 p-4 rounded-lg border border-red-500/20">
                      <div className="flex items-center gap-3"><img src={p.image} className="w-10 h-10 rounded object-cover" /> <p className="font-bold">{p.name}</p></div>
                      <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">Only {p.stock} left</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-300">
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 h-fit">
              <h2 className="text-2xl font-bold mb-6 italic text-purple-400">Add Perfume</h2>
              <form onSubmit={handleAddProduct} className="space-y-4 text-sm">
                <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 outline-none" />
                <div className="grid grid-cols-3 gap-4">
                  <input type="number" placeholder="Price (₹)" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 outline-none" />
                  <input type="number" placeholder="Stock (Qty)" value={stock} onChange={(e) => setStock(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 outline-none" />
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 outline-none text-gray-300 md:bg-gray-900">
                    <option value="Men">Men</option><option value="Women">Women</option><option value="Unisex">Unisex</option>
                  </select>
                </div>
                <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 h-20 outline-none" />
                                {/* 🔥 NOTUN: Image & Gallery Upload Section */}
                <div className="space-y-3 bg-black/30 p-3 rounded-lg border border-white/5">
                  <input type="text" required placeholder="Main Image URL *" value={image} onChange={(e) => setImage(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 outline-none focus:border-purple-500" />
                  
                  {/* Dynamic Extra Images */}
                  {extraImages.map((imgUrl, index) => (
                    <div key={index} className="flex gap-2 animate-in fade-in zoom-in-95 duration-200">
                      <input 
                        type="text" placeholder={`Extra Image URL ${index + 1}`} 
                        value={imgUrl} 
                        onChange={(e) => {
                          const newImgs = [...extraImages];
                          newImgs[index] = e.target.value;
                          setExtraImages(newImgs);
                        }} 
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 outline-none text-gray-300" 
                      />
                      <button type="button" onClick={() => setExtraImages(extraImages.filter((_, i) => i !== index))} className="bg-red-500/20 text-red-400 px-3 rounded-lg hover:bg-red-500 hover:text-white transition-all font-bold">✕</button>
                    </div>
                  ))}
                  
                  <button type="button" onClick={() => setExtraImages([...extraImages, ''])} className="text-sm text-purple-400 font-bold hover:text-purple-300 transition-all flex items-center gap-1">
                    + Add More Pictures
                  </button>
                </div>
                
                <button type="submit" disabled={isUploading} className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-lg font-bold transition-all">{isUploading ? 'Uploading...' : 'Upload Product'}</button>
              </form>
            </div>

            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 h-fit">
              <h2 className="text-2xl font-bold mb-6 italic text-gray-300">Manage Store</h2>
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 no-scrollbar">
                {products.map((p: any) => (
                  <div key={p.id} className="flex items-center gap-4 bg-black/40 p-3 rounded-xl border border-white/5 group relative overflow-hidden">
                    <img src={p.image} className="w-12 h-12 object-cover rounded-lg" />
                    <div className="flex-1">
                      <h4 className="text-sm font-bold truncate">{p.name}</h4>
                      <div className="flex gap-2 items-center mt-1">
                        <p className="text-xs text-purple-400">₹{p.price}</p><span className="text-gray-600 text-xs">•</span>
                        {p.stock !== undefined && p.stock < 5 ? (<p className="text-[10px] bg-red-600/20 text-red-400 px-2 py-0.5 rounded-full border border-red-500/50 animate-pulse font-bold">Low Stock: {p.stock} left</p>) : (<p className="text-[10px] text-gray-400">Stock: {p.stock || 10}</p>)}
                      </div>
                    </div>
                                        {/* EDIT & DELETE BUTTONS */}
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button onClick={() => openEditModal(p)} className="bg-blue-600/20 text-blue-400 p-2 rounded-lg hover:bg-blue-600 hover:text-white transition-all text-xs font-bold flex items-center gap-1">
                        <Pencil className="w-3 h-3" /> Edit
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="bg-red-600/20 text-red-400 p-2 rounded-lg hover:bg-red-600 hover:text-white transition-all text-xs font-bold">Delete</button>
                    </div>
                    
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 animate-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold mb-6 italic text-purple-400">Customer Orders</h2>
            
            {/* Ekhaneo ekta mini alert dekhacchi filter kora thakle */}
            {dateFilter !== 'all' && (
              <p className="mb-4 text-sm text-gray-400">Showing filtered results. Go to Dashboard to change date range.</p>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-gray-400 border-b border-white/10">
                    <th className="pb-4 font-medium">Order ID</th>
                    <th className="pb-4 font-medium">Customer Email</th>
                    <th className="pb-4 font-medium">Date & Time</th>
                    <th className="pb-4 font-medium">Action / Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {currentOrders.map((order: any) => (
                    <tr key={order.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 text-purple-400 font-mono font-bold">#OR-{order.id}</td>
                      <td className="py-4">{order.email}</td>
                      <td className="py-4 text-gray-400">{new Date(order.created_at).toLocaleString()}</td>
                      <td className="py-4">
                        <select 
                          value={order.status} 
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className={`px-3 py-1.5 rounded-lg border outline-none text-xs font-bold uppercase tracking-wider cursor-pointer appearance-none ${getStatusColor(order.status)}`}
                        >
                          <option value="verified" className="bg-gray-900 text-yellow-400">Received</option>
                          <option value="processing" className="bg-gray-900 text-blue-400">Processing</option>
                          <option value="shipped" className="bg-gray-900 text-purple-400">Shipped</option>
                          <option value="delivered" className="bg-gray-900 text-green-400">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {currentOrders.length === 0 && <p className="text-center text-gray-500 py-10">Kono order nei ei somoyer modhye.</p>}
            </div>
          </div>
        )}
      </div>
    </div>
          {/* EDIT PRODUCT POPUP MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-center items-center px-4 overflow-y-auto py-10">
          <div className="bg-[#111] w-full max-w-2xl rounded-2xl border border-white/10 p-6 relative shadow-2xl animate-in zoom-in-95 duration-200 text-white max-h-[85vh] flex flex-col">
            <button onClick={() => setIsEditModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white bg-white/5 p-2 rounded-full"><X className="w-4 h-4" /></button>
            <div className="text-center mb-6"><Pencil className="w-10 h-10 text-blue-500 mx-auto mb-2 bg-blue-500/10 p-2 rounded-full" /><h2 className="text-2xl font-bold italic text-blue-400">Edit Product</h2></div>
            
            <form onSubmit={handleUpdateProduct} className="space-y-4 text-sm flex-1 overflow-y-auto pr-3 no-scrollbar">
              <input type="text" placeholder="Title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 outline-none focus:border-blue-500" />
              <div className="grid grid-cols-3 gap-4">
                <input type="number" placeholder="Price (₹)" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 outline-none focus:border-blue-500" />
                <input type="number" placeholder="Stock (Qty)" value={editStock} onChange={(e) => setEditStock(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 outline-none focus:border-blue-500" />
                <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 outline-none text-gray-300 md:bg-gray-900">
                  <option value="Men">Men</option><option value="Women">Women</option><option value="Unisex">Unisex</option>
                </select>
              </div>
              <textarea placeholder="Description" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 h-32 outline-none focus:border-blue-500" />
              
              <div className="space-y-3 bg-black/30 p-3 rounded-lg border border-white/5">
                <input type="text" placeholder="Main Image URL *" value={editImage} onChange={(e) => setEditImage(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 outline-none focus:border-blue-500" />
                <p className="text-xs text-gray-400 mt-2">Gallery Images (Optional)</p>
                {editExtraImages.map((imgUrl, index) => (
                  <div key={index} className="flex gap-2">
                    <input type="text" placeholder={`Extra Image URL ${index + 1}`} value={imgUrl} onChange={(e) => { const newImgs = [...editExtraImages]; newImgs[index] = e.target.value; setEditExtraImages(newImgs); }} className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 outline-none text-gray-300 focus:border-blue-500" />
                    <button type="button" onClick={() => setEditExtraImages(editExtraImages.filter((_, i) => i !== index))} className="bg-red-500/20 text-red-400 px-3 rounded-lg hover:bg-red-500 hover:text-white transition-all font-bold">✕</button>
                  </div>
                ))}
                <button type="button" onClick={() => setEditExtraImages([...editExtraImages, ''])} className="text-sm text-blue-400 font-bold hover:text-blue-300 transition-all">+ Add More Pictures</button>
              </div>

              <div className="flex gap-4 mt-6 pt-4 border-t border-white/10">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="w-full bg-white/5 hover:bg-white/10 py-3 rounded-lg font-bold transition-all">Cancel</button>
                <button type="submit" disabled={isUpdating} className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-bold transition-all shadow-lg shadow-blue-900/30">{isUpdating ? 'Saving...' : 'Save Changes'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
  );
};

export default AdminPanel;
