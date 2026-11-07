import { turkeyProvinces } from "./turkey.ts";
export type DeliveryLocation = { id: string; city: string; district: string; neighborhood: string; source?: "gps" | "manual" };
// Preserve saved selections and the original region-specific demo scenarios.
export const locations: DeliveryLocation[] = [
  { id: "kotekli", city: "Muğla", district: "Menteşe", neighborhood: "Kötekli" },
  { id: "mentese-merkez", city: "Muğla", district: "Menteşe", neighborhood: "Orhaniye" },
  { id: "bodrum-merkez", city: "Muğla", district: "Bodrum", neighborhood: "Çarşı" },
  { id: "adana-merkez", city: "Adana", district: "Seyhan", neighborhood: "Reşatbey" },
];
export const normalizePlace = (value: string) => value.toLocaleLowerCase("tr").normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "").replace(/ı/g, "i").replace(/\s+(mahallesi|mah\.?|ili|ilcesi|province|district)$/i, "").trim();
export function makeLocation(city: string, district: string, neighborhood: string, source: "gps" | "manual" = "manual"): DeliveryLocation | null {
  const province = turkeyProvinces.find(item => normalizePlace(item.name) === normalizePlace(city));
  const canonicalDistrict = province?.districts.find(item => normalizePlace(item) === normalizePlace(district));
  const cleaned = neighborhood.trim().replace(/\s+/g, " ");
  if (!province || !canonicalDistrict || cleaned.length < 2 || cleaned.length > 100 || /[\u0000-\u001f<>]/.test(cleaned)) return null;
  const legacy = locations.find(item => item.city === province.name && item.district === canonicalDistrict && normalizePlace(item.neighborhood) === normalizePlace(cleaned));
  return { id: legacy?.id ?? `tr:${province.id}:${encodeURIComponent(canonicalDistrict)}:${encodeURIComponent(normalizePlace(cleaned))}`, city: province.name, district: canonicalDistrict, neighborhood: cleaned, source };
}
export function restoreLocation(value: unknown): DeliveryLocation | null {
  if (typeof value === "string") return locations.find(item => item.id === value) ?? null;
  if (!value || typeof value !== "object") return null;
  const item = value as Partial<DeliveryLocation>;
  if (typeof item.city !== "string" || typeof item.district !== "string" || typeof item.neighborhood !== "string") return null;
  return makeLocation(item.city, item.district, item.neighborhood, item.source === "gps" ? "gps" : "manual");
}
const coverage: Record<string, readonly string[]> = {
  "f-1": ["kotekli", "mentese-merkez"], "f-2": ["mentese-merkez", "bodrum-merkez"],
  "ymarket-1": ["kotekli", "mentese-merkez"], "carrefour-1": ["mentese-merkez", "bodrum-merkez"], "bim-1": ["kotekli", "bodrum-merkez"],
};
export function deliversTo(storeId: string, value: DeliveryLocation | string | undefined | null): boolean {
  const location = restoreLocation(value);
  if (!location || !coverage[storeId]) return false;
  if (["kotekli", "mentese-merkez", "bodrum-merkez"].includes(location.id)) return coverage[storeId].includes(location.id);
  // Other valid Turkish addresses can browse the demo network, not real merchant delivery coverage.
  return true;
}
export const locationLabel = (location: DeliveryLocation) => `${location.neighborhood}, ${location.district}, ${location.city}`;
