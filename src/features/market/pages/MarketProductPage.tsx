import { useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { marketProducts } from "../data/marketData";
import MarketBasket from "../components/MarketBasket";
import { useCart } from "../../../state/CartContext";
import { formatTRY } from "../../../types/domain";
export default function MarketProductPage() {
  const location = useLocation();
  const { productId } = useParams();
  const product = marketProducts.find(p=>p.id.toLowerCase()===productId?.trim().toLowerCase());
  const { add, carts } = useCart();
  const [notice, setNotice] = useState("");
  if (!product) return <section className="space-y-4"><h1 className="text-2xl font-bold">Ürün bulunamadı</h1><Link className="btn-primary" to="/market">Marketlere dön</Link></section>;
  const returnTo = typeof location.state?.returnTo === "string" && (location.state.returnTo === `/market/${product.storeId}` || location.state.returnTo.startsWith(`/market/${product.storeId}?`)) ? location.state.returnTo : `/market/${product.storeId}`;
  const quantity = carts.market.find(line=>line.product.id===product.id && line.product.storeId===product.storeId)?.quantity ?? 0;
  return <div className="space-y-6">
    <Link to={returnTo} className="nav-link">← {product.storeName} ürünlerine dön</Link>
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <article className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
        <div className="flex min-h-56 items-center justify-center rounded-2xl bg-slate-50">{product.image?<img src={product.image} alt={product.name} className="h-56 w-full object-contain p-5"/>:<span aria-hidden="true" className="text-8xl">🛍️</span>}</div>
        <p className="mt-6 text-sm font-semibold text-brand">{product.storeName} · {product.category}</p>
        <h1 className="mt-3 text-3xl font-bold">{product.name}</h1>
        <p className="mt-3 text-slate-600">{product.brand} · {product.unitLabel ?? product.description}</p>
        {!!product.tags?.length && <p className="mt-3 font-medium text-green-800">{product.tags.join(" · ")}</p>}
        <p className="mt-6 text-3xl font-bold">{formatTRY(product.price)}</p>
        {product.unitPrice != null && <p className="mt-2 text-sm text-slate-600">{formatTRY(product.unitPrice)} / {product.unitBasis}</p>}
        <button className="btn-primary mt-6 w-full" onClick={()=>setNotice(add(product)==="added"?`${product.name} sepete eklendi. Sepette ${quantity+1} adet.`:"Mağaza değişikliği iptal edildi. Sepetin korundu.")}>+ Sepete ekle{quantity>0?` · Sepette ${quantity} adet`:""}</button>
        <p role="status" aria-live="polite" className="mt-3 min-h-6 text-sm font-semibold text-green-800">{notice}</p>
        <Link to="/cart/market" className="mt-3 flex min-h-11 items-center justify-center rounded-xl border border-slate-300 font-semibold text-brand">Sepeti görüntüle</Link>
        <p className="mt-5 text-sm text-slate-500">Ürün, fiyat ve beslenme bilgileri HCI prototipi için örnektir. Gerçek sipariş oluşturulmaz.</p>
      </article>
      <aside className="sticky top-40 hidden lg:block"><MarketBasket onNotice={setNotice}/></aside>
    </div>
  </div>;
}
