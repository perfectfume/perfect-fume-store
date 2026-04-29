import React, { useEffect } from 'react';
import { RefreshCcw, CheckCircle2, XCircle, Clock, Video, ListOrdered, CreditCard, XOctagon, Truck, AlertCircle, Mail, MapPin } from 'lucide-react';

const RefundPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-24 font-sans">
      <main className="max-w-4xl mx-auto px-4">
        
        {/* 🔥 HEADER SECTION */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="w-16 h-16 bg-pink-900/30 rounded-2xl flex items-center justify-center border border-pink-500/30 mx-auto mb-6">
            <RefreshCcw className="w-8 h-8 text-pink-400" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold italic mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-600">
            Refund & Return Policy
          </h1>
          <h2 className="text-xl font-bold mb-4 text-white">Customer Satisfaction is Our Priority</h2>
          <p className="text-gray-400 leading-relaxed max-w-2xl mx-auto">
            At Perfect Fume, we aim to provide you with the best fragrance experience. However, if you face any issue with your order, we are here to help.
          </p>
          <div className="mt-6 inline-block bg-white/5 border border-white/10 px-6 py-3 rounded-full text-sm text-gray-300">
            Please read our return and refund policy carefully.
          </div>
        </div>

        <div className="space-y-8 animate-in fade-in duration-700 delay-200">
          
          {/* 🔥 ELIGIBILITY VS NON-RETURNABLE (Side by Side) */}
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Eligible */}
            <div className="bg-gradient-to-br from-[#111] to-black p-6 md:p-8 rounded-3xl border border-green-500/20">
              <h3 className="text-xl font-bold mb-6 text-green-400 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6" /> Return Eligibility
              </h3>
              <p className="text-sm text-gray-400 mb-4">We accept returns or replacements only under the following conditions:</p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-gray-200 bg-green-900/10 p-3 rounded-xl border border-green-500/10">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /> Damaged product received
                </li>
                <li className="flex items-center gap-3 text-gray-200 bg-green-900/10 p-3 rounded-xl border border-green-500/10">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /> Wrong item delivered
                </li>
                <li className="flex items-center gap-3 text-gray-200 bg-green-900/10 p-3 rounded-xl border border-green-500/10">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /> Leakage or defective product
                </li>
              </ul>
            </div>

            {/* Non-Returnable */}
            <div className="bg-gradient-to-br from-[#111] to-black p-6 md:p-8 rounded-3xl border border-red-500/20">
              <h3 className="text-xl font-bold mb-6 text-red-400 flex items-center gap-2">
                <XCircle className="w-6 h-6" /> Non-Returnable Conditions
              </h3>
              <p className="text-sm text-gray-400 mb-4">We do not accept returns in the following cases:</p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-gray-200 bg-red-900/10 p-3 rounded-xl border border-red-500/10">
                  <XCircle className="w-5 h-5 text-red-500 shrink-0" /> Product has been used
                </li>
                <li className="flex items-center gap-3 text-gray-200 bg-red-900/10 p-3 rounded-xl border border-red-500/10">
                  <XCircle className="w-5 h-5 text-red-500 shrink-0" /> Product is opened or tampered with
                </li>
                <li className="flex items-center gap-3 text-gray-200 bg-red-900/10 p-3 rounded-xl border border-red-500/10">
                  <XCircle className="w-5 h-5 text-red-500 shrink-0" /> Fragrance not liked / personal preference
                </li>
                <li className="flex items-center gap-3 text-gray-200 bg-red-900/10 p-3 rounded-xl border border-red-500/10">
                  <XCircle className="w-5 h-5 text-red-500 shrink-0" /> Minor packaging damage (without affecting product)
                </li>
              </ul>
            </div>

          </div>

          {/* 🔥 TIME LIMIT & PROOF REQUIRED */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#111] p-6 rounded-3xl border border-white/5">
              <h3 className="text-lg font-bold mb-4 text-pink-400 flex items-center gap-2"><Clock className="w-5 h-5" /> Return Request Time</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• You must raise a return request within <strong className="text-white">24 hours</strong> of delivery.</li>
                <li>• Requests made after this period may not be accepted.</li>
              </ul>
            </div>
            
            <div className="bg-[#111] p-6 rounded-3xl border border-white/5 border-l-4 border-l-pink-500">
              <h3 className="text-lg font-bold mb-4 text-pink-400 flex items-center gap-2"><Video className="w-5 h-5" /> Proof Requirement</h3>
              <p className="text-sm text-gray-400 mb-3">To process your return request, you must provide:</p>
              <ul className="space-y-2 text-sm text-gray-300 mb-3 font-bold">
                <li>1. Clear unboxing video</li>
                <li>2. Photos of the product showing the issue</li>
              </ul>
              <p className="text-xs text-gray-500 italic">Without proper proof, we may not be able to process your request.</p>
            </div>
          </div>

          {/* 🔥 RETURN PROCESS */}
          <div className="bg-[#111] p-6 md:p-8 rounded-3xl border border-white/5">
            <h3 className="text-xl font-bold mb-6 text-pink-400 flex items-center gap-2">
              <ListOrdered className="w-6 h-6" /> Return & Refund Process
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                "Contact our support team with your issue",
                "Share required proof (video/photos)",
                "Our team will review and verify the request",
                "Once approved, we will initiate a replacement or refund"
              ].map((step, i) => (
                <div key={i} className="bg-black p-5 rounded-2xl border border-white/5 relative flex flex-col items-center text-center">
                  <div className="w-8 h-8 rounded-full bg-pink-900/30 text-pink-400 flex items-center justify-center font-bold mb-3 border border-pink-500/30">
                    {i + 1}
                  </div>
                  <p className="text-sm text-gray-300">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 🔥 REFUND METHODS & CANCELLATION */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#111] p-6 rounded-3xl border border-white/5 space-y-6">
              <div>
                <h3 className="text-lg font-bold mb-3 text-pink-400 flex items-center gap-2"><CreditCard className="w-5 h-5" /> Refund Method</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between bg-black p-3 rounded-lg border border-white/5">
                    <span className="text-gray-400">Online payments</span>
                    <span className="font-bold">Original payment method</span>
                  </div>
                  <div className="flex justify-between bg-black p-3 rounded-lg border border-white/5">
                    <span className="text-gray-400">Cash on Delivery (COD)</span>
                    <span className="font-bold">Refunded via UPI / Bank</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-bold mb-2 text-white">Refund Timeline</h3>
                <p className="text-sm text-gray-400">• Refunds are processed within 5–7 business days after approval.</p>
                <p className="text-sm text-gray-400">• Bank processing time may vary.</p>
              </div>
            </div>

            <div className="bg-[#111] p-6 rounded-3xl border border-white/5 space-y-6">
              <div>
                <h3 className="text-lg font-bold mb-2 text-pink-400 flex items-center gap-2"><XOctagon className="w-5 h-5" /> Order Cancellation</h3>
                <p className="text-sm text-gray-400">• Orders can be cancelled before they are shipped.</p>
                <p className="text-sm text-gray-400">• Once shipped, cancellation is not possible.</p>
              </div>
              
              <div>
                <h3 className="text-lg font-bold mb-2 text-white flex items-center gap-2"><Truck className="w-4 h-4 text-gray-400" /> Return Shipping</h3>
                <p className="text-sm text-gray-400">• If the issue is genuine (damage/wrong item), we will handle the return process.</p>
                <p className="text-sm text-gray-400">• In other cases, return shipping charges may apply.</p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-2 text-white">Replacement Option</h3>
                <p className="text-sm text-gray-400 italic">In most cases, we may offer a replacement product instead of a refund, depending on availability.</p>
              </div>
            </div>
          </div>

          {/* 🔥 IMPORTANT NOTES */}
          <div className="bg-gradient-to-r from-yellow-900/20 to-[#111] p-6 rounded-3xl border border-yellow-500/20">
            <h3 className="text-lg font-bold mb-4 text-yellow-500 flex items-center gap-2"><AlertCircle className="w-5 h-5" /> Important Notes</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• All return requests are subject to verification.</li>
              <li>• False or misleading claims will not be accepted.</li>
              <li>• We reserve the right to reject any request that does not meet our policy criteria.</li>
            </ul>
          </div>

          {/* 🔥 FOOTER */}
          <div className="text-center mt-12 bg-black p-8 rounded-3xl border border-white/5">
            <h3 className="text-2xl font-bold mb-4 text-white">Contact Us</h3>
            <p className="text-gray-400 mb-6 text-sm">For any return or refund queries, please contact us:</p>
            
            <div className="flex flex-col md:flex-row justify-center gap-6 mb-8">
              <div className="flex items-center justify-center gap-2 text-gray-300 bg-[#111] px-4 py-2 rounded-full text-sm">
                <Mail className="w-4 h-4 text-pink-400" /> perfectfumeofficial@gmail.com
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-300 bg-[#111] px-4 py-2 rounded-full text-sm">
                <MapPin className="w-4 h-4 text-pink-400" /> Kolkata, India
              </div>
            </div>

            <div className="border-t border-white/10 pt-6">
              <h3 className="text-xl font-bold italic text-pink-400 mb-2">Thank You for Choosing Perfect Fume</h3>
              <p className="text-gray-300 text-sm">We are committed to delivering quality and ensuring a smooth shopping experience for you ✨</p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default RefundPolicy;
  
