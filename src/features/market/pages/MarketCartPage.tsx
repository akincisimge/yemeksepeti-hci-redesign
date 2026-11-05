

import { useNavigate } from "react-router-dom";
import { useCart } from "../../../state/CartContext";
import { formatTRY } from "../../../types/domain";
import { marketStores } from "../data/marketData";

export default function MarketCartPage() {
  const navigate = useNavigate();
  const { carts, change, clear, total } = useCart();

  const lines = carts.market;
  const subtotal = total("market");
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);

  const store =
    lines.length > 0
      ? marketStores.find((s) => s.id === lines[0].product.storeId)
      : undefined;

  const minBasket = store?.minBasket ?? 0;
  const deliveryFee = store?.deliveryFee ?? 0;
  const remaining = Math.max(0, minBasket - subtotal);
  const canCheckout = subtotal >= minBasket;

  if (lines.length === 0) {
    return (
      <div className="flex min-h-[65vh] flex-col items-center justify-center px-4 text-center">
        <div className="mb-5 flex h-28 w-28 items-center justify-center rounded-full bg-pink-50 text-6xl">
          🛒
        </div>

        <h1 className="text-2xl font-extrabold text-slate-900">
          Market sepetin boş
        </h1>

        <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500">
          Alışverişe başlayarak sepetini doldurabilir, ihtiyaçlarını kolayca
          sipariş edebilirsin.
        </p>

        <button
          onClick={() => navigate("/market")}
          className="mt-7 rounded-xl bg-[#D90049] px-7 py-3.5 font-bold text-white shadow-sm transition hover:bg-[#B6003C]"
        >
          Marketlere git
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F8FA]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back */}
        <button
          onClick={() => navigate("/market")}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#D90049]"
        >
          ← Alışverişe devam et
        </button>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Market Sepetim
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Sepetinde {itemCount} ürün bulunuyor.
          </p>

          {store && (
            <div className="mt-4 inline-flex items-center gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-sm">
              {store.logo && (
                <img
                  src={store.logo}
                  alt={store.name}
                  className="h-10 w-10 object-contain"
                />
              )}

              <div>
                <p className="text-xs text-slate-400">Mağazan</p>
                <p className="text-sm font-bold text-slate-800">
                  {store.name}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[1fr_360px]">
          {/* Cart Items */}
          <section className="space-y-4">
            {lines.map((line) => (
              <article
                key={line.product.id}
                className="flex gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:shadow-md sm:gap-5 sm:p-5"
              >
                {/* Product Image */}
                <button
                  onClick={() => navigate(`/market/product/${line.product.id}`)}
                  className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-50 p-2 sm:h-28 sm:w-28 sm:p-3"
                >
                  {line.product.image ? (
                    <img
                      src={line.product.image}
                      alt={line.product.name}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <span className="text-4xl">🛒</span>
                  )}
                </button>

                {/* Product Info */}
                <div className="flex min-w-0 flex-1 flex-col justify-between">
                  <div>
                    <p className="mb-1 text-xs font-medium text-slate-400">
                      {line.product.storeName}
                    </p>

                    <h2 className="line-clamp-2 text-sm font-bold leading-5 text-slate-900 sm:text-base">
                      {line.product.name}
                    </h2>

                    <p className="mt-2 text-sm font-semibold text-slate-600">
                      {formatTRY(line.product.price)}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="mt-4 flex items-center gap-2">
                    <button
                      onClick={() => change("market", line.product.id, -1)}
                      aria-label={`${line.product.name} miktarını azalt`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-lg font-semibold text-slate-600 transition hover:border-[#D90049] hover:text-[#D90049]"
                    >
                      −
                    </button>

                    <span className="min-w-8 text-center text-sm font-bold text-slate-900">
                      {line.quantity}
                    </span>

                    <button
                      onClick={() => change("market", line.product.id, 1)}
                      aria-label={`${line.product.name} miktarını artır`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-lg font-semibold text-slate-600 transition hover:border-[#D90049] hover:text-[#D90049]"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Price and Remove */}
                <div className="flex shrink-0 flex-col items-end justify-between">
                  <p className="text-sm font-extrabold text-slate-900 sm:text-base">
                    {formatTRY(line.product.price * line.quantity)}
                  </p>

                  <button
                    onClick={() => change("market", line.product.id, -line.quantity)}
                    className="rounded-lg px-2 py-1 text-xs font-medium text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                  >
                    ✕ Sil
                  </button>
                </div>
              </article>
            ))}

            {/* Clear Cart */}
            <button
              onClick={() => clear("market")}
              className="rounded-lg px-2 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-50"
            >
              🗑️ Sepeti temizle
            </button>
          </section>

          {/* Order Summary */}
          <aside className="sticky top-6 h-fit rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-extrabold text-slate-900">
              Sipariş özeti
            </h2>

            <div className="mt-5 flex justify-between text-sm text-slate-500">
              <span>Ürün toplamı ({itemCount} ürün)</span>
              <span className="font-medium text-slate-700">
                {formatTRY(subtotal)}
              </span>
            </div>

            <div className="mt-4 flex justify-between text-sm text-slate-500">
              <span>Teslimat ücreti</span>
              <span className="font-medium text-slate-700">
                {store ? formatTRY(deliveryFee) : "Hesaplanacak"}
              </span>
            </div>

            <div className="mt-5 flex justify-between border-t border-slate-100 pt-5">
              <span className="font-bold text-slate-900">Ara toplam</span>
              <span className="text-xl font-extrabold text-slate-900">
                {formatTRY(subtotal + deliveryFee)}
              </span>
            </div>

            {/* Minimum Basket Warning */}
            {remaining > 0 && (
              <div className="mt-4 rounded-xl bg-amber-50 p-3 text-sm leading-5 text-amber-700">
                Minimum sepet tutarı <strong>{formatTRY(minBasket)}</strong>.
                Sipariş verebilmek için <strong>{formatTRY(remaining)}</strong>{" "}
                daha ürün eklemelisin.
              </div>
            )}

            {canCheckout && (
              <div className="mt-4 rounded-xl bg-green-50 p-3 text-sm font-medium text-green-700">
                ✓ Minimum sepet tutarına ulaştın.
              </div>
            )}

            {/* Checkout */}
            <button
              disabled={!canCheckout}
              onClick={() => navigate("/checkout/market")}
              className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-4 text-sm font-bold text-white transition ${
                canCheckout
                  ? "bg-[#D90049] hover:bg-[#B6003C]"
                  : "cursor-not-allowed bg-slate-300"
              }`}
            >
              Siparişi tamamla →
            </button>

            <button
              onClick={() => navigate("/market")}
              className="mt-3 w-full rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Alışverişe devam et
            </button>

            <div className="mt-5 rounded-xl bg-green-50 p-3 text-center text-xs font-medium text-green-700">
              ✓ Güvenli alışveriş deneyimi
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}



