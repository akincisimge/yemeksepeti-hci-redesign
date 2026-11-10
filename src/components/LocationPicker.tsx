import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { provinces } from "../data/provinces";
import {
  locationLabel,
  resolveLocation,
  resolveLocationIdForSelection,
  stripNeighborhoodSuffix,
  type LocationChangePlan,
} from "../data/delivery";
import {
  areAllRegionsLoaded,
  getCachedTurkeyRegions,
  getDistrictsForCity,
  getNeighborhoodsForDistrict,
  loadTurkeyRegions,
  type TurkeyRegionsMap,
} from "../data/regions";
import { formatAddressDetails, useDelivery, type AddressDetails } from "../state/DeliveryContext";

type LocationPickerProps = {
  onDone?: () => void;
  variant?: "modal" | "page";
};

type DetailsFieldKey = "street" | "buildingNo" | "floor" | "apartmentNo";

function matchInitialNeighborhood(
  regions: TurkeyRegionsMap,
  city: string,
  district: string,
  currentNeighborhood: string,
): string {
  if (!city || !district || !currentNeighborhood) return currentNeighborhood;
  const list = getNeighborhoodsForDistrict(regions, city, district);
  if (list.includes(currentNeighborhood)) return currentNeighborhood;
  const base = stripNeighborhoodSuffix(currentNeighborhood);
  return list.find((item) => stripNeighborhoodSuffix(item) === base) ?? currentNeighborhood;
}

