import { Link } from "react-router-dom";
import { getFoodRestaurantFallbackImage, recoverFoodImage, type FoodRestaurant } from "../data/foodData";
import { formatTRY } from "../../../types/domain";

export default function RestaurantCard({ restaurant }: { restaurant: FoodRestaurant }) {
  return (
    <article className="h-full rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:shadow-md">
      <Link
        to={`/food/${restaurant.id}`}
        className="flex h-full flex-col focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#D90049]"
        aria-label={`${restaurant.name}, menüyü görüntüle`}
      >
        <div className="relative mb-4 h-56 w-full overflow-hidden rounded-xl bg-slate-100">
          <img
            src={restaurant.image}
            alt={restaurant.imageLabel}
            onError={(event) => recoverFoodImage(event.currentTarget, getFoodRestaurantFallbackImage(restaurant.cuisine))}
            className="h-full w-full rounded-xl object-cover"
            loading="lazy"
          />
          <span className="absolute bottom-3 right-3 rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-slate-800 shadow">
            {restaurant.highlight}
          </span>
        </div>
        <div className="flex flex-1 flex-col">
          <h3 className="text-lg font-bold leading-6 text-slate-900">
            {restaurant.name}
          </h3>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-600">
            <span className="whitespace-nowrap font-medium" aria-label={`Puan ${restaurant.rating}, ${restaurant.ratingCount} değerlendirme`}>
              <span className="text-[#D90049]" aria-hidden="true">★</span> {restaurant.rating.toFixed(1)} ({restaurant.ratingCount})
            </span>
            <span aria-hidden="true">·</span>
            <span>{restaurant.deliveryTime}</span>
          </div>
          <p className="mt-2 text-sm leading-5 text-slate-600">
            {restaurant.cuisine}
          </p>
          <p className="mt-2 text-sm leading-5 text-slate-600">
            Min. sepet {formatTRY(restaurant.minBasket)}
          </p>
          <p className="mt-2 text-sm leading-5 text-slate-600">
            {restaurant.deliveryFee === 0 ? "Ücretsiz teslimat" : `Teslimat ${formatTRY(restaurant.deliveryFee)}`}
          </p>
          <div className="mt-4 min-h-7">
            {restaurant.discount && (
              <span className="inline-flex min-h-7 items-center rounded-lg bg-[#FFF1F6] px-3 py-1 text-sm font-semibold text-[#D90049]">
                {restaurant.discount}
              </span>
            )}
          </div>
          <span className="mt-auto inline-flex min-h-11 w-full items-center justify-center whitespace-nowrap rounded-xl bg-[#D90049] px-4 py-2.5 font-semibold text-white transition hover:bg-[#B6003C]">
            Menüyü Gör
          </span>
        </div>
      </Link>
    </article>
  );
}
