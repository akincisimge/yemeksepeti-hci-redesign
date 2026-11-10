import { useState, type FormEvent, type KeyboardEvent } from "react";
import { filterProvinces } from "../data/provinces";
import { locations } from "../data/delivery";
import { useDelivery } from "../state/DeliveryContext";

export default function LocationPicker({ onDone }: { onDone?: () => void }) {
  const { delivery, selectLocation } = useDelivery();
  const [city, setCity] = useState<string>(delivery?.city ?? "");
  const [district, setDistrict] = useState<string>(delivery?.district ?? "");
  const [id, setId] = useState<string>(delivery?.id ?? "");
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");

  const matchingCities = filterProvinces(query);
  const cityLocations = locations.filter((location) => location.city === city);
  const districtOptions = [...new Set(cityLocations.map((location) => location.district))];
  const neighborhoodOptions = cityLocations.filter((location) => location.district === district);
  const unsupported = Boolean(city) && cityLocations.length === 0;
  const trimmedQuery = query.trim();

  function changeCity(value: string) {
    setCity(value);
    setDistrict("");
    setId("");
    setNotice("");
    setQuery("");
  }

  function changeDistrict(value: string) {
    setDistrict(value);
    setId("");
    setNotice("");
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
    if (!id || unsupported) return;
    if (selectLocation(id)) {
      setNotice("");
      onDone?.();
    } else {
      setNotice("Konum değiştirilmedi. Mevcut adresin ve sepetlerin korundu.");
    }
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-xl space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div>
        <p className="font-semibold text-brand">Teslimat konumun</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900">Önce nereye getirelim?</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          81 il arasından ilini ara ve seç. Örnek teslimat bölgeleri olan illerde ilçe ve mahalle seçerek devam edebilirsin.
        </p>
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
              placeholder="İl ara · ör. İstanbul, Muğla"
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
              ? `${matchingCities.length} il bulundu. Listeden veya hızlı düğmeden seçebilirsin.`
              : "Eşleşen il bulunamadı. Yazımı veya aramayı değiştir."
            : "Türkiye’nin 81 ili Türkçe alfabetik sırada listelenir."}
        </p>
      </fieldset>

      {unsupported && (
        <div role="status" className="space-y-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-slate-800">
          <p className="font-bold text-amber-950">{city} için henüz demo teslimat kapsamı tanımlanmadı.</p>
          <p>
            Bu öğrenci prototipinde ilçe ve mahalle verileri tüm illeri kapsamaz. Mevcut teslimat konumun ve sepetlerin korunuyor;
            örnek işletmeleri görmek için aşağıdaki demo illerinden birini seçebilirsin.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => changeCity("Muğla")}
              className="min-h-11 rounded-xl border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-900 hover:border-brand hover:text-brand"
            >
              Muğla seç (Yemek &amp; Market)
            </button>
            <button
              type="button"
              onClick={() => changeCity("Adana")}
              className="min-h-11 rounded-xl border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-900 hover:border-brand hover:text-brand"
            >
              Adana seç (Yalnız Yemek)
            </button>
          </div>
        </div>
      )}

      <label className="block">
        <span className="mb-2 flex items-center justify-between gap-2 font-semibold text-slate-900">
          <span>İlçe</span>
          <span className="text-xs font-normal text-slate-600">Demo örnek bölgeler</span>
        </span>
        <select
          required
          disabled={!city || unsupported}
          className="location-select"
          value={district}
          onChange={(event) => changeDistrict(event.target.value)}
        >
          <option value="">{unsupported ? "Bu il için demo ilçe kaydı yok" : "İlçe seç"}</option>
          {districtOptions.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="mb-2 flex items-center justify-between gap-2 font-semibold text-slate-900">
          <span>Mahalle</span>
          <span className="text-xs font-normal text-slate-600">Demo örnek bölgeler</span>
        </span>
        <select
          required
          disabled={!district || unsupported}
          className="location-select"
          value={id}
          onChange={(event) => {
            setId(event.target.value);
            setNotice("");
          }}
        >
          <option value="">{unsupported ? "Bu il için demo mahalle kaydı yok" : "Mahalle seç"}</option>
          {neighborhoodOptions.map((location) => (
            <option key={location.id} value={location.id}>
              {location.neighborhood}
            </option>
          ))}
        </select>
      </label>

      <button disabled={!id || unsupported} className="btn-primary w-full" type="submit">
        Bu adrese teslimat yapan işletmeleri göster
      </button>

      {!id && !unsupported && (
        <p className="text-sm text-slate-600">Devam etmek için il, ilçe ve mahalle seç.</p>
      )}
      {notice && (
        <p role="status" className="text-sm font-medium text-slate-800">
          {notice}
        </p>
      )}
      <p className="text-sm leading-5 text-slate-600">
        81 il listesi tüm Türkiye illerini gösterir; ilçe ve mahalle seçenekleri yalnızca prototipteki örnek demo bölgeleriyle sınırlıdır.
      </p>
    </form>
  );
}