export default function LocationPicker({ onDone, variant = "page" }: LocationPickerProps) {
  const { delivery, addressDetails, previewLocationChange, selectLocation } = useDelivery();
  const [regions, setRegions] = useState<TurkeyRegionsMap>(getCachedTurkeyRegions);
  const [allRegionsReady, setAllRegionsReady] = useState<boolean>(areAllRegionsLoaded);

  const [city, setCity] = useState<string>(delivery?.city ?? "");
  const [district, setDistrict] = useState<string>(delivery?.district ?? "");
  const [neighborhood, setNeighborhood] = useState<string>(() =>
    matchInitialNeighborhood(
      getCachedTurkeyRegions(),
      delivery?.city ?? "",
      delivery?.district ?? "",
      delivery?.neighborhood ?? "",
    ),
  );

  const [street, setStreet] = useState<string>(addressDetails?.street ?? "");
  const [buildingNo, setBuildingNo] = useState<string>(addressDetails?.buildingNo ?? "");
  const [floor, setFloor] = useState<string>(addressDetails?.floor ?? "");
  const [apartmentNo, setApartmentNo] = useState<string>(addressDetails?.apartmentNo ?? "");
  const [note, setNote] = useState<string>(addressDetails?.note ?? "");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<DetailsFieldKey, string>>>({});

  const [notice, setNotice] = useState("");
  const [pendingPlan, setPendingPlan] = useState<LocationChangePlan | null>(null);

  const cancelButtonRef = useRef<HTMLButtonElement | null>(null);
  const submitButtonRef = useRef<HTMLButtonElement | null>(null);
  const streetInputRef = useRef<HTMLInputElement | null>(null);
  const buildingInputRef = useRef<HTMLInputElement | null>(null);
  const floorInputRef = useRef<HTMLInputElement | null>(null);
  const apartmentInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (allRegionsReady) return;
    let active = true;
    loadTurkeyRegions().then((loaded) => {
      if (!active) return;
      setRegions(loaded);
      setAllRegionsReady(true);
      if (delivery?.city && delivery?.district && delivery?.neighborhood) {
        setNeighborhood((prev) => matchInitialNeighborhood(loaded, delivery.city, delivery.district, prev));
      }
    });
    return () => {
      active = false;
    };
  }, [allRegionsReady, delivery]);

  const districtOptions = useMemo(() => getDistrictsForCity(regions, city), [regions, city]);
  const neighborhoodOptions = useMemo(
    () => getNeighborhoodsForDistrict(regions, city, district),
    [regions, city, district],
  );

  const resolvedTargetId = useMemo(
    () => resolveLocationIdForSelection(city, district, neighborhood) ?? "",
    [city, district, neighborhood],
  );
  const regionPreviewLabel = useMemo(() => {
    if (!resolvedTargetId) return null;
    const resolved = resolveLocation(resolvedTargetId);
    return resolved ? locationLabel(resolved) : null;
  }, [resolvedTargetId]);

  const trimmedDetails: AddressDetails | null = useMemo(() => {
    const s = street.trim();
    const b = buildingNo.trim();
    const f = floor.trim();
    const a = apartmentNo.trim();
    const n = note.trim();
    if (!s || !b || !f || !a) return null;
    return n ? { street: s, buildingNo: b, floor: f, apartmentNo: a, note: n } : { street: s, buildingNo: b, floor: f, apartmentNo: a };
  }, [street, buildingNo, floor, apartmentNo, note]);

  const hasRegionSelected = Boolean(city && district && neighborhood && resolvedTargetId);

  useEffect(() => {
    if (pendingPlan) {
      cancelButtonRef.current?.focus();
    }
  }, [pendingPlan]);

  function changeCity(value: string) {
    setCity(value);
    setDistrict("");
    setNeighborhood("");
    setNotice("");
    setPendingPlan(null);
  }

  function changeDistrict(value: string) {
    setDistrict(value);
    setNeighborhood("");
    setNotice("");
    setPendingPlan(null);
  }

  function clearFieldError(key: DetailsFieldKey) {
    if (fieldErrors[key]) {
      setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  }

  function validateDetails(): AddressDetails | null {
    const errors: Partial<Record<DetailsFieldKey, string>> = {};
    if (!street.trim()) errors.street = "Cadde veya sokak adı zorunlu.";
    if (!buildingNo.trim()) errors.buildingNo = "Apartman / Bina No zorunlu.";
    if (!floor.trim()) errors.floor = "Kat No zorunlu.";
    if (!apartmentNo.trim()) errors.apartmentNo = "Daire No zorunlu.";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      if (errors.street) streetInputRef.current?.focus();
      else if (errors.buildingNo) buildingInputRef.current?.focus();
      else if (errors.floor) floorInputRef.current?.focus();
      else if (errors.apartmentNo) apartmentInputRef.current?.focus();
      return null;
    }

    setFieldErrors({});
    const cleanNote = note.trim();
    return {
      street: street.trim(),
      buildingNo: buildingNo.trim(),
      floor: floor.trim(),
      apartmentNo: apartmentNo.trim(),
      ...(cleanNote ? { note: cleanNote } : {}),
    };
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!resolvedTargetId) return;

    const validDetails = validateDetails();
    if (!validDetails) return;

    const plan = previewLocationChange(resolvedTargetId);
    if (!plan) return;

    if (plan.affected.length > 0) {
      setPendingPlan(plan);
      setNotice("");
      return;
    }

    if (selectLocation(resolvedTargetId, { confirmed: true, details: validDetails })) {
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
    const validDetails = validateDetails();
    if (!validDetails) {
      setPendingPlan(null);
      return;
    }
    if (selectLocation(pendingPlan.target.id, { confirmed: true, details: validDetails })) {
      setPendingPlan(null);
      setNotice("");
      onDone?.();
    }
  }

  const formClasses =
    variant === "modal"
      ? "space-y-4"
      : "mx-auto max-w-xl space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8";

  const districtsLoading = Boolean(city) && districtOptions.length === 0 && !allRegionsReady;
  const neighborhoodsLoading = Boolean(district) && neighborhoodOptions.length === 0 && !allRegionsReady;

  return (
    <form onSubmit={submit} noValidate className={formClasses}>
      {variant === "page" && (
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Teslimat Adresini Seç</h2>
          <p className="mt-1.5 text-sm text-slate-600">İl, ilçe, mahalle ve apartman bilgilerini girerek devam et.</p>
        </div>
      )}

      <fieldset className="min-w-0 space-y-2.5 rounded-2xl border border-slate-200 bg-slate-50/75 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <legend className="flex items-center gap-2 text-base font-bold text-slate-900">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
              1
            </span>
            <span>Şehir Seç *</span>
          </legend>
          {city ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
              ✓ {city}
            </span>
          ) : (
            <span className="text-xs font-medium text-slate-600">81 il</span>
          )}
        </div>

        <label className="block min-w-0">
          <span className="sr-only">Şehir seçin</span>
          <select
            required
            data-autofocus
            className="location-select"
            value={city}
            onChange={(event) => changeCity(event.target.value)}
          >
            <option value="">İl seçin (A–Z)</option>
            {provinces.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>
      </fieldset>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block min-w-0">
          <span className="mb-1.5 flex items-center justify-between gap-2 text-base font-bold text-slate-900">
            <span className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-800">
                2
              </span>
              <span>İlçe *</span>
            </span>
            {city && districtOptions.length > 0 && (
              <span className="text-xs font-medium text-slate-500">{districtOptions.length} ilçe</span>
            )}
          </span>
          <select
            required
            disabled={!city || districtsLoading}
            className="location-select"
            value={district}
            onChange={(event) => changeDistrict(event.target.value)}
          >
            <option value="">
              {!city ? "Önce şehir seçin" : districtsLoading ? "İlçeler hazırlanıyor..." : "İlçe seçin"}
            </option>
            {districtOptions.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>

        <label className="block min-w-0">
          <span className="mb-1.5 flex items-center justify-between gap-2 text-base font-bold text-slate-900">
            <span className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-800">
                3
              </span>
              <span>Mahalle *</span>
            </span>
            {district && neighborhoodOptions.length > 0 && (
              <span className="text-xs font-medium text-slate-500">{neighborhoodOptions.length} mahalle</span>
            )}
          </span>
          <select
            required
            disabled={!district || neighborhoodsLoading}
            className="location-select"
            value={neighborhood}
            onChange={(event) => {
              setNeighborhood(event.target.value);
              setNotice("");
              setPendingPlan(null);
            }}
          >
            <option value="">
              {!district ? "Önce ilçe seçin" : neighborhoodsLoading ? "Mahalleler hazırlanıyor..." : "Mahalle seçin"}
            </option>
            {neighborhoodOptions.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <fieldset className="min-w-0 space-y-3 rounded-2xl border border-slate-200 bg-slate-50/75 p-4">
        <legend className="flex items-center gap-2 text-base font-bold text-slate-900">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-800">
            4
          </span>
          <span>Bina ve Daire Bilgileri *</span>
        </legend>

        <label className="block min-w-0">
          <span className="mb-1 block text-xs font-semibold text-slate-700">Cadde / Sokak / Site *</span>
          <input
            ref={streetInputRef}
            type="text"
            name="street"
            required
            value={street}
            onChange={(e) => {
              setStreet(e.target.value);
              clearFieldError("street");
            }}
            aria-invalid={Boolean(fieldErrors.street)}
            placeholder="Ör. Atatürk Cad. / 12. Sokak"
            className={fieldErrors.street ? "field border-[#991B1B] text-sm" : "field text-sm"}
          />
          {fieldErrors.street && (
            <span role="alert" className="mt-1 block text-xs font-semibold text-[#991B1B]">
              {fieldErrors.street}
            </span>
          )}
        </label>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          <label className="block min-w-0">
            <span className="mb-1 block text-xs font-semibold text-slate-700">Apartman / Bina No *</span>
            <input
              ref={buildingInputRef}
              type="text"
              name="buildingNo"
              required
              value={buildingNo}
              onChange={(e) => {
                setBuildingNo(e.target.value);
                clearFieldError("buildingNo");
              }}
              aria-invalid={Boolean(fieldErrors.buildingNo)}
              placeholder="Ör. No: 14"
              className={fieldErrors.buildingNo ? "field border-[#991B1B] text-sm" : "field text-sm"}
            />
            {fieldErrors.buildingNo && (
              <span role="alert" className="mt-1 block text-xs font-semibold text-[#991B1B]">
                {fieldErrors.buildingNo}
              </span>
            )}
          </label>

          <label className="block min-w-0">
            <span className="mb-1 block text-xs font-semibold text-slate-700">Kat No *</span>
            <input
              ref={floorInputRef}
              type="text"
              name="floor"
              required
              value={floor}
              onChange={(e) => {
                setFloor(e.target.value);
                clearFieldError("floor");
              }}
              aria-invalid={Boolean(fieldErrors.floor)}
              placeholder="Ör. 3"
              className={fieldErrors.floor ? "field border-[#991B1B] text-sm" : "field text-sm"}
            />
            {fieldErrors.floor && (
              <span role="alert" className="mt-1 block text-xs font-semibold text-[#991B1B]">
                {fieldErrors.floor}
              </span>
            )}
          </label>

          <label className="block min-w-0">
            <span className="mb-1 block text-xs font-semibold text-slate-700">Daire No *</span>
            <input
              ref={apartmentInputRef}
              type="text"
              name="apartmentNo"
              required
              value={apartmentNo}
              onChange={(e) => {
                setApartmentNo(e.target.value);
                clearFieldError("apartmentNo");
              }}
              aria-invalid={Boolean(fieldErrors.apartmentNo)}
              placeholder="Ör. 7"
              className={fieldErrors.apartmentNo ? "field border-[#991B1B] text-sm" : "field text-sm"}
            />
            {fieldErrors.apartmentNo && (
              <span role="alert" className="mt-1 block text-xs font-semibold text-[#991B1B]">
                {fieldErrors.apartmentNo}
              </span>
            )}
          </label>
        </div>

        <label className="block min-w-0">
          <span className="mb-1 block text-xs font-semibold text-slate-700">Adres tarifi (isteğe bağlı)</span>
          <input
            type="text"
            name="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Ör. Mavi kapı, zile basınız"
            className="field text-sm"
          />
        </label>
      </fieldset>

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
          {regionPreviewLabel && (
            <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-950">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white" aria-hidden="true">
                ✓
              </span>
              <div className="min-w-0 leading-snug">
                <span className="block text-xs font-medium text-emerald-800">Teslimat adresi önizlemesi</span>
                <strong className="block text-base font-bold text-slate-900">{regionPreviewLabel}</strong>
                {trimmedDetails && (
                  <span className="mt-0.5 block text-xs font-medium text-emerald-900">
                    {formatAddressDetails(trimmedDetails)}
                  </span>
                )}
              </div>
            </div>
          )}

          <button ref={submitButtonRef} disabled={!hasRegionSelected} className="btn-primary min-h-13 w-full text-base" type="submit">
            {delivery ? "Bu Adresi Kaydet" : "Adresi Onayla ve Devam Et"}
          </button>

          {!hasRegionSelected && (
            <p className="text-center text-sm font-medium text-slate-600">
              Devam etmek için şehir, ilçe, mahalle ve apartman bilgilerini doldurun.
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
