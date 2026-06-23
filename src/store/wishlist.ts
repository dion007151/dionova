import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useEffect, useState } from "react";

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  slug: string;
}

interface WishlistState {
  items: WishlistItem[];
  toggleItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  hasItem: (id: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggleItem: (item) => {
        const items = get().items;
        const exists = items.some((i) => i.id === item.id);
        if (exists) {
          set({ items: items.filter((i) => i.id !== item.id) });
        } else {
          set({ items: [...items, item] });
        }
      },
      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },
      hasItem: (id) => {
        return get().items.some((i) => i.id === id);
      },
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: "dionova-wishlist",
    }
  )
);

export function useWishlistHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  return hydrated;
}
