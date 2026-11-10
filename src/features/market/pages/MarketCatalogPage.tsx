import { useEffect, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { marketProducts, marketStores } from "../data/marketData";
import { emptyFilters, filterProducts, type Filters, type Sort } from "../filterProducts";
import MarketProductCard from "../components/MarketProductCard";
import MarketBasket from "../components/MarketBasket";
import StoreSwitchDialog from "../../../components/StoreSwitchDialog";
import { useCart } from "../../../state/CartContext";
import { formatTRY, type Product } from "../../../types/domain";
import { useDelivery } from "../../../state/DeliveryContext";
import { locationLabel } from "../../../data/delivery";

export default function MarketCatalogPage() {
  const { storeId } = useParams();
  const { add, count, total, carts } = useCart();
  const { delivery } = useDelivery();
  const [params, setParams] = useSearchParams();
  const filters = { ...emptyFilters };
  for (const key of Object.keys(emptyFilters) as (keyof Filters)[]) {
    const value = params.get(key);
    if (value !== null) Object.assign(filters, { [key]: value });
  }
  if (!["all", "kg", "L", "adet"].includes(filters.basis)) filters.basis = "all";
  if (!["default", "price-asc", "price-desc", "name", "unit"].includes(filters.sort)) filters.sort = "default";
  if (filters.sort === "unit" && filters.basis === "all") filters.sort = "default";
  if (filters.maxPrice !== "" && (!Number.isFinite(Number(filters.maxPrice)) || Number(filters.maxPrice) < 0)) filters.maxPrice = "";
  function setFilters(next: Filters | ((old: Filters) => Filters)) {
    const value = typeof next === "function" ? next(filters) : next;
    const query = new URLSearchParams();
    for (const key of Object.keys(emptyFilters) as (keyof Filters)[]) {
      if (value[key] !== emptyFilters[key]) query.set(key, value[key]);
    }
    setParams(query, { replace: true, preventScrollReset: true });
  }
  const [notice, setNotice] = useState("");
  const [pendingProduct, setPendingProduct] = useState<Product | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const basketButton = useRef<HTMLButtonElement>(null);
  useEffect(()=>{setNotice("");setPendingProduct(null);dialog.current?.close();},[storeId]);
  const store = marketStores.find(s=>s.id===storeId);
  const products = marketProducts.filter(p=>p.storeId===storeId);
  const categories = [...new Set(products.map(p=>p.category))];
  const categoryProducts = products.filter(p=>filters.category==="all" || p.category===filters.category);
  const brands = [...new Set(categoryProducts.map(p=>p.brand).filter((b):b is string=>!!b))];
  const tags = [...new Set(categoryProducts.flatMap(p=>p.tags ?? []))];
  const filtered = filterProducts(products,filters);
  function update<K extends keyof Filters>(key: K, value: Filters[K]) { setFilters(old=>({...old,[key]:value})); }
  function chooseCategory(category: string) {setFilters(old=>({...old,category,brand:"all",tag:"all",basis:"all",pack:"all",sort:old.sort==="unit"?"default":old.sort}));}
  function addProduct(product: Product) {
    const activeMarketStoreId = carts.market[0]?.product.storeId;
    if (activeMarketStoreId && activeMarketStoreId !== product.storeId) {
      setPendingProduct(product);
      setNotice("");
      return;
    }
    const quantity = carts.market.find(line=>line.product.id===product.id && line.product.storeId===product.storeId)?.quantity ?? 0;
    setNotice(add(product)==="added" ? `${product.name} sepete eklendi. Sepette ${quantity + 1} adet.` : "Mağaza değişikliği iptal edildi. Sepetin korundu.");
  }
  function confirmMarketSwitch() {
    if (!pendingProduct) return;
    const product = pendingProduct;
    setPendingProduct(null);
    add(product, { replace: true });
    setNotice(`${product.name} yeni market sepetine eklendi.`);
  }
  function cancelMarketSwitch() {
    setPendingProduct(null);
    setNotice("Mağaza değişikliği iptal edildi. Mevcut sepetin korundu.");
  }
  const active = [
    filters.search && {label:`Arama: ${filters.search}`,clear:()=>update("search","")},
    filters.category!=="all" && {label:filters.category,clear:()=>chooseCategory("all")},
    filters.pack!=="all" && {label:`Paket: ${filters.pack}`,clear:()=>update("pack","all")},
    filters.brand!=="all" && {label:filters.brand,clear:()=>update("brand","all")},
    filters.tag!=="all" && {label:filters.tag,clear:()=>update("tag","all")},
    filters.maxPrice!=="" && {label:`En fazla ${formatTRY(Number(filters.maxPrice))}`,clear:()=>update("maxPrice","")},
    filters.basis!=="all" && {label:`Birim: ${filters.basis}`,clear:()=>setFilters(old=>({...old,basis:"all",sort:old.sort==="unit"?"default":old.sort}))},
  ].filter((x): x is {label:string;clear:()=>void}=>!!x);
  const basketStore = marketStores.find(s=>s.id===carts.market[0]?.product.storeId);
  if (!store) return <section><h1 className="text-2xl font-bold">Mağaza bulunamadı</h1><Link className="nav-link" to="/market">Marketlere dön</Link></section>;
  return <div className="space-y-6 pb-24 lg:pb-0">
    <Link to="/market" className="inline-flex min-h-11 items-center font-semibold text-slate-600 hover:text-brand">← Marketlere dön</Link>
    <header className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-7">
      <div className="flex items-center gap-4">{store.logo && <img src={store.logo} alt="" className="h-16 w-16 rounded-xl object-contain" />}<div><p className="text-sm font-semibold text-brand">Mahallendeki market</p><h1 className="mt-1 text-3xl font-bold">{store.name}</h1></div></div>
      <p className="mt-4 text-sm text-slate-600">{delivery && locationLabel(delivery)}</p>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm"><span>Teslimat: {store.deliveryTime}</span><span>Teslimat ücreti: {formatTRY(store.deliveryFee ?? 0)}</span><span>Minimum sepet: {formatTRY(store.minBasket ?? 0)}</span></div>
      <p className="mt-4 text-sm text-slate-600">HCI prototipi · Katalog, fiyatlar, beslenme etiketleri ve teslimat bilgileri örnek veridir.</p>
    </header>
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="min-w-0 space-y-5">
        <section aria-label="Ürün arama ve filtreler" className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5">
          <label className="block"><span className="mb-2 block font-semibold">Ne arıyorsun?</span><input type="search" className="field min-h-12" placeholder="Ürün, marka veya kategori ara…" value={filters.search} onChange={e=>update("search",e.target.value)} /></label>
          <fieldset><legend className="mb-3 font-semibold">Kategoriler</legend><div className="flex flex-wrap gap-2">{["all",...categories].map(category=><button type="button" key={category} aria-pressed={filters.category===category} className={filters.category===category?"filter-active":"filter"} onClick={()=>chooseCategory(category)}>{category==="all"?"Tüm ürünler":category} <span className="ml-1 text-xs">({category==="all"?products.length:products.filter(p=>p.category===category).length})</span></button>)}</div></fieldset>
          <div className="grid gap-4 sm:grid-cols-2">
            <label><span className="mb-2 block text-sm font-semibold">Marka</span><select className="field" value={filters.brand} onChange={e=>update("brand",e.target.value)}><option value="all">Tüm markalar</option>{brands.map(b=><option key={b}>{b}</option>)}</select></label>
            <label><span className="mb-2 block text-sm font-semibold">En yüksek fiyat (TL)</span><input type="number" min="0" step="0.01" inputMode="decimal" className="field" placeholder="Sınır yok" value={filters.maxPrice} onChange={e=>update("maxPrice",e.target.value===""?"":String(Math.max(0,Number(e.target.value))))} /></label>
            {!!tags.length && <label><span className="mb-2 block text-sm font-semibold">Beslenme tercihi</span><select className="field" value={filters.tag} onChange={e=>update("tag",e.target.value)}><option value="all">Tüm seçenekler</option>{tags.map(t=><option key={t}>{t}</option>)}</select></label>}
            <label><span className="mb-2 block text-sm font-semibold">Gramaj / paket miktarı</span><select className="field" value={filters.pack} onChange={e=>update("pack",e.target.value)}><option value="all">Tüm paketler</option>{[...new Set(categoryProducts.map(p=>p.unitLabel).filter(Boolean))].map(pack=><option key={pack}>{pack}</option>)}</select></label>
            <label><span className="mb-2 block text-sm font-semibold">Birim karşılaştırması</span><select className="field" value={filters.basis} onChange={e=>setFilters(old=>({...old,basis:e.target.value,sort:e.target.value==="all"&&old.sort==="unit"?"default":old.sort}))}><option value="all">Tüm birimler</option>{[...new Set(categoryProducts.map(p=>p.unitBasis).filter(Boolean))].map(b=><option key={b} value={b}>{b} başına fiyatı olanlar</option>)}</select></label>
          </div>
          <div className="flex flex-wrap items-center gap-2" aria-label="Seçili filtreler">{active.map(chip=><button key={chip.label} className="filter-active" onClick={chip.clear} aria-label={`${chip.label} filtresini kaldır`}>{chip.label} ×</button>)}{active.length>0 && <button className="min-h-11 px-2 text-sm font-semibold text-brand underline" onClick={()=>setFilters({...emptyFilters})}>Tümünü temizle</button>}</div>
        </section>
        <div className="flex flex-wrap items-end justify-between gap-4"><div><h2 className="text-xl font-bold">{filters.category==="all"?"Tüm ürünler":filters.category}</h2><p role="status" className="mt-1 text-sm text-slate-600">{filtered.length} ürün bulundu</p></div><label><span className="mb-2 block text-sm font-semibold">Sıralama</span><select className="field" value={filters.sort} onChange={e=>update("sort",e.target.value as Sort)}><option value="default">Önerilen sıralama</option><option value="price-asc">Fiyat: düşükten yükseğe</option><option value="price-desc">Fiyat: yüksekten düşüğe</option><option value="name">Ürün adı: A–Z</option>{filters.basis!=="all" && <option value="unit">Birim fiyat: düşükten yükseğe</option>}</select></label></div>
        <p role="status" aria-live="polite" aria-atomic="true" className="min-h-6 text-sm font-semibold text-green-800">{notice}</p>
        {filtered.length ? <div className="grid gap-4 min-[440px]:grid-cols-2 xl:grid-cols-3">{filtered.map(product=><MarketProductCard key={product.id} product={product} onAdd={addProduct} onNotice={setNotice} />)}</div> : <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center"><h3 className="text-xl font-bold">Aradığın ürün bulunamadı</h3><p className="mt-3 text-slate-600">Aramanı kısaltabilir veya seçili filtrelerden birini kaldırabilirsin.</p><button className="btn-primary mt-5" onClick={()=>setFilters({...emptyFilters})}>Tüm filtreleri temizle</button></section>}
      </div>
      <aside className="sticky top-40 hidden lg:block"><MarketBasket onNotice={setNotice} /></aside>
    </div>
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white p-3 pb-[max(12px,env(safe-area-inset-bottom))] lg:hidden"><button ref={basketButton} className="btn-primary mx-auto flex w-full max-w-xl justify-between" onClick={()=>dialog.current?.showModal()} aria-haspopup="dialog"><span>Sepetim · {count("market")} ürün</span><span>{formatTRY(total("market")+(carts.market.length?(basketStore?.deliveryFee ?? 0):0))} →</span></button></div>
    <dialog ref={dialog} aria-label="Market sepetin" onClose={()=>basketButton.current?.focus()} onClick={e=>{if(e.target===e.currentTarget)dialog.current?.close();}} className="fixed inset-0 m-auto max-h-[85dvh] w-[calc(100%_-_24px)] max-w-md overflow-y-auto rounded-3xl bg-white p-4 backdrop:bg-slate-900/40"><button autoFocus className="mb-3 min-h-11 w-full rounded-xl border border-slate-300 font-semibold" onClick={()=>dialog.current?.close()}>Alışverişe dön · Kapat ×</button><MarketBasket onNotice={setNotice} /></dialog>
    <StoreSwitchDialog
      pendingProduct={pendingProduct}
      currentStoreName={basketStore?.name ?? carts.market[0]?.product.storeName ?? ""}
      serviceLabel="market"
      onCancel={cancelMarketSwitch}
      onConfirm={confirmMarketSwitch}
    />
  </div>;
}
