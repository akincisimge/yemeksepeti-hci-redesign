import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { filterProvinces } from "../data/provinces";
import {
  createCustomLocation,
  locationLabel,
  locations,
  type LocationChangePlan,
} from "../data/delivery";
import { useDelivery } from "../state/DeliveryContext";

export default function LocationPicker({ onDone }: { onDone?: () => void }) {
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

  useEffect(() => {
    if (pendingPlan) {
      cancelButtonRef.current?.focus();
    }
  }, [pendingPlan]);

  function changeCity(value: string) {
    setCity(value);
    const hasPresets = locations.some((location) => location.city === value);
    if (!value) {
      setDistrict("");
      setNeighborhood("");
      setId("");
    } else if (hasPresets) {
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

  return (
    <form onSubmit={submit} className="mx-auto max-w-xl space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div>
        <p className="font-semibold text-brand">Teslimat konumun</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900">Nereye getirelim?</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          81 il arasından ilini seç, ardından ilçe ve mahalle bilgilerini belirleyerek devam et.
        </p>
        {delivery && (
          <p className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700">
            Mevcut konum: <strong className="text-slate-900">{locationLabel(delivery)}</strong>
          </p>
        )}
      </div>

      <fieldset className="min-w-0 space-y-3">
        <legend className="mb-2 flex w-full items-center justify-between gap-2 font-semibold text-slate-900">
          <span>İl</span>
          <span className="rounded-full bg-[#FFF1F6] px-3 py-1 text-xs font-bold text-brand-dark">81 il</span>
        </legend>

        <div className="flex gap-2">
          <label className="min-w-0 flex-1">
            <span className="sr-only">İl adına göre ara</span>
            <input
              type="search"
              data-autofocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="İl ara · ör. İstanbul, Ankara, Muğla"
              autoComplete="off"
              className="field min-h-12"
              aria-describedby="city-results"
            />
          </label>
          {trimmedQuery && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="min-h-12 shrink-0 rounded-xl border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 hover:border-brand hover:text-brand"
            >
              Temizle
            </button>
          )}
        </div>

        {trimmedQuery && matchingCities.length > 0 && matchingCities.length <= 6 && (
          <div className="flex flex-wrap gap-2" aria-label="Eşleşen il hızlı seçimleri">
            {matchingCities.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => changeCity(name)}
                aria-pressed={city === name}
                className={
                  city === name
                    ? "min-h-11 rounded-xl border border-brand bg-[#FFF1F6] px-3 py-2 text-sm font-semibold text-brand-dark"
                    : "min-h-11 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:border-brand hover:text-brand"
                }
              >
                {name} seç
              </button>
            ))}
          </div>
        )}

        <label className="block">
          <span className="sr-only">İl seç</span>
          <select
            required
            className="location-select"
            value={city}
            onChange={(event) => changeCity(event.target.value)}
          >
            <option value="">İl seç</option>
            {city && !matchingCities.includes(city) && <option value={city}>{city} (seçili)</option>}
            {matchingCities.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>

        <p id="city-results" role="status" className="text-xs leading-5 text-slate-600">
          {trimmedQuery
            ? matchingCities.length
              ? `${matchingCities.length} il bulundu.`
              : "Eşleşen il bulunamadı. Yazımı veya aramayı değiştir."
            : "Türkiye’nin 81 ili alfabetik sırada listelenir."}
        </p>
      </fieldset>

      {hasPresetLocations || !city ? (
        <>
          <label className="block">
            <span className="mb-2 block font-semibold text-slate-900">İlçe</span>
            <select
              required
              disabled={!city}
              className="location-select"
              value={district}
              onChange={(event) => changeDistrict(event.target.value)}
            >
              <option value="">İlçe seç</option>
              {districtOptions.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block font-semibold text-slate-900">Mahalle</span>
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
              <option value="">Mahalle seç</option>
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
            <span className="mb-2 block font-semibold text-slate-900">İlçe</span>
            <input
              type="text"
              required
              className="field min-h-12"
              value={district}
              onChange={(event) => {
                setDistrict(event.target.value);
                setNotice("");
                setPendingPlan(null);
              }}
              placeholder="İlçe adı gir · ör. Kadıköy"
            />
          </label>

          <label className="block">
            <span className="mb-2 block font-semibold text-slate-900">Mahalle</span>
            <input
              type="text"
              required
              className="field min-h-12"
              value={neighborhood}
              onChange={(event) => {
                setNeighborhood(event.target.value);
                setNotice("");
                setPendingPlan(null);
              }}
              placeholder="Mahalle adı gir · ör. Caferağa"
            />
          </label>
        </>
      )}

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
        <button ref={submitButtonRef} disabled={!canSubmit} className="btn-primary w-full" type="submit">
          {delivery ? "Teslimat konumunu güncelle" : "Bu adrese teslimat yapan işletmeleri göster"}
        </button>
      )}

      {!canSubmit && (
        <p className="text-sm text-slate-600">Devam etmek için il, ilçe ve mahalle seç.</p>
      )}
      {notice && (
        <p role="status" aria-live="polite" className="rounded-xl border border-slate-300 bg-slate-50 p-3 text-sm font-medium text-slate-800">
          {notice}
        </p>
      )}
    </form>
  );
}
