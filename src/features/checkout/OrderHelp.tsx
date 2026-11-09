import { useState } from "react";
import { formatTRY, PAYMENT_METHOD_LABELS } from "../../types/domain";
import type { DemoOrder } from "../../state/demoOrder";
import { ORDER_STAGES } from "./orderStatusModel";

export default function OrderHelp({ order, onDetails }: { order: DemoOrder; onDetails: () => void }) {
  const [open, setOpen] = useState(false);
  return <section aria-labelledby="order-help-title" className="rounded-2xl border border-slate-300 bg-white p-6">
    <h2 id="order-help-title" className="font-semibold">Yardıma mı ihtiyacın var?</h2>
    <p className="mt-3 text-sm leading-6 text-slate-600">Siparişinle ilgili yardım alabilirsin.</p>
    <button type="button" aria-expanded={open} aria-controls="order-help-topics" onClick={() => setOpen(value => !value)} className="mt-4 min-h-12 w-full rounded-xl border border-slate-300 px-5 py-3 font-semibold hover:border-brand">{open ? "Yardımı kapat" : "Yardım al"}</button>
    {open && <div id="order-help-topics" className="mt-5 space-y-5 border-t border-slate-300 pt-5 text-sm leading-6">
      <div><h3 className="font-semibold">Siparişim hangi aşamada?</h3><p className="mt-1 text-slate-600">{ORDER_STAGES[order.stage]}. Güncellemeleri sipariş durumu bölümünden izleyebilirsin.</p></div>
      <div><h3 className="font-semibold">Ödeme bilgilerini nerede görebilirim?</h3><p className="mt-1 text-slate-600">Seçtiğin yöntem: {PAYMENT_METHOD_LABELS[order.method]}. Toplam tutar: {formatTRY(order.amount)}.{order.method !== "card-demo" && " Ödemeyi teslimat sırasında yapacaksın."}</p></div>
      <div><h3 className="font-semibold">Sipariş adresimi kontrol etmek istiyorum</h3><p className="mt-1 text-slate-600">Sipariş bilgileri, onayladığın teslimat adresini gösterir. Yeni alışveriş için konumunu değiştirmen bu siparişin adresini değiştirmez.</p><button type="button" onClick={onDetails} className="mt-2 min-h-11 rounded-lg font-semibold text-brand underline underline-offset-4">Sipariş bilgilerine git</button></div>
    </div>}
  </section>;
}
