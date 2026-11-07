import { Link, useParams } from "react-router-dom";
import { useCart } from "../state/CartContext";
import { formatTRY, type Service } from "../types/domain";

export default function CartPage() {
  const { service: segment } = useParams();
  const service: Service = segment === "market" ? "market" : "food";
  const { carts, change, total } = useCart();
  const lines = carts[service];
  return <div className="mx-auto max-w-3xl space-y-6">
    <h1 className="text-3xl font-bold">{service === "food" ? "Yemek" : "Market"} sepeti</h1>
    {lines.length === 0 ? <div className="rounded-2xl bg-white p-8">
      <p className="mb-5 text-slate-700">Sepetin boş. Sipariş vermek için ürün ekle.</p>
      <Link to={"/" + service} className="btn-primary">Ürünlere dön</Link>
    </div> : <>
      <ul className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white px-5">
        {lines.map(({ product, quantity }) => <li key={product.id} className="flex flex-wrap items-center justify-between gap-3 py-5">
          <div className="min-w-44"><strong>{product.name}</strong><p className="text-sm text-slate-600">{product.storeName}</p><p className="mt-1 text-sm">{formatTRY(product.price * quantity)}</p></div>
          <div className="flex items-center gap-3">
            <button type="button" className="quantity" onClick={() => change(service, product.id, -1)} aria-label={product.name + " miktarını azalt"}><span aria-hidden="true">−</span><span className="sr-only">Miktarı azalt</span></button>
            <span aria-live="polite" className="w-6 text-center font-bold">{quantity}</span>
            <button type="button" className="quantity" onClick={() => change(service, product.id, 1)} aria-label={product.name + " miktarını artır"}><span aria-hidden="true">+</span><span className="sr-only">Miktarı artır</span></button>
            <button type="button" className="ml-2 text-sm font-semibold text-red-700 underline" onClick={() => change(service, product.id, -quantity)}>Sil</button>
          </div>
        </li>)}
      </ul>
      <div className="rounded-2xl bg-white p-6">
        <div className="flex items-center justify-between text-lg"><span>Ara toplam</span><strong>{formatTRY(total(service))}</strong></div>
        <p className="mt-2 text-sm text-slate-600">Bu sürümde teslimat ücreti 0 TL olarak simüle edilir. Sonraki sürümde ücretler açıkça modellenecek.</p>
        <Link className="btn-primary mt-5 w-full text-center" to={"/checkout/" + service}>Siparişi gözden geçir</Link>
      </div>
    </>}
  </div>;
}
