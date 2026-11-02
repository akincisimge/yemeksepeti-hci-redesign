import { useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCart } from "../state/CartContext";
import { formatTRY, type PaymentMethod, type Service } from "../types/domain";

export default function CheckoutPage() {
  const { service: segment } = useParams();
  const service: Service = segment === "market" ? "market" : "food";
  const { carts, total, clear } = useCart();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("cash-demo");
  const [error, setError] = useState("");
  const amount = total(service);
  const lines = carts[service];
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!lines.length) { setError("Sepet boş olduğu için sipariş oluşturulamaz."); return; }
    if (name.trim().length < 2 || address.trim().length < 10) {
      setError("Ad soyad ve en az 10 karakterlik örnek teslimat adresi gir.");
      return;
    }
    setError("");
    const orderId = "DEMO-" + Date.now().toString().slice(-7);
    clear(service);
    navigate("/success", { state: { orderId, amount, service, method }, replace: true });
  };
  return <div className="mx-auto max-w-4xl space-y-7">
    <div><p className="font-semibold text-brand">Adım 2 / 2</p><h1 className="text-3xl font-bold">Siparişi tamamla</h1>
      <p className="mt-2 text-slate-600">Gerçek adres veya kart bilgisi kullanma. Sipariş yalnızca bu tarayıcıda simüle edilir.</p></div>
    <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
      <form onSubmit={submit} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6" noValidate>
        <label className="block"><span className="mb-2 block font-semibold">Ad soyad <span aria-hidden="true">*</span></span>
          <input className="field" autoComplete="off" value={name} onChange={(e) => setName(e.target.value)} required aria-required="true" placeholder="Örnek Kullanıcı" /></label>
        <label className="block"><span className="mb-2 block font-semibold">Demo teslimat adresi <span aria-hidden="true">*</span></span>
          <textarea className="field" rows={3} value={address} onChange={(e) => setAddress(e.target.value)} required aria-required="true" placeholder="Örn. Üniversite kampüsü, A blok..." /></label>
        <fieldset className="space-y-3"><legend className="font-semibold">Demo ödeme yöntemi</legend>
          <label className="flex items-center gap-3"><input type="radio" name="payment" checked={method === "cash-demo"} onChange={() => setMethod("cash-demo")} /> Teslimatta ödeme (simülasyon)</label>
          <label className="flex items-center gap-3"><input type="radio" name="payment" checked={method === "card-demo"} onChange={() => setMethod("card-demo")} /> Kartla ödeme (simülasyon, kart bilgisi istenmez)</label>
        </fieldset>
        {error && <p role="alert" className="rounded-xl bg-red-50 p-3 font-semibold text-red-800">{error}</p>}
        <button type="submit" className="btn-primary w-full" disabled={!lines.length}>Demo siparişi tamamla</button>
        {!lines.length && <p className="text-sm text-red-700">Devam etmek için önce sepete ürün eklemelisin.</p>}
        <Link to={"/cart/" + service} className="inline-block font-semibold text-brand underline">Sepete geri dön</Link>
      </form>
      <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="mb-4 text-xl font-bold">Sipariş özeti</h2>
        <ul className="space-y-3">{lines.map(({ product, quantity }) => <li key={product.id} className="flex justify-between gap-3 text-sm"><span>{quantity} × {product.name}</span><span>{formatTRY(product.price * quantity)}</span></li>)}</ul>
        <div className="mt-5 flex justify-between border-t border-slate-200 pt-4"><strong>Toplam</strong><strong>{formatTRY(amount)}</strong></div>
      </aside>
    </div>
  </div>;
}
