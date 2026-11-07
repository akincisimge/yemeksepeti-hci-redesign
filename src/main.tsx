import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { DeliveryProvider } from "./state/DeliveryContext";
import { CartProvider } from "./state/CartContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <CartProvider>
        <DeliveryProvider><App /></DeliveryProvider>
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
);
