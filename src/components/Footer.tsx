import React from 'react';
import { Instagram, Facebook, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#050505] border-t border-white/10 pt-16 pb-24 md:pb-8 text-gray-400 font-sans z-30 relative">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* 1. Brand Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold italic text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 tracking-wider">
            PERFECT FUME
          </h2>
          <p className="text-sm leading-relaxed">
            We Don’t Just Sell Perfume, We Create Identity. Discover your signature scent.
          </p>
          <div className="flex gap-4 pt-2">
            <a href="#" className="hover:text-purple-400 transition-colors"><Instagram className="w-5 h-5"/></a>
            <a href="#" className="hover:text-blue-400 transition-colors"><Facebook className="w-5 h-5"/></a>
          </div>
        </div>

        {/* 2. Quick Links */}
        <div>
          <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Quick Links</h3>
          <ul className="space-y-3 text-sm">
            <li><a href="/shop" className="hover:text-purple-400 transition-colors">Shop Collection</a></li>
            <li><a href="/about" className="hover:text-purple-400 transition-colors">About Us</a></li>
            <li><a href="/contact" className="hover:text-purple-400 transition-colors">Contact Us</a></li>
            <li><a href="/track-order" className="hover:text-purple-400 transition-colors font-bold text-gray-300">Track Order</a></li>
          </ul>
        </div>

        {/* 3. Policies & Support */}
        <div>
          <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Policies & Support</h3>
          <ul className="space-y-3 text-sm">
            <li><a href="/faq" className="hover:text-purple-400 transition-colors">FAQ</a></li>
            <li><a href="/privacy-policy" className="hover:text-purple-400 transition-colors">Privacy Policy</a></li>
            <li><a href="/shipping-policy" className="hover:text-purple-400 transition-colors">Shipping Policy</a></li>
            <li><a href="/refund-policy" className="hover:text-purple-400 transition-colors">Refund & Return Policy</a></li>
          </ul>
        </div>

        {/* 4. Contact */}
        <div>
          <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Get in Touch</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex items-center gap-3"><Phone className="w-4 h-4 text-purple-400"/> +91 87777 89394</li>
            <li className="flex items-center gap-3"><Mail className="w-4 h-4 text-purple-400"/> perfectfumeofficial@gmail.com</li>
            <li className="flex items-center gap-3"><MapPin className="w-4 h-4 text-purple-400"/> Kolkata, India</li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-12 pt-6 border-t border-white/5 text-center text-xs text-gray-500">
        <p>&copy; 2026 Perfect Fume. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
