import type { FoodSort } from "../data/foodData";

export type QuickFilters = {
  freeDelivery: boolean;
  fastDelivery: boolean;
  discount: boolean;
};

type RestaurantFiltersProps = {
  minimumRating: number;
  sort: FoodSort;
  quickFilters: QuickFilters;
  hasActiveFilters: boolean;
  onMinimumRatingChange: (value: number) => void;
  onSortChange: (value: FoodSort) => void;
  onQuickFilterChange: (filter: keyof QuickFilters, value: boolean) => void;
  onClear: () => void;
};

const sortOptions: { value: FoodSort; label: string }[] = [
  { value: "recommended", label: "Önerilen" },
  { value: "delivery", label: "Teslimat Süresi" },
  { value: "rating", label: "Restoran Puanı" },
];

const ratingOptions = [
  { value: 0, label: "Tüm puanlar" },
  { value: 4.5, label: "4,5 ve üzeri" },
  { value: 4, label: "4,0 ve üzeri" },
];

function FilterContent({
  minimumRating,
  sort,
  quickFilters,
  hasActiveFilters,
  onMinimumRatingChange,
  onSortChange,
  onQuickFilterChange,
  onClear,
}: RestaurantFiltersProps) {
  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-bold text-[#0F172A]">Filtrele</h2>
        {hasActiveFilters && (
          <button type="button" onClick={onClear} className="min-h-11 rounded-xl px-2 py-2 text-sm font-semibold text-[#D90049] underline underline-offset-2 hover:text-[#B6003C]">
            Filtreleri Temizle
          </button>
        )}
      </div>

      <fieldset>
        <legend className="mb-3 font-semibold text-[#0F172A]">Sıralama</legend>
        <div className="space-y-3">
          {sortOptions.map((option) => (
            <label key={option.value} className="flex min-h-11 cursor-pointer items-center gap-3 text-sm text-[#0F172A]">
              <input
                type="radio"
                name="restaurant-sort"
                value={option.value}
                checked={sort === option.value}
                onChange={() => onSortChange(option.value)}
                className="h-4 w-4 accent-[#D90049]"
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 font-semibold text-[#0F172A]">Hızlı Filtreler</legend>
        <div className="space-y-3">
          {([
            ["freeDelivery", "Ücretsiz Teslimat"],
            ["fastDelivery", "Hızlı Teslimat"],
            ["discount", "İndirimli Restoranlar"],
          ] as const).map(([key, label]) => (
            <label key={key} className="flex min-h-11 cursor-pointer items-center gap-3 text-sm leading-5 text-[#0F172A]">
              <input
                type="checkbox"
                checked={quickFilters[key]}
                onChange={(event) => onQuickFilterChange(key, event.target.checked)}
                className="h-4 w-4 rounded accent-[#D90049]"
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 font-semibold text-[#0F172A]">Minimum Puan</legend>
        <div className="space-y-3">
          {ratingOptions.map((option) => (
            <label key={option.value} className="flex min-h-11 cursor-pointer items-center gap-3 text-sm text-[#0F172A]">
              <input
                type="radio"
                name="minimum-rating"
                value={option.value}
                checked={minimumRating === option.value}
                onChange={() => onMinimumRatingChange(option.value)}
                className="h-4 w-4 accent-[#D90049]"
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}

export default function RestaurantFilters(props: RestaurantFiltersProps) {
  return (
    <>
      <details className="rounded-2xl border border-[#CBD5E1] bg-white lg:hidden">
        <summary className="flex min-h-12 cursor-pointer items-center justify-between px-4 font-semibold text-[#0F172A]">
          Filtrele
          {props.hasActiveFilters && <span className="text-sm font-normal text-[#D90049]">Filtreler etkin</span>}
        </summary>
        <FilterContent {...props} />
      </details>
      <aside className="sticky top-24 hidden h-fit rounded-2xl border border-[#CBD5E1] bg-white lg:block">
        <FilterContent {...props} />
      </aside>
    </>
  );
}
