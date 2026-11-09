import type { CartLine, PaymentMethod, Service } from "../types/domain";
import { isPaymentMethod, TIP_AMOUNTS } from "../features/checkout/paymentModel.ts";
import { calculateCheckout, validateAddress, type AddressValues, type SummaryLine } from "../features/checkout/checkoutModel.ts";

export type DemoOrderStage = 0 | 1 | 2 | 3;
export type OrderSnapshot = {
  lines: SummaryLine[];
  address: AddressValues & { regionLabel: string };
  deliveryFee: number;
  tip: number;
  deliveryMinutes: [number, number];
};
export type DemoOrder = {
  orderId: string;
  amount: number;
  service: Service;
  method: PaymentMethod;
  stage: DemoOrderStage;
  createdAt: string;
  snapshot?: OrderSnapshot; // Older orders remain readable without invented details.
};

export const ORDER_STORAGE_KEY = "hci-yemeksepeti-last-demo-order-v1";
type OrderStorage = Pick<Storage, "getItem" | "setItem">;
function browserStorage(): OrderStorage | undefined {
  try { return sessionStorage; } catch { return undefined; }
}
const record = (value: unknown): value is Record<string, unknown> => !!value && typeof value === "object" && !Array.isArray(value);
const text = (value: unknown): value is string => typeof value === "string" && !!value.trim();
const money = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value) && value >= 0;

function parseSnapshot(value: unknown): OrderSnapshot | null {
  if (!record(value) || !Array.isArray(value.lines) || !value.lines.length || !record(value.address)) return null;
  const lines: SummaryLine[] = [];
  for (const line of value.lines) {
    if (!record(line) || !record(line.product)) return null;
    const { id, name, price, storeName, unitLabel } = line.product;
    if (!text(id) || !text(name) || !text(storeName) || !money(price) || (unitLabel !== undefined && typeof unitLabel !== "string")) return null;
    if (typeof line.quantity !== "number" || !Number.isSafeInteger(line.quantity) || line.quantity < 1) return null;
    lines.push({ quantity: line.quantity, product: { id, name, price, storeName, ...(unitLabel ? { unitLabel } : {}) } });
  }
  const { name, address, note, regionLabel } = value.address;
  if (!text(name) || !text(address) || typeof note !== "string" || !text(regionLabel)) return null;
  if (Object.keys(validateAddress({ name, address, note })).length) return null;
  const { deliveryFee, tip, deliveryMinutes } = value;
  if (!money(deliveryFee) || !TIP_AMOUNTS.some(amount => amount === tip)) return null;
  if (!Array.isArray(deliveryMinutes) || deliveryMinutes.length !== 2 || !deliveryMinutes.every(n => Number.isInteger(n) && n > 0 && n <= 180) || deliveryMinutes[0] > deliveryMinutes[1]) return null;
  return { lines, address: { name, address, note, regionLabel }, deliveryFee, tip: tip as number, deliveryMinutes: [deliveryMinutes[0], deliveryMinutes[1]] };
}

// Explicit allow-list excludes card fields and arbitrary navigation/storage data.
export function parseDemoOrder(value: unknown): DemoOrder | null {
  if (!record(value)) return null;
  const { orderId, amount, service, method, stage, createdAt } = value;
  if (typeof orderId !== "string" || !/^(DEMO|YMK|MKT)-\d{7}$/.test(orderId) || !money(amount)) return null;
  if (service !== "food" && service !== "market") return null;
  if ((orderId.startsWith("YMK-") && service !== "food") || (orderId.startsWith("MKT-") && service !== "market")) return null;
  if (!isPaymentMethod(method) || (service === "market" && method !== "card-demo")) return null;
  if (stage !== 0 && stage !== 1 && stage !== 2 && stage !== 3) return null;
  if (typeof createdAt !== "string" || !Number.isFinite(Date.parse(createdAt))) return null;
  const base = { orderId, amount, service, method, stage, createdAt } satisfies DemoOrder;
  if (value.snapshot === undefined) return base;
  const snapshot = parseSnapshot(value.snapshot);
  if (!snapshot || Math.round(calculateCheckout(snapshot.lines, { deliveryFee: snapshot.deliveryFee }, snapshot.tip).total * 100) !== Math.round(amount * 100)) return null;
  return { ...base, snapshot };
}

export function createDemoOrder(input: {
  service: Service; method: PaymentMethod; lines: CartLine[];
  address: AddressValues & { regionLabel: string }; deliveryFee: number; tip: number;
  deliveryTime?: string; now?: Date;
}): DemoOrder {
  const now = input.now ?? new Date();
  const range = /^(\d+)\s*[-–]\s*(\d+)/.exec(input.deliveryTime ?? "20-35");
  const order = parseDemoOrder({
    orderId: `${input.service === "food" ? "YMK" : "MKT"}-${now.getTime().toString().slice(-7).padStart(7, "0")}`,
    amount: calculateCheckout(input.lines, { deliveryFee: input.deliveryFee }, input.tip).total,
    service: input.service, method: input.method, stage: 0, createdAt: now.toISOString(),
    snapshot: {
      lines: input.lines, address: input.address, deliveryFee: input.deliveryFee, tip: input.tip,
      deliveryMinutes: range ? [Number(range[1]), Number(range[2])] : [20, 35],
    },
  });
  if (!order) throw new Error("Invalid order snapshot");
  return order;
}

export function readDemoOrder(storage = browserStorage()): DemoOrder | null {
  try { return parseDemoOrder(JSON.parse(storage?.getItem(ORDER_STORAGE_KEY) ?? "null")); }
  catch { return null; }
}
export function saveDemoOrder(order: DemoOrder, storage = browserStorage()): boolean {
  const safe = parseDemoOrder(order);
  if (!safe || !storage) return false;
  try { storage.setItem(ORDER_STORAGE_KEY, JSON.stringify(safe)); return true; }
  catch { return false; }
}
export function resolveDemoOrder(navigation: unknown, saved: DemoOrder | null): DemoOrder | null {
  const incoming = parseDemoOrder(navigation);
  if (!incoming) return saved;
  // A new checkout wins even if storage still contains an older order.
  if (incoming.orderId !== saved?.orderId) return incoming;
  return { ...incoming, snapshot: incoming.snapshot ?? saved.snapshot, stage: Math.max(incoming.stage, saved.stage) as DemoOrderStage };
}
