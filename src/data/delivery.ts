import type { Carts, Service } from "../types/domain";

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
  "food-crispy-co": locations.map(({ id }) => id),
  "food-meydan-pizza": locations.map(({ id }) => id),
  "food-gultepe-doner": locations.map(({ id }) => id),
  "food-mahalle-mutfagi": locations.map(({ id }) => id),
  "food-citir-antep": locations.map(({ id }) => id),
  "food-tavuk-kralligi": locations.map(({ id }) => id),
  "food-sekerli-hayal": locations.map(({ id }) => id),
  "food-ikili-mutfak": locations.map(({ id }) => id),
  "food-burger-house-48": locations.map(({ id }) => id),
  "food-napoli-pizza": locations.map(({ id }) => id),
  "food-usta-yaprak-doner": locations.map(({ id }) => id),
  "food-anne-eli": locations.map(({ id }) => id),
  "food-ocakbasi-urfa": locations.map(({ id }) => id),
  "food-kore-tavuk": locations.map(({ id }) => id),
  "food-tatlici-kosk": locations.map(({ id }) => id),
  "food-antep-baklava": locations.map(({ id }) => id),
  "ymarket-1": ["kotekli", "mentese-merkez"],
  "carrefour-1": ["mentese-merkez", "bodrum-merkez"],
  "bim-1": ["kotekli", "bodrum-merkez"],
};

export type AffectedCartInfo = {
  service: Service;
  serviceLabel: string;
  storeName: string;
  itemCount: number;
};

export type LocationChangePlan = {
  target: DeliveryLocation;
  affected: AffectedCartInfo[];
  preserved: AffectedCartInfo[];
};

export type ProvinceDemoCoverage = {
  supported: boolean;
  hasFood: boolean;
  hasMarket: boolean;
};

export function deliversTo(storeId: string, locationId: string | undefined): boolean {
  return !!locationId && !!coverage[storeId]?.includes(locationId);
}

export const locationLabel = (location: DeliveryLocation) =>
  `${location.neighborhood}, ${location.district}, ${location.city}`;

export function getProvinceDemoCoverage(city: string): ProvinceDemoCoverage {
  const cityLocations = locations.filter((location) => location.city === city);
  if (cityLocations.length === 0) {
    return { supported: false, hasFood: false, hasMarket: false };
  }
  const hasFood = cityLocations.some((location) =>
    Object.entries(coverage).some(([storeId, ids]) => storeId.startsWith("food-") && ids.includes(location.id))
  );
  const hasMarket = cityLocations.some((location) =>
    ["ymarket-1", "carrefour-1", "bim-1"].some((storeId) => coverage[storeId]?.includes(location.id))
  );
  return { supported: true, hasFood, hasMarket };
}

export function analyzeLocationChange(carts: Carts, targetLocationId: string): LocationChangePlan | null {
  const target = locations.find((item) => item.id === targetLocationId);
  if (!target) return null;

  const affected: AffectedCartInfo[] = [];
  const preserved: AffectedCartInfo[] = [];

  for (const service of ["food", "market"] as const) {
    const lines = carts[service];
    if (lines.length === 0) continue;

    const info: AffectedCartInfo = {
      service,
      serviceLabel: service === "food" ? "Yemek" : "Market",
      storeName: lines[0].product.storeName,
      itemCount: lines.reduce((sum, line) => sum + line.quantity, 0),
    };

    const hasUnavailable = lines.some((line) => !deliversTo(line.product.storeId, target.id));
    if (hasUnavailable) affected.push(info);
    else preserved.push(info);
  }

  return { target, affected, preserved };
}

export function formatLocationChangeMessage(plan: LocationChangePlan): string {
  const label = locationLabel(plan.target);
  if (plan.affected.length === 0) {
    return `Teslimat konumun ${label} olarak güncellendi.`;
  }

  const affectedText = plan.affected
    .map((item) => `${item.serviceLabel} sepeti (${item.storeName})`)
    .join(" ve ");
  const preservedText = plan.preserved.length
    ? ` ${plan.preserved.map((item) => `${item.serviceLabel} sepetin`).join(" ve ")} korundu.`
    : "";

  return `Teslimat konumun ${label} olarak güncellendi. Yeni konuma teslimat yapmadığı için ${affectedText} temizlendi.${preservedText}`;
}
