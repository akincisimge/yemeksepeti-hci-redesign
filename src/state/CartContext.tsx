import { createContext, useContext, useEffect, useReducer, useRef, type ReactNode } from "react";
import { cartReducer, type PendingRemoval } from "./cartOperations";
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
  pending: PendingRemoval | null;
  add: (product: Product) => "added" | "store-changed";
  change: (service: Service, productId: string, delta: number) => void;
  removeAll: (service: Service) => void;
  clear: (service: Service) => void;
  clearServices: (services: Service[]) => void;
  undoRemoval: () => void;
  dismissUndo: (token?: number) => void;
  total: (service: Service) => number;
  count: (service: Service) => number;
};
const CartContext = createContext<CartContextValue | null>(null);
export function CartProvider({ children }: { children: ReactNode }) {
  const [{ carts, pending }, dispatch] = useReducer(cartReducer, undefined, () => ({ carts: readInitial(), pending: null }));
  const token = useRef(0);
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(carts)); } catch { /* storage optional */ }
  }, [carts]);
  const add = (product: Product): "added" | "store-changed" => {
    const switched = carts[product.service].some(line => line.product.storeId !== product.storeId);
    if (switched && !window.confirm("Bu bölümün sepetinde farklı bir mağazadan ürün var. Sepeti temizleyip yeni mağazaya geçilsin mi?")) return "store-changed";
    dispatch({ type: "add", product });
    return "added";
  };
  const change = (service: Service, id: string, delta: number) => dispatch({ type: "change", service, id, delta, token: ++token.current });
  const removeAll = (service: Service) => dispatch({ type: "remove-all", service, token: ++token.current });
  const clear = (service: Service) => dispatch({ type: "clear", services: [service] });
  const clearServices = (services: Service[]) => dispatch({ type: "clear", services });
  const undoRemoval = () => dispatch({ type: "undo" });
  const dismissUndo = (token?: number) => dispatch({ type: "dismiss", token });
  const total = (service: Service) => carts[service].reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  const count = (service: Service) => carts[service].reduce((sum, line) => sum + line.quantity, 0);
  return <CartContext.Provider value={{ carts, pending, add, change, removeAll, clear, clearServices, undoRemoval, dismissUndo, total, count }}>{children}</CartContext.Provider>;
}
export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart, CartProvider içinde kullanılmalı");
  return value;
}
