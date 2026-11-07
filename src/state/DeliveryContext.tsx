import { createContext, useContext, useState, type ReactNode } from "react";
import { deliversTo, restoreLocation, type DeliveryLocation } from "../data/delivery";
import { useCart } from "./CartContext";
import type { Service } from "../types/domain";
const KEY = "hci-delivery-location-v1";
function initial() {
  try {
    const raw = localStorage.getItem("hci-delivery-location-v2");
    return raw ? restoreLocation(JSON.parse(raw)) : restoreLocation(localStorage.getItem(KEY));
  } catch { return null; }
}
const Context = createContext<{
  delivery: DeliveryLocation | null;
  selectLocation: (location: DeliveryLocation | string) => boolean;
  available: (storeId: string) => boolean;
} | null>(null);
export function DeliveryProvider({ children }: { children: ReactNode }) {
  const [delivery, setDelivery] = useState<DeliveryLocation | null>(initial);
  const { carts, clearServices, dismissUndo } = useCart();
  function selectLocation(location: DeliveryLocation | string) {
    const next = restoreLocation(location);
    if (!next) return false;
    const affected = (["food", "market"] as Service[]).filter(service =>
      carts[service].some(line => !deliversTo(line.product.storeId, next)));
    if (affected.length && !window.confirm(
      `${affected.map(s => s === "food" ? "Yemek" : "Market").join(" ve ")} sepetindeki mağaza yeni konuma teslimat yapmıyor. İlgili sepetler temizlenerek konum değiştirilsin mi?`
    )) return false;
    if (delivery?.id !== next.id) dismissUndo();
    clearServices(affected);
    setDelivery(next);
    try { localStorage.setItem("hci-delivery-location-v2", JSON.stringify(next)); } catch { /* storage optional */ }
    return true;
  }
  return <Context.Provider value={{ delivery, selectLocation, available: id => deliversTo(id, delivery) }}>{children}</Context.Provider>;
}
export function useDelivery() {
  const value = useContext(Context);
  if (!value) throw new Error("DeliveryProvider gerekli");
  return value;
}
