import React, { useState } from 'react';

const AdminPanel = () => {
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  // Apnar Secret Password (Ekhane nijer moto set korun)
  const ADMIN_SECRET = "admin@himazumder@5566"; 

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_SECRET) {
      setIsAuthorized(true);
    } else {
      alert("Wrong Password. Please try again later...");
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
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition-all">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 italic text-purple-400">Add New Perfume</h2>
        
        <form className="space-y-6 bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-xl">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Product Title</label>
            <input type="text" className="w-full bg-white/10 border border-white/10 rounded-lg py-2 px-4 focus:outline-none" placeholder="e.g. Royal Oud Luxury" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Price (₹)</label>
              <input type="number" className="w-full bg-white/10 border border-white/10 rounded-lg py-2 px-4 focus:outline-none" placeholder="999" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Category</label>
              <select className="w-full bg-white/10 border border-white/10 rounded-lg py-2 px-4 focus:outline-none">
                <option>Men</option>
                <option>Women</option>
                <option>Unisex</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Description</label>
            <textarea className="w-full bg-white/10 border border-white/10 rounded-lg py-2 px-4 h-32 focus:outline-none" placeholder="Product details..."></textarea>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Image Link (URL)</label>
            <input type="text" className="w-full bg-white/10 border border-white/10 rounded-lg py-2 px-4 focus:outline-none" placeholder="https://..." />
          </div>

          <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-green-900/20">
            Upload Product to Store
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminPanel;
