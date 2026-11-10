import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import {
  analyzeLocationChange,
  deliversTo,
  formatLocationChangeMessage,
  locationLabel,
  resolveLocation,
  type DeliveryLocation,
  type LocationChangePlan,
} from "../data/delivery";
import { useCart } from "./CartContext";

const KEY = "hci-delivery-location-v1";
const DETAILS_KEY = "hci-delivery-details-v1";
const COURIER_NOTE_KEY = "hci-courier-note-v1";

export type AddressDetails = {
  street: string;
  buildingNo: string;
  floor: string;
  apartmentNo: string;
  note?: string;
};

export function normalizeAddressDetails(raw: unknown): AddressDetails | null {
  if (!raw || typeof raw !== "object") return null;
  const candidate = raw as Partial<AddressDetails>;
  const street = typeof candidate.street === "string" ? candidate.street.trim() : "";
  const buildingNo = typeof candidate.buildingNo === "string" ? candidate.buildingNo.trim() : "";
  const floor = typeof candidate.floor === "string" ? candidate.floor.trim() : "";
  const apartmentNo = typeof candidate.apartmentNo === "string" ? candidate.apartmentNo.trim() : "";
  if (!street || !buildingNo || !floor || !apartmentNo) return null;
  const note = typeof candidate.note === "string" ? candidate.note.trim() : "";
  return note ? { street, buildingNo, floor, apartmentNo, note } : { street, buildingNo, floor, apartmentNo };
}

export function formatAddressDetails(details: AddressDetails): string {
  const base = `${details.street}, Bina/Apt No: ${details.buildingNo}, Kat: ${details.floor}, Daire: ${details.apartmentNo}`;
  return details.note ? `${base} (${details.note})` : base;
}

function initial(): DeliveryLocation | null {
  try {
    return resolveLocation(localStorage.getItem(KEY));
  } catch {
    return null;
  }
}

function initialDetails(): AddressDetails | null {
  try {
    const raw = localStorage.getItem(DETAILS_KEY);
    return raw ? normalizeAddressDetails(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

function initialCourierNote(): string {
  try {
    const raw = localStorage.getItem(COURIER_NOTE_KEY);
    return typeof raw === "string" ? raw.trim().slice(0, 160) : "";
  } catch {
    return "";
  }
}

type SelectLocationOptions = {
  confirmed?: boolean;
  details?: AddressDetails;
};

type DeliveryContextValue = {
  delivery: DeliveryLocation | null;
  addressDetails: AddressDetails | null;
  courierNote: string;
  saveCourierNote: (note: string) => void;
  selectLocation: (id: string, options?: SelectLocationOptions) => boolean;
  previewLocationChange: (id: string) => LocationChangePlan | null;
  available: (storeId: string) => boolean;
  statusMessage: string | null;
  clearStatusMessage: () => void;
};

const Context = createContext<DeliveryContextValue | null>(null);

export function DeliveryProvider({ children }: { children: ReactNode }) {
  const [delivery, setDelivery] = useState<DeliveryLocation | null>(initial);
  const [addressDetails, setAddressDetails] = useState<AddressDetails | null>(initialDetails);
  const [courierNote, setCourierNote] = useState<string>(initialCourierNote);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const { carts, clearServices } = useCart();

  const saveCourierNote = useCallback((rawNote: string) => {
    const clean = rawNote.trim().slice(0, 160);
    setCourierNote(clean);
    try {
      if (clean) localStorage.setItem(COURIER_NOTE_KEY, clean);
      else localStorage.removeItem(COURIER_NOTE_KEY);
    } catch {
      /* storage optional */
    }
    setStatusMessage(
      clean ? `Kuryeye notun kaydedildi: "${clean}"` : "Kuryeye bırakılan not temizlendi.",
    );
  }, []);

  const previewLocationChange = useCallback(
    (id: string) => analyzeLocationChange(carts, id),
    [carts],
  );

  const persistDetails = useCallback((rawDetails?: AddressDetails) => {
    const clean = normalizeAddressDetails(rawDetails);
    if (!clean) return;
    setAddressDetails(clean);
    try {
      localStorage.setItem(DETAILS_KEY, JSON.stringify(clean));
    } catch {
      /* storage optional */
    }
  }, []);

  const selectLocation = useCallback(
    (id: string, options?: SelectLocationOptions) => {
      const plan = analyzeLocationChange(carts, id);
      if (!plan) return false;

      if (delivery?.id === plan.target.id && plan.affected.length === 0) {
        if (options?.details) {
          persistDetails(options.details);
          setStatusMessage(`Teslimat adresin ${locationLabel(plan.target)} (${formatAddressDetails(options.details)}) olarak güncellendi.`);
        } else {
          setStatusMessage(`Teslimat konumun zaten ${locationLabel(plan.target)} olarak ayarlı.`);
        }
        return true;
      }

      if (plan.affected.length > 0 && !options?.confirmed) {
        return false;
      }

      if (plan.affected.length > 0) {
        clearServices(plan.affected.map((item) => item.service));
      }

      setDelivery(plan.target);
      if (options?.details) {
        persistDetails(options.details);
      }
      setStatusMessage(formatLocationChangeMessage(plan));
      try {
        localStorage.setItem(KEY, plan.target.id);
      } catch {
        /* storage optional */
      }
      return true;
    },
    [carts, clearServices, delivery?.id, persistDetails],
  );

  const clearStatusMessage = useCallback(() => setStatusMessage(null), []);

  return (
    <Context.Provider
      value={{
        delivery,
        addressDetails,
        courierNote,
        saveCourierNote,
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
