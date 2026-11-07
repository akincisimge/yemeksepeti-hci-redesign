import { createContext, useContext, useState, type ReactNode } from "react";
import { deliversTo, locations, type DeliveryLocation } from "../data/delivery";
import { useCart } from "./CartContext";
import type { Service } from "../types/domain";
const KEY = "hci-delivery-location-v1";
function initial() {
  try { return locations.find(item => item.id === localStorage.getItem(KEY)) ?? null; }
  catch { return null; }
}
const Context = createContext<{
  delivery: DeliveryLocation | null;
  selectLocation: (id: string) => boolean;
  available: (storeId: string) => boolean;
} | null>(null);
export function DeliveryProvider({ children }: { children: ReactNode }) {
  const [delivery, setDelivery] = useState<DeliveryLocation | null>(initial);
  const { carts, clearServices } = useCart();
  function selectLocation(id: string) {
    const next = locations.find(item => item.id === id);
    if (!next) return false;
    const affected = (["food", "market"] as Service[]).filter(service =>
      carts[service].some(line => !deliversTo(line.product.storeId, id)));
    if (affected.length && !window.confirm(
      `${affected.map(s => s === "food" ? "Yemek" : "Market").join(" ve ")} sepetindeki mağaza yeni konuma teslimat yapmıyor. İlgili sepetler temizlenerek konum değiştirilsin mi?`
    )) return false;
    clearServices(affected);
    setDelivery(next);
    try { localStorage.setItem(KEY, next.id); } catch { /* storage optional */ }
    return true;
  }
  return <Context.Provider value={{ delivery, selectLocation, available: id => deliversTo(id, delivery?.id) }}>{children}</Context.Provider>;
}
export function useDelivery() {
  const value = useContext(Context);
  if (!value) throw new Error("DeliveryProvider gerekli");
  return value;
}
