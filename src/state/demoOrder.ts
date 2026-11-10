import { useEffect, useState } from "react";
import type { PaymentMethod, Service } from "../types/domain";

export type DemoOrderStage = 0 | 1 | 2 | 3;

export const DEMO_TRACKING_STEPS = [
  { title: "Sipariş alındı", detail: "Siparişin işletmeye iletildi ve onaylandı." },
  { title: "Hazırlanıyor", detail: "Siparişin özenle hazırlanıyor." },
  { title: "Yola çıktı", detail: "Kurye siparişini teslim etmek üzere yola çıktı." },
  { title: "Teslim edildi", detail: "Siparişin teslim edildi. Afiyet olsun!" },
] as const;

/** Elapsed-time thresholds (ms) for automatic stage progression after order creation. */
export const AUTO_STAGE_THRESHOLDS_MS = {
  preparing: 4_000,
  onTheWay: 9_000,
  delivered: 15_000,
} as const;

export type DemoOrder = {
  orderId: string;
  amount: number;
  service: Service;
  method: PaymentMethod;
  stage: DemoOrderStage;
  createdAt: string;
  locationLabel?: string;
  storeName?: string;
  itemCount?: number;
  customerName?: string;
};

const STORAGE_KEY = "hci-yemeksepeti-last-demo-order-v1";
const ORDERS_LIST_KEY = "hci-yemeksepeti-orders-v1";
const ORDER_EVENT = "ys-order-updated";

/** Compute current automatic stage from creation timestamp and current wall clock. */
export function getAutoOrderStage(createdAt: string, nowMs = Date.now()): DemoOrderStage {
  const createdMs = Date.parse(createdAt);
  if (!Number.isFinite(createdMs)) return 0;
  const elapsed = Math.max(0, nowMs - createdMs);
  if (elapsed >= AUTO_STAGE_THRESHOLDS_MS.delivered) return 3;
  if (elapsed >= AUTO_STAGE_THRESHOLDS_MS.onTheWay) return 2;
  if (elapsed >= AUTO_STAGE_THRESHOLDS_MS.preparing) return 1;
  return 0;
}

function normalizeOrder(raw: unknown, nowMs = Date.now()): DemoOrder | null {
  if (!raw || typeof raw !== "object") return null;
  const order = raw as Partial<DemoOrder>;
  if (typeof order.orderId !== "string" || !/^(?:YS|DEMO)-\d{7}$/.test(order.orderId)) return null;
  if (typeof order.amount !== "number" || !Number.isFinite(order.amount) || order.amount < 0) return null;
  if (order.service !== "food" && order.service !== "market") return null;
  if (order.method !== "cash-demo" && order.method !== "card-demo") return null;
  if (order.stage !== 0 && order.stage !== 1 && order.stage !== 2 && order.stage !== 3) return null;
  if (typeof order.createdAt !== "string" || !Number.isFinite(Date.parse(order.createdAt))) return null;
  if (order.locationLabel !== undefined && typeof order.locationLabel !== "string") return null;
  if (order.storeName !== undefined && typeof order.storeName !== "string") return null;
  if (order.customerName !== undefined && typeof order.customerName !== "string") return null;
  if (order.itemCount !== undefined && (!Number.isInteger(order.itemCount) || order.itemCount < 1)) return null;

  const autoStage = getAutoOrderStage(order.createdAt, nowMs);
  const effectiveStage = Math.max(order.stage, autoStage) as DemoOrderStage;
  return { ...(order as DemoOrder), stage: effectiveStage };
}

export function readDemoOrders(nowMs = Date.now()): DemoOrder[] {
  try {
    const rawList = sessionStorage.getItem(ORDERS_LIST_KEY);
    if (rawList) {
      const parsed: unknown = JSON.parse(rawList);
      if (Array.isArray(parsed)) {
        const normalized = parsed
          .map((item) => normalizeOrder(item, nowMs))
          .filter((item): item is DemoOrder => item !== null);
        if (normalized.length > 0) return normalized;
      }
    }

    const rawSingle = sessionStorage.getItem(STORAGE_KEY);
    if (!rawSingle) return [];
    const single = normalizeOrder(JSON.parse(rawSingle), nowMs);
    return single ? [single] : [];
  } catch {
    return [];
  }
}

export function readDemoOrder(nowMs = Date.now()): DemoOrder | null {
  return readDemoOrders(nowMs)[0] ?? null;
}

export function saveDemoOrder(order: DemoOrder): void {
  try {
    const existing = readDemoOrders().filter((item) => item.orderId !== order.orderId);
    const updated = [order, ...existing].slice(0, 20);
    sessionStorage.setItem(ORDERS_LIST_KEY, JSON.stringify(updated));
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(order));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(ORDER_EVENT));
    }
  } catch {
    /* Browser storage can be unavailable; navigation state still works. */
  }
}

/** Reactive hook returning all orders with automatic live stage updates. */
export function useDemoOrders(): DemoOrder[] {
  const [orders, setOrders] = useState<DemoOrder[]>(() => readDemoOrders());

  useEffect(() => {
    const sync = () => {
      const next = readDemoOrders();
      setOrders((prev) => {
        if (
          prev.length === next.length &&
          prev.every((item, idx) => item.orderId === next[idx].orderId && item.stage === next[idx].stage)
        ) {
          return prev;
        }
        return next;
      });
    };
    sync();
    window.addEventListener(ORDER_EVENT, sync);
    const timer = window.setInterval(sync, 1000);
    return () => {
      window.removeEventListener(ORDER_EVENT, sync);
      window.clearInterval(timer);
    };
  }, []);

  return orders;
}

/** Reactive hook returning the latest order with automatic live stage updates. */
export function useDemoOrder(): DemoOrder | null {
  const orders = useDemoOrders();
  return orders[0] ?? null;
}
