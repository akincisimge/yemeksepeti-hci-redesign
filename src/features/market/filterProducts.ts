import type { Product } from "../../types/domain";
export type Sort = "default" | "price-asc" | "price-desc" | "name" | "unit";
export type Filters = { search: string; category: string; brand: string; maxPrice: string; tag: string; sort: Sort; basis: string; pack: string };
export const emptyFilters: Filters = { search: "", category: "all", brand: "all", maxPrice: "", tag: "all", sort: "default", basis: "all", pack: "all" };
export const normalize = (text: string) => text.toLocaleLowerCase("tr").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ı/g, "i").trim();
export function filterProducts(products: Product[], filters: Filters) {
  const terms = normalize(filters.search).split(/\s+/).filter(Boolean);
  return products.filter(p => {
    const text = normalize([p.name, p.description, p.brand, p.category].join(" "));
    return terms.every(term => text.includes(term)) &&
      (filters.category === "all" || p.category === filters.category) &&
      (filters.brand === "all" || p.brand === filters.brand) &&
      (filters.tag === "all" || p.tags?.includes(filters.tag)) &&
      (filters.basis === "all" || p.unitBasis === filters.basis) &&
      (filters.pack === "all" || p.unitLabel === filters.pack) &&
      (filters.maxPrice === "" || p.price <= Number(filters.maxPrice));
  }).sort((a, b) => {
    if (filters.sort === "price-asc") return a.price - b.price;
    if (filters.sort === "price-desc") return b.price - a.price;
    if (filters.sort === "name") return a.name.localeCompare(b.name, "tr");
    if (filters.sort === "unit") return (a.unitPrice ?? Infinity) - (b.unitPrice ?? Infinity);
    return 0;
  });
}
