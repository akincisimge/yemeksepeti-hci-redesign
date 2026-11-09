import { useState, type FormEvent } from "react";
import { locations } from "../data/delivery";
import { useDelivery } from "../state/DeliveryContext";
export default function LocationPicker({ onDone }: { onDone?: () => void }) {
  const { delivery, selectLocation } = useDelivery();
  const [city, setCity] = useState<string>(delivery?.city ?? "");
  const [district, setDistrict] = useState<string>(delivery?.district ?? "");
  const [id, setId] = useState<string>(delivery?.id ?? "");
  const [notice, setNotice] = useState("");
  function submit(event: FormEvent) {
    event.preventDefault();
    if (selectLocation(id)) { setNotice(""); onDone?.(); }
    else setNotice("Konum değiştirilmedi. Mevcut sepetlerin korundu.");
  }
  return <form onSubmit={submit} className="mx-auto max-w-xl space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
    <div><p className="font-semibold text-brand">Teslimat konumun</p>
      <h2 className="mt-2 text-2xl font-bold">Önce nereye getirelim?</h2>
      <p className="mt-3 text-slate-600">Mahalleni seç, sana teslimat yapan restoran ve marketleri gösterelim.</p></div>
    <label className="block"><span className="mb-2 block font-semibold">İl</span>
      <select required className="field min-h-12" value={city} onChange={e => { setCity(e.target.value); setDistrict(""); setId(""); }}>
        <option value="">İl seç</option>{[...new Set(locations.map(x => x.city))].map(x => <option key={x}>{x}</option>)}
      </select></label>
    <label className="block"><span className="mb-2 block font-semibold">İlçe</span>
      <select required disabled={!city} className="field min-h-12 disabled:bg-slate-100" value={district} onChange={e => { setDistrict(e.target.value); setId(""); }}>
        <option value="">İlçe seç</option>{[...new Set(locations.filter(x => x.city === city).map(x => x.district))].map(x => <option key={x}>{x}</option>)}
      </select></label>
    <label className="block"><span className="mb-2 block font-semibold">Mahalle</span>
      <select required disabled={!district} className="field min-h-12 disabled:bg-slate-100" value={id} onChange={e => setId(e.target.value)}>
        <option value="">Mahalle seç</option>{locations.filter(x => x.city === city && x.district === district).map(x => <option key={x.id} value={x.id}>{x.neighborhood}</option>)}
      </select></label>
    <button disabled={!id} className="btn-primary w-full" type="submit">Bu adrese teslimat yapan işletmeleri göster</button>
    {!id && <p className="text-sm text-slate-600">Devam etmek için il, ilçe ve mahalle seç.</p>}
    {notice && <p role="status" className="text-sm text-slate-700">{notice}</p>}
    <p className="text-sm text-slate-500">Örnek teslimat bölgeleri kullanılır. İşletmelerin bölge kapsamı demo verisidir.</p>
  </form>;
}
