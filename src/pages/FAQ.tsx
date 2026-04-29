import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Package, CreditCard, RefreshCcw, Sparkles, User, Gift, Rocket, MessageCircle, ArrowRight, HelpCircle } from 'lucide-react';

const FAQ = () => {
  // Konta open ache seta track korar jonno
  const [openId, setOpenId] = useState<string | null>("0-0"); 
  const ADMIN_WHATSAPP = "918777789394";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  // 🔥 Apnar dewa asol content
  const faqCategories = [
    {
      title: "Orders & Delivery",
      icon: <Package className="w-5 h-5 text-blue-400" />,
      faqs: [
        { q: "How long does delivery take?", a: "Delivery usually takes 3–5 business days depending on your location. Metro cities may receive orders faster." },
        { q: "Do you offer Cash on Delivery (COD)?", a: "Yes, Cash on Delivery is available on selected orders and locations." },
        { q: "How can I track my order?", a: "You can track your order using the “Track Order” page by entering your Order ID and phone/email." },
        { q: "What if my order is delayed?", a: "In rare cases, delivery may be delayed due to logistics issues. If that happens, please contact us — we’ll assist you immediately." },
        { q: "Do you deliver all over India?", a: "Yes, we offer PAN India delivery." }
      ]
    },
    {
      title: "Payments & Offers",
      icon: <CreditCard className="w-5 h-5 text-green-400" />,
      faqs: [
        { q: "What payment methods do you accept?", a: "We accept UPI, Debit/Credit Cards, Net Banking, and Cash on Delivery (if available)." },
        { q: "Can I use coupon codes?", a: "Yes! You can apply coupon codes at checkout to get discounts on your order." },
        { q: "Why is my payment failing?", a: "Payment failures may happen due to network issues or bank restrictions. Please try again or use a different payment method." },
        { q: "Are there any hidden charges?", a: "No, we believe in transparent pricing. The price you see at checkout is what you pay." }
      ]
    },
    {
      title: "Returns & Refunds",
      icon: <RefreshCcw className="w-5 h-5 text-pink-400" />,
      faqs: [
        { q: "Can I return a product?", a: "Returns are accepted only in case of damaged, defective, or wrong items delivered." },
        { q: "What is your refund policy?", a: "Once your return is approved, the refund will be processed to your original payment method." },
        { q: "How long does refund take?", a: "Refunds are usually processed within 5–7 business days after approval." },
        { q: "What if I receive a damaged product?", a: "Please contact us within 24 hours with photos of the product. We will arrange a replacement or refund." }
      ]
    },
    {
      title: "Product Related",
      icon: <Sparkles className="w-5 h-5 text-purple-400" />,
      faqs: [
        { q: "Are your perfumes long-lasting?", a: "Yes, our perfumes are designed to be long-lasting, with high-quality fragrance oils for better performance." },
        { q: "Are these original or inspired perfumes?", a: "Our fragrances are inspired by premium scents and crafted to deliver a similar luxurious experience at an affordable price." },
        { q: "How do I choose the right fragrance?", a: "You can choose based on your preference: fresh, sweet, woody, or strong. You can also contact us for personalized suggestions." },
        { q: "What are fragrance notes?", a: "Fragrance notes are layers of scent:\n\n• Top Notes: First impression\n• Heart Notes: Main body\n• Base Notes: Long-lasting scent" },
        { q: "How long does one bottle last?", a: "It depends on usage, but on average a bottle can last 1–2 months with regular use." }
      ]
    },
    {
      title: "Account & Support",
      icon: <User className="w-5 h-5 text-yellow-400" />,
      faqs: [
        { q: "Do I need an account to place an order?", a: "No, you can place an order as a guest. However, creating an account helps you track orders easily." },
        { q: "How do I contact support?", a: "You can reach us via email, phone, or WhatsApp from our Contact page." },
        { q: "How fast do you respond?", a: "We usually respond within a few hours during working hours." }
      ]
    },
    {
      title: "Offers & Combo",
      icon: <Gift className="w-5 h-5 text-red-400" />,
      faqs: [
        { q: "Do you offer combo deals?", a: "Yes, we regularly provide combo offers and bundle deals for better value." },
        { q: "Is there any free gift offer?", a: "Free gifts may be available during special promotions or on orders above a certain value." }
      ]
    },
    {
      title: "Referral / Affiliate Program",
      icon: <Rocket className="w-5 h-5 text-orange-400" />,
      faqs: [
        { q: "How does the referral program work?", a: "You can share your unique referral link with others. When someone makes a purchase using your link, you earn a reward or commission." },
        { q: "How do I earn commission?", a: "Commissions are earned on successful orders made through your referral link. Details will be available in your dashboard." }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-24 font-sans">
      <main className="max-w-4xl mx-auto px-4">
        
        {/* 🔥 HEADER */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-purple-900/30 rounded-2xl flex items-center justify-center border border-purple-500/30 mx-auto mb-6">
            <HelpCircle className="w-8 h-8 text-purple-400" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold italic mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Frequently Asked Questions
          </h1>
          <h2 className="text-xl font-bold mb-2 text-white">Find Answers to Your Questions</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            We’ve answered the most common questions to make your shopping experience smooth and hassle-free.
          </p>
        </div>

        {/* 🔥 FAQ CATEGORIES & QUESTIONS */}
        <div className="space-y-10">
          {faqCategories.map((category, catIndex) => (
            <div key={catIndex} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${catIndex * 100}ms` }}>
              
              {/* Category Title */}
              <h3 className="text-xl font-bold mb-4 flex items-center gap-3 text-white border-b border-white/10 pb-3">
                <div className="p-2 bg-[#111] rounded-lg border border-white/5">{category.icon}</div>
                {category.title}
              </h3>
              
              {/* Accordions */}
              <div className="space-y-3">
                {category.faqs.map((faq, faqIndex) => {
                  const id = `${catIndex}-${faqIndex}`;
                  const isOpen = openId === id;
                  
                  return (
                    <div key={faqIndex} className={`bg-[#111] border rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'border-purple-500/50 shadow-lg shadow-purple-900/10' : 'border-white/5 hover:border-white/20'}`}>
                      <button 
                        onClick={() => toggleFaq(id)}
                        className="w-full px-6 py-5 flex justify-between items-center text-left"
                      >
                        <span className={`font-bold text-sm md:text-base pr-4 transition-colors ${isOpen ? 'text-purple-400' : 'text-gray-200'}`}>
                          {faq.q}
                        </span>
                        <div className={`p-1 rounded-full transition-colors ${isOpen ? 'bg-purple-900/30' : 'bg-white/5'}`}>
                          {isOpen ? <ChevronUp className="text-purple-400 w-5 h-5 flex-shrink-0" /> : <ChevronDown className="text-gray-500 w-5 h-5 flex-shrink-0" />}
                        </div>
                      </button>
                      
                      {isOpen && (
                        <div className="px-6 pb-6 animate-in fade-in zoom-in-95 duration-200">
                          <div className="pt-2 border-t border-white/5 text-gray-400 text-sm md:text-base leading-relaxed whitespace-pre-line">
                            {faq.a}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* 🔥 STILL HAVE QUESTIONS SECTION */}
        <div className="mt-16 bg-gradient-to-br from-[#111] to-black border border-white/10 p-8 md:p-12 rounded-3xl text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
          
          <MessageCircle className="w-12 h-12 text-purple-400 mx-auto mb-6" />
          <h3 className="text-2xl font-bold mb-2">Still Have Questions?</h3>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">Didn’t find what you were looking for? We’re always here to help you.</p>
          
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <button onClick={() => window.location.href = '/contact'} className="bg-white text-black font-bold px-8 py-4 rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
              Contact Us <ArrowRight className="w-4 h-4" />
            </button>
            <a href={`https://wa.me/${ADMIN_WHATSAPP}`} target="_blank" rel="noreferrer" className="bg-green-600/20 text-green-500 border border-green-500/30 font-bold px-8 py-4 rounded-xl hover:bg-green-600/30 transition-all flex items-center justify-center gap-2">
              <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
            </a>
          </div>
        </div>

        {/* 🔥 FOOTER NOTE */}
        <div className="text-center pt-16 pb-4">
          <h3 className="text-2xl font-bold italic text-purple-400 mb-2">Thank You for Choosing Perfect Fume</h3>
          <p className="text-gray-300">Your trust means everything to us.</p>
          <p className="text-white font-bold mt-2">We’re committed to giving you the best fragrance experience possible ✨</p>
        </div>

      </main>
    </div>
  );
};

export default FAQ;
          
