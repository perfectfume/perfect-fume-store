import React, { useState } from 'react';

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
  
  const ADMIN_SECRET = "admin@himazumder@5566";

  // Login Handle
  const handleLogin = (e) => {
    e.preventDefault(); // <--- Eta page refresh atkabe
    if (password === ADMIN_SECRET) {
      setIsAuthorized(true);
    } else {
      alert("Wrong Password..!! Try Again Later...");
    }
  };

  // Upload Handle
  const handleAddProduct = async (e) => {
    e.preventDefault(); // <--- MASTER FIX: Eta form submit er por page refresh hote debe na
    
    if (!title || !price || !image) {
      return alert("Title, Price r Image Link dewa baddhotamulok!");
    }

    setIsUploading(true);
    
    // Apnar Backend link (Environment theke nibe ba direct use korbe)
    const API_URL = import.meta.env.VITE_API_URL || "https://perfect-fume-backend.perfectfumeofficial.workers.dev";

    try {
      const res = await fetch(`${API_URL}/api/add-product`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: title, 
          price: Number(price), 
          description: description, 
          image: image, 
          category: category 
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert("✅ Product Successfully Uploaded! Home page check korun.");
        // Upload howar por form auto faka hoye jabe
        setTitle(''); setPrice(''); setDescription(''); setImage('');
      } else {
        alert("❌ Upload Failed: Backend problem.");
      }
    } catch (err) {
      alert("Network Error! Backend connection fail.");
    } finally {
      setIsUploading(false);
    }
  };

  // 1. LOGIN SCREEN
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

  // 2. PRODUCT UPLOAD SCREEN
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8 pt-24">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 italic text-purple-400">Add New Perfume</h2>
        
        <form onSubmit={handleAddProduct} className="space-y-6 bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Product Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-white/10 border border-white/10 rounded-lg py-2 px-4 focus:outline-none" placeholder="e.g. Royal Oud Luxury" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Price (₹)</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full bg-white/10 border border-white/10 rounded-lg py-2 px-4 focus:outline-none" placeholder="999" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-white/10 border border-[rgba(255,255,255,0.1)] rounded-lg py-2 px-4 focus:outline-none text-black md:text-white md:bg-gray-800">
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Unisex">Unisex</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-white/10 border border-white/10 rounded-lg py-2 px-4 h-32 focus:outline-none" placeholder="Product details..."></textarea>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Image Link (URL)</label>
            <input type="text" value={image} onChange={(e) => setImage(e.target.value)} className="w-full bg-white/10 border border-white/10 rounded-lg py-2 px-4 focus:outline-none" placeholder="https://..." />
          </div>

          <button type="submit" disabled={isUploading} className={`w-full text-white font-bold py-3 rounded-lg shadow-lg transition-all ${isUploading ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 shadow-green-900/20'}`}>
            {isUploading ? 'Uploading Product...' : 'Upload Product to Store'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminPanel;
