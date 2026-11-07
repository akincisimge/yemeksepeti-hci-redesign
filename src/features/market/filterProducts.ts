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

// Adjacent transpositions (e.g. sut -> stu) count as one typo.
export function editDistance(a: string, b: string): number {
  const rows = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => i === 0 ? j : j === 0 ? i : 0));
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) {
    rows[i][j] = Math.min(rows[i - 1][j] + 1, rows[i][j - 1] + 1, rows[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) rows[i][j] = Math.min(rows[i][j], rows[i - 2][j - 2] + 1);
  }
  return rows[a.length][b.length];
}
export function searchSuggestion(products: Product[], filters: Filters): string | null {
  const query = normalize(filters.search);
  if (query.length < 3 || query.length > 80 || filterProducts(products, filters).length) return null;
  const terms = query.split(/\s+/);
  const candidates = filterProducts(products, { ...filters, search: "" });
  const ranked = candidates.flatMap(product => {
    const words = normalize(product.name).split(/\s+/);
    let score = 0;
    for (const term of terms) {
      const distance = Math.min(...words.map(word => word.includes(term) ? 0 : editDistance(term, word)));
      const limit = term.length < 3 ? 0 : term.length < 5 ? 1 : term.length < 9 ? 2 : 3;
      if (distance > limit) return [];
      score += distance;
    }
    return score > 0 ? [{ name: product.name, score }] : [];
  });
  ranked.sort((a, b) => a.score - b.score || a.name.localeCompare(b.name, "tr"));
  return ranked[0]?.name ?? null;
}
