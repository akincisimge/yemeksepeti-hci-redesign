import type { PaymentMethod, Service } from "../types/domain";

export type DemoOrderStage = 0 | 1 | 2 | 3;

export const DEMO_TRACKING_STEPS = [
  { title: "Sipariş alındı", detail: "Demo siparişin oluşturuldu ve kaydedildi." },
  { title: "Hazırlanıyor", detail: "Örnek hazırlık aşaması gösteriliyor." },
  { title: "Yola çıktı", detail: "Örnek teslimat yolculuğu gösteriliyor." },
  { title: "Teslim edildi", detail: "Demo sipariş süreci tamamlandı." },
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

export function readDemoOrder(): DemoOrder | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const item: unknown = JSON.parse(raw);
    if (!item || typeof item !== "object") return null;
    const order = item as Partial<DemoOrder>;
    if (typeof order.orderId !== "string" || !/^DEMO-\d{7}$/.test(order.orderId)) return null;
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
  } catch {
    /* Browser storage can be unavailable; navigation state still works. */
  }
}

export function clearDemoOrder(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* storage optional */
  }
}

export function createSamplePreviewOrder(locationText?: string): DemoOrder {
  return {
    orderId: "DEMO-" + Date.now().toString().slice(-7),
    amount: 245,
    service: "food",
    method: "card-demo",
    stage: 1,
    createdAt: new Date().toISOString(),
    locationLabel: locationText ?? "Kötekli, Menteşe, Muğla (Örnek)",
    storeName: "Crispy Co Burger (Önizleme)",
    itemCount: 2,
    customerName: "Örnek Kullanıcı",
  };
}
