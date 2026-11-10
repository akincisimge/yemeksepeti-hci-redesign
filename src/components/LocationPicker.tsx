import { useId, useState, type FormEvent } from "react";
import { locationLabel, locations } from "../data/delivery";
import { useDelivery } from "../state/DeliveryContext";
export default function LocationPicker({ inPanel = false, onDone, onCancel }: { inPanel?: boolean; onDone?: () => void; onCancel?: () => void }) {
  const { delivery, selectLocation } = useDelivery();
  const guidanceId = useId();
  const [city, setCity] = useState<string>(delivery?.city ?? "");
  const [district, setDistrict] = useState<string>(delivery?.district ?? "");
  const [id, setId] = useState<string>(delivery?.id ?? "");
  const [notice, setNotice] = useState("");
  const unchanged = id === delivery?.id;
  const guidance = notice || (!city ? "Önce il seç."
    : !district ? "Şimdi ilçe seç."
    : !id ? "Devam etmek için mahalle seç."
    : unchanged ? "Yeni bir mahalle seçerek konumunu değiştirebilirsin." : "");

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!id || unchanged) return;
    if (selectLocation(id)) { setNotice(""); onDone?.(); }
    else setNotice("Konum değiştirilmedi. Mevcut sepetlerin korundu.");
  }
  return <form onSubmit={submit} className={inPanel
    ? "space-y-5"
    : "mx-auto max-w-xl space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"}>
    {!inPanel && <h2 className="text-2xl font-bold">Teslimat konumu seç</h2>}
    {delivery && <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
      <span className="block font-semibold">Mevcut konum</span>
      {locationLabel(delivery)}
    </p>}
    <p className="text-sm leading-6 text-slate-700">İl, ilçe ve mahalle seç. Listelerde örnek teslimat bölgeleri kullanılır.</p>
    <label className="block"><span className="mb-2 block font-semibold">İl</span>
      <select required className="field location-select" value={city} onChange={e => { setNotice(""); setCity(e.target.value); setDistrict(""); setId(""); }}>
        <option value="">İl seç</option>{[...new Set(locations.map(x => x.city))].map(x => <option key={x}>{x}</option>)}
      </select></label>
    <label className="block"><span className="mb-2 block font-semibold">İlçe</span>
      <select required disabled={!city} className="field location-select disabled:bg-slate-100" value={district} onChange={e => { setNotice(""); setDistrict(e.target.value); setId(""); }}>
        <option value="">İlçe seç</option>{[...new Set(locations.filter(x => x.city === city).map(x => x.district))].map(x => <option key={x}>{x}</option>)}
      </select></label>
    <label className="block"><span className="mb-2 block font-semibold">Mahalle</span>
      <select required disabled={!district} className="field location-select disabled:bg-slate-100" value={id} onChange={e => { setNotice(""); setId(e.target.value); }}>
        <option value="">Mahalle seç</option>{locations.filter(x => x.city === city && x.district === district).map(x => <option key={x.id} value={x.id}>{x.neighborhood}</option>)}
      </select></label>
    <p id={guidanceId} role="status" className="min-h-5 text-sm text-slate-700">{guidance}</p>
    <div className="flex flex-wrap gap-3">
      {onCancel && <button type="button" onClick={onCancel} className="nav-link border border-slate-300 font-semibold">Vazgeç</button>}
      <button disabled={!id || unchanged} aria-describedby={guidanceId} className="btn-primary flex-1" type="submit">
        {delivery || inPanel ? "Konumu kaydet" : "İşletmeleri göster"}
      </button>
    </div>
  </form>;
}
