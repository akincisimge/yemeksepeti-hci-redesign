import type { CartLine } from "../../../types/domain";
import { calculateFoodCouponDiscount, foodCoupons } from "../data/foodData";
import { useFoodCoupon } from "../state/FoodCouponContext";

export default function FoodCouponSelector({ lines }: { lines: CartLine[] }) {
  const { activeFoodCoupon, setActiveFoodCoupon } = useFoodCoupon();
  const application = calculateFoodCouponDiscount(activeFoodCoupon, lines);

  return (
    <div className="space-y-2 rounded-xl border border-[#CBD5E1] bg-slate-50 p-3">
      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold text-[#0F172A]">Yemek kuponu</span>
        <select
          value={activeFoodCoupon?.code ?? ""}
          onChange={(event) => setActiveFoodCoupon(event.target.value || null)}
          className="min-h-11 w-full rounded-lg border border-[#CBD5E1] bg-white px-3 py-2 text-sm text-[#0F172A] focus:border-[#D90049] focus:outline-none focus:ring-2 focus:ring-rose-100"
        >
          <option value="">Kupon seçin</option>
          {foodCoupons.map((coupon) => (
            <option key={coupon.code} value={coupon.code}>
              {coupon.code} · {coupon.title}
            </option>
          ))}
        </select>
      </label>
      <p role="status" className={`text-xs leading-5 ${application.applicable ? "font-semibold text-emerald-700" : "text-slate-600"}`}>
        {application.message}
      </p>
    </div>
  );
}
