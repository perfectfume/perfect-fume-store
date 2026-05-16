import { useState, useEffect } from "react";

export default function SellerDashboard() {
  // Auth States
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authStep, setAuthStep] = useState(1); // 1: Email, 2: OTP
  const [loginEmail, setLoginEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Dashboard States
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({ brand_name: "Loading...", total_earnings: 0, total_products: 0, status: "pending" });
  const [products, setProducts] = useState([]);
  
  const API_BASE_URL = "https://perfect-fume-backend.perfectfumeofficial.workers.dev";

  useEffect(() => {
    if (isLoggedIn) {
      if (activeTab === "overview") fetchStats();
      if (activeTab === "products") fetchProducts();
    }
  }, [activeTab, isLoggedIn]);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/seller/dashboard-stats?email=${loginEmail}`);
      const data = await res.json();
      if (!data.error) setStats(data);
    } catch (err) {
      console.error("Failed to fetch stats");
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/seller/my-products?email=${loginEmail}`);
      const data = await res.json();
      if (!data.error) setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products");
    }
  };

  // --- LOGIN LOGIC ---
  const handleSendOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/seller/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail }),
      });
      const data = await res.json();
      if (data.success) {
        setAuthStep(2);
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Failed to send OTP.");
    }
    setIsLoading(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/seller/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, otp: otp }),
      });
      const data = await res.json();
      if (data.success) {
        setIsLoggedIn(true);
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Failed to verify OTP.");
    }
    setIsLoading(false);
  };

  // --- PRODUCT UPLOAD LOGIC ---
  const handleProductUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const productData = {
      name: formData.get("name"),
      price: formData.get("price"),
      category: formData.get("category"),
      scent_notes: formData.get("scent_notes"),
      description: formData.get("description"),
      seller_email: loginEmail,
      image: "https://via.placeholder.com/150",
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/seller/add-product`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });
      const data = await res.json();
      if (data.success) {
        alert("Product Uploaded! Waiting for admin approval.");
        setActiveTab("products");
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Upload failed.");
    }
  };

  // --- UI: LOGIN SCREEN ---
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl w-full max-w-md shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-fuchsia-400 to-purple-600 bg-clip-text text-transparent mb-2">Brand Portal</h1>
            <p className="text-gray-400">Login to manage your perfumes</p>
          </div>
          
          {authStep === 1 ? (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Registered Email</label>
                <input 
                  type="email" 
                  required 
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none" 
                  placeholder="brand@example.com" 
                />
              </div>
              <button disabled={isLoading} type="submit" className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-bold py-3 rounded-lg disabled:opacity-50">
                {isLoading ? "Sending..." : "Send Login OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Enter OTP</label>
                <input 
                  type="text" 
                  required 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white text-center tracking-[0.5em] text-xl focus:border-purple-500 focus:outline-none" 
                  placeholder="------" 
                />
              </div>
              <button disabled={isLoading} type="submit" className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-bold py-3 rounded-lg disabled:opacity-50">
                {isLoading ? "Verifying..." : "Verify & Login"}
              </button>
              <button type="button" onClick={() => setAuthStep(1)} className="w-full text-gray-400 text-sm mt-2 hover:text-white">
                Change Email
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // --- UI: MAIN DASHBOARD ---
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 p-4 md:p-8 font-sans">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8 flex justify-between items-center shadow-2xl">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-fuchsia-400 to-purple-600 bg-clip-text text-transparent">
            {stats.brand_name}
          </h1>
          <p className="text-gray-400 mt-1">Brand Dashboard</p>
        </div>
        <div className="text-right flex flex-col items-end gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${stats.status === 'approved' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'}`}>
            {stats.status.toUpperCase()}
          </span>
          <button onClick={() => setIsLoggedIn(false)} className="text-xs text-gray-400 hover:text-white border border-white/10 px-3 py-1 rounded-md">Logout</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1 space-y-3">
          {["overview", "products", "upload", "wallet"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-5 py-3 rounded-xl transition-all duration-300 font-medium ${
                activeTab === tab 
                  ? "bg-purple-600/20 text-purple-400 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]" 
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-transparent"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="md:col-span-3">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                <h3 className="text-gray-400 text-sm font-medium mb-2">Total Net Earnings</h3>
                <p className="text-4xl font-bold text-white">₹ {stats.total_earnings}</p>
              </div>
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                <h3 className="text-gray-400 text-sm font-medium mb-2">Live Products</h3>
                <p className="text-4xl font-bold text-white">{stats.total_products}</p>
              </div>
            </div>
          )}

          {activeTab === "products" && (
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6 text-white">My Perfumes</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-400 text-sm">
                      <th className="pb-3 pl-2">Product Name</th>
                      <th className="pb-3">Price</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Warehouse Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p: any) => (
                      <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-4 pl-2 font-medium">{p.name}</td>
                        <td className="py-4 text-purple-400">₹{p.price}</td>
                        <td className="py-4">
                          <span className={`text-xs px-2 py-1 rounded-md ${p.approval_status === 'approved' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                            {p.approval_status}
                          </span>
                        </td>
                        <td className="py-4">{p.stock} pcs</td>
                      </tr>
                    ))}
                    {products.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-gray-500">No products uploaded yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "upload" && (
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6 text-white">Upload New Perfume</h2>
              <form onSubmit={handleProductUpload} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Perfume Name</label>
                    <input name="name" required className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none transition-colors" placeholder="e.g. Midnight Oud" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Price (₹)</label>
                    <input name="price" type="number" required className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none transition-colors" placeholder="1499" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Category</label>
                    <select name="category" required className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none transition-colors appearance-none">
                      <option value="">Select Category</option>
                      <option value="Men">Men</option>
                      <option value="Women">Women</option>
                      <option value="Unisex">Unisex</option>
                      <option value="Luxury">Luxury</option>
                      <option value="Travel Size">Travel Size</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Scent Notes</label>
                    <input name="scent_notes" required className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none transition-colors" placeholder="Top: Citrus, Heart: Rose, Base: Musk" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Description</label>
                  <textarea name="description" required rows={3} className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none transition-colors" placeholder="Tell the story of this scent..."></textarea>
                </div>
                <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-purple-500/30">
                  Submit for Approval
                </button>
              </form>
            </div>
          )}

          {activeTab === "wallet" && (
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 text-center">
              <h2 className="text-xl font-bold mb-2 text-white">Available Balance</h2>
              <p className="text-5xl font-extrabold text-purple-400 mb-6">₹ {stats.total_earnings}</p>
              <button onClick={() => alert("Withdrawal request sent to Admin!")} className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium py-2 px-6 rounded-lg transition-all">
                Request Withdrawal
              </button>
              <p className="mt-4 text-sm text-gray-500">Platform commission of 10% is automatically deducted.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
