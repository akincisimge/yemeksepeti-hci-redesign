import { muglaRegions } from "./muglaRegions.ts";

/**
 * Turkey 81 provinces -> real districts (ilçe) -> real neighborhoods (mahalle).
 * Source: `turkey-neighbourhoods@4.0.3` (https://github.com/muratgozel/turkey-neighbourhoods),
 * derived from PTT official postal directory (`https://postakodu.ptt.gov.tr/Dosyalar/pk_list.zip`).
 * License: MIT License (Copyright (c) 2020 Murat Gözel).
 */
export type TurkeyRegionsMap = Record<string, Record<string, string[]>>;

const SYNC_FALLBACK_REGIONS: TurkeyRegionsMap = {
  Muğla: muglaRegions,
};

let cachedRegions: TurkeyRegionsMap = { ...SYNC_FALLBACK_REGIONS };
let fullyLoaded = false;
let pendingPromise: Promise<TurkeyRegionsMap> | null = null;

/** Return currently available region map synchronously (includes full Muğla immediately). */
export function getCachedTurkeyRegions(): TurkeyRegionsMap {
  return cachedRegions;
}

/** Whether all 81 provinces have finished loading into cache. */
export function areAllRegionsLoaded(): boolean {
  return fullyLoaded;
}

/** Lazy-load all 81 provinces, 973 districts, and real neighborhoods via standard ES module. */
export function loadTurkeyRegions(): Promise<TurkeyRegionsMap> {
  if (fullyLoaded) return Promise.resolve(cachedRegions);
  if (!pendingPromise) {
    pendingPromise = import("./turkeyRegionsData.js")
      .then((mod) => {
        const loaded = (mod.default ?? mod) as TurkeyRegionsMap;
        cachedRegions = { ...loaded, ...SYNC_FALLBACK_REGIONS };
        fullyLoaded = true;
        return cachedRegions;
      })
      .catch(() => cachedRegions);
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
