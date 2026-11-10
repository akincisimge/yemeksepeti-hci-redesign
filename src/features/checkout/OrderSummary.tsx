import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { formatTRY, type Service } from "../../types/domain";
import type { calculateCheckout, SummaryLine } from "./checkoutModel";

type Props = { lines: SummaryLine[]; service: Service; totals: ReturnType<typeof calculateCheckout>; showTip?: boolean; disabled?: boolean; completed?: boolean; onDetails?: () => void; compact?: boolean; deliveryEstimate?: string; review?: ReactNode; children?: ReactNode };
export default function OrderSummary({ lines, service, totals, showTip = false, disabled = false, completed = false, onDetails, compact = false, deliveryEstimate, review, children }: Props) {
  const item = ({ product, quantity }: SummaryLine) => <li key={product.id} className="flex items-start justify-between gap-4">
    <div className="min-w-0"><p className="break-words">{quantity} × {product.name}</p><p className="mt-1 text-sm text-slate-600">{product.unitLabel ? `${product.unitLabel} · ` : ""}{formatTRY(product.price)} / adet</p></div>
    <span className="shrink-0 tabular-nums">{formatTRY(Math.round(product.price * 100) * quantity / 100)}</span>
  </li>;
  const visibleLines = compact ? lines.slice(0, 3) : lines;
  return <section aria-labelledby="checkout-summary-title" className={"rounded-2xl border border-slate-300 bg-white " + (compact ? "p-5" : "p-6")}>
    <div className="flex items-center justify-between gap-3">
      <h2 id="checkout-summary-title" className="text-xl font-semibold">Sipariş özeti</h2>
      {compact && !completed && (disabled ? <button type="button" disabled className="min-h-11 rounded-lg px-1 text-sm font-semibold">Sepeti düzenle</button> : <Link to={`/cart/${service}`} className="flex min-h-11 items-center rounded-lg px-1 text-sm font-semibold text-brand underline underline-offset-4">Sepeti düzenle</Link>)}
    </div>
    <p className={compact ? "mt-2 font-semibold" : "mt-3 font-semibold"}>{lines[0]?.product.storeName}</p>
    <p className="mt-1 text-sm text-slate-600">{service === "food" ? "Yemek" : "Market"} {completed ? "siparişi" : "sepeti"} · {totals.count} ürün</p>
    {deliveryEstimate && <p className="mt-3 flex items-center gap-2 text-sm font-medium text-slate-700"><svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="12" r="9" /><path d="M12 6v6l4 2" /></svg>Tahmini teslimat: {deliveryEstimate}</p>}
    <ul className={compact ? "my-4 space-y-3 text-sm" : "my-6 space-y-4"}>{visibleLines.map(item)}</ul>
    {compact && lines.length > 3 && <details className="mb-3 border-t border-slate-200 pt-2">
      <summary className="min-h-11 cursor-pointer content-center rounded-lg text-sm font-semibold text-brand">Diğer {lines.length - 3} ürün çeşidini göster</summary>
      <ul className="mt-3 space-y-3 text-sm">{lines.slice(3).map(item)}</ul>
    </details>}
    {review}
    <dl className={(compact ? "space-y-2 pt-4" : "space-y-4 pt-6") + " border-t border-slate-300"}>
      <div className="flex justify-between gap-4"><dt>Ara toplam</dt><dd className="tabular-nums">{formatTRY(totals.subtotal)}</dd></div>
      <div className="flex justify-between gap-4"><dt>Teslimat ücreti</dt><dd className="tabular-nums">{formatTRY(totals.deliveryFee)}</dd></div>
      {(showTip || totals.tip > 0) && <div className="flex justify-between gap-4"><dt>Bahşiş</dt><dd className="tabular-nums">{formatTRY(totals.tip)}</dd></div>}
      <div className={"flex justify-between gap-4 border-t border-slate-300 text-xl font-bold " + (compact ? "mt-3 pt-3" : "pt-6")}><dt>Toplam</dt><dd aria-live="polite" aria-atomic="true" className="tabular-nums">{formatTRY(totals.total)}</dd></div>
    </dl>
    <p className={(compact ? "mt-2" : "mt-3") + " text-sm text-slate-600"}>Tüm ücretler toplama dahildir.</p>
    {children}
    {completed ? <button type="button" onClick={onDetails} className="mt-6 flex min-h-12 w-full items-center justify-center rounded-xl border border-slate-300 px-5 py-3 font-semibold hover:border-brand hover:bg-slate-50">Sipariş ayrıntıları</button> : !compact && (disabled ? <button type="button" disabled className="mt-6 flex min-h-12 w-full items-center justify-center rounded-xl border border-slate-300 px-5 py-3 font-semibold">Sepeti düzenle</button> : <Link to={`/cart/${service}`} className="mt-6 flex min-h-12 items-center justify-center rounded-xl border border-slate-300 px-5 py-3 font-semibold hover:border-brand hover:bg-slate-50">Sepeti düzenle</Link>)}
  </section>;
}
