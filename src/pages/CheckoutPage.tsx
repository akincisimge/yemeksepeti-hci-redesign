import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate, useOutletContext, useParams, useSearchParams } from "react-router-dom";
import type { LayoutContext } from "../components/Layout";
import { useCart } from "../state/CartContext";
import { useDelivery } from "../state/DeliveryContext";
import { createDemoOrder, saveDemoOrder, type DemoOrder } from "../state/demoOrder";
import { formatTRY, type PaymentMethod, type Service } from "../types/domain";
import { marketStores } from "../features/market/data/marketData";
import { stores } from "../data/catalog";
import AddressForm from "../features/checkout/AddressForm";
import CheckoutSteps from "../features/checkout/CheckoutSteps";
import OrderSummary from "../features/checkout/OrderSummary";
import PaymentForm from "../features/checkout/PaymentForm";
import { checkoutCatalogPath, clearCheckoutReturn, readCheckoutReturn, rememberCheckoutReturn } from "../features/checkout/checkoutNavigation";
import {
  calculateCheckout, checkoutStorage, clearCheckoutDraft, deliveryMinutes, readCheckoutDraft,
  saveCheckoutDraft, SAVED_ADDRESS, validateAddress, type AddressErrors, type AddressValues,
} from "../features/checkout/checkoutModel";
import {
  CARD_FIELDS, EMPTY_CARD, cardFixture, createPaymentRunner, forgetFixture,
  formatCardNumber, formatExpiry, normalizePaymentMethod, paymentMethodLabel, readSavedFixture, saveFixture, validateCard,
  type CardErrors, type CardValues, type PaymentStatus, type SavedCardPreference,
} from "../features/checkout/paymentModel";

export default function CheckoutPage() {
  const { service } = useParams();
  const { delivery } = useDelivery();
  if (service !== "food" && service !== "market") return <Navigate to="/" replace />;
  if (!delivery) return null; // Shared Layout owns region selection and coverage checks.
  return <CheckoutFlow key={`${service}:${delivery.id}`} service={service} regionId={delivery.id} regionLabel={`${delivery.city} / ${delivery.district} / ${delivery.neighborhood}`} />;
}

