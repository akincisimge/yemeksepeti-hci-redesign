import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../state/CartContext";
import { formatTRY } from "../../../types/domain";
import { marketStores } from "../data/marketData";

export default function MarketCartPage() {
  const navigate = useNavigate();
  const { carts, change, clear, total } = useCart();
  const [confirmClear, setConfirmClear] = useState(false);
  const [notice, setNotice] = useState("");

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
        <div aria-hidden="true" className="mb-5 flex h-28 w-28 items-center justify-center rounded-full bg-pink-50 text-6xl">
          🛒
        </div>

        <h1 className="text-2xl font-extrabold text-slate-900">
          Market sepetin boş
        </h1>

        {notice && (
          <p role="status" aria-live="polite" className="mt-3 rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-800">
            {notice}
          </p>
        )}

        <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600">
          Alışverişe başlayarak sepetini doldurabilir, ihtiyaçlarını kolayca sipariş edebilirsin.
        </p>

        <button
          type="button"
          onClick={() => navigate("/market")}
          className="mt-7 min-h-11 rounded-xl bg-[#D90049] px-7 py-3.5 font-bold text-white shadow-sm transition hover:bg-[#B6003C]"
        >
          Marketlere git
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => navigate("/market")}
        className="inline-flex min-h-11 items-center gap-2 rounded-xl px-2 text-sm font-semibold text-slate-700 transition hover:text-[#D90049]"
      >
        ← Alışverişe devam et
      </button>

      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Market Sepetim
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          Sepetinde {itemCount} ürün bulunuyor.
        </p>

        {store && (
          <div className="mt-4 inline-flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            {store.logo && (
              <img
                src={store.logo}
                alt=""
                className="h-10 w-10 object-contain"
              />
            )}

            <div>
              <p className="text-xs font-medium text-slate-600">Mağazan</p>
              <p className="text-sm font-bold text-slate-900">
                {store.name}
              </p>
            </div>
          </div>
        )}
      </div>

      <p role="status" aria-live="polite" className="min-h-6 text-sm font-semibold text-[#166534]">
        {notice}
      </p>

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_360px]">
        <section aria-label="Sepetteki ürünler" className="space-y-4">
          {lines.map((line) => (
            <article
              key={line.product.id}
              className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:gap-5 sm:p-5"
            >
              <button
                type="button"
                aria-label={`${line.product.name} ürün detayını aç`}
                onClick={() => navigate(`/market/product/${line.product.id}`)}
                className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-50 p-2 sm:h-28 sm:w-28 sm:p-3"
              >
                {line.product.image ? (
                  <img
                    src={line.product.image}
                    alt=""
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <span aria-hidden="true" className="text-4xl">🛒</span>
                )}
              </button>

              <div className="flex min-w-0 flex-1 flex-col justify-between">
                <div>
                  <p className="mb-1 text-xs font-medium text-slate-600">
                    {line.product.storeName}
                  </p>

                  <h2 className="line-clamp-2 text-sm font-bold leading-5 text-slate-900 sm:text-base">
                    {line.product.name}
                  </h2>

                  <p className="mt-2 text-sm font-semibold text-slate-700">
                    {formatTRY(line.product.price)}
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      change("market", line.product.id, -1);
                      setNotice(`${line.product.name} miktarı güncellendi.`);
                    }}
                    aria-label={`${line.product.name} miktarını azalt`}
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-300 bg-white text-lg font-bold text-slate-800 transition hover:border-[#D90049] hover:text-[#D90049]"
                  >
                    −
                  </button>

                  <span aria-live="polite" className="min-w-8 text-center text-sm font-bold text-slate-900">
                    {line.quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      change("market", line.product.id, 1);
                      setNotice(`${line.product.name} miktarı güncellendi.`);
                    }}
                    aria-label={`${line.product.name} miktarını artır`}
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-300 bg-white text-lg font-bold text-slate-800 transition hover:border-[#D90049] hover:text-[#D90049]"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex shrink-0 flex-col items-end justify-between">
                <p className="text-sm font-extrabold text-slate-900 sm:text-base">
                  {formatTRY(line.product.price * line.quantity)}
                </p>

                <button
                  type="button"
                  aria-label={`${line.product.name} ürününü sepetten sil`}
                  onClick={() => {
                    change("market", line.product.id, -line.quantity);
                    setNotice(`${line.product.name} sepetten çıkarıldı.`);
                  }}
                  className="min-h-11 rounded-lg px-3 py-2 text-xs font-semibold text-[#991B1B] underline underline-offset-2 transition hover:bg-red-50"
                >
                  Sil
                </button>
              </div>
            </article>
          ))}

          {confirmClear ? (
            <div role="alertdialog" aria-labelledby="clear-market-cart-title" className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-300 bg-red-50 p-4">
              <p id="clear-market-cart-title" className="text-sm font-semibold text-[#991B1B]">
                Market sepetindeki tüm ürünleri silmek istediğine emin misin?
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmClear(false)}
                  className="min-h-11 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:border-brand"
                >
                  Vazgeç
                </button>
                <button
                  type="button"
                  onClick={() => {
                    clear("market");
                    setConfirmClear(false);
                    setNotice("Market sepetin temizlendi.");
                  }}
                  className="min-h-11 rounded-xl bg-[#991B1B] px-4 py-2 text-sm font-semibold text-white hover:bg-red-900"
                >
                  Evet, sepeti temizle
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmClear(true)}
              className="min-h-11 rounded-xl px-3 py-2 text-sm font-semibold text-[#991B1B] underline underline-offset-2 transition hover:bg-red-50"
            >
              Sepeti temizle
            </button>
          )}
        </section>

        <aside className="sticky top-32 h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-extrabold text-slate-900">
            Sipariş özeti
          </h2>

          <div className="mt-5 flex justify-between text-sm text-slate-600">
            <span>Ürün toplamı ({itemCount} ürün)</span>
            <span className="font-medium text-slate-900">
              {formatTRY(subtotal)}
            </span>
          </div>

          <div className="mt-4 flex justify-between text-sm text-slate-600">
            <span>Teslimat ücreti</span>
            <span className="font-medium text-slate-900">
              {store ? formatTRY(deliveryFee) : "Hesaplanacak"}
            </span>
          </div>

          <div className="mt-5 flex justify-between border-t border-slate-200 pt-5">
            <span className="font-bold text-slate-900">Genel toplam</span>
            <span className="text-xl font-extrabold text-slate-900">
              {formatTRY(subtotal + deliveryFee)}
            </span>
          </div>

          {remaining > 0 && (
            <div role="status" className="mt-4 rounded-xl bg-amber-50 p-3 text-sm leading-5 text-[#92400E]">
              Minimum sepet tutarı <strong>{formatTRY(minBasket)}</strong>. Sipariş verebilmek için{" "}
              <strong>{formatTRY(remaining)}</strong> daha ürün eklemelisin.
            </div>
          )}

          {canCheckout && (
            <div className="mt-4 rounded-xl bg-green-50 p-3 text-sm font-medium text-[#166534]">
              ✓ Minimum sepet tutarına ulaştın.
            </div>
          )}

          <button
            type="button"
            disabled={!canCheckout}
            onClick={() => navigate("/checkout/market")}
            className={`mt-6 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-5 py-4 text-sm font-bold text-white transition ${
              canCheckout
                ? "bg-[#D90049] hover:bg-[#B6003C]"
                : "cursor-not-allowed bg-slate-400"
            }`}
          >
            Siparişi tamamla →
          </button>

          <button
            type="button"
            onClick={() => navigate("/market")}
            className="mt-3 min-h-11 w-full rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-brand hover:bg-slate-50"
          >
            Alışverişe devam et
          </button>

          <div className="mt-5 rounded-xl bg-green-50 p-3 text-center text-xs font-medium text-[#166534]">
            ✓ Güvenli alışveriş deneyimi
          </div>
        </aside>
      </div>
    </div>
  );
}
