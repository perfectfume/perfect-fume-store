import React, { useEffect, useState } from 'react';
import { Phone, Mail, MessageCircle, MapPin, Clock, Send, Instagram, Facebook, Package, ArrowRight } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const ADMIN_WHATSAPP = "918777789394";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSendMessage = (e: any) => {
    e.preventDefault();
    alert(`Thank you, ${formData.name}! Apnar message pathano hoyeche. Amra khub taratari apnar sathe jogajog korbo.`);
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-24 font-sans">
      <main className="max-w-6xl mx-auto px-4 md:px-8">
        
        {/* 🔥 PAGE HEADER - Clean & Sleek */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <h1 className="text-4xl md:text-5xl font-bold italic mb-6 tracking-wide text-white">
            Contact Us
          </h1>
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-200">
            Get in Touch with Perfect Fume
          </h2>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed">
            Have questions about our fragrances? Need help choosing the perfect scent? <br className="hidden md:block"/>
            We’re here to assist you — anytime you need us.
          </p>
        </div>

        {/* 🔥 MAIN GRID: Contact Info (Left) & Form (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 mb-20">
          
          {/* LEFT COLUMN: Contact Details (Takes 2 columns on large screen) */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Direct Contact */}
            <div>
              <h3 className="text-xs uppercase tracking-widest text-purple-400 font-bold mb-6">Talk to Us Directly</h3>
              <div className="space-y-4">
                <a href={`https://wa.me/${ADMIN_WHATSAPP}`} target="_blank" rel="noreferrer" className="flex items-start gap-4 p-4 rounded-xl bg-[#0a0a0a] border border-white/5 hover:border-green-500/50 hover:bg-[#111] transition-all group">
                  <MessageCircle className="w-6 h-6 text-green-500 mt-1 shrink-0 group-hover:scale-110 transition-transform"/>
                  <div>
                    <p className="font-bold text-white mb-1">WhatsApp</p>
                    <p className="text-sm text-gray-400">Chat with us instantly</p>
                  </div>
                </a>
                
                <a href="tel:+918777789394" className="flex items-start gap-4 p-4 rounded-xl bg-[#0a0a0a] border border-white/5 hover:border-white/20 hover:bg-[#111] transition-all group">
                  <Phone className="w-6 h-6 text-gray-300 mt-1 shrink-0 group-hover:scale-110 transition-transform"/>
                  <div>
                    <p className="font-bold text-white mb-1">Phone</p>
                    <p className="text-sm text-gray-400">+91 87777 89394</p>
                  </div>
                </a>

                <a href="mailto:perfectfumeofficial@gmail.com" className="flex items-start gap-4 p-4 rounded-xl bg-[#0a0a0a] border border-white/5 hover:border-white/20 hover:bg-[#111] transition-all group">
                  <Mail className="w-6 h-6 text-gray-300 mt-1 shrink-0 group-hover:scale-110 transition-transform"/>
                  <div>
                    <p className="font-bold text-white mb-1">Email</p>
                    <p className="text-sm text-gray-400 break-all">perfectfumeofficial@gmail.com</p>
                  </div>
                </a>
              </div>
              <p className="text-xs text-gray-500 mt-4 italic">* We usually respond within a few hours.</p>
            </div>

            {/* Business Info */}
            <div>
              <h3 className="text-xs uppercase tracking-widest text-purple-400 font-bold mb-6">Business Information</h3>
              <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-xl space-y-5">
                <div className="flex items-center gap-4">
                  <Package className="w-5 h-5 text-gray-500" />
                  <div><p className="text-xs text-gray-500 uppercase">Brand Name</p><p className="font-medium text-gray-200">Perfect Fume</p></div>
                </div>
                <div className="flex items-center gap-4">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <div><p className="text-xs text-gray-500 uppercase">Location</p><p className="font-medium text-gray-200">Kolkata, India</p></div>
                </div>
                <div className="flex items-center gap-4">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <div><p className="text-xs text-gray-500 uppercase">Working Hours</p><p className="font-medium text-gray-200">10:00 AM – 8:00 PM (All Days)</p></div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: The Form (Takes 3 columns on large screen) */}
          <div className="lg:col-span-3">
            <div className="bg-[#0a0a0a] border border-white/5 p-6 md:p-10 rounded-2xl h-full">
              <h3 className="text-2xl font-bold mb-2 text-white">Send Us a Message</h3>
              <p className="text-gray-400 text-sm mb-8">Fill out the form below and our team will get back to you as soon as possible.</p>
              
              <form onSubmit={handleSendMessage} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-bold">Name *</label>
                    <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3.5 text-white outline-none focus:border-purple-500 transition-colors text-sm" placeholder="Your full name" />
                  </div>
                  
                  {/* Phone */}
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-bold">Phone (Optional)</label>
                    <input type="number" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3.5 text-white outline-none focus:border-purple-500 transition-colors text-sm" placeholder="10-digit number" />
                  </div>
                </div>
                
                {/* Email */}
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-bold">Email *</label>
                  <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3.5 text-white outline-none focus:border-purple-500 transition-colors text-sm" placeholder="youremail@example.com" />
                </div>
                
                {/* Message */}
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-bold">Message *</label>
                  <textarea required rows={5} value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3.5 text-white outline-none focus:border-purple-500 transition-colors text-sm resize-none" placeholder="How can we help you?"></textarea>
                </div>
                
                {/* Submit Button */}
                <button type="submit" className="w-full bg-white hover:bg-purple-600 text-black hover:text-white font-bold py-4 rounded-lg transition-colors flex justify-center items-center gap-2 mt-4">
                  Send Message <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

        </div>

        {/* 🔥 BOTTOM ACTION CARDS */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <div className="bg-[#0a0a0a] border border-white/5 p-6 md:p-8 rounded-2xl hover:border-white/10 transition-colors">
            <h4 className="text-lg font-bold mb-3 text-white">Need Help Faster?</h4>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">For quick assistance, we recommend reaching out via WhatsApp. Our team is ready to help.</p>
            <a href={`https://wa.me/${ADMIN_WHATSAPP}`} target="_blank" rel="noreferrer" className="text-green-400 font-bold hover:text-green-300 text-sm flex items-center gap-2">
              Chat Now on WhatsApp <ArrowRight className="w-4 h-4"/>
            </a>
          </div>

          <div className="bg-[#0a0a0a] border border-white/5 p-6 md:p-8 rounded-2xl hover:border-white/10 transition-colors">
            <h4 className="text-lg font-bold mb-3 text-white">Track Your Order</h4>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">Already placed an order? You can easily track your real-time delivery status here.</p>
            <a href="/track-order" className="text-white font-bold hover:text-purple-400 text-sm flex items-center gap-2 transition-colors">
              Track Order <ArrowRight className="w-4 h-4"/>
            </a>
          </div>

          <div className="bg-[#0a0a0a] border border-white/5 p-6 md:p-8 rounded-2xl hover:border-white/10 transition-colors md:col-span-2 lg:col-span-1">
            <h4 className="text-lg font-bold mb-3 text-white">Frequently Asked Questions</h4>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">Have common questions about delivery, returns, or product details? Find answers instantly.</p>
            <a href="/faq" className="text-white font-bold hover:text-purple-400 text-sm flex items-center gap-2 transition-colors">
              Visit FAQ Page <ArrowRight className="w-4 h-4"/>
            </a>
          </div>
        </div>

        {/* 🔥 FOOTER NOTE */}
        <div className="text-center pt-10 border-t border-white/10">
          <h3 className="text-xl font-bold mb-6 text-white">Follow Us</h3>
          <div className="flex justify-center gap-4 mb-10">
            <a href="#" className="p-3 bg-[#0a0a0a] border border-white/10 rounded-full hover:bg-white hover:text-black transition-all text-gray-400"><Instagram className="w-5 h-5" /></a>
            <a href="#" className="p-3 bg-[#0a0a0a] border border-white/10 rounded-full hover:bg-white hover:text-black transition-all text-gray-400"><Facebook className="w-5 h-5" /></a>
          </div>

          <div className="max-w-2xl mx-auto">
            <h4 className="text-lg font-bold text-white mb-2 italic">We’re Here for You</h4>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              At Perfect Fume, customer satisfaction is our priority. Whether it’s a question, feedback, or support — we’re always just one message away.
            </p>
            <p className="text-purple-400 font-bold text-sm">Your perfect fragrance journey starts with us. ✨</p>
          </div>
        </div>

      </main>
    </div>
  );
};

export default Contact;
