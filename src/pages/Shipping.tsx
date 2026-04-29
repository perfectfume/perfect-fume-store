import React, { useEffect } from 'react';
import { Truck, Clock, MapPin, PackageSearch, AlertTriangle, ShieldCheck, Banknote, PackageCheck, Mail, HelpCircle } from 'lucide-react';

const ShippingPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-24 font-sans">
      <main className="max-w-4xl mx-auto px-4">
        
        {/* 🔥 HEADER SECTION */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="w-16 h-16 bg-blue-900/30 rounded-2xl flex items-center justify-center border border-blue-500/30 mx-auto mb-6">
            <Truck className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold italic mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
            Shipping Policy
          </h1>
          <h2 className="text-xl font-bold mb-4 text-white">Fast, Safe & Reliable Delivery</h2>
          <p className="text-gray-400 leading-relaxed max-w-2xl mx-auto">
            At Perfect Fume, we are committed to delivering your favorite fragrances quickly and securely. This Shipping Policy outlines how we process and deliver your orders.
          </p>
        </div>

        {/* 🔥 POLICY CONTENT */}
        <div className="space-y-6 animate-in fade-in duration-700 delay-200">
          
          {/* Top Info Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Order Processing */}
            <div className="bg-[#111] p-6 md:p-8 rounded-3xl border border-white/5">
              <h3 className="text-xl font-bold mb-4 text-blue-400 flex items-center gap-3">
                <Clock className="w-6 h-6" /> Order Processing Time
              </h3>
              <ul className="space-y-3 text-sm md:text-base text-gray-300">
                <li className="flex items-start gap-2"><span className="text-blue-500 mt-1">•</span> All orders are processed within 24–48 hours after confirmation.</li>
                <li className="flex items-start gap-2"><span className="text-blue-500 mt-1">•</span> Orders placed on Sundays or public holidays may be processed on the next working day.</li>
                <li className="flex items-start gap-2"><span className="text-blue-500 mt-1">•</span> You will receive a confirmation message once your order is successfully placed.</li>
              </ul>
            </div>

            {/* Delivery Time */}
            <div className="bg-[#111] p-6 md:p-8 rounded-3xl border border-white/5">
              <h3 className="text-xl font-bold mb-4 text-blue-400 flex items-center gap-3">
                <MapPin className="w-6 h-6" /> Delivery Time
              </h3>
              <div className="space-y-4 mb-4">
                <div className="bg-black p-4 rounded-xl border border-white/5 flex justify-between items-center">
                  <span className="font-bold text-gray-300">Metro Cities</span>
                  <span className="text-blue-400 font-bold">2–4 business days</span>
                </div>
                <div className="bg-black p-4 rounded-xl border border-white/5 flex justify-between items-center">
                  <span className="font-bold text-gray-300">Other Locations</span>
                  <span className="text-blue-400 font-bold">3–7 business days</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 italic">
                Delivery times may vary depending on your location, courier availability, and external factors.
              </p>
            </div>
          </div>

          {/* Shipping Charges & Coverage */}
          <div className="bg-gradient-to-r from-blue-900/20 to-[#111] p-6 md:p-8 rounded-3xl border border-blue-500/20 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-white">Shipping Charges</h3>
              <div className="space-y-2 mb-4">
                <p className="flex items-center gap-2 text-green-400 font-bold">
                  <ShieldCheck className="w-5 h-5" /> Free Shipping on orders above ₹999
                </p>
                <p className="text-gray-400 text-sm">
                  • A standard shipping fee may apply to orders below this amount.
                </p>
              </div>
              <p className="text-xs text-gray-500 italic">All applicable shipping charges will be clearly shown at checkout.</p>
            </div>
            <div className="border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-8">
              <h3 className="text-xl font-bold mb-3 text-white">Delivery Coverage</h3>
              <p className="text-gray-300 text-sm mb-2">We offer PAN India delivery across most serviceable locations.</p>
              <p className="text-gray-500 text-sm italic">However, deliveries to remote or non-serviceable areas may take additional time.</p>
            </div>
          </div>

          {/* Logistics & Tracking */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#111] p-6 rounded-3xl border border-white/5 md:col-span-2">
              <h3 className="text-xl font-bold mb-4 text-blue-400 flex items-center gap-3">
                <PackageSearch className="w-6 h-6" /> Order Tracking & Partners
              </h3>
              <ul className="space-y-3 text-sm text-gray-300 mb-4">
                <li>• Once your order is shipped, you will receive a tracking update via SMS or email.</li>
                <li>• You can also track your order anytime through our <a href="/track-order" className="text-blue-400 hover:underline">Track Order page</a>.</li>
              </ul>
              <p className="text-sm text-gray-400 border-t border-white/5 pt-4 mt-4">
                <strong>Courier Partners:</strong> We work with trusted logistics partners to ensure timely and safe delivery of your orders.
              </p>
            </div>

            <div className="bg-[#111] p-6 rounded-3xl border border-white/5 space-y-6">
              <div>
                <h3 className="text-lg font-bold mb-2 text-white flex items-center gap-2">
                  <Banknote className="w-5 h-5 text-green-400" /> Cash on Delivery
                </h3>
                <p className="text-xs text-gray-400">COD is available on selected orders and locations. Order confirmation may be required before dispatch.</p>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2 text-white flex items-center gap-2">
                  <PackageCheck className="w-5 h-5 text-purple-400" /> Secure Packaging
                </h3>
                <p className="text-xs text-gray-400">All orders are carefully packed to ensure your products arrive in perfect condition.</p>
              </div>
            </div>
          </div>

          {/* Exceptions & Issues */}
          <div className="bg-[#111] p-6 md:p-8 rounded-3xl border border-white/5">
            <h3 className="text-xl font-bold mb-6 text-red-400 flex items-center gap-3">
              <AlertTriangle className="w-6 h-6" /> Delivery Exceptions & Issues
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-black p-4 rounded-xl border border-white/5">
                  <h4 className="font-bold text-white mb-2 text-sm">Delivery Delays</h4>
                  <p className="text-xs text-gray-400">While we strive to deliver on time, delays may occur due to weather conditions, high order volume (festivals/sales), or courier issues. We appreciate your patience.</p>
                </div>
                <div className="bg-black p-4 rounded-xl border border-white/5">
                  <h4 className="font-bold text-white mb-2 text-sm">Failed Delivery Attempts</h4>
                  <p className="text-xs text-gray-400">If you are unavailable at the time of delivery, the courier may attempt delivery again. After multiple failed attempts, the order may be returned to us.</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-black p-4 rounded-xl border border-white/5 border-l-4 border-l-yellow-500">
                  <h4 className="font-bold text-white mb-2 text-sm">Incorrect Address</h4>
                  <p className="text-xs text-gray-400">Please ensure that your shipping details are accurate. Perfect Fume is not responsible for delays or failed deliveries caused by incorrect or incomplete addresses.</p>
                </div>
                <div className="bg-black p-4 rounded-xl border border-white/5 border-l-4 border-l-red-500">
                  <h4 className="font-bold text-white mb-2 text-sm">Damaged or Lost Orders</h4>
                  <p className="text-xs text-gray-400">If you receive a damaged product, please contact us within 24 hours with proper proof (photos/videos). In case of lost shipments, we will assist you with a resolution.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact & Footer Info */}
          <div className="text-center mt-12 bg-black p-8 rounded-3xl border border-white/5">
            <HelpCircle className="w-8 h-8 text-blue-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4 text-white">Contact Us</h3>
            <p className="text-gray-400 mb-6 max-w-lg mx-auto text-sm">
              If you have any questions regarding shipping or delivery, feel free to reach out to our support team.
            </p>
            
            <div className="flex flex-col md:flex-row justify-center gap-6 mb-8">
              <div className="flex items-center justify-center gap-2 text-gray-300 bg-[#111] px-4 py-2 rounded-full text-sm">
                <Mail className="w-4 h-4 text-blue-400" /> perfectfumeofficial@gmail.com
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-300 bg-[#111] px-4 py-2 rounded-full text-sm">
                <MapPin className="w-4 h-4 text-blue-400" /> Kolkata, India
              </div>
            </div>

            <div className="border-t border-white/10 pt-6">
              <h3 className="text-xl font-bold italic text-blue-400 mb-2">Thank You for Choosing Perfect Fume</h3>
              <p className="text-gray-300 text-sm">We aim to deliver not just products, but a great experience — right to your doorstep 🚚</p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default ShippingPolicy;
                                                                                                                                           
