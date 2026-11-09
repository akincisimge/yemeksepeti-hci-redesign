import { useId } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../../state/CartContext";
import { marketStores } from "../data/marketData";
import { formatTRY } from "../../../types/domain";
export default function MarketBasket({ onNotice }: { onNotice: (text: string) => void }) {
  const headingId = useId();
  const { carts, total, change } = useCart();
  const lines = carts.market;
  const store = marketStores.find(s => s.id === lines[0]?.product.storeId);
  const subtotal = total("market");
  const remaining = Math.max(0, (store?.minBasket ?? 0) - subtotal);
  return <section aria-labelledby={headingId} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex items-center justify-between gap-3"><h2 id={headingId} className="text-xl font-bold">Sepetim</h2><span className="text-sm text-slate-600">{lines.reduce((n,l)=>n+l.quantity,0)} ürün</span></div>
    {!lines.length ? <div className="py-10 text-center"><span className="text-4xl" aria-hidden="true">🛍️</span><p className="mt-4 font-semibold">Sepetin seni bekliyor</p><p className="mt-2 text-sm text-slate-600">Ürünlerdeki “Sepete ekle” butonuyla alışverişe başla.</p></div> : <>
      <p className="mt-2 text-sm font-medium text-brand">{store?.name ?? lines[0].product.storeName}</p>
      <ul className="mt-4 max-h-[36vh] space-y-4 overflow-y-auto pr-1">{lines.map(({product,quantity})=><li key={product.id} className="border-b border-slate-100 pb-4">
        <Link to={`/market/product/${product.id}`} className="font-semibold hover:text-brand">{product.name}</Link>
        <p className="mt-1 text-sm text-slate-600">{formatTRY(product.price)} / adet</p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2"><div className="flex items-center gap-2">
          <button className="quantity" aria-label={`Sepette ${product.name} miktarını azalt`} onClick={()=>{change("market",product.id,-1);onNotice(`${product.name} miktarı güncellendi.`);}}>−</button>
          <span className="min-w-5 text-center font-semibold">{quantity}</span>
          <button className="quantity" aria-label={`Sepette ${product.name} miktarını artır`} onClick={()=>{change("market",product.id,1);onNotice(`${product.name} miktarı güncellendi.`);}}>+</button>
        </div><strong>{formatTRY(product.price*quantity)}</strong></div>
        <button className="mt-1 min-h-11 text-sm font-semibold text-red-800 underline" aria-label={`${product.name} sepetten sil`} onClick={()=>{change("market",product.id,-quantity);onNotice(`${product.name} sepetten çıkarıldı.`);}}>Sil</button>
      </li>)}</ul>
      <dl className="mt-4 space-y-3 text-sm"><div className="flex justify-between"><dt>Ürün toplamı</dt><dd>{formatTRY(subtotal)}</dd></div><div className="flex justify-between"><dt>Teslimat ücreti</dt><dd>{formatTRY(store?.deliveryFee ?? 0)}</dd></div><div className="flex justify-between border-t border-slate-200 pt-3 text-base font-bold"><dt>Genel toplam</dt><dd>{formatTRY(subtotal+(store?.deliveryFee ?? 0))}</dd></div></dl>
      {remaining>0 && <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">Minimum sepet {formatTRY(store?.minBasket ?? 0)}. {formatTRY(remaining)} daha ürün ekle.</p>}
      {remaining>0 ? <button disabled className="btn-primary mt-4 w-full">Siparişi tamamla</button> : <Link className="btn-primary mt-4 w-full" to="/checkout/market">Siparişi tamamla →</Link>}
      <Link className="mt-2 flex min-h-11 items-center justify-center text-sm font-semibold text-brand underline" to="/cart/market">Sepetin tamamını görüntüle</Link>
    </>}
  </section>;
}
