/**
 * Turkey 81 provinces -> real districts (ilçe) -> real neighborhoods (mahalle).
 * Source: `turkey-neighbourhoods@4.0.3` (https://github.com/muratgozel/turkey-neighbourhoods),
 * derived from PTT official postal directory (`https://postakodu.ptt.gov.tr/Dosyalar/pk_list.zip`).
 * License: MIT License (Copyright (c) 2020 Murat Gözel).
 */
export type TurkeyRegionsMap = Record<string, Record<string, string[]>>;

let cachedRegions: TurkeyRegionsMap | null = null;
let pendingPromise: Promise<TurkeyRegionsMap> | null = null;

/** Return already-loaded region dataset synchronously if cached. */
export function getCachedTurkeyRegions(): TurkeyRegionsMap | null {
  return cachedRegions;
}

/** Lazy-load and cache all 81 Turkish provinces, 973 districts, and ~73k neighborhoods. */
export function loadTurkeyRegions(): Promise<TurkeyRegionsMap> {
  if (cachedRegions) return Promise.resolve(cachedRegions);
  if (!pendingPromise) {
    pendingPromise = import("./turkeyRegions.json", { with: { type: "json" } }).then((mod) => {
      cachedRegions = (mod.default ?? mod) as TurkeyRegionsMap;
      return cachedRegions;
    });
  }
  return pendingPromise;
}

/** List districts for a province in Turkish alphabetical order. */
export function getDistrictsForCity(regions: TurkeyRegionsMap | null, city: string): string[] {
  if (!regions || !city) return [];
  return Object.keys(regions[city] ?? {});
}

/** List neighborhoods for a province and district in Turkish alphabetical order. */
export function getNeighborhoodsForDistrict(
  regions: TurkeyRegionsMap | null,
  city: string,
  district: string,
): string[] {
  if (!regions || !city || !district) return [];
  return regions[city]?.[district] ?? [];
}
