import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { formatTRY } from "../types/domain";
import { readDemoOrder, resolveDemoOrder, saveDemoOrder, type DemoOrder } from "../state/demoOrder";
import CheckoutSteps from "../features/checkout/CheckoutSteps";
import OrderSummary from "../features/checkout/OrderSummary";
import OrderStatus from "../features/checkout/OrderStatus";
import OrderHelp from "../features/checkout/OrderHelp";
import ConfirmationMark from "../features/checkout/ConfirmationMark";
import { paymentMethodLabel } from "../features/checkout/paymentModel";
import { calculateCheckout } from "../features/checkout/checkoutModel";
import { confirmationOrder, ORDER_TITLES } from "../features/checkout/orderStatusModel";

export default function SuccessPage() {
  const location = useLocation();
  const [order] = useState<DemoOrder | null>(() => {
    const resolved = resolveDemoOrder(location.state, readDemoOrder());
    return resolved ? confirmationOrder(resolved) : null;
  });
  const [saveFailed, setSaveFailed] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const detailsRef = useRef<HTMLHeadingElement>(null);
  const paymentNotice = typeof location.state?.paymentNotice === "string" ? location.state.paymentNotice : undefined;
  useEffect(() => { titleRef.current?.focus(); }, []);
  useEffect(() => { if (order) setSaveFailed(!saveDemoOrder(order)); }, [order]);
  const showDetails = () => {
    detailsRef.current?.focus({ preventScroll: true });
    detailsRef.current?.scrollIntoView({ block: "start", behavior: "instant" });
  };

  if (!order) return <section className="mx-auto max-w-2xl space-y-6 rounded-2xl border border-slate-300 bg-white p-8">
    <h1 ref={titleRef} tabIndex={-1} className="text-[32px] font-bold">Gösterilecek sipariş bulunamadı</h1>
    <p className="leading-7 text-slate-600">Bu sekmede görüntülenebilen bir sipariş kaydı yok. Alışverişine dönüp sepetini kontrol edebilirsin.</p>
    <Link to="/" className="btn-primary">Alışverişe dön</Link>
  </section>;

  const snapshot = order.snapshot;
  const totals = snapshot ? calculateCheckout(snapshot.lines, { deliveryFee: snapshot.deliveryFee }, snapshot.tip) : undefined;
  return <div className="space-y-6">
    <CheckoutSteps complete />
    <div className="flex items-center gap-4 py-2">
      <ConfirmationMark />
      <h1 ref={titleRef} tabIndex={-1} className="text-[32px] font-bold leading-10">{ORDER_TITLES[order.stage]}</h1>
    </div>
    {paymentNotice && <p role="status" className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">{paymentNotice}</p>}
    {saveFailed && <p role="status" className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">Siparişin oluşturuldu. Tarayıcı bu kaydı saklayamadığı için sayfayı yenilemeden sipariş numaranı ve bilgilerini not al.</p>}
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_392px]">
      <div className="space-y-6">
        <OrderStatus order={order} />
        <section aria-labelledby="order-details-title" className="rounded-2xl border border-slate-300 bg-white p-6">
          <h2 ref={detailsRef} id="order-details-title" tabIndex={-1} className="scroll-mt-24 text-xl font-semibold">Sipariş bilgileri</h2>
          <dl className="mt-6 space-y-5">
            <div><dt className="text-sm font-semibold text-slate-600">Sipariş numarası</dt><dd className="mt-2 font-medium">{order.orderId.replace(/^DEMO-/, order.service === "food" ? "YMK-" : "MKT-")}</dd></div>
            <div><dt className="text-sm font-semibold text-slate-600">Hizmet</dt><dd className="mt-2">{order.service === "food" ? "Yemek" : "Market"}{snapshot && ` · ${snapshot.lines[0].product.storeName}`}</dd></div>
            {snapshot ? <div><dt className="text-sm font-semibold text-slate-600">Teslimat adresi</dt><dd className="mt-2 break-words leading-7">{snapshot.address.name}<br />{snapshot.address.address}<br />{snapshot.address.regionLabel}</dd>{snapshot.address.note && <><dt className="mt-4 text-sm font-semibold text-slate-600">Teslimat notu</dt><dd className="mt-2 break-words leading-6">{snapshot.address.note}</dd></>}</div> : <div><dt className="text-sm font-semibold text-slate-600">Sipariş ayrıntıları</dt><dd className="mt-2 leading-6 text-slate-600">Bu eski kayıtta ürün ve teslimat adresi bilgileri bulunmuyor.</dd></div>}
            <div><dt className="text-sm font-semibold text-slate-600">Ödeme yöntemi</dt><dd className="mt-2">{paymentMethodLabel(order.method, order.service)}</dd></div>
          </dl>
        </section>
      </div>
      <aside aria-label="Sipariş özeti ve yardım" className="space-y-6">
        {snapshot && totals ? <OrderSummary lines={snapshot.lines} service={order.service} totals={totals} completed showTip onDetails={showDetails} /> : <section className="space-y-4 rounded-2xl border border-slate-300 bg-white p-6"><h2 className="text-xl font-semibold">Sipariş özeti</h2><div className="flex justify-between gap-4 font-bold"><span>Toplam</span><span>{formatTRY(order.amount)}</span></div></section>}
        <OrderHelp order={order} onDetails={showDetails} />
      </aside>
    </div>
    <Link to={order.service === "food" ? "/food" : "/market"} className="btn-primary min-w-[280px]">Alışverişe dön</Link>
  </div>;
}
