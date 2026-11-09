import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate, useOutletContext, useParams, useSearchParams } from "react-router-dom";
import type { LayoutContext } from "../components/Layout";
import { useCart } from "../state/CartContext";
import { useDelivery } from "../state/DeliveryContext";
import { createDemoOrder, saveDemoOrder, type DemoOrder } from "../state/demoOrder";
import { formatTRY, type PaymentMethod, type Service } from "../types/domain";
import { marketStores } from "../features/market/data/marketData";
import AddressForm from "../features/checkout/AddressForm";
import CheckoutSteps from "../features/checkout/CheckoutSteps";
import OrderSummary from "../features/checkout/OrderSummary";
import PaymentForm from "../features/checkout/PaymentForm";
import {
  calculateCheckout, checkoutStorage, clearCheckoutDraft, readCheckoutDraft,
  saveCheckoutDraft, SAVED_ADDRESS, validateAddress, type AddressErrors, type AddressValues,
} from "../features/checkout/checkoutModel";
import {
  CARD_FIELDS, EMPTY_CARD, cardFixture, createPaymentRunner, forgetFixture,
  formatCardNumber, formatExpiry, normalizePaymentMethod, readSavedFixture, saveFixture, validateCard,
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
  const [tip, setTip] = useState(0);
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
  const lines = carts[service];
  const store = service === "market" ? marketStores.find(item => item.id === lines[0]?.product.storeId) : undefined;
  const totals = calculateCheckout(lines, store, tip);
  const addressValid = Object.keys(validateAddress(draft)).length === 0;
  const payment = params.get("step") === "payment" && addressValid;
  const processing = status === "processing";
  const cardValidation = validateCard(card, new Date(), selectedSaved);
  const firstCardError = CARD_FIELDS.find(field => cardValidation[field]);
  const cardValid = draft.method !== "card-demo" || !firstCardError;
  const cartSignature = JSON.stringify(lines.map(({ product, quantity }) => [product.id, product.storeId, product.price, quantity]));

  useEffect(() => { saveCheckoutDraft(checkoutStorage(), service, regionId, draft); }, [draft, service, regionId]);
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
    setDraft(current => ({ ...current, method: normalizePaymentMethod(method, service) }));
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
    if (draft.method === "card-demo") {
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
    const fixtureId = draft.method === "card-demo" ? selectedSaved?.fixtureId ?? cardFixture(card.number) : undefined;
    setStatus("processing");
    setAnnouncement("");
    const result = await runner.run({ method: draft.method, fixtureId, cardValidated: draft.method === "card-demo" });
    if (version !== attemptVersion.current || result.status === "cancelled" || result.status === "busy") return;
    if (result.status === "failed") { setStatus("failed"); return; }

    let order: DemoOrder;
    try {
      order = createDemoOrder({
        service, method: draft.method, lines,
        address: { name: draft.name, address: draft.address, note: draft.note, regionLabel },
        deliveryFee: totals.deliveryFee, tip: totals.tip, deliveryTime: store?.deliveryTime,
      });
    } catch { setStatus("failed"); return; }
    let paymentNotice: string | undefined;
    const last4 = selectedSaved?.last4 ?? card.number.replace(/\s/g, "").slice(-4);
    if (remember && draft.method === "card-demo" && !saveFixture(checkoutStorage(), fixtureId ?? "presentation-card", last4)) {
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
    : !cardValid && firstCardError ? `Devam etmek için: ${cardValidation[firstCardError]}`
    : draft.method === "card-demo" ? "Onayladığında siparişin oluşturulur."
    : "Ödemeyi siparişini teslim alırken yapacaksın.";
  const submitLabel = !payment ? "Ödemeye geç" : processing
    ? draft.method === "card-demo" ? "Ödeme işleniyor…" : "Sipariş oluşturuluyor…"
    : status === "failed" ? "Tekrar dene" : "Siparişi tamamla";

  return <div className="space-y-6">
    <div className="flex items-center gap-6">
      {payment ? <button disabled={processing} className="min-h-12 rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold hover:border-brand" onClick={goAddress}>← Adrese dön</button> : <Link to={`/cart/${service}`} className="min-h-12 rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold hover:border-brand">← Sepete dön</Link>}
      <span className="text-sm font-semibold text-slate-600">{service === "food" ? "YEMEK" : "MARKET"}</span>
    </div>
    <CheckoutSteps payment={payment} onAddress={goAddress} disabled={processing} />
    <div className="pb-1">
      <h1 ref={headingRef} tabIndex={-1} className="text-[32px] font-bold leading-10">{payment ? "Ödeme yöntemi" : "Teslimat adresi"}</h1>
      <p className="mt-2 text-slate-600">{payment ? "Ödeme bilgilerini ve siparişini kontrol et." : "Siparişini nereye teslim edelim?"}</p>
    </div>
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_392px]">
      {payment ? <PaymentForm
        service={service} method={draft.method} card={card} errors={cardErrors} status={status}
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
      <aside aria-label="Sipariş özeti ve devam işlemi" className="space-y-4">
        <OrderSummary lines={lines} service={service} totals={totals} showTip={payment} disabled={processing} />
        {payment && <section aria-labelledby="selected-address-title" className="rounded-2xl border border-slate-300 bg-white p-6">
          <h2 id="selected-address-title" className="font-semibold">Teslimat adresi</h2>
          <p className="mt-3 text-sm leading-6">{draft.name}<br />{draft.address}<br />{regionLabel}</p>
          {draft.note && <p className="mt-3 text-sm text-slate-600">Teslimat notu: {draft.note}</p>}
          <button type="button" onClick={goAddress} disabled={processing} className="mt-5 min-h-12 w-full rounded-xl border border-slate-300 px-5 py-3 font-semibold hover:border-brand">Adresi düzenle</button>
        </section>}
        {!totals.canContinue && <p id="checkout-minimum" role="status" className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm font-medium text-amber-900">Minimum sepet tutarı {formatTRY(totals.minimum)}. Devam etmek için {formatTRY(totals.remaining)} tutarında ürün ekle. Teslimat ücreti ve bahşiş minimum tutara dahil değildir.</p>}
        <button ref={submitRef} id="checkout-submit" type="submit" form={payment ? "checkout-payment-form" : "checkout-address-form"} disabled={!totals.canContinue || processing || (payment && !cardValid)} aria-describedby={!totals.canContinue ? "checkout-minimum" : "checkout-next-hint"} className="btn-primary w-full">{submitLabel}</button>
        <p id="checkout-next-hint" className="text-sm leading-6 text-slate-600" aria-live="polite">{nextHint}</p>
        <p role="alert" className="text-sm font-medium text-red-800">{announcement}</p>
      </aside>
    </div>
  </div>;
}
