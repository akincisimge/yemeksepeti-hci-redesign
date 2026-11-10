import { useMemo, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import CampaignCarousel from "../components/CampaignCarousel";
import RestaurantCard from "../components/RestaurantCard";
import RestaurantFilters, { type QuickFilters } from "../components/RestaurantFilters";
import FoodMobileBasketBar from "../components/FoodMobileBasketBar";
import {
  cuisineOptions,
  foodRestaurants,
  getFoodDeliveryStartMinutes,
  hasFoodDiscount,
  isFoodFastDelivery,
  type FoodSort,
} from "../data/foodData";
import { useCart } from "../../../state/CartContext";
import { useDelivery } from "../../../state/DeliveryContext";
import { locationLabel } from "../../../data/delivery";
import type { LayoutContext } from "../../../components/Layout";

const initialQuickFilters: QuickFilters = {
  freeDelivery: false,
  fastDelivery: false,
  discount: false,
};

const activeFilterChipClass = "min-h-11 rounded-full border border-[#D90049] bg-[#FFF0F5] px-3 py-2 text-sm font-semibold text-[#D90049] hover:bg-[#FFE3ED]";
const sortLabels: Record<FoodSort, string> = {
  recommended: "Önerilen",
  delivery: "Teslimat Süresi",
  rating: "Restoran Puanı",
};

type BudgetOption = "all" | "economic" | "mid" | "wide";
const maximumBudget = 1000;

const budgetOptions: { id: BudgetOption; label: string; max: number }[] = [
  { id: "all", label: "Tümü", max: maximumBudget },
  { id: "economic", label: "₺ Ekonomik (Min. Sepet ≤ 150 TL)", max: 150 },
  { id: "mid", label: "₺₺ Orta Bütçe (Min. Sepet ≤ 200 TL)", max: 200 },
  { id: "wide", label: "₺₺₺ Geniş Menü (Tüm Tutarlar)", max: maximumBudget },
];

export default function FoodHomePage() {
  const [search, setSearch] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [minimumRating, setMinimumRating] = useState(0);
  const [sort, setSort] = useState<FoodSort>("recommended");
  const [quickFilters, setQuickFilters] = useState(initialQuickFilters);
  const [maxMinBasket, setMaxMinBasket] = useState(maximumBudget);
  const [budgetChoice, setBudgetChoice] = useState<BudgetOption | "custom">("all");
  const { count } = useCart();
  const { delivery, available } = useDelivery();
  const { openAddress } = useOutletContext<LayoutContext>();
  const normalizedSearch = search.trim().toLocaleLowerCase("tr");
  const availableRestaurants = useMemo(
    () => foodRestaurants.filter((restaurant) => available(restaurant.id)),
    [available],
  );
  const quickFilterCounts: Record<keyof QuickFilters, number> = {
    freeDelivery: availableRestaurants.filter((restaurant) => restaurant.deliveryFee === 0).length,
    fastDelivery: availableRestaurants.filter(isFoodFastDelivery).length,
    discount: availableRestaurants.filter(hasFoodDiscount).length,
  };
  const ratingCounts: Record<number, number> = {
    0: availableRestaurants.length,
    4: availableRestaurants.filter((restaurant) => restaurant.rating >= 4).length,
    4.5: availableRestaurants.filter((restaurant) => restaurant.rating >= 4.5).length,
    4.8: availableRestaurants.filter((restaurant) => restaurant.rating >= 4.8).length,
  };

  const filteredRestaurants = useMemo(() => {
    const filtered = availableRestaurants.filter((restaurant) => {
      const matchesSearch = `${restaurant.name} ${restaurant.cuisine} ${restaurant.description}`
        .toLocaleLowerCase("tr")
        .includes(normalizedSearch);
      return matchesSearch &&
        (!cuisine || restaurant.cuisine === cuisine) &&
        restaurant.rating >= minimumRating &&
        (!quickFilters.freeDelivery || restaurant.deliveryFee === 0) &&
        (!quickFilters.fastDelivery || isFoodFastDelivery(restaurant)) &&
        (!quickFilters.discount || hasFoodDiscount(restaurant)) &&
        restaurant.minBasket <= maxMinBasket;
    });

    return filtered.sort((first, second) => {
      if (sort === "delivery") return getFoodDeliveryStartMinutes(first) - getFoodDeliveryStartMinutes(second);
      if (sort === "rating") return second.rating - first.rating;
      return 0;
    });
  }, [availableRestaurants, cuisine, maxMinBasket, minimumRating, normalizedSearch, quickFilters, sort]);

  const hasActiveFilters = Boolean(
    search.trim() ||
    cuisine ||
    minimumRating ||
    quickFilters.freeDelivery ||
    quickFilters.fastDelivery ||
    quickFilters.discount ||
    maxMinBasket < maximumBudget ||
    sort !== "recommended"
  );

  const clearFilters = () => {
    setSearch("");
    setCuisine("");
    setMinimumRating(0);
    setQuickFilters(initialQuickFilters);
    setMaxMinBasket(maximumBudget);
    setBudgetChoice("all");
    setSort("recommended");
  };

  const updateQuickFilter = (key: keyof QuickFilters, value: boolean) => {
    setQuickFilters((current) => ({ ...current, [key]: value }));
  };

  return (
    <div className="space-y-7 pb-24 lg:pb-0">
      <Link to="/" className="inline-flex min-h-11 items-center font-semibold text-slate-600 hover:text-brand">
        ← Hizmet seçimine dön
      </Link>
      <header className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
        <p className="font-semibold text-brand">YEMEK</p>
        <h1 className="mt-2 text-3xl font-bold text-[#0F172A] sm:text-4xl">Restoranları keşfet.</h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Mutfak, bütçe, puan ve kampanyalara göre filtrele; seçtiğin restoranın menüsünden sipariş oluştur.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 p-4">
          <div>
            <p className="text-sm text-slate-600">Teslimat konumun</p>
            <p className="mt-1 font-semibold text-slate-900">{delivery && locationLabel(delivery)}</p>
          </div>
          <button
            type="button"
            data-address-trigger="food-home"
            className="min-h-11 rounded-xl border border-slate-300 bg-white px-4 font-semibold text-brand hover:border-brand"
            onClick={openAddress}
          >
            Konumu değiştir
          </button>
        </div>
        <p className="mt-4 text-sm text-slate-600">
          HCI prototipi · Restoran kapsamı, menüler, fiyatlar ve teslimat süreleri örnek veridir.
        </p>
      </header>
      {availableRestaurants.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <h2 className="text-xl font-bold text-[#0F172A]">Bu konumda henüz hizmet veren restoran bulunmuyor</h2>
          <p className="mt-3 text-slate-600">Başka bir teslimat konumu seçerek örnek restoranları keşfedebilirsin.</p>
          <button type="button" className="btn-primary mt-5" onClick={openAddress}>Konumu değiştir</button>
        </section>
      ) : (
        <>
      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="space-y-3">
          <form
            aria-label="Restoran arama"
            onSubmit={(event) => event.preventDefault()}
            className="flex min-h-16 w-full items-center gap-2 rounded-xl border-2 border-[#CBD5E1] bg-white px-3 shadow-sm transition focus-within:border-[#D90049] sm:gap-3 sm:px-4"
          >
            <label className="flex min-w-0 flex-1 items-center gap-3">
              <span className="sr-only">Yemek, mutfak veya restoran arayın</span>
              <svg aria-hidden="true" className="h-7 w-7 shrink-0 text-[#D90049]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7" />
                <path strokeLinecap="round" d="m20 20-4-4" />
              </svg>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Yemek, mutfak veya restoran arayın"
                className="h-14 w-full min-w-0 border-0 bg-transparent text-lg text-[#0F172A] placeholder:text-[#475569] focus:outline-none focus:ring-0"
              />
            </label>
            <button
              type="submit"
              className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl bg-[#D90049] px-5 py-3 font-semibold text-white transition hover:bg-[#B6003C]"
            >
              Ara
            </button>
          </form>
          <div className="flex justify-end">
            <Link
              to="/cart/food"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-3 py-2 font-semibold text-[#D90049] hover:bg-[#FFF1F6]"
            >
              <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h2l2.2 11.1a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 1.9-1.4L22 8H6" />
                <circle cx="10" cy="20" r="1" />
                <circle cx="18" cy="20" r="1" />
              </svg>
              Yemek Sepetim ({count("food")})
            </Link>
          </div>
        </div>
        <nav aria-label="Mutfak kategorileri" className="flex flex-wrap gap-2">
          {cuisineOptions.map((option) => {
            const selected = (option.name === "Tümü" && !cuisine) || cuisine === option.name;
            return (
              <button
                type="button"
                key={option.name}
                onClick={() => setCuisine(option.name === "Tümü" || selected ? "" : option.name)}
                aria-pressed={selected}
                className={selected
                  ? "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-[#D90049] bg-[#FFF1F6] px-4 py-2 text-sm font-semibold text-[#D90049]"
                  : "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-[#CBD5E1] bg-white px-4 py-2 text-sm font-semibold text-[#0F172A] hover:border-[#D90049]"}
              >
                <span aria-hidden="true">{option.icon}</span>
                {option.name}
              </button>
            );
          })}
        </nav>
      </section>

      <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" aria-labelledby="budget-title">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <h2 id="budget-title" className="text-lg font-bold text-[#0F172A]">Bütçene Göre Seç</h2>
            <p className="text-sm text-[#475569]">Fiyat &amp; minimum sepet tutarına göre filtrele</p>
          </div>
          <span className="rounded-lg bg-[#FFF1F6] px-3 py-2 text-sm font-semibold text-[#D90049]">
            Maks. {maxMinBasket} TL
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {budgetOptions.map((option) => (
            <button
              type="button"
              key={option.id}
              onClick={() => {
                setBudgetChoice(option.id);
                setMaxMinBasket(option.max);
              }}
              aria-pressed={budgetChoice === option.id}
              className={budgetChoice === option.id
                ? "min-h-11 shrink-0 rounded-xl border border-[#D90049] bg-[#FFF1F6] px-4 py-2 text-sm font-semibold text-[#D90049]"
                : "min-h-11 shrink-0 rounded-xl border border-[#CBD5E1] bg-white px-4 py-2 text-sm font-semibold text-[#0F172A] hover:border-[#D90049]"}
            >
              {option.label}
            </button>
          ))}
        </div>
        <label className="block">
          <span className="mb-2 flex items-center justify-between gap-3 text-sm font-semibold text-[#0F172A]">
            <span>Maksimum Min. Sepet Tutarı</span>
            <span>{maxMinBasket} TL</span>
          </span>
          <input
            type="range"
            min="100"
            max={maximumBudget}
            step="10"
            value={maxMinBasket}
            onChange={(event) => {
              setMaxMinBasket(Number(event.target.value));
              setBudgetChoice("custom");
            }}
            className="h-6 w-full cursor-pointer accent-[#D90049]"
          />
          <span className="flex justify-between text-xs text-[#475569]"><span>100 TL</span><span>{maximumBudget} TL</span></span>
        </label>
      </section>

      <div className="grid items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="space-y-4">
          <CampaignCarousel />
          <RestaurantFilters
            minimumRating={minimumRating}
            sort={sort}
            quickFilters={quickFilters}
            quickFilterCounts={quickFilterCounts}
            ratingCounts={ratingCounts}
            hasActiveFilters={hasActiveFilters}
            onMinimumRatingChange={setMinimumRating}
            onSortChange={setSort}
            onQuickFilterChange={updateQuickFilter}
            onClear={clearFilters}
          />
        </div>

        <div className="min-w-0 flex-1">
          <section aria-labelledby="restaurant-results-title">
            <div className="mb-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 id="restaurant-results-title" className="text-2xl font-bold text-[#0F172A]">Tüm Restoranlar</h2>
                <p role="status" aria-live="polite" className="text-sm text-[#475569]">
                  {filteredRestaurants.length} restoran bulundu
                </p>
              </div>
              {hasActiveFilters && (
                <div className="mt-3 flex flex-wrap items-center gap-2" aria-label="Seçili filtreler">
                  <span className="text-sm font-semibold text-[#0F172A]">Seçili:</span>
                  {search.trim() && <button type="button" onClick={() => setSearch("")} className={activeFilterChipClass}>Arama: {search.trim()} <span aria-hidden="true">×</span></button>}
                  {cuisine && <button type="button" onClick={() => setCuisine("")} className={activeFilterChipClass}>{cuisine} <span aria-hidden="true">×</span></button>}
                  {maxMinBasket < maximumBudget && <button type="button" onClick={() => { setBudgetChoice("all"); setMaxMinBasket(maximumBudget); }} className={activeFilterChipClass}>Bütçe: {budgetChoice === "custom" ? `≤ ${maxMinBasket} TL` : budgetOptions.find((option) => option.id === budgetChoice)?.label} <span aria-hidden="true">×</span></button>}
                  {sort !== "recommended" && <button type="button" onClick={() => setSort("recommended")} className={activeFilterChipClass}>Sıralama: {sortLabels[sort]} <span aria-hidden="true">×</span></button>}
                  {minimumRating > 0 && <button type="button" onClick={() => setMinimumRating(0)} className={activeFilterChipClass}>★ {minimumRating.toFixed(1)} ve üzeri <span aria-hidden="true">×</span></button>}
                  {quickFilters.freeDelivery && <button type="button" onClick={() => updateQuickFilter("freeDelivery", false)} className={activeFilterChipClass}>Ücretsiz teslimat <span aria-hidden="true">×</span></button>}
                  {quickFilters.fastDelivery && <button type="button" onClick={() => updateQuickFilter("fastDelivery", false)} className={activeFilterChipClass}>Hızlı teslimat <span aria-hidden="true">×</span></button>}
                  {quickFilters.discount && <button type="button" onClick={() => updateQuickFilter("discount", false)} className={activeFilterChipClass}>İndirimli restoranlar <span aria-hidden="true">×</span></button>}
                  <button type="button" onClick={clearFilters} className="min-h-11 rounded-xl px-3 py-2 text-sm font-semibold text-[#D90049] underline underline-offset-2 hover:text-[#B6003C]">Filtreleri Temizle</button>
                </div>
              )}
            </div>
            {filteredRestaurants.length ? (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {filteredRestaurants.map((restaurant) => (
                  <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-[#CBD5E1] bg-white px-5 py-12 text-center">
                <span aria-hidden="true" className="text-4xl">🔎</span>
                <h3 className="mt-3 text-xl font-semibold text-[#0F172A]">Aramana uygun restoran bulunamadı</h3>
                <p className="mx-auto mt-2 max-w-lg text-base leading-6 text-[#475569]">
                  Farklı bir kategori seçebilir veya filtrelerini temizleyebilirsin.
                </p>
                <button type="button" onClick={clearFilters} className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#D90049] px-5 py-3 font-semibold text-white hover:bg-[#B6003C]">
                  Filtreleri Temizle
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
      </>
      )}
      <FoodMobileBasketBar />
    </div>
  );
}
