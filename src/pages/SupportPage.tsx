import { Link, useOutletContext } from "react-router-dom";
import LiveSupportChat from "../components/LiveSupportChat";
import { locationLabel } from "../data/delivery";
import { useAccount } from "../state/AccountContext";
import { useDelivery } from "../state/DeliveryContext";
import { DEMO_TRACKING_STEPS, readDemoOrder } from "../state/demoOrder";
import type { LayoutContext } from "../components/Layout";

export default function SupportPage() {
  const { delivery } = useDelivery();
  const { account } = useAccount();
  const { openAddress } = useOutletContext<LayoutContext>();
  const lastOrder = readDemoOrder();

  return (
    <div className="space-y-6">
      <Link to="/" className="inline-flex min-h-11 items-center font-semibold text-slate-600 hover:text-brand">
        ← Ana sayfaya dön
      </Link>

      <header className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
        <p className="font-semibold text-brand">CANLI DESTEK · DEMO</p>
        <h1 className="mt-2 text-3xl font-bold text-[#0F172A] sm:text-4xl">Nasıl yardımcı olabiliriz?</h1>
        <p className="mt-3 max-w-2xl text-base leading-6 text-slate-600">
          Sipariş takibi, teslimat konumu, kuponlar ve demo hesap konularında hızlı yanıt alabilirsin. Bu ekran gerçek müşteri temsilcisine bağlanmaz.
        </p>
      </header>

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_340px]">
        <section aria-label="Demo canlı destek sohbeti" className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <LiveSupportChat onOpenAddress={openAddress} />
        </section>

        <aside className="space-y-4">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Aktif oturum özeti</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="rounded-xl bg-slate-50 p-3">
                <dt className="text-slate-600">Demo profil</dt>
                <dd className="mt-1 font-semibold text-slate-900">{account?.name ?? "Misafir kullanıcı"}</dd>
                <Link to="/account" className="mt-2 inline-block font-semibold text-brand underline">
                  {account ? "Hesabımı yönet" : "Demo hesap oluştur"}
                </Link>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <dt className="text-slate-600">Teslimat konumu</dt>
                <dd className="mt-1 font-semibold text-slate-900">
                  {delivery ? locationLabel(delivery) : "Henüz seçilmedi"}
                </dd>
                <button
                  type="button"
                  data-address-trigger="support"
                  onClick={openAddress}
                  className="mt-2 font-semibold text-brand underline"
                >
                  Konumu değiştir
                </button>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <dt className="text-slate-600">Son demo sipariş</dt>
                {lastOrder ? (
                  <>
                    <dd className="mt-1 font-semibold text-slate-900">
                      {lastOrder.orderId} · {DEMO_TRACKING_STEPS[lastOrder.stage].title}
                    </dd>
                    <Link to="/track" className="mt-2 inline-block font-semibold text-brand underline">
                      Sipariş takibini aç
                    </Link>
                  </>
                ) : (
                  <dd className="mt-1 text-slate-700">Henüz aktif sipariş yok</dd>
                )}
              </div>
            </dl>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-bold text-slate-900">Prototip Sınırı</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Eğitim amaçlı simülasyondur. Gerçek ödeme, iade, kurye araması veya canlı temsilci desteği sunulmaz.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}
