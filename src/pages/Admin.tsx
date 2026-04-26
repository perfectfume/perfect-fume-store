import React, { useState, useEffect } from 'react';

const AdminPanel = () => {
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  // Product States
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Men');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  // Product List rakhar jonno notun state
  const [products, setProducts] = useState([]);
  
  const ADMIN_SECRET = "Himanshu@2026"; 
  const API_URL = import.meta.env.VITE_API_URL || "https://perfect-fume-backend.perfectfumeofficial.workers.dev";

  // Login Handle
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_SECRET) {
      setIsAuthorized(true);
      fetchProducts(); // Login holei product list tene anbe
    } else {
      alert("Vul Password! Abar chesta korun.");
    }
  };

  // Sob Product Tene anar function
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/catalog`);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("List anate somossya hoyeche", error);
    }
  };

  // Upload Handle
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!title || !price || !image) return alert("Title, Price r Image Link dewa baddhotamulok!");
    setIsUploading(true);

    try {
      const res = await fetch(`${API_URL}/api/add-product`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: title, price: Number(price), description, image, category })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        alert("✅ Product Successfully Uploaded!");
        setTitle(''); setPrice(''); setDescription(''); setImage('');
        fetchProducts(); // Upload howar por list-ta update kore nibe automatic
      } else {
        alert("❌ Upload Failed!");
      }
    } catch (err) {
      alert("Network Error!");
    } finally {
      setIsUploading(false);
    }
  };

  // Delete Handle
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Apni ki sotti ei product-ta muche felte chan?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_URL}/api/delete-product`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id }) // Je product-e click porbe tar ID pathabe
      });
      const data = await res.json();

      if (res.ok && data.success) {
        fetchProducts(); // Delete korar por list theke soriye debe
      } else {
        alert("Delete kora gelo na.");
      }
    } catch (err) {
      alert("Network Error!");
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <div className="bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-xl w-full max-w-md">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Admin Access</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              placeholder="Enter Secret Key" 
              className="w-full bg-white/10 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition-all">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8 pt-24">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Side: Upload Form */}
        <div>
          <h2 className="text-3xl font-bold mb-6 italic text-purple-400">Add New Perfume</h2>
          <form onSubmit={handleAddProduct} className="space-y-4 bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Product Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-white/10 border border-white/10 rounded-lg py-2 px-4 focus:outline-none" placeholder="e.g. Royal Oud Luxury" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Price (₹)</label>
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full bg-white/10 border border-white/10 rounded-lg py-2 px-4 focus:outline-none" placeholder="999" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-white/10 border border-[rgba(255,255,255,0.1)] rounded-lg py-2 px-4 focus:outline-none text-black md:text-white md:bg-gray-800">
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Unisex">Unisex</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-white/10 border border-white/10 rounded-lg py-2 px-4 h-24 focus:outline-none" placeholder="Product details..."></textarea>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Image Link (URL)</label>
              <input type="text" value={image} onChange={(e) => setImage(e.target.value)} className="w-full bg-white/10 border border-white/10 rounded-lg py-2 px-4 focus:outline-none" placeholder="https://..." />
            </div>

            <button type="submit" disabled={isUploading} className={`w-full text-white font-bold py-3 rounded-lg shadow-lg transition-all mt-4 ${isUploading ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 shadow-green-900/20'}`}>
              {isUploading ? 'Uploading Product...' : 'Upload Product'}
            </button>
          </form>
        </div>

        {/* Right Side: Product List & Delete */}
        <div>
          <h2 className="text-3xl font-bold mb-6 italic text-gray-300">Manage Products</h2>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-xl max-h-[600px] overflow-y-auto no-scrollbar">
            {products.length === 0 ? (
              <p className="text-gray-400 text-center py-8">Kono product nei.</p>
            ) : (
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product.id} className="flex items-center gap-4 bg-black/40 p-3 rounded-xl border border-white/5">
                    <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-lg bg-gray-800" />
                    <div className="flex-1">
                      <h4 className="font-bold text-sm">{product.name}</h4>
                      <p className="text-xs text-purple-400">₹{product.price} • {product.category}</p>
                    </div>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="bg-red-600/80 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminPanel;
