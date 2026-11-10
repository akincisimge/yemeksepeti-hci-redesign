import { useEffect, useState, type FormEvent } from "react";
import { useAccount } from "../state/AccountContext";
import {
  SAMPLE_DEMO_ACCOUNT,
  validateDemoAccount,
  type AccountValidationErrors,
} from "../state/demoAccount";

type AccountFormProps = {
  onSaved?: () => void;
  autofocus?: boolean;
};

export default function AccountForm({ onSaved, autofocus = false }: AccountFormProps) {
  const { account, saveAccount, resetAccount } = useAccount();
  const [name, setName] = useState(account?.name ?? "");
  const [email, setEmail] = useState(account?.email ?? "");
  const [phone, setPhone] = useState(account?.phone ?? "");
  const [deliveryNote, setDeliveryNote] = useState(account?.deliveryNote ?? "");
  const [errors, setErrors] = useState<AccountValidationErrors>({});
  const [status, setStatus] = useState("");

  useEffect(() => {
    setName(account?.name ?? "");
    setEmail(account?.email ?? "");
    setPhone(account?.phone ?? "");
    setDeliveryNote(account?.deliveryNote ?? "");
  }, [account]);

  function fillSample() {
    setName(SAMPLE_DEMO_ACCOUNT.name);
    setEmail(SAMPLE_DEMO_ACCOUNT.email);
    setPhone(SAMPLE_DEMO_ACCOUNT.phone);
    setDeliveryNote(SAMPLE_DEMO_ACCOUNT.deliveryNote ?? "");
    setErrors({});
    setStatus("Bilgiler alanlara dolduruldu. Kaydetmek için aşağıdaki düğmeye bas.");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateDemoAccount({ name, email, phone, deliveryNote });
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setStatus("");
      return;
    }

    setErrors({});
    const saved = saveAccount({ name, email, phone, deliveryNote });
    setStatus(`Profilin kaydedildi: ${saved.name}. Sipariş tamamlamada bilgilerini tek tıkla kullanabilirsin.`);
    onSaved?.();
  }

  function handleReset() {
    resetAccount();
    setName("");
    setEmail("");
    setPhone("");
    setDeliveryNote("");
    setErrors({});
    setStatus("Hesap oturumu kapatıldı. Misafir kullanıcı olarak devam edebilirsin.");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#FFF1F6] p-4 text-sm text-slate-800">
        <p className="min-w-0 flex-1 leading-6 text-slate-700">
          Ad, e-posta ve telefon bilgilerin yalnızca bu tarayıcıda saklanır.
        </p>
        <button
          type="button"
          onClick={fillSample}
          className="min-h-11 shrink-0 rounded-xl border border-brand bg-white px-4 py-2 text-sm font-semibold text-brand-dark hover:bg-pink-50"
        >
          Hazır bilgiyle doldur
        </button>
      </div>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-slate-900">Ad soyad *</span>
        <input
          data-autofocus={autofocus ? "" : undefined}
          className="field min-h-12"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
          }}
          placeholder="Ayşe Yılmaz"
          autoComplete="off"
          required
          aria-required="true"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "account-name-error" : undefined}
        />
        {errors.name && (
          <span id="account-name-error" role="alert" className="mt-1.5 block text-sm font-semibold text-[#991B1B]">
            {errors.name}
          </span>
        )}
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-slate-900">E-posta *</span>
        <input
          className="field min-h-12"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
          }}
          placeholder="ornek@example.com"
          autoComplete="off"
          required
          aria-required="true"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "account-email-error" : undefined}
        />
        {errors.email && (
          <span id="account-email-error" role="alert" className="mt-1.5 block text-sm font-semibold text-[#991B1B]">
            {errors.email}
          </span>
        )}
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-slate-900">Telefon numarası *</span>
        <input
          className="field min-h-12"
          type="tel"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
          }}
          placeholder="0500 000 00 00"
          autoComplete="off"
          required
          aria-required="true"
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? "account-phone-error" : undefined}
        />
        {errors.phone && (
          <span id="account-phone-error" role="alert" className="mt-1.5 block text-sm font-semibold text-[#991B1B]">
            {errors.phone}
          </span>
        )}
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-slate-900">
          Varsayılan teslimat notu <span className="font-normal text-slate-600">(isteğe bağlı)</span>
        </span>
        <input
          className="field min-h-12"
          value={deliveryNote}
          maxLength={120}
          onChange={(e) => setDeliveryNote(e.target.value)}
          placeholder="Örn. Zile basmayın, kapıya bırakın"
          autoComplete="off"
        />
      </label>

      {status && (
        <p role="status" aria-live="polite" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-900">
          {status}
        </p>
      )}

      <div className="flex flex-col gap-3">
        <button type="submit" className="btn-primary w-full">
          {account ? "Profilimi güncelle" : "Hesap oluştur"}
        </button>
        {account && (
          <button
            type="button"
            onClick={handleReset}
            className="min-h-11 w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-[#991B1B] hover:border-red-400 hover:bg-red-50"
          >
            Çıkış yap ve bilgileri temizle
          </button>
        )}
      </div>
    </form>
  );
}
