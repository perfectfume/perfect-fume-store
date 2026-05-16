import { useState, useEffect } from "react";

export default function WarehouseAdmin() {
  const [activeTab, setActiveTab] = useState("approvals");
  const [pendingProducts, setPendingProducts] = useState([]);
  const [warehouseOrders, setWarehouseOrders] = useState([]);
  const [stockInput, setStockInput] = useState<{ [key: string]: number }>({});
  
  const API_BASE_URL = "https://perfect-fume-backend.perfectfumeofficial.workers.dev";

  useEffect(() => {
    if (activeTab === "approvals") fetchPendingProducts();
    if (activeTab === "warehouse") fetchPendingProducts(); 
    if (activeTab === "orders") fetchWarehouseOrders();
  }, [activeTab]);

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

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 p-4 md:p-8 font-sans">
      <div className="bg-red-900/20 backdrop-blur-xl border border-red-500/20 rounded-2xl p-6 mb-8 flex justify-between items-center shadow-2xl">
        <div>
          <h1 className="text-3xl font-bold text-red-400">Warehouse Control Hub</h1>
          <p className="text-gray-400 mt-1">Multi-Vendor Management</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1 space-y-3">
          {["approvals", "warehouse", "orders", "payouts"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-5 py-3 rounded-xl transition-all duration-300 font-medium ${
                activeTab === tab 
                  ? "bg-red-600/20 text-red-400 border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]" 
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-transparent"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="md:col-span-3">
          {activeTab === "approvals" && (
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6 text-white">Pending Product Approvals</h2>
              {pendingProducts.length === 0 ? (
                <p className="text-gray-500">No pending products to approve.</p>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {pendingProducts.map((p: any) => (
                    <div key={p.id} className="bg-[#111] p-4 rounded-xl border border-white/5 flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-white">{p.name} <span className="text-sm font-normal text-purple-400">({p.category})</span></h4>
                        <p className="text-sm text-gray-400">Seller: {p.seller_email}</p>
                        <p className="text-sm text-gray-400">Price: ₹{p.price}</p>
                      </div>
                      <button onClick={() => handleApproveProduct(p.id)} className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-bold">
                        Approve
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "warehouse" && (
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6 text-white">Warehouse Stock Receiving</h2>
              <p className="text-sm text-gray-400 mb-4">Update stock here only when you physically receive the perfume bottles from the seller.</p>
              <div className="grid grid-cols-1 gap-4">
                {pendingProducts.map((p: any) => (
                  <div key={p.id} className="bg-[#111] p-4 rounded-xl border border-white/5 flex justify-between items-center flex-wrap gap-4">
                    <div>
                      <h4 className="font-bold text-white">{p.name}</h4>
                      <p className="text-sm text-gray-400">Current Stock: {p.stock} pcs</p>
                    </div>
                    <div className="flex gap-2">
                      <input 
                        type="number" 
                        placeholder="Qty Received" 
                        value={stockInput[p.id] || ""}
                        onChange={(e) => setStockInput({ ...stockInput, [p.id]: parseInt(e.target.value) })}
                        className="bg-black border border-white/10 rounded-lg p-2 text-white w-32 focus:border-red-500 focus:outline-none" 
                      />
                      <button onClick={() => handleReceiveStock(p.id)} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold">
                        Add Stock
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6 text-white">Centralized Packing & Shipping</h2>
              <p className="text-gray-500">Orders will appear here once customers place them. You will pack and assign tracking IDs here.</p>
            </div>
          )}

          {activeTab === "payouts" && (
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6 text-white">Seller Payout Requests</h2>
              <p className="text-gray-500">When sellers request withdrawal, their requests will appear here for you to transfer the money and mark as paid.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
        }
                      
