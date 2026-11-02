import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { readDemoOrder } from "../state/demoOrder";

export type PanelView = "address" | "profile" | "account" | "orders" | "coupons" | "help" | null;
export type DemoAccount = { name: string; email: string; phone: string };

type PanelProps = {
  view: Exclude<PanelView, null>;
  onClose: () => void;
  onNavigate: (view: Exclude<PanelView, null>) => void;
  address: string | null;
  onAddressChange: (address: string) => void;
  account: DemoAccount | null;
  onSaveAccount: (account: DemoAccount) => void;
  foodCount: number;
  marketCount: number;
};

const SAMPLE_LOCATIONS = [
  "Muğla, Menteşe", "Adana, Seyhan", "İstanbul, Kadıköy",
  "Ankara, Çankaya", "İzmir, Konak", "Antalya, Muratpaşa"
];

const TOPICS = [
  { name: "Siparişimi takip etmek istiyorum", answer: "Demo sipariş tamamlandıktan sonra takip ekranında dört örnek aşamayı izleyebilirsin. Son siparişine Profil → Önceki siparişlerim bölümünden de dönebilirsin." },
  { name: "Teslimat adresimi değiştirmek istiyorum", answer: "Ana sayfadaki Adres seç butonundan örnek teslimat konumunu değiştirebilirsin. Siparişi tamamlarken ayrıntılı demo adresini ayrıca düzenleyebilirsin." },
  { name: "Kuponumla ilgili yardım istiyorum", answer: "Bu öğrenci prototipinde gerçek kupon kullanımı yok. Kuponlarım alanında örnek kupon durumları gösteriliyor." },
  { name: "Siparişimi iptal veya iade etmek istiyorum", answer: "Bu uygulama gerçek sipariş oluşturmadığı için para çekme, iptal veya iade işlemi yapılmaz." },
  { name: "Başka bir konuda yardım istiyorum", answer: "Bu bir otomatik demo sohbetidir. Gerçek müşteri temsilcisine mesaj gönderilmez. Yardım seçeneklerini inceleyebilir veya yeni konu seçebilirsin." }
];

type Message = { sender: "visitor" | "assistant"; text: string };

