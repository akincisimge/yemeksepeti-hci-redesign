import { useEffect, useRef, type FormEvent } from "react";
import { formatTRY, type PaymentMethod, type Service } from "../../types/domain";
import CardSecurityHelp from "./CardSecurityHelp";
import {
  fixtureLabel, mealCardNames, paymentMethodLabel, paymentMethods, TIP_AMOUNTS,
  type CardErrors, type CardValues, type SavedCardPreference, type PaymentStatus,
} from "./paymentModel";

type Props = {
  service: Service;
  storeId: string;
  method: PaymentMethod;
  card: CardValues;
  errors: CardErrors;
  status: PaymentStatus;
  tip: number;
  remember: boolean;
  savedFixture?: SavedCardPreference;
  selectedSaved?: SavedCardPreference;
  savedMessage: string;
  onMethodChange: (method: PaymentMethod) => void;
  onCardChange: (field: keyof CardValues, value: string) => void;
  onCardBlur: (field: keyof CardValues) => void;
  onTipChange: (tip: number) => void;
  onRememberChange: (remember: boolean) => void;
  onUseSaved: () => void;
  onNewCard: () => void;
  onForgetSaved: () => void;
  onCancel: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

const SHORT_LABELS: Record<PaymentMethod, string> = {
  "card-demo": "Online kart", "cash-demo": "Nakit",
  "door-card-demo": "Kapıda kart", "meal-card-demo": "Yemek kartı",
};
const DELIVERY_TITLES: Record<Exclude<PaymentMethod, "card-demo">, string> = {
  "cash-demo": "Teslimatta nakit ödeme",
  "door-card-demo": "Teslimatta kredi kartıyla ödeme",
  "meal-card-demo": "Teslimatta yemek kartıyla ödeme",
};

function PaymentIcon({ method }: { method: PaymentMethod }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    {method === "cash-demo" ? <><rect x="2" y="5" width="20" height="14" rx="2" /><circle cx="12" cy="12" r="3" /><path d="M5 9v6M19 9v6" /></>
      : method === "meal-card-demo" ? <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M7 8v8M5 8v3h4V8M16 8c-3 0-3 5 0 5v3V8" /></>
      : method === "door-card-demo" ? <><rect x="6" y="2" width="12" height="20" rx="2" /><path d="M9 5h6v5H9zM9 14h1m4 0h1m-6 4h1m4 0h1" /></>
      : <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 9h20M6 15h4" /></>}
  </svg>;
}

export default function PaymentForm(props: Props) {
  const { card, errors, method, status } = props;
  const failureRef = useRef<HTMLDivElement>(null);
  const processing = status === "processing";
  const methods = paymentMethods(props.service, props.storeId);
  const supportedMealCards = mealCardNames(props.storeId);
  useEffect(() => { if (status === "failed") failureRef.current?.focus(); }, [status]);

  const cardField = (
    field: keyof CardValues, label: string, placeholder: string,
    options: { maxLength: number; numeric?: boolean; secret?: boolean; hint?: string },
  ) => <div>
    <label htmlFor={`checkout-card-${field}`} className="mb-2 block font-semibold">{label} *</label>
    <input
      id={`checkout-card-${field}`} name={`payment-${field}`} required
      type={options.secret ? "password" : "text"}
      inputMode={options.numeric ? "numeric" : "text"}
      autoComplete="off" spellCheck={false} maxLength={options.maxLength}
      value={card[field]} placeholder={placeholder}
      onChange={event => props.onCardChange(field, event.target.value)}
      onBlur={() => props.onCardBlur(field)}
      aria-invalid={!!errors[field]}
      aria-describedby={[
        errors[field] ? `checkout-card-${field}-error` : "",
        options.hint ? `checkout-card-${field}-hint` : "",
      ].filter(Boolean).join(" ") || undefined}
      className={"field disabled:bg-slate-50 " + (errors[field] ? "border-red-800 focus:border-red-800" : "")}
    />
    {errors[field] && <p id={`checkout-card-${field}-error`} className="mt-2 text-sm font-medium leading-5 text-red-800">{errors[field]}</p>}
    {options.hint && <p id={`checkout-card-${field}-hint`} className="mt-2 text-sm text-slate-600">{options.hint}</p>}
    {field === "cvv" && <CardSecurityHelp />}
  </div>;

  return <form id="checkout-payment-form" onSubmit={props.onSubmit} noValidate autoComplete="off" aria-busy={processing} className="space-y-4">
    {status === "failed" && <div ref={failureRef} tabIndex={-1} role="alert" className="rounded-xl bg-red-50 p-4 text-sm font-semibold leading-6 text-red-800">
      Ödeme tamamlanamadı. Sipariş oluşturulmadı; sepetin ve adresin korundu. Tekrar deneyebilirsin.
    </div>}
    <fieldset disabled={processing} className="min-w-0 space-y-4">
      <legend className="sr-only">Ödeme bilgileri</legend>
      <div className="rounded-2xl border border-slate-300 bg-white p-6">
      <fieldset className="min-w-0">
        <legend className="mb-3 text-xl font-semibold">Ödeme yöntemi</legend>
        <div className={"grid gap-3 " + (methods.length === 3 ? "grid-cols-3" : methods.length === 1 ? "grid-cols-1" : "grid-cols-2")}>
          {methods.map(value => <label key={value} className={"flex min-h-[72px] cursor-pointer items-center gap-3 rounded-xl border px-3 py-3 " + (method === value ? "border-brand bg-pink-50 ring-1 ring-brand" : "border-slate-400 hover:border-brand")}>
            <input type="radio" name="payment" value={value} checked={method === value} aria-label={`${SHORT_LABELS[value]}: ${paymentMethodLabel(value, props.service)}`} onChange={() => props.onMethodChange(value)} className="h-4 w-4 shrink-0 accent-brand" />
            <span className="flex min-w-0 items-center gap-2 text-sm font-semibold leading-5">
              <PaymentIcon method={value} />{SHORT_LABELS[value]}
            </span>
          </label>)}
        </div>
      </fieldset>

      {method === "card-demo" ? <section aria-labelledby="card-details-title" className="mt-5 space-y-4 rounded-xl border border-brand/30 bg-pink-50/30 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="card-details-title" className="font-semibold">Online kart bilgileri</h2>
          <ul aria-label="Kart markaları" className="flex shrink-0 items-center gap-4">
            <li><img src="/logos/payments/visa.png" alt="Visa" width="1920" height="622" className="h-4 w-auto" /></li>
            <li><img src="/logos/payments/mastercard.svg" alt="Mastercard" width="152" height="108" className="h-7 w-auto" /></li>
            <li><img src="/logos/payments/troy.svg" alt="Troy" width="298" height="137" className="h-5 w-auto" /></li>
          </ul>
        </div>
        {!props.selectedSaved && <p className="text-sm text-slate-600">* işaretli alanlar zorunludur.</p>}
        {props.savedFixture && <div className="rounded-xl border border-slate-300 bg-slate-50 p-4">
          <p className="font-semibold">{props.selectedSaved ? "Seçili kart" : "Kayıtlı kart"} · {fixtureLabel(props.savedFixture)}</p>
          <div className="mt-2 flex flex-wrap gap-4">
            {props.selectedSaved ? <button type="button" onClick={props.onNewCard} className="min-h-11 rounded-lg font-semibold text-brand underline underline-offset-4">Başka kart kullan</button> : <button type="button" onClick={props.onUseSaved} className="min-h-11 rounded-lg font-semibold text-brand underline underline-offset-4">Bu kartı kullan</button>}
            <button type="button" onClick={props.onForgetSaved} className="min-h-11 rounded-lg text-sm font-semibold text-slate-700 underline underline-offset-4">Kaydı kaldır</button>
          </div>
        </div>}
        <p role="status" className={props.savedMessage ? "text-sm text-slate-600" : "sr-only"}>{props.savedMessage}</p>
        <div className="space-y-4">
          {!props.selectedSaved && <>
            {cardField("holder", "Kart sahibinin adı", "Kartın üzerindeki ad soyad", { maxLength: 100 })}
            {cardField("number", "Kart numarası", "Kart numaranı gir", { maxLength: 19, numeric: true })}
          </>}
          <div className={props.selectedSaved ? "max-w-xs" : "grid grid-cols-2 gap-4"}>
            {!props.selectedSaved && cardField("expiry", "Son kullanma tarihi", "AA/YY", { maxLength: 5, numeric: true })}
            {cardField("cvv", "Güvenlik kodu (CVV)", "3 veya 4 hane", { maxLength: 4, numeric: true, secret: true })}
          </div>
        </div>
        {!props.selectedSaved && <label className="flex min-h-11 cursor-pointer items-center gap-3">
          <input type="checkbox" checked={props.remember} onChange={event => props.onRememberChange(event.target.checked)} className="h-5 w-5 shrink-0 accent-brand" />
          <span className="text-sm">Bu kartı sonraki siparişlerim için kaydet</span>
        </label>}
      </section> : <section aria-labelledby="delivery-payment-title" className="mt-5 space-y-3 rounded-xl border border-brand/30 bg-pink-50/30 p-5">
        <h2 id="delivery-payment-title" className="font-semibold">{method === "door-card-demo" && props.service === "market" ? "Teslimatta temassız kartla ödeme" : DELIVERY_TITLES[method]}</h2>
        {method === "meal-card-demo" && <div className="space-y-2 text-sm leading-6">
          <p className="font-medium">Bu restoranda geçerli yemek kartları:</p>
          <ul className="flex flex-wrap gap-2" aria-label="Desteklenen yemek kartları">{supportedMealCards.map(name => <li key={name} className="rounded-lg border border-slate-300 bg-white px-3 py-1">{name}</li>)}</ul>
          <p>Kartını teslimatta kullanabilirsin; burada kart bilgisi girmen gerekmiyor.</p>
        </div>}
        <p className="text-sm leading-6 text-slate-700">Siparişini teslim alırken ödeyeceksin. Kapıda ödeme ek ücreti: {formatTRY(0)}.</p>
      </section>}
      </div>

      <details className="group rounded-2xl border border-slate-300 bg-white px-5 py-3">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 rounded-lg [&::-webkit-details-marker]:hidden">
          <span className="font-medium">Kurye bahşişi <span className="ml-1 text-sm font-normal text-slate-600">(isteğe bağlı)</span></span>
          <span className="flex shrink-0 items-center gap-2 text-sm font-medium text-slate-600">
            {props.tip ? formatTRY(props.tip) : "Eklenmedi"}
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 transition-transform group-open:rotate-180 motion-reduce:transition-none" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
          </span>
        </summary>
      <fieldset className="min-w-0 border-t border-slate-200 pb-2 pt-4">
        <legend className="sr-only">Bahşiş (isteğe bağlı)</legend>
        <div className="grid grid-cols-5 gap-2">
          {TIP_AMOUNTS.map(value => <label key={value} className="min-w-0 cursor-pointer">
            <input type="radio" name="tip" value={value} checked={props.tip === value} onChange={() => props.onTipChange(value)} className="peer sr-only" />
            <span className="flex min-h-12 items-center justify-center rounded-xl border border-slate-400 px-1 py-3 text-center text-sm font-semibold peer-checked:border-brand peer-checked:bg-pink-50 peer-checked:text-brand peer-focus-visible:outline-3 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-brand">
              {value ? `${value} TL` : "Şimdi değil"}
            </span>
          </label>)}
        </div>
        <p className="mt-3 text-sm text-slate-600">Bahşiş: {formatTRY(props.tip)}. Seçimini değiştirebilirsin.</p>
      </fieldset>
      </details>
    </fieldset>

    {processing && <div className="rounded-xl bg-pink-50 p-4">
      <p role="status" className="flex items-center gap-3 text-sm font-medium leading-6 text-slate-700">
        <span aria-hidden="true" className="h-5 w-5 shrink-0 rounded-full border-2 border-brand border-t-transparent motion-safe:animate-spin" />
        {method === "card-demo" ? "Ödemen işleniyor. Sonuç geldiğinde ekran güncellenecek." : "Siparişin oluşturuluyor. Sonuç geldiğinde ekran güncellenecek."}
      </p>
      <button type="button" onClick={props.onCancel} className="mt-2 min-h-11 rounded-lg text-sm font-semibold text-brand underline underline-offset-4">İşlemi iptal et</button>
    </div>}
  </form>;
}
