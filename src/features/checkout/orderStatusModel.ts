import type { DemoOrder, DemoOrderStage } from "../../state/demoOrder";

// Fixed classroom timeline, not a courier feed. See the presentation/test guide.
export const STAGE_AFTER_MS = [0, 12_000, 30_000, 60_000] as const;
export const ORDER_STAGES = ["Sipariş alındı", "Hazırlanıyor", "Kurye siparişini teslim aldı", "Teslim edildi"] as const;
export const ORDER_TITLES = ["Siparişin alındı", "Siparişin hazırlanıyor", "Kurye siparişini teslim aldı", "Siparişin teslim edildi"] as const;

export function advanceDemoOrder(order: DemoOrder, now = Date.now()): DemoOrder {
  const elapsed = now - Date.parse(order.createdAt);
  let stage = order.stage;
  STAGE_AFTER_MS.forEach((after, index) => { if (elapsed >= after && index > stage) stage = index as DemoOrderStage; });
  return stage === order.stage ? order : { ...order, stage };
}
export function orderStatusDescription(order: DemoOrder): string {
  const seller = order.service === "food" ? "restorana" : "mağazaya";
  return [
    `Siparişin ${seller} iletildi. Hazırlanmaya başladığında durum bilgisi güncellenecek.`,
    "Siparişin hazırlanıyor. Kurye teslim aldığında durum bilgisi güncellenecek.",
    "Kurye, siparişini teslim aldı ve adresine doğru yola çıktı.",
    order.service === "food" ? "Afiyet olsun! Sipariş bilgilerini aşağıda bulabilirsin." : "Alışverişin teslim edildi. Sipariş bilgilerini aşağıda bulabilirsin.",
  ][order.stage];
}
const clock = (time: number) => new Intl.DateTimeFormat("tr-TR", { timeZone: "Europe/Istanbul", hour: "2-digit", minute: "2-digit" }).format(new Date(time));
export function deliveryTimeLabel(order: DemoOrder): string {
  const created = Date.parse(order.createdAt);
  if (order.stage === 3) return clock(created + STAGE_AFTER_MS[3]);
  if (!order.snapshot) return "Teslimat zamanı bu kayıtta bulunmuyor";
  const [from, to] = order.snapshot.deliveryMinutes;
  return `${clock(created + from * 60_000)} – ${clock(created + to * 60_000)}`;
}
