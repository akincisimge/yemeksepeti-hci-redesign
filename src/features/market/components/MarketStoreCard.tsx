
import type { Store } from "../../../types/domain";
import { formatTRY } from "../../../types/domain";

interface MarketStoreCardProps {
  store: Store;
  onSelect: () => void;
}

export default function MarketStoreCard({
  store,
  onSelect,
}: MarketStoreCardProps) {
  const isYMarket = store.group === "ymarket";

  return (
    <button
      onClick={onSelect}
      className="group w-full overflow-hidden rounded-2xl border border-slate-200 bg-white text-left transition-all duration-300 hover:-translate-y-1 hover:border-pink-200 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#D90049]/30"
    >
      {/* Store Logo */}
      <div
        className={`relative flex h-36 items-center justify-center p-6 ${
          isYMarket ? "bg-pink-50" : "bg-slate-50"
        }`}
      >
        {isYMarket && (
          <span className="absolute left-4 top-4 rounded-full bg-[#D90049] px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
            Hızlı Market
          </span>
        )}

        {store.logo ? (
          <img
            src={store.logo}
            alt={`${store.name} logosu`}
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <span className="text-5xl">🛒</span>
        )}
      </div>

      {/* Store Information */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900 transition-colors group-hover:text-[#D90049]">
              {store.name}
            </h3>
            <p className="mt-1 text-sm leading-5 text-slate-500">
              {store.description}
            </p>
          </div>

          <span className="shrink-0 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
            Aktif
          </span>
        </div>

        {/* Delivery Information */}
        <div className="mt-5 grid grid-cols-3 divide-x divide-slate-100 rounded-xl bg-slate-50 py-3">
          <div className="px-1 text-center">
            <span className="text-lg">⚡</span>
            <p className="mt-1 text-xs font-semibold text-slate-700">
              {store.deliveryTime}
            </p>
            <p className="mt-0.5 text-[10px] text-slate-400">Teslimat</p>
          </div>

          <div className="px-1 text-center">
            <span className="text-lg">🚚</span>
            <p className="mt-1 text-xs font-semibold text-slate-700">
              {formatTRY(store.deliveryFee)}
            </p>
            <p className="mt-0.5 text-[10px] text-slate-400">Teslimat ücreti</p>
          </div>

          <div className="px-1 text-center">
            <span className="text-lg">🛒</span>
            <p className="mt-1 text-xs font-semibold text-slate-700">
              {formatTRY(store.minBasket)}
            </p>
            <p className="mt-0.5 text-[10px] text-slate-400">Min. sepet</p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-[#D90049] py-3 text-sm font-bold text-white transition-colors group-hover:bg-[#B8003D]">
          Alışverişe başla
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </div>
      </div>
    </button>
  );
}




