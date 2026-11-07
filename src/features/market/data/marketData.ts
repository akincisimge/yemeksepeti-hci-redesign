
import { expandedCatalog } from "./mockCatalog.ts";
import type { Product, Store } from "../../../types/domain";

export const marketStores: Store[] = [
  {
    id: "ymarket-1",
    name: "Yemeksepeti Market",
    description: "Günlük ihtiyaçların kapında",
    service: "market",
    group: "ymarket",
    logo: "/logos/yemeksepetimarket.png",
    minBasket: 150,
    deliveryFee: 29.99,
    deliveryTime: "20-30 dk",
  },
  {
    id: "carrefour-1",
    name: "CarrefourSA",
    description: "Kaliteli ve avantajlı alışveriş",
    service: "market",
    group: "other",
    logo: "/logos/carrefour-market.png",
    minBasket: 250,
    deliveryFee: 39.99,
    deliveryTime: "30-45 dk",
  },
  {
    id: "bim-1",
    name: "BİM",
    description: "Uygun fiyatlı alışveriş",
    service: "market",
    group: "other",
    logo: "/logos/bim.png",
    minBasket: 200,
    deliveryFee: 24.99,
    deliveryTime: "30-45 dk",
  },
];

const originalProducts: Product[] = [
  // Yemeksepeti Market
  {
    id: "m1",
    name: "Sütaş Süzme Peynir",
    description: "500 g",
    price: 190.90,
    category: "Süt ve Kahvaltılık",
    storeId: "ymarket-1",
    storeName: "Yemeksepeti Market",
    service: "market",
    image:"/logos/peynir3.png",
  },
  {
    id: "m2",
    name: "Yummy Yumurta 15'li",
    description: "L Yumurta 63-72 g",
    price: 79.9,
    category: "Süt ve Kahvaltılık",
    storeId: "ymarket-1",
    storeName: "Yemeksepeti Market",
    service: "market",
    image:"/logos/yumurta3.png",
  },
  {
    id: "m3",
    name: "Ekmek",
    description: "Günlük taze ekmek",
    price: 15,
    category: "Fırın",
    storeId: "ymarket-1",
    storeName: "Yemeksepeti Market",
    service: "market",
    image:"/logos/ekmek.png",
  },
  {
    id: "m4",
    name: "Muz 1 kg",
    description: "Taze ve lezzetli muz",
    price: 69.9,
    category: "Meyve ve Sebze",
    storeId: "ymarket-1",
    storeName: "Yemeksepeti Market",
    service: "market",
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500",
  },
  

  // CarrefourSA
  {
  id: "c1",
  name: "CarrefourSA Olgunlaştırılmış Beyaz Peynir 350 g",
  description: "Olgunlaştırılmış beyaz peynir",
  price: 195.50,
  category: "Süt ve Kahvaltılık",
  storeId: "carrefour-1",
  storeName: "CarrefourSA",
  service: "market",
  image: "/logos/carrefour-peynir.png",
},
  {
    id: "c2",
    name: "CarrefourSA Yumurta 10'lu",
    description: "M boy yumurta",
    price: 82.5,
    category: "Süt ve Kahvaltılık",
    storeId: "carrefour-1",
    storeName: "CarrefourSA",
    service: "market",
    image: "/logos/yumurta2.png",
  },
  {
    id: "c3",
    name: "CarrefourSA Ekmek",
    description: "Taze günlük ekmek",
    price: 16,
    category: "Fırın",
    storeId: "carrefour-1",
    storeName: "CarrefourSA",
    service: "market",
    image:"/logos/ekmek.png" ,
  },

  // BİM
  {
  id: "b1",
  name: "Dost Beyaz Peynir 500 g",
  description: "Klasik beyaz peynir",
  price: 125,
  category: "Süt ve Kahvaltılık",
  storeId: "bim-1",
  storeName: "BİM",
  service: "market",
  image: "/logos/peynir.png",
},
  {
    id: "b2",
    name: "BİM Ekmek",
    description: "Günlük taze ekmek",
    price: 20,
    category: "Fırın",
    storeId: "bim-1",
    storeName: "BİM",
    service: "market",
    image: "/logos/ekmek.png",
  },
  {
    id: "b3",
    name: "Yumurta 15'li",
    description: "15 adet yumurta",
    price: 89.9,
    category: "Süt ve Kahvaltılık",
    storeId: "bim-1",
    storeName: "BİM",
    service: "market",
    image: "/logos/yumurta.png",
  },
];





