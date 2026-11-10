import { useEffect, useState } from "react";
import type { PaymentMethod, Service } from "../types/domain";

export type DemoOrderStage = 0 | 1 | 2 | 3;

export const DEMO_TRACKING_STEPS = [
  { title: "Sipariş alındı", detail: "Siparişin işletmeye iletildi ve onaylandı." },
  { title: "Hazırlanıyor", detail: "Siparişin özenle hazırlanıyor." },
  { title: "Yola çıktı", detail: "Kurye siparişini teslim etmek üzere yola çıktı." },
  { title: "Teslim edildi", detail: "Siparişin teslim edildi. Afiyet olsun!" },
] as const;

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
const ORDER_EVENT = "ys-order-updated";

export function readDemoOrder(): DemoOrder | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const item: unknown = JSON.parse(raw);
    if (!item || typeof item !== "object") return null;
    const order = item as Partial<DemoOrder>;
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
    return order as DemoOrder;
  } catch {
    return null;
  }
}

export function saveDemoOrder(order: DemoOrder): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(order));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(ORDER_EVENT));
    }
  } catch {
    /* Browser storage can be unavailable; navigation state still works. */
  }
}

export function clearDemoOrder(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(ORDER_EVENT));
    }
  } catch {
    /* storage optional */
  }
}

export function useDemoOrder(): DemoOrder | null {
  const [order, setOrder] = useState<DemoOrder | null>(readDemoOrder);

  useEffect(() => {
    const sync = () => setOrder(readDemoOrder());
    window.addEventListener(ORDER_EVENT, sync);
    return () => window.removeEventListener(ORDER_EVENT, sync);
  }, []);

  return order;
}
