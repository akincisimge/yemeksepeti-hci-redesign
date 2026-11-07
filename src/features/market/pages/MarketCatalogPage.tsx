
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
  const { add } = useCart();

  const store = marketStores.find((item) => item.id === storeId);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  // Mağazaya ait ürünleri getir
  const products = useMemo(
    () => marketProducts.filter((product) => product.storeId === storeId),
    [storeId]
  );

  // Ürün kategorileri
  const categories = useMemo(
    () => Array.from(new Set(products.map((product) => product.category))),
    [products]
  );

  // Arama ve kategori filtreleme
  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const matchesSearch = product.name
          .toLocaleLowerCase("tr")
          .includes(search.toLocaleLowerCase("tr"));

        const matchesCategory =
          category === "all" || product.category === category;

        return matchesSearch && matchesCategory;
      }),
    [products, search, category]
  );

  if (!store) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12">
        <h1 className="text-xl font-bold text-slate-800">
          Mağaza bulunamadı.
        </h1>

        <button
          onClick={() => navigate("/market")}
          className="mt-4 rounded-xl bg-[#D90049] px-5 py-3 font-semibold text-white"
        >
          Market sayfasına dön
        </button>
      </div>
    );
  }

  const deliveryFee = store.deliveryFee ?? 0;
  const minBasket = store.minBasket ?? 0;
  const deliveryTime = store.deliveryTime ?? "Hesaplanacak";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Geri dön */}
      <button
        onClick={() => navigate("/market")}
        className="mb-6 flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#D90049]"
      >
        ← Market ana sayfasına dön
      </button>

      {/* Mağaza bilgileri */}
      <div className="mb-8 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              {store.name}
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              {store.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600">
              <span>🛵 {deliveryTime}</span>
              <span>💰 {formatTRY(deliveryFee)} teslimat</span>
              <span>🛍️ Min. sepet {formatTRY(minBasket)}</span>
            </div>
          </div>

          <button
            onClick={() => navigate("/cart/market")}
            className="rounded-xl bg-[#D90049] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#b8003d]"
          >
            Market sepetim →
          </button>
        </div>
      </div>

      {/* Arama ve filtre */}
      <MarketSearchFilter
        search={search}
        onSearchChange={setSearch}
        selectedCategory={category}
        onCategoryChange={setCategory}
        categories={categories}
      />

      {/* Ürün sayısı */}
      <div className="mb-5 mt-8 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">
          Ürünler
        </h2>

        <span className="text-sm text-slate-500">
          {filteredProducts.length} ürün
        </span>
      </div>

      {/* Ürün listesi */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filteredProducts.map((product) => (
            <MarketProductCard
              key={product.id}
              product={product}
              onAdd={(item) => add(item)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-100 bg-white py-16 text-center">
          <div className="text-4xl">🔍</div>

          <h3 className="mt-4 font-semibold text-slate-800">
            Ürün bulunamadı
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Arama veya kategori filtrelerini değiştirebilirsin.
          </p>

          <button
            onClick={() => {
              setSearch("");
              setCategory("all");
            }}
            className="mt-5 rounded-xl bg-pink-50 px-5 py-3 text-sm font-semibold text-[#D90049]"
          >
            Filtreleri temizle
          </button>
        </div>
      )}
    </div>
  );
}




