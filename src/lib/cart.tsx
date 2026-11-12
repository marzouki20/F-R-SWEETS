import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { addLine, cartCount, cartSubtotal, setLineQuantity, type CartLine } from "./cart-logic";

const STORAGE_KEY = "fr-sweets-cart-v1";

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  bump: number;
  add: (item: Omit<CartLine, "quantity">, qty?: number) => void;
  setQuantity: (productId: string, qty: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [bump, setBump] = useState(0);
  const loaded = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setLines(parsed);
      }
    } catch {
      // ignore corrupted storage
    }
    loaded.current = true;
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines]);

  const add = useCallback((item: Omit<CartLine, "quantity">, qty = 1) => {
    setLines((prev) => addLine(prev, item, qty));
    setBump((b) => b + 1);
    toast.success(`${item.name} ajouté au panier`, {
      description: qty > 1 ? `Quantité : ${qty}` : undefined,
    });
  }, []);

  const setQuantity = useCallback((productId: string, qty: number) => {
    setLines((prev) => setLineQuantity(prev, productId, qty));
  }, []);

  const remove = useCallback((productId: string) => {
    setLines((prev) => setLineQuantity(prev, productId, 0));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(
    () => ({ lines, count: cartCount(lines), subtotal: cartSubtotal(lines), bump, add, setQuantity, remove, clear }),
    [lines, bump, add, setQuantity, remove, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
