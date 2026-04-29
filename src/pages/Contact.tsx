import React, { useEffect, useState } from 'react';
import { Phone, Mail, MessageCircle, MapPin, Clock, Send, Instagram, Facebook, HelpCircle, PackageSearch } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const ADMIN_WHATSAPP = "918777789394"; // Apnar WhatsApp number

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSendMessage = (e: any) => {
    e.preventDefault();
    // Eita ekhonkar jonno alert korche, apni chaile pore email API jure dite paren
    alert(`Thank you, ${formData.name}! Apnar message pathano hoyeche. Amra khub taratari apnar sathe jogajog korbo.`);
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-24 font-sans">
      <main className="max-w-6xl mx-auto px-4">
        
        {/* 🔥 PAGE HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold italic mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Contact Us
          </h1>
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-white">Get in Touch with Perfect Fume</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Have questions about our fragrances? Need help choosing the perfect scent? <br className="hidden md:block"/>
            We’re here to assist you — anytime you need us.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          
          {/* 🔥 LEFT: Contact Info & Business Details */}
          <div className="space-y-8">
            
            {/* Direct Contact Cards */}
            <div>
              <h3 className="text-2xl font-bold mb-6 italic text-purple-400">Talk to Us Directly</h3>
              <div className="space-y-4">
                <a href={`https://wa.me/${ADMIN_WHATSAPP}`} target="_blank" rel="noreferrer" className="flex items-center gap-4 bg-[#111] p-4 rounded-2xl border border-white/5 hover:border-green-500/50 transition-all group cursor-pointer">
                  <div className="p-3 bg-green-900/20 rounded-xl text-green-500 group-hover:scale-110 transition-transform"><MessageCircle className="w-6 h-6"/></div>
                  <div>
                    <p className="font-bold text-lg text-white">WhatsApp</p>
                    <p className="text-sm text-gray-400">Chat with us instantly</p>
                  </div>
                </a>
                
                <a href="tel:+918777789394" className="flex items-center gap-4 bg-[#111] p-4 rounded-2xl border border-white/5 hover:border-purple-500/50 transition-all group cursor-pointer">
                  <div className="p-3 bg-purple-900/20 rounded-xl text-purple-400 group-hover:scale-110 transition-transform"><Phone className="w-6 h-6"/></div>
                  <div>
                    <p className="font-bold text-lg text-white">Phone</p>
                    <p className="text-sm text-gray-400">+91 87777 89394</p>
                  </div>
                </a>

                <a href="mailto:perfectfumeofficial@gmail.com" className="flex items-center gap-4 bg-[#111] p-4 rounded-2xl border border-white/5 hover:border-blue-500/50 transition-all group cursor-pointer">
                  <div className="p-3 bg-blue-900/20 rounded-xl text-blue-400 group-hover:scale-110 transition-transform"><Mail className="w-6 h-6"/></div>
                  <div>
                    <p className="font-bold text-lg text-white">Email</p>
                    <p className="text-sm text-gray-400">perfectfumeofficial@gmail.com</p>
                  </div>
                </a>
              </div>
              <p className="text-xs text-gray-500 mt-4 italic">* We usually respond within a few hours.</p>
            </div>

            {/* Business Info */}
            <div>
              <h3 className="text-2xl font-bold mb-6 italic text-purple-400">Business Information</h3>
              <div className="bg-[#111] p-6 rounded-2xl border border-white/5 space-y-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-purple-400 mt-0.5" />
                  <div><p className="font-bold">Brand Name:</p><p className="text-gray-400">Perfect Fume</p></div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-purple-400 mt-0.5" />
                  <div><p className="font-bold">Location:</p><p className="text-gray-400">Kolkata, India</p></div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-purple-400 mt-0.5" />
                  <div><p className="font-bold">Working Hours:</p><p className="text-gray-400">10:00 AM – 8:00 PM (All Days)</p></div>
                </div>
              </div>
            </div>

          </div>

          {/* 🔥 RIGHT: Contact Form */}
          <div>
            <h3 className="text-2xl font-bold mb-6 italic text-purple-400">Send Us a Message</h3>
            <p className="text-gray-400 mb-6 text-sm">Fill out the form below and our team will get back to you as soon as possible.</p>
            
            <form onSubmit={handleSendMessage} className="bg-[#111] p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Name *</label>
                <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl p-3.5 text-white outline-none focus:border-purple-500 transition-colors" placeholder="Your full name" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Email *</label>
                <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl p-3.5 text-white outline-none focus:border-purple-500 transition-colors" placeholder="youremail@example.com" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Phone (Optional)</label>
                <input type="number" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl p-3.5 text-white outline-none focus:border-purple-500 transition-colors" placeholder="10-digit mobile number" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Message *</label>
                <textarea required rows={4} value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl p-3.5 text-white outline-none focus:border-purple-500 transition-colors" placeholder="How can we help you?"></textarea>
              </div>
              
              <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-purple-900/30 flex justify-center items-center gap-2">
                Send Message <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* 🔥 BOTTOM CARDS: Quick Links */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {/* Quick Help */}
          <div className="bg-gradient-to-br from-green-900/20 to-black p-6 rounded-2xl border border-green-500/20 text-center">
            <MessageCircle className="w-8 h-8 text-green-500 mx-auto mb-4" />
            <h4 className="text-lg font-bold mb-2">Need Help Faster?</h4>
            <p className="text-sm text-gray-400 mb-4">For quick assistance, we recommend reaching out via WhatsApp. Ready to help with orders & queries.</p>
            <a href={`https://wa.me/${ADMIN_WHATSAPP}`} target="_blank" rel="noreferrer" className="text-green-400 font-bold hover:underline text-sm">Chat Now on WhatsApp →</a>
          </div>

          {/* Track Order */}
          <div className="bg-gradient-to-br from-blue-900/20 to-black p-6 rounded-2xl border border-blue-500/20 text-center">
            <PackageSearch className="w-8 h-8 text-blue-500 mx-auto mb-4" />
            <h4 className="text-lg font-bold mb-2">Track Your Order</h4>
            <p className="text-sm text-gray-400 mb-4">Already placed an order? You can easily track your delivery status here.</p>
            {/* Eikhane pore track-order page er link bosabo */}
            <a href="#" className="text-blue-400 font-bold hover:underline text-sm">Track Order →</a>
          </div>

          {/* FAQ */}
          <div className="bg-gradient-to-br from-purple-900/20 to-black p-6 rounded-2xl border border-purple-500/20 text-center md:col-span-2 lg:col-span-1">
            <HelpCircle className="w-8 h-8 text-purple-500 mx-auto mb-4" />
            <h4 className="text-lg font-bold mb-2">Frequently Asked Questions</h4>
            <p className="text-sm text-gray-400 mb-4">Have common questions about delivery, returns, or product details?</p>
            <a href="#" className="text-purple-400 font-bold hover:underline text-sm">Visit FAQ Page →</a>
          </div>
        </div>

        {/* 🔥 FOOTER NOTE & SOCIALS */}
        <div className="text-center border-t border-white/10 pt-12">
          <h3 className="text-2xl font-bold mb-4">Follow Us</h3>
          <p className="text-gray-400 mb-6">Stay connected and get the latest updates, offers, and new launches.</p>
          <div className="flex justify-center gap-4 mb-12">
            <a href="#" className="p-3 bg-[#111] border border-white/10 rounded-full hover:bg-pink-600 hover:border-pink-500 transition-all text-white"><Instagram className="w-6 h-6" /></a>
            <a href="#" className="p-3 bg-[#111] border border-white/10 rounded-full hover:bg-blue-600 hover:border-blue-500 transition-all text-white"><Facebook className="w-6 h-6" /></a>
          </div>

          <div className="bg-white/5 p-8 rounded-3xl max-w-3xl mx-auto">
            <h4 className="text-xl font-bold text-purple-400 mb-3 italic">We’re Here for You</h4>
            <p className="text-gray-300 mb-2">At Perfect Fume, customer satisfaction is our priority. Whether it’s a question, feedback, or support — we’re always just one message away.</p>
            <p className="text-white font-bold text-lg mt-4 border-t border-white/10 pt-4">Your perfect fragrance journey starts with us. ✨</p>
          </div>
        </div>

      </main>
    </div>
  );
};

export default Contact;
              
