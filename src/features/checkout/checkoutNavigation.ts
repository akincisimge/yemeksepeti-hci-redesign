import type { Service } from "../../types/domain";
import { TIP_AMOUNTS } from "./paymentModel.ts";

type ReturnStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;
type CheckoutReturn = { storeId: string; tip: number };
const returnKey = (service: Service, regionId: string) =>
  `hci-checkout-return-v1:${service}:${encodeURIComponent(regionId)}`;

export function checkoutCatalogPath(service: Service, storeId: string): string {
  if (!storeId) return `/${service}`;
  return service === "market" ? `/market/${encodeURIComponent(storeId)}`
    : `/food?store=${encodeURIComponent(storeId)}`;
}

// One visit back to the same seller can resume payment. Never persist card fields.
export function rememberCheckoutReturn(storage: ReturnStorage | undefined, service: Service, regionId: string, value: CheckoutReturn): void {
  try {
    storage?.setItem(returnKey(service, regionId), JSON.stringify({ storeId: value.storeId, tip: value.tip }));
  } catch { /* Address-first checkout still works when storage is unavailable. */ }
}

export function readCheckoutReturn(storage: ReturnStorage | undefined, service: Service, regionId: string, storeId: string): CheckoutReturn | undefined {
  try {
    const raw = storage?.getItem(returnKey(service, regionId));
    if (!raw || !storeId) return undefined;
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object") return undefined;
    const saved = value as Partial<CheckoutReturn>;
    if (saved.storeId !== storeId || !TIP_AMOUNTS.some(amount => amount === saved.tip)) return undefined;
    return { storeId, tip: saved.tip as number };
  } catch { return undefined; }
}

export function clearCheckoutReturn(storage: ReturnStorage | undefined, service: Service, regionId: string): void {
  try { storage?.removeItem(returnKey(service, regionId)); } catch { /* Storage is optional. */ }
}
