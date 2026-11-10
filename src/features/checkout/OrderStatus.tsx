import type { DemoOrder } from "../../state/demoOrder";
import { deliveryTimeLabel, ORDER_STAGES, orderStatusDescription } from "./orderStatusModel";

export default function OrderStatus({ order }: { order: DemoOrder }) {
  return <section aria-labelledby="order-status-title" className="rounded-2xl border border-slate-300 bg-white p-6">
    <h2 id="order-status-title" className="text-xl font-semibold">Sipariş durumu</h2>
    <ol className="mt-6 space-y-6">
      {ORDER_STAGES.map((label, index) => {
        const current = order.stage === index;
        const completed = index < order.stage || order.stage === 3;
        return <li key={label} aria-current={current ? "step" : undefined} className="flex items-center gap-3">
          <span aria-hidden="true" className={"flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-sm font-semibold " + (index <= order.stage ? "border-[#166534] bg-[#166534] text-white" : "border-slate-300 bg-white text-slate-600")}>{completed ? "✓" : index + 1}</span>
          <span className={current ? "font-semibold" : index > order.stage ? "text-slate-600" : ""}>{label}<span className="sr-only">{current ? ", şu anki aşama" : completed ? ", tamamlandı" : ", henüz başlamadı"}</span></span>
        </li>;
      })}
    </ol>
    <div className="mt-6 border-t border-slate-300 pt-6">
      <p className="text-sm font-semibold text-slate-600">Tahmini teslimat</p>
      <p className="mt-2 text-2xl font-bold tabular-nums">{deliveryTimeLabel(order)}</p>
      <p role="status" aria-live="polite" aria-atomic="true" className="mt-4 leading-6 text-slate-600">{orderStatusDescription(order)}</p>
    </div>
  </section>;
}
