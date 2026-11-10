import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { filterProvinces } from "../data/provinces";
import {
  createCustomLocation,
  locationLabel,
  locations,
  type LocationChangePlan,
} from "../data/delivery";
import { useDelivery } from "../state/DeliveryContext";

const QUICK_CITIES = ["İstanbul", "Ankara", "İzmir", "Muğla", "Adana", "Antalya"] as const;

type LocationPickerProps = {
  onDone?: () => void;
  variant?: "modal" | "page";
};

export default function LocationPicker({ onDone, variant = "page" }: LocationPickerProps) {
  const { delivery, previewLocationChange, selectLocation } = useDelivery();
  const [city, setCity] = useState<string>(delivery?.city ?? "");
  const [district, setDistrict] = useState<string>(delivery?.district ?? "");
  const [neighborhood, setNeighborhood] = useState<string>(delivery?.neighborhood ?? "");
  const [id, setId] = useState<string>(delivery?.id ?? "");
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [pendingPlan, setPendingPlan] = useState<LocationChangePlan | null>(null);

  const cancelButtonRef = useRef<HTMLButtonElement | null>(null);
  const submitButtonRef = useRef<HTMLButtonElement | null>(null);

  const matchingCities = filterProvinces(query);
  const cityLocations = locations.filter((location) => location.city === city);
  const hasPresetLocations = cityLocations.length > 0;
  const districtOptions = [...new Set(cityLocations.map((location) => location.district))];
  const neighborhoodOptions = cityLocations.filter((location) => location.district === district);
  const trimmedQuery = query.trim();

  const resolvedTargetId = hasPresetLocations
    ? id
    : createCustomLocation(city, district, neighborhood)?.id ?? "";
  const canSubmit = Boolean(city && resolvedTargetId);

  const selectedPresetLocation = hasPresetLocations
    ? locations.find((location) => location.id === id) ?? null
    : null;
  const targetPreviewLabel = hasPresetLocations
    ? selectedPresetLocation
      ? locationLabel(selectedPresetLocation)
      : null
    : city && district.trim() && neighborhood.trim()
      ? `${neighborhood.trim()}, ${district.trim()}, ${city}`
      : null;

  useEffect(() => {
    if (pendingPlan) {
      cancelButtonRef.current?.focus();
    }
  }, [pendingPlan]);

  function changeCity(value: string) {
    setCity(value);
    const hasPresets = locations.some((location) => location.city === value);
    if (!value || hasPresets) {
      setDistrict("");
      setNeighborhood("");
      setId("");
    } else {
      setDistrict("Merkez");
      setNeighborhood("Merkez Mahallesi");
      setId("");
    }
    setNotice("");
    setQuery("");
    setPendingPlan(null);
  }

  function changeDistrict(value: string) {
    setDistrict(value);
    setId("");
    setNotice("");
    setPendingPlan(null);
  }

  function handleSearchKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") return;
    event.preventDefault();
    if (matchingCities.length === 1) {
      changeCity(matchingCities[0]);
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!resolvedTargetId) return;

    const plan = previewLocationChange(resolvedTargetId);
    if (!plan) return;

    if (plan.affected.length > 0) {
      setPendingPlan(plan);
      setNotice("");
      return;
    }

    if (selectLocation(resolvedTargetId, { confirmed: true })) {
      setNotice("");
      onDone?.();
    }
  }

  function cancelPendingChange() {
    setPendingPlan(null);
    const preservedLocation = delivery ? `${locationLabel(delivery)} adresi ve ` : "";
    setNotice(`Konum değişikliği iptal edildi. Mevcut ${preservedLocation}sepetlerin korundu.`);
    window.requestAnimationFrame(() => submitButtonRef.current?.focus());
  }

  function confirmPendingChange() {
    if (!pendingPlan) return;
    if (selectLocation(pendingPlan.target.id, { confirmed: true })) {
      setPendingPlan(null);
      setNotice("");
      onDone?.();
    }
  }

  const formClasses =
    variant === "modal"
      ? "space-y-5"
      : "mx-auto max-w-xl space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8";

  return (
    <form onSubmit={submit} className={formClasses}>
      {variant === "page" && (
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Teslimat Adresini Seç</h2>
          <p className="mt-1.5 text-sm text-slate-600">Önce şehrini seç, ardından ilçe ve mahalleni belirle.</p>
        </div>
      )}

      <fieldset className="min-w-0 space-y-3.5 rounded-2xl border border-slate-200 bg-slate-50/75 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <legend className="flex items-center gap-2 text-base font-bold text-slate-900">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
              1
            </span>
            <span>Şehir Seç</span>
          </legend>
          {city ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
              ✓ {city}
            </span>
          ) : (
            <span className="text-xs font-medium text-slate-600">81 il</span>
          )}
        </div>

        <div className="flex flex-wrap gap-2" aria-label="Popüler şehirler">
          {QUICK_CITIES.map((name) => {
            const active = city === name;
            return (
              <button
                key={name}
                type="button"
                aria-pressed={active}
                onClick={() => changeCity(name)}
                className={
                  active
                    ? "min-h-11 rounded-xl border-2 border-brand bg-[#FFF1F6] px-3.5 py-2 text-sm font-bold text-brand-dark shadow-xs"
                    : "min-h-11 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-800 transition hover:border-brand hover:bg-[#FFF1F6]"
                }
              >
                {name}
              </button>
            );
          })}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block min-w-0">
            <span className="mb-1.5 block text-xs font-semibold text-slate-700">Yazarak ara</span>
            <div className="relative">
              <svg
                aria-hidden="true"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" strokeLinecap="round" />
              </svg>
              <input
                type="search"
                data-autofocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Ör. Bursa, Trabzon..."
                autoComplete="off"
                className={trimmedQuery ? "field pl-10 pr-16 text-sm" : "field pl-10 pr-3 text-sm"}
                aria-describedby="city-results"
              />
              {trimmedQuery && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-brand"
                >
                  Temizle
                </button>
              )}
            </div>
          </label>

          <label className="block min-w-0">
            <span className="mb-1.5 block text-xs font-semibold text-slate-700">Veya tüm illerden seç</span>
            <select
              required
              className="location-select text-sm"
              value={city}
              onChange={(event) => changeCity(event.target.value)}
            >
              <option value="">İl seçin (A–Z)</option>
              {city && !matchingCities.includes(city) && <option value={city}>{city}</option>}
              {matchingCities.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>
        </div>

        {trimmedQuery && (
          <div className="space-y-2">
            {matchingCities.length > 0 && matchingCities.length <= 6 && (
              <div className="flex flex-wrap gap-2" aria-label="Eşleşen il hızlı seçimleri">
                {matchingCities.map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => changeCity(name)}
                    aria-pressed={city === name}
                    className={
                      city === name
                        ? "min-h-11 rounded-xl border-2 border-brand bg-[#FFF1F6] px-3.5 py-2 text-sm font-bold text-brand-dark"
                        : "min-h-11 rounded-xl border border-brand/40 bg-white px-3.5 py-2 text-sm font-semibold text-slate-900 hover:border-brand hover:bg-[#FFF1F6]"
                    }
                  >
                    {name} seç
                  </button>
                ))}
              </div>
            )}
            <p id="city-results" role="status" className="text-xs font-medium text-slate-700">
              {matchingCities.length
                ? `${matchingCities.length} il bulundu.`
                : "Bu isimde il bulunamadı. Yazımı kontrol edip tekrar deneyin."}
            </p>
          </div>
        )}
        {!trimmedQuery && <span id="city-results" className="sr-only">81 il listeleniyor.</span>}
      </fieldset>

      <div className="grid gap-3 sm:grid-cols-2">
        {hasPresetLocations || !city ? (
          <>
            <label className="block">
              <span className="mb-1.5 flex items-center gap-2 text-base font-bold text-slate-900">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-800">
                  2
                </span>
                <span>İlçe</span>
              </span>
              <select
                required
                disabled={!city}
                className="location-select"
                value={district}
                onChange={(event) => changeDistrict(event.target.value)}
              >
                <option value="">{city ? "İlçe seçin" : "Önce şehir seçin"}</option>
                {districtOptions.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1.5 flex items-center gap-2 text-base font-bold text-slate-900">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-800">
                  3
                </span>
                <span>Mahalle</span>
              </span>
              <select
                required
                disabled={!district}
                className="location-select"
                value={id}
                onChange={(event) => {
                  setId(event.target.value);
                  setNotice("");
                  setPendingPlan(null);
                }}
              >
                <option value="">{district ? "Mahalle seçin" : "Önce ilçe seçin"}</option>
                {neighborhoodOptions.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.neighborhood}
                  </option>
                ))}
              </select>
            </label>
          </>
        ) : (
          <>
            <label className="block">
              <span className="mb-1.5 flex items-center gap-2 text-base font-bold text-slate-900">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-800">
                  2
                </span>
                <span>İlçe</span>
              </span>
              <input
                type="text"
                required
                className="field font-medium"
                value={district}
                onChange={(event) => {
                  setDistrict(event.target.value);
                  setNotice("");
                  setPendingPlan(null);
                }}
                placeholder="ör. Kadıköy"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 flex items-center gap-2 text-base font-bold text-slate-900">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-800">
                  3
                </span>
                <span>Mahalle</span>
              </span>
              <input
                type="text"
                required
                className="field font-medium"
                value={neighborhood}
                onChange={(event) => {
                  setNeighborhood(event.target.value);
                  setNotice("");
                  setPendingPlan(null);
                }}
                placeholder="ör. Caferağa"
              />
            </label>
          </>
        )}
      </div>

      {pendingPlan && (
        <section
          role="alertdialog"
          aria-labelledby="location-cart-confirm-title"
          aria-describedby="location-cart-confirm-desc"
          className="space-y-4 rounded-2xl border-2 border-[#D90049] bg-[#FFF1F6] p-4 text-sm leading-6 text-slate-900"
        >
          <div>
            <h3 id="location-cart-confirm-title" className="text-base font-bold text-slate-900">
              Adres değişikliği sepetini etkileyecek
            </h3>
            <p id="location-cart-confirm-desc" className="mt-1 text-slate-800">
              Yeni hedef konum: <strong>{locationLabel(pendingPlan.target)}</strong>. Onaylarsan aşağıda belirtilen uyumsuz sepet temizlenecek.
            </p>
          </div>

          <ul className="space-y-2">
            {pendingPlan.affected.map((item) => (
              <li key={item.service} className="rounded-xl border border-rose-200 bg-white p-3 text-slate-800">
                <strong className="text-brand-dark">
                  {item.serviceLabel} sepeti temizlenecek ({item.storeName} · {item.itemCount} ürün)
                </strong>
                <p className="mt-1 text-xs leading-5 text-slate-600">
                  {item.storeName}, seçtiğin {locationLabel(pendingPlan.target)} konumuna teslimat yapmıyor.
                </p>
              </li>
            ))}
          </ul>

          {pendingPlan.preserved.length > 0 && (
            <p className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-medium leading-5 text-emerald-900">
              Korunacak sepet:{" "}
              {pendingPlan.preserved
                .map((item) => `${item.serviceLabel} (${item.storeName} · ${item.itemCount} ürün)`)
                .join(" ve ")}
              .
            </p>
          )}

          <div className="flex flex-col-reverse gap-2 sm:flex-row">
            <button
              ref={cancelButtonRef}
              type="button"
              onClick={cancelPendingChange}
              className="min-h-11 flex-1 rounded-xl border border-slate-400 bg-white px-4 py-2 font-semibold text-slate-900 hover:border-brand"
            >
              Vazgeç — Adresi ve sepeti koru
            </button>
            <button
              type="button"
              onClick={confirmPendingChange}
              className="btn-primary flex-1"
            >
              Onayla ve konumu değiştir
            </button>
          </div>
        </section>
      )}

      {!pendingPlan && (
        <div className="space-y-3 pt-1">
          {targetPreviewLabel && (
            <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-950">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white" aria-hidden="true">
                ✓
              </span>
              <p className="min-w-0 leading-snug">
                <span className="block text-xs font-medium text-emerald-800">Seçilen teslimat adresi</span>
                <strong className="text-base font-bold text-slate-900">{targetPreviewLabel}</strong>
              </p>
            </div>
          )}

          <button ref={submitButtonRef} disabled={!canSubmit} className="btn-primary min-h-13 w-full text-base" type="submit">
            {delivery ? "Bu Adresi Kaydet" : "Adresi Onayla ve Devam Et"}
          </button>

          {!canSubmit && (
            <p className="text-center text-sm font-medium text-slate-600">
              Devam etmek için yukarıdan il, ilçe ve mahalle seçin.
            </p>
          )}
        </div>
      )}

      {notice && (
        <p role="status" aria-live="polite" className="rounded-xl border border-slate-300 bg-slate-50 p-3 text-sm font-medium text-slate-800">
          {notice}
        </p>
      )}
    </form>
  );
}