function CheckoutFlow({ service, regionId, regionLabel }: { service: Service; regionId: string; regionLabel: string }) {
  const { carts, clear } = useCart();
  const lines = carts[service];
  const storeId = lines[0]?.product.storeId ?? "";
  const [returnVisit] = useState(() => readCheckoutReturn(checkoutStorage(), service, regionId, storeId));
  const returnHandled = useRef(false);
  const { openAddress } = useOutletContext<LayoutContext>();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [draft, setDraft] = useState(() => readCheckoutDraft(checkoutStorage(), service, regionId));
  const [errors, setErrors] = useState<AddressErrors>({});
  const [announcement, setAnnouncement] = useState("");
  // Raw card fields live only in this mounted checkout; never in storage or navigation state.
  const [card, setCard] = useState<CardValues>({ ...EMPTY_CARD });
  const [cardErrors, setCardErrors] = useState<CardErrors>({});
  const [status, setStatus] = useState<PaymentStatus>("idle");
  const [tip, setTip] = useState(returnVisit?.tip ?? 0);
  const [remember, setRemember] = useState(false);
  const [savedFixture, setSavedFixture] = useState(() => readSavedFixture(checkoutStorage()));
  const [selectedSaved, setSelectedSaved] = useState<SavedCardPreference>();
  const [savedMessage, setSavedMessage] = useState("");
  const [runner] = useState(() => createPaymentRunner());
  const attemptVersion = useRef(0);
  const returnFocusAfterCancel = useRef(false);
  const submitRef = useRef<HTMLButtonElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const previousStep = useRef(false);
  const store = (service === "market" ? marketStores : stores).find(item => item.id === storeId);
  const method = normalizePaymentMethod(draft.method, service, storeId);
  const totals = calculateCheckout(lines, store, tip);
  const estimate = deliveryMinutes(store?.deliveryTime);
  const deliveryEstimate = `${estimate[0]}–${estimate[1]} dk`;
  const addressValid = Object.keys(validateAddress(draft)).length === 0;
  const payment = params.get("step") === "payment" && addressValid;
  const processing = status === "processing";
  const cartSignature = JSON.stringify(lines.map(({ product, quantity }) => [product.id, product.storeId, product.price, quantity]));

  useEffect(() => { saveCheckoutDraft(checkoutStorage(), service, regionId, draft); }, [draft, service, regionId]);
  useEffect(() => {
    if (returnHandled.current) return;
    returnHandled.current = true;
    clearCheckoutReturn(checkoutStorage(), service, regionId);
    if (returnVisit && returnVisit.storeId === storeId && addressValid && params.get("step") !== "payment") {
      const next = new URLSearchParams(params);
      next.set("step", "payment");
      setParams(next, { replace: true });
    }
  }, [returnVisit, service, regionId, storeId, addressValid, params, setParams]);
  useEffect(() => {
    if (selectedSaved) document.getElementById("checkout-card-cvv")?.focus();
  }, [selectedSaved]);
  useEffect(() => {
    if (params.get("step") === "payment" && !addressValid) {
      const next = new URLSearchParams(params);
      next.delete("step");
      setParams(next, { replace: true });
    }
  }, [params, setParams, addressValid]);
  useEffect(() => {
    if (previousStep.current !== payment) {
      headingRef.current?.focus();
      previousStep.current = payment;
    }
  }, [payment]);
  useEffect(() => {
    setStatus("idle");
    return () => {
      // Also cancels on browser Back, region change, cart change or leaving checkout.
      attemptVersion.current += 1;
      runner.cancel();
    };
  }, [runner, payment, cartSignature]);
  useEffect(() => {
    if (status === "idle" && returnFocusAfterCancel.current) {
      returnFocusAfterCancel.current = false;
      submitRef.current?.focus();
    }
  }, [status]);

  const change = (field: keyof AddressValues, value: string) => {
    const next = { ...draft, [field]: value };
    setDraft(next);
    if (errors[field]) setErrors(current => ({ ...current, [field]: validateAddress(next)[field] }));
    setAnnouncement("");
  };
  const goAddress = () => {
    if (processing) return;
    const next = new URLSearchParams(params);
    next.delete("step");
    setParams(next);
  };
  const rememberShoppingReturn = () => {
    if (payment) rememberCheckoutReturn(checkoutStorage(), service, regionId, { storeId, tip });
    else clearCheckoutReturn(checkoutStorage(), service, regionId);
  };
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
    setAnnouncement("");
    const next = new URLSearchParams(params);
    next.set("step", "payment");
    setParams(next);
  };
  const changeCard = (field: keyof CardValues, raw: string) => {
    const value = field === "number" ? formatCardNumber(raw) : field === "expiry" ? formatExpiry(raw) : field === "cvv" ? raw.replace(/\D/g, "").slice(0, 4) : raw;
    const next = { ...card, [field]: value };
    setCard(next);
    if (cardErrors[field]) setCardErrors(current => ({ ...current, [field]: validateCard(next, new Date(), selectedSaved)[field] }));
    setStatus("idle");
    setAnnouncement("");
    setSavedMessage("");
  };
  const changeMethod = (method: PaymentMethod) => {
    setDraft(current => ({ ...current, method: normalizePaymentMethod(method, service, storeId) }));
    setStatus("idle");
    setAnnouncement("");
  };
  const useNewCard = () => {
    setSelectedSaved(undefined); setCard({ ...EMPTY_CARD }); setCardErrors({});
    setRemember(false); setStatus("idle"); setSavedMessage("");
    window.requestAnimationFrame(() => document.getElementById("checkout-card-holder")?.focus());
  };
  const cancelPayment = () => {
    attemptVersion.current += 1;
    runner.cancel();
    returnFocusAfterCancel.current = true;
    setStatus("idle");
    setAnnouncement("İşlem iptal edildi. Sipariş oluşturulmadı; sepetin ve bilgilerin korundu.");
  };

  const submitOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (runner.pending() || !payment || !totals.canContinue || !addressValid) return;
    if (method === "card-demo") {
      const nextErrors = validateCard(card, new Date(), selectedSaved);
      setCardErrors(nextErrors);
      const first = CARD_FIELDS.find(field => nextErrors[field]);
      if (first) {
        setAnnouncement("Devam etmek için işaretli kart bilgilerini düzelt.");
        document.getElementById(`checkout-card-${first}`)?.focus();
        return;
      }
    }
    const version = ++attemptVersion.current;
    const fixtureId = method === "card-demo" ? selectedSaved?.fixtureId ?? cardFixture(card.number) : undefined;
    setStatus("processing");
    setAnnouncement("");
    const result = await runner.run({ method, fixtureId, cardValidated: method === "card-demo" });
    if (version !== attemptVersion.current || result.status === "cancelled" || result.status === "busy") return;
    if (result.status === "failed") { setStatus("failed"); return; }

    let order: DemoOrder;
    try {
      order = createDemoOrder({
        service, method, lines,
        address: { name: draft.name, address: draft.address, note: draft.note, regionLabel },
        deliveryFee: totals.deliveryFee, tip: totals.tip, deliveryTime: store?.deliveryTime,
      });
    } catch { setStatus("failed"); return; }
    let paymentNotice: string | undefined;
    const last4 = selectedSaved?.last4 ?? card.number.replace(/\s/g, "").slice(-4);
    if (remember && method === "card-demo" && !saveFixture(checkoutStorage(), fixtureId ?? "presentation-card", last4)) {
      paymentNotice = "Siparişin oluşturuldu ancak kart tercihin kaydedilemedi. Sonraki siparişte kart bilgilerini yeniden girebilirsin.";
    }
    saveDemoOrder(order);
    clearCheckoutDraft(checkoutStorage(), service, regionId);
    clear(service);
    setCard({ ...EMPTY_CARD });
    navigate("/success", { state: { ...order, paymentNotice }, replace: true });
  };

  if (!lines.length) return <section className="mx-auto max-w-2xl rounded-2xl border border-slate-300 bg-white p-8">
    <h1 className="text-[32px] font-bold">{service === "food" ? "Yemek" : "Market"} sepetin boş</h1>
    <p className="my-5 text-slate-600">Siparişe devam etmek için önce sepete ürün ekle. Diğer bölümdeki ürünlerin kendi sepetinde durur.</p>
    <Link className="btn-primary" to={service === "food" ? "/food" : "/market"}>Ürünleri keşfet</Link>
  </section>;

  const nextHint = !payment ? "Sonraki adımda ödeme yöntemini seçeceksin."
    : processing ? "İşlem sürüyor. Tekrar tıklamana gerek yok."
    : method === "card-demo" ? "Bu adımı tamamladığında siparişin oluşturulur."
    : "Ödemeyi siparişini teslim alırken yapacaksın.";
  const submitLabel = !payment ? "Ödemeye geç" : processing
    ? method === "card-demo" ? "Ödeme işleniyor…" : "Sipariş oluşturuluyor…"
    : `${status === "failed" ? "Tekrar dene" : "Siparişi tamamla"} · ${formatTRY(totals.total)}`;

  const submitAction = <div className="mt-4 space-y-3">
    {!totals.canContinue && <p id="checkout-minimum" role="status" className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm font-medium text-amber-900">Minimum sepet tutarı {formatTRY(totals.minimum)}. Devam etmek için {formatTRY(totals.remaining)} tutarında ürün ekle. Teslimat ücreti ve bahşiş minimum tutara dahil değildir.</p>}
    <button ref={submitRef} id="checkout-submit" type="submit" form={payment ? "checkout-payment-form" : "checkout-address-form"} disabled={!totals.canContinue || processing} aria-describedby={!totals.canContinue ? "checkout-minimum" : "checkout-next-hint"} className="btn-primary w-full">{submitLabel}</button>
    <p id="checkout-next-hint" className="text-sm leading-5 text-slate-600" aria-live="polite">{nextHint}</p>
    {announcement && <p role="alert" className="text-sm font-medium text-red-800">{announcement}</p>}
  </div>;

  return <div className={payment ? "space-y-4" : "space-y-6"}>
    <div className="flex items-center gap-6">
      {payment ? <button disabled={processing} className="min-h-12 rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold hover:border-brand" onClick={goAddress}>← Adrese dön</button> : <Link to={`/cart/${service}`} className="min-h-12 rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold hover:border-brand">← Sepete dön</Link>}
      <span className="text-sm font-semibold text-slate-600">{service === "food" ? "YEMEK" : "MARKET"}</span>
    </div>
    <CheckoutSteps payment={payment} onAddress={goAddress} disabled={processing} />
    <div className="pb-1">
      <h1 ref={headingRef} tabIndex={-1} className="text-[32px] font-bold leading-10">{payment ? "Ödeme" : "Teslimat adresi"}</h1>
      <p className="mt-1 text-slate-600">{payment ? "Ödeme yöntemini seç, siparişini kontrol et." : "Siparişini nereye teslim edelim?"}</p>
    </div>
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_392px]">
      {payment ? <PaymentForm
        service={service} storeId={storeId} method={method} card={card} errors={cardErrors} status={status}
        tip={tip} remember={remember} savedFixture={savedFixture} selectedSaved={selectedSaved} savedMessage={savedMessage}
        onMethodChange={changeMethod} onCardChange={changeCard}
        onCardBlur={field => setCardErrors(current => ({ ...current, [field]: validateCard(card, new Date(), selectedSaved)[field] }))}
        onTipChange={value => { setTip(value); setStatus("idle"); setAnnouncement(""); }}
        onRememberChange={setRemember}
        onUseSaved={() => {
          if (!savedFixture) return;
          setSelectedSaved(savedFixture); setCard({ ...EMPTY_CARD }); setCardErrors({}); setRemember(true); setStatus("idle");
          setSavedMessage("Kayıtlı kart seçildi. Güvenlik kodunu gir.");
        }}
        onNewCard={useNewCard}
        onForgetSaved={() => {
          if (forgetFixture(checkoutStorage())) {
            if (selectedSaved) useNewCard();
            setSavedFixture(undefined); setRemember(false); setSavedMessage("Kart kaydı kaldırıldı.");
          } else setSavedMessage("Kart kaydı kaldırılamadı. Yeniden dene.");
        }}
        onCancel={cancelPayment} onSubmit={submitOrder}
      /> : <AddressForm values={draft} errors={errors} regionLabel={regionLabel} onChange={change} onBlur={field => setErrors(current => ({ ...current, [field]: validateAddress(draft)[field] }))} onUseSaved={() => { setDraft(current => ({ ...current, ...SAVED_ADDRESS })); setErrors({}); setAnnouncement(""); }} onRegionChange={openAddress} onSubmit={continueToPayment} />}
      <aside aria-label="Sipariş özeti ve devam işlemi" className={"space-y-4 " + (payment ? "lg:sticky lg:top-24" : "")}>
        <OrderSummary lines={lines} service={service} totals={totals} showTip={payment} disabled={processing} compact={payment} deliveryEstimate={deliveryEstimate} addMoreTo={checkoutCatalogPath(service, storeId)} onShoppingNavigate={rememberShoppingReturn} review={payment && <section aria-labelledby="selected-address-title" className="mb-4 border-t border-slate-200 pt-2 text-sm">
          <div className="flex items-center justify-between gap-3"><h3 id="selected-address-title" className="font-semibold">Teslimat adresi</h3>
            <button type="button" onClick={goAddress} disabled={processing} className="min-h-11 rounded-lg px-2 font-semibold text-brand underline underline-offset-4" aria-label="Teslimat adresini düzenle">Düzenle</button>
          </div>
          <p className="break-words leading-5">{draft.name}<br />{draft.address}<br />{regionLabel}</p>
          {draft.note && <p className="mt-2 break-words leading-5 text-slate-600">Teslimat notu: {draft.note}</p>}
          <div className="mt-3 flex items-start justify-between gap-4"><h3 className="font-semibold">Ödeme</h3><p className="text-right text-slate-700">{paymentMethodLabel(method, service)}</p></div>
        </section>}>
          {payment && submitAction}
        </OrderSummary>
        {!payment && submitAction}
      </aside>
    </div>
  </div>;
}
