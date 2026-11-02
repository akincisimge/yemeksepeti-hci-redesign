import type { Product, Store } from "../types/domain";

export const stores: Store[] = [
  { id: "f-1", name: "Mahalle Mutfağı", description: "Ev yemekleri ve çorbalar", service: "food" },
  { id: "f-2", name: "Meydan Pizza", description: "Pizzalar ve salatalar", service: "food" },
  { id: "m-1", name: "Yemeksepeti Market (Demo)", description: "Doğrudan market alışverişi", service: "market", group: "ymarket" },
  { id: "m-2", name: "Semt Market (Demo)", description: "Mağaza seçerek alışveriş", service: "market", group: "other" }
];

export const products: Product[] = [
  { id: "f1", name: "Mercimek Çorbası", description: "Sıcak çorba, ekmek dahil", price: 95, category: "Çorba", storeId: "f-1", storeName: "Mahalle Mutfağı", service: "food" },
  { id: "f2", name: "Tavuklu Pilav", description: "Pirinç pilavı ve tavuk", price: 180, category: "Ana Yemek", storeId: "f-1", storeName: "Mahalle Mutfağı", service: "food" },
  { id: "f3", name: "Margherita Pizza", description: "Domates ve mozzarella", price: 245, category: "Pizza", storeId: "f-2", storeName: "Meydan Pizza", service: "food" },
  { id: "f4", name: "Mevsim Salata", description: "Taze sebzeler", price: 115, category: "Salata", storeId: "f-2", storeName: "Meydan Pizza", service: "food" },
  { id: "m1", name: "Süt 1 L", description: "Tam yağlı süt", price: 48, category: "Süt Ürünleri", storeId: "m-1", storeName: "Yemeksepeti Market (Demo)", service: "market" },
  { id: "m2", name: "Yumurta 10'lu", description: "M boy yumurta", price: 86, category: "Kahvaltılık", storeId: "m-1", storeName: "Yemeksepeti Market (Demo)", service: "market" },
  { id: "m3", name: "Makarna 500 g", description: "Burgu makarna", price: 35, category: "Temel Gıda", storeId: "m-2", storeName: "Semt Market (Demo)", service: "market" },
  { id: "m4", name: "Elma 1 kg", description: "Mevsim elması", price: 64, category: "Meyve", storeId: "m-2", storeName: "Semt Market (Demo)", service: "market" }
];
