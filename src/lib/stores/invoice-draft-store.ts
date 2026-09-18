import { create } from "zustand";

export interface InvoiceDraftItem {
  id: string;
  productId: string;
  name: string;
  sku: string;
  hsnCode: string;
  quantity: number;
  unitPrice: number;
  taxRate: number; // percentage, e.g. 18 for 18% GST
}

interface InvoiceDraftState {
  customerId: string | null;
  customerName: string;
  items: InvoiceDraftItem[];
  discountAmount: number;
  notes: string;
  dueDate: string;

  // Actions
  setCustomer: (id: string | null, name: string) => void;
  addItem: (item: Omit<InvoiceDraftItem, "id">) => void;
  updateItemQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  setDiscount: (discount: number) => void;
  setNotes: (notes: string) => void;
  setDueDate: (date: string) => void;
  clearDraft: () => void;

  // Derived calculations
  getSubtotal: () => number;
  getTaxTotal: () => number;
  getGrandTotal: () => number;
}

export const useInvoiceDraftStore = create<InvoiceDraftState>((set, get) => ({
  customerId: null,
  customerName: "",
  items: [],
  discountAmount: 0,
  notes: "Thank you for your business!",
  dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],

  setCustomer: (customerId, customerName) => set({ customerId, customerName }),
  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i.productId === item.productId);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.productId === item.productId
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          ),
        };
      }
      return {
        items: [...state.items, { ...item, id: `item_${Date.now()}_${Math.random().toString(36).slice(2, 6)}` }],
      };
    }),
  updateItemQuantity: (id, quantity) =>
    set((state) => ({
      items:
        quantity <= 0
          ? state.items.filter((item) => item.id !== id)
          : state.items.map((item) => (item.id === id ? { ...item, quantity } : item)),
    })),
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
  setDiscount: (discountAmount) => set({ discountAmount: Math.max(0, discountAmount) }),
  setNotes: (notes) => set({ notes }),
  setDueDate: (dueDate) => set({ dueDate }),
  clearDraft: () =>
    set({
      customerId: null,
      customerName: "",
      items: [],
      discountAmount: 0,
      notes: "Thank you for your business!",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    }),

  getSubtotal: () => {
    return get().items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  },
  getTaxTotal: () => {
    return get().items.reduce(
      (sum, item) => sum + (item.quantity * item.unitPrice * item.taxRate) / 100,
      0
    );
  },
  getGrandTotal: () => {
    const subtotal = get().getSubtotal();
    const tax = get().getTaxTotal();
    const discount = get().discountAmount;
    return Math.max(0, subtotal + tax - discount);
  },
}));