function PanelRow({ label, detail, onClick }: { label: string; detail?: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex min-h-14 w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left transition hover:border-brand hover:bg-[#FFF1F6] focus-visible:outline-3">
      <span><span className="block font-semibold text-slate-900">{label}</span>{detail && <span className="mt-1 block text-sm text-slate-600">{detail}</span>}</span>
      <span className="text-xl text-brand" aria-hidden="true">›</span>
    </button>
  );
}

function AddressView({ address, onAddressChange, onClose }: Pick<PanelProps, "address" | "onAddressChange" | "onClose">) {
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<string | null>(address);
  const [notice, setNotice] = useState("");
  const matches = SAMPLE_LOCATIONS.filter((item) => item.toLocaleLowerCase("tr").includes(query.trim().toLocaleLowerCase("tr")));
  function confirm() {
    if (!picked) return;
    onAddressChange(picked);
    setNotice("Konum güncellendi.");
    onClose();
  }
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-[#FFF1F6] p-4">
        <p className="font-semibold text-slate-900">Teslimat konumunu seç</p>
        <p className="mt-1 text-sm text-slate-700">Bu ekranda yalnızca örnek il ve ilçe bilgileri kullanılır. Tam adresi demo sipariş sırasında girebilirsin.</p>
      </div>
      {address && <p className="text-sm text-slate-600">Şu an seçili: <strong className="text-slate-900">{address}</strong></p>}
      <label className="block">
        <span className="mb-2 block font-semibold text-slate-900">İl veya ilçe ara</span>
        <input className="field min-h-12" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Örn. Muğla, Menteşe" />
      </label>
      <fieldset className="space-y-2">
        <legend className="mb-3 font-semibold text-slate-900">Örnek teslimat konumları</legend>
        {matches.length > 0 ? matches.map((location) => (
          <label key={location} className={"flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 " + (picked === location ? "border-brand bg-[#FFF1F6]" : "border-slate-300 bg-white hover:border-brand")}>
            <input type="radio" name="delivery-location" className="accent-[#D90049]" checked={picked === location} onChange={() => { setPicked(location); setNotice(""); }} />
            <span className="font-medium">{location}</span>
            {picked === location && <span className="ml-auto font-semibold text-[#166534]">Seçildi</span>}
          </label>
        )) : <p role="status" className="rounded-xl border border-slate-300 bg-slate-50 p-4 text-sm text-slate-700">Bu aramayla eşleşen örnek konum yok. Başka bir il veya ilçe dene.</p>}
      </fieldset>
      {notice && <p role="status" className="text-[#166534]">{notice}</p>}
      <div className="space-y-3 border-t border-slate-200 pt-5">
        <button type="button" className="btn-primary w-full" disabled={!picked} onClick={confirm}>Bu konumu kullan</button>
        {!picked && <p className="text-sm text-slate-600">Devam etmek için bir konum seç.</p>}
        <button type="button" onClick={onClose} className="min-h-11 w-full rounded-xl border border-slate-300 bg-white px-5 font-semibold text-slate-700 hover:bg-slate-50">Şimdilik geç</button>
      </div>
    </div>
  );
}

function AccountView({ account, onSaveAccount, onNavigate }: Pick<PanelProps, "account" | "onSaveAccount" | "onNavigate">) {
  const [name, setName] = useState(account?.name ?? "");
  const [email, setEmail] = useState(account?.email ?? "");
  const [phone, setPhone] = useState(account?.phone ?? "");
  const [error, setError] = useState("");
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (name.trim().length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) || phone.replace(/\D/g, "").length < 10) {
      setError("Adın en az 2 karakter, e-posta geçerli ve telefon numarası en az 10 rakam olmalı.");
      return;
    }
    setError("");
    onSaveAccount({ name: name.trim(), email: email.trim(), phone: phone.trim() });
    onNavigate("profile");
  }
  return (
    <form onSubmit={save} className="space-y-5" noValidate>
      <p className="rounded-xl bg-[#FFF1F6] p-4 text-sm text-slate-700">Örnek hesap oluşturma ekranı. Gerçek e-posta veya telefon bilgisi girmeyin. Bilgiler yalnızca bu sayfa açıkken tutulur; sunucuya gönderilmez.</p>
      <label className="block"><span className="mb-2 block font-semibold">Ad soyad</span><input className="field min-h-12" value={name} onChange={(e) => setName(e.target.value)} placeholder="Örnek Kullanıcı" autoComplete="off" required /></label>
      <label className="block"><span className="mb-2 block font-semibold">E-posta</span><input className="field min-h-12" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ornek@example.com" autoComplete="off" required /></label>
      <label className="block"><span className="mb-2 block font-semibold">Telefon numarası</span><input className="field min-h-12" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0500 000 00 00" autoComplete="off" required /></label>
      {error && <p role="alert" className="rounded-xl border border-[#991B1B] bg-white p-3 font-semibold text-[#991B1B]">{error}</p>}
      <button type="submit" className="btn-primary w-full">Demo profilini kaydet</button>
    </form>
  );
}

