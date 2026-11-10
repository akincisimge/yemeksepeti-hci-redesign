import { Link, useOutletContext } from "react-router-dom";
import type { LayoutContext } from "../components/Layout";

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
  const { address, openAddress } = useOutletContext<LayoutContext>();

  return (
    <div className="space-y-6 sm:space-y-8">
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
    </div>
  );
}
