import { turkeyProvinces } from "../data/turkey.ts";
import { normalizePlace } from "../data/delivery.ts";
export type AddressDraft = { city: string; district: string; neighborhood: string };
const text = (value: unknown) => typeof value === "string" ? value.trim().slice(0, 100) : "";
export function addressFromResponse(value: unknown): AddressDraft {
  if (!value || typeof value !== "object") throw new Error("Adres bilgisi alınamadı. Adresini elle seçebilirsin.");
  const data = value as Record<string, unknown>;
  if (text(data.countryCode).toUpperCase() !== "TR") throw new Error("Bulunan konum Türkiye dışında. Türkiye'deki bir teslimat adresini elle seçebilirsin.");
  const info = data.localityInfo && typeof data.localityInfo === "object" ? data.localityInfo as Record<string, unknown> : {};
  const administrative = Array.isArray(info.administrative) ? info.administrative.filter((x): x is Record<string, unknown> => !!x && typeof x === "object") : [];
  const names = [data.principalSubdivision, ...administrative.map(x => x.name), data.city, data.locality].map(text).filter(Boolean);
  const province = turkeyProvinces.find(p => names.some(name => normalizePlace(p.name) === normalizePlace(name)));
  if (!province) throw new Error("İl bilgisi doğrulanamadı. Adresini elle seçebilirsin.");
  const district = province.districts.find(d => names.some(name => normalizePlace(d) === normalizePlace(name))) ?? "";
  const locality = text(data.locality);
  const granular = administrative.filter(x => Number(x.adminLevel) > 6).map(x => text(x.name)).filter(Boolean).at(-1);
  const neighborhood = [granular, locality].find(name => name && normalizePlace(name) !== normalizePlace(province.name) && normalizePlace(name) !== normalizePlace(district)) ?? "";
  return { city: province.name, district, neighborhood };
}
export function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!window.isSecureContext || !navigator.geolocation) { reject(new Error("Bu tarayıcıda konum alınamıyor. Adresini elle seçebilir veya HTTPS bağlantısını kullanabilirsin.")); return; }
    navigator.geolocation.getCurrentPosition(resolve, error => reject(new Error(
      error.code === 1 ? "Konum izni verilmedi. Aşağıdan adresini elle seçebilirsin." : error.code === 3 ? "Konum bulma zaman aşımına uğradı. Tekrar deneyebilir veya adresini elle seçebilirsin." : "Konumuna ulaşılamadı. Adresini elle seçebilirsin."
    )), { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 });
  });
}
export async function reverseCurrentPosition(position: GeolocationPosition, signal: AbortSignal): Promise<AddressDraft> {
  // Free client endpoint: only call from the browser with freshly consented device coordinates.
  // Never use stored/third-party coordinates, server-side requests or IP fallback.
  const query = new URLSearchParams({ latitude: String(position.coords.latitude), longitude: String(position.coords.longitude), localityLanguage: "tr" });
  const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?${query}`, { signal, credentials: "omit" });
  if (!response.ok) throw new Error("Konum bulundu ancak adres bilgisi alınamadı. İl, ilçe ve mahalleni elle tamamlayabilirsin.");
  return addressFromResponse(await response.json());
}
