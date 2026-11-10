import { useState, type FormEvent } from "react";
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
  const cityLocations = locations.filter(location => location.city === city);
  const unsupported = !!city && cityLocations.length === 0;
  function changeCity(value: string) {
    setCity(value); setDistrict(""); setId(""); setNotice(""); setQuery("");
  }
  function submit(event: FormEvent) {
    event.preventDefault();
    if (selectLocation(id)) { setNotice(""); onDone?.(); }
    else setNotice("Konum değiştirilmedi. Mevcut sepetlerin korundu.");
  }
  return <form onSubmit={submit} className="mx-auto max-w-xl space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
    <div><p className="font-semibold text-brand">Teslimat konumun</p>
      <h2 className="mt-2 text-2xl font-bold">Önce nereye getirelim?</h2>
      <p className="mt-3 text-slate-600">Mahalleni seç, sana teslimat yapan restoran ve marketleri gösterelim.</p></div>
    <fieldset className="min-w-0 space-y-3">
      <legend className="mb-2 flex w-full items-center justify-between font-semibold">
        <span>İl</span><span className="rounded-full bg-pink-50 px-3 py-1 text-xs text-brand">81 il</span>
      </legend>
      <label className="block">
        <span className="sr-only">İl adına göre ara</span>
        <input type="search" value={query} onChange={event => setQuery(event.target.value)}
          placeholder="İl ara · ör. İstanbul" autoComplete="off"
          className="field" aria-describedby="city-results" />
      </label>
      <label className="block">
        <span className="sr-only">İl seç</span>
        <select required className="location-select" value={city} onChange={event => changeCity(event.target.value)}>
          <option value="">İl seç</option>
          {city && !matchingCities.includes(city) && <option value={city}>{city} (seçili)</option>}
          {matchingCities.map(name => <option key={name} value={name}>{name}</option>)}
        </select>
      </label>
      <p id="city-results" role="status" className="text-xs text-slate-500">
        {query ? (matchingCities.length ? `${matchingCities.length} il bulundu. Listeden seçebilirsin.` : "Eşleşen il bulunamadı. Aramanı değiştir.") : "Türkiye’nin tüm illeri alfabetik olarak listelenir."}
      </p>
    </fieldset>
    {unsupported && <div role="status" className="space-y-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-slate-700">
      <p className="font-semibold">{city} için henüz demo teslimat bölgesi yok.</p>
      <p>Örnek işletmeleri incelemek için Adana veya Muğla’yı seçebilirsin. Mevcut teslimat konumun korunur.</p>
      <div className="flex flex-wrap gap-2">{["Adana", "Muğla"].map(name => <button key={name} type="button" onClick={() => changeCity(name)} className="min-h-11 rounded-xl border border-slate-300 bg-white px-4 font-semibold hover:border-brand">{name} seç</button>)}</div>
    </div>}
    <label className="block"><span className="mb-2 block font-semibold">İlçe</span>
      <select required disabled={!city || unsupported} className="location-select" value={district} onChange={e => { setDistrict(e.target.value); setId(""); setNotice(""); }}>
        <option value="">İlçe seç</option>{[...new Set(locations.filter(x => x.city === city).map(x => x.district))].map(x => <option key={x}>{x}</option>)}
      </select></label>
    <label className="block"><span className="mb-2 block font-semibold">Mahalle</span>
      <select required disabled={!district} className="location-select" value={id} onChange={e => setId(e.target.value)}>
        <option value="">Mahalle seç</option>{locations.filter(x => x.city === city && x.district === district).map(x => <option key={x.id} value={x.id}>{x.neighborhood}</option>)}
      </select></label>
    <button disabled={!id} className="btn-primary w-full" type="submit">Bu adrese teslimat yapan işletmeleri göster</button>
    {!id && !unsupported && <p className="text-sm text-slate-600">Devam etmek için il, ilçe ve mahalle seç.</p>}
    {notice && <p role="status" className="text-sm text-slate-700">{notice}</p>}
    <p className="text-sm text-slate-500">Örnek teslimat bölgeleri kullanılır. İşletmelerin bölge kapsamı demo verisidir.</p>
  </form>;
}
