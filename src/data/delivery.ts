// Fictional delivery coverage for the HCI demo; no live merchant availability.
export const locations = [
  { id: "kotekli", city: "Muğla", district: "Menteşe", neighborhood: "Kötekli" },
  { id: "mentese-merkez", city: "Muğla", district: "Menteşe", neighborhood: "Orhaniye" },
  { id: "bodrum-merkez", city: "Muğla", district: "Bodrum", neighborhood: "Çarşı" },
  { id: "adana-merkez", city: "Adana", district: "Seyhan", neighborhood: "Reşatbey" },
] as const;
export type DeliveryLocation = typeof locations[number];
const coverage: Record<string, readonly string[]> = {
  "f-1": ["kotekli", "mentese-merkez"],
  "f-2": ["mentese-merkez", "bodrum-merkez"],
  "ymarket-1": ["kotekli", "mentese-merkez"],
  "carrefour-1": ["mentese-merkez", "bodrum-merkez"],
  "bim-1": ["kotekli", "bodrum-merkez"],
};
export function deliversTo(storeId: string, locationId: string | undefined): boolean {
  return !!locationId && !!coverage[storeId]?.includes(locationId);
}
export const locationLabel = (location: DeliveryLocation) =>
  `${location.neighborhood}, ${location.district}, ${location.city}`;
