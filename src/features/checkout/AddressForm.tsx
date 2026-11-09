import { useState, type FormEvent } from "react";
import { SAVED_ADDRESS, type AddressErrors, type AddressValues } from "./checkoutModel";

type Props = {
  values: AddressValues; errors: AddressErrors; regionLabel: string;
  onChange: (field: keyof AddressValues, value: string) => void;
  onBlur: (field: keyof AddressValues) => void;
  onUseSaved: () => void; onRegionChange: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export default function AddressForm({ values, errors, regionLabel, onChange, onBlur, onUseSaved, onRegionChange, onSubmit }: Props) {
  const [announcement, setAnnouncement] = useState("");
  const savedSelected = values.name === SAVED_ADDRESS.name && values.address === SAVED_ADDRESS.address;
  const fieldClass = (field: keyof AddressValues) => "field " + (errors[field] ? "border-red-800 focus:border-red-800" : "");
  return <div className="space-y-6">
    {regionLabel === "Muğla / Menteşe / Kötekli" && <section aria-labelledby="saved-address-title" className="rounded-2xl border border-slate-300 bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <div><h2 id="saved-address-title" className="text-xl font-semibold">Kayıtlı adres</h2>
          <p className="mt-2 font-semibold">Ev · {SAVED_ADDRESS.name}</p>
          <p className="mt-1 text-sm leading-6 text-slate-600">{SAVED_ADDRESS.address}<br />{regionLabel}</p>
        </div>
        <button type="button" className="min-h-11 shrink-0 rounded-xl border border-slate-300 px-4 py-3 font-semibold hover:border-brand hover:bg-pink-50" aria-pressed={savedSelected} onClick={() => { onUseSaved(); setAnnouncement("Ev adresi seçildi. Bilgileri aşağıdan düzenleyebilirsin."); }}>{savedSelected ? "✓ Seçili adres" : "Bu adresi kullan"}</button>
      </div><p role="status" className="sr-only">{announcement}</p>
    </section>}
    <form id="checkout-address-form" onSubmit={onSubmit} noValidate className="space-y-6 rounded-2xl border border-slate-300 bg-white p-6">
      <div><h2 className="text-xl font-semibold">Adres bilgileri</h2><p className="mt-2 text-sm text-slate-600">* işaretli alanlar zorunludur.</p></div>
      <div><label htmlFor="checkout-name" className="mb-2 block font-semibold">Ad soyad *</label>
        <input id="checkout-name" name="recipientName" className={fieldClass("name")} autoComplete="off" maxLength={100} value={values.name} onChange={event => onChange("name", event.target.value)} onBlur={() => onBlur("name")} required aria-invalid={!!errors.name} aria-describedby={errors.name ? "checkout-name-error" : "checkout-name-hint"} placeholder="Ad soyad" />
        {errors.name ? <p id="checkout-name-error" className="mt-2 text-sm font-medium text-red-800">{errors.name}</p> : <p id="checkout-name-hint" className="mt-2 text-sm text-slate-600">Siparişi teslim alacak kişi.</p>}
      </div>
      <section aria-labelledby="checkout-region-title" className="rounded-xl border border-slate-300 bg-slate-50 p-4">
        <h3 id="checkout-region-title" className="font-semibold">Teslimat bölgesi</h3><p className="mt-2">{regionLabel}</p>
        <button type="button" className="mt-3 min-h-11 rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold hover:border-brand" onClick={onRegionChange}>Bölgeyi değiştir</button>
      </section>
      <div><label htmlFor="checkout-address" className="mb-2 block font-semibold">Açık adres *</label>
        <textarea id="checkout-address" name="streetAddress" className={fieldClass("address")} rows={3} autoComplete="off" maxLength={300} value={values.address} onChange={event => onChange("address", event.target.value)} onBlur={() => onBlur("address")} required aria-invalid={!!errors.address} aria-describedby={errors.address ? "checkout-address-error" : "checkout-address-hint"} placeholder="Sokak, bina no, kat ve daire" />
        {errors.address ? <p id="checkout-address-error" className="mt-2 text-sm font-medium text-red-800">{errors.address}</p> : <p id="checkout-address-hint" className="mt-2 text-sm text-slate-600">Bina, kat ve daire bilgisini ekle.</p>}
      </div>
      <div><label htmlFor="checkout-note" className="mb-2 block font-semibold">Teslimat notu (isteğe bağlı)</label>
        <textarea id="checkout-note" name="deliveryNote" className={fieldClass("note")} rows={2} maxLength={200} value={values.note} onChange={event => onChange("note", event.target.value)} onBlur={() => onBlur("note")} aria-invalid={!!errors.note} aria-describedby={errors.note ? "checkout-note-error" : "checkout-note-hint"} placeholder="Örn. Zil çalışmıyor, lütfen ara." />
        {errors.note ? <p id="checkout-note-error" className="mt-2 text-sm font-medium text-red-800">{errors.note}</p> : <p id="checkout-note-hint" className="mt-2 text-sm text-slate-600">Zil veya bina girişi için kısa bir not ekleyebilirsin.</p>}
      </div>
    </form>
  </div>;
}
