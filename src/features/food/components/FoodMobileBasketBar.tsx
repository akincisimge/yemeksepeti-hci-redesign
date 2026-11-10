import { useRef } from "react";
import { formatTRY } from "../../../types/domain";
import { calculateFoodCouponDiscount, foodRestaurants } from "../data/foodData";
import { useCart } from "../../../state/CartContext";
import { useFoodCoupon } from "../state/FoodCouponContext";
import FoodBasket from "./FoodBasket";

export default function FoodMobileBasketBar() {
  const { carts } = useCart();
  const { activeFoodCoupon } = useFoodCoupon();
  const basketButton = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const lines = carts.food;

  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  const restaurant = foodRestaurants.find((item) => item.id === lines[0]?.product.storeId);
  const deliveryFee = lines.length ? restaurant?.deliveryFee ?? 0 : 0;
  const couponDiscount = calculateFoodCouponDiscount(activeFoodCoupon, lines).discount;
  const grandTotal = subtotal - couponDiscount + deliveryFee;

  return (
    <>
      <div className="fixed bottom-4 left-4 right-4 z-40 lg:hidden">
        <button
          ref={basketButton}
          type="button"
          className="btn-primary mx-auto flex w-full max-w-xl justify-between shadow-lg"
          onClick={() => dialog.current?.showModal()}
          aria-haspopup="dialog"
        >
          <span>Sepetim · {itemCount} ürün</span>
          <span>{formatTRY(grandTotal)} →</span>
        </button>
      </div>
      <dialog
        ref={dialog}
        aria-label="Yemek sepetin"
        onClose={() => basketButton.current?.focus()}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
        className="fixed inset-0 m-auto max-h-[85dvh] w-[calc(100%_-_24px)] max-w-md overflow-y-auto rounded-3xl bg-white p-4 backdrop:bg-slate-900/40"
      >
        <button
          type="button"
          autoFocus
          onClick={() => dialog.current?.close()}
          className="mb-3 min-h-11 w-full rounded-xl border border-slate-300 font-semibold"
        >
          Alışverişe dön · Kapat ×
        </button>
        <FoodBasket />
      </dialog>
    </>
  );
}