// Prices, assortment and dietary labels are fictional HCI test data.
const samples = [
  { name: "Sütlü Çikolata", brand: "Tatlı Mola", category: "Atıştırmalık", price: 45, unitLabel: "80 g", unitBasis: "kg" as const, amount: .08, tags: [] },
  { name: "Tam Yağlı Süt", brand: "Günlük", category: "Süt ve Kahvaltılık", price: 45, unitLabel: "1 L", unitBasis: "L" as const, amount: 1, tags: [] },
  { name: "Laktozsuz Süt", brand: "Günlük", category: "Süt ve Kahvaltılık", price: 55, unitLabel: "1 L", unitBasis: "L" as const, amount: 1, tags: ["Laktozsuz"] },
  { name: "Laktozsuz Süt", brand: "Doğa", category: "Süt ve Kahvaltılık", price: 32, unitLabel: "500 ml", unitBasis: "L" as const, amount: .5, tags: ["Laktozsuz"] },
  { name: "Yoğurt", brand: "Günlük", category: "Süt ve Kahvaltılık", price: 80, unitLabel: "1 kg", unitBasis: "kg" as const, amount: 1, tags: [] },
  { name: "Tam Buğday Ekmeği", brand: "Fırından", category: "Fırın", price: 35, unitLabel: "400 g", unitBasis: "kg" as const, amount: .4, tags: [] },
  { name: "Elma", brand: "Bahçeden", category: "Meyve ve Sebze", price: 60, unitLabel: "1 kg", unitBasis: "kg" as const, amount: 1, tags: [] },
  { name: "Domates", brand: "Bahçeden", category: "Meyve ve Sebze", price: 45, unitLabel: "1 kg", unitBasis: "kg" as const, amount: 1, tags: [] },
  { name: "Burgu Makarna", brand: "Sofra", category: "Temel Gıda", price: 30, unitLabel: "500 g", unitBasis: "kg" as const, amount: .5, tags: [] },
  { name: "Glutensiz Makarna", brand: "Doğa", category: "Temel Gıda", price: 85, unitLabel: "400 g", unitBasis: "kg" as const, amount: .4, tags: ["Glutensiz"] },
  { name: "Pirinç", brand: "Sofra", category: "Temel Gıda", price: 90, unitLabel: "1 kg", unitBasis: "kg" as const, amount: 1, tags: [] },
  { name: "Maden Suyu", brand: "Kaynak", category: "İçecek", price: 48, unitLabel: "6 × 200 ml", unitBasis: "L" as const, amount: 1.2, tags: [] },
  { name: "İçme Suyu", brand: "Kaynak", category: "İçecek", price: 25, unitLabel: "1,5 L", unitBasis: "L" as const, amount: 1.5, tags: [] },
  { name: "Bulaşık Deterjanı", brand: "Temiz", category: "Temizlik", price: 65, unitLabel: "750 ml", unitBasis: "L" as const, amount: .75, tags: [] },
  { name: "Kağıt Havlu", brand: "Temiz", category: "Temizlik", price: 95, unitLabel: "6 rulo", unitBasis: "adet" as const, amount: 6, tags: [] },
];
export const marketProducts: Product[] = [
  ...originalProducts.map(product => {
    const packs: Record<string, { amount: number; unitBasis: "kg" | "L" | "adet"; unitLabel: string; brand: string }> = {
      m1: { amount: .5, unitBasis: "kg", unitLabel: "500 g", brand: "Sütaş" },
      m2: { amount: 15, unitBasis: "adet", unitLabel: "15 adet", brand: "Yummy" },
      m3: { amount: 1, unitBasis: "adet", unitLabel: "1 adet", brand: "Fırından" },
      m4: { amount: 1, unitBasis: "kg", unitLabel: "1 kg", brand: "Bahçeden" },
      c1: { amount: .35, unitBasis: "kg", unitLabel: "350 g", brand: "CarrefourSA" },
      c2: { amount: 10, unitBasis: "adet", unitLabel: "10 adet", brand: "CarrefourSA" },
      c3: { amount: 1, unitBasis: "adet", unitLabel: "1 adet", brand: "Fırından" },
      b1: { amount: .5, unitBasis: "kg", unitLabel: "500 g", brand: "Dost" },
      b2: { amount: 1, unitBasis: "adet", unitLabel: "1 adet", brand: "Fırından" },
      b3: { amount: 15, unitBasis: "adet", unitLabel: "15 adet", brand: "Günlük" },
    };
    const pack = packs[product.id];
    return { ...product, brand: pack.brand, unitLabel: pack.unitLabel, unitBasis: pack.unitBasis, unitPrice: product.price / pack.amount };
  }),
  ...marketStores.flatMap((store, storeIndex) => samples.map((sample, index) => {
    const price = Math.round(sample.price * (1 + storeIndex * .06) * 100) / 100;
    return {
      id: `${store.id}-demo-${index}`, storeId: store.id, storeName: store.name, service: "market" as const,
      name: sample.name, description: sample.unitLabel, brand: sample.brand, category: sample.category,
      price, unitLabel: sample.unitLabel, unitBasis: sample.unitBasis, unitPrice: price / sample.amount, tags: sample.tags,
    };
  })),
  ...marketStores.flatMap((store, index) => expandedCatalog(store, index)),
];
