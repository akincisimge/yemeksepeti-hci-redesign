export type Service = "food" | "market";
export type PaymentMethod = "cash-demo" | "card-demo";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
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
}

export interface CartLine {
  product: Product;
  quantity: number;
}

export type Carts = Record<Service, CartLine[]>;

export const formatTRY = (value: number) =>
  new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(value);
