import { Link } from "react-router-dom";
import type { FoodRestaurant } from "../data/foodData";
import { formatTRY } from "../../../types/domain";

export default function RestaurantCard({ restaurant }: { restaurant: FoodRestaurant }) {
  return (
    <article className="h-full overflow-hidden rounded-2xl border border-[#CBD5E1] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link
        to={`/food/${restaurant.id}`}
        className="flex h-full flex-col focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#D90049]"
        aria-label={`${restaurant.name}, menüyü görüntüle`}
      >
        <div className="relative aspect-[16/9] overflow-hidden bg-[#F8FAFC]">
          <img
            src={restaurant.image}
            alt={restaurant.imageLabel}
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <span className="absolute bottom-3 right-3 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-[#0F172A] shadow">
            {restaurant.highlight}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="min-w-0 flex-1 text-lg font-semibold leading-6 text-[#0F172A]">
              {restaurant.name}
            </h3>
            <span className="shrink-0 whitespace-nowrap text-sm font-semibold text-[#0F172A]" aria-label={`Puan ${restaurant.rating}, ${restaurant.ratingCount} değerlendirme`}>
              <span className="text-[#D90049]" aria-hidden="true">★</span> {restaurant.rating.toFixed(1)} ({restaurant.ratingCount})
            </span>
          </div>
          <p className="mt-2 text-sm leading-5 text-[#475569]">
            {restaurant.deliveryTime} <span aria-hidden="true">·</span> {restaurant.cuisine}
          </p>
          <p className="mt-1 text-sm leading-5 text-[#475569]">
            Min. sepet {formatTRY(restaurant.minBasket)}
          </p>
          <p className="mt-1 text-sm leading-5 text-[#475569]">
            {restaurant.deliveryFee === 0 ? "Ücretsiz teslimat" : `Teslimat ${formatTRY(restaurant.deliveryFee)}`}
          </p>
          <div className="mt-3 min-h-7">
            {restaurant.discount && (
              <span className="inline-flex min-h-7 items-center rounded-lg bg-[#FFF1F6] px-3 py-1 text-sm font-semibold text-[#D90049]">
                {restaurant.discount}
              </span>
            )}
          </div>
          <span className="mt-4 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#D90049] px-5 py-3 font-semibold text-white transition hover:bg-[#B6003C]">
            Menüyü Gör
          </span>
        </div>
      </Link>
    </article>
  );
}
