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
  
  // 🔥 ADD PRODUCT STATES
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Men');
  const [stock, setStock] = useState(''); 
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [extraImages, setExtraImages] = useState<string[]>([]);
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

  // 🔥 SEARCH & IMAGE UPLOAD STATES
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [isImageUploading, setIsImageUploading] = useState(false);

  // 🔥 BANNER STATES
  const [banners, setBanners] = useState<string[]>(['']);
  const [isSavingBanners, setIsSavingBanners] = useState(false);

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [orderFilter, setOrderFilter] = useState('all');
  const [isExporting, setIsExporting] = useState(false);
  
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
      if (res.ok) { setLoginStep(2); alert(`✅ OTP sent to ${ADMIN_EMAIL}`); }
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
        fetchDashboardData();
      } else { alert("⚠️ Vul OTP!"); }
    } catch (err) { alert("Network Error!"); }
    setIsProcessing(false);
  };

  // --- FETCH DATA ---
  const fetchDashboardData = () => {
    fetch(`${API_URL}/api/catalog`).then(res => res.json()).then(data => setProducts(data));
    fetch(`${API_URL}/api/admin/orders`).then(res => res.json()).then(data => setOrders(data));
    fetch(`${API_URL}/api/admin/users`).then(res => res.json()).then(data => setUsers(data));
  };

  // Fetch Banners on load
  useEffect(() => {
    if (isAuthorized) {
      fetch(`${API_URL}/api/banners`).then(res => res.json()).then(data => {
        if(data && data.length > 0) setBanners(data);
      });
    }
  }, [isAuthorized]);

  const handleSaveBanners = async () => {
    setIsSavingBanners(true);
    const cleanBanners = banners.filter(url => url.trim() !== '');
    try {
      const res = await fetch(`${API_URL}/api/admin/update-banners`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanBanners)
      });
      const data = await res.json();
      if(data.success) alert("✅ Banners Updated Successfully!");
    } catch(e) { alert("Error saving banners"); }
    setIsSavingBanners(false);
  };

  // --- DIRECT IMAGE UPLOAD LOGIC ---
  const handleImageUpload = async (e: any, setUrlFunction: any) => {
      const file = e.target.files[0];
      if (!file) return;
      setIsImageUploading(true);
      const formData = new FormData();
      formData.append('image', file);
      
      try {
          // 🔥 Ekhane Tomar ImgBB API Key Boshabe 🔥
          const apiKey = 'YOUR_IMGBB_API_KEY'; 
          const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
              method: 'POST',
              body: formData
          });
          const data = await res.json();
          if(data.success) {
              setUrlFunction(data.data.url); // Automatic link boshe jabe
          } else {
              alert("Upload failed!");
          }
      } catch (err) {
          alert("Network error during upload");
      }
      setIsImageUploading(false);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    
    const cleanExtraImages = extraImages.filter(url => url.trim() !== '');
    
    try {
      const res = await fetch(`${API_URL}/api/add-product`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: title, price: Number(price), description, image, category, stock: Number(stock), gallery: cleanExtraImages })
      });
      if ((await res.json()).success) {
        alert("✅ Product Added!");
        setTitle(''); setPrice(''); setDescription(''); setImage(''); setCategory('Men'); setStock(''); setExtraImages([]);
        fetchDashboardData();
      }
    } catch (err) { alert("Error adding product"); }
    setIsUploading(false);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await fetch(`${API_URL}/api/delete-product`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
      fetchDashboardData();
    } catch (err) { alert("Error deleting product"); }
  };

  const openEditModal = (product: any) => {
    setEditingProductId(product.id);
    setEditTitle(product.name);
    setEditPrice(product.price);
    setEditCategory(product.category || 'Men');
    setEditStock(product.stock || '');
    setEditDescription(product.description || '');
    setEditImage(product.image);
    
    let parsedGallery = [];
    try { parsedGallery = typeof product.gallery === 'string' ? JSON.parse(product.gallery) : product.gallery || []; } catch(e) {}
    setEditExtraImages(parsedGallery);
    
    setIsEditModalOpen(true);
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    const cleanExtraImages = editExtraImages.filter(url => url.trim() !== '');
    try {
      const res = await fetch(`${API_URL}/api/update-product`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingProductId, name: editTitle, price: Number(editPrice), description: editDescription, image: editImage, category: editCategory, stock: Number(editStock), gallery: cleanExtraImages })
      });
      if ((await res.json()).success) {
        alert("✅ Product Updated!");
        setIsEditModalOpen(false);
        fetchDashboardData();
      }
    } catch (err) { alert("Error updating product"); }
    setIsUpdating(false);
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await fetch(`${API_URL}/api/admin/update-order`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: orderId, status }) });
      fetchDashboardData();
    } catch (err) { alert("Error updating status"); }
  };

  const downloadCSV = (data: any[], filename: string) => {
    setIsExporting(true);
    const csvRows = [];
    const headers = Object.keys(data[0] || {});
    csvRows.push(headers.join(','));

    for (const row of data) {
      const values = headers.map(header => {
        const val = row[header] ? row[header].toString() : '';
        return `"${val.replace(/"/g, '""')}"`;
      });
      csvRows.push(values.join(','));
    }

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setIsExporting(false);
  };

  const currentOrders = orderFilter === 'all' ? orders : orders.filter((o: any) => o.status === orderFilter);

  // Stats Calcs
  const totalRevenue = orders.filter((o:any) => o.status === 'delivered' || o.status === 'paid').reduce((sum, o:any) => sum + (o.totalAmount || 0), 0);
  const pendingCount = orders.filter((o:any) => o.status === 'verified').length;
  const processingCount = orders.filter((o:any) => o.status === 'processing').length;
  const shippedCount = orders.filter((o:any) => o.status === 'shipped').length;
  
  const lowStockProducts = products.filter((p: any) => p.stock !== undefined && p.stock < 5);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4 font-sans text-white">
        <div className="bg-[#111] p-8 rounded-2xl border border-white/10 w-full max-w-md shadow-2xl">
          <div className="flex justify-center mb-6"><div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center"><Lock className="w-8 h-8 text-white"/></div></div>
          <h2 className="text-2xl font-bold text-center mb-6 italic">Master Admin Panel</h2>
          
          {loginStep === 1 ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <input type="email" required placeholder="Admin Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-black border border-white/10 rounded-lg p-3 outline-none focus:border-purple-500" />
              <input type="password" required placeholder="Master Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-black border border-white/10 rounded-lg p-3 outline-none focus:border-purple-500" />
              <button type="submit" disabled={isProcessing} className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-lg font-bold transition-all">{isProcessing ? 'Verifying...' : 'Request Access'}</button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <input type="number" required placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full bg-black border border-white/10 rounded-lg p-3 outline-none text-center tracking-widest font-bold text-xl focus:border-green-500" />
              <button type="submit" disabled={isProcessing} className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-lg font-bold transition-all">Verify & Enter</button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-20 pb-20 font-sans">
      <main className="max-w-6xl mx-auto px-4">
        
        <div className="flex flex-wrap gap-2 mb-8 bg-white/5 p-1 rounded-xl w-fit">
          <button onClick={() => setActiveTab('dashboard')} className={`px-4 py-2 rounded-lg text-sm font-bold ${activeTab === 'dashboard' ? 'bg-purple-600' : 'hover:bg-white/10'}`}>Overview</button>
          <button onClick={() => setActiveTab('products')} className={`px-4 py-2 rounded-lg text-sm font-bold ${activeTab === 'products' ? 'bg-purple-600' : 'hover:bg-white/10'}`}>Products</button>
          <button onClick={() => setActiveTab('orders')} className={`px-4 py-2 rounded-lg text-sm font-bold ${activeTab === 'orders' ? 'bg-purple-600' : 'hover:bg-white/10 flex gap-2'}`}>Orders {pendingCount > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{pendingCount}</span>}</button>
        </div>

        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/5 p-5 rounded-2xl border border-white/10"><TrendingUp className="w-6 h-6 text-green-400 mb-2"/><p className="text-gray-400 text-sm">Revenue (Paid)</p><h3 className="text-2xl font-bold text-green-400">₹{totalRevenue}</h3></div>
              <div className="bg-white/5 p-5 rounded-2xl border border-white/10"><Package className="w-6 h-6 text-purple-400 mb-2"/><p className="text-gray-400 text-sm">Total Orders</p><h3 className="text-2xl font-bold">{orders.length}</h3></div>
              <div className="bg-white/5 p-5 rounded-2xl border border-white/10"><Users className="w-6 h-6 text-blue-400 mb-2"/><p className="text-gray-400 text-sm">Customers</p><h3 className="text-2xl font-bold">{users.length}</h3></div>
              <div className="bg-white/5 p-5 rounded-2xl border border-white/10"><Calendar className="w-6 h-6 text-yellow-400 mb-2"/><p className="text-gray-400 text-sm">Live Products</p><h3 className="text-2xl font-bold">{products.length}</h3></div>
            </div>

            {/* Status Breakdown Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
               <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-xl flex items-center justify-between">
                  <div><p className="text-xs text-orange-400 font-bold uppercase">Pending Check</p><p className="text-2xl font-black text-orange-400">{pendingCount}</p></div>
                  <Inbox className="w-8 h-8 text-orange-400 opacity-50"/>
               </div>
               <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl flex items-center justify-between">
                  <div><p className="text-xs text-blue-400 font-bold uppercase">Processing</p><p className="text-2xl font-black text-blue-400">{processingCount}</p></div>
                  <Clock className="w-8 h-8 text-blue-400 opacity-50"/>
               </div>
               <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-xl flex items-center justify-between">
                  <div><p className="text-xs text-purple-400 font-bold uppercase">Shipped</p><p className="text-2xl font-black text-purple-400">{shippedCount}</p></div>
                  <Truck className="w-8 h-8 text-purple-400 opacity-50"/>
               </div>
            </div>

            {/* 🔥 BANNER UPLOAD & DELETE SECTION 🔥 */}
            <div className="mt-8 bg-white/5 p-6 rounded-2xl border border-white/10">
              <h3 className="text-xl font-bold italic mb-4 text-purple-400">Home Page Banners (16:9 Ratio)</h3>
              <p className="text-xs text-gray-400 mb-4">Banner link paste koro ba delete korte pasher (✕) button use koro ebong Save koro.</p>
              
              <div className="space-y-3">
                {banners.map((url, index) => (
                  <div key={index} className="flex gap-2 animate-in fade-in zoom-in-95 duration-200">
                    <input 
                      type="text" placeholder={`Banner URL ${index + 1}`} 
                      value={url} onChange={(e) => { const newBanners = [...banners]; newBanners[index] = e.target.value; setBanners(newBanners); }} 
                      className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm outline-none focus:border-purple-500" 
                    />
                    <button 
                      onClick={() => setBanners(banners.filter((_, i) => i !== index))} 
                      className="bg-red-500/20 text-red-400 px-4 rounded-lg hover:bg-red-500 hover:text-white transition-all font-bold"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-4 mt-4">
                <button onClick={() => setBanners([...banners, ''])} className="text-sm text-purple-400 font-bold hover:text-white transition-all">+ Add More Banner</button>
                <button onClick={handleSaveBanners} disabled={isSavingBanners} className="ml-auto bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-xl transition-all shadow-lg shadow-purple-900/30">
                  {isSavingBanners ? 'Saving...' : '💾 Save Banners'}
                </button>
              </div>
            </div>

            {/* Low Stock Alert */}
            {lowStockProducts.length > 0 && (
              <div className="bg-red-900/20 border border-red-500/30 p-6 rounded-2xl mt-8">
                <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2"><AlertTriangle className="w-5 h-5"/> Low Stock Warning</h3>
                <div className="space-y-2">
                  {lowStockProducts.map((p: any) => (
                    <div key={p.id} className="flex justify-between items-center bg-black/50 p-3 rounded-lg border border-red-500/10">
                      <p className="text-sm">{p.name}</p>
                      <span className="text-xs font-bold text-red-400 bg-red-500/10 px-2 py-1 rounded">Only {p.stock} left</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4 mt-8">
              <button onClick={() => downloadCSV(orders, 'orders.csv')} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 py-3 px-6 rounded-xl font-bold transition-all"><Download className="w-4 h-4"/> Export Orders</button>
              <button onClick={() => downloadCSV(users, 'customers.csv')} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 py-3 px-6 rounded-xl font-bold transition-all"><Download className="w-4 h-4"/> Export Actual Customers</button>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1 bg-white/5 p-6 rounded-2xl border border-white/10 h-fit">
              <h2 className="text-xl font-bold mb-6 italic text-gray-300">Add New Product</h2>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <input type="text" required placeholder="Product Title *" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 outline-none text-white focus:border-blue-500" />
                <div className="flex gap-4">
                  <input type="number" required placeholder="Price (₹) *" value={price} onChange={(e) => setPrice(e.target.value)} className="w-1/2 bg-white/5 border border-white/10 rounded-lg p-3 outline-none text-white focus:border-blue-500" />
                  <input type="number" required placeholder="Stock Qty *" value={stock} onChange={(e) => setStock(e.target.value)} className="w-1/2 bg-white/5 border border-white/10 rounded-lg p-3 outline-none text-white focus:border-blue-500" />
                </div>
                
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg p-3 outline-none text-white focus:border-blue-500">
                   <option value="Men">Men</option>
                   <option value="Women">Women</option>
                   <option value="Unisex">Unisex</option>
                   <option value="Luxury">Luxury</option>
                   <option value="Travel Size">Travel Size</option>
                </select>
                
                {/* 🔥 IMAGE UPLOAD FORM 🔥 */}
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
                    <input type="text" required placeholder="Main Image URL *" value={image} onChange={(e) => setImage(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 outline-none focus:border-purple-500" />
                    <span className="text-gray-500 text-xs hidden md:block">OR</span>
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setImage)} className="text-xs w-full md:w-64 text-gray-400 file:mr-2 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-purple-600 file:text-white cursor-pointer" />
                  </div>
                  {isImageUploading && <p className="text-xs text-purple-400 font-bold animate-pulse">Uploading image to server, please wait...</p>}
                </div>

                <div className="space-y-2 border-t border-white/10 pt-4 mt-4">
                  <p className="text-xs text-gray-400">Gallery Images (Optional)</p>
                  {extraImages.map((imgUrl, index) => (
                    <div key={index} className="flex gap-2">
                      <input type="text" placeholder={`Extra Image URL ${index + 1}`} value={imgUrl} onChange={(e) => { const newImgs = [...extraImages]; newImgs[index] = e.target.value; setExtraImages(newImgs); }} className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 outline-none text-gray-300 focus:border-blue-500" />
                      <button type="button" onClick={() => setExtraImages(extraImages.filter((_, i) => i !== index))} className="bg-red-500/20 text-red-400 px-3 rounded-lg hover:bg-red-500 hover:text-white transition-all font-bold">✕</button>
                    </div>
                  ))}
                  <button type="button" onClick={() => setExtraImages([...extraImages, ''])} className="text-sm text-blue-400 font-bold hover:text-blue-300 transition-all">+ Add More Pictures</button>
                </div>

                <textarea required placeholder="Product Description *" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 outline-none text-white focus:border-blue-500 h-24" />
                <button type="submit" disabled={isUploading} className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-bold transition-all">{isUploading ? 'Adding...' : 'Publish Product'}</button>
              </form>
            </div>
            
            <div className="md:col-span-2">
              <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold italic text-gray-300">Manage Store</h2>
                <input type="text" placeholder="🔍 Search product..." value={productSearch} onChange={(e) => setProductSearch(e.target.value)} className="w-full md:w-1/2 bg-black border border-white/10 rounded-lg p-2 text-sm outline-none focus:border-purple-500" />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {products.filter((p: any) => p.name.toLowerCase().includes(productSearch.toLowerCase())).map((product: any) => (
                  <div key={product.id} className="bg-white/5 rounded-xl p-3 border border-white/10 relative group">
                    <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded-lg mb-3" />
                    <div className="absolute top-4 right-4 bg-black/80 px-2 py-0.5 rounded text-[10px] font-bold">Stock: {product.stock || 0}</div>
                    <h3 className="font-bold text-sm truncate">{product.name}</h3>
                    <p className="text-blue-400 font-bold mt-1">₹{product.price}</p>
                    
                    <div className="flex gap-2 mt-3">
                       <button onClick={() => openEditModal(product)} className="flex-1 bg-white/10 hover:bg-white/20 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1"><Pencil className="w-3 h-3"/> Edit</button>
                       <button onClick={() => handleDeleteProduct(product.id)} className="bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white p-1.5 rounded-lg transition-all"><X className="w-4 h-4"/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold italic text-purple-400">Customer Orders</h2>
                <input type="text" placeholder="🔍 Search by Order ID or Email..." value={orderSearch} onChange={(e) => setOrderSearch(e.target.value)} className="w-full md:w-1/3 bg-black border border-white/10 rounded-lg p-2 text-sm outline-none focus:border-purple-500" />
            </div>
            
            <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
              {['all', 'verified', 'processing', 'shipped', 'delivered', 'paid', 'cancelled'].map(filter => (
                <button key={filter} onClick={() => setOrderFilter(filter)} className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize whitespace-nowrap ${orderFilter === filter ? 'bg-purple-600' : 'bg-[#111] border border-white/10 hover:bg-white/10'}`}>
                  {filter}
                </button>
              ))}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="text-gray-400 border-b border-white/10">
                    <th className="pb-3">Order ID</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Items</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {currentOrders.filter((o: any) => o.email.toLowerCase().includes(orderSearch.toLowerCase()) || o.id.toString().includes(orderSearch)).map((order: any) => {
                    const items = order.cart_details ? JSON.parse(order.cart_details) : [];
                    let statusColor = 'text-gray-400 bg-gray-500/10';
                    if (order.status === 'verified') statusColor = 'text-orange-400 bg-orange-500/10';
                    if (order.status === 'paid') statusColor = 'text-green-400 bg-green-500/10';
                    if (order.status === 'shipped') statusColor = 'text-purple-400 bg-purple-500/10';
                    if (order.status === 'delivered') statusColor = 'text-blue-400 bg-blue-500/10';
                    if (order.status === 'cancelled') statusColor = 'text-red-400 bg-red-500/10';

                    return (
                      <tr key={order.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-4 font-mono">#OR-{order.id}</td>
                        <td className="py-4"><p className="font-bold">{order.email}</p></td>
                        <td className="py-4 text-xs text-gray-400">{items.map((i:any)=>`${i.name} (x${i.qty || i.quantity})`).join(', ')}</td>
                        <td className="py-4 font-bold">₹{order.totalAmount || 0}</td>
                        <td className="py-4"><span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${statusColor}`}>{order.status}</span></td>
                        <td className="py-4">
                          <select 
                            value={order.status} 
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                            className="bg-black border border-white/10 rounded-lg px-2 py-1 outline-none text-xs"
                          >
                            <option value="verified">Verified (Pending)</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* 🔥 EDIT PRODUCT MODAL 🔥 */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold italic text-white">Edit Product</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-white"><X className="w-6 h-6"/></button>
            </div>
            
            <form onSubmit={handleUpdateProduct} className="space-y-4">
              <input type="text" required placeholder="Product Title *" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 outline-none text-white focus:border-blue-500" />
              <div className="flex gap-4">
                <input type="number" required placeholder="Price (₹) *" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} className="w-1/2 bg-white/5 border border-white/10 rounded-lg p-3 outline-none text-white focus:border-blue-500" />
                <input type="number" required placeholder="Stock Qty *" value={editStock} onChange={(e) => setEditStock(e.target.value)} className="w-1/2 bg-white/5 border border-white/10 rounded-lg p-3 outline-none text-white focus:border-blue-500" />
              </div>
              
              <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg p-3 outline-none text-white focus:border-blue-500">
                 <option value="Men">Men</option>
                 <option value="Women">Women</option>
                 <option value="Unisex">Unisex</option>
                 <option value="Luxury">Luxury</option>
                 <option value="Travel Size">Travel Size</option>
              </select>
              
              <div className="flex flex-col gap-2">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
                  <input type="text" required placeholder="Main Image URL *" value={editImage} onChange={(e) => setEditImage(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 outline-none focus:border-purple-500" />
                  <span className="text-gray-500 text-xs hidden md:block">OR</span>
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setEditImage)} className="text-xs w-full md:w-64 text-gray-400 file:mr-2 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-purple-600 file:text-white cursor-pointer" />
                </div>
                {isImageUploading && <p className="text-xs text-purple-400 font-bold animate-pulse">Uploading image to server, please wait...</p>}
              </div>
              
              <textarea required placeholder="Product Description *" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 outline-none text-white focus:border-blue-500 h-24" />
              
              <div className="space-y-2 border-t border-white/10 pt-4">
                <p className="text-xs text-gray-400">Gallery Images</p>
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
                <button type="submit" disabled={isUpdating} className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-bold transition-all">{isUpdating ? 'Saving...' : 'Save Changes'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPanel;
