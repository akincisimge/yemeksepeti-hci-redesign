import { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import type { LayoutContext } from "../components/Layout";
import { useAccount } from "../state/AccountContext";
import {
  createSamplePreviewOrder,
  DEMO_TRACKING_STEPS,
  readDemoOrder,
  saveDemoOrder,
  type DemoOrder,
  type DemoOrderStage,
} from "../state/demoOrder";
import { formatTRY } from "../types/domain";

function FoodArt() {
  return (
    <svg aria-hidden="true" className="h-24 w-24 shrink-0 sm:h-32 sm:w-32" viewBox="0 0 160 160" fill="none">
      <circle cx="80" cy="80" r="74" fill="#FFF1F6" />
      <ellipse cx="80" cy="98" rx="54" ry="19" fill="#D90049" opacity=".13" />
      <path d="M31 78h98c-3 37-19 51-49 51S34 115 31 78Z" fill="white" stroke="#D90049" strokeWidth="4" />
      <path d="M44 75c7-13 22-20 36-20s29 7 36 20" stroke="#D90049" strokeWidth="4" strokeLinecap="round" />
      <path d="M60 52c-9-10 7-14 0-26M83 48c-9-10 7-14 0-26M105 53c-9-10 7-14 0-26" stroke="#B6003C" strokeWidth="3" strokeLinecap="round" />
      <circle cx="58" cy="74" r="5" fill="#D90049" />
      <circle cx="95" cy="68" r="5" fill="#D90049" />
    </svg>
  );
}

function MarketArt() {
  return (
    <svg aria-hidden="true" className="h-24 w-24 shrink-0 sm:h-32 sm:w-32" viewBox="0 0 160 160" fill="none">
      <circle cx="80" cy="80" r="74" fill="#FFF1F6" />
      <path d="M38 61h84l-8 71H46L38 61Z" fill="white" stroke="#D90049" strokeWidth="4" strokeLinejoin="round" />
      <path d="M58 66V46c0-17 10-26 22-26s22 9 22 26v20" stroke="#B6003C" strokeWidth="4" strokeLinecap="round" />
      <path d="M61 86v28M80 86v28M99 86v28" stroke="#D90049" strokeWidth="4" strokeLinecap="round" />
      <path d="M44 77h72" stroke="#D90049" strokeWidth="3" />
    </svg>
  );
}

const choices = [
  {
    to: "/food",
    label: "YEMEK",
    eyebrow: "RESTORANLARDAN SİPARİŞ",
    description: "Restoranları keşfet, menülere göz at ve sevdiğin yemekleri seç.",
    cta: "Restoranları keşfet",
    Art: FoodArt,
  },
  {
    to: "/market",
    label: "MARKET",
    eyebrow: "GÜNLÜK ALIŞVERİŞ",
    description: "Yemeksepeti Market veya diğer marketlerden ürünleri kolayca seç.",
    cta: "Market alışverişine başla",
    Art: MarketArt,
  },
];

export default function HomePage() {
  const { address, openAddress, openPanel } = useOutletContext<LayoutContext>();
  const { account } = useAccount();
  const [demoOrder, setDemoOrder] = useState<DemoOrder | null>(() => readDemoOrder());

  function startPreviewOrder() {
    const preview = createSamplePreviewOrder(address ?? undefined);
    saveDemoOrder(preview);
    setDemoOrder(preview);
  }

  function advancePreviewStage() {
    if (!demoOrder) return;
    const nextStage = Math.min(3, demoOrder.stage + 1) as DemoOrderStage;
    const updated = { ...demoOrder, stage: nextStage };
    saveDemoOrder(updated);
    setDemoOrder(updated);
  }

  const activeStep = demoOrder ? DEMO_TRACKING_STEPS[demoOrder.stage] : null;
  const orderProgress = demoOrder ? ((demoOrder.stage + 1) / DEMO_TRACKING_STEPS.length) * 100 : 0;

  return (
    <div className="space-y-8 sm:space-y-10">
      <section className="mx-auto max-w-4xl pt-2 text-center sm:pt-4">
        <p className="mb-4 inline-flex rounded-full bg-[#FFF1F6] px-5 py-2 text-xs font-bold tracking-[0.12em] text-brand-dark">
          Hoş geldin · HCI Eğitim Prototipi
        </p>
        <h1 className="text-[32px] font-bold leading-[40px] tracking-tight text-slate-900 sm:text-[40px] sm:leading-[48px]">
          Bugün ne sipariş etmek istersin?
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-6 text-slate-600">
          İhtiyacına uygun bölümü seç; işletme ve teslimat kapsamı seçtiğin demo konumuna göre belirlenir.
        </p>
      </section>

      <section
        aria-labelledby="address-title"
        className="mx-auto flex max-w-4xl flex-col gap-4 rounded-2xl border border-slate-300 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6"
      >
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FFF1F6] text-brand" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
          </div>
          <div className="min-w-0">
            <h2 id="address-title" className="text-lg font-bold text-slate-900">Teslimat konumun</h2>
            <p className="mt-1 break-words font-semibold text-slate-800" aria-live="polite">
              {address ?? "Henüz konum seçilmedi"}
            </p>
            <p className="mt-1 text-sm leading-5 text-slate-600">
              {address
                ? "İstersen konumunu değiştirebilirsin. Adres değişikliği uyumsuz sepeti etkilerse önceden onay istenir."
                : "İşletmeleri görmek için Türkiye’nin 81 ili içinden örnek demo teslimat konumunu seç."}
            </p>
          </div>
        </div>
        <button
          type="button"
          data-address-trigger="home"
          onClick={openAddress}
          className="btn-primary w-full shrink-0 sm:w-auto"
        >
          {address ? "Konumu değiştir" : "Adres seç"}
        </button>
      </section>

      <section aria-label="Yemek ve Market hizmet seçimi" className="grid gap-6 md:grid-cols-2">
        {choices.map(({ to, label, eyebrow, description, cta, Art }) => (
          <article
            key={to}
            className="group flex min-h-[280px] flex-col justify-between rounded-[24px] border border-slate-300 bg-white p-6 shadow-sm transition duration-200 focus-within:border-brand hover:border-brand hover:shadow-xl sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1 pt-1">
                <p className="inline-block rounded-lg bg-[#FFF1F6] px-3 py-2 text-xs font-bold tracking-wider text-brand-dark">
                  {eyebrow}
                </p>
                <h2 id={`${label}-title`} className="mt-6 text-[28px] font-bold leading-9 tracking-tight text-slate-900">
                  {label}
                </h2>
                <p className="mt-3 text-base leading-6 text-slate-600">{description}</p>
              </div>
              <Art />
            </div>
            <div className="mt-8 border-t border-slate-200 pt-5">
              <Link
                to={to}
                aria-labelledby={`${label}-title ${label}-action`}
                className="inline-flex min-h-12 w-full items-center justify-between gap-4 rounded-xl bg-brand px-6 py-3 text-base font-semibold text-white transition hover:bg-brand-dark focus-visible:outline-4 focus-visible:outline-offset-2"
              >
                <span id={`${label}-action`}>{cta}</span>
                <span aria-hidden="true" className="text-2xl">→</span>
              </Link>
              <p className="mt-3 text-sm text-slate-600">
                Yemek ve Market sepetleri ayrı tutulur; istediğin zaman geçiş yapabilirsin.
              </p>
            </div>
          </article>
        ))}
      </section>

      <section aria-labelledby="quick-hub-title" className="space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <h2 id="quick-hub-title" className="text-2xl font-bold text-slate-900">
              Sipariş Takibi, Hesap ve Canlı Destek
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Giriş ekranından sipariş durumunu izle, demo profil oluştur veya otomatik destek asistanına ulaş.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Order Tracking Card */}
          <article className="flex flex-col justify-between rounded-2xl border border-slate-300 bg-white p-6 shadow-sm">
            <div>
              <div className="flex items-center justify-between gap-2">
                <p className="inline-block rounded-lg bg-[#FFF1F6] px-3 py-1 text-xs font-bold tracking-wide text-brand-dark">
                  SİPARİŞ TAKİBİ · DEMO
                </p>
                {demoOrder && (
                  <span className="text-xs font-bold text-slate-700">{demoOrder.orderId}</span>
                )}
              </div>
              <h3 className="mt-4 text-xl font-bold text-slate-900">
                {demoOrder ? `${demoOrder.service === "food" ? "Yemek" : "Market"} siparişin` : "Yemek & Market Takibi"}
              </h3>

              {demoOrder && activeStep ? (
                <div className="mt-3 space-y-3">
                  <p className="text-sm text-slate-700">
                    <strong>{demoOrder.storeName ?? (demoOrder.service === "food" ? "Restoran" : "Market")}</strong> ·{" "}
                    {formatTRY(demoOrder.amount)}
                  </p>
                  <div
                    role="progressbar"
                    aria-label="Ana sayfa demo sipariş durumu"
                    aria-valuemin={1}
                    aria-valuemax={4}
                    aria-valuenow={demoOrder.stage + 1}
                    aria-valuetext={`${demoOrder.stage + 1}/4: ${activeStep.title}`}
                    className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200"
                  >
                    <div
                      className="h-full rounded-full bg-brand transition-all duration-300"
                      style={{ width: `${orderProgress}%` }}
                    />
                  </div>
                  <p role="status" className="rounded-xl bg-[#FFF1F6] px-3 py-2 text-sm font-semibold text-brand-dark">
                    Aşama {demoOrder.stage + 1}/4 · {activeStep.title}
                  </p>
                  <ol className="grid grid-cols-4 gap-1 text-center text-[11px] text-slate-600">
                    {DEMO_TRACKING_STEPS.map((step, index) => (
                      <li
                        key={step.title}
                        className={
                          index <= demoOrder.stage
                            ? "font-bold text-slate-900"
                            : "text-slate-500"
                        }
                      >
                        {index + 1}. {step.title.split(" ")[0]}
                      </li>
                    ))}
                  </ol>
                </div>
              ) : (
                <div className="mt-3 space-y-3">
                  <p className="text-sm leading-6 text-slate-600">
                    Sipariş verdikten sonra 4 adımlı demo takip durumunu buradan izleyebilir ya da hemen örnek takip önizlemesi başlatabilirsin.
                  </p>
                  <ol className="grid grid-cols-2 gap-2 text-xs text-slate-700">
                    {DEMO_TRACKING_STEPS.map((step, index) => (
                      <li key={step.title} className="rounded-lg bg-slate-50 px-2.5 py-2 font-medium">
                        {index + 1}. {step.title}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>

            <div className="mt-6 space-y-2 border-t border-slate-200 pt-4">
              <Link to="/track" className="btn-primary w-full">
                {demoOrder ? "Sipariş takibini aç →" : "Takip ekranını aç →"}
              </Link>
              {demoOrder ? (
                demoOrder.stage < 3 && (
                  <button
                    type="button"
                    onClick={advancePreviewStage}
                    className="min-h-11 w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:border-brand"
                  >
                    Sonraki aşamaya ilerlet
                  </button>
                )
              ) : (
                <button
                  type="button"
                  onClick={startPreviewOrder}
                  className="min-h-11 w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:border-brand"
                >
                  Örnek takip başlat (önizleme)
                </button>
              )}
            </div>
          </article>

          {/* Account Creation Card */}
          <article className="flex flex-col justify-between rounded-2xl border border-slate-300 bg-white p-6 shadow-sm">
            <div>
              <p className="inline-block rounded-lg bg-[#FFF1F6] px-3 py-1 text-xs font-bold tracking-wide text-brand-dark">
                HESAP VE PROFİL · DEMO
              </p>
              <h3 className="mt-4 text-xl font-bold text-slate-900">
                {account ? account.name : "Demo Hesap Oluştur"}
              </h3>
              {account ? (
                <div className="mt-3 space-y-2 text-sm text-slate-700">
                  <p className="rounded-xl bg-emerald-50 px-3 py-2 font-semibold text-[#166534]">
                    ✓ Demo profilin aktif
                  </p>
                  <p>{account.email}</p>
                  <p>{account.phone}</p>
                  {account.deliveryNote && (
                    <p className="text-xs text-slate-600">Not: {account.deliveryNote}</p>
                  )}
                </div>
              ) : (
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Gerçek şifre veya kişisel bilgi girmeden demo profil oluştur; sipariş tamamlamada bilgilerini tek tıkla doldur.
                </p>
              )}
            </div>

            <div className="mt-6 space-y-2 border-t border-slate-200 pt-4">
              <Link to="/account" className="btn-primary w-full">
                {account ? "Hesabımı yönet →" : "Hesap oluştur →"}
              </Link>
              <button
                type="button"
                onClick={() => openPanel("account")}
                className="min-h-11 w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:border-brand"
              >
                Hızlı yan panelde aç
              </button>
            </div>
          </article>

          {/* Live Support Card */}
          <article className="flex flex-col justify-between rounded-2xl border border-slate-300 bg-white p-6 shadow-sm">
            <div>
              <p className="inline-block rounded-lg bg-[#FFF1F6] px-3 py-1 text-xs font-bold tracking-wide text-brand-dark">
                CANLI DESTEK · DEMO
              </p>
              <h3 className="mt-4 text-xl font-bold text-slate-900">Yardım ve Destek Asistanı</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Sipariş takibi, teslimat bölgesi, kupon kullanımı ve demo hesap konularında anında otomatik yardım al. Gerçek temsilci değildir.
              </p>
              <ul className="mt-3 flex flex-wrap gap-1.5 text-xs">
                <li className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">Siparişim nerede?</li>
                <li className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">Adres değişikliği</li>
                <li className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">Kupon yardımı</li>
              </ul>
            </div>

            <div className="mt-6 space-y-2 border-t border-slate-200 pt-4">
              <Link to="/support" className="btn-primary w-full">
                Canlı desteği aç →
              </Link>
              <button
                type="button"
                onClick={() => openPanel("help")}
                className="min-h-11 w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:border-brand"
              >
                Sohbet penceresini aç
              </button>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
