import React from 'react';
import { Search, ShoppingCart, User, Menu } from 'lucide-react'; // lucide-react icons use korchi

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-lg border-b border-white/10 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Logo & Menu */}
        <div className="flex items-center gap-2">
          <Menu className="text-white md:hidden cursor-pointer" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            PERFECT FUME
          </h1>
        </div>

        {/* Center: Search Bar (Flipkart Style) */}
        <div className="hidden md:flex flex-1 max-w-2xl relative">
          <input 
            type="text" 
            placeholder="Search for premium perfumes..." 
            className="w-full bg-white/10 border border-white/20 rounded-md py-2 px-4 pl-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
        </div>

        {/* Right: Icons */}
        <div className="flex items-center gap-6 text-white">
          <div className="flex flex-col items-center cursor-pointer hover:text-purple-400 transition-colors">
            <User className="w-6 h-6" />
            <span className="text-[10px] hidden md:block">Account</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer hover:text-purple-400 transition-colors relative">
            <ShoppingCart className="w-6 h-6" />
            <span className="text-[10px] hidden md:block">Cart</span>
            <span className="absolute -top-1 -right-2 bg-pink-600 text-[10px] rounded-full w-4 h-4 flex items-center justify-center">0</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

