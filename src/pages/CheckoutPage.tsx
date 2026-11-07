
import { useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCart } from "../state/CartContext";
import { formatTRY, type PaymentMethod, type Service } from "../types/domain";
import { saveDemoOrder, type DemoOrder } from "../state/demoOrder";
import { marketStores } from "../features/market/data/marketData";

export default function CheckoutPage() {
  const { service: segment } = useParams();
  const service: Service = segment === "market" ? "market" : "food";

  const { carts, total, clear } = useCart();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("cash-demo");
  const [error, setError] = useState("");

  const lines = carts[service];
  const amount = total(service);

  const store =
    service === "market" && lines.length > 0
      ? marketStores.find(
          (s) => s.id === lines[0].product.storeId
        )
      : undefined;

  const deliveryFee = service === "market"
    ? store?.deliveryFee ?? 0
    : 0;

  const minBasket = service === "market"
    ? store?.minBasket ?? 0
    : 0;

  const canCheckout = amount >= minBasket;
  const grandTotal = amount + deliveryFee;

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!lines.length) {
      setError("Sepet boş olduğu için sipariş oluşturulamaz.");
      return;
    }

    if (!canCheckout) {
      setError(
        `Minimum sepet tutarına ulaşmalısın: ${formatTRY(minBasket)}`
      );
      return;
    }

    if (name.trim().length < 2 || address.trim().length < 10) {
      setError("Ad soyad ve en az 10 karakterlik örnek teslimat adresi gir.");
      return;
    }

    setError("");

    const orderId = "DEMO-" + Date.now().toString().slice(-7);

    const order: DemoOrder = {
      orderId,
      amount: grandTotal,
      service,
      method,
      stage: 0,
      createdAt: new Date().toISOString(),
    };

    saveDemoOrder(order);
    clear(service);
    navigate("/success", { state: order, replace: true });
  };

  return (
    <div className="mx-auto max-w-6xl space-y-7 px-4 py-8">

      {/* Header */}
      <div>
        <p className="font-semibold text-[#D90049]">
          Adım 2 / 2
        </p>

        <h1 className="mt-2 text-3xl font-extrabold text-slate-900">
          {service === "market"
            ? "Market siparişini tamamla"
            : "Siparişi tamamla"}
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Gerçek adres veya kart bilgisi kullanma.
          Sipariş yalnızca bu tarayıcıda simüle edilir.
        </p>

        {store && (
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
            {store.logo && (
              <img
                src={store.logo}
                alt={store.name}
                className="h-12 w-12 object-contain"
              />
            )}

            <div>
              <p className="text-xs text-slate-600">
                Market mağazası
              </p>
              <p className="font-bold text-slate-800">
                {store.name}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="grid items-start gap-6 md:grid-cols-[1.2fr_0.8fr]">

        {/* Form */}
        <form
          onSubmit={submit}
          className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
          noValidate
        >
          <h2 className="text-lg font-bold text-slate-900">
            Teslimat bilgileri
          </h2>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Ad soyad *
            </span>

            <input
              className="field"
              autoComplete="off"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              aria-required="true"
              placeholder="Örnek Kullanıcı"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Demo teslimat adresi *
            </span>

            <textarea
              className="field"
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              aria-required="true"
              placeholder="Örn. Üniversite kampüsü, A blok..."
            />
          </label>

          <fieldset className="space-y-3">
            <legend className="mb-3 font-semibold text-slate-800">
              Demo ödeme yöntemi
            </legend>

            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm hover:border-[#D90049]">
              <input
                type="radio"
                name="payment"
                checked={method === "cash-demo"}
                onChange={() => setMethod("cash-demo")}
              />
              <span>
                <strong className="block">Teslimatta ödeme</strong>
                <span className="text-slate-500">Simülasyon</span>
              </span>
            </label>

            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm hover:border-[#D90049]">
              <input
                type="radio"
                name="payment"
                checked={method === "card-demo"}
                onChange={() => setMethod("card-demo")}
              />
              <span>
                <strong className="block">Kartla ödeme</strong>
                <span className="text-slate-500">
                  Simülasyon, kart bilgisi istenmez
                </span>
              </span>
            </label>
          </fieldset>

          {error && (
            <p
              role="alert"
              className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-800"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-[#D90049] px-5 py-4 font-bold text-white transition hover:bg-[#B6003C] disabled:cursor-not-allowed disabled:bg-slate-300"
            disabled={!lines.length || !canCheckout}
          >
            Demo siparişi tamamla
          </button>

          {!lines.length && (
            <p className="text-sm text-red-700">
              Devam etmek için önce sepete ürün eklemelisin.
            </p>
          )}

          {service === "market" && amount < minBasket && (
            <p className="text-sm text-amber-700">
              Minimum sepet tutarı {formatTRY(minBasket)}.
              {` ${formatTRY(minBasket - amount)} daha ürün eklemelisin.`}
            </p>
          )}

          <Link
            to={"/cart/" + service}
            className="inline-block font-semibold text-[#D90049] underline"
          >
            Sepete geri dön
          </Link>
        </form>

        {/* Order Summary */}
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="mb-4 text-lg font-extrabold text-slate-900">
            Sipariş özeti
          </h2>

          <ul className="space-y-4">
            {lines.map(({ product, quantity }) => (
              <li
                key={product.id}
                className="flex items-center gap-3 text-sm"
              >
                {service === "market" && product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-12 w-12 rounded-lg bg-slate-50 object-contain p-1"
                  />
                )}

                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-800">
                    {quantity} × {product.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatTRY(product.price)} / adet
                  </p>
                </div>

                <span className="shrink-0 font-semibold text-slate-800">
                  {formatTRY(product.price * quantity)}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-5 space-y-3 border-t border-slate-200 pt-4 text-sm">
            <div className="flex justify-between text-slate-500">
              <span>Ürün toplamı</span>
              <span>{formatTRY(amount)}</span>
            </div>

            {service === "market" && (
              <div className="flex justify-between text-slate-500">
                <span>Teslimat ücreti</span>
                <span>{formatTRY(deliveryFee)}</span>
              </div>
            )}

            <div className="flex justify-between pt-2 text-base font-extrabold text-slate-900">
              <span>Genel toplam</span>
              <span>{formatTRY(grandTotal)}</span>
            </div>
          </div>

          {service === "market" && (
            <div className="mt-4 rounded-xl bg-green-50 p-3 text-xs font-medium text-green-700">
              ✓ Market sepeti mağaza bazında hesaplanır.
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

