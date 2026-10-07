import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
  id: string;
  sku: string;
  barcode?: string;
  name: string;
  capital_price: number;
  selling_price: number;
  current_stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product, qty?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  getSubtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product, qty = 1) => set((state) => {
        const existingItem = state.items.find((item) => item.id === product.id);
        if (existingItem) {
          return {
            items: state.items.map((item) => 
              item.id === product.id 
                ? { ...item, quantity: item.quantity + qty }
                : item
            )
          };
        }
        return {
          items: [...state.items, { ...product, quantity: qty }]
        };
      }),

      updateQuantity: (productId, quantity) => set((state) => {
        if (quantity <= 0) {
          return {
            items: state.items.filter((item) => item.id !== productId)
          };
        }
        return {
          items: state.items.map((item) => 
            item.id === productId ? { ...item, quantity } : item
          )
        };
      }),

      removeItem: (productId) => set((state) => ({
        items: state.items.filter((item) => item.id !== productId)
      })),

      clearCart: () => set({ items: [] }),

      getSubtotal: () => {
        return get().items.reduce((total, item) => total + (item.selling_price * item.quantity), 0);
      },
    }),
    {
      name: 'pos-cart-storage',
    }
  )
);
