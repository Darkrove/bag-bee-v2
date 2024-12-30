import { InvoiceItemRequest } from '@/types/invoice';
import { InvoiceItem } from '@prisma/client';
import { create } from 'zustand'

interface Item {
  productCategory: string;
  quantity: string;
  price: string;
  amount: string;
  profit: string;
  note?: string;
  code: string;
  dealerCode: string;
}

interface StoreState {
  items: InvoiceItemRequest[];
  addItem: (item: InvoiceItemRequest) => void;
  deleteItem: (itemCode: string) => void;
  clearItems: () => void;
}

export const useStore = create<StoreState>((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  deleteItem: (itemCode) => set((state) => ({
    items: state.items.filter((item) => item.code !== itemCode)
  })),
  clearItems: () => set({ items: [] })
}));