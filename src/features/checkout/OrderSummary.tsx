import { Link } from "react-router-dom";
import { formatTRY, type Service } from "../../types/domain";
import type { calculateCheckout, SummaryLine } from "./checkoutModel";

type Props = { lines: SummaryLine[]; service: Service; totals: ReturnType<typeof calculateCheckout>; showTip?: boolean; disabled?: boolean; completed?: boolean; onDetails?: () => void };
export default function OrderSummary({ lines, service, totals, showTip = false, disabled = false, completed = false, onDetails }: Props) {
  return <section aria-labelledby="checkout-summary-title" className="rounded-2xl border border-slate-300 bg-white p-6">
    <h2 id="checkout-summary-title" className="text-xl font-semibold">Sipariş özeti</h2>
    <p className="mt-3 font-semibold">{lines[0]?.product.storeName}</p>
    <p className="mt-2 text-sm text-slate-600">{service === "food" ? "Yemek" : "Market"} {completed ? "siparişi" : "sepeti"} · {totals.count} ürün</p>
    <ul className="my-6 space-y-4">
      {lines.map(({ product, quantity }) => <li key={product.id} className="flex items-start justify-between gap-4">
        <div className="min-w-0"><p className="break-words">{quantity} × {product.name}</p><p className="mt-1 text-sm text-slate-600">{product.unitLabel ? `${product.unitLabel} · ` : ""}{formatTRY(product.price)} / adet</p></div>
        <span className="shrink-0 tabular-nums">{formatTRY(Math.round(product.price * 100) * quantity / 100)}</span>
      </li>)}
    </ul>
    <dl className="space-y-4 border-t border-slate-300 pt-6">
      <div className="flex justify-between gap-4"><dt>Ara toplam</dt><dd className="tabular-nums">{formatTRY(totals.subtotal)}</dd></div>
      <div className="flex justify-between gap-4"><dt>Teslimat ücreti</dt><dd className="tabular-nums">{formatTRY(totals.deliveryFee)}</dd></div>
      {(showTip || totals.tip > 0) && <div className="flex justify-between gap-4"><dt>Bahşiş</dt><dd className="tabular-nums">{formatTRY(totals.tip)}</dd></div>}
      <div className="flex justify-between gap-4 border-t border-slate-300 pt-6 text-xl font-bold"><dt>Toplam</dt><dd aria-live="polite" aria-atomic="true" className="tabular-nums">{formatTRY(totals.total)}</dd></div>
    </dl>
    <p className="mt-3 text-sm text-slate-600">Tüm ücretler toplama dahildir.</p>
    {completed ? <button type="button" onClick={onDetails} className="mt-6 flex min-h-12 w-full items-center justify-center rounded-xl border border-slate-300 px-5 py-3 font-semibold hover:border-brand hover:bg-slate-50">Sipariş ayrıntıları</button> : disabled ? <button type="button" disabled className="mt-6 flex min-h-12 w-full items-center justify-center rounded-xl border border-slate-300 px-5 py-3 font-semibold">Sepeti düzenle</button> : <Link to={`/cart/${service}`} className="mt-6 flex min-h-12 items-center justify-center rounded-xl border border-slate-300 px-5 py-3 font-semibold hover:border-brand hover:bg-slate-50">Sepeti düzenle</Link>}
  </section>;
}
