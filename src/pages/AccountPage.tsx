import { Link, useOutletContext } from "react-router-dom";
import AccountForm from "../components/AccountForm";
import { locationLabel } from "../data/delivery";
import { useAccount } from "../state/AccountContext";
import { useCart } from "../state/CartContext";
import { useDelivery } from "../state/DeliveryContext";
import { DEMO_TRACKING_STEPS, readDemoOrder } from "../state/demoOrder";
import type { LayoutContext } from "../components/Layout";

export default function AccountPage() {
  const { account } = useAccount();
  const { delivery } = useDelivery();
  const { count } = useCart();
  const { openAddress } = useOutletContext<LayoutContext>();
  const lastOrder = readDemoOrder();

  return (
    <div className="space-y-6">
      <Link to="/" className="inline-flex min-h-11 items-center font-semibold text-slate-600 hover:text-brand">
        ← Ana sayfaya dön
      </Link>

      <header className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
        <p className="font-semibold text-brand">HESAP VE PROFİL · DEMO</p>
        <h1 className="mt-2 text-3xl font-bold text-[#0F172A] sm:text-4xl">
          {account ? `Hoş geldin, ${account.name}` : "Demo Hesap Oluştur"}
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-6 text-slate-600">
          {account
            ? "Demo profil bilgilerini güncelleyebilir, kayıtlı teslimat notunu değiştirebilir veya kaydı temizleyebilirsin."
            : "Sipariş tamamlama formunu hızlı doldurmak için örnek profil oluştur. Gerçek ad, telefon veya şifre gerekmez."}
        </p>
      </header>

      <div className="grid items-start gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section aria-label="Demo hesap formu" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <AccountForm autofocus />
        </section>

        <aside className="space-y-4">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Hesap özeti</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="rounded-xl bg-slate-50 p-3">
                <dt className="text-slate-600">Durum</dt>
                <dd className="mt-1 font-semibold text-slate-900">
                  {account ? `Aktif demo profili (${account.email})` : "Misafir kullanıcı"}
                </dd>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <dt className="text-slate-600">Teslimat bölgesi</dt>
                <dd className="mt-1 font-semibold text-slate-900">
                  {delivery ? locationLabel(delivery) : "Henüz konum seçilmedi"}
                </dd>
                <button
                  type="button"
                  data-address-trigger="account-page"
                  onClick={openAddress}
                  className="mt-2 font-semibold text-brand underline"
                >
                  {delivery ? "Konumu değiştir" : "Adres seç"}
                </button>
              </div>
            </dl>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Hızlı erişim</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/cart/food"
                  className="flex min-h-11 items-center justify-center rounded-xl border border-slate-300 px-3 text-center font-semibold text-slate-800 hover:border-brand"
                >
                  Yemek ({count("food")})
                </Link>
                <Link
                  to="/cart/market"
                  className="flex min-h-11 items-center justify-center rounded-xl border border-slate-300 px-3 text-center font-semibold text-slate-800 hover:border-brand"
                >
                  Market ({count("market")})
                </Link>
              </div>
              <Link
                to="/track"
                className="flex min-h-11 items-center justify-between rounded-xl border border-slate-300 px-4 py-2 font-semibold text-slate-800 hover:border-brand hover:bg-[#FFF1F6]"
              >
                <span>
                  {lastOrder
                    ? `Sipariş takibi (${lastOrder.orderId} · ${DEMO_TRACKING_STEPS[lastOrder.stage].title})`
                    : "Sipariş takibi sayfasını aç"}
                </span>
                <span aria-hidden="true" className="text-brand">→</span>
              </Link>
              <Link
                to="/support"
                className="flex min-h-11 items-center justify-between rounded-xl border border-slate-300 px-4 py-2 font-semibold text-slate-800 hover:border-brand hover:bg-[#FFF1F6]"
              >
                <span>Canlı destek (demo)</span>
                <span aria-hidden="true" className="text-brand">→</span>
              </Link>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
