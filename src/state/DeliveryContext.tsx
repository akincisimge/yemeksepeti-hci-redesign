import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import {
  analyzeLocationChange,
  deliversTo,
  formatLocationChangeMessage,
  locationLabel,
  locations,
  type DeliveryLocation,
  type LocationChangePlan,
} from "../data/delivery";
import { useCart } from "./CartContext";

const KEY = "hci-delivery-location-v1";

function initial(): DeliveryLocation | null {
  try {
    return locations.find((item) => item.id === localStorage.getItem(KEY)) ?? null;
  } catch {
    return null;
  }
}

type SelectLocationOptions = {
  confirmed?: boolean;
};

type DeliveryContextValue = {
  delivery: DeliveryLocation | null;
  selectLocation: (id: string, options?: SelectLocationOptions) => boolean;
  previewLocationChange: (id: string) => LocationChangePlan | null;
  available: (storeId: string) => boolean;
  statusMessage: string | null;
  clearStatusMessage: () => void;
};

const Context = createContext<DeliveryContextValue | null>(null);

export function DeliveryProvider({ children }: { children: ReactNode }) {
  const [delivery, setDelivery] = useState<DeliveryLocation | null>(initial);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const { carts, clearServices } = useCart();

  const previewLocationChange = useCallback(
    (id: string) => analyzeLocationChange(carts, id),
    [carts],
  );

  const selectLocation = useCallback(
    (id: string, options?: SelectLocationOptions) => {
      const plan = analyzeLocationChange(carts, id);
      if (!plan) return false;

      if (delivery?.id === plan.target.id && plan.affected.length === 0) {
        setStatusMessage(`Teslimat konumun zaten ${locationLabel(plan.target)} olarak ayarlı.`);
        return true;
      }

      if (plan.affected.length > 0 && !options?.confirmed) {
        return false;
      }

      if (plan.affected.length > 0) {
        clearServices(plan.affected.map((item) => item.service));
      }

      setDelivery(plan.target);
      setStatusMessage(formatLocationChangeMessage(plan));
      try {
        localStorage.setItem(KEY, plan.target.id);
      } catch {
        /* storage optional */
      }
      return true;
    },
    [carts, clearServices, delivery?.id],
  );

  const clearStatusMessage = useCallback(() => setStatusMessage(null), []);

  return (
    <Context.Provider
      value={{
        delivery,
        selectLocation,
        previewLocationChange,
        available: (id) => deliversTo(id, delivery?.id),
        statusMessage,
        clearStatusMessage,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useDelivery() {
  const value = useContext(Context);
  if (!value) throw new Error("DeliveryProvider gerekli");
  return value;
}
