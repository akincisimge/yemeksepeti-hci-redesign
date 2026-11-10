
import type { Product } from "../../types/domain";

export type Sort =
  | "default"
  | "price-asc"
  | "price-desc"
  | "name"
  | "name-desc";

export type Filters = {
  search: string;
  category: string;
  brand: string;
  maxPrice: string;
  tag: string;
  sort: Sort;
  basis: string;
  pack: string;
};

export const emptyFilters: Filters = {
  search: "",
  category: "all",
  brand: "all",
  maxPrice: "",
  tag: "all",
  sort: "default",
  basis: "all",
  pack: "all",
};

export const normalize = (text: string) =>
  text
    .toLocaleLowerCase("tr")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i")
    .trim();

export function filterProducts(products: Product[], filters: Filters) {
  const terms = normalize(filters.search).split(/\s+/).filter(Boolean);

  return products
    .filter((p) => {
      const text = normalize(
        [p.name, p.description, p.brand, p.category].join(" ")
      );

      return (
        terms.every((term) => text.includes(term)) &&
        (filters.category === "all" || p.category === filters.category)
      );
    })
    .sort((a, b) => {
      if (filters.sort === "price-asc") return a.price - b.price;
      if (filters.sort === "price-desc") return b.price - a.price;
      if (filters.sort === "name") return a.name.localeCompare(b.name, "tr");
      if (filters.sort === "name-desc") return b.name.localeCompare(a.name, "tr");

      // Önerilen: marketData.ts içindeki ürün sırasını korur.
      return 0;
    });
}


