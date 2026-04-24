import React from 'react';
import { useStore } from '../store/useStore';

export default function ProductCard({ product }: { product: any }) {
  const addToCart = useStore((state) => state.addToCart);

  return (
    <div className="bg-[#12121A] border border-[#2A2A35] p-4 rounded-2xl">
      <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-xl mb-4" />
      <h3 className="text-xl font-bold mb-2">{product.name}</h3>
      <p className="text-[#7C6FE9] font-bold mb-4">₹{product.price}</p>
      <button 
        onClick={() => addToCart(product)}
        className="w-full bg-[#7C6FE9] py-2 rounded-lg font-medium hover:bg-[#6A5CDA] transition-colors"
      >
        Add to Cart
      </button>
    </div>
  );
}

