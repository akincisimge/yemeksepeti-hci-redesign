import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { findFoodCoupon, type FoodCoupon } from "../data/foodData";

type FoodCouponContextValue = {
  activeFoodCoupon: FoodCoupon | null;
  setActiveFoodCoupon: (code: string | null) => void;
};

const FoodCouponContext = createContext<FoodCouponContextValue | null>(null);

export function FoodCouponProvider({ children }: { children: ReactNode }) {
  const [activeCode, setActiveCode] = useState<string | null>(null);

  const setActiveFoodCoupon = useCallback((code: string | null) => {
    const validCode = code && findFoodCoupon(code) ? code : null;
    setActiveCode(validCode);
  }, []);

  const value = useMemo(() => ({
    activeFoodCoupon: findFoodCoupon(activeCode),
    setActiveFoodCoupon,
  }), [activeCode, setActiveFoodCoupon]);

  return <FoodCouponContext.Provider value={value}>{children}</FoodCouponContext.Provider>;
}

export function useFoodCoupon() {
  const context = useContext(FoodCouponContext);
  if (!context) throw new Error("useFoodCoupon, FoodCouponProvider içinde kullanılmalı");
  return context;
}
