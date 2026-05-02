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
  wishlist: any[]; // 🔥 NOTUN: Wishlist add holo
  isCartOpen: boolean;
  deliveryType: 'standard' | 'express';
  paymentMethod: 'online' | 'cod';
  addToCart: (product: any) => void;
  removeFromCart: (id: string) => void;
  toggleCart: () => void;
  getTotals: () => { total: number };
  
  userName: string | null;
  userEmail: string | null;
  userPhone: string | null;
  setUserAuth: (name: string | null, email: string | null, phone: string | null) => void;
  logout: () => void;
  clearCart: () => void;
  
  toggleWishlist: (product: any) => void; // 🔥 NOTUN: Wishlist function
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
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
      
      // Logout korle user info r wishlist faka hoye jabe
      logout: () => set({ userName: null, userEmail: null, userPhone: null, wishlist: [] }), 
      
      clearCart: () => set({ cart: [] }),

      // 🔥 WISHLIST LOGIC
      toggleWishlist: (product) => set((state) => {
        if (!state.userEmail) {
          alert("⚠️ Wishlist-e add korar jonno age upore 'Sign In' korun!");
          return state;
        }
        const exists = state.wishlist.find((item) => item.id === product.id);
        if (exists) {
          return { wishlist: state.wishlist.filter((item) => item.id !== product.id) };
        }
        alert(`❤️ ${product.name} Wishlist-e add hoyeche!`);
        return { wishlist: [...state.wishlist, product] };
      }),
    }),
    { name: 'perfect-fume-cart' } // Ei nam-e localStorage e data save thakbe
  )
);
