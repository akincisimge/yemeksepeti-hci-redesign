import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { DeliveryProvider } from "./state/DeliveryContext";
import { CartProvider } from "./state/CartContext";
import { AccountProvider } from "./state/AccountContext";
import { FoodCouponProvider } from "./features/food/state/FoodCouponContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AccountProvider>
        <CartProvider>
          <FoodCouponProvider>
            <DeliveryProvider>
              <App />
            </DeliveryProvider>
          </FoodCouponProvider>
        </CartProvider>
      </AccountProvider>
    </BrowserRouter>
  </React.StrictMode>
);
