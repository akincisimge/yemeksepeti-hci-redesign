

type MarketSearchFilterProps = {
  search: string;
  onSearchChange: (value: string) => void;
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
};

export default function MarketSearchFilter({
  search,
  onSearchChange,
  categories,
  selectedCategory,
  onCategoryChange,
}: MarketSearchFilterProps) {
  const hasFilters = search !== "" || selectedCategory !== "all";

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">

        {/* Search */}
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400">
            🔍
          </span>

          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Market ürünlerinde ara..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#D90049] focus:bg-white focus:ring-4 focus:ring-pink-100"
            aria-label="Market ürünlerinde ara"
          />
        </div>

        {/* Category */}
        <div className="relative md:w-64">
          <select
            value={selectedCategory}
            onChange={(event) => onCategoryChange(event.target.value)}
            className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 pr-10 text-sm font-medium text-slate-700 outline-none transition focus:border-[#D90049] focus:bg-white focus:ring-4 focus:ring-pink-100"
            aria-label="Ürün kategorisi"
          >
            <option value="all">🛍️ Tüm kategoriler</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">
            ▼
          </span>
        </div>

        {/* Clear Filters */}
        {hasFilters && (
          <button
            onClick={() => {
              onSearchChange("");
              onCategoryChange("all");
            }}
            className="rounded-xl px-4 py-3 text-sm font-semibold text-[#D90049] transition hover:bg-pink-50"
          >
            Temizle ✕
          </button>
        )}
      </div>

      {/* Filter Info */}
      <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
        <span className="h-1.5 w-1.5 rounded-full bg-[#D90049]" />
        Ürünleri isim veya kategoriye göre filtreleyebilirsin.
      </div>
    </div>
  );
}
