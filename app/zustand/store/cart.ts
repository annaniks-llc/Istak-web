import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  volume: number;
  image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getCartState: () => CartItem[];
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        console.log('Cart store - Adding item:', item);
        const { items } = get();
        console.log('Cart store - Current items before adding:', items);
        
        const existingItem = items.find((i) => i.id === item.id);

        if (existingItem) {
          console.log('Cart store - Item already exists, updating quantity');
          set({
            items: items.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)),
          });
        } else {
          console.log('Cart store - Adding new item');
          set({
            items: [...items, { ...item, quantity: 1 }],
          });
        }
        
        const newItems = get().items;
        console.log('Cart store - Items after adding:', newItems);
        console.log('Cart store - Total items count:', newItems.reduce((total, item) => total + item.quantity, 0));
      },

      removeItem: (itemId) => {
        const { items } = get();
        set({
          items: items.filter((item) => item.id !== itemId),
        });
      },

      updateQuantity: (itemId, quantity) => {
        const { items } = get();
        if (quantity <= 0) {
          set({
            items: items.filter((item) => item.id !== itemId),
          });
        } else {
          set({
            items: items.map((item) => (item.id === itemId ? { ...item, quantity } : item)),
          });
        }
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getCartState: () => {
        return get().items;
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        console.log('Cart store - Rehydrating from storage:', state);
        if (state) {
          console.log('Cart store - Rehydrated items:', state.items);
          console.log('Cart store - Total items after rehydration:', state.items.reduce((total, item) => total + item.quantity, 0));
        }
      },
    },
  ),
);
