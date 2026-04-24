import { create } from 'zustand';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface StoreState {
  cart: CartItem[];
  deliveryType: 'standard' | 'express';
  paymentMethod: 'online' | 'cod';
  addToCart: (product: any) => void;
  getTotals: () => { total: number };
}

export const useStore = create<StoreState>((set, get) => ({
  cart: [],
  deliveryType: 'standard',
  paymentMethod: 'online',
  addToCart: (product) => set((state) => ({ cart: [...state.cart, { ...product, quantity: 1 }] })),
  getTotals: () => {
    const total = get().cart.reduce((acc, item) => acc + (item.price * 100), 0);
    return { total };
  },
}));
  
