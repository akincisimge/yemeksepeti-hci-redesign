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
  quickFilterCounts: Record<keyof QuickFilters, number>;
  ratingCounts: Record<number, number>;
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
  { value: 4, label: "4,0 ve üzeri" },
  { value: 4.5, label: "4,5 ve üzeri" },
  { value: 4.8, label: "4,8 ve üzeri" },
];

const rowClass = (selected: boolean) => selected
  ? "flex min-h-12 w-full items-center gap-3 rounded-xl border-2 border-[#D90049] bg-[#FFF0F5] px-3 py-2 text-left text-sm font-bold text-[#D90049]"
  : "flex min-h-12 w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-sm text-slate-700 hover:border-slate-300 hover:bg-slate-50";

function SelectionIcon({ selected, square = false }: { selected: boolean; square?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`flex h-5 w-5 shrink-0 items-center justify-center border-2 text-xs ${
        square ? "rounded" : "rounded-full"
      } ${selected ? "border-[#D90049] bg-[#D90049] text-white" : "border-slate-300 bg-white"}`}
    >
      {selected ? "✓" : null}
    </span>
  );
}

function FilterContent({
  minimumRating,
  sort,
  quickFilters,
  quickFilterCounts,
  ratingCounts,
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
        <div className="space-y-2">
          {sortOptions.map((option) => {
            const selected = sort === option.value;
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={selected}
                onClick={() => onSortChange(option.value)}
                className={rowClass(selected)}
              >
                <SelectionIcon selected={selected} />
                <span className="flex-1">{option.label}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 font-semibold text-[#0F172A]">Hızlı Filtreler</legend>
        <div className="space-y-2">
          {([
            ["freeDelivery", "Ücretsiz Teslimat"],
            ["fastDelivery", "Hızlı Teslimat"],
            ["discount", "İndirimli Restoranlar"],
          ] as const).map(([key, label]) => {
            const selected = quickFilters[key];
            return (
              <button
                key={key}
                type="button"
                aria-pressed={selected}
                onClick={() => onQuickFilterChange(key, !selected)}
                className={rowClass(selected)}
              >
                <SelectionIcon selected={selected} square />
                <span className="flex-1">{label}</span>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${selected ? "bg-white/80 text-[#9F1239]" : "bg-slate-100 text-slate-600"}`}>
                  ({quickFilterCounts[key]})
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 font-semibold text-[#0F172A]">Minimum Puan</legend>
        <div className="space-y-2">
          {ratingOptions.map((option) => {
            const selected = minimumRating === option.value;
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={selected}
                onClick={() => onMinimumRatingChange(selected && option.value !== 0 ? 0 : option.value)}
                className={rowClass(selected)}
              >
                <SelectionIcon selected={selected} />
                <span className="flex-1">{option.label}</span>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${selected ? "bg-white/80 text-[#9F1239]" : "bg-slate-100 text-slate-600"}`}>
                  ({ratingCounts[option.value]})
                </span>
              </button>
            );
          })}
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
