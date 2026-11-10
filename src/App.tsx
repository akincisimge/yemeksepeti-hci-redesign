import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";

const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const SuccessPage = lazy(() => import("./pages/SuccessPage"));
const SupportPage = lazy(() => import("./pages/SupportPage"));
const MarketHomePage = lazy(() => import("./features/market/pages/MarketHomePage"));
const MarketCatalogPage = lazy(() => import("./features/market/pages/MarketCatalogPage"));
const MarketProductPage = lazy(() => import("./features/market/pages/MarketProductPage"));
const MarketCartPage = lazy(() => import("./features/market/pages/MarketCartPage"));
const FoodHomePage = lazy(() => import("./features/food/pages/FoodHomePage"));
const FoodRestaurantPage = lazy(() => import("./features/food/pages/FoodRestaurantPage"));
const FoodCartPage = lazy(() => import("./features/food/pages/FoodCartPage"));

function PageLoadingState() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm"
    >
      <p className="text-base font-semibold text-slate-900">Sayfa içeriği yükleniyor…</p>
      <p className="mt-2 text-sm text-slate-600">Lütfen bekle.</p>
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<PageLoadingState />}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />

          <Route path="food" element={<FoodHomePage />} />
          <Route path="food/:restaurantId" element={<FoodRestaurantPage />} />

          <Route path="market" element={<MarketHomePage />} />
          <Route path="market/:storeId" element={<MarketCatalogPage />} />
          <Route path="market/product/:productId" element={<MarketProductPage />} />

          <Route path="cart/food" element={<FoodCartPage />} />
          <Route path="cart/market" element={<MarketCartPage />} />

          <Route path="checkout/:service" element={<CheckoutPage />} />
          <Route path="success" element={<SuccessPage />} />
          <Route path="track" element={<SuccessPage />} />
          <Route path="support" element={<SupportPage />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