function HelpView() {
  const [messages, setMessages] = useState<Message[]>([
    { sender: "assistant", text: "Merhaba! Bu, HCI projesi için hazırlanmış otomatik canlı yardım demosudur. Hangi konuda destek istersin?" }
  ]);
  const [input, setInput] = useState("");
  const [finished, setFinished] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }); }, [messages]);
  function send(question: string, answer?: string) {
    if (!question.trim() || finished) return;
    setMessages((old) => [...old, { sender: "visitor", text: question.trim() }, { sender: "assistant", text: answer ?? "Mesajın demo sohbete eklendi. Bu prototip gerçek temsilciye bağlanmaz. Aşağıdaki başlıklardan birini de seçebilirsin." }]);
    setInput("");
  }
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-4 rounded-xl border border-slate-200 bg-[#FFF1F6] p-4">
        <p className="font-semibold text-slate-900">Canlı yardım simülasyonu</p>
        <p className="mt-1 text-sm text-slate-700">Otomatik örnek yanıtlar. Gerçek bir temsilciyle görüşme yapılmaz.</p>
      </div>
      <div role="log" aria-label="Demo sohbet mesajları" aria-live="polite" aria-relevant="additions" className="min-h-40 flex-1 space-y-4 overflow-y-auto rounded-xl bg-slate-50 p-3">
        {messages.map((message, i) => (
          <div key={i} className={"flex " + (message.sender === "visitor" ? "justify-end" : "justify-start")}>
            <p className={"max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-6 " + (message.sender === "visitor" ? "bg-brand text-white" : "border border-slate-200 bg-white text-slate-900")}>{message.text}</p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      {finished ? (
        <div className="mt-4 space-y-3 rounded-xl border border-[#166534] bg-white p-4">
          <p role="status" className="font-semibold text-[#166534]">Demo görüşmesi tamamlandı.</p>
          <button type="button" className="btn-primary w-full" onClick={() => { setMessages([{ sender: "assistant", text: "Yeni demo görüşmesi başladı. Nasıl yardımcı olabilirim?" }]); setFinished(false); }}>Yeni görüşme başlat</button>
        </div>
      ) : (
        <>
          <div className="mt-4 space-y-2" aria-label="Sık kullanılan yardım başlıkları">
            {TOPICS.map((topic) => (
              <button type="button" key={topic.name} onClick={() => send(topic.name, topic.answer)} className="min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-left text-sm font-medium text-slate-800 hover:border-brand hover:bg-[#FFF1F6]">{topic.name}</button>
            ))}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="mt-4 flex items-end gap-2">
            <label className="min-w-0 flex-1"><span className="mb-2 block text-sm font-semibold">Mesajın (demo)</span><input className="field min-h-12" value={input} onChange={(e) => setInput(e.target.value)} maxLength={240} placeholder="Bir soru yaz..." /></label>
            <button type="submit" disabled={!input.trim()} className="btn-primary min-h-12 shrink-0">Gönder</button>
          </form>
          <button type="button" onClick={() => setFinished(true)} className="mt-3 min-h-11 w-full text-sm font-semibold text-slate-700 underline underline-offset-4 hover:text-brand">Görüşmeyi sonlandır</button>
        </>
      )}
    </div>
  );
}

export default function SidePanel({ view, onClose, onNavigate, address, onAddressChange, account, onSaveAccount, foodCount, marketCount }: PanelProps) {
  const panelRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLButtonElement>("[data-close]")?.focus();
    function keyDown(event: KeyboardEvent) {
      if (event.key === "Escape") { event.preventDefault(); onClose(); }
      if (event.key !== "Tab" || !panelRef.current) return;
      const nodes = Array.from(panelRef.current.querySelectorAll<HTMLElement>("button:not(:disabled), a[href], input:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex='-1'])"));
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    document.addEventListener("keydown", keyDown);
    return () => { document.body.style.overflow = oldOverflow; document.removeEventListener("keydown", keyDown); };
  }, [onClose, view]);

  const title: Record<Exclude<PanelView, null>, string> = {
    address: "Teslimat konumu", profile: "Profil ve hesabım", account: "Demo hesabım",
    orders: "Önceki siparişlerim", coupons: "Kuponlarım", help: "Yardım ve canlı destek"
  };
  const subpage = view !== "profile" && view !== "address";
  const lastOrder = view === "orders" ? readDemoOrder() : null;

  return (
    <div className="fixed inset-0 z-50">
      <button type="button" aria-label="Paneli kapat" onClick={onClose} className="absolute inset-0 h-full w-full cursor-default bg-slate-900/40" />
      <aside ref={panelRef} role="dialog" aria-modal="true" aria-labelledby="panel-title" className="absolute inset-y-0 right-0 flex w-full flex-col bg-white shadow-2xl sm:max-w-[440px]">
        <header className="flex min-h-[76px] shrink-0 items-center gap-3 border-b border-slate-200 px-4 sm:px-6">
          {subpage && <button type="button" onClick={() => onNavigate("profile")} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-300 hover:bg-slate-50" aria-label="Profil menüsüne dön">←</button>}
          <h2 id="panel-title" className="min-w-0 flex-1 text-xl font-bold text-slate-900">{title[view]}</h2>
          <button data-close type="button" onClick={onClose} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-300 text-xl text-slate-700 hover:bg-slate-50" aria-label="Paneli kapat">×</button>
        </header>
        <div className={"min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6 " + (view === "help" ? "flex flex-col" : "")}>
          {view === "address" && <AddressView address={address} onAddressChange={onAddressChange} onClose={onClose} />}
          {view === "profile" && <div className="space-y-3">
            <div className="mb-5 rounded-2xl bg-[#FFF1F6] p-5">
              <p className="text-sm font-semibold text-brand">HOŞ GELDİN</p>
              <p className="mt-2 text-xl font-bold text-slate-900">{account?.name ?? "Misafir kullanıcı"}</p>
              <p className="mt-1 text-sm text-slate-700">{account ? "Demo profilin oluşturuldu." : "Adreslerini, siparişlerini ve kuponlarını tek yerden yönet."}</p>
              <button type="button" onClick={() => onNavigate("account")} className="mt-4 min-h-11 rounded-xl border border-brand px-4 font-semibold text-brand hover:bg-white">{account ? "Profil bilgilerimi düzenle" : "Demo profil oluştur"}</button>
            </div>
            <PanelRow label="Kayıtlı adreslerim" detail={address ?? "Henüz adres seçilmedi"} onClick={() => onNavigate("address")} />
            <PanelRow label="Önceki siparişlerim" detail="Demo sipariş geçmişi" onClick={() => onNavigate("orders")} />
            <PanelRow label="Tanımlı kuponlarım" detail="Kupon durumlarını incele" onClick={() => onNavigate("coupons")} />
            <PanelRow label="Yardım / Canlı destek" detail="Otomatik örnek destek sohbeti" onClick={() => onNavigate("help")} />
            <div className="border-t border-slate-200 pt-4">
              <p className="mb-3 text-sm font-semibold text-slate-700">Sepetlerim</p>
              <div className="grid grid-cols-2 gap-3">
                <Link onClick={onClose} to="/cart/food" className="flex min-h-11 items-center justify-center rounded-xl border border-slate-300 px-2 text-center text-sm font-semibold hover:border-brand">Yemek ({foodCount})</Link>
                <Link onClick={onClose} to="/cart/market" className="flex min-h-11 items-center justify-center rounded-xl border border-slate-300 px-2 text-center text-sm font-semibold hover:border-brand">Market ({marketCount})</Link>
              </div>
            </div>
          </div>}
          {view === "account" && <AccountView account={account} onSaveAccount={onSaveAccount} onNavigate={onNavigate} />}
          {view === "orders" && <div className="space-y-4">
            {lastOrder ? <>
              <p className="rounded-xl bg-[#FFF1F6] p-4 text-slate-700">Bu tarayıcı sekmesinde son oluşturduğun demo sipariş:</p>
              <dl className="space-y-3 rounded-xl border border-slate-300 bg-white p-4">
                <div><dt className="text-sm text-slate-600">Sipariş numarası</dt><dd className="font-bold">{lastOrder.orderId}</dd></div>
                <div><dt className="text-sm text-slate-600">Hizmet</dt><dd className="font-semibold">{lastOrder.service === "food" ? "YEMEK" : "MARKET"}</dd></div>
              </dl>
              <Link to="/success" onClick={onClose} className="btn-primary w-full">Sipariş takibini aç</Link>
            </> : <>
              <p className="rounded-xl bg-slate-50 p-4 text-slate-700">Henüz demo sipariş oluşturmadın. Sipariş tamamlandıktan sonra takip ekranına buradan tekrar erişebilirsin.</p>
              <Link to="/food" onClick={onClose} className="btn-primary w-full">Yemekleri keşfet</Link>
            </>}
          </div>}
          {view === "coupons" && <div className="space-y-4">
            <p className="rounded-xl bg-slate-50 p-4 text-slate-700">Bu eğitim simülasyonunda henüz tanımlı gerçek veya kullanılabilir kupon yok.</p>
            <div className="rounded-xl border border-dashed border-slate-300 p-5"><p className="font-semibold">Kuponun yok</p><p className="mt-2 text-sm text-slate-600">Aktif, kullanılmış ve süresi dolmuş kupon durumları sonraki sürümde gösterilecek.</p></div>
          </div>}
          {view === "help" && <HelpView />}
        </div>
        <div className="shrink-0 border-t border-slate-200 bg-slate-50 px-4 py-3 text-center text-xs text-slate-600 sm:px-6">Bağımsız HCI öğrenci projesi · Gerçek müşteri desteği değildir.</div>
      </aside>
    </div>
  );
}
