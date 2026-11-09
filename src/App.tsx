
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import CheckoutPage from "./pages/CheckoutPage";
import SuccessPage from "./pages/SuccessPage";

import MarketHomePage from "./features/market/pages/MarketHomePage";
import MarketCatalogPage from "./features/market/pages/MarketCatalogPage";
import MarketProductPage from "./features/market/pages/MarketProductPage";
import MarketCartPage from "./features/market/pages/MarketCartPage";
import FoodHomePage from "./features/food/pages/FoodHomePage";
import FoodRestaurantPage from "./features/food/pages/FoodRestaurantPage";
import FoodCartPage from "./features/food/pages/FoodCartPage";

export default function App() {
  return (
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

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

