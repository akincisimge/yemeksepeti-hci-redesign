import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Carts, Product, Service } from "../types/domain";

const EMPTY: Carts = { food: [], market: [] };
const STORAGE_KEY = "hci-yemeksepeti-demo-carts-v1";

function readInitial(): Carts {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return EMPTY;
    const value = parsed as Partial<Carts>;
    if (!Array.isArray(value.food) || !Array.isArray(value.market)) return EMPTY;
    const valid = (lines: unknown[]) => lines.every((x) => {
      if (!x || typeof x !== "object") return false;
      const line = x as { product?: Partial<Product>; quantity?: number };
      return typeof line.product?.id === "string" &&
        typeof line.product?.price === "number" &&
        (line.product.service === "food" || line.product.service === "market") &&
        Number.isInteger(line.quantity) && (line.quantity ?? 0) > 0;
    });
    return valid(value.food) && valid(value.market) ? value as Carts : EMPTY;
  } catch {
    return EMPTY;
  }
}

type CartContextValue = {
  carts: Carts;
  add: (product: Product) => "added" | "store-changed";
  change: (service: Service, productId: string, delta: number) => void;
  clear: (service: Service) => void;
  total: (service: Service) => number;
  count: (service: Service) => number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [carts, setCarts] = useState<Carts>(readInitial);
  const persist = (next: Carts) => {
    setCarts(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* storage optional */ }
  };
  const add = (product: Product): "added" | "store-changed" => {
    const existing = carts[product.service];
    const differentStore = existing.length > 0 && existing[0].product.storeId !== product.storeId;
    // MVP: one active store per service; caller must confirm before switching.
    if (differentStore && !window.confirm("Bu bölümün sepetinde farklı bir mağazadan ürün var. Sepeti temizleyip yeni mağazaya geçilsin mi?")) return "store-changed";
    const base = differentStore ? [] : existing;
    const found = base.find((line) => line.product.id === product.id);
    const updated = found
      ? base.map((line) => line.product.id === product.id ? { ...line, quantity: line.quantity + 1 } : line)
      : [...base, { product, quantity: 1 }];
    persist({ ...carts, [product.service]: updated });
    return "added";
  };
  const change = (service: Service, id: string, delta: number) => {
    const nextLines = carts[service].map((line) => line.product.id === id
      ? { ...line, quantity: line.quantity + delta } : line).filter((line) => line.quantity > 0);
    persist({ ...carts, [service]: nextLines });
  };
  const clear = (service: Service) => persist({ ...carts, [service]: [] });
  const total = (service: Service) => carts[service].reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  const count = (service: Service) => carts[service].reduce((sum, line) => sum + line.quantity, 0);
  const value = useMemo(() => ({ carts, add, change, clear, total, count }), [carts]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart, CartProvider içinde kullanılmalı");
  return ctx;
}
