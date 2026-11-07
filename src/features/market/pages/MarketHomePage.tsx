
import { useNavigate } from "react-router-dom";
import { marketStores } from "../data/marketData";
import { useDelivery } from "../../../state/DeliveryContext";
import MarketStoreCard from "../components/MarketStoreCard";

export default function MarketHomePage() {
  const navigate = useNavigate();
  const { available } = useDelivery();
  const nearbyStores = marketStores.filter(store => available(store.id));

  const ymarketStores = nearbyStores.filter(
    (store) => store.group === "ymarket"
  );

  const otherStores = nearbyStores.filter(
    (store) => store.group === "other"
  );

  return (
    <div className="min-h-screen bg-[#F8F8FA]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Hero Banner */}
        <section className="relative mb-12 overflow-hidden rounded-[28px] bg-gradient-to-r from-[#D90049] via-[#ED285F] to-[#FF7890] shadow-sm">
          <div className="relative z-10 flex flex-col justify-between gap-8 px-7 py-10 sm:px-10 md:flex-row md:items-center md:px-14 md:py-14">
            
            <div className="max-w-xl">
              <span className="inline-flex items-center rounded-full bg-white/20 px-4 py-2 text-xs font-bold tracking-wide text-white backdrop-blur-sm">
                🛒 YEMEKSEPETİ MARKET
              </span>

              <h1 className="mt-5 text-3xl font-extrabold leading-tight text-white sm:text-4xl md:text-5xl">
                Market alışverişin
                <br />
                kapında!
              </h1>

              <p className="mt-4 max-w-md text-sm leading-6 text-white/90 sm:text-base">
                Taze ürünler, günlük ihtiyaçlar ve favori marketlerin
                tek bir yerde.
              </p>

              <button
                disabled={!nearbyStores.length}
                onClick={() => navigate(`/market/${nearbyStores[0].id}`)}
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-[#D90049] shadow-lg transition duration-200 hover:-translate-y-1 hover:bg-pink-50"
              >
                Alışverişe başla
                <span>→</span>
              </button>
            </div>

            {/* Banner Decoration */}
            <div className="relative hidden h-48 w-48 shrink-0 items-center justify-center rounded-full bg-white/10 md:flex lg:h-64 lg:w-64">
              <div className="absolute h-36 w-36 rounded-full bg-white/10 lg:h-48 lg:w-48" />
              <span className="relative text-8xl drop-shadow-lg lg:text-9xl">
                🛍️
              </span>
            </div>
          </div>

          <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-white/10" />
        </section>

        {!nearbyStores.length && <p role="status" className="mb-6 rounded-2xl bg-white p-6">Bu konumda henüz hizmet veren market bulunmuyor. Üstteki konum butonundan konumunu değiştirebilirsin.</p>}
        {/* Yemeksepeti Market */}
        <section className="mb-14">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="h-7 w-1.5 rounded-full bg-[#D90049]" />
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
                  Yemeksepeti Market
                </h2>
              </div>
              <p className="ml-3.5 text-sm text-slate-500">
                Günlük ihtiyaçların için hızlı alışveriş
              </p>
            </div>

            <span className="w-fit rounded-full bg-pink-100 px-3 py-1.5 text-xs font-semibold text-[#D90049]">
              Hızlı teslimat
            </span>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {!ymarketStores.length && <p className="text-slate-600">Bu bölgede Yemeksepeti Market hizmeti yok.</p>}
            {ymarketStores.map((store) => (
              <MarketStoreCard
                key={store.id}
                store={store}
                onSelect={() => navigate(`/market/${store.id}`)}
              />
            ))}
          </div>
        </section>

        {/* Other Markets */}
        <section className="pb-8">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="h-7 w-1.5 rounded-full bg-[#D90049]" />
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
                  Diğer Marketler
                </h2>
              </div>
              <p className="ml-3.5 text-sm text-slate-500">
                Favori marketinden alışveriş yap
              </p>
            </div>

            <span className="w-fit rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
              Alternatif marketler
            </span>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {!otherStores.length && <p className="text-slate-600">Bu bölgede diğer marketler hizmet vermiyor.</p>}
            {otherStores.map((store) => (
              <MarketStoreCard
                key={store.id}
                store={store}
                onSelect={() => navigate(`/market/${store.id}`)}
              />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}


