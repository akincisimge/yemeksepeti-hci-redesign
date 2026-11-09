import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCart } from "../../../state/CartContext";
import { formatTRY } from "../../../types/domain";
import { foodProducts, foodRestaurants } from "../data/foodData";

export default function FoodRestaurantPage() {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const { add, count } = useCart();
  const [notice, setNotice] = useState("");
  const restaurant = foodRestaurants.find((item) => item.id === restaurantId);

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

  const menu = foodProducts.filter((product) => product.storeId === restaurant.id);
  const categories = Array.from(new Set(menu.map((product) => product.category)));

  const addProduct = (productId: string) => {
    const product = menu.find((item) => item.id === productId);
    if (!product) return;
    const result = add(product);
    setNotice(result === "added" ? `${product.name}: Ürün sepete eklendi` : "Sepet değiştirilmedi; mevcut ürünler korundu.");
  };

  return (
    <div className="space-y-8">
      <Link to="/food" className="inline-flex min-h-11 items-center font-semibold text-[#D90049] underline underline-offset-4 hover:text-[#B6003C]">
        ← Restoran listesine dön
      </Link>

      <section className="overflow-hidden rounded-2xl border border-[#CBD5E1] bg-white">
        <img src={restaurant.image} alt={restaurant.imageLabel} className="aspect-[16/9] w-full object-cover sm:aspect-[3/1]" />
        <div className="flex flex-col gap-5 p-4 sm:flex-row sm:items-center sm:p-6">
          <div className="min-w-0 flex-1">
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
          <Link to="/cart/food" className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl border border-[#CBD5E1] px-4 py-3 font-semibold text-[#0F172A] hover:border-[#D90049]">
            Yemek Sepetim ({count("food")})
          </Link>
        </div>
      </section>

      <section aria-labelledby="menu-title">
        <h2 id="menu-title" className="text-2xl font-bold text-[#0F172A]">Menü</h2>
        <p role="status" aria-live="polite" className="mt-3 min-h-6 font-semibold text-[#166534]">{notice}</p>
        {categories.map((category) => (
          <div key={category} className="mt-5">
            <h3 className="mb-3 text-xl font-semibold text-[#0F172A]">{category}</h3>
            <ul className="grid gap-4 sm:grid-cols-2">
              {menu.filter((product) => product.category === category).map((product) => (
                <li key={product.id} className="flex flex-col overflow-hidden rounded-2xl border border-[#CBD5E1] bg-white sm:flex-row">
                  {product.image && (
                    <img src={product.image} alt="" className="aspect-square w-full object-cover sm:w-36" loading="lazy" />
                  )}
                  <div className="flex flex-1 flex-col justify-between gap-4 p-4">
                    <div>
                      <h4 className="text-lg font-semibold leading-7 text-[#0F172A]">{product.name}</h4>
                      <p className="mt-1 text-base leading-6 text-[#475569]">{product.description}</p>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <strong className="text-base text-[#0F172A]">{formatTRY(product.price)}</strong>
                      <button
                        type="button"
                        onClick={() => addProduct(product.id)}
                        className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#D90049] px-5 py-3 font-semibold text-white hover:bg-[#B6003C]"
                      >
                        Sepete ekle
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <button
          type="button"
          onClick={() => navigate("/cart/food")}
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl border border-[#CBD5E1] bg-white px-5 py-3 font-semibold text-[#0F172A] hover:border-[#D90049]"
        >
          Yemek sepetine git
        </button>
      </section>
    </div>
  );
}
