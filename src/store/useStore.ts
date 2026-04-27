import { create } from 'zustand';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface StoreState {
  // Cart Logic
  cart: CartItem[];
  isCartOpen: boolean;
  deliveryType: 'standard' | 'express';
  paymentMethod: 'online' | 'cod';
  addToCart: (product: any) => void;
  removeFromCart: (id: string) => void;
  toggleCart: () => void;
  getTotals: () => { total: number };
  
  // Auth (Login) Logic
  userEmail: string | null;
  setUserEmail: (email: string | null) => void;
}

export const useStore = create<StoreState>((set, get) => ({
  cart: [],
  isCartOpen: false,
  deliveryType: 'standard',
  paymentMethod: 'online',
  
  // Jhhuri te jinis add kora (Aage theke thakle shudhu quantity barbe)
  addToCart: (product) => set((state) => {
    const existing = state.cart.find(item => item.id === product.id);
    if (existing) {
      return { cart: state.cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) };
    }
    return { cart: [...state.cart, { ...product, quantity: 1 }] };
  }),
  
  // Jhhuri theke delete kora
  removeFromCart: (id) => set((state) => ({ cart: state.cart.filter(item => item.id !== id) })),
  
  // Jhhuri Kholo/Bondho koro
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  
  // Total Dam Hisab kora
  getTotals: () => {
    const total = get().cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    return { total };
  },

  // Customer Login State
  userEmail: null,
  setUserEmail: (email) => set({ userEmail: email }),
}));
