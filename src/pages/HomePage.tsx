import { Link, useOutletContext } from "react-router-dom";
import type { LayoutContext } from "../components/Layout";
import { useAccount } from "../state/AccountContext";
import { formatAddressDetails, useDelivery } from "../state/DeliveryContext";
import { DEMO_TRACKING_STEPS, useDemoOrders } from "../state/demoOrder";

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
  const { address, openAddress, openPanel } = useOutletContext<LayoutContext>();
  const { addressDetails } = useDelivery();
  const { account } = useAccount();
  const orders = useDemoOrders();
  const latestOrder = orders[0] ?? null;
  const activeStep = latestOrder ? DEMO_TRACKING_STEPS[latestOrder.stage] : null;
  const inProgressCount = orders.filter((item) => item.stage < 3).length;

  return (
    <div className="space-y-8 sm:space-y-10">
      <section className="mx-auto max-w-3xl pt-2 text-center sm:pt-4">
        <h1 className="text-[32px] font-bold leading-[40px] tracking-tight text-slate-900 sm:text-[40px] sm:leading-[48px]">
          {account ? `Merhaba ${account.name.split(" ")[0]}, bugün ne sipariş etmek istersin?` : "Bugün ne sipariş etmek istersin?"}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-base leading-6 text-slate-600">
          Teslimat adresini seç, ister sıcak yemek ister market ihtiyaçlarını kapına getirelim.
        </p>

        <div className="mx-auto mt-6 max-w-2xl space-y-3">
          <button
            type="button"
            data-address-trigger="home"
            onClick={openAddress}
            aria-label={address ? `Teslimat adresi: ${address}. Değiştirmek için tıklayın` : "Teslimat adresi seçmek için tıklayın"}
            className="group flex w-full flex-col items-stretch justify-between gap-4 rounded-3xl border-2 border-slate-200 bg-white p-4 text-left shadow-md transition hover:border-brand hover:shadow-lg sm:flex-row sm:items-center sm:p-5"
          >
            <div className="flex min-w-0 items-center gap-3.5 sm:gap-4">
              <span
                className={
                  address
                    ? "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700"
                    : "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FFF1F6] text-brand"
                }
                aria-hidden="true"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
              </span>
              <div className="min-w-0">
                {address ? (
                  <>
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                      ✓ Teslimat adresin hazır
                    </span>
                    <p className="mt-1 break-words text-lg font-bold leading-snug text-slate-900 sm:text-xl" aria-live="polite">
                      {address}
                    </p>
                    <p className="mt-0.5 text-xs font-medium text-slate-600">
                      {addressDetails
                        ? formatAddressDetails(addressDetails)
                        : "Başka bir adrese göndermek için buraya dokunabilirsin."}
                    </p>
                  </>
                ) : (
                  <>
                    <span className="inline-block rounded-full bg-[#FFF1F6] px-2.5 py-0.5 text-xs font-bold text-brand-dark">
                      1. Adım · Teslimat Adresi
                    </span>
                    <p className="mt-1 text-lg font-bold leading-snug text-slate-900 sm:text-xl" aria-live="polite">
                      Nereye getirelim?
                    </p>
                    <p className="mt-0.5 text-xs font-medium text-slate-600 sm:text-sm">
                      Şehir, ilçe ve mahalle seçmek için buraya dokun.
                    </p>
                  </>
                )}
              </div>
            </div>

            <span
              aria-hidden="true"
              className={
                address
                  ? "inline-flex min-h-12 shrink-0 items-center justify-center rounded-2xl border-2 border-brand/25 bg-[#FFF1F6] px-5 py-2.5 text-sm font-bold text-brand-dark transition group-hover:border-brand group-hover:bg-brand group-hover:text-white"
                  : "inline-flex min-h-12 shrink-0 items-center justify-center rounded-2xl bg-brand px-6 py-2.5 text-sm font-bold text-white shadow-sm transition group-hover:bg-brand-dark"
              }
            >
              {address ? "Adresi Değiştir ▾" : "Adres Seç →"}
            </span>
          </button>

          <div className="flex justify-center pt-1">
            <button
              type="button"
              data-orders-trigger="home"
              onClick={() => openPanel("orders")}
              className="inline-flex min-h-12 items-center gap-3 rounded-2xl border-2 border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-900 shadow-sm transition hover:border-brand hover:bg-[#FFF1F6]"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-brand" aria-hidden="true">
                <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                <rect x="9" y="3" width="6" height="4" rx="1" />
                <path d="M9 12h6M9 16h4" />
              </svg>
              <span>Aktif Siparişlerim</span>
              {latestOrder && activeStep ? (
                <span
                  className={
                    inProgressCount > 0
                      ? "inline-flex items-center gap-1.5 rounded-full bg-[#FFF1F6] px-3 py-1 text-xs font-bold text-brand-dark"
                      : "inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800"
                  }
                >
                  {inProgressCount > 0 && <span className="h-2 w-2 animate-pulse rounded-full bg-brand" aria-hidden="true" />}
                  {orders.length} sipariş · {activeStep.title}
                </span>
              ) : (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  Takip için tıkla
                </span>
              )}
            </button>
          </div>
        </div>
      </section>

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
