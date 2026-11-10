import { useState, type FormEvent } from "react";
import { Link, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useCart } from "../state/CartContext";
import { useDelivery } from "../state/DeliveryContext";
import { useAccount } from "../state/AccountContext";
import { locationLabel } from "../data/delivery";
import { formatTRY, type PaymentMethod, type Service } from "../types/domain";
import { saveDemoOrder, type DemoOrder } from "../state/demoOrder";
import { marketStores } from "../features/market/data/marketData";
import { calculateFoodCouponDiscount, foodRestaurants } from "../features/food/data/foodData";
import FoodCouponSelector from "../features/food/components/FoodCouponSelector";
import { useFoodCoupon } from "../features/food/state/FoodCouponContext";
import type { LayoutContext } from "../components/Layout";

export default function CheckoutPage() {
  const { service: segment } = useParams();
  const service: Service = segment === "market" ? "market" : "food";

  const { carts, total, clear } = useCart();
  const { delivery } = useDelivery();
  const { account } = useAccount();
  const { openAddress } = useOutletContext<LayoutContext>();
  const { activeFoodCoupon, setActiveFoodCoupon } = useFoodCoupon();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("cash-demo");
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; address?: string }>({});
  const [error, setError] = useState("");

  const lines = carts[service];
  const amount = total(service);
  const deliveryRegion = delivery ? locationLabel(delivery) : null;

  const store =
    service === "market" && lines.length > 0
      ? marketStores.find((s) => s.id === lines[0].product.storeId)
      : undefined;
  const foodRestaurant =
    service === "food" && lines.length > 0
      ? foodRestaurants.find((restaurant) => restaurant.id === lines[0].product.storeId)
      : undefined;

  const deliveryFee =
    service === "market" ? (store?.deliveryFee ?? 0) : (foodRestaurant?.deliveryFee ?? 0);

  const minBasket =
    service === "market" ? (store?.minBasket ?? 0) : (foodRestaurant?.minBasket ?? 0);

  const couponDiscount =
    service === "food" ? calculateFoodCouponDiscount(activeFoodCoupon, lines).discount : 0;
  const canCheckout = amount >= minBasket;
  const grandTotal = amount - couponDiscount + deliveryFee;

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!lines.length) {
      setError("Sepet boş olduğu için sipariş oluşturulamaz.");
      return;
    }

    if (!canCheckout) {
      setError(`Minimum sepet tutarına ulaşmalısın: ${formatTRY(minBasket)}`);
      return;
    }

    const nextFieldErrors: { name?: string; address?: string } = {};
    if (name.trim().length < 2) {
      nextFieldErrors.name = "Ad soyad en az 2 karakter olmalı.";
    }
    if (address.trim().length < 10) {
      nextFieldErrors.address = "En az 10 karakterlik teslimat adresi ayrıntısı gir.";
    }

    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      setError("Lütfen işaretli zorunlu alanları kontrol et.");
      return;
    }

    setFieldErrors({});
    setError("");

    const orderId = "YS-" + Date.now().toString().slice(-7);

    const order: DemoOrder = {
      orderId,
      amount: grandTotal,
      service,
      method,
      stage: 0,
      createdAt: new Date().toISOString(),
      locationLabel: deliveryRegion ?? undefined,
      storeName: store?.name ?? foodRestaurant?.name ?? lines[0]?.product.storeName,
      itemCount: lines.reduce((sum, line) => sum + line.quantity, 0),
      customerName: name.trim(),
    };

    saveDemoOrder(order);
    clear(service);
    if (service === "food") setActiveFoodCoupon(null);
    navigate("/success", { state: order, replace: true });
  };

  return (
    <div className="space-y-7">
      <div>
        <p className="font-semibold text-[#D90049]">Adım 2 / 2</p>

        <h1 className="mt-2 text-3xl font-extrabold text-slate-900">
          {service === "market" ? "Market siparişini tamamla" : "Siparişi tamamla"}
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          Teslimat bilgilerini ve ödeme yöntemini seçerek siparişini tamamla.
        </p>

        {deliveryRegion && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div>
              <p className="text-xs font-medium text-slate-600">Seçili teslimat bölgesi</p>
              <p className="mt-0.5 font-bold text-slate-900">{deliveryRegion}</p>
            </div>
            <button
              type="button"
              data-address-trigger="checkout"
              onClick={openAddress}
              className="min-h-11 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-brand hover:border-brand"
            >
              Bölgeyi değiştir
            </button>
          </div>
        )}

        {(store || foodRestaurant) && (
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            {store?.logo && (
              <img src={store.logo} alt="" className="h-12 w-12 object-contain" />
            )}
            <div>
              <p className="text-xs font-medium text-slate-600">
                {service === "market" ? "Market mağazası" : "Restoran"}
              </p>
              <p className="font-bold text-slate-900">
                {store?.name ?? foodRestaurant?.name}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="grid items-start gap-6 md:grid-cols-[1.2fr_0.8fr]">
        <form
          onSubmit={submit}
          className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
          noValidate
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-slate-900">Teslimat bilgileri</h2>
            {account && (
              <button
                type="button"
                onClick={() => {
                  setName(account.name);
                  if (!address.trim() && account.deliveryNote) setAddress(account.deliveryNote);
                  setFieldErrors({});
                }}
                className="min-h-11 rounded-xl border border-brand bg-[#FFF1F6] px-3 py-2 text-xs font-semibold text-brand-dark hover:bg-white"
              >
                Hesap bilgilerimle doldur ({account.name.split(" ")[0]})
              </button>
            )}
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-800">
              Ad soyad *
            </span>
            <input
              className="field"
              autoComplete="off"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: undefined }));
              }}
              required
              aria-required="true"
              aria-invalid={Boolean(fieldErrors.name)}
              aria-describedby={fieldErrors.name ? "checkout-name-error" : undefined}
              placeholder="Ayşe Yılmaz"
            />
            {fieldErrors.name && (
              <span id="checkout-name-error" role="alert" className="mt-1.5 block text-sm font-semibold text-[#991B1B]">
                {fieldErrors.name}
              </span>
            )}
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-800">
              Teslimat adresi (sokak, bina, daire) *
            </span>
            <textarea
              className="field"
              rows={3}
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                if (fieldErrors.address) setFieldErrors((prev) => ({ ...prev, address: undefined }));
              }}
              required
              aria-required="true"
              aria-invalid={Boolean(fieldErrors.address)}
              aria-describedby={fieldErrors.address ? "checkout-address-error" : undefined}
              placeholder="Örn. Üniversite kampüsü, A blok, No: 4..."
            />
            {fieldErrors.address && (
              <span id="checkout-address-error" role="alert" className="mt-1.5 block text-sm font-semibold text-[#991B1B]">
                {fieldErrors.address}
              </span>
            )}
          </label>

          <fieldset className="space-y-3">
            <legend className="mb-3 font-semibold text-slate-900">
              Ödeme yöntemi
            </legend>

            <label className="flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border border-slate-300 p-3 text-sm hover:border-[#D90049]">
              <input
                type="radio"
                name="payment"
                checked={method === "cash-demo"}
                onChange={() => setMethod("cash-demo")}
                className="accent-[#D90049]"
              />
              <span>
                <strong className="block text-slate-900">Kapıda ödeme</strong>
                <span className="text-slate-600">Teslimat sırasında nakit veya kart</span>
              </span>
            </label>

            <label className="flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border border-slate-300 p-3 text-sm hover:border-[#D90049]">
              <input
                type="radio"
                name="payment"
                checked={method === "card-demo"}
                onChange={() => setMethod("card-demo")}
                className="accent-[#D90049]"
              />
              <span>
                <strong className="block text-slate-900">Online kart ile ödeme</strong>
                <span className="text-slate-600">Hızlı onay — kart bilgisi istenmez</span>
              </span>
            </label>
          </fieldset>

          {error && (
            <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-[#991B1B]">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="min-h-12 w-full rounded-xl bg-[#D90049] px-5 py-4 font-bold text-white transition hover:bg-[#B6003C] disabled:cursor-not-allowed disabled:bg-slate-400"
            disabled={!lines.length || !canCheckout}
          >
            Siparişi tamamla
          </button>

          {!lines.length && (
            <p className="text-sm font-medium text-[#991B1B]">
              Devam etmek için önce sepete ürün eklemelisin.
            </p>
          )}

          {lines.length > 0 && !canCheckout && (
            <p className="rounded-xl bg-amber-50 p-3 text-sm font-medium text-[#92400E]">
              Minimum sepet tutarı {formatTRY(minBasket)}.
              {` ${formatTRY(minBasket - amount)} daha ürün eklemelisin.`}
            </p>
          )}

          <Link to={"/cart/" + service} className="inline-flex min-h-11 items-center font-semibold text-[#D90049] underline">
            ← Sepete geri dön
          </Link>
        </form>

        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="mb-4 text-lg font-extrabold text-slate-900">Sipariş özeti</h2>

          <ul className="space-y-4">
            {lines.map(({ product, quantity }) => (
              <li key={product.id} className="flex items-center gap-3 text-sm">
                {service === "market" && product.image && (
                  <img src={product.image} alt="" className="h-12 w-12 rounded-lg bg-slate-50 object-contain p-1" />
                )}

                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-900">
                    {quantity} × {product.name}
                  </p>
                  <p className="text-xs text-slate-600">{formatTRY(product.price)} / adet</p>
                </div>

                <span className="shrink-0 font-semibold text-slate-900">
                  {formatTRY(product.price * quantity)}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-5 space-y-3 border-t border-slate-200 pt-4 text-sm">
            {service === "food" && <FoodCouponSelector lines={lines} />}
            <div className="flex justify-between text-slate-600">
              <span>Ürün toplamı</span>
              <span className="font-medium text-slate-900">{formatTRY(amount)}</span>
            </div>

            {service === "food" && couponDiscount > 0 && activeFoodCoupon && (
              <div className="flex justify-between font-semibold text-emerald-800">
                <span>Kupon indirimi ({activeFoodCoupon.code})</span>
                <span>−{formatTRY(couponDiscount)}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-600">
              <span>Teslimat ücreti</span>
              <span className="font-medium text-slate-900">
                {service === "food" && deliveryFee === 0 ? "Ücretsiz" : formatTRY(deliveryFee)}
              </span>
            </div>

            <div className="flex justify-between pt-2 text-base font-extrabold text-slate-900">
              <span>Genel toplam</span>
              <span>{formatTRY(grandTotal)}</span>
            </div>
          </div>

          {service === "market" && (
            <div className="mt-4 rounded-xl bg-green-50 p-3 text-xs font-medium text-[#166534]">
              ✓ Market sepeti mağaza bazında hesaplanır.
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
