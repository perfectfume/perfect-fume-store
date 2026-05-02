import React, { useEffect } from 'react';
import { User } from 'lucide-react';
import { useStore } from '../store/useStore';

const Account = () => {
  const { userName, userEmail, userPhone, logout } = useStore();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Login na thakle eta dekhabe
  if (!userEmail) {
    return (
      <div className="min-h-screen bg-[#050505] text-white pt-32 pb-24 flex flex-col items-center text-center px-4 font-sans">
        <div className="w-24 h-24 bg-purple-900/20 rounded-full flex items-center justify-center mb-6 border border-purple-500/20">
          <User className="w-12 h-12 text-purple-500" />
        </div>
        <h2 className="text-3xl font-bold mb-4 italic">Please Sign In</h2>
        <p className="text-gray-400 mb-8 max-w-sm">Access your account, track orders, and view your wishlist.</p>
        <p className="text-purple-400 font-bold border border-purple-500/30 px-6 py-3 rounded-full bg-purple-900/10">👆 Click 'Sign In' at the top right corner</p>
      </div>
    );
  }

  // Login thakle eta dekhabe
  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-24 font-sans">
      <main className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold italic mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">My Account</h1>
        
        <div className="bg-[#111] border border-white/5 p-6 md:p-8 rounded-3xl mb-6 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
           <div className="w-24 h-24 bg-purple-600/20 rounded-full flex items-center justify-center border border-purple-500/30 shrink-0">
             <User className="w-12 h-12 text-purple-400" />
           </div>
           <div>
             <h2 className="text-2xl font-bold text-white mb-2">{userName || 'Valued Customer'}</h2>
             <p className="text-gray-400 mb-1">{userEmail}</p>
             <p className="text-gray-400">{userPhone}</p>
           </div>
        </div>

        <div className="text-center mt-12 p-8 border border-white/5 rounded-3xl bg-[#0a0a0a]">
            <p className="text-gray-500 italic">Baki account details (Order history, Edit Profile) amra pore ekhane add korbo! 🚀</p>
        </div>

        <button onClick={() => { if(window.confirm("Logout korben?")) logout() }} className="w-full mt-12 bg-red-600/10 hover:bg-red-600/20 text-red-500 font-bold py-4 rounded-xl border border-red-500/20 transition-all">
          Log Out
        </button>
      </main>
    </div>
  );
};

export default Account;
