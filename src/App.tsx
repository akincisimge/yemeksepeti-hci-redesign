import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import CatalogPage from "./pages/CatalogPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import SuccessPage from "./pages/SuccessPage";

export default function App() {
  return <Routes>
    <Route element={<Layout />}>
      <Route index element={<HomePage />} />
      <Route path="food" element={<CatalogPage service="food" />} />
      <Route path="market" element={<CatalogPage service="market" />} />
      <Route path="cart/:service" element={<CartPage />} />
      <Route path="checkout/:service" element={<CheckoutPage />} />
      <Route path="success" element={<SuccessPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  </Routes>;
}
