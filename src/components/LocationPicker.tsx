import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { locationLabel, makeLocation, type DeliveryLocation } from "../data/delivery";
import { turkeyProvinces } from "../data/turkey";
import { getCurrentPosition, reverseCurrentPosition } from "../lib/location";
import { useDelivery } from "../state/DeliveryContext";
import SearchSelect from "./SearchSelect";

function Pin({ className = "h-6 w-6" }: { className?: string }) {
  return <svg className={className} aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>;
}
export default function LocationPicker({ onDone, embedded = false }: { onDone?: () => void; embedded?: boolean }) {
  const helpId = useId();
  const { delivery, selectLocation } = useDelivery();
  const [city, setCity] = useState(delivery?.city ?? "");
  const [district, setDistrict] = useState(delivery?.district ?? "");
  const [neighborhood, setNeighborhood] = useState(delivery?.neighborhood ?? "");
  const [source, setSource] = useState<"gps" | "manual">("manual");
  const [manual, setManual] = useState(false);
  const [found, setFound] = useState(false);
  const [busy, setBusy] = useState<"position" | "address" | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const generation = useRef(0);
  const controller = useRef<AbortController | null>(null);
  useEffect(() => () => { generation.current++; controller.current?.abort(); }, []);
  const province = turkeyProvinces.find(item => item.name === city);
  const draft: DeliveryLocation | null = makeLocation(city, district, neighborhood, source);
  async function locate() {
    const id = ++generation.current;
    controller.current?.abort();
    const abort = new AbortController();
    controller.current = abort;
    setBusy("position"); setError(""); setNotice(""); setManual(false);
    let timeout: ReturnType<typeof setTimeout> | undefined;
    try {
      const position = await getCurrentPosition();
      if (id !== generation.current) return;
      setBusy("address");
      timeout = setTimeout(() => abort.abort(), 10000);
      const address = await reverseCurrentPosition(position, abort.signal);
      if (id !== generation.current) return;
      setCity(address.city); setDistrict(address.district); setNeighborhood(address.neighborhood); setSource("gps"); setFound(true);
      setNotice(address.district && address.neighborhood ? "Konumun bulundu. Teslimat bölgeni kontrol edip onayla." : "Konumun bulundu. Eksik ilçe veya mahalle bilgisini tamamla.");
    } catch (failure) {
      if (id !== generation.current) return;
      setManual(true);
      setError(failure instanceof Error && failure.name !== "AbortError" ? failure.message : "Adres servisine şu an ulaşılamıyor. Adresini elle seçebilirsin.");
    } finally {
      clearTimeout(timeout);
      if (id === generation.current) setBusy(null);
    }
  }
  function chooseManual() {
    generation.current++; controller.current?.abort(); setBusy(null); setManual(true); setSource("manual"); setError(""); setNotice("");
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft) return;
    if (selectLocation(draft)) onDone?.();
    else setError("Konum değiştirilmedi. Mevcut adresin ve sepetlerin korundu.");
  }
  const showFields = manual || found || !!delivery;
  return <div className={`${embedded ? "" : "mx-auto max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"} grid md:grid-cols-[.8fr_1.2fr]`}>
    <aside className="relative hidden flex-col justify-between overflow-hidden bg-[#FFF1F6] p-8 md:flex">
      <p className="text-xl font-extrabold tracking-tight text-brand">yemeksepeti</p>
      <div className="my-8" aria-hidden="true"><svg viewBox="0 0 280 240" fill="none" className="w-full"><rect x="8" y="30" width="264" height="190" rx="28" fill="white"/><path d="m12 103 254 8M80 32l-7 184m102-185 13 184M18 174l249-23" stroke="#FBCFE0" strokeWidth="16"/><path d="m48 184 43-48 55 15 49-53" stroke="#D90049" strokeWidth="3" strokeDasharray="5 7"/><circle cx="48" cy="184" r="8" fill="#D90049"/><path d="M228 73c0 24-33 53-33 53s-33-29-33-53a33 33 0 1 1 66 0Z" fill="#D90049"/><circle cx="195" cy="72" r="11" fill="white"/></svg></div>
      <div><p className="text-2xl font-bold leading-8 text-slate-900">İhtiyacın olanlar,<br/>doğru adrese.</p><p className="mt-3 text-sm leading-6 text-slate-700">Konumunu bir kez seç, alışverişine kaldığın yerden devam et.</p></div>
    </aside>
    <section className="min-w-0 p-5 pt-12 sm:p-8 sm:pt-12">
      <p className="text-sm font-semibold text-brand">TESLİMAT ADRESİN</p>
      <h2 className="mt-2 text-[28px] font-bold leading-9 tracking-tight text-slate-900">Nereye getirelim?</h2>
      <p className="mt-3 text-sm leading-6 text-slate-600">Bulunduğun konumu kullan veya başka bir teslimat adresi seç.</p>
      <div role="group" aria-label="Adres belirleme yöntemi" className={`mt-6 grid gap-3 ${showFields ? "grid-cols-2" : ""}`}>
        <button type="button" aria-label="Mevcut konumumu kullan" onClick={locate} disabled={!!busy} aria-busy={!!busy} className={`flex items-center gap-3 rounded-2xl border text-left disabled:opacity-70 ${manual ? "border-slate-200 bg-white" : "border-brand bg-[#FFF1F6]"} ${showFields ? "min-h-16 p-3" : "min-h-16 p-4"}`}>
          <span className={`${showFields ? "hidden h-9 w-9 sm:flex" : "flex h-11 w-11"} shrink-0 items-center justify-center rounded-xl bg-brand text-white`}><Pin/></span>
          <span className="min-w-0"><span className={`block font-semibold text-brand ${showFields ? "text-sm" : ""}`}>{busy === "position" ? "Konumun bulunuyor…" : busy === "address" ? "Adresin hazırlanıyor…" : "Mevcut konumumu kullan"}</span><span className={showFields ? "sr-only" : "mt-1 block text-sm text-slate-600"}>{busy ? "Bu işlem birkaç saniye sürebilir." : "Tarayıcı izniyle otomatik doldur."}</span></span>{!showFields && <span className="ml-auto text-brand" aria-hidden="true">↗</span>}
        </button>
        <button type="button" aria-label="Başka bir adrese gönder" aria-pressed={manual} onClick={chooseManual} className={`flex min-h-14 items-center gap-3 rounded-2xl border ${showFields ? "p-3" : "p-4"} text-left ${manual ? "border-brand bg-[#FFF1F6]" : "border-slate-200 bg-white hover:border-brand"}`}>
          <span className={`${showFields ? "hidden h-9 w-9 sm:flex" : "flex h-11 w-11"} shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700`}><Pin/></span><span className="min-w-0"><span className={`block font-semibold text-slate-900 ${showFields ? "text-sm" : ""}`}>Başka bir adrese gönder</span><span className={showFields ? "sr-only" : "mt-1 block text-sm text-slate-600"}>Mevcut konumumu kullanmadan elle seç.</span></span>
        </button>
      </div>
      {busy && <p role="status" className="mt-4 text-sm font-medium text-slate-700">{busy === "position" ? "İzin penceresi açılırsa konum erişimine izin ver." : "Konumun adres bilgisine dönüştürülüyor."}</p>}
      {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm leading-6 text-red-900">{error}</p>}
      {notice && <p role="status" className="mt-4 rounded-xl bg-green-50 p-3 text-sm leading-6 text-green-900">{notice}</p>}
      {showFields && <form onSubmit={submit} className="mt-6 space-y-4 border-t border-slate-200 pt-5">
        <div className="flex flex-wrap items-center justify-between gap-2"><h3 className="font-semibold text-slate-900">{found && !manual ? "Bulunan adresi kontrol et" : "Teslimat bölgeni seç"}</h3><span className="text-sm text-slate-600">81 il · Türkiye geneli</span></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <SearchSelect label="İl" value={city} options={turkeyProvinces.map(item => item.name)} placeholder="İl adı yaz veya seç" onChange={value => { setCity(value); setDistrict(""); setNeighborhood(""); setSource("manual"); }} />
          <SearchSelect label="İlçe" value={district} options={province?.districts ?? []} placeholder={city ? "İlçe ara" : "Önce il seç"} disabled={!province} onChange={value => { setDistrict(value); setNeighborhood(""); setSource("manual"); }} />
        </div>
        <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-800">Mahalle / semt</span><input className="field min-h-12 disabled:bg-slate-100" disabled={!district} maxLength={100} value={neighborhood} onChange={event => { setNeighborhood(event.target.value); setSource("manual"); }} placeholder="Örn. Kötekli Mahallesi" autoComplete="off" aria-describedby={helpId} /></label>
        <p id={helpId} className="text-sm leading-5 text-slate-600">Mahalle adını yazman yeterli. Kapı numarası veya tam adres gerekmez.</p>
        {draft && <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3"><Pin className="mt-0.5 h-5 w-5 shrink-0 text-brand"/><div className="min-w-0"><p className="text-xs font-semibold text-slate-600">SEÇİLEN TESLİMAT BÖLGESİ</p><p className="mt-1 break-words text-sm font-semibold text-slate-900">{locationLabel(draft)}</p></div></div>}
        <button type="submit" disabled={!draft || !!busy} className="btn-primary min-h-12 w-full">Bu adrese getir →</button>
        {!draft && <p className="text-sm text-slate-600">İl, ilçe ve en az iki karakterlik mahalle adını tamamla.</p>}
      </form>}
      <p className="mt-5 text-xs leading-5 text-slate-600">Konum kullanıldığında koordinatların adresini bulmak için <a className="underline" href="https://www.bigdatacloud.com/privacy-policy" target="_blank" rel="noreferrer">BigDataCloud</a> ile paylaşılır. Hassas koordinatlar bu uygulamada kaydedilmez.</p>
      <p className="mt-2 text-xs leading-5 text-slate-600">Bağımsız HCI prototipi. Mağazalar ve teslimat kapsamı örnektir.</p>
    </section>
  </div>;
}
