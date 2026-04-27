import React, { useState, useEffect } from 'react';

const AdminPanel = () => {
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState('products'); 
  
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Men');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  
  const ADMIN_SECRET = "Himanshu@2026"; 
  const API_URL = import.meta.env.VITE_API_URL || "https://perfect-fume-backend.perfectfumeofficial.workers.dev";

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_SECRET) {
      setIsAuthorized(true);
      fetchProducts();
      fetchOrders();
    } else {
      alert("Vul Password!");
    }
  };

  const fetchProducts = async () => {
    const res = await fetch(`${API_URL}/api/catalog`);
    const data = await res.json();
    setProducts(data);
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/orders`);
      const data = await res.json();
      setOrders(data);
    } catch (err) { console.error("Order load hoyni"); }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    const res = await fetch(`${API_URL}/api/add-product`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: title, price: Number(price), description, image, category })
    });
    const data = await res.json();
    if (data.success) {
      alert("✅ Uploaded!");
      setTitle(''); setPrice(''); setDescription(''); setImage('');
      fetchProducts();
    }
    setIsUploading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Sotti Delete korben?")) return;
    const res = await fetch(`${API_URL}/api/delete-product`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    if (res.ok) fetchProducts();
  };

  // 🔥 NOTUN: Order Status Change korar logic
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/update-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        fetchOrders(); // List update hobe
      } else {
        alert("Status update fail koreche!");
      }
    } catch (err) {
      alert("Network Error!");
    }
  };

  // Status onujayi rong change korar helper function
  const getStatusColor = (status) => {
    switch(status) {
      case 'verified': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'processing': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'shipped': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case 'delivered': return 'bg-green-500/20 text-green-400 border-green-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 font-sans text-white">
        <div className="bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-xl w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Admin Access</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="password" placeholder="Secret Key" className="w-full bg-white/10 border border-white/10 rounded-lg py-3 px-4 outline-none" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit" className="w-full bg-purple-600 py-3 rounded-lg font-bold">Login</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8 pt-24 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8 bg-white/5 p-1 rounded-xl border border-white/10 w-fit">
          <button onClick={() => setActiveTab('products')} className={`px-6 py-2 rounded-lg font-medium transition-all ${activeTab === 'products' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}>Products</button>
          <button onClick={() => { setActiveTab('orders'); fetchOrders(); }} className={`px-6 py-2 rounded-lg font-medium transition-all ${activeTab === 'orders' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}>Orders</button>
        </div>

        {activeTab === 'products' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-300">
            {/* Add Product Form */}
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 h-fit">
              <h2 className="text-2xl font-bold mb-6 italic text-purple-400">Add Perfume</h2>
              <form onSubmit={handleAddProduct} className="space-y-4 text-sm">
                <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 outline-none" />
                <div className="grid grid-cols-2 gap-4">
                  <input type="number" placeholder="Price (₹)" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 outline-none" />
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 outline-none text-gray-300 md:bg-gray-900">
                    <option value="Men">Men</option><option value="Women">Women</option><option value="Unisex">Unisex</option>
                  </select>
                </div>
                <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 h-20 outline-none" />
                <input type="text" placeholder="Image URL" value={image} onChange={(e) => setImage(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 outline-none" />
                <button type="submit" disabled={isUploading} className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-lg font-bold transition-all">{isUploading ? 'Uploading...' : 'Upload Product'}</button>
              </form>
            </div>

            {/* Product List */}
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 h-fit">
              <h2 className="text-2xl font-bold mb-6 italic text-gray-300">Manage Store</h2>
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 no-scrollbar">
                {products.map(p => (
                  <div key={p.id} className="flex items-center gap-4 bg-black/40 p-3 rounded-xl border border-white/5 group">
                    <img src={p.image} className="w-12 h-12 object-cover rounded-lg" />
                    <div className="flex-1"><h4 className="text-sm font-bold truncate">{p.name}</h4><p className="text-xs text-purple-400">₹{p.price}</p></div>
                    <button onClick={() => handleDelete(p.id)} className="opacity-0 group-hover:opacity-100 bg-red-600/20 text-red-400 p-2 rounded-lg hover:bg-red-600 hover:text-white transition-all text-xs font-bold">Delete</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* 🔥 NOTUN: Order List Tab with Dropdown */
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 animate-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold mb-6 italic text-purple-400">Customer Orders</h2>
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
                  {orders.map((order) => (
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
              {orders.length === 0 && <p className="text-center text-gray-500 py-10">Ekhono kono order asheni.</p>}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminPanel;
