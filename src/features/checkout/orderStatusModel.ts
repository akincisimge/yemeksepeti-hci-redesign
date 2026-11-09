import type { DemoOrder } from "../../state/demoOrder";

export const ORDER_STAGES = ["Sipariş alındı", "Hazırlanıyor", "Kurye siparişini teslim aldı", "Teslim edildi"] as const;
export const ORDER_TITLES = ["Siparişin alındı", "Siparişin hazırlanıyor", "Kurye siparişini teslim aldı", "Siparişin teslim edildi"] as const;

// Presentation stops at order placement. Older accelerated examples are reset
// to the same confirmation state without changing their order details.
export function confirmationOrder(order: DemoOrder): DemoOrder {
  return order.stage === 0 ? order : { ...order, stage: 0 };
}
export function orderStatusDescription(order: DemoOrder): string {
  const seller = order.service === "food" ? "restorana" : "mağazaya";
  return [
    `Siparişin ${seller} iletildi. Sipariş bilgilerini ve tahmini teslimat aralığını bu ekrandan kontrol edebilirsin.`,
    "Siparişin hazırlanıyor. Kurye teslim aldığında durum bilgisi güncellenecek.",
    "Kurye, siparişini teslim aldı ve adresine doğru yola çıktı.",
    order.service === "food" ? "Afiyet olsun! Sipariş bilgilerini aşağıda bulabilirsin." : "Alışverişin teslim edildi. Sipariş bilgilerini aşağıda bulabilirsin.",
  ][order.stage];
}
const clock = (time: number) => new Intl.DateTimeFormat("tr-TR", { timeZone: "Europe/Istanbul", hour: "2-digit", minute: "2-digit" }).format(new Date(time));
export function deliveryTimeLabel(order: DemoOrder): string {
  const created = Date.parse(order.createdAt);
  if (!order.snapshot) return "Teslimat zamanı bu kayıtta bulunmuyor";
  const [from, to] = order.snapshot.deliveryMinutes;
  return `${clock(created + from * 60_000)} – ${clock(created + to * 60_000)}`;
}
