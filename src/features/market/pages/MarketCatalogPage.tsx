

import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { marketProducts, marketStores } from "../data/marketData";
import MarketProductCard from "../components/MarketProductCard";
import MarketSearchFilter from "../components/MarketSearchFilter";
import { useCart } from "../../../state/CartContext";
import { formatTRY } from "../../../types/domain";

export default function MarketCatalogPage() {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const { add, count } = useCart();

  const store = marketStores.find((item) => item.id === storeId);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const products = useMemo(() => {
    return marketProducts.filter((product) => product.storeId === storeId);
  }, [storeId]);

  const categories = useMemo(() => {
    return Array.from(new Set(products.map((product) => product.category)));
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLocaleLowerCase("tr")
        .includes(search.toLocaleLowerCase("tr"));

      const matchesCategory =
        category === "all" || product.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  if (!store) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <div className="mb-4 text-5xl">🏪</div>

        <h1 className="text-2xl font-bold text-slate-900">
          Market bulunamadı
        </h1>

        <button
          onClick={() => navigate("/market")}
          className="mt-6 rounded-xl bg-[#D90049] px-6 py-3 font-semibold text-white transition hover:bg-[#B6003C]"
        >
          Marketlere dön
        </button>
      </div>
    );
  }

  const deliveryFee = store.deliveryFee ?? 0;
  const minBasket = store.minBasket ?? 0;
  const deliveryTime = store.deliveryTime ?? "Hesaplanacak";

  return (
    <div className="min-h-screen bg-[#F8F8FA]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/market")}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#D90049]"
        >
          <span>←</span>
          Marketlere dön
        </button>

        {/* Store Header */}
        <section className="mb-8 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
          <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:p-8">
            {/* Logo */}
            <div className="flex h-24 w-32 shrink-0 items-center justify-center rounded-2xl bg-slate-50 p-4">
              {store.logo ? (
                <img
                  src={store.logo}
                  alt={`${store.name} logosu`}
                  className="h-full w-full object-contain"
                />
              ) : (
                <span className="text-4xl">🛒</span>
              )}
            </div>

            {/* Store Details */}
            <div className="flex-1">
              <span className="inline-flex rounded-full bg-pink-50 px-3 py-1 text-xs font-bold text-[#D90049]">
                MARKET
              </span>

              <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                {store.name}
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                {store.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <span className="rounded-lg bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600">
                  ⚡ {deliveryTime}
                </span>

                <span className="rounded-lg bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600">
                  🚚 {formatTRY(deliveryFee)} teslimat
                </span>

                <span className="rounded-lg bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600">
                  🛒 Min. {formatTRY(minBasket)}
                </span>
              </div>
            </div>

            {/* Cart Button */}
            <button
              onClick={() => navigate("/cart/market")}
              className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#D90049] px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#B6003C] hover:shadow-md"
            >
              <span>🛒</span>
              Sepetim
              <span className="rounded-full bg-white/20 px-2 py-0.5">
                {count("market")}
              </span>
            </button>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="mb-8">
          <MarketSearchFilter
            search={search}
            onSearchChange={setSearch}
            selectedCategory={category}
            onCategoryChange={setCategory}
            categories={categories}
          />
        </section>

        {/* Products Heading */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Ürünler
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {filteredProducts.length} ürün listeleniyor
            </p>
          </div>

          {(search || category !== "all") && (
            <button
              onClick={() => {
                setSearch("");
                setCategory("all");
              }}
              className="w-fit text-sm font-semibold text-[#D90049] hover:text-[#B6003C]"
            >
              Filtreleri temizle ✕
            </button>
          )}
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <MarketProductCard
                key={product.id}
                product={product}
                onAdd={() => add(product)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-100 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mb-5 text-5xl">🔎</div>

            <h3 className="text-lg font-bold text-slate-900">
              Ürün bulunamadı
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Aramana uygun ürün bulunamadı.
            </p>

            <button
              onClick={() => {
                setSearch("");
                setCategory("all");
              }}
              className="mt-6 rounded-xl bg-[#D90049] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#B6003C]"
            >
              Filtreleri temizle
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


