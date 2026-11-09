
export type Service = "food" | "market";
export type PaymentMethod = "cash-demo" | "card-demo" | "door-card-demo" | "meal-card-demo";

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  "card-demo": "Online Kredi Kartı/Banka Kartı",
  "cash-demo": "Nakit",
  "door-card-demo": "Kapıda Kredi Kartı",
  "meal-card-demo": "Yemek Kartları",
};

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  brand?: string;
  unitLabel?: string;
  unitPrice?: number;
  unitBasis?: "kg" | "L" | "adet";
  tags?: string[];
  category: string;
  storeId: string;
  storeName: string;
  service: Service;
}

export interface Store {
  id: string;
  name: string;
  description: string;
  service: Service;
  group?: "ymarket" | "other";
  logo?: string;
  minBasket?: number;
  deliveryFee?: number;
  deliveryTime?: string;
}

export interface CartLine {
  product: Product;
  quantity: number;
}

export type Carts = Record<Service, CartLine[]>;

export const formatTRY = (value: number) =>
  new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
  }).format(value);

