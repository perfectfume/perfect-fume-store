import React, { useState, useEffect } from 'react';
import { Search, Package, Mail, CheckCircle, Truck, MessageCircle, HelpCircle, AlertCircle, MapPin, Calendar, CreditCard } from 'lucide-react';

const TrackOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [trackingData, setTrackingData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "https://perfect-fume-backend.perfectfumeofficial.workers.dev";
  const ADMIN_WHATSAPP = "918777789394";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId || !contactInfo) {
      return alert("⚠️ Doyakore Order ID r Phone/Email dutoi din!");
    }
    
    setLoading(true);
    
    try {
      // Order ID theke '#' ba space soriye shudhu ID ta neoa hocche (e.g., OR-43 er bodole 43)
      const cleanOrderId = orderId.replace('#', '').replace(/or-/i, '').trim();

      // Asol API theke data tanbe
      const response = await fetch(`${API_URL}/api/order/${cleanOrderId}`);
      
      if (response.ok) {
        const orderData = await response.json();
        
        setTrackingData({
          id: `#OR-${cleanOrderId.toUpperCase()}`,
          // Date formatting
          date: orderData.createdAt ? new Date(orderData.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recently Placed',
          amount: `₹${orderData.totalAmount || '0'}`,
          eta: 'Standard Delivery (3-7 Days)',
          address: (orderData.address && orderData.address.city) ? `${orderData.address.city}, India` : 'India',
          steps: [
            { label: 'Order Placed', completed: true },
            { label: 'Order Confirmed', completed: orderData.status !== 'pending' },
            { label: 'Shipped', completed: orderData.status === 'shipped' || orderData.status === 'delivered', current: orderData.status === 'shipped' },
            { label: 'Out for Delivery', completed: orderData.status === 'out_for_delivery', current: orderData.status === 'out_for_delivery' },
            { label: 'Delivered', completed: orderData.status === 'delivered', current: orderData.status === 'delivered' },
          ]
        });
      } else {
        alert("❌ Kono order khunje pawa jayni! Doyakore sothik Order ID din.");
        setTrackingData(null);
      }
    } catch (error) {
      console.error("Tracking Error:", error);
      alert("⚠️ Server-er sathe connect korte somossa hocche. Ektu pore abar try korun.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-24 font-sans">
      <main className="max-w-4xl mx-auto px-4">
        
        {/* HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold italic mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Track Your Order
          </h1>
          <h2 className="text-xl font-bold mb-2 text-white">Stay Updated with Your Delivery</h2>
          <p className="text-gray-400 text-sm md:text-base">
            Already placed an order? <br className="hidden md:block"/>
            Enter your details below to check the real-time status of your order.
          </p>
        </div>

        {/* TRACKING FORM */}
        <div className="bg-[#111] p-6 md:p-8 rounded-3xl border border-white/10 mb-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
          
          <form onSubmit={handleTrack} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input 
                  type="text" 
                  required
                  placeholder="Order ID (e.g. #OR-43)" 
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-purple-500 transition-all font-mono text-white uppercase"
                />
              </div>
              <div className="flex-1 relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input 
                  type="text" 
                  required
                  placeholder="Phone Number / Email" 
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-purple-500 transition-all text-white"
                />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl transition-all flex justify-center items-center gap-2 shadow-lg shadow-purple-900/30">
              {loading ? 'Fetching Details...' : 'Track Order'} <Search className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* TRACKING RESULTS */}
        {trackingData && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            
            {/* Order Details */}
            <div className="bg-[#111] p-6 rounded-2xl border border-white/5">
              <h3 className="text-xl font-bold mb-4 text-purple-400 border-b border-white/10 pb-2">Order Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-900/20 rounded-lg"><Package className="w-5 h-5 text-purple-400"/></div>
                  <div><p className="text-xs text-gray-500 uppercase font-bold">Order ID</p><p className="font-mono font-bold text-white">{trackingData.id}</p></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-900/20 rounded-lg"><Calendar className="w-5 h-5 text-blue-400"/></div>
                  <div><p className="text-xs text-gray-500 uppercase font-bold">Order Date</p><p className="font-bold text-white">{trackingData.date}</p></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-900/20 rounded-lg"><CreditCard className="w-5 h-5 text-green-400"/></div>
                  <div><p className="text-xs text-gray-500 uppercase font-bold">Total Amount</p><p className="font-bold text-white">{trackingData.amount}</p></div>
                </div>
              </div>
            </div>

            {/* Order Status Stepper */}
            <div className="bg-[#111] p-6 md:p-8 rounded-2xl border border-white/5">
              <h3 className="text-xl font-bold mb-8 text-purple-400 border-b border-white/10 pb-2">Order Status</h3>
              <div className="relative pl-4 md:pl-0">
                <div className="absolute left-[27px] top-2 bottom-2 w-0.5 bg-white/10"></div>
                
                <div className="space-y-6">
                  {trackingData.steps.map((step: any, i: number) => (
                    <div key={i} className="flex items-start gap-4 relative z-10">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 shrink-0 ${step.completed ? 'bg-purple-600 border-purple-600 text-white' : 'bg-black border-white/20 text-gray-600'}`}>
                        {step.completed ? <CheckCircle className="w-5 h-5" /> : <div className="w-2.5 h-2.5 rounded-full bg-current" />}
                      </div>
                      <div className="pt-1">
                        <h4 className={`font-bold ${step.current ? 'text-purple-400 text-lg' : step.completed ? 'text-white' : 'text-gray-500'}`}>{step.label}</h4>
                        {step.current && <p className="text-xs text-purple-300 mt-1">(Current Status)</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="bg-[#111] p-6 rounded-2xl border border-white/5">
              <h3 className="text-xl font-bold mb-4 text-purple-400 border-b border-white/10 pb-2">Delivery Information</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Truck className="w-5 h-5 text-gray-400 mt-1 shrink-0" />
                  <div>
                    <p className="font-bold text-gray-300">Estimated Delivery:</p>
                    <p className="text-white font-bold">{trackingData.eta}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-1 shrink-0" />
                  <div>
                    <p className="font-bold text-gray-300">Delivery Address:</p>
                    <p className="text-white">{trackingData.address}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

      </main>
    </div>
  );
};

export default TrackOrder;
