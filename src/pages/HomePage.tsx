import { Link, useOutletContext } from "react-router-dom";
import type { LayoutContext } from "../components/Layout";
import { useAccount } from "../state/AccountContext";
import {
  DEMO_TRACKING_STEPS,
  saveDemoOrder,
  useDemoOrder,
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
    label: "Yemek",
    eyebrow: "RESTORANLAR",
    description: "Sevdiğin restoranlardan sıcak yemekleri hemen sipariş et.",
    cta: "Restoranları keşfet",
    Art: FoodArt,
  },
  {
    to: "/market",
    label: "Market",
    eyebrow: "GÜNLÜK ALIŞVERİŞ",
    description: "Yemeksepeti Market ve anlaşmalı marketlerden alışverişini tamamla.",
    cta: "Market alışverişine başla",
    Art: MarketArt,
  },
];

export default function HomePage() {
  const { address, openAddress } = useOutletContext<LayoutContext>();
  const { account } = useAccount();
  const activeOrder = useDemoOrder();

  function advanceOrderStage() {
    if (!activeOrder) return;
    const nextStage = Math.min(3, activeOrder.stage + 1) as DemoOrderStage;
    saveDemoOrder({ ...activeOrder, stage: nextStage });
  }

  const activeStep = activeOrder ? DEMO_TRACKING_STEPS[activeOrder.stage] : null;
  const orderProgress = activeOrder ? ((activeOrder.stage + 1) / DEMO_TRACKING_STEPS.length) * 100 : 0;

  return (
    <div className="space-y-8 sm:space-y-10">
      <section className="mx-auto max-w-3xl pt-2 text-center sm:pt-4">
        <h1 className="text-[32px] font-bold leading-[40px] tracking-tight text-slate-900 sm:text-[40px] sm:leading-[48px]">
          {account ? `Merhaba ${account.name.split(" ")[0]}, bugün ne sipariş etmek istersin?` : "Bugün ne sipariş etmek istersin?"}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-base leading-6 text-slate-600">
          Adresini seç, ister sıcak yemek ister günlük market ihtiyaçlarını kapına getirelim.
        </p>

        <div className="mx-auto mt-6 flex max-w-xl flex-col gap-3 rounded-2xl border border-slate-300 bg-white p-3 text-left shadow-sm sm:flex-row sm:items-center sm:justify-between sm:pl-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF1F6] text-brand" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
            </span>
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-600">Teslimat adresin</p>
              <p className="truncate font-semibold text-slate-900" aria-live="polite">
                {address ?? "Henüz teslimat adresi seçilmedi"}
              </p>
            </div>
          </div>
          <button
            type="button"
            data-address-trigger="home"
            onClick={openAddress}
            className="btn-primary shrink-0 px-5 py-2.5 text-sm"
          >
            {address ? "Değiştir" : "Adres seç"}
          </button>
        </div>
      </section>

      {activeOrder && activeStep && (
        <section
          aria-labelledby="active-order-title"
          className="mx-auto max-w-4xl rounded-2xl border-2 border-brand/30 bg-white p-5 shadow-sm sm:p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-[#FFF1F6] px-3 py-1 text-xs font-bold tracking-wide text-brand-dark">
                SİPARİŞ TAKİBİ
              </span>
              <span className="text-sm font-bold text-slate-900">{activeOrder.orderId}</span>
            </div>
            <span className="text-sm font-semibold text-slate-700">
              {activeOrder.storeName ?? (activeOrder.service === "food" ? "Restoran" : "Market")} · {formatTRY(activeOrder.amount)}
            </span>
          </div>

          <h2 id="active-order-title" className="mt-3 text-xl font-bold text-slate-900">
            {activeStep.title}
          </h2>
          <p className="mt-1 text-sm text-slate-600">{activeStep.detail}</p>

          <div
            role="progressbar"
            aria-label="Aktif sipariş ilerleme durumu"
            aria-valuemin={1}
            aria-valuemax={4}
            aria-valuenow={activeOrder.stage + 1}
            aria-valuetext={`${activeOrder.stage + 1}/4: ${activeStep.title}`}
            className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-slate-200"
          >
            <div
              className="h-full rounded-full bg-brand transition-all duration-300"
              style={{ width: `${orderProgress}%` }}
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <Link to="/track" className="btn-primary">
              Sipariş takibini aç →
            </Link>
            {activeOrder.stage < 3 && (
              <button
                type="button"
                onClick={advanceOrderStage}
                className="min-h-11 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:border-brand"
              >
                Sonraki aşamaya geç
              </button>
            )}
          </div>
        </section>
      )}

      <section aria-label="Hizmet seçimi" className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
        {choices.map(({ to, label, eyebrow, description, cta, Art }) => (
          <article
            key={to}
            className="group flex min-h-[260px] flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 focus-within:border-brand hover:-translate-y-0.5 hover:border-brand hover:shadow-xl sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="inline-block rounded-lg bg-[#FFF1F6] px-3 py-1.5 text-xs font-bold tracking-wider text-brand-dark">
                  {eyebrow}
                </p>
                <h2 id={`${label}-title`} className="mt-5 text-[28px] font-bold leading-9 tracking-tight text-slate-900">
                  {label}
                </h2>
                <p className="mt-2 text-base leading-6 text-slate-600">{description}</p>
              </div>
              <Art />
            </div>
            <div className="mt-6">
              <Link
                to={to}
                aria-labelledby={`${label}-title ${label}-action`}
                className="inline-flex min-h-12 w-full items-center justify-between gap-4 rounded-xl bg-brand px-6 py-3 text-base font-semibold text-white transition hover:bg-brand-dark focus-visible:outline-4 focus-visible:outline-offset-2"
              >
                <span id={`${label}-action`}>{cta}</span>
                <span aria-hidden="true" className="text-2xl">→</span>
              </Link>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
