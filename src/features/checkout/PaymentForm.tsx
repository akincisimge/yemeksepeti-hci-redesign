import { useEffect, useRef, type FormEvent } from "react";
import { formatTRY, PAYMENT_METHOD_LABELS, type PaymentMethod, type Service } from "../../types/domain";
import {
  fixtureLabel, paymentMethods, TIP_AMOUNTS,
  type CardErrors, type CardValues, type FixtureId, type PaymentStatus,
} from "./paymentModel";

type Props = {
  service: Service;
  method: PaymentMethod;
  card: CardValues;
  errors: CardErrors;
  status: PaymentStatus;
  tip: number;
  remember: boolean;
  savedFixture?: FixtureId;
  savedMessage: string;
  onMethodChange: (method: PaymentMethod) => void;
  onCardChange: (field: keyof CardValues, value: string) => void;
  onCardBlur: (field: keyof CardValues) => void;
  onTipChange: (tip: number) => void;
  onRememberChange: (remember: boolean) => void;
  onUseSaved: () => void;
  onForgetSaved: () => void;
  onCancel: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

const DESCRIPTIONS: Record<PaymentMethod, string> = {
  "card-demo": "Kart bilgilerini aşağıda gir.",
  "cash-demo": "Siparişini teslim alırken öde.",
  "door-card-demo": "Teslimatta kartınla öde.",
  "meal-card-demo": "Satıcının desteklediği kartlar.",
};
const DELIVERY_TITLES: Record<Exclude<PaymentMethod, "card-demo">, string> = {
  "cash-demo": "Teslimatta nakit ödeme",
  "door-card-demo": "Teslimatta kredi kartıyla ödeme",
  "meal-card-demo": "Teslimatta yemek kartıyla ödeme",
};

export default function PaymentForm(props: Props) {
  const { card, errors, method, status } = props;
  const failureRef = useRef<HTMLDivElement>(null);
  const processing = status === "processing";
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
    {errors[field] && <p id={`checkout-card-${field}-error`} className="mt-2 text-sm font-medium text-red-800">{errors[field]}</p>}
    {options.hint && <p id={`checkout-card-${field}-hint`} className="mt-2 text-sm text-slate-600">{options.hint}</p>}
  </div>;

  return <form id="checkout-payment-form" onSubmit={props.onSubmit} noValidate autoComplete="off" aria-busy={processing} className="space-y-6 rounded-2xl border border-slate-300 bg-white p-6">
    <fieldset disabled={processing} className="min-w-0 space-y-6">
      <legend className="sr-only">Ödeme bilgileri</legend>
      <fieldset className="min-w-0">
        <legend className="mb-4 text-xl font-semibold">Nasıl ödemek istersin?</legend>
        <div className={"grid gap-4 " + (props.service === "food" ? "grid-cols-2" : "grid-cols-1")}>
          {paymentMethods(props.service).map(value => <label key={value} className={"flex min-h-[100px] cursor-pointer flex-col rounded-xl border p-4 " + (method === value ? "border-brand bg-pink-50 ring-1 ring-brand" : "border-slate-400")}>
            <span className="flex items-start gap-3">
              <input type="radio" name="payment" value={value} checked={method === value} onChange={() => props.onMethodChange(value)} className="mt-0.5 h-5 w-5 shrink-0 accent-brand" />
              <span className={"font-semibold " + (props.service === "food" ? "text-sm leading-5" : "")}>
                {PAYMENT_METHOD_LABELS[value]}
              </span>
            </span>
            <span className="mt-3 text-sm leading-5 text-slate-600">{DESCRIPTIONS[value]}</span>
          </label>)}
        </div>
      </fieldset>

      {method === "card-demo" ? <section aria-labelledby="card-details-title" className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="card-details-title" className="text-xl font-semibold">Kart bilgileri</h2>
          <span className="text-sm text-slate-600">VISA · Mastercard · Troy</span>
        </div>
        {props.savedFixture && <div className="rounded-xl border border-slate-300 bg-slate-50 p-4">
          <p className="font-semibold">Kayıtlı kart · {fixtureLabel(props.savedFixture)}</p>
          <div className="mt-2 flex flex-wrap gap-4">
            <button type="button" onClick={props.onUseSaved} className="min-h-11 rounded-lg font-semibold text-brand underline underline-offset-4">Bu kartı kullan</button>
            <button type="button" onClick={props.onForgetSaved} className="min-h-11 rounded-lg text-sm font-semibold text-slate-700 underline underline-offset-4">Kaydı kaldır</button>
          </div>
        </div>}
        <p role="status" className={props.savedMessage ? "text-sm text-slate-600" : "sr-only"}>{props.savedMessage}</p>
        {cardField("holder", "Kart sahibinin adı", "Kartın üzerindeki ad soyad", { maxLength: 100 })}
        {cardField("number", "Kart numarası", "Kart numaranı gir", { maxLength: 19, numeric: true })}
        <div className="grid grid-cols-2 gap-6">
          {cardField("expiry", "Son kullanma tarihi", "AA/YY", { maxLength: 5, numeric: true })}
          {cardField("cvv", "CVV", "Güvenlik kodu", { maxLength: 4, numeric: true, secret: true, hint: "Kartındaki 3 veya 4 haneli güvenlik kodu." })}
        </div>
        <label className="flex min-h-11 cursor-pointer items-center gap-3">
          <input type="checkbox" checked={props.remember} onChange={event => props.onRememberChange(event.target.checked)} className="h-5 w-5 shrink-0 accent-brand" />
          <span>Sonraki siparişlerimde bu kartı kullan</span>
        </label>
      </section> : <section aria-labelledby="delivery-payment-title" className="space-y-4">
        <h2 id="delivery-payment-title" className="text-xl font-semibold">{DELIVERY_TITLES[method]}</h2>
        <p className="rounded-xl bg-pink-50 p-4 text-sm font-medium leading-6 text-slate-700">Kapıda ödeme için ek ücret: {formatTRY(0)}. Ödeyeceğin toplam tutar sipariş özetinde gösteriliyor.</p>
      </section>}

      <fieldset className="min-w-0 border-t border-slate-300 pt-6">
        <legend className="sr-only">Bahşiş (isteğe bağlı)</legend>
        <h2 className="mb-4 font-semibold" aria-hidden="true">Bahşiş (isteğe bağlı)</h2>
        <div className="grid grid-cols-5 gap-2">
          {TIP_AMOUNTS.map(value => <label key={value} className="min-w-0 cursor-pointer">
            <input type="radio" name="tip" value={value} checked={props.tip === value} onChange={() => props.onTipChange(value)} className="peer sr-only" />
            <span className="flex min-h-12 items-center justify-center rounded-xl border border-slate-400 px-1 py-3 text-center text-sm font-semibold peer-checked:border-brand peer-checked:bg-pink-50 peer-checked:text-brand peer-focus-visible:outline-3 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-brand">
              {value ? `${value} TL` : "Şimdi değil"}
            </span>
          </label>)}
        </div>
        <p className="mt-4 text-sm text-slate-600">Bahşiş: {formatTRY(props.tip)}. Seçimini değiştirebilirsin.</p>
      </fieldset>
    </fieldset>

    {status === "failed" && <div ref={failureRef} tabIndex={-1} role="alert" className="rounded-xl bg-red-50 p-4 text-sm font-semibold leading-6 text-red-800">
      Ödeme tamamlanamadı. Sipariş oluşturulmadı; sepetin ve adresin korundu. Tekrar deneyebilirsin.
    </div>}
    {processing && <div className="rounded-xl bg-pink-50 p-4">
      <p role="status" className="flex items-center gap-3 text-sm font-medium leading-6 text-slate-700">
        <span aria-hidden="true" className="h-5 w-5 shrink-0 rounded-full border-2 border-brand border-t-transparent motion-safe:animate-spin" />
        {method === "card-demo" ? "Ödemen işleniyor. Sonuç geldiğinde ekran güncellenecek." : "Siparişin oluşturuluyor. Sonuç geldiğinde ekran güncellenecek."}
      </p>
      <button type="button" onClick={props.onCancel} className="mt-2 min-h-11 rounded-lg text-sm font-semibold text-brand underline underline-offset-4">İşlemi iptal et</button>
    </div>}
  </form>;
}
