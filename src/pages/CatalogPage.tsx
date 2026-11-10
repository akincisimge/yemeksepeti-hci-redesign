import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { products, stores } from "../data/catalog";
import { useDelivery } from "../state/DeliveryContext";
import { useCart } from "../state/CartContext";
import { formatTRY, type Service } from "../types/domain";

export default function CatalogPage({ service }: { service: Service }) {
  const { available } = useDelivery();
  const [params] = useSearchParams();
  const [storeId, setStoreId] = useState(params.get("store") ?? (service === "food" ? "f-1" : "m-1"));
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tümü");
  const [notice, setNotice] = useState("");
  const { add, count } = useCart();
  const serviceStores = stores.filter((store) => store.service === service && available(store.id));
  const activeStore = serviceStores.find((store) => store.id === storeId) ?? serviceStores[0];
  const inStore = products.filter((item) => item.storeId === activeStore?.id);
  const categories = ["Tümü", ...new Set(inStore.map((item) => item.category))];
  const filtered = useMemo(() => inStore.filter((item) =>
    (category === "Tümü" || item.category === category) &&
    (item.name + " " + item.description).toLocaleLowerCase("tr").includes(search.toLocaleLowerCase("tr"))
  ), [inStore, search, category]);
  const chooseStore = (id: string) => {
    setStoreId(id); setCategory("Tümü"); setSearch(""); setNotice("");
  };
  if (!activeStore) return <section className="space-y-4 rounded-2xl bg-white p-8"><h1 className="text-2xl font-bold">Bu konumda henüz hizmet veren restoran bulunmuyor</h1><p>Üstteki konum butonundan başka bir mahalle seçebilirsin.</p></section>;
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-brand">{service === "food" ? "Restoran keşfi" : "Market alışverişi"}</p>
          <h1 className="text-3xl font-bold">{service === "food" ? "Yemek" : "Market"} bölümü</h1>
          <p className="mt-2 text-sm text-slate-600">Bu katalog ekip üyelerinin geliştireceği ekranlar için çalışan başlangıç iskeletidir.</p>
        </div>
        <Link className="btn-primary" to={"/cart/" + service}>Sepeti görüntüle ({count(service)})</Link>
      </div>
      {service === "market" && <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="mb-3 text-lg font-bold">Market türü seç</h2>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={activeStore.group === "ymarket" ? "filter-active" : "filter"} onClick={() => chooseStore("m-1")}>Yemeksepeti Market</button>
          <button type="button" className={activeStore.group === "other" ? "filter-active" : "filter"} onClick={() => chooseStore("m-2")}>Diğer Marketler</button>
        </div>
      </div>}
      {service === "food" && <div className="flex flex-wrap gap-2" aria-label="Restoran seç">
        {serviceStores.map((store) => <button type="button" key={store.id} onClick={() => chooseStore(store.id)} className={store.id === activeStore.id ? "filter-active" : "filter"} aria-pressed={store.id === activeStore.id}>{store.name}</button>)}
      </div>}
      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
        <div>
          <h2 className="text-xl font-bold">{activeStore.name}</h2>
          <p className="text-sm text-slate-600">{activeStore.description}</p>
        </div>
        <label className="block">
          <span className="mb-2 block font-semibold">Ürün ara</span>
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} className="field" placeholder="Ürün adı veya açıklaması" />
        </label>
        <div className="flex flex-wrap gap-2" aria-label="Kategori filtresi">
          {categories.map((name) => <button key={name} type="button" onClick={() => setCategory(name)} aria-pressed={category === name} className={category === name ? "filter-active" : "filter"}>{name}</button>)}
        </div>
        <p role="status" className="text-sm text-slate-600">{filtered.length} ürün bulundu.</p>
        <p role="status" aria-live="polite" className="font-semibold text-green-800">{notice}</p>
        {filtered.length === 0 ? <p className="rounded-xl bg-slate-50 p-7 text-slate-700">Aradığın ürün bulunamadı. Aramayı veya kategoriyi değiştirebilirsin.</p> :
          <div className="grid gap-4 sm:grid-cols-2">{filtered.map((item) => <article key={item.id} className="flex flex-col justify-between rounded-xl border border-slate-200 p-5">
            <div><p className="mb-2 text-xs font-semibold uppercase text-brand">{item.category}</p><h3 className="text-lg font-bold">{item.name}</h3><p className="mt-1 text-sm text-slate-600">{item.description}</p></div>
            <div className="mt-6 flex items-center justify-between gap-3"><strong>{formatTRY(item.price)}</strong>
              <button type="button" className="btn-primary" onClick={() => setNotice(add(item) === "added" ? item.name + " sepete eklendi." : "İşlem iptal edildi.")}>Sepete ekle</button></div>
          </article>)}</div>}
      </section>
    </div>
  );
}
