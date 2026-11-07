import { Link, useLocation } from "react-router-dom";
import { formatTRY, type Product } from "../../../types/domain";
import { useCart } from "../../../state/CartContext";
export default function MarketProductCard({ product, onAdd, onNotice }: {
  product: Product; onAdd: (product: Product) => void; onNotice: (text: string) => void;
}) {
  const location = useLocation();
  const detailState = { returnTo: location.pathname + location.search };
  const { carts, change } = useCart();
  const quantity = carts.market.find(line => line.product.id === product.id && line.product.storeId === product.storeId)?.quantity ?? 0;
  return <article className="flex h-full min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-3 sm:p-4 transition hover:border-brand">
    <Link to={`/market/product/${product.id}`} state={detailState} className="flex h-36 items-center justify-center rounded-xl bg-slate-50" aria-label={`${product.name} ürün detayını aç`}>
      {product.image ? <img loading="lazy" src={product.image} alt="" className="h-28 w-full object-contain" /> : <span aria-hidden="true" className="text-5xl">{({"Süt ve Kahvaltılık":"🥛","Fırın":"🍞","Meyve ve Sebze":"🍎","Temel Gıda":"🍝","İçecek":"🧃","Temizlik":"🧴"} as Record<string,string>)[product.category] ?? "🛍️"}</span>}
    </Link>
    <p className="mt-4 text-sm text-slate-600">{product.brand ?? product.storeName}</p>
    <h3 className="mt-1 min-h-12 line-clamp-2 break-words font-semibold leading-6"><Link to={`/market/product/${product.id}`} state={detailState} className="hover:text-brand">{product.name}</Link></h3>
    <p className="mt-1 line-clamp-2 break-words text-sm text-slate-600">{product.unitLabel ?? product.description}</p>
    {!!product.tags?.length && <p className="mt-2 text-sm font-medium text-green-800">{product.tags.join(" · ")}</p>}
    <div className="mt-auto pt-4"><p className="text-xl font-bold">{formatTRY(product.price)}</p>
      <p className="mt-1 min-h-5 text-sm text-slate-600">{product.unitPrice != null ? `${formatTRY(product.unitPrice)} / ${product.unitBasis}` : ""}</p>
      {quantity ? <div className="mt-3 flex items-center justify-between rounded-xl bg-[#FFF1F6] p-1">
        <button className="quantity" aria-label={`${product.name} miktarını azalt`} onClick={() => { change("market", product.id, -1); onNotice(quantity === 1 ? `${product.name} sepetten çıkarıldı.` : `${product.name}: ${quantity - 1} adet.`); }}><span aria-hidden="true">−</span><span className="sr-only">Miktarı azalt</span></button>
        <span className="font-bold"><span aria-hidden="true">{quantity}</span><span className="sr-only">{quantity} adet</span></span>
        <button className="quantity" aria-label={`${product.name} miktarını artır`} onClick={() => onAdd(product)}><span aria-hidden="true">+</span><span className="sr-only">Miktarı artır</span></button>
      </div> : <button className="btn-primary mt-3 w-full" aria-label={`${product.name} sepete ekle`} onClick={() => onAdd(product)}>+ Sepete ekle</button>}
    </div>
  </article>;
}
