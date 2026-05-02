import React, { useEffect, useState } from 'react';
import { Phone, Mail, MessageCircle, MapPin, Clock, Send, Instagram, Facebook, ArrowRight } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  
  const API_URL = import.meta.env.VITE_API_URL || "https://perfect-fume-backend.perfectfumeofficial.workers.dev";
  const ADMIN_WHATSAPP = "918777789394";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // 🔥 Backend e message pathanor request
      const response = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert(`Thank you, ${formData.name}! Apnar message pathano hoyeche. Amra khub taratari jogajog korbo.`);
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        alert("⚠️ Message send korte problem hocche. Doyakore WhatsApp-e contact korun.");
      }
    } catch (error) {
      alert("⚠️ Network Error! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-20 md:pt-24 pb-24 font-sans">
      <main className="max-w-6xl mx-auto px-4 md:px-8">
        
        {/* 🔥 HEADER - Responsive sizes */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 tracking-wide text-white">
            Contact Us
          </h1>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed px-2">
            Have questions about our fragrances? Need help choosing the perfect scent? <br className="hidden md:block"/>
            We’re here to assist you — anytime you need us.
          </p>
        </div>

        {/* 🔥 MAIN CONTENT - Stack on mobile, Side-by-Side on desktop */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 mb-20">
          
          {/* LEFT SIDE: Contact Info (Full width on mobile, 45% on desktop) */}
          <div className="w-full lg:w-[45%] flex flex-col justify-center space-y-10">
            
            {/* Direct Contact Links */}
            <div className="space-y-3 md:space-y-4">
              <a href={`https://wa.me/${ADMIN_WHATSAPP}`} target="_blank" rel="noreferrer" className="flex items-center gap-4 md:gap-5 p-4 md:p-5 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-white/20 transition-all group">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-green-900/20 text-green-500 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-white text-base md:text-lg">WhatsApp</p>
                  <p className="text-xs md:text-sm text-gray-500">Chat with us instantly</p>
                </div>
              </a>
              
              <a href="tel:+918777789394" className="flex items-center gap-4 md:gap-5 p-4 md:p-5 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-white/20 transition-all group">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 text-white flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-white text-base md:text-lg">+91 87777 89394</p>
                  <p className="text-xs md:text-sm text-gray-500">Call us directly</p>
                </div>
              </a>

              <a href="mailto:perfectfumeofficial@gmail.com" className="flex items-center gap-4 md:gap-5 p-4 md:p-5 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-white/20 transition-all group">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 text-white flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <p className="font-bold text-white text-sm md:text-lg truncate">perfectfumeofficial<br className="md:hidden"/>@gmail.com</p>
                  <p className="text-xs md:text-sm text-gray-500">Send us an email</p>
                </div>
              </a>
            </div>

            {/* Business Info Details */}
            <div className="pt-6 md:pt-8 border-t border-white/10">
              <h3 className="text-base md:text-lg font-bold text-white mb-5 md:mb-6">Business Information</h3>
              <div className="space-y-5 md:space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-gray-500 shrink-0" />
                  <div>
                    <p className="text-xs md:text-sm font-bold text-white mb-1">Location</p>
                    <p className="text-xs md:text-sm text-gray-400">Kolkata, India</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Clock className="w-5 h-5 text-gray-500 shrink-0" />
                  <div>
                    <p className="text-xs md:text-sm font-bold text-white mb-1">Working Hours</p>
                    <p className="text-xs md:text-sm text-gray-400">10:00 AM – 8:00 PM (Monday to Saturday)</p> {/* 🔥 Updated Hours */}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT SIDE: Clean Form (Full width on mobile, 55% on desktop) */}
          <div className="w-full lg:w-[55%] bg-[#0a0a0a] border border-white/5 p-6 md:p-10 rounded-2xl md:rounded-3xl">
            <h3 className="text-xl md:text-2xl font-bold mb-2 text-white">Send a Message</h3>
            <p className="text-gray-500 text-xs md:text-sm mb-6 md:mb-8">We usually respond within a few hours.</p>
            
            <form onSubmit={handleSendMessage} className="space-y-4 md:space-y-5">
              
              <div className="space-y-1.5 md:space-y-2">
                <label className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider">Full Name *</label>
                <input 
                  required type="text" 
                  value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  className="w-full bg-[#111] border border-white/5 rounded-xl px-4 py-3.5 md:py-4 text-white outline-none focus:border-purple-500 transition-all text-sm md:text-base placeholder:text-gray-600" 
                  placeholder="Enter your name" 
                />
              </div>

              <div className="space-y-1.5 md:space-y-2">
                <label className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address *</label>
                <input 
                  required type="email" 
                  value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  className="w-full bg-[#111] border border-white/5 rounded-xl px-4 py-3.5 md:py-4 text-white outline-none focus:border-purple-500 transition-all text-sm md:text-base placeholder:text-gray-600" 
                  placeholder="youremail@example.com" 
                />
              </div>

              <div className="space-y-1.5 md:space-y-2">
                <label className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider">Phone Number</label>
                <input 
                  type="number" 
                  value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                  className="w-full bg-[#111] border border-white/5 rounded-xl px-4 py-3.5 md:py-4 text-white outline-none focus:border-purple-500 transition-all text-sm md:text-base placeholder:text-gray-600" 
                  placeholder="10-digit mobile number" 
                />
              </div>

              <div className="space-y-1.5 md:space-y-2">
                <label className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider">Message *</label>
                <textarea 
                  required rows={4} 
                  value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} 
                  className="w-full bg-[#111] border border-white/5 rounded-xl px-4 py-3.5 md:py-4 text-white outline-none focus:border-purple-500 transition-all text-sm md:text-base placeholder:text-gray-600 resize-none" 
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              
              <button type="submit" disabled={loading} className="w-full bg-white hover:bg-gray-200 text-black font-bold py-3.5 md:py-4 rounded-xl transition-colors flex justify-center items-center gap-2 mt-2 md:mt-4 text-sm md:text-base uppercase tracking-wider disabled:opacity-50">
                {loading ? 'Sending...' : 'Send Message'} <Send className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </form>
          </div>

        </div>

        {/* 🔥 BOTTOM QUICK HELP */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-12 md:mb-16">
          <div className="bg-[#0a0a0a] border border-white/5 p-6 md:p-8 rounded-2xl md:rounded-3xl flex flex-col items-center text-center hover:bg-[#111] transition-colors">
            <h4 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-white">Track Your Order</h4>
            <p className="text-xs md:text-sm text-gray-400 mb-5 md:mb-6 max-w-sm">Already placed an order? You can easily track your real-time delivery status here.</p>
            <a href="/track-order" className="bg-white/10 text-white font-bold py-2.5 md:py-3 px-6 md:px-8 rounded-full hover:bg-white hover:text-black transition-all text-xs md:text-sm flex items-center gap-2">
              Track Order <ArrowRight className="w-4 h-4"/>
            </a>
          </div>

          <div className="bg-[#0a0a0a] border border-white/5 p-6 md:p-8 rounded-2xl md:rounded-3xl flex flex-col items-center text-center hover:bg-[#111] transition-colors">
            <h4 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-white">Got Questions?</h4>
            <p className="text-xs md:text-sm text-gray-400 mb-5 md:mb-6 max-w-sm">Have common questions about delivery, returns, or product details? Find answers instantly.</p>
            <a href="/faq" className="bg-white/10 text-white font-bold py-2.5 md:py-3 px-6 md:px-8 rounded-full hover:bg-white hover:text-black transition-all text-xs md:text-sm flex items-center gap-2">
              Visit FAQ Page <ArrowRight className="w-4 h-4"/>
            </a>
          </div>
        </div>

        {/* 🔥 SOCIALS */}
        <div className="text-center pt-8 border-t border-white/10">
          <p className="text-white font-bold text-sm md:text-base mb-4 md:mb-6">Follow Perfect Fume</p>
          <div className="flex justify-center gap-3 md:gap-4">
            <a href="#" className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-[#0a0a0a] border border-white/10 rounded-full hover:bg-white hover:text-black transition-all text-gray-400"><Instagram className="w-4 h-4 md:w-5 md:h-5" /></a>
            <a href="#" className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-[#0a0a0a] border border-white/10 rounded-full hover:bg-white hover:text-black transition-all text-gray-400"><Facebook className="w-4 h-4 md:w-5 md:h-5" /></a>
          </div>
        </div>

      </main>
    </div>
  );
};

export default Contact;
