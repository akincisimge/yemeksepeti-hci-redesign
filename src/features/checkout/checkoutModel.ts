import type { PaymentMethod, Product, Service, Store } from "../../types/domain";
import { normalizePaymentMethod, TIP_AMOUNTS } from "./paymentModel.ts";

export type AddressValues = { name: string; address: string; note: string };
export type AddressErrors = Partial<Record<keyof AddressValues, string>>;
export type CheckoutDraft = AddressValues & { method: PaymentMethod };
export type SummaryLine = { product: Pick<Product, "id" | "name" | "price" | "storeName" | "unitLabel">; quantity: number };
type DraftStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

// Fictional classroom fixture, never copied from a real account.
export const SAVED_ADDRESS: AddressValues = {
  name: "Deniz Yılmaz", address: "Örnek Sokak No: 12, Kat: 2, Daire: 4", note: "",
};
export const draftKey = (service: Service, regionId: string) =>
  `hci-checkout-address-v1:${service}:${encodeURIComponent(regionId)}`;

export function validateAddress(values: AddressValues): AddressErrors {
  const errors: AddressErrors = {};
  if (values.name.trim().length < 2) errors.name = "Siparişi teslim alacak kişinin adını ve soyadını yaz.";
  if (values.name.length > 100) errors.name = "Ad soyad en fazla 100 karakter olabilir.";
  if (values.address.trim().length < 10) errors.address = "Sokak ve bina bilgilerini içeren en az 10 karakterlik bir adres yaz.";
  if (values.address.length > 300) errors.address = "Açık adres en fazla 300 karakter olabilir.";
  if (values.note.length > 200) errors.note = "Teslimat notunu 200 karakterle sınırla.";
  return errors;
}

export function readCheckoutDraft(storage: DraftStorage | undefined, service: Service, regionId: string): CheckoutDraft {
  const empty: CheckoutDraft = { name: "", address: "", note: "", method: "card-demo" };
  try {
    const raw = storage?.getItem(draftKey(service, regionId));
    if (!raw) return empty;
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object") return empty;
    const draft = value as Partial<CheckoutDraft>;
    if (typeof draft.name !== "string" || draft.name.length > 100 || typeof draft.address !== "string" || draft.address.length > 300 || typeof draft.note !== "string" || draft.note.length > 200) return empty;
    return { name: draft.name, address: draft.address, note: draft.note,
      method: normalizePaymentMethod(draft.method, service) };
  } catch { return empty; }
}

export function saveCheckoutDraft(storage: DraftStorage | undefined, service: Service, regionId: string, draft: CheckoutDraft): void {
  try {
    // Explicit allow-list: payment credentials must never enter draft storage.
    storage?.setItem(draftKey(service, regionId), JSON.stringify({
      name: draft.name, address: draft.address, note: draft.note, method: draft.method,
    }));
  } catch { /* The current form remains usable when storage is blocked. */ }
}
export function clearCheckoutDraft(storage: DraftStorage | undefined, service: Service, regionId: string): void {
  try { storage?.removeItem(draftKey(service, regionId)); } catch { /* Storage is optional. */ }
}
export function checkoutStorage(): Storage | undefined {
  try { return window.sessionStorage; } catch { return undefined; }
}

// The same estimate is shown before checkout and copied into the confirmed order.
export function deliveryMinutes(deliveryTime?: string): [number, number] {
  const match = /^(\d+)\s*[-–]\s*(\d+)(?:\s*dk)?$/.exec(deliveryTime?.trim() ?? "");
  if (!match) return [20, 35];
  const from = Number(match[1]);
  const to = Number(match[2]);
  return from > 0 && to >= from && to <= 180 ? [from, to] : [20, 35];
}

export function calculateCheckout(lines: SummaryLine[], store?: Pick<Store, "deliveryFee" | "minBasket">, tip = 0) {
  // Sum in kuruş to avoid floating-point rounding in totals and minimum checks.
  const subtotalCents = lines.reduce((sum, { product, quantity }) => sum + Math.round(product.price * 100) * quantity, 0);
  const deliveryCents = lines.length ? Math.round((store?.deliveryFee ?? 0) * 100) : 0;
  const minimumCents = Math.round((store?.minBasket ?? 0) * 100);
  const tipCents = lines.length && TIP_AMOUNTS.some(amount => amount === tip) ? tip * 100 : 0;
  return { subtotal: subtotalCents / 100, deliveryFee: deliveryCents / 100,
    minimum: minimumCents / 100, remaining: Math.max(0, minimumCents - subtotalCents) / 100,
    tip: tipCents / 100, total: (subtotalCents + deliveryCents + tipCents) / 100,
    count: lines.reduce((sum, line) => sum + line.quantity, 0),
    canContinue: lines.length > 0 && subtotalCents >= minimumCents };
}
