import { Link } from "react-router-dom";
import { useCart } from "../../../state/CartContext";
import { formatTRY } from "../../../types/domain";

export default function FoodCartPage() {
  const { carts, change, total } = useCart();
  const lines = carts.food;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold leading-10 text-[#0F172A]">Yemek sepetim</h1>
        <Link to="/food" className="inline-flex min-h-11 items-center rounded-xl px-3 py-2 font-semibold text-[#D90049] underline underline-offset-4 hover:text-[#B6003C]">
          Restoranlara dön
        </Link>
      </div>
      {lines.length === 0 ? (
        <section className="rounded-2xl border border-[#CBD5E1] bg-white p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-[#0F172A]">Sepetin şu anda boş</h2>
          <p className="mt-2 text-base leading-6 text-[#475569]">Sipariş vermek için bir restorandan menü seçip ürün ekle.</p>
          <Link to="/food" className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#D90049] px-5 py-3 font-semibold text-white hover:bg-[#B6003C]">
            Restoranları keşfet
          </Link>
        </section>
      ) : (
        <>
          <ul className="divide-y divide-[#CBD5E1] rounded-2xl border border-[#CBD5E1] bg-white px-4 sm:px-5">
            {lines.map(({ product, quantity }) => (
              <li key={product.id} className="flex flex-wrap items-center justify-between gap-4 py-5">
                <div className="min-w-0 flex-1">
                  <h2 className="text-base font-semibold leading-6 text-[#0F172A]">{product.name}</h2>
                  <p className="mt-1 text-sm leading-5 text-[#475569]">{product.storeName}</p>
                  <p className="mt-1 text-sm leading-5 text-[#475569]">Birim fiyat: {formatTRY(product.price)}</p>
                  <p className="mt-1 font-semibold text-[#0F172A]">Satır tutarı: {formatTRY(product.price * quantity)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#CBD5E1] bg-white text-xl font-bold text-[#0F172A] hover:border-[#D90049]" onClick={() => change("food", product.id, -1)} aria-label={`${product.name} miktarını azalt`}>−</button>
                  <span aria-live="polite" className="w-8 text-center font-bold text-[#0F172A]">{quantity}</span>
                  <button type="button" className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#CBD5E1] bg-white text-xl font-bold text-[#0F172A] hover:border-[#D90049]" onClick={() => change("food", product.id, 1)} aria-label={`${product.name} miktarını artır`}>+</button>
                  <button type="button" className="min-h-11 rounded-xl px-3 py-2 font-semibold text-[#0F172A] underline underline-offset-2 hover:text-[#D90049]" onClick={() => change("food", product.id, -quantity)} aria-label={`${product.name} ürününü sepetten sil`}>Sil</button>
                </div>
              </li>
            ))}
          </ul>
          <section className="rounded-2xl border border-[#CBD5E1] bg-white p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4 text-lg text-[#0F172A]">
              <span>Ara toplam</span><strong>{formatTRY(total("food"))}</strong>
            </div>
            <p className="mt-2 text-sm leading-5 text-[#475569]">Teslimat ücreti, sipariş onayından önce ayrıca gösterilir.</p>
            <Link to="/checkout/food" className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-[#D90049] px-5 py-3 text-center font-semibold text-white hover:bg-[#B6003C]">
              Siparişi gözden geçir
            </Link>
          </section>
        </>
      )}
    </div>
  );
}
