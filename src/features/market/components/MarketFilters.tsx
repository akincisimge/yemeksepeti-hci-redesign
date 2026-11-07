import type { Product } from "../../../types/domain";
import type { Filters } from "../filterProducts";

type Props = { products: Product[]; filters: Filters; onChange: (patch: Partial<Filters>) => void; onCategory: (category: string) => void };
export default function MarketFilters({ products, filters, onChange, onCategory }: Props) {
  const categories = [...new Set(products.map(product => product.category))];
  const categoryProducts = products.filter(product => filters.category === "all" || product.category === filters.category);
  const brands = [...new Set(categoryProducts.flatMap(product => product.brand ? [product.brand] : []))];
  const tags = [...new Set(categoryProducts.flatMap(product => product.tags ?? []))];
  return <section aria-label="Ürün filtreleri" className="space-y-5 rounded-2xl border border-slate-200 bg-white p-4">
    <fieldset><legend className="mb-3 font-semibold">Kategoriler</legend><div className="flex flex-col gap-2">{["all", ...categories].map(category =>
      <button type="button" key={category} aria-pressed={filters.category === category} className={`${filters.category === category ? "filter-active" : "filter"} flex w-full items-center justify-between gap-2 rounded-xl text-left`} onClick={() => onCategory(category)}>
        <span>{category === "all" ? "Tüm ürünler" : category}</span><span className="shrink-0 whitespace-nowrap text-xs">({category === "all" ? products.length : products.filter(product => product.category === category).length})</span>
      </button>)}</div></fieldset>
    <label className="block"><span className="mb-2 block text-sm font-semibold">Marka</span><select className="field" value={filters.brand} onChange={event => onChange({ brand: event.target.value })}><option value="all">Tüm markalar</option>{brands.map(brand => <option key={brand}>{brand}</option>)}</select></label>
    <label className="block"><span className="mb-2 block text-sm font-semibold">En yüksek fiyat (TL)</span><input type="number" min="0" step="0.01" inputMode="decimal" className="field" placeholder="Sınır yok" value={filters.maxPrice} onChange={event => onChange({ maxPrice: event.target.value === "" ? "" : String(Math.max(0, Number(event.target.value))) })} /></label>
    {!!tags.length && <label className="block"><span className="mb-2 block text-sm font-semibold">Beslenme tercihi</span><select className="field" value={filters.tag} onChange={event => onChange({ tag: event.target.value })}><option value="all">Tüm seçenekler</option>{tags.map(tag => <option key={tag}>{tag}</option>)}</select></label>}
    <label className="block"><span className="mb-2 block text-sm font-semibold">Gramaj / paket miktarı</span><select className="field" value={filters.pack} onChange={event => onChange({ pack: event.target.value })}><option value="all">Tüm paketler</option>{[...new Set(categoryProducts.flatMap(product => product.unitLabel ? [product.unitLabel] : []))].map(pack => <option key={pack}>{pack}</option>)}</select></label>
    <label className="block"><span className="mb-2 block text-sm font-semibold">Birim karşılaştırması</span><select className="field" value={filters.basis} onChange={event => onChange({ basis: event.target.value, sort: event.target.value === "all" && filters.sort === "unit" ? "default" : filters.sort })}><option value="all">Tüm birimler</option>{[...new Set(categoryProducts.flatMap(product => product.unitBasis ? [product.unitBasis] : []))].map(basis => <option key={basis} value={basis}>{basis} başına fiyatı olanlar</option>)}</select></label>
  </section>;
}
