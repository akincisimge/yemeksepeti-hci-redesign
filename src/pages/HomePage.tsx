import { Link } from "react-router-dom";

const choices = [
  { to: "/food", symbol: "🍲", title: "YEMEK", description: "Restoranları keşfet, menüleri incele ve siparişini oluştur.", hint: "Restoranlardan sipariş" },
  { to: "/market", symbol: "🧺", title: "MARKET", description: "Yemeksepeti Market veya diğer mağazalardan ürün seç.", hint: "Market alışverişi" }
];

export default function HomePage() {
  return (
    <div className="space-y-10 py-6 sm:py-12">
      <section className="mx-auto max-w-3xl text-center">
        <p className="mb-3 font-semibold text-brand">İki net seçenek, tek kolay deneyim</p>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">Bugün ne sipariş etmek istersin?</h1>
        <p className="mx-auto mt-5 max-w-2xl text-base text-slate-600 sm:text-lg">
          İhtiyacına uygun bölümü seç. İstediğin zaman üst menüden diğer bölüme geçebilirsin.
        </p>
      </section>
      <section aria-label="Hizmet seçimi" className="grid gap-5 md:grid-cols-2">
        {choices.map((choice) => (
          <Link key={choice.to} to={choice.to} className="group rounded-3xl border-2 border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-brand hover:shadow-lg focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-brand sm:p-10">
            <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-pink-50 text-6xl" aria-hidden="true">{choice.symbol}</div>
            <p className="text-xs font-bold uppercase tracking-widest text-brand">{choice.hint}</p>
            <h2 className="mt-2 text-4xl font-black text-slate-900">{choice.title}</h2>
            <p className="mt-4 min-h-14 text-base leading-relaxed text-slate-600">{choice.description}</p>
            <span className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 font-semibold text-white group-hover:bg-brand-dark">
              Bu bölüme git <span aria-hidden="true">→</span>
            </span>
          </Link>
        ))}
      </section>
      <p className="text-center text-sm text-slate-500">
        Önce hizmetini seç, sonra ürünleri bul ve demo ödeme akışını tamamla.
      </p>
    </div>
  );
}
