import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate, useOutletContext, useParams, useSearchParams } from "react-router-dom";
import type { LayoutContext } from "../components/Layout";
import { useCart } from "../state/CartContext";
import { useDelivery } from "../state/DeliveryContext";
import { saveDemoOrder, type DemoOrder } from "../state/demoOrder";
import { formatTRY, type Service } from "../types/domain";
import { marketStores } from "../features/market/data/marketData";
import AddressForm from "../features/checkout/AddressForm";
import CheckoutSteps from "../features/checkout/CheckoutSteps";
import OrderSummary from "../features/checkout/OrderSummary";
import {
  calculateCheckout, checkoutStorage, clearCheckoutDraft, readCheckoutDraft,
  saveCheckoutDraft, SAVED_ADDRESS, validateAddress, type AddressErrors, type AddressValues,
} from "../features/checkout/checkoutModel";

export default function CheckoutPage() {
  const { service } = useParams();
  const { delivery } = useDelivery();
  if (service !== "food" && service !== "market") return <Navigate to="/" replace />;
  if (!delivery) return null; // Shared Layout owns region selection and coverage checks.
  return <CheckoutFlow key={`${service}:${delivery.id}`} service={service} regionId={delivery.id} regionLabel={`${delivery.city} / ${delivery.district} / ${delivery.neighborhood}`} />;
}

