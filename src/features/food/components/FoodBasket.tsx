import { Link } from "react-router-dom";
import { useCart } from "../../../state/CartContext";
import { formatTRY } from "../../../types/domain";
import { foodRestaurants } from "../data/foodData";

export default function FoodBasket({ onNotice }: { onNotice?: (message: string) => void }) {
  const { carts, change, total } = useCart();
  const lines = carts.food;
  const restaurant = foodRestaurants.find((item) => item.id === lines[0]?.product.storeId);
  const subtotal = total("food");
  const deliveryFee = restaurant?.deliveryFee ?? 0;
  const remaining = Math.max(0, (restaurant?.minBasket ?? 0) - subtotal);
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);

  const updateQuantity = (productId: string, delta: number, message: string) => {
    change("food", productId, delta);
    onNotice?.(message);
  };

  return (
    <section aria-labelledby="food-basket-title" className="rounded-2xl border border-[#CBD5E1] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 id="food-basket-title" className="text-xl font-bold text-[#0F172A]">Sepetim</h2>
        <span className="text-sm text-[#475569]">{itemCount} ürün</span>
      </div>
      {!lines.length ? (
        <div className="py-8 text-center">
          <p className="font-semibold text-[#0F172A]">Sepetin şu an boş.</p>
          <p className="mt-2 text-sm leading-5 text-[#475569]">Menüden lezzetler eklemeye başla.</p>
        </div>
      ) : (
        <>
          <p className="mt-2 text-sm font-semibold text-[#D90049]">
            {restaurant?.name ?? lines[0].product.storeName}
          </p>
          <ul className="mt-4 max-h-[36vh] space-y-4 overflow-y-auto pr-1">
            {lines.map(({ product, quantity }) => (
              <li key={product.id} className="border-b border-[#E2E8F0] pb-4">
                <h3 className="font-semibold text-[#0F172A]">{product.name}</h3>
                <p className="mt-1 text-sm text-[#475569]">{formatTRY(product.price)} / adet</p>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#CBD5E1] text-xl font-bold hover:border-[#D90049]"
                      aria-label={`${product.name} miktarını azalt`}
                      onClick={() => updateQuantity(product.id, -1, `${product.name} miktarı güncellendi.`)}
                    >
                      −
                    </button>
                    <span aria-live="polite" className="min-w-5 text-center font-semibold">{quantity}</span>
                    <button
                      type="button"
                      className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#CBD5E1] text-xl font-bold hover:border-[#D90049]"
                      aria-label={`${product.name} miktarını artır`}
                      onClick={() => updateQuantity(product.id, 1, `${product.name} miktarı güncellendi.`)}
                    >
                      +
                    </button>
                  </div>
                  <strong className="text-[#0F172A]">{formatTRY(product.price * quantity)}</strong>
                </div>
                <button
                  type="button"
                  className="mt-1 min-h-11 text-sm font-semibold text-[#0F172A] underline hover:text-[#D90049]"
                  aria-label={`${product.name} ürününü sepetten sil`}
                  onClick={() => updateQuantity(product.id, -quantity, `${product.name} sepetten çıkarıldı.`)}
                >
                  Sil
                </button>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-3 text-sm text-[#0F172A]">
            <div className="flex justify-between gap-3">
              <dt>Ürün toplamı</dt>
              <dd>{formatTRY(subtotal)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>Teslimat ücreti</dt>
              <dd>{deliveryFee === 0 ? "Ücretsiz" : formatTRY(deliveryFee)}</dd>
            </div>
            <div className="flex justify-between gap-3 border-t border-[#CBD5E1] pt-3 text-base font-bold">
              <dt>Genel toplam</dt>
              <dd>{formatTRY(subtotal + deliveryFee)}</dd>
            </div>
          </dl>
          {remaining > 0 && (
            <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm leading-5 text-amber-900">
              Minimum sepet {formatTRY(restaurant?.minBasket ?? 0)}. {formatTRY(remaining)} daha ürün ekle.
            </p>
          )}
          {remaining > 0 ? (
            <button type="button" disabled className="mt-4 w-full cursor-not-allowed rounded-xl bg-[#D90049] px-4 py-3 font-semibold text-white opacity-50">
              Sepeti Onayla
            </button>
          ) : (
            <Link to="/checkout/food" className="mt-4 flex min-h-11 w-full items-center justify-center rounded-xl bg-[#D90049] px-4 py-3 text-center font-semibold text-white hover:bg-[#B6003C]">
              Siparişi Tamamla / Sepeti Onayla
            </Link>
          )}
          <Link to="/cart/food" className="mt-2 flex min-h-11 items-center justify-center text-center text-sm font-semibold text-[#D90049] underline hover:text-[#B6003C]">
            Sepetin tamamını görüntüle
          </Link>
        </>
      )}
    </section>
  );
}
