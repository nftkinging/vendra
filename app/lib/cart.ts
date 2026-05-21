import { create } from 'zustand';

export interface CartItem {
  id: string;
  storeSlug: string;
  storeName: string;
  sellerWallet: string;
  productName: string;
  price: number;
  image?: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  total: () => number;
  count: () => number;
}

export const useCart = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,

  addItem: (item) => {
    const existing = get().items.find(i => i.id === item.id);
    if (existing) {
      set(state => ({
        items: state.items.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        ),
        isOpen: true,
      }));
    } else {
      set(state => ({
        items: [...state.items, { ...item, quantity: 1 }],
        isOpen: true,
      }));
    }
  },

  removeItem: (id) => set(state => ({
    items: state.items.filter(i => i.id !== id),
  })),

  updateQuantity: (id, qty) => {
    if (qty <= 0) {
      get().removeItem(id);
      return;
    }
    set(state => ({
      items: state.items.map(i => i.id === id ? { ...i, quantity: qty } : i),
    }));
  },

  clearCart: () => set({ items: [] }),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set(state => ({ isOpen: !state.isOpen })),
  total: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
  count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
}));