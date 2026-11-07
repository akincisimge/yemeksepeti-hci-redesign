import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { marketProducts, marketStores } from "../data/marketData";
import { emptyFilters, filterProducts, searchSuggestion, type Filters, type Sort } from "../filterProducts";
import MarketProductCard from "../components/MarketProductCard";
import Modal from "../../../components/Modal";
import MarketFilters from "../components/MarketFilters";
import MarketBasket from "../components/MarketBasket";
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
  const [basketOpen, setBasketOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  useEffect(()=>{setNotice("");setBasketOpen(false);setFiltersOpen(false);},[storeId]);
  useEffect(() => {
    if (!window.matchMedia) return;
    const query = window.matchMedia("(min-width: 1024px)");
    const resize = () => { if (query.matches) { setBasketOpen(false); setFiltersOpen(false); } };
    query.addEventListener("change", resize);
    return () => query.removeEventListener("change", resize);
  }, []);
  const store = marketStores.find(s=>s.id===storeId);
  const products = marketProducts.filter(p=>p.storeId===storeId);
  const filtered = filterProducts(products,filters);
  const pageSize = 24;
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const requestedPage = Number(params.get("page") ?? 1);
  const page = Number.isInteger(requestedPage) && requestedPage > 0 ? Math.min(requestedPage, pageCount) : 1;
  const pageProducts = filtered.slice((page - 1) * pageSize, page * pageSize);
  function changePage(next: number) {
    setParams(old => { const query = new URLSearchParams(old); query.set("page", String(next)); return query; }, { preventScrollReset: true });
    requestAnimationFrame(() => document.getElementById("market-results")?.focus());
  }
  const suggestion = filtered.length ? null : searchSuggestion(products, filters);
  const patchFilters = (patch: Partial<Filters>) => setFilters(old => ({ ...old, ...patch }));
  function update<K extends keyof Filters>(key: K, value: Filters[K]) { setFilters(old=>({...old,[key]:value})); }
  function chooseCategory(category: string) {setFilters(old=>({...old,category,brand:"all",tag:"all",basis:"all",pack:"all",sort:old.sort==="unit"?"default":old.sort}));}
  function addProduct(product: Product) {
    const quantity = carts.market.find(line=>line.product.id===product.id && line.product.storeId===product.storeId)?.quantity ?? 0;
    setNotice(add(product)==="added" ? `${product.name} sepete eklendi. Sepette ${quantity + 1} adet.` : "Mağaza değişikliği iptal edildi. Sepetin korundu.");
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
      <p className="mt-4 text-sm text-slate-500">HCI prototipi · Katalog, fiyatlar, beslenme etiketleri ve teslimat bilgileri örnek veridir.</p>
    </header>
    <div className="grid items-start gap-6 lg:grid-cols-[200px_minmax(0,1fr)_300px] xl:grid-cols-[220px_minmax(0,1fr)_320px]">
      <aside aria-label="Masaüstü filtreleri" className="sticky top-40 hidden max-h-[calc(100dvh-11rem)] overflow-y-auto lg:block"><MarketFilters products={products} filters={filters} onChange={patchFilters} onCategory={chooseCategory} /></aside>
      <div className="min-w-0 space-y-5">
        <section aria-label="Ürün arama" className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4">
          <label className="block"><span className="mb-2 block font-semibold">Ne arıyorsun?</span><input type="search" maxLength={80} className="field min-h-12" placeholder="Ürün, marka veya kategori ara…" value={filters.search} onChange={event=>update("search",event.target.value)} /></label>
          <button type="button" className="filter w-full lg:hidden" aria-haspopup="dialog" aria-expanded={filtersOpen} onClick={()=>setFiltersOpen(true)}>Filtrele{active.length ? ` (${active.length})` : ""}</button>
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Seçili filtreler">{active.map(chip=><button key={chip.label} className="filter-active max-w-full break-words" onClick={chip.clear} aria-label={`${chip.label} filtresini kaldır`}>{chip.label} ×</button>)}{active.length>0 && <button className="min-h-11 px-2 text-sm font-semibold text-brand underline" onClick={()=>setFilters({...emptyFilters})}>Tümünü temizle</button>}</div>
        </section>
        <div className="flex flex-wrap items-end justify-between gap-4"><div><h2 id="market-results" tabIndex={-1} className="scroll-mt-40 text-xl font-bold">{filters.category==="all"?"Tüm ürünler":filters.category}</h2><p role="status" className="mt-1 text-sm text-slate-600">{filtered.length} ürün bulundu</p></div><label><span className="mb-2 block text-sm font-semibold">Sıralama</span><select className="field" value={filters.sort} onChange={e=>update("sort",e.target.value as Sort)}><option value="default">Önerilen sıralama</option><option value="price-asc">Fiyat: düşükten yükseğe</option><option value="price-desc">Fiyat: yüksekten düşüğe</option><option value="name">Ürün adı: A–Z</option>{filters.basis!=="all" && <option value="unit">Birim fiyat: düşükten yükseğe</option>}</select></label></div>
        <p role="status" aria-live="polite" aria-atomic="true" className="min-h-6 text-sm font-semibold text-green-800">{notice}</p>
        {filtered.length ? <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">{pageProducts.map(product=><MarketProductCard key={product.id} product={product} onAdd={addProduct} onNotice={setNotice} />)}</div> : <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center"><h3 className="text-xl font-bold">Aradığın ürün bulunamadı</h3><p className="mt-3 text-slate-600">Aramanı kısaltabilir veya seçili filtrelerden birini kaldırabilirsin.</p>{suggestion && <button type="button" className="mt-5 min-h-11 max-w-full rounded-xl border border-brand px-4 py-3 font-semibold text-brand" onClick={()=>update("search",suggestion)}>Bunu mu demek istediniz: {suggestion}?</button>}<button className="btn-primary mt-5" onClick={()=>setFilters({...emptyFilters})}>Tüm filtreleri temizle</button></section>}
        {pageCount > 1 && <nav aria-label="Ürün sayfaları" className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4">
          <button type="button" className="filter" disabled={page === 1} onClick={() => changePage(page - 1)}>← Önceki</button>
          <p aria-live="polite" className="text-sm text-slate-700">Sayfa {page} / {pageCount} · {filtered.length} ürün</p>
          <button type="button" className="filter" disabled={page === pageCount} onClick={() => changePage(page + 1)}>Sonraki →</button>
        </nav>}
      </div>
      <aside className="sticky top-40 hidden lg:block"><MarketBasket onNotice={setNotice} /></aside>
    </div>
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white p-3 pb-[max(12px,env(safe-area-inset-bottom))] lg:hidden"><button className="btn-primary mx-auto flex w-full max-w-xl justify-between" onClick={()=>setBasketOpen(true)} aria-haspopup="dialog"><span aria-live="polite" aria-atomic="true">Sepetim · {count("market")} ürün</span><span>{formatTRY(total("market")+(carts.market.length?(basketStore?.deliveryFee ?? 0):0))} →</span></button></div>
    <Modal open={basketOpen} title="Market sepetin" onClose={()=>setBasketOpen(false)}><MarketBasket onNotice={setNotice} /></Modal>
    <Modal open={filtersOpen} title="Filtreler" onClose={()=>setFiltersOpen(false)}>
      <MarketFilters products={products} filters={filters} onChange={patchFilters} onCategory={chooseCategory} />
      <button type="button" className="btn-primary mt-4 w-full" onClick={()=>setFiltersOpen(false)}>{filtered.length} ürünü göster</button>
    </Modal>
  </div>;
}