function CheckoutFlow({ service, regionId, regionLabel }: { service: Service; regionId: string; regionLabel: string }) {
  const { carts, clear } = useCart();
  const { openAddress } = useOutletContext<LayoutContext>();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [draft, setDraft] = useState(() => readCheckoutDraft(checkoutStorage(), service, regionId));
  const [errors, setErrors] = useState<AddressErrors>({});
  const [announcement, setAnnouncement] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const submittedRef = useRef(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const previousStep = useRef(false);
  const lines = carts[service];
  const store = service === "market" ? marketStores.find(item => item.id === lines[0]?.product.storeId) : undefined;
  const totals = calculateCheckout(lines, store);
  const addressValid = Object.keys(validateAddress(draft)).length === 0;
  const payment = params.get("step") === "payment" && addressValid;

  useEffect(() => { saveCheckoutDraft(checkoutStorage(), service, regionId, draft); }, [draft, service, regionId]);
  useEffect(() => {
    if (params.get("step") === "payment" && !addressValid) {
      const next = new URLSearchParams(params); next.delete("step"); setParams(next, { replace: true });
    }
  }, [params, setParams, addressValid]);
  useEffect(() => {
    if (previousStep.current !== payment) {
      headingRef.current?.focus();
      previousStep.current = payment;
    }
  }, [payment]);

  const change = (field: keyof AddressValues, value: string) => {
    const next = { ...draft, [field]: value };
    setDraft(next);
    if (errors[field]) setErrors(current => ({ ...current, [field]: validateAddress(next)[field] }));
    setAnnouncement("");
  };
  const goAddress = () => { const next = new URLSearchParams(params); next.delete("step"); setParams(next); };
  const continueToPayment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!totals.canContinue) return;
    const nextErrors = validateAddress(draft);
    setErrors(nextErrors);
    const firstError = (["name", "address", "note"] as const).find(field => nextErrors[field]);
    if (firstError) {
      setAnnouncement("Devam etmek için işaretli adres bilgilerini düzelt.");
      document.getElementById(`checkout-${firstError}`)?.focus();
      return;
    }
    const next = new URLSearchParams(params); next.set("step", "payment"); setParams(next);
  };

  // Preserve the starter's local payment simulation during this address increment.
  // The full card form and payment failure states follow in the next increment.
  const submitOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submittedRef.current || !totals.canContinue || !addressValid) return;
    submittedRef.current = true; setSubmitting(true);
    const order: DemoOrder = {
      orderId: "DEMO-" + Date.now().toString().slice(-7), amount: totals.total,
      service, method: draft.method, stage: 0, createdAt: new Date().toISOString(),
    };
    saveDemoOrder(order);
    clearCheckoutDraft(checkoutStorage(), service, regionId);
    clear(service);
    navigate("/success", { state: order, replace: true });
  };

  if (!lines.length) return <section className="mx-auto max-w-2xl rounded-2xl border border-slate-300 bg-white p-8">
    <h1 className="text-[32px] font-bold">{service === "food" ? "Yemek" : "Market"} sepetin boş</h1>
    <p className="my-5 text-slate-600">Siparişe devam etmek için önce sepete ürün ekle. Diğer bölümdeki ürünlerin kendi sepetinde durur.</p>
    <Link className="btn-primary" to={service === "food" ? "/food" : "/market"}>Ürünleri keşfet</Link>
  </section>;

  return <div className="space-y-6">
    <div className="flex items-center gap-6">
      {payment ? <button className="min-h-12 rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold hover:border-brand" onClick={goAddress}>← Adrese dön</button> : <Link to={`/cart/${service}`} className="min-h-12 rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold hover:border-brand">← Sepete dön</Link>}
      <span className="text-sm font-semibold text-slate-600">{service === "food" ? "YEMEK" : "MARKET"}</span>
    </div>
    <CheckoutSteps payment={payment} onAddress={goAddress} />
    <div className="pb-1">
      <h1 ref={headingRef} tabIndex={-1} className="text-[32px] font-bold leading-10">{payment ? "Ödeme yöntemi" : "Teslimat adresi"}</h1>
      <p className="mt-2 text-slate-600">{payment ? "Ödeme yöntemini ve siparişini kontrol et." : "Siparişini nereye teslim edelim?"}</p>
    </div>
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_392px]">
      {payment ? <form id="checkout-payment-form" onSubmit={submitOrder} className="space-y-6 rounded-2xl border border-slate-300 bg-white p-6">
        <fieldset disabled={submitting} className="space-y-4">
          <legend className="mb-5 text-xl font-semibold">Nasıl ödemek istersin?</legend>
          <label className={"flex min-h-20 cursor-pointer items-center gap-3 rounded-xl border p-4 " + (draft.method === "card-demo" ? "border-brand bg-pink-50" : "border-slate-300")}>
            <input className="h-5 w-5 accent-brand" type="radio" name="payment" value="card-demo" checked={draft.method === "card-demo"} onChange={() => setDraft(current => ({ ...current, method: "card-demo" }))} />
            <span className="font-semibold">Online Kredi Kartı/Banka Kartı</span>
          </label>
          {service === "food" && <label className={"flex min-h-20 cursor-pointer items-center gap-3 rounded-xl border p-4 " + (draft.method === "cash-demo" ? "border-brand bg-pink-50" : "border-slate-300")}>
            <input className="h-5 w-5 accent-brand" type="radio" name="payment" value="cash-demo" checked={draft.method === "cash-demo"} onChange={() => setDraft(current => ({ ...current, method: "cash-demo" }))} />
            <span><strong className="block">Nakit</strong><span className="mt-1 block text-sm text-slate-600">Siparişini teslim alırken öde.</span></span>
          </label>}
        </fieldset>
        <section className="border-t border-slate-300 pt-5" aria-labelledby="selected-address-title">
          <h2 id="selected-address-title" className="font-semibold">Teslimat adresi</h2>
          <p className="mt-3 leading-7">{draft.name}<br />{draft.address}<br />{regionLabel}</p>
          {draft.note && <p className="mt-3 text-sm text-slate-600">Teslimat notu: {draft.note}</p>}
          <button type="button" onClick={goAddress} className="mt-4 min-h-11 rounded-lg font-semibold text-brand underline underline-offset-4">Adresi düzenle</button>
        </section>
      </form> : <AddressForm values={draft} errors={errors} regionLabel={regionLabel} onChange={change} onBlur={field => setErrors(current => ({ ...current, [field]: validateAddress(draft)[field] }))} onUseSaved={() => { setDraft(current => ({ ...current, ...SAVED_ADDRESS })); setErrors({}); setAnnouncement(""); }} onRegionChange={openAddress} onSubmit={continueToPayment} />}
      <aside aria-label="Sipariş özeti ve devam işlemi" className="space-y-4">
        <OrderSummary lines={lines} service={service} totals={totals} />
        {!totals.canContinue && <p id="checkout-minimum" role="status" className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm font-medium text-amber-900">Minimum sepet tutarı {formatTRY(totals.minimum)}. Devam etmek için {formatTRY(totals.remaining)} tutarında ürün ekle. Teslimat ücreti minimum tutara dahil değildir.</p>}
        <button type="submit" form={payment ? "checkout-payment-form" : "checkout-address-form"} disabled={!totals.canContinue || submitting} aria-describedby={!totals.canContinue ? "checkout-minimum" : "checkout-next-hint"} className="btn-primary w-full">{submitting ? "Sipariş oluşturuluyor…" : payment ? "Siparişi tamamla" : "Ödemeye geç"}</button>
        <p id="checkout-next-hint" className="text-sm leading-6 text-slate-600">{payment ? "Onayladığında siparişin oluşturulur." : "Sonraki adımda ödeme yöntemini seçeceksin."}</p>
        <p role="alert" className="text-sm font-medium text-red-800">{announcement}</p>
      </aside>
    </div>
  </div>;
}
