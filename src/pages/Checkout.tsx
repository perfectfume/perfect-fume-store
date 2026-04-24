import React, { useState } from 'react';
import { useStore } from '../store/useStore'; // Ensure your store path is correct
import { placeOrder, verifyOTP } from '../api';

export default function Checkout() {
  const { cart, getTotals, deliveryType, paymentMethod } = useStore();
  const { total } = getTotals();
  
  // States
  const [orderRef, setOrderRef] = useState('');
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [userOtp, setUserOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  // 1. Place Order (Triggers OTP)
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const payload = {
      ...formData,
      delivery_type: deliveryType,
      payment_method: paymentMethod,
      total: total,
      items: cart
    };

    const res = await placeOrder(payload);
    setLoading(false);

    if (res.success) {
      setOrderRef(res.order_ref);
      setShowOtpPopup(true);
    } else {
      alert("Failed to send OTP. Please try again.");
    }
  };

  // 2. Verify OTP & Redirect to Payment
  const handleVerifyOTP = async () => {
    setLoading(true);
    const res = await verifyOTP(orderRef, userOtp);
    setLoading(false);

    if (res.success) {
      if (res.payment_link) {
        window.location.href = res.payment_link; // Redirect to Razorpay
      } else {
        alert("Order confirmed! We will contact you soon.");
        window.location.href = "/"; // Success redirect
      }
    } else {
      alert("Invalid OTP code.");
    }
  };

  return (
    <div className="min-h-screen bg-[#050508] text-white pt-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-[#7C6FE9]">Complete Your Order</h1>
        
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Customer Details */}
          <div className="space-y-4 bg-[#12121A] p-6 rounded-2xl border border-[#2A2A35]">
            <input 
              required placeholder="Full Name" 
              className="w-full bg-black border border-[#2A2A35] p-3 rounded-xl focus:border-[#7C6FE9] outline-none"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            <input 
              required type="email" placeholder="Email Address" 
              className="w-full bg-black border border-[#2A2A35] p-3 rounded-xl focus:border-[#7C6FE9] outline-none"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <input 
              required type="tel" placeholder="Phone Number" 
              className="w-full bg-black border border-[#2A2A35] p-3 rounded-xl focus:border-[#7C6FE9] outline-none"
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
            <textarea 
              required placeholder="Shipping Address" 
              className="w-full bg-black border border-[#2A2A35] p-3 rounded-xl focus:border-[#7C6FE9] outline-none"
              onChange={(e) => setFormData({...formData, address: e.target.value})}
            />
          </div>

          {/* Order Summary */}
          <div className="bg-[#12121A] p-6 rounded-2xl border border-[#2A2A35] h-fit">
            <h2 className="text-xl font-bold mb-4">Summary</h2>
            <div className="flex justify-between mb-2"><span>Subtotal:</span><span>₹{(total/100)}</span></div>
            <div className="flex justify-between mb-4 text-[#34D399] font-bold"><span>Total:</span><span>₹{(total/100)}</span></div>
            
            <button 
              type="submit" disabled={loading}
              className="w-full bg-[#7C6FE9] py-4 rounded-xl font-bold shadow-[0_0_20px_rgba(124,111,233,0.3)] hover:scale-[1.02] transition-transform"
            >
              {loading ? "Processing..." : "PLACE ORDER & GET OTP"}
            </button>
          </div>
        </form>
      </div>

      {/* 🛡️ OTP POPUP MODAL */}
      {showOtpPopup && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-[100] backdrop-blur-sm">
          <div className="bg-[#12121A] border border-[#7C6FE9] p-8 rounded-3xl max-w-sm w-full text-center shadow-[0_0_50px_rgba(124,111,233,0.4)]">
            <h2 className="text-2xl font-bold mb-2">Email Verification</h2>
            <p className="text-[#A0A0B0] text-sm mb-6">Enter the 6-digit code we sent to your inbox.</p>
            
            <input 
              type="text" maxLength={6} placeholder="000000"
              className="w-full bg-black border border-[#2A2A35] py-4 rounded-2xl text-center text-3xl font-bold tracking-[8px] focus:border-[#7C6FE9] outline-none mb-6"
              onChange={(e) => setUserOtp(e.target.value)}
            />
            
            <button 
              onClick={handleVerifyOTP} disabled={loading}
              className="w-full bg-[#34D399] text-black py-4 rounded-2xl font-bold hover:bg-[#2bc28a] transition-all"
            >
              {loading ? "Verifying..." : "VERIFY & PAY NOW"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

