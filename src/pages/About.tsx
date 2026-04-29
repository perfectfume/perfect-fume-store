import React, { useEffect } from 'react';
import { Target, Eye, Clock, Droplets, Sparkles, Star, Truck, Quote, ArrowRight } from 'lucide-react';

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-20 pb-24 font-sans">
      <main className="max-w-6xl mx-auto px-4">
        
        {/* 🔥 HERO SECTION */}
        <div className="relative w-full rounded-3xl overflow-hidden mb-16 border border-white/10 bg-gradient-to-br from-purple-900/20 to-[#050505] p-8 md:p-16 text-center md:text-left flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h1 className="text-3xl md:text-5xl font-bold italic mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              About Perfect Fume
            </h1>
            <h2 className="text-xl md:text-2xl font-bold mb-6 text-white leading-tight">
              We Don’t Just Sell Perfume, <br className="hidden md:block"/> We Create Identity.
            </h2>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-4 max-w-2xl">
              At Perfect Fume, fragrance is more than just a scent — it’s a statement. A reflection of your personality. A memory that lingers even after you leave.
            </p>
            <p className="text-purple-300 font-medium text-sm md:text-base italic">
              We believe everyone deserves a signature scent that defines who they are.
            </p>
          </div>
          <div className="hidden md:block w-1/3">
            <div className="w-full h-64 bg-black rounded-2xl border border-white/10 overflow-hidden relative">
              <img src="https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800&auto=format&fit=crop" alt="Perfect Fume Identity" className="w-full h-full object-cover opacity-80 hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent"></div>
            </div>
          </div>
        </div>

        {/* 🔥 OUR STORY */}
        <div className="mb-16 md:px-8 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 flex items-center justify-center gap-3">
            <span className="w-12 h-[1px] bg-purple-500"></span>
            Our Story
            <span className="w-12 h-[1px] bg-purple-500"></span>
          </h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            Perfect Fume was born from a simple frustration — perfumes that fade too quickly and fail to leave an impression.
          </p>
          <p className="text-gray-300 leading-relaxed mb-4">
            We wanted something better. <span className="text-white font-bold">Something bold. Something long-lasting. Something unforgettable.</span> So we decided to build it ourselves.
          </p>
          <p className="text-gray-300 leading-relaxed">
            What started as an idea has now become a growing brand focused on delivering premium fragrances that not only smell amazing but also stay with you throughout the day.
          </p>
        </div>

        {/* 🔥 MISSION & VISION (Grid) */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <div className="bg-[#111] border border-white/5 p-8 rounded-2xl hover:border-purple-500/30 transition-all group">
            <div className="w-14 h-14 bg-purple-900/30 rounded-full flex items-center justify-center mb-6 border border-purple-500/30 group-hover:scale-110 transition-transform">
              <Target className="w-7 h-7 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
            <p className="text-gray-400 leading-relaxed">
              To provide high-quality, long-lasting perfumes that make you feel confident, powerful, and unique — without breaking the bank.
            </p>
          </div>

          <div className="bg-[#111] border border-white/5 p-8 rounded-2xl hover:border-blue-500/30 transition-all group">
            <div className="w-14 h-14 bg-blue-900/30 rounded-full flex items-center justify-center mb-6 border border-blue-500/30 group-hover:scale-110 transition-transform">
              <Eye className="w-7 h-7 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
            <p className="text-gray-400 leading-relaxed">
              To become one of the most trusted and loved perfume brands, known for quality, consistency, and unforgettable fragrances.
            </p>
          </div>
        </div>

        {/* 🔥 WHY CHOOSE US & PHILOSOPHY */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16 items-center">
          
          {/* Why Choose Us */}
          <div className="bg-gradient-to-br from-[#111] to-black border border-white/10 p-8 rounded-3xl">
            <h3 className="text-2xl font-bold mb-6">Why Choose Perfect Fume?</h3>
            <div className="space-y-5">
              <div className="flex items-center gap-4"><div className="p-2 bg-purple-900/20 rounded-lg text-purple-400"><Clock className="w-5 h-5"/></div><p className="font-medium text-gray-200">Long-Lasting Fragrance</p></div>
              <div className="flex items-center gap-4"><div className="p-2 bg-purple-900/20 rounded-lg text-purple-400"><Droplets className="w-5 h-5"/></div><p className="font-medium text-gray-200">Premium Quality Oils</p></div>
              <div className="flex items-center gap-4"><div className="p-2 bg-purple-900/20 rounded-lg text-purple-400"><Sparkles className="w-5 h-5"/></div><p className="font-medium text-gray-200">Luxury Feel at Affordable Price</p></div>
              <div className="flex items-center gap-4"><div className="p-2 bg-purple-900/20 rounded-lg text-purple-400"><Star className="w-5 h-5"/></div><p className="font-medium text-gray-200">Carefully Curated Scents</p></div>
              <div className="flex items-center gap-4"><div className="p-2 bg-purple-900/20 rounded-lg text-purple-400"><Truck className="w-5 h-5"/></div><p className="font-medium text-gray-200">Fast & Reliable Delivery</p></div>
            </div>
            <p className="mt-8 text-sm italic text-purple-300 border-l-2 border-purple-500 pl-4">
              "We don’t believe in ordinary. Every fragrance we offer is designed to stand out."
            </p>
          </div>

          {/* Philosophy */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Our Philosophy</h3>
            <p className="text-xl font-medium text-purple-400 mb-6 italic">"A great perfume isn’t just worn — it’s experienced."</p>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Each Perfect Fume fragrance is crafted with attention to detail, blending top, heart, and base notes to create a complete sensory journey.
            </p>
            <p className="text-gray-300 mb-8 leading-relaxed">
              From fresh and energetic to deep and intense, our collection is designed to match every mood and moment.
            </p>
            
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
              <h4 className="font-bold mb-2">Trusted by a Growing Community</h4>
              <p className="text-sm text-gray-400">
                Perfect Fume is quickly becoming a favorite among fragrance lovers who value quality and performance. With every order, we aim to deliver not just a product, but an experience worth remembering.
              </p>
            </div>
          </div>
        </div>

        {/* 🔥 FOUNDER MESSAGE */}
        <div className="bg-gradient-to-r from-purple-900/30 to-black border border-purple-500/20 rounded-3xl p-8 md:p-12 mb-16 text-center relative overflow-hidden">
          <Quote className="absolute top-4 left-4 w-24 h-24 text-white/5 rotate-180" />
          <p className="text-xl md:text-3xl font-medium italic text-white relative z-10 leading-snug mb-6">
            “I didn’t create Perfect Fume just to sell perfumes. <br className="hidden md:block"/> I created it to help people express themselves without saying a word.”
          </p>
          <div className="flex flex-col items-center justify-center">
            <div className="w-12 h-1 bg-purple-500 mb-3"></div>
            <p className="font-bold text-lg tracking-widest text-purple-400 uppercase">A Message from the Founder</p>
          </div>
        </div>

        {/* 🔥 CALL TO ACTION */}
        <div className="text-center py-8">
          <h2 className="text-3xl font-bold mb-4">Discover Your Signature Scent</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Your presence should be unforgettable. Your fragrance should speak before you do. Explore Perfect Fume and find the scent that defines you.
          </p>
          <button 
            onClick={() => window.location.href = '/shop'} 
            className="bg-white text-black px-8 py-4 rounded-full font-bold text-sm md:text-base hover:bg-purple-600 hover:text-white transition-all shadow-xl shadow-purple-900/20 flex items-center gap-2 mx-auto"
          >
            Explore Collection <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </main>
    </div>
  );
};

export default About;

