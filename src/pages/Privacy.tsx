import React, { useEffect } from 'react';
import { ShieldCheck, Lock, Database, Share2, Cookie, UserCheck, AlertTriangle, Mail, Calendar, CheckCircle2 } from 'lucide-react';

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-24 font-sans">
      <main className="max-w-4xl mx-auto px-4">
        
        {/* 🔥 HEADER SECTION */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="w-16 h-16 bg-purple-900/30 rounded-2xl flex items-center justify-center border border-purple-500/30 mx-auto mb-6">
            <ShieldCheck className="w-8 h-8 text-purple-400" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold italic mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Privacy Policy
          </h1>
          <h2 className="text-xl font-bold mb-4 text-white">Your Privacy Matters to Us</h2>
          <p className="text-gray-400 leading-relaxed max-w-2xl mx-auto">
            At Perfect Fume, we value your trust and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you visit or make a purchase from our website.
          </p>
          <div className="mt-6 inline-block bg-white/5 border border-white/10 px-6 py-3 rounded-full text-sm text-gray-300">
            By using our website, you agree to the terms outlined in this policy.
          </div>
        </div>

        {/* 🔥 POLICY CONTENT */}
        <div className="space-y-8 animate-in fade-in duration-700 delay-200">
          
          {/* 1. Information We Collect */}
          <div className="bg-[#111] p-6 md:p-8 rounded-3xl border border-white/5">
            <h3 className="text-2xl font-bold mb-6 text-purple-400 flex items-center gap-3">
              <Database className="w-6 h-6" /> Information We Collect
            </h3>
            <p className="text-gray-400 mb-6">When you use our website, we may collect the following types of information:</p>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-black p-5 rounded-2xl border border-white/5">
                <h4 className="font-bold text-white mb-3">Personal Information</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>• Full Name</li>
                  <li>• Email Address</li>
                  <li>• Phone Number</li>
                  <li>• Shipping & Billing Address</li>
                </ul>
              </div>
              <div className="bg-black p-5 rounded-2xl border border-white/5">
                <h4 className="font-bold text-white mb-3">Payment Information</h4>
                <p className="text-sm text-gray-400 leading-relaxed">
                  We accept payments through secure third-party payment gateways. We <strong>do not</strong> store your card, UPI, or banking details on our servers.
                </p>
              </div>
              <div className="bg-black p-5 rounded-2xl border border-white/5">
                <h4 className="font-bold text-white mb-3">Technical Information</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>• IP Address</li>
                  <li>• Browser Type</li>
                  <li>• Device Information</li>
                  <li>• Pages visited and interaction data</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 2. How We Use Your Information */}
          <div className="bg-[#111] p-6 md:p-8 rounded-3xl border border-white/5">
            <h3 className="text-2xl font-bold mb-6 text-purple-400 flex items-center gap-3">
              <UserCheck className="w-6 h-6" /> How We Use Your Information
            </h3>
            <p className="text-gray-400 mb-4">We use your information for the following purposes:</p>
            <ul className="space-y-3">
              {["To process and deliver your orders", "To communicate order updates and support", "To improve our website and user experience", "To send promotional offers (only if you opt-in)", "To prevent fraud and ensure secure transactions"].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-300">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Sharing of Information */}
          <div className="bg-[#111] p-6 md:p-8 rounded-3xl border border-white/5">
            <h3 className="text-2xl font-bold mb-4 text-purple-400 flex items-center gap-3">
              <Share2 className="w-6 h-6" /> Sharing of Information
            </h3>
            <p className="text-gray-300 font-bold mb-4">We respect your privacy and do not sell your personal data.</p>
            <p className="text-gray-400 mb-4">Your information may be shared only with:</p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-black p-4 rounded-xl border border-white/5 text-center">
                <p className="text-sm text-gray-300">Trusted courier and logistics partners (for delivery)</p>
              </div>
              <div className="bg-black p-4 rounded-xl border border-white/5 text-center">
                <p className="text-sm text-gray-300">Payment gateway providers (for secure transactions)</p>
              </div>
              <div className="bg-black p-4 rounded-xl border border-white/5 text-center">
                <p className="text-sm text-gray-300">Legal authorities (if required by law)</p>
              </div>
            </div>
          </div>

          {/* Grid for Smaller Sections */}
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Cookies */}
            <div className="bg-[#111] p-6 md:p-8 rounded-3xl border border-white/5">
              <h3 className="text-xl font-bold mb-4 text-purple-400 flex items-center gap-3">
                <Cookie className="w-6 h-6" /> Cookies
              </h3>
              <p className="text-gray-400 text-sm mb-4">Our website uses cookies to enhance your browsing experience. Cookies help us:</p>
              <ul className="space-y-2 text-sm text-gray-300 mb-4">
                <li>• Remember your preferences</li>
                <li>• Improve website performance</li>
                <li>• Provide a smoother shopping experience</li>
              </ul>
              <p className="text-sm text-gray-500 italic">You can disable cookies through your browser settings if you prefer.</p>
            </div>

            {/* Data Security */}
            <div className="bg-[#111] p-6 md:p-8 rounded-3xl border border-white/5">
              <h3 className="text-xl font-bold mb-4 text-purple-400 flex items-center gap-3">
                <Lock className="w-6 h-6" /> Data Security
              </h3>
              <p className="text-gray-400 text-sm mb-4">We take appropriate security measures to protect your data, including:</p>
              <ul className="space-y-2 text-sm text-gray-300 mb-4">
                <li>• Secure servers and encryption</li>
                <li>• Trusted payment gateways</li>
                <li>• Restricted access to sensitive data</li>
              </ul>
              <p className="text-sm text-gray-500 italic">However, while we strive to protect your information, no method of transmission over the internet is 100% secure.</p>
            </div>

            {/* Your Rights */}
            <div className="bg-[#111] p-6 md:p-8 rounded-3xl border border-white/5">
              <h3 className="text-xl font-bold mb-4 text-purple-400">Your Rights</h3>
              <p className="text-gray-400 text-sm mb-4">As a user, you have the right to:</p>
              <ul className="space-y-2 text-sm text-gray-300 mb-4">
                <li>• Access your personal information</li>
                <li>• Request correction of your data</li>
                <li>• Request deletion of your data</li>
              </ul>
              <p className="text-sm text-gray-500 italic">To exercise these rights, please contact us using the details below.</p>
            </div>

            {/* Third-Party & Children */}
            <div className="bg-[#111] p-6 md:p-8 rounded-3xl border border-white/5 space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-2 text-purple-400">Third-Party Links</h3>
                <p className="text-gray-400 text-sm">Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of those websites.</p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-purple-400">Children’s Privacy</h3>
                <p className="text-gray-400 text-sm">Our website is not intended for individuals under the age of 13. We do not knowingly collect personal data from children.</p>
              </div>
            </div>
          </div>

          {/* Contact & Footer Info */}
          <div className="bg-gradient-to-br from-[#111] to-black p-8 rounded-3xl border border-white/10 text-center">
            <h3 className="text-2xl font-bold mb-6 text-white">Contact Us & Updates</h3>
            <p className="text-gray-400 mb-6 max-w-xl mx-auto">
              If you have any questions about this Privacy Policy or your data, you can contact us. We may update this Privacy Policy from time to time.
            </p>
            
            <div className="flex flex-col md:flex-row justify-center gap-6 mb-8">
              <div className="flex items-center justify-center gap-2 text-gray-300">
                <Mail className="w-5 h-5 text-purple-400" /> perfectfumeofficial@gmail.com
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-300">
                <AlertTriangle className="w-5 h-5 text-purple-400" /> Kolkata, India
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
              <p>By using our website, you consent to our Privacy Policy.</p>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Last Updated: April 2026
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
              
