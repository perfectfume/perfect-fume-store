import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface StoreState {
  cart: CartItem[];
  isCartOpen: boolean;
  deliveryType: 'standard' | 'express';
  paymentMethod: 'online' | 'cod';
  addToCart: (product: any) => void;
  removeFromCart: (id: string) => void;
  toggleCart: () => void;
  getTotals: () => { total: number };
  
  // 🔥 NOTUN: userName add kora holo
  userName: string | null;
  userEmail: string | null;
  userPhone: string | null;
  setUserAuth: (name: string | null, email: string | null, phone: string | null) => void;
  logout: () => void;
  clearCart: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cart: [],
      isCartOpen: false,
      deliveryType: 'standard',
      paymentMethod: 'online',
      
      addToCart: (product) => set((state) => {
        const existing = state.cart.find(item => item.id === product.id);
        if (existing) {
          return { cart: state.cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) };
        }
        return { cart: [...state.cart, { ...product, quantity: 1 }] };
      }),
      
      removeFromCart: (id) => set((state) => ({ cart: state.cart.filter(item => item.id !== id) })),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
      
      getTotals: () => {
        const total = get().cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        return { total };
      },

      userName: null,
      userEmail: null,
      userPhone: null,
      setUserAuth: (name, email, phone) => set({ userName: name, userEmail: email, userPhone: phone }),
      logout: () => set({ userName: null, userEmail: null, userPhone: null }), 
      clearCart: () => set({ cart: [] }),
    }),
    { name: 'perfect-fume-cart' }
  )
);
