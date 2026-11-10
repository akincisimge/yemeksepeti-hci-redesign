
import { Link, useOutletContext } from "react-router-dom";
import { marketStores } from "../data/marketData";
import { useDelivery } from "../../../state/DeliveryContext";
import { locationLabel } from "../../../data/delivery";
import { formatTRY } from "../../../types/domain";
import type { LayoutContext } from "../../../components/Layout";

export default function MarketHomePage() {
  const { delivery, available } = useDelivery();
  const { openAddress } = useOutletContext<LayoutContext>();
  const nearby = marketStores.filter(store => available(store.id));

  return (
    <div className="space-y-8">
      <Link
        to="/"
        className="inline-flex min-h-11 items-center font-semibold text-slate-600 hover:text-brand"
      >
        ← Hizmet seçimine dön
      </Link>

      <header className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
        <p className="font-semibold text-brand">MARKET</p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
          İhtiyacın olanı kolayca bul.
        </h1>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#FA0050] p-4">
          <div>
            <p className="text-sm text-white/90">Teslimat konumun</p>
            <p className="mt-1 font-semibold text-white">
              {delivery && locationLabel(delivery)}
            </p>
          </div>

          <button
            className="min-h-11 rounded-xl border border-white bg-white px-4 font-semibold text-[#FA0050]"
            onClick={openAddress}
          >
            Konumu değiştir
          </button>
        </div>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold">Konumundaki marketler</h2>
        <p role="status" className="text-sm text-slate-600">
          {nearby.length} market bulundu
        </p>
      </div>

      {nearby.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {nearby.map(store => (
            <article
              key={store.id}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6"
            >
              <div className="flex h-28 items-center justify-center rounded-xl bg-slate-50">
                <img
                  src={store.logo}
                  alt=""
                  className="h-20 w-full object-contain"
                />
              </div>

              <p className="mt-5 text-sm font-semibold text-brand">
                {store.group === "ymarket" ? "Yemeksepeti Market" : "Diğer marketler"}
              </p>

              <h3 className="mt-2 text-xl font-bold">{store.name}</h3>
              <p className="mt-2 text-sm text-slate-600">{store.description}</p>

              <dl className="my-5 space-y-3 text-sm">
                <div className="flex justify-between gap-2">
                  <dt>Teslimat süresi</dt>
                  <dd className="font-semibold">{store.deliveryTime}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt>Teslimat ücreti</dt>
                  <dd className="font-semibold">{formatTRY(store.deliveryFee ?? 0)}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt>Minimum sepet</dt>
                  <dd className="font-semibold">{formatTRY(store.minBasket ?? 0)}</dd>
                </div>
              </dl>

              <Link
                to={`/market/${store.id}`}
                className="btn-primary mt-auto"
                aria-label={`${store.name} ürünlerini incele`}
              >
                Ürünleri incele →
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <h3 className="text-xl font-bold">
            Bu konumda henüz hizmet veren market bulunmuyor
          </h3>
          <p className="mt-3 text-slate-600">
            Başka bir teslimat konumu seçerek marketleri keşfedebilirsin.
          </p>
          <button className="btn-primary mt-5" onClick={openAddress}>
            Konumu değiştir
          </button>
        </section>
      )}
    </div>
  );
}

