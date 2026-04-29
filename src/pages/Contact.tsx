import React, { useEffect, useState } from 'react';
import { Phone, Mail, MessageCircle, MapPin, Clock, Send, Instagram, Facebook, ArrowRight } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const ADMIN_WHATSAPP = "918777789394";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Thank you, ${formData.name}! Apnar message pathano hoyeche. Amra khub taratari apnar sathe jogajog korbo.`);
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-24 font-sans">
      <main className="max-w-6xl mx-auto px-4 md:px-8">
        
        {/* 🔥 HEADER - Clean & Elegant */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-wide text-white">
            Contact Us
          </h1>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed">
            Have questions about our fragrances? Need help choosing the perfect scent? <br className="hidden md:block"/>
            We’re here to assist you — anytime you need us.
          </p>
        </div>

        {/* 🔥 MAIN CONTENT - 2 Equal Columns on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          
          {/* LEFT SIDE: Contact Info */}
          <div className="flex flex-col justify-center space-y-12">
            
            {/* Direct Contact Links */}
            <div className="space-y-4">
              <a href={`https://wa.me/${ADMIN_WHATSAPP}`} target="_blank" rel="noreferrer" className="flex items-center gap-5 p-5 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-white/20 transition-all group">
                <div className="w-12 h-12 rounded-full bg-green-900/20 text-green-500 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-white text-lg">WhatsApp</p>
                  <p className="text-sm text-gray-500">Chat with us instantly</p>
                </div>
              </a>
              
              <a href="tel:+918777789394" className="flex items-center gap-5 p-5 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-white/20 transition-all group">
                <div className="w-12 h-12 rounded-full bg-white/5 text-white flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-white text-lg">+91 87777 89394</p>
                  <p className="text-sm text-gray-500">Call us directly</p>
                </div>
              </a>

              <a href="mailto:perfectfumeofficial@gmail.com" className="flex items-center gap-5 p-5 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-white/20 transition-all group">
                <div className="w-12 h-12 rounded-full bg-white/5 text-white flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <p className="font-bold text-white text-lg truncate">perfectfumeofficial<br className="md:hidden"/>@gmail.com</p>
                  <p className="text-sm text-gray-500">Send us an email</p>
                </div>
              </a>
            </div>

            {/* Business Info Details */}
            <div className="pt-8 border-t border-white/10">
              <h3 className="text-lg font-bold text-white mb-6">Business Information</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-gray-500 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-white mb-1">Location</p>
                    <p className="text-sm text-gray-400">Kolkata, India</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Clock className="w-5 h-5 text-gray-500 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-white mb-1">Working Hours</p>
                    <p className="text-sm text-gray-400">10:00 AM – 8:00 PM (All Days)</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT SIDE: Clean Form */}
          <div className="bg-[#0a0a0a] border border-white/5 p-8 md:p-10 rounded-3xl">
            <h3 className="text-2xl font-bold mb-2 text-white">Send a Message</h3>
            <p className="text-gray-500 text-sm mb-8">We usually respond within a few hours.</p>
            
            <form onSubmit={handleSendMessage} className="space-y-5">
              {/* Full Width Inputs (No side-by-side squishing) */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Full Name *</label>
                <input 
                  required type="text" 
                  value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  className="w-full bg-[#111] border border-white/5 rounded-xl px-4 py-4 text-white outline-none focus:border-purple-500 transition-all text-sm placeholder:text-gray-600" 
                  placeholder="Enter your name" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address *</label>
                <input 
                  required type="email" 
                  value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  className="w-full bg-[#111] border border-white/5 rounded-xl px-4 py-4 text-white outline-none focus:border-purple-500 transition-all text-sm placeholder:text-gray-600" 
                  placeholder="youremail@example.com" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Phone Number</label>
                <input 
                  type="number" 
                  value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                  className="w-full bg-[#111] border border-white/5 rounded-xl px-4 py-4 text-white outline-none focus:border-purple-500 transition-all text-sm placeholder:text-gray-600" 
                  placeholder="10-digit mobile number" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Message *</label>
                <textarea 
                  required rows={4} 
                  value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} 
                  className="w-full bg-[#111] border border-white/5 rounded-xl px-4 py-4 text-white outline-none focus:border-purple-500 transition-all text-sm placeholder:text-gray-600 resize-none" 
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              
              <button type="submit" className="w-full bg-white hover:bg-gray-200 text-black font-bold py-4 rounded-xl transition-colors flex justify-center items-center gap-2 mt-4 text-sm uppercase tracking-wider">
                Send Message <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

        {/* 🔥 BOTTOM QUICK HELP - 2 Column Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-3xl flex flex-col items-center text-center hover:bg-[#111] transition-colors">
            <h4 className="text-xl font-bold mb-3 text-white">Track Your Order</h4>
            <p className="text-sm text-gray-400 mb-6 max-w-sm">Already placed an order? You can easily track your real-time delivery status here.</p>
            <a href="/track-order" className="bg-white/10 text-white font-bold py-3 px-8 rounded-full hover:bg-white hover:text-black transition-all text-sm flex items-center gap-2">
              Track Order <ArrowRight className="w-4 h-4"/>
            </a>
          </div>

          <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-3xl flex flex-col items-center text-center hover:bg-[#111] transition-colors">
            <h4 className="text-xl font-bold mb-3 text-white">Got Questions?</h4>
            <p className="text-sm text-gray-400 mb-6 max-w-sm">Have common questions about delivery, returns, or product details? Find answers instantly.</p>
            <a href="/faq" className="bg-white/10 text-white font-bold py-3 px-8 rounded-full hover:bg-white hover:text-black transition-all text-sm flex items-center gap-2">
              Visit FAQ Page <ArrowRight className="w-4 h-4"/>
            </a>
          </div>
        </div>

        {/* 🔥 SOCIALS */}
        <div className="text-center pt-8 border-t border-white/10">
          <p className="text-white font-bold mb-6">Follow Perfect Fume</p>
          <div className="flex justify-center gap-4">
            <a href="#" className="w-12 h-12 flex items-center justify-center bg-[#0a0a0a] border border-white/10 rounded-full hover:bg-white hover:text-black transition-all text-gray-400"><Instagram className="w-5 h-5" /></a>
            <a href="#" className="w-12 h-12 flex items-center justify-center bg-[#0a0a0a] border border-white/10 rounded-full hover:bg-white hover:text-black transition-all text-gray-400"><Facebook className="w-5 h-5" /></a>
          </div>
        </div>

      </main>
    </div>
  );
};

export default Contact;
