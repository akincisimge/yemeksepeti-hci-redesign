import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useCart } from "../../../state/CartContext";
import { formatTRY, type Product } from "../../../types/domain";
import FoodBasket from "../components/FoodBasket";
import FoodMobileBasketBar from "../components/FoodMobileBasketBar";
import {
  createCustomizedFoodProduct,
  foodCoupons,
  foodProducts,
  foodRestaurants,
  foodReviews,
  getFoodCustomizationOptions,
  getFoodCouponCampaignProducts,
  getFoodProductFallbackImage,
  getFoodRestaurantFallbackImage,
  recoverFoodImage,
  type FoodCustomization,
  type FoodPreference,
  type FoodReview,
} from "../data/foodData";
import { useFoodCoupon } from "../state/FoodCouponContext";

export default function FoodRestaurantPage() {
  const { restaurantId } = useParams();
  const [searchParams] = useSearchParams();
  const { activeFoodCoupon, setActiveFoodCoupon } = useFoodCoupon();
  const { add, carts, clear } = useCart();
  const [notice, setNotice] = useState("");
  const [pendingProduct, setPendingProduct] = useState<Product | null>(null);
  const [replacementProduct, setReplacementProduct] = useState<Product | null>(null);
  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);
  const [removedIngredients, setRemovedIngredients] = useState<string[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [preference, setPreference] = useState<FoodPreference>("Normal");
  const [orderNote, setOrderNote] = useState("");
  const [reviews, setReviews] = useState<FoodReview[]>(() => foodReviews[restaurantId ?? ""] ?? []);
  const [reviewRating, setReviewRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewNotice, setReviewNotice] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const customizationDialog = useRef<HTMLDialogElement>(null);
  const restaurant = foodRestaurants.find((item) => item.id === restaurantId);
  const campaignRequested = searchParams.get("campaign") === "true";

  useEffect(() => {
    setReviews(foodReviews[restaurantId ?? ""] ?? []);
    setReviewRating(0);
    setHoveredRating(0);
    setReviewText("");
    setReviewNotice("");
  }, [restaurantId]);

  useEffect(() => {
    if (!campaignRequested || !restaurantId) return;
    const coupon = foodCoupons.find((item) => item.primaryRestaurantId === restaurantId);
    if (coupon) setActiveFoodCoupon(coupon.code);
  }, [campaignRequested, restaurantId, setActiveFoodCoupon]);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (pendingProduct && !element.open) element.showModal();
    if (!pendingProduct && element.open) element.close();
  }, [pendingProduct]);

  useEffect(() => {
    const element = customizationDialog.current;
    if (!element) return;
    if (customizingProduct && !element.open) element.showModal();
    if (!customizingProduct && element.open) element.close();
  }, [customizingProduct]);

  useEffect(() => {
    if (!replacementProduct || carts.food.length > 0) return;
    const result = add(replacementProduct);
    setNotice(result === "added" ? `${replacementProduct.name}: Ürün sepete eklendi` : "Sepet değiştirilemedi.");
    setReplacementProduct(null);
  }, [add, carts.food.length, replacementProduct]);

  if (!restaurant) {
    return (
      <section className="rounded-2xl border border-[#CBD5E1] bg-white p-6">
        <h1 className="text-2xl font-bold text-[#0F172A]">Restoran bulunamadı</h1>
        <p className="mt-2 text-base text-[#475569]">Restoran listesine dönerek başka bir restoran seçebilirsin.</p>
        <Link to="/food" className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-[#D90049] px-5 py-3 font-semibold text-white hover:bg-[#B6003C]">
          Restoranlara dön
        </Link>
      </section>
    );
  }

  const restaurantCoupon = foodCoupons.find((coupon) => coupon.restaurantIds.includes(restaurant.id));
  const selectedRestaurantCoupon = activeFoodCoupon?.restaurantIds.includes(restaurant.id)
    ? activeFoodCoupon
    : restaurantCoupon;
  const campaignProducts = selectedRestaurantCoupon
    ? getFoodCouponCampaignProducts(selectedRestaurantCoupon, restaurant.id)
    : [];
  const campaignProductIds = new Set(campaignProducts.map((product) => product.id));
  const menu = foodProducts
    .filter((product) => product.storeId === restaurant.id)
    .sort((first, second) => Number(campaignProductIds.has(second.id)) - Number(campaignProductIds.has(first.id)));
  const categories = Array.from(new Set(menu.map((product) => product.category)));
  const customizationOptions = customizingProduct
    ? getFoodCustomizationOptions(customizingProduct, restaurant.cuisine)
    : null;
  const customizationTotal = customizingProduct && customizationOptions
    ? customizingProduct.price + customizationOptions.extras
      .filter((extra) => selectedExtras.includes(extra.name))
      .reduce((sum, extra) => sum + extra.price, 0)
    : 0;

  const addProduct = (productId: string) => {
    const product = menu.find((item) => item.id === productId);
    if (!product) return;
    const currentRestaurantId = carts.food[0]?.product.storeId;
    if (currentRestaurantId && currentRestaurantId !== product.storeId) {
      setPendingProduct(product);
      setNotice("");
      return;
    }
    const result = add(product);
    setNotice(result === "added" ? `${product.name}: Ürün sepete eklendi` : "Sepet değiştirilmedi; mevcut ürünler korundu.");
  };

  const requestProduct = (product: Product) => {
    if (product.category.toLocaleLowerCase("tr").includes("içecek")) {
      addProduct(product.id);
      return;
    }

    setRemovedIngredients([]);
    setSelectedExtras([]);
    setPreference("Normal");
    setOrderNote("");
    setCustomizingProduct(product);
  };

  const submitCustomization = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!customizingProduct) return;

    const customization: FoodCustomization = {
      removedIngredients,
      extras: selectedExtras,
      preference,
      note: orderNote.trim(),
    };
    const options = getFoodCustomizationOptions(customizingProduct, restaurant.cuisine);
    const product = createCustomizedFoodProduct(customizingProduct, customization, options);
    const currentRestaurantId = carts.food[0]?.product.storeId;

    setCustomizingProduct(null);
    if (currentRestaurantId && currentRestaurantId !== product.storeId) {
      setPendingProduct(product);
      setNotice("");
      return;
    }

    const result = add(product);
    setNotice(result === "added" ? `${product.name}: Ürün sepete eklendi` : "Sepet değiştirilmedi; mevcut ürünler korundu.");
  };

  const replaceBasketAndAdd = () => {
    if (!pendingProduct) return;
    clear("food");
    setReplacementProduct(pendingProduct);
    setPendingProduct(null);
  };

  const submitReview = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const comment = reviewText.trim();
    if (!restaurant || reviewRating < 1 || !comment) return;

    const review: FoodReview = {
      id: `${restaurant.id}-user-${Date.now()}`,
      userName: "Sen",
      date: new Date().toLocaleDateString("tr-TR"),
      rating: reviewRating,
      menuItem: "Restoran deneyimi",
      comment,
    };
    setReviews((current) => [review, ...current]);
    setReviewText("");
    setReviewRating(0);
    setHoveredRating(0);
    setReviewNotice("Yorumunuz eklendi!");
  };

  return (
    <div
      className="relative left-1/2 max-w-[1400px] -translate-x-1/2 space-y-8 px-4 pb-24 lg:pb-0"
      style={{ width: "min(1400px, calc(100vw - 2rem))" }}
    >
      <Link to="/food" className="inline-flex min-h-11 items-center font-semibold text-[#D90049] underline underline-offset-4 hover:text-[#B6003C]">
        ← Restoran listesine dön
      </Link>

      {selectedRestaurantCoupon && (
        <section className={`flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5 ${
          activeFoodCoupon?.code === selectedRestaurantCoupon.code
            ? "border-emerald-200 bg-emerald-50"
            : "border-[#FBCFE8] bg-[#FFF0F5]"
        }`}>
          <div>
            <p className={`font-bold ${activeFoodCoupon?.code === selectedRestaurantCoupon.code ? "text-emerald-800" : "text-[#9F1239]"}`}>
              {activeFoodCoupon?.code === selectedRestaurantCoupon.code
                ? `🎉 ${selectedRestaurantCoupon.code} Kuponu Aktif!`
                : `${selectedRestaurantCoupon.code} kupon fırsatı`}
            </p>
            <p className="mt-1 text-sm leading-5 text-[#334155]">
              Kampanyalı menüyü sepetine ekle; {selectedRestaurantCoupon.discountType === "percentage"
                ? `%${selectedRestaurantCoupon.discountValue}`
                : `${formatTRY(selectedRestaurantCoupon.discountValue)}`} ekstra indirim uygula. Min. sepet {formatTRY(selectedRestaurantCoupon.minimumSubtotal)}.
            </p>
          </div>
          {activeFoodCoupon?.code !== selectedRestaurantCoupon.code && (
            <button
              type="button"
              onClick={() => setActiveFoodCoupon(selectedRestaurantCoupon.code)}
              className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl bg-[#D90049] px-4 py-2 font-semibold text-white hover:bg-[#B6003C]"
            >
              Kuponu Uygula
            </button>
          )}
        </section>
      )}

      <div className="grid items-start gap-6 lg:grid-cols-[18rem_minmax(0,1fr)_18rem]">
        <aside className="order-3 lg:order-1 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:w-72 lg:overflow-y-auto lg:pr-2">
          <section aria-labelledby="reviews-title" className="space-y-5 rounded-2xl border border-[#CBD5E1] bg-white p-5 shadow-sm">
            <div>
              <h2 id="reviews-title" className="text-xl font-bold text-[#0F172A]">Müşteri Yorumları ve Değerlendirme</h2>
              <div className="mt-4 flex items-center gap-3">
                <span aria-hidden="true" className="text-2xl tracking-wide text-amber-400">★★★★★</span>
                <strong className="text-xl text-[#0F172A]">{restaurant.rating.toFixed(1)} / 5.0</strong>
              </div>
              <p className="mt-1 text-sm text-[#475569]">{restaurant.ratingCount} değerlendirme</p>
            </div>

            <dl className="space-y-3">
              {[
                { label: "Lezzet", score: Math.min(5, restaurant.rating + 0.1) },
                { label: "Servis", score: Math.max(1, restaurant.rating - 0.1) },
                { label: "Hız", score: Math.max(1, restaurant.rating - 0.2) },
              ].map(({ label, score }) => (
                <div key={label}>
                  <div className="mb-1 flex justify-between text-sm text-[#475569]">
                    <dt>{label}</dt><dd>{score.toFixed(1)}</dd>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[#F1F5F9]">
                    <div className="h-full rounded-full bg-[#D90049]" style={{ width: `${score * 20}%` }} />
                  </div>
                </div>
              ))}
            </dl>

            <form onSubmit={submitReview} className="mt-2 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-3.5">
              <h3 className="font-semibold text-[#0F172A]">Yıldız ver ve yorum yap</h3>
              <div
                role="group"
                aria-label="1 ile 5 arasında puan ver"
                className="flex items-center gap-1"
                onMouseLeave={() => setHoveredRating(0)}
              >
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    aria-label={`${rating} yıldız ver`}
                    aria-pressed={reviewRating === rating}
                    onMouseEnter={() => setHoveredRating(rating)}
                    onFocus={() => setHoveredRating(rating)}
                    onBlur={() => setHoveredRating(0)}
                    onClick={() => setReviewRating(rating)}
                    style={{
                      color: (hoveredRating || reviewRating) >= rating ? "#F59E0B" : "#CBD5E1",
                      fontSize: "24px",
                    }}
                    className="min-h-11 min-w-9"
                  >
                    ★
                  </button>
                ))}
              </div>
              <label className="block">
                <span className="sr-only">Kısa yorumunuz</span>
                <textarea
                  value={reviewText}
                  onChange={(event) => setReviewText(event.target.value)}
                  rows={3}
                  maxLength={300}
                  required
                  placeholder="Deneyimini kısaca paylaş…"
                  style={{
                    border: "2px solid #CBD5E1",
                    backgroundColor: "#FFFFFF",
                    color: "#0F172A",
                    padding: "10px",
                    borderRadius: "10px",
                  }}
                  className="w-full text-sm placeholder:text-slate-400 outline-none focus:border-[#D90049]"
                />
              </label>
              <button
                type="submit"
                disabled={!reviewRating || !reviewText.trim()}
                style={{
                  backgroundColor: "#D90049",
                  color: "#FFFFFF",
                  fontWeight: 600,
                  padding: "10px 16px",
                  borderRadius: "10px",
                  width: "100%",
                  marginTop: "8px",
                  opacity: !reviewRating || !reviewText.trim() ? 0.55 : 1,
                  cursor: !reviewRating || !reviewText.trim() ? "not-allowed" : "pointer",
                }}
                className="inline-flex min-h-11 items-center justify-center text-sm hover:bg-[#B6003C]"
              >
                Yorumu Gönder
              </button>
              <p role="status" aria-live="polite" className="min-h-5 text-sm font-semibold text-[#166534]">{reviewNotice}</p>
            </form>

            <section aria-label="Müşteri yorumları">
              <h3 className="mb-3 font-semibold text-[#0F172A]">Son yorumlar</h3>
              <ul className="max-h-80 space-y-3 overflow-y-auto pr-1">
                {reviews.map((review) => (
                  <li key={review.id} className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                    <div className="flex items-start justify-between gap-2">
                      <strong className="text-sm text-[#0F172A]">{review.userName}</strong>
                      <time className="shrink-0 text-xs text-[#64748B]">{review.date}</time>
                    </div>
                    <p className="mt-1 text-sm tracking-wide text-amber-500" aria-label={`${review.rating} yıldız`}>{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</p>
                    <p className="mt-1 text-xs font-medium text-[#475569]">{review.menuItem}</p>
                    <p className="mt-2 text-sm leading-5 text-[#334155]">{review.comment}</p>
                  </li>
                ))}
              </ul>
            </section>
          </section>
        </aside>

        <div className="order-1 min-w-0 flex-1 space-y-6 lg:order-2">
          <section>
            <img
              src={restaurant.image}
              alt={restaurant.imageLabel}
              onError={(event) => recoverFoodImage(event.currentTarget, getFoodRestaurantFallbackImage(restaurant.cuisine))}
              className="mb-4 h-40 w-full rounded-2xl object-cover"
            />
            <div className="rounded-2xl border border-[#CBD5E1] bg-white p-4 sm:p-6">
              <div className="min-w-0">
                <p className="font-semibold text-[#D90049]">{restaurant.cuisine}</p>
                <h1 className="mt-1 text-3xl font-bold leading-10 text-[#0F172A]">{restaurant.name}</h1>
                <p className="mt-2 text-base leading-6 text-[#475569]">{restaurant.description}</p>
                <p className="mt-3 text-sm leading-5 text-[#0F172A]">
                  <span className="text-[#D90049]" aria-hidden="true">★</span> {restaurant.rating.toFixed(1)} ({restaurant.ratingCount})
                  <span aria-hidden="true"> · </span>{restaurant.deliveryTime}
                  <span aria-hidden="true"> · </span>Min. sepet {formatTRY(restaurant.minBasket)}
                </p>
                <p className="mt-1 text-sm leading-5 text-[#475569]">
                  {restaurant.deliveryFee === 0 ? "Ücretsiz teslimat" : `Teslimat ${formatTRY(restaurant.deliveryFee)}`}
                </p>
              </div>
            </div>
          </section>

          <section aria-labelledby="menu-title" className="min-w-0">
            <h2 id="menu-title" className="text-2xl font-bold text-[#0F172A]">Menü</h2>
            <p role="status" aria-live="polite" className="mt-3 min-h-6 font-semibold text-[#166534]">{notice}</p>
            {categories.map((category) => (
              <div key={category} className="mt-5">
                <h3 className="mb-3 text-xl font-semibold text-[#0F172A]">{category}</h3>
                <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {menu.filter((product) => product.category === category).map((product) => (
                    <li
                      key={product.id}
                      className={`flex flex-col justify-between rounded-2xl border bg-white p-4 shadow-sm transition-all hover:shadow-md ${
                        product.campaignOriginalPrice ? "border-[#D90049] ring-1 ring-[#FBCFE8]" : "border-slate-200"
                      }`}
                    >
                      {product.campaignOriginalPrice && (
                        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                          <span className="inline-flex min-h-8 items-center rounded-full bg-[#D90049] px-3 py-1 text-xs font-bold text-white">
                            🔥 Günün Kampanyalı Menüsü
                          </span>
                          <span className="text-xs font-semibold text-[#9F1239]">{product.campaignCouponCode} kuponuna uygun</span>
                        </div>
                      )}
                      {product.image && (
                        <img
                          src={product.image}
                          alt={product.name}
                          onError={(event) => recoverFoodImage(event.currentTarget, getFoodProductFallbackImage(product.name))}
                          className="mb-3 h-36 w-full rounded-xl object-cover"
                          loading="lazy"
                        />
                      )}
                      <div className="flex flex-1 flex-col justify-between gap-4">
                        <div>
                          <h4 className="text-base font-bold leading-6 text-slate-900">{product.name}</h4>
                          <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-600">{product.description}</p>
                        </div>
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex flex-wrap items-baseline gap-2">
                            {product.campaignOriginalPrice && (
                              <del className="text-sm text-slate-500">{formatTRY(product.campaignOriginalPrice)}</del>
                            )}
                            <strong className={`text-lg font-bold ${product.campaignOriginalPrice ? "text-[#D90049]" : "text-slate-900"}`}>
                              {formatTRY(product.price)}
                            </strong>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {product.category.toLocaleLowerCase("tr").includes("içecek") ? (
                              <button
                                type="button"
                                onClick={() => requestProduct(product)}
                                className="inline-flex min-h-11 shrink-0 items-center justify-center whitespace-nowrap rounded-xl bg-[#D90049] px-4 py-2 text-sm font-semibold text-white hover:bg-[#B6003C]"
                              >
                                Sepete ekle
                              </button>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={() => requestProduct(product)}
                                  className="inline-flex min-h-11 shrink-0 items-center justify-center whitespace-nowrap rounded-xl border border-[#D90049] px-3 py-2 text-sm font-semibold text-[#D90049] hover:bg-rose-50"
                                >
                                  İçindekileri Seç
                                </button>
                                <button
                                  type="button"
                                  onClick={() => requestProduct(product)}
                                  className="inline-flex min-h-11 shrink-0 items-center justify-center whitespace-nowrap rounded-xl bg-[#D90049] px-4 py-2 text-sm font-semibold text-white hover:bg-[#B6003C]"
                                >
                                  Sepete ekle
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <Link
              to="/cart/food"
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl border border-[#CBD5E1] bg-white px-5 py-3 font-semibold text-[#0F172A] hover:border-[#D90049]"
            >
              Yemek sepetine git
            </Link>
          </section>
        </div>

        <aside className="order-2 sticky top-24 hidden h-fit w-72 lg:order-3 lg:block">
          <FoodBasket onNotice={setNotice} />
        </aside>
      </div>

      <dialog
        ref={customizationDialog}
        aria-labelledby="food-customization-title"
        onClose={() => setCustomizingProduct(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) customizationDialog.current?.close();
        }}
        className="fixed inset-0 m-auto max-h-[90vh] w-[calc(100%_-_24px)] max-w-xl overflow-y-auto rounded-2xl border border-[#CBD5E1] bg-white p-0 shadow-2xl backdrop:bg-[#0F172A]/50"
      >
        {customizingProduct && customizationOptions && (
          <form onSubmit={submitCustomization} className="space-y-5 p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[#D90049]">Ürününü dilediğin gibi hazırla</p>
                <h2 id="food-customization-title" className="mt-1 text-xl font-bold text-[#0F172A]">
                  {customizingProduct.name}
                </h2>
                <p className="mt-1 text-sm text-[#475569]">İçindekileri çıkarabilir, ekstra ekleyebilirsin.</p>
              </div>
              <button
                type="button"
                onClick={() => customizationDialog.current?.close()}
                aria-label="Özelleştirme penceresini kapat"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-2xl text-[#475569] hover:bg-slate-100"
              >
                ×
              </button>
            </div>

            <fieldset>
              <legend className="font-semibold text-[#0F172A]">İçindekilerden Çıkar <span className="text-sm font-normal text-[#166534]">(Ücretsiz)</span></legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {customizationOptions.ingredients.map((ingredient) => {
                  const included = !removedIngredients.includes(ingredient);
                  return (
                    <label
                      key={ingredient}
                      className={`inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-3 py-2 text-sm ${
                        included ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-slate-300 bg-slate-100 text-slate-500"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={included}
                        onChange={(event) => setRemovedIngredients((current) => event.target.checked
                          ? current.filter((item) => item !== ingredient)
                          : [...current, ingredient])}
                        className="accent-[#D90049]"
                      />
                      <span className={included ? "" : "line-through"}>{ingredient}</span>
                      <span className="text-xs">{included ? "İçinde var" : "Çıkarıldı"}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <fieldset>
              <legend className="font-semibold text-[#0F172A]">Ekstra malzeme / yan seçim <span className="text-sm font-normal text-[#475569]">(İsteğe bağlı)</span></legend>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {customizationOptions.extras.map((extra) => (
                  <label key={extra.name} className="flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-xl border border-[#CBD5E1] px-3 py-2 text-sm text-[#0F172A] hover:border-[#D90049]">
                    <span className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedExtras.includes(extra.name)}
                        onChange={(event) => setSelectedExtras((current) => event.target.checked
                          ? [...current, extra.name]
                          : current.filter((item) => item !== extra.name))}
                        className="accent-[#D90049]"
                      />
                      {extra.name}
                    </span>
                    <span className="shrink-0 text-[#475569]">+{formatTRY(extra.price)}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="font-semibold text-[#0F172A]">Porsiyon / acı tercihi</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {(["Normal", "Bol Acılı", "Acısız"] as const).map((option) => (
                  <label key={option} className={`inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm ${preference === option ? "border-[#D90049] bg-rose-50 font-semibold text-[#9F1239]" : "border-[#CBD5E1] text-[#475569]"}`}>
                    <input
                      type="radio"
                      name="food-preference"
                      value={option}
                      checked={preference === option}
                      onChange={() => setPreference(option)}
                      className="accent-[#D90049]"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </fieldset>

            <label className="block">
              <span className="font-semibold text-[#0F172A]">Sipariş notu <span className="text-sm font-normal text-[#475569]">(İsteğe bağlı)</span></span>
              <textarea
                value={orderNote}
                onChange={(event) => setOrderNote(event.target.value)}
                maxLength={120}
                rows={2}
                placeholder="Zile basmayın, bol peçete olsun…"
                className="mt-2 w-full resize-y rounded-xl border border-[#CBD5E1] px-3 py-2 text-sm text-[#0F172A] outline-none focus:border-[#D90049] focus:ring-2 focus:ring-rose-100"
              />
              <span className="mt-1 block text-right text-xs text-[#64748B]">{orderNote.length}/120</span>
            </label>

            <div className="flex flex-col-reverse gap-3 border-t border-[#E2E8F0] pt-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => customizationDialog.current?.close()}
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#CBD5E1] px-4 py-3 font-semibold text-[#0F172A] hover:border-[#D90049]"
              >
                Vazgeç
              </button>
              <button type="submit" className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#D90049] px-5 py-3 font-semibold text-white hover:bg-[#B6003C]">
                Sepete ekle · {formatTRY(customizationTotal)}
              </button>
            </div>
          </form>
        )}
      </dialog>

      <dialog
        ref={dialog}
        aria-labelledby="restaurant-switch-title"
        onClose={() => setPendingProduct(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
        className="fixed inset-0 m-auto w-[calc(100%_-_24px)] max-w-lg rounded-2xl border border-[#CBD5E1] bg-white p-6 shadow-2xl backdrop:bg-[#0F172A]/50"
      >
        <h2 id="restaurant-switch-title" className="text-xl font-bold text-[#0F172A]">Restoran değişikliğini onayla</h2>
        <p className="mt-3 leading-6 text-[#475569]">
          Sepetinizde başka bir restorana ({foodRestaurants.find((item) => item.id === carts.food[0]?.product.storeId)?.name ?? carts.food[0]?.product.storeName}) ait ürünler var. Aynı anda yalnızca tek bir restorandan sipariş verebilirsiniz.
        </p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => dialog.current?.close()}
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#CBD5E1] px-4 py-3 font-semibold text-[#0F172A] hover:border-[#D90049]"
          >
            Vazgeç / Mevcut Sepeti Koru
          </button>
          <button
            type="button"
            onClick={replaceBasketAndAdd}
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#D90049] px-4 py-3 font-semibold text-white hover:bg-[#B6003C]"
          >
            Sepeti Temizle ve Bu Ürünü Ekle
          </button>
        </div>
      </dialog>
      <FoodMobileBasketBar />
    </div>
  );
}
