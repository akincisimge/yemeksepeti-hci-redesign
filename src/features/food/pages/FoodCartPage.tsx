import { Link } from "react-router-dom";
import { useCart } from "../../../state/CartContext";
import { formatTRY } from "../../../types/domain";
import FoodCustomizationDetails from "../components/FoodCustomizationDetails";
import FoodCouponSelector from "../components/FoodCouponSelector";
import { calculateFoodCouponDiscount, foodRestaurants } from "../data/foodData";
import { useFoodCoupon } from "../state/FoodCouponContext";

export default function FoodCartPage() {
  const { carts, change, total } = useCart();
  const { activeFoodCoupon } = useFoodCoupon();
  const lines = carts.food;
  const restaurant = foodRestaurants.find((item) => item.id === lines[0]?.product.storeId);
  const subtotal = total("food");
  const deliveryFee = restaurant?.deliveryFee ?? 0;
  const minBasket = restaurant?.minBasket ?? 0;
  const remaining = Math.max(0, minBasket - subtotal);
  const couponDiscount = calculateFoodCouponDiscount(activeFoodCoupon, lines).discount;

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
                  <FoodCustomizationDetails product={product} />
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
            <FoodCouponSelector lines={lines} />
            <div className="mt-4 flex items-center justify-between gap-4 text-sm text-[#0F172A]">
              <span>Ürün toplamı</span><strong>{formatTRY(subtotal)}</strong>
            </div>
            {couponDiscount > 0 && activeFoodCoupon && (
              <div className="mt-3 flex items-center justify-between gap-4 text-sm font-semibold text-emerald-800">
                <span>Kupon indirimi ({activeFoodCoupon.code})</span><strong>−{formatTRY(couponDiscount)}</strong>
              </div>
            )}
            <div className="mt-3 flex items-center justify-between gap-4 text-sm text-[#0F172A]">
              <span>Teslimat ücreti</span><strong>{deliveryFee === 0 ? "Ücretsiz" : formatTRY(deliveryFee)}</strong>
            </div>
            <div className="mt-3 flex items-center justify-between gap-4 border-t border-slate-200 pt-3 text-lg font-bold text-[#0F172A]">
              <span>Genel toplam</span><strong>{formatTRY(subtotal + deliveryFee - couponDiscount)}</strong>
            </div>
            <p className="mt-2 text-sm leading-5 text-[#475569]">{restaurant?.name ?? "Restoran"} için teslimat ücreti ve kupon indirimi hesaba katıldı.</p>
            {remaining > 0 && (
              <p role="status" className="mt-3 rounded-xl bg-amber-50 p-3 text-sm leading-5 text-[#92400E]">
                Minimum sepet tutarı <strong>{formatTRY(minBasket)}</strong>. Devam etmek için{" "}
                <strong>{formatTRY(remaining)}</strong> daha ürün eklemelisin.
              </p>
            )}
            {remaining > 0 ? (
              <button type="button" disabled className="mt-5 inline-flex min-h-11 w-full cursor-not-allowed items-center justify-center rounded-xl bg-slate-400 px-5 py-3 text-center font-semibold text-white">
                Siparişi gözden geçir
              </button>
            ) : (
              <Link to="/checkout/food" className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-[#D90049] px-5 py-3 text-center font-semibold text-white hover:bg-[#B6003C]">
                Siparişi gözden geçir
              </Link>
            )}
          </section>
        </>
      )}
    </div>
  );
}
