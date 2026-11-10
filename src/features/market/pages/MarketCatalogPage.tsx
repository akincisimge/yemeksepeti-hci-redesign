
import { useEffect, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { marketProducts, marketStores } from "../data/marketData";
import { emptyFilters, filterProducts, type Filters, type Sort } from "../filterProducts";
import MarketProductCard from "../components/MarketProductCard";
import MarketBasket from "../components/MarketBasket";
import StoreSwitchDialog from "../../../components/StoreSwitchDialog";
import { useCart } from "../../../state/CartContext";
import { formatTRY, type Product } from "../../../types/domain";
import { useDelivery } from "../../../state/DeliveryContext";
import { locationLabel } from "../../../data/delivery";

export default function MarketCatalogPage() {
  const { storeId } = useParams();
  const { add, count, total, carts } = useCart();
  const { delivery } = useDelivery();
  const [params, setParams] = useSearchParams();

  const filters: Filters = { ...emptyFilters };

  for (const key of Object.keys(emptyFilters) as (keyof Filters)[]) {
    const value = params.get(key);
    if (value !== null) Object.assign(filters, { [key]: value });
  }

  if (!["default", "price-asc", "price-desc", "name", "name-desc"].includes(filters.sort)) {
    filters.sort = "default";
  }

  if (filters.maxPrice !== "") {
    filters.maxPrice = "";
  }

  if (filters.brand !== "all") filters.brand = "all";
  if (filters.tag !== "all") filters.tag = "all";
  if (filters.pack !== "all") filters.pack = "all";
  if (filters.basis !== "all") filters.basis = "all";

  function setFilters(next: Filters | ((old: Filters) => Filters)) {
    const value = typeof next === "function" ? next(filters) : next;
    const query = new URLSearchParams();

    for (const key of Object.keys(emptyFilters) as (keyof Filters)[]) {
      if (value[key] !== emptyFilters[key]) {
        query.set(key, value[key]);
      }
    }

    setParams(query, { replace: true, preventScrollReset: true });
  }

  const [notice, setNotice] = useState("");
  const [pendingProduct, setPendingProduct] = useState<Product | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const basketButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setNotice("");
    setPendingProduct(null);
    dialog.current?.close();
  }, [storeId]);

  const store = marketStores.find((s) => s.id === storeId);
  const products = marketProducts.filter((p) => p.storeId === storeId);
  const categories = [...new Set(products.map((p) => p.category))];

  const filtered = filterProducts(products, filters);

  function update<K extends keyof Filters>(key: K, value: Filters[K]) {
    setFilters((old) => ({ ...old, [key]: value }));
  }

  function chooseCategory(category: string) {
    setFilters((old) => ({
      ...old,
      category,
      brand: "all",
      tag: "all",
      basis: "all",
      pack: "all",
      maxPrice: "",
    }));
  }

  function addProduct(product: Product) {
    const activeMarketStoreId = carts.market[0]?.product.storeId;

    if (activeMarketStoreId && activeMarketStoreId !== product.storeId) {
      setPendingProduct(product);
      setNotice("");
      return;
    }

    const quantity =
      carts.market.find(
        (line) => line.product.id === product.id && line.product.storeId === product.storeId
      )?.quantity ?? 0;

    setNotice(
      add(product) === "added"
        ? `${product.name} sepete eklendi. Sepette ${quantity + 1} adet.`
        : "Mağaza değişikliği iptal edildi. Sepetin korundu."
    );
  }

  function confirmMarketSwitch() {
    if (!pendingProduct) return;

    const product = pendingProduct;
    setPendingProduct(null);
    add(product, { replace: true });
    setNotice(`${product.name} yeni market sepetine eklendi.`);
  }

  function cancelMarketSwitch() {
    setPendingProduct(null);
    setNotice("Mağaza değişikliği iptal edildi. Mevcut sepetin korundu.");
  }

  const activeChips = [
    filters.search && {
      label: `Arama: ${filters.search}`,
      clear: () => update("search", ""),
    },
    filters.category !== "all" && {
      label: filters.category,
      clear: () => chooseCategory("all"),
    },
  ].filter((x): x is { label: string; clear: () => void } => !!x);

  const basketStore = marketStores.find(
    (s) => s.id === carts.market[0]?.product.storeId
  );

  if (!store) {
    return (
      <section>
        <h1 className="text-2xl font-bold">Mağaza bulunamadı</h1>
        <Link className="nav-link" to="/market">
          Marketlere dön
        </Link>
      </section>
    );
  }

  return (
    <div className="space-y-5 pb-24 lg:pb-0">
      <Link
        to="/market"
        className="inline-flex min-h-11 items-center font-semibold text-slate-600 hover:text-brand"
      >
        ← Marketlere dön
      </Link>

      <header className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex items-center gap-3.5">
          {store.logo && (
            <img
              src={store.logo}
              alt=""
              className="h-14 w-14 shrink-0 rounded-xl object-contain"
            />
          )}

          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              {store.name}
            </h1>

            {delivery && (
              <p className="mt-0.5 truncate text-xs font-medium text-slate-600">
                {locationLabel(delivery)}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-700 sm:justify-end">
          <span className="rounded-lg bg-slate-100 px-2.5 py-1.5">
            {store.deliveryTime}
          </span>

          <span className="rounded-lg bg-slate-100 px-2.5 py-1.5">
            Teslimat: {formatTRY(store.deliveryFee ?? 0)}
          </span>

          <span className="rounded-lg bg-[#FFF1F6] px-2.5 py-1.5 text-brand-dark">
            Min. {formatTRY(store.minBasket ?? 0)}
          </span>
        </div>
      </header>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-4">
          {/* Search and sorting */}
          <section
            aria-label="Ürün arama ve sıralama"
            className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs"
          >
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
              <label className="relative min-w-0 flex-1">
                <span className="sr-only">Ürün ara</span>

                <svg
                  aria-hidden="true"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" strokeLinecap="round" />
                </svg>

                <input
                  type="search"
                  className={filters.search ? "field pl-10 pr-16" : "field pl-10 pr-3"}
                  placeholder="Ne arıyorsun? (ör. süt, ekmek, peynir)"
                  value={filters.search}
                  onChange={(e) => update("search", e.target.value)}
                />

                {filters.search && (
                  <button
                    type="button"
                    onClick={() => update("search", "")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-brand"
                  >
                    Temizle
                  </button>
                )}
              </label>

              <label className="min-w-[165px] flex-1 sm:flex-initial">
                <span className="sr-only">Sıralama</span>

                <select
                  className="location-select py-2.5 text-sm"
                  value={filters.sort}
                  onChange={(e) => update("sort", e.target.value as Sort)}
                >
                  <option value="default">Sırala: Önerilen</option>
                  <option value="price-asc">Fiyat: Azdan Çoğa</option>
                  <option value="price-desc">Fiyat: Çoktan Aza</option>
                  <option value="name">A-Z</option>
                  <option value="name-desc">Z-A</option>
                </select>
              </label>
            </div>

            {/* Categories */}
            <nav aria-label="Kategoriler" className="flex flex-wrap gap-2">
              {["all", ...categories].map((category) => {
                const selected = filters.category === category;

                const itemCount =
                  category === "all"
                    ? products.length
                    : products.filter((p) => p.category === category).length;

                return (
                  <button
                    type="button"
                    key={category}
                    aria-pressed={selected}
                    className={
                      selected
                        ? "inline-flex min-h-11 items-center gap-1.5 rounded-full border-2 border-brand bg-[#FFF1F6] px-3.5 py-1.5 text-sm font-bold text-brand-dark"
                        : "inline-flex min-h-11 items-center gap-1.5 rounded-full border border-slate-300 bg-white px-3.5 py-1.5 text-sm font-semibold text-slate-800 transition hover:border-brand hover:bg-[#FFF1F6]"
                    }
                    onClick={() => chooseCategory(category)}
                  >
                    <span>{category === "all" ? "Tümü" : category}</span>

                    <span className="text-xs font-medium text-slate-500">
                      ({itemCount})
                    </span>
                  </button>
                );
              })}
            </nav>

            {/* Active search/category chips */}
            {activeChips.length > 0 && (
              <div
                className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-2.5"
                aria-label="Seçili filtreler"
              >
                {activeChips.map((chip) => (
                  <button
                    key={chip.label}
                    type="button"
                    className="inline-flex min-h-9 items-center gap-1 rounded-full border border-brand bg-[#FFF1F6] px-3 py-1 text-xs font-bold text-brand-dark hover:bg-pink-100"
                    onClick={chip.clear}
                    aria-label={`${chip.label} filtresini kaldır`}
                  >
                    <span>{chip.label}</span>
                    <span aria-hidden="true">×</span>
                  </button>
                ))}

                <button
                  type="button"
                  className="min-h-9 px-2 text-xs font-bold text-brand underline"
                  onClick={() => setFilters({ ...emptyFilters })}
                >
                  Tümünü temizle
                </button>
              </div>
            )}
          </section>

          {/* Product count */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-1">
            <h2 className="text-lg font-bold text-slate-900">
              {filters.category === "all" ? "Tüm ürünler" : filters.category}
            </h2>

            <p role="status" className="text-sm font-medium text-slate-600">
              {filtered.length} ürün gösteriliyor
            </p>
          </div>

          {notice && (
            <p
              role="status"
              aria-live="polite"
              aria-atomic="true"
              className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-900"
            >
              {notice}
            </p>
          )}

          {/* Products */}
          {filtered.length ? (
            <div className="grid gap-4 min-[440px]:grid-cols-2 xl:grid-cols-3">
              {filtered.map((product) => (
                <MarketProductCard
                  key={product.id}
                  product={product}
                  onAdd={addProduct}
                  onNotice={setNotice}
                />
              ))}
            </div>
          ) : (
            <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center">
              <h3 className="text-xl font-bold">Aradığın ürün bulunamadı</h3>

              <p className="mt-3 text-slate-600">
                Aramanı kısaltabilir veya seçili filtrelerden birini kaldırabilirsin.
              </p>

              <button
                type="button"
                className="btn-primary mt-5"
                onClick={() => setFilters({ ...emptyFilters })}
              >
                Tüm filtreleri temizle
              </button>
            </section>
          )}
        </div>

        {/* Desktop basket */}
        <aside className="sticky top-40 hidden lg:block">
          <MarketBasket onNotice={setNotice} />
        </aside>
      </div>

      {/* Mobile basket */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white p-3 pb-[max(12px,env(safe-area-inset-bottom))] lg:hidden">
        <button
          ref={basketButton}
          type="button"
          className="btn-primary mx-auto flex w-full max-w-xl justify-between"
          onClick={() => dialog.current?.showModal()}
          aria-haspopup="dialog"
        >
          <span>Sepetim · {count("market")} ürün</span>

          <span>
            {formatTRY(
              total("market") +
                (carts.market.length ? (basketStore?.deliveryFee ?? 0) : 0)
            )} →
          </span>
        </button>
      </div>

      {/* Mobile basket dialog */}
      <dialog
        ref={dialog}
        aria-label="Market sepetin"
        onClose={() => basketButton.current?.focus()}
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
        className="fixed inset-0 m-auto max-h-[85dvh] w-[calc(100%_-_24px)] max-w-md overflow-y-auto rounded-3xl bg-white p-4 backdrop:bg-slate-900/40"
      >
        <button
          autoFocus
          type="button"
          className="mb-3 min-h-11 w-full rounded-xl border border-slate-300 font-semibold"
          onClick={() => dialog.current?.close()}
        >
          Alışverişe dön · Kapat ×
        </button>

        <MarketBasket onNotice={setNotice} />
      </dialog>

      {/* Store switch dialog */}
      <StoreSwitchDialog
        pendingProduct={pendingProduct}
        currentStoreName={
          basketStore?.name ?? carts.market[0]?.product.storeName ?? ""
        }
        serviceLabel="market"
        onCancel={cancelMarketSwitch}
        onConfirm={confirmMarketSwitch}
      />
    </div>
  );
}


