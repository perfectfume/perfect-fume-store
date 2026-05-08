import React, { useState } from 'react';
import { X, Sparkles, ArrowRight, CheckCircle2, ShoppingCart } from 'lucide-react';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: any[];
  addToCart: (p: any) => void;
}

const QuizModal: React.FC<QuizModalProps> = ({ isOpen, onClose, products, addToCart }) => {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({ gender: '', vibe: '', occasion: '' });
  const [recommendation, setRecommendation] = useState<any>(null);

  if (!isOpen) return null;

  const handleNext = (key: string, value: string) => {
    const updatedAnswers = { ...answers, [key]: value };
    setAnswers(updatedAnswers);
    
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Logic to find best match
      const match = products.find(p => 
        p.category.toLowerCase() === updatedAnswers.gender.toLowerCase() || 
        p.description.toLowerCase().includes(updatedAnswers.vibe.toLowerCase())
      ) || products[0]; // Default to first product if no match
      
      setRecommendation(match);
      setStep(4);
    }
  };

  const resetQuiz = () => {
    setStep(1);
    setRecommendation(null);
    setAnswers({ gender: '', vibe: '', occasion: '' });
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-[#111] border border-white/10 w-full max-w-lg rounded-3xl overflow-hidden relative shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white z-10">
          <X className="w-6 h-6" />
        </button>

        <div className="p-8">
          {step < 4 && (
            <div className="mb-8">
              <div className="flex gap-2 mb-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className={`h-1 flex-1 rounded-full ${step >= i ? 'bg-purple-600' : 'bg-white/10'}`} />
                ))}
              </div>
              <p className="text-purple-400 text-xs font-bold uppercase tracking-widest">Question {step} of 3</p>
            </div>
          )}

          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-2xl font-bold mb-6 italic">This scent is for...</h2>
              <div className="grid gap-3">
                {['Men', 'Women', 'Unisex'].map(opt => (
                  <button key={opt} onClick={() => handleNext('gender', opt)} className="w-full bg-white/5 border border-white/10 hover:border-purple-500 py-4 rounded-2xl font-bold transition-all text-left px-6 flex justify-between items-center group">
                    {opt} <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-2xl font-bold mb-6 italic">Choose your vibe...</h2>
              <div className="grid gap-3">
                {['Fresh & Citrus', 'Deep & Woody', 'Sweet & Floral', 'Bold & Spicy'].map(opt => (
                  <button key={opt} onClick={() => handleNext('vibe', opt)} className="w-full bg-white/5 border border-white/10 hover:border-purple-500 py-4 rounded-2xl font-bold transition-all text-left px-6 flex justify-between items-center group">
                    {opt} <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-2xl font-bold mb-6 italic">Best for which occasion?</h2>
              <div className="grid gap-3">
                {['Daily Office Wear', 'Party & Night Out', 'Special Occasions'].map(opt => (
                  <button key={opt} onClick={() => handleNext('occasion', opt)} className="w-full bg-white/5 border border-white/10 hover:border-purple-500 py-4 rounded-2xl font-bold transition-all text-left px-6 flex justify-between items-center group">
                    {opt} <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && recommendation && (
            <div className="text-center animate-in zoom-in-95 duration-500">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
                <Sparkles className="w-10 h-10 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2 italic">Found Your Perfect Match!</h2>
              <p className="text-gray-400 text-sm mb-8">Based on your preferences, we recommend:</p>

              <div className="bg-white/5 border border-white/10 rounded-3xl p-4 mb-8 flex items-center gap-4 text-left">
                <img src={recommendation.image} alt={recommendation.name} className="w-24 h-24 object-cover rounded-2xl" />
                <div>
                  <h3 className="font-bold text-lg">{recommendation.name}</h3>
                  <p className="text-purple-400 font-bold">₹{recommendation.price}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={resetQuiz} className="flex-1 bg-white/5 hover:bg-white/10 py-4 rounded-2xl font-bold transition-all text-sm">Retake Quiz</button>
                <button onClick={() => { addToCart(recommendation); onClose(); }} className="flex-1 bg-purple-600 hover:bg-purple-700 py-4 rounded-2xl font-bold transition-all text-sm flex items-center justify-center gap-2">
                  <ShoppingCart className="w-4 h-4" /> Add to Cart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizModal;
              
