import type { Product, Store } from "../../../types/domain";

export type FoodCampaign = "selected-menu" | "free-delivery" | "value-menu";
export type FoodSort = "recommended" | "delivery" | "rating";

export type FoodRestaurant = Store & {
  cuisine: string;
  rating: number;
  ratingCount: string;
  deliveryMinutes: number;
  deliveryTime: string;
  fastDelivery?: boolean;
  deliveryFee: number;
  minBasket: number;
  image: string;
  imageLabel: string;
  highlight: string;
  discount: string;
  discountText?: string;
  campaigns: FoodCampaign[];
};

export type FoodCoupon = {
  code: string;
  title: string;
  description: string;
  discountType: "fixed" | "percentage";
  discountValue: number;
  minimumSubtotal: number;
  primaryRestaurantId: string;
  restaurantIds: string[];
  campaignProductNames: Record<string, string>;
};

export type FoodMenuProduct = Product & {
  campaignOriginalPrice?: number;
  campaignCouponCode?: string;
};

export const foodCoupons: FoodCoupon[] = [
  {
    code: "BURGER75",
    title: "Burger Fırsatı: 75 TL İndirim",
    description: "Crispy Co Burger ve Burger House 48 kampanyalı menülerinde ekstra 75 TL indirim.",
    discountType: "fixed",
    discountValue: 75,
    minimumSubtotal: 250,
    primaryRestaurantId: "food-crispy-co",
    restaurantIds: ["food-crispy-co", "food-burger-house-48"],
    campaignProductNames: {
      "food-crispy-co": "Double Cheddar Menü",
      "food-burger-house-48": "Big House Menü",
    },
  },
  {
    code: "PIZZA25",
    title: "Pizza Keyfi: %25 Ekstra Kupon İndirimi",
    description: "Meydan Pizza ve Napoli Pizza'nın kampanyalı pizzalarında %25 kupon indirimi.",
    discountType: "percentage",
    discountValue: 25,
    minimumSubtotal: 200,
    primaryRestaurantId: "food-meydan-pizza",
    restaurantIds: ["food-meydan-pizza", "food-napoli-pizza"],
    campaignProductNames: {
      "food-meydan-pizza": "Büyük Boy Karışık Pizza Menüsü",
      "food-napoli-pizza": "Napoli Diavola",
    },
  },
  {
    code: "DONER50",
    title: "Döner & İskender: 50 TL İndirim",
    description: "Gültepe Dönercisi ve Usta Yaprak Döner'in seçili menülerinde 50 TL indirim.",
    discountType: "fixed",
    discountValue: 50,
    minimumSubtotal: 180,
    primaryRestaurantId: "food-usta-yaprak-doner",
    restaurantIds: ["food-gultepe-doner", "food-usta-yaprak-doner"],
    campaignProductNames: {
      "food-gultepe-doner": "Pilav Üstü Döner",
      "food-usta-yaprak-doner": "Tereyağlı İskender",
    },
  },
  {
    code: "KEBAP60",
    title: "Ocakbaşı & Kebap: 60 TL İndirim",
    description: "Çıtır Çıtır Antep Sofrası ve Ocakbaşı Öz Urfa'da seçili kebap menülerinde 60 TL indirim.",
    discountType: "fixed",
    discountValue: 60,
    minimumSubtotal: 220,
    primaryRestaurantId: "food-citir-antep",
    restaurantIds: ["food-citir-antep", "food-ocakbasi-urfa"],
    campaignProductNames: {
      "food-citir-antep": "Karışık Kebap & Lahmacun Menüsü",
      "food-ocakbasi-urfa": "Karışık Ocakbaşı Tabağı",
    },
  },
  {
    code: "EVYEMEGI40",
    title: "Anne Eli & Ev Yemekleri: 40 TL İndirim",
    description: "Anne Eli Zeytinyağlı ve Mahalle Mutfağı'nda seçili ev yemeği menülerinde 40 TL indirim.",
    discountType: "fixed",
    discountValue: 40,
    minimumSubtotal: 160,
    primaryRestaurantId: "food-anne-eli",
    restaurantIds: ["food-anne-eli", "food-mahalle-mutfagi"],
    campaignProductNames: {
      "food-anne-eli": "Günün Ev Yemeği Menüsü",
      "food-mahalle-mutfagi": "Kuru Fasulye & Pilav",
    },
  },
  {
    code: "TATLI35",
    title: "Tatlı & Waffle Molası: 35 TL İndirim",
    description: "Tatlıcı Köşk ve Antep Baklava & Künefe Sarayı'nın seçili tatlılarında 35 TL indirim.",
    discountType: "fixed",
    discountValue: 35,
    minimumSubtotal: 140,
    primaryRestaurantId: "food-tatlici-kosk",
    restaurantIds: ["food-tatlici-kosk", "food-antep-baklava"],
    campaignProductNames: {
      "food-tatlici-kosk": "Belçika Çikolatalı Waffle",
      "food-antep-baklava": "Fıstıklı Baklava 4 Dilim",
    },
  },
];

export function findFoodCoupon(code: string | null | undefined): FoodCoupon | null {
  return foodCoupons.find((coupon) => coupon.code === code) ?? null;
}

export function getFoodDeliveryStartMinutes(restaurant: FoodRestaurant): number {
  const firstRangeValue = restaurant.deliveryTime.match(/\d+/)?.[0];
  return firstRangeValue ? Number.parseInt(firstRangeValue, 10) : restaurant.deliveryMinutes;
}

export function isFoodFastDelivery(restaurant: FoodRestaurant): boolean {
  if (restaurant.fastDelivery) return true;
  const range = restaurant.deliveryTime.match(/(\d+)\s*-\s*(\d+)/);
  return range ? Number.parseInt(range[2], 10) <= 30 : restaurant.deliveryMinutes <= 30;
}

export function hasFoodDiscount(restaurant: FoodRestaurant): boolean {
  const discount = restaurant.discountText || restaurant.discount;
  return /(?:%|yüzde\s*)(?:10|15|20|25)\b/i.test(discount);
}

export type FoodPreference = "Normal" | "Bol Acılı" | "Acısız";

export type FoodCustomization = {
  removedIngredients: string[];
  extras: string[];
  preference: FoodPreference;
  note: string;
};

export type FoodCustomizationExtra = {
  name: string;
  price: number;
};

export type FoodCustomizationOptions = {
  ingredients: string[];
  extras: FoodCustomizationExtra[];
};

export type CustomizedFoodProduct = Product & {
  foodCustomization: FoodCustomization;
};

const foodCustomizationGroups: Record<string, FoodCustomizationOptions> = {
  pizza: {
    ingredients: ["Mozarella Peyniri", "Mantar", "Yeşil Biber", "Siyah Zeytin", "Mısır", "Domates Sosu", "Kekik"],
    extras: [
      { name: "Ekstra Mozarella Peyniri", price: 35 },
      { name: "Ekstra Mantar", price: 15 },
      { name: "Ekstra Mısır", price: 15 },
    ],
  },
  kebab: {
    ingredients: ["Soğan", "Közlenmiş Biber", "Közlenmiş Domates", "Maydanoz", "Sumak", "Acı Sos", "Turşu"],
    extras: [
      { name: "Ekstra Lavaş", price: 20 },
      { name: "Haydari", price: 25 },
    ],
  },
  doner: {
    ingredients: ["Soğan", "Közlenmiş Biber", "Közlenmiş Domates", "Maydanoz", "Sumak", "Acı Sos", "Turşu"],
    extras: [
      { name: "Ekstra Sos", price: 10 },
      { name: "Ekstra Turşu", price: 15 },
    ],
  },
  burger: {
    ingredients: ["Soğan", "Turşu", "Marul", "Domates", "Cheddar Peyniri", "Özel Burger Sosu", "Ketçap", "Mayonez"],
    extras: [
      { name: "Ekstra Cheddar Peyniri", price: 25 },
      { name: "Karamelize Soğan", price: 20 },
    ],
  },
  chicken: {
    ingredients: ["Soğan", "Turşu", "Marul", "Domates", "Cheddar Peyniri", "Özel Burger Sosu", "Ketçap", "Mayonez"],
    extras: [
      { name: "Ekstra Dip Sos", price: 15 },
      { name: "Ekstra Cheddar Peyniri", price: 25 },
    ],
  },
  home: {
    ingredients: ["Sarımsak", "Dereotu", "Acı Pul Biber", "Tereyağı Sosu", "Limon"],
    extras: [
      { name: "Yoğurt", price: 20 },
      { name: "Ekstra Pilav", price: 35 },
    ],
  },
  dessert: {
    ingredients: ["Çikolata Sosu", "Çilek", "Muz", "Antep Fıstığı", "Fındık Parçacıkları"],
    extras: [
      { name: "Ekstra Dondurma Topu", price: 30 },
      { name: "Ekstra Çikolata Sosu", price: 20 },
    ],
  },
};

export function getFoodCustomizationOptions(product: Product, cuisine: string): FoodCustomizationOptions {
  const name = product.name.toLocaleLowerCase("tr");
  const menuCategory = cuisine.toLocaleLowerCase("tr");
  const group = name.includes("pizza") || menuCategory.includes("pizza") ? "pizza"
    : name.includes("döner") || name.includes("iskender") || (name.includes("dürüm") && menuCategory.includes("döner")) || menuCategory.includes("döner") ? "doner"
      : name.includes("kebap") || name.includes("lahmacun") || name.includes("pide") || menuCategory.includes("kebap") ? "kebab"
        : name.includes("burger") || menuCategory.includes("burger") ? "burger"
          : name.includes("tavuk") || menuCategory.includes("tavuk") ? "chicken"
            : name.includes("waffle") || name.includes("tatlı") || name.includes("baklava") || name.includes("künefe") || name.includes("brownie") || name.includes("cheesecake") || menuCategory.includes("tatlı") ? "dessert"
              : "home";
  return foodCustomizationGroups[group];
}

export function getFoodCustomization(product: Product): FoodCustomization | undefined {
  if (!("foodCustomization" in product)) return undefined;
  const value = product.foodCustomization;
  if (!value || typeof value !== "object") return undefined;

  const customization = value as FoodCustomization;
  if (
    !Array.isArray(customization.removedIngredients) ||
    !customization.removedIngredients.every((item) => typeof item === "string") ||
    !Array.isArray(customization.extras) ||
    !customization.extras.every((item) => typeof item === "string") ||
    !["Normal", "Bol Acılı", "Acısız"].includes(customization.preference) ||
    typeof customization.note !== "string"
  ) return undefined;

  return customization;
}

export function createCustomizedFoodProduct(
  product: Product,
  customization: FoodCustomization,
  options: FoodCustomizationOptions,
): CustomizedFoodProduct {
  const extrasPrice = options.extras
    .filter((extra) => customization.extras.includes(extra.name))
    .reduce((sum, extra) => sum + extra.price, 0);
  const variant = JSON.stringify([
    customization.removedIngredients,
    customization.extras,
    customization.preference,
    customization.note,
  ]);
  const hash = Array.from(variant).reduce((value, character) => (
    Math.imul(value ^ character.charCodeAt(0), 16777619) >>> 0
  ), 2166136261).toString(36);

  return {
    ...product,
    id: `${product.id}-custom-${hash}`,
    price: product.price + extrasPrice,
    foodCustomization: customization,
  };
}

const foodImage = (id: string, width = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;

const productPhoto = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=80`;

const ayranPhoto = `data:image/svg+xml,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
    <defs>
      <linearGradient id="glass" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#fff" stop-opacity=".9"/><stop offset=".45" stop-color="#dce8ee" stop-opacity=".38"/><stop offset="1" stop-color="#fff" stop-opacity=".72"/></linearGradient>
      <linearGradient id="drink" x1="0" x2="0" y1="0" y2="1"><stop stop-color="#fff" stop-opacity=".96"/><stop offset="1" stop-color="#e9f2f4"/></linearGradient>
      <linearGradient id="background" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#edf6f5"/><stop offset="1" stop-color="#d8e8e4"/></linearGradient>
      <filter id="shadow" x="-.3" y="-.3" width="1.6" height="1.8"><feGaussianBlur stdDeviation="13"/></filter>
    </defs>
    <rect width="600" height="600" fill="url(#background)"/>
    <circle cx="470" cy="120" r="95" fill="#fff" opacity=".28"/>
    <ellipse cx="300" cy="500" rx="150" ry="25" fill="#668582" opacity=".2" filter="url(#shadow)"/>
    <path d="M183 150h234l-27 326a26 26 0 0 1-26 24H236a26 26 0 0 1-26-24z" fill="url(#glass)" stroke="#fff" stroke-width="10"/>
    <path d="M197 226h206l-19 244a18 18 0 0 1-18 17H238a18 18 0 0 1-18-17z" fill="url(#drink)"/>
    <ellipse cx="300" cy="226" rx="103" ry="19" fill="#fff" stroke="#edf4f5" stroke-width="5"/>
    <path d="M201 222c18-42 43-58 73-43 19-28 47-27 63-5 24-19 48-5 62 47-48 18-145 18-198 1z" fill="#fff"/>
    <g fill="#d4e4e6" opacity=".8"><circle cx="256" cy="195" r="7"/><circle cx="289" cy="182" r="6"/><circle cx="323" cy="190" r="8"/><circle cx="350" cy="204" r="5"/><circle cx="277" cy="213" r="4"/></g>
    <path d="M218 255h8l-17 215a16 16 0 0 1-9-13z" fill="#fff" opacity=".72"/>
    <rect x="258" y="326" width="84" height="7" rx="3.5" fill="#d8e6e8" opacity=".65"/>
    <text x="300" y="373" text-anchor="middle" fill="#52706f" font-family="Arial,sans-serif" font-size="21" font-weight="700">YAYIK</text>
    <text x="300" y="401" text-anchor="middle" fill="#52706f" font-family="Arial,sans-serif" font-size="23" font-weight="700">AYRAN</text>
    <text x="300" y="430" text-anchor="middle" fill="#78908e" font-family="Arial,sans-serif" font-size="15">300 ml · köpüklü</text>
    <path d="M165 520h270" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".6"/>
  </svg>
`)}`;

const bottledWaterPhoto = `data:image/svg+xml,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
    <defs>
      <linearGradient id="background" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#edf6fb"/><stop offset="1" stop-color="#d6e8f3"/></linearGradient>
      <linearGradient id="bottle" x1="0" x2="1"><stop stop-color="#fff" stop-opacity=".65"/><stop offset=".22" stop-color="#d8eff9" stop-opacity=".48"/><stop offset=".5" stop-color="#fff" stop-opacity=".9"/><stop offset=".78" stop-color="#c5e5f4" stop-opacity=".38"/><stop offset="1" stop-color="#fff" stop-opacity=".76"/></linearGradient>
      <linearGradient id="water" x1="0" x2="0" y1="0" y2="1"><stop stop-color="#bde8f7" stop-opacity=".35"/><stop offset="1" stop-color="#68b7dc" stop-opacity=".48"/></linearGradient>
      <filter id="shadow" x="-.3" y="-.3" width="1.6" height="1.8"><feGaussianBlur stdDeviation="12"/></filter>
    </defs>
    <rect width="600" height="600" fill="url(#background)"/>
    <circle cx="120" cy="115" r="76" fill="#fff" opacity=".35"/>
    <ellipse cx="300" cy="518" rx="125" ry="22" fill="#527e97" opacity=".22" filter="url(#shadow)"/>
    <path d="M269 95h62v46c0 20 12 30 30 45 26 24 40 51 40 91v197c0 24-18 42-42 42H241c-24 0-42-18-42-42V277c0-40 14-67 40-91 18-15 30-25 30-45z" fill="url(#bottle)" stroke="#fff" stroke-width="8"/>
    <path d="M208 284c53 14 131 14 192 0v190c0 20-15 35-35 35h-122c-20 0-35-15-35-35z" fill="url(#water)"/>
    <rect x="266" y="65" width="68" height="39" rx="8" fill="#1675bd"/>
    <path d="M270 74h60M270 83h60M270 92h60" stroke="#77b8e3" stroke-width="4" opacity=".8"/>
    <rect x="210" y="324" width="180" height="111" rx="13" fill="#fff" stroke="#74bce0" stroke-width="4"/>
    <path d="M239 352c17-22 40-22 57 0-17 22-40 22-57 0zm29-14v28" fill="none" stroke="#3198c7" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="318" y="354" text-anchor="middle" fill="#176a9b" font-family="Arial,sans-serif" font-size="16" font-weight="700">DOĞAL KAYNAK</text>
    <text x="300" y="387" text-anchor="middle" fill="#176a9b" font-family="Arial,sans-serif" font-size="22" font-weight="700">SUYU</text>
    <text x="300" y="416" text-anchor="middle" fill="#548da9" font-family="Arial,sans-serif" font-size="16">500 ml</text>
    <path d="M226 301v172" stroke="#fff" stroke-width="8" stroke-linecap="round" opacity=".72"/>
    <path d="M176 530h248" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".6"/>
  </svg>
`)}`;

const productPhotos = {
  cola: productPhoto("photo-1554866585-cd94860890b7"),
  colaZero: productPhoto("photo-1622483767028-3f66f32aef97"),
  fanta: productPhoto("photo-1624517452488-04869289c4ca"),
  sprite: productPhoto("photo-1625772299848-391b6a87d7b3"),
  ayran: ayranPhoto,
  water: bottledWaterPhoto,
  icedTea: productPhoto("photo-1556679343-c7306c1976bc"),
  burger: [
    "photo-1586190848861-99aa4a171e90",
    "photo-1606755962773-d324e0a13086",
    "photo-1553979459-d2229ba7433b",
    "photo-1550547660-d9450f859349",
    "photo-1568901346375-23c9450c58cd",
  ],
  fries: ["photo-1573080496219-bb080dd4f877", "photo-1576107232684-1279f3908594"],
  snack: ["photo-1639024471283-03518883512d", "photo-1601050690597-df0568f70950", "photo-1555939594-58d7cb561ad1", "photo-1544025162-d76694265947"],
  salad: ["photo-1512621776951-a57141f2eefd", "photo-1546069901-ba9599a7e63c"],
  soup: ["photo-1547592166-23ac45744acd", "photo-1547592180-85f173990554", "photo-1476124369491-e7addf5db371", "photo-1512058564366-18510be2db19"],
  pizza: ["photo-1513104890138-7c749659a591", "photo-1574071318508-1cdbab80d002", "photo-1571407970349-bc81e7e96d47", "photo-1604382355076-af4b0eb60143"],
  doner: ["photo-1529006557810-274b9b2fc783", "photo-1561651823-34feb02250e4", "photo-1565299624946-b28f40a0ae38", "photo-1512058564366-18510be2db19"],
  kebab: ["photo-1544025162-d76694265947", "photo-1555939594-58d7cb561ad1", "photo-1601050690597-df0568f70950", "photo-1529006557810-274b9b2fc783"],
  home: ["photo-1547592166-23ac45744acd", "photo-1546069901-ba9599a7e63c", "photo-1547592180-85f173990554", "photo-1476124369491-e7addf5db371", "photo-1512058564366-18510be2db19"],
  dessert: ["photo-1562376552-0d160a2f238d", "photo-1551024601-bec78aea704b", "photo-1488477181946-6428a0291777", "photo-1576618148400-f54bed99fcfd", "photo-1571877227200-a0d98ea607e9", "photo-1606313564200-e75d5e30476c"],
  chicken: ["photo-1626082927389-6cd097cdc6ec", "photo-1606755962773-d324e0a13086", "photo-1527477396000-e27163b481c2", "photo-1532550907401-a500c9a57435"],
} as const;

const photoUrlFromIds = (ids: readonly string[], index: number) =>
  productPhoto(ids[index % ids.length]);

const foodPhotoReserve = [
  ...productPhotos.burger,
  ...productPhotos.pizza,
  ...productPhotos.doner,
  ...productPhotos.kebab,
  ...productPhotos.home,
  ...productPhotos.salad,
  ...productPhotos.soup,
  ...productPhotos.dessert,
  ...productPhotos.chicken,
  ...productPhotos.fries,
  ...productPhotos.snack,
].map(productPhoto);

export function getFoodProductFallbackImage(productName: string): string {
  const name = productName.toLocaleLowerCase("tr");
  if (name.includes("double cheddar")) return productPhoto("photo-1568901346375-23c9450c58cd");
  if (name.includes("coca-cola zero")) return productPhotos.colaZero;
  if (name.includes("coca-cola")) return productPhotos.cola;
  if (name.includes("fanta")) return productPhotos.fanta;
  if (name.includes("sprite") || name.includes("meyveli soda")) return productPhotos.sprite;
  if (name.includes("ayran")) return productPhotos.ayran;
  if (name.includes("su (")) return productPhotos.water;
  if (name.includes("çay") || name.includes("şalgam") || name.includes("limonata")) return productPhotos.icedTea;
  if (name.includes("patates")) return photoUrlFromIds(productPhotos.fries, 0);
  if (name.includes("soğan") || name.includes("mozzarella") || name.includes("içli") || name.includes("gyoza")) return photoUrlFromIds(productPhotos.snack, 0);
  if (name.includes("salata") || name.includes("meze") || name.includes("cacık") || name.includes("ezme") || name.includes("kimchi")) return photoUrlFromIds(productPhotos.salad, 0);
  if (name.includes("çorba")) return photoUrlFromIds(productPhotos.soup, 0);
  if (name.includes("pizza")) return photoUrlFromIds(productPhotos.pizza, 0);
  if (name.includes("döner") || name.includes("iskender") || name.includes("dürüm")) return photoUrlFromIds(productPhotos.doner, 0);
  if (name.includes("kebap") || name.includes("lahmacun") || name.includes("pide") || name.includes("şiş")) return photoUrlFromIds(productPhotos.kebab, 0);
  if (name.includes("waffle") || name.includes("baklava") || name.includes("künefe") || name.includes("tatlı") || name.includes("cheesecake") || name.includes("brownie")) return photoUrlFromIds(productPhotos.dessert, 0);
  if (name.includes("tavuk")) return photoUrlFromIds(productPhotos.chicken, 0);
  if (name.includes("burger")) return photoUrlFromIds(productPhotos.burger, 0);
  return photoUrlFromIds(productPhotos.home, 0);
}

export function getFoodRestaurantFallbackImage(cuisine: string): string {
  const images = cuisine === "Pizza" ? productPhotos.pizza
    : cuisine === "Döner" ? productPhotos.doner
      : cuisine === "Kebap & Lahmacun" ? productPhotos.kebab
        : cuisine === "Ev Yemekleri" ? productPhotos.home
          : cuisine === "Tavuk" ? productPhotos.chicken
            : cuisine === "Tatlı" ? productPhotos.dessert
              : productPhotos.burger;
  return photoUrlFromIds(images, 0);
}

export function recoverFoodImage(image: HTMLImageElement, fallbackUrl: string): void {
  if (image.dataset.fallbackApplied === "true") {
    image.style.visibility = "hidden";
    return;
  }
  image.dataset.fallbackApplied = "true";
  image.src = fallbackUrl;
}

export const foodRestaurants: FoodRestaurant[] = [
  {
    id: "food-crispy-co",
    name: "Crispy Co Burger",
    description: "Ateşte mühürlenen smash burgerler, taze ekmek ve çıtır yan lezzetler.",
    service: "food",
    cuisine: "Burger",
    rating: 4.8,
    ratingCount: "250+",
    deliveryMinutes: 28,
    deliveryTime: "25-35 dk",
    deliveryFee: 0,
    minBasket: 150,
    image: foodImage("photo-1568901346375-23c9450c58cd"),
    imageLabel: "Peynirli burger ve çıtır patates",
    highlight: "Öne Çıkan",
    discount: "%25 indirim",
    campaigns: ["selected-menu", "free-delivery"],
  },
  {
    id: "food-burger-house-48",
    name: "Burger House 48",
    description: "El yapımı burger ekmeği, günlük hazırlanan köfte ve özel soslar.",
    service: "food",
    cuisine: "Burger",
    rating: 4.3,
    ratingCount: "185+",
    deliveryMinutes: 32,
    deliveryTime: "30-40 dk",
    deliveryFee: 0,
    minBasket: 190,
    image: foodImage("photo-1550547660-d9450f859349"),
    imageLabel: "Doyurucu ev yapımı burger",
    highlight: "Ev Yapımı",
    discount: "",
    campaigns: ["selected-menu", "free-delivery"],
  },
  {
    id: "food-meydan-pizza",
    name: "Meydan Pizza",
    description: "Taş fırında pişen ince hamurlu pizzalar ve günlük hazırlanan salatalar.",
    service: "food",
    cuisine: "Pizza",
    rating: 4.3,
    ratingCount: "180+",
    deliveryMinutes: 32,
    deliveryTime: "20-30 dk",
    deliveryFee: 19.99,
    minBasket: 180,
    image: foodImage("photo-1574071318508-1cdbab80d002"),
    imageLabel: "Fırından yeni çıkmış pizza",
    highlight: "Çok Sevilen",
    discount: "%20 indirim",
    campaigns: ["selected-menu"],
  },
  {
    id: "food-napoli-pizza",
    name: "Napoli Odun Ateşi Pizza",
    description: "Uzun mayalı hamur, İtalyan domatesi ve odun ateşinde pişirme.",
    service: "food",
    cuisine: "Pizza",
    rating: 4.9,
    ratingCount: "340+",
    deliveryMinutes: 38,
    deliveryTime: "35-45 dk",
    deliveryFee: 0,
    minBasket: 230,
    image: foodImage("photo-1571407970349-bc81e7e96d47"),
    imageLabel: "Odun ateşinde pişmiş Napoli usulü pizza",
    highlight: "Odun Ateşi",
    discount: "%20 indirim",
    campaigns: ["selected-menu", "free-delivery", "value-menu"],
  },
  {
    id: "food-gultepe-doner",
    name: "Gültepe Dönercisi",
    description: "Günlük hazırlanan döner, taze lavaş ve ev yapımı soslar.",
    service: "food",
    cuisine: "Döner",
    rating: 4.1,
    ratingCount: "320+",
    deliveryMinutes: 24,
    deliveryTime: "20-30 dk",
    deliveryFee: 0,
    minBasket: 140,
    image: foodImage("photo-1561651823-34feb02250e4"),
    imageLabel: "Lavaş içinde döner ve taze sebzeler",
    highlight: "Hızlı Teslimat",
    discount: "%15 indirim",
    campaigns: ["free-delivery"],
  },
  {
    id: "food-usta-yaprak-doner",
    name: "Usta Yaprak Döner & İskender",
    description: "Günlük kesilen yaprak döner, tereyağlı sos ve taze pide.",
    service: "food",
    cuisine: "Döner",
    rating: 4.3,
    ratingCount: "275+",
    deliveryMinutes: 34,
    deliveryTime: "30-40 dk",
    deliveryFee: 18.99,
    minBasket: 220,
    image: foodImage("photo-1529006557810-274b9b2fc783"),
    imageLabel: "Tereyağlı soslu porsiyon iskender",
    highlight: "Usta İşi",
    discount: "",
    campaigns: ["value-menu"],
  },
  {
    id: "food-mahalle-mutfagi",
    name: "Mahalle Mutfağı Ev Yemekleri",
    description: "Günlük pişen tencere yemekleri, çorbalar ve ev yapımı tatlar.",
    service: "food",
    cuisine: "Ev Yemekleri",
    rating: 4.9,
    ratingCount: "410+",
    deliveryMinutes: 35,
    deliveryTime: "30-40 dk",
    deliveryFee: 0,
    minBasket: 150,
    image: foodImage("photo-1547592180-85f173990554"),
    imageLabel: "Renkli ev yemeği ve taze sebzeler",
    highlight: "Ev Usulü",
    discount: "%15 indirim",
    campaigns: ["selected-menu", "free-delivery", "value-menu"],
  },
  {
    id: "food-anne-eli",
    name: "Anne Eli Zeytinyağlı & Çorba",
    description: "Mevsim sebzeleriyle zeytinyağlılar ve her gün taze çorba.",
    service: "food",
    cuisine: "Ev Yemekleri",
    rating: 4.8,
    ratingCount: "230+",
    deliveryMinutes: 22,
    deliveryTime: "15-25 dk",
    deliveryFee: 14.99,
    minBasket: 160,
    image: foodImage("photo-1512621776951-a57141f2eefd"),
    imageLabel: "Zeytinyağlı tabak ve taze yeşillikler",
    highlight: "Anne Eli",
    discount: "%10 indirim",
    campaigns: ["selected-menu"],
  },
  {
    id: "food-citir-antep",
    name: "Çıtır Çıtır Antep Sofrası",
    description: "Antep usulü kebaplar, ince lahmacun ve közde pişen lezzetler.",
    service: "food",
    cuisine: "Kebap & Lahmacun",
    rating: 4.8,
    ratingCount: "290+",
    deliveryMinutes: 38,
    deliveryTime: "35-45 dk",
    deliveryFee: 0,
    minBasket: 200,
    image: foodImage("photo-1544025162-d76694265947"),
    imageLabel: "Izgara kebap ve közlenmiş sebzeler",
    highlight: "Usta İşi",
    discount: "",
    campaigns: ["value-menu", "free-delivery"],
  },
  {
    id: "food-ocakbasi-urfa",
    name: "Ocakbaşı Öz Urfa Kebap",
    description: "Köz ateşinde hazırlanan kebaplar, zırh kıyması ve taze mezeler.",
    service: "food",
    cuisine: "Kebap & Lahmacun",
    rating: 4.1,
    ratingCount: "195+",
    deliveryMinutes: 40,
    deliveryTime: "35-45 dk",
    deliveryFee: 24.99,
    minBasket: 280,
    image: foodImage("photo-1555939594-58d7cb561ad1"),
    imageLabel: "Ocak ateşinde pişmiş kebap ve köz sebzeler",
    highlight: "Köz Ateşi",
    discount: "%20 indirim",
    campaigns: ["value-menu"],
  },
  {
    id: "food-tavuk-kralligi",
    name: "Tavuk Krallığı",
    description: "Çıtır tavuk, doyurucu menüler ve özel soslar.",
    service: "food",
    cuisine: "Tavuk",
    rating: 4.5,
    ratingCount: "210+",
    deliveryMinutes: 27,
    deliveryTime: "25-35 dk",
    deliveryFee: 0,
    minBasket: 160,
    image: foodImage("photo-1626082927389-6cd097cdc6ec"),
    imageLabel: "Çıtır tavuk parçaları ve patates",
    highlight: "Hızlı Teslimat",
    discount: "%20 indirim",
    campaigns: ["selected-menu", "free-delivery"],
  },
  {
    id: "food-kore-tavuk",
    name: "Kore Usulü Çıtır Tavuk",
    description: "Çıtır kaplamalı tavuk, gochujang sos ve Kore esintili yanlar.",
    service: "food",
    cuisine: "Tavuk",
    rating: 4.8,
    ratingCount: "260+",
    deliveryMinutes: 36,
    deliveryTime: "30-40 dk",
    deliveryFee: 21.99,
    minBasket: 210,
    image: foodImage("photo-1532550907401-a500c9a57435"),
    imageLabel: "Kore usulü baharatlı tavuk tabağı",
    highlight: "Kore Usulü",
    discount: "%15 indirim",
    campaigns: ["selected-menu"],
  },
  {
    id: "food-tatlici-kosk",
    name: "Tatlıcı Köşk & Waffle",
    description: "Belçika çikolatalı waffle, taze meyveli tatlılar ve günlük hamur işleri.",
    service: "food",
    cuisine: "Tatlı",
    rating: 4.7,
    ratingCount: "215+",
    deliveryMinutes: 28,
    deliveryTime: "20-30 dk",
    deliveryFee: 12.99,
    minBasket: 140,
    image: foodImage("photo-1488477181946-6428a0291777"),
    imageLabel: "Taze meyvelerle hazırlanan tatlı",
    highlight: "Tatlı Molası",
    discount: "",
    campaigns: ["selected-menu"],
  },
  {
    id: "food-antep-baklava",
    name: "Antep Baklava & Künefe Sarayı",
    description: "İnce açılmış baklava yufkası, boz fıstık ve sıcak künefe.",
    service: "food",
    cuisine: "Tatlı",
    rating: 4.9,
    ratingCount: "390+",
    deliveryMinutes: 39,
    deliveryTime: "35-45 dk",
    deliveryFee: 17.99,
    minBasket: 250,
    image: foodImage("photo-1576618148400-f54bed99fcfd"),
    imageLabel: "Fıstıklı şerbetli Antep tatlısı",
    highlight: "Antep Usulü",
    discount: "%15 indirim",
    campaigns: ["value-menu"],
  },
];

export type FoodReview = {
  id: string;
  userName: string;
  date: string;
  rating: number;
  menuItem: string;
  comment: string;
};

export const foodReviews: Record<string, FoodReview[]> = {
  "food-crispy-co": [
    { id: "crispy-review-1", userName: "Elif K.", date: "08.11.2026", rating: 5, menuItem: "Klasik Smash Burger", comment: "Ekmeği yumuşak, köftesi tam kıvamında geldi. Patatesler de sıcacıktı." },
    { id: "crispy-review-2", userName: "Mert A.", date: "05.11.2026", rating: 5, menuItem: "Çıtır Tavuk Burger", comment: "Sosu ve çıtır dokusu çok başarılı, porsiyon da doyurucuydu." },
    { id: "crispy-review-3", userName: "Zeynep D.", date: "02.11.2026", rating: 4, menuItem: "Baharatlı Patates", comment: "Lezzetli ve bol baharatlıydı. Teslimat beklediğimden hızlı oldu." },
    { id: "crispy-review-4", userName: "Can T.", date: "29.10.2026", rating: 5, menuItem: "Klasik Smash Burger", comment: "Malzemeler taze, burger özenli hazırlanmış. Yeniden sipariş veririm." },
  ],
  "food-meydan-pizza": [
    { id: "pizza-review-1", userName: "Deniz Y.", date: "09.11.2026", rating: 5, menuItem: "Margherita Pizza", comment: "Hamuru ince ve kenarları güzel pişmişti, malzemeler de tazeydi." },
    { id: "pizza-review-2", userName: "Aslı B.", date: "06.11.2026", rating: 5, menuItem: "Akdeniz Pizza", comment: "Sebzeler boldu, sıcak ve tam istediğim gibi teslim edildi." },
    { id: "pizza-review-3", userName: "Ozan E.", date: "01.11.2026", rating: 4, menuItem: "Mevsim Salata", comment: "Salata taze ve pizzanın yanında güzel bir seçenek oldu." },
    { id: "pizza-review-4", userName: "Ece M.", date: "27.10.2026", rating: 5, menuItem: "Margherita Pizza", comment: "Peynir ve sos dengesi çok iyi, tekrar tercih edeceğim." },
  ],
  "food-gultepe-doner": [
    { id: "doner-review-1", userName: "Burak S.", date: "08.11.2026", rating: 5, menuItem: "Et Döner Dürüm", comment: "Dürümün içi dolu, lavaşı taze ve eti yumuşaktı." },
    { id: "doner-review-2", userName: "İrem Ç.", date: "04.11.2026", rating: 4, menuItem: "Pilav Üstü Döner", comment: "Porsiyon doyurucu, pilavı tane tane geldi." },
    { id: "doner-review-3", userName: "Kerem G.", date: "31.10.2026", rating: 5, menuItem: "Ev Yapımı Ayran", comment: "Ayran çok tazeydi, yemekle birlikte güzel gitti." },
    { id: "doner-review-4", userName: "Seda P.", date: "25.10.2026", rating: 5, menuItem: "Et Döner Dürüm", comment: "Lezzetli ve hızlı teslim edildi, sos miktarı da yerindeydi." },
  ],
  "food-mahalle-mutfagi": [
    { id: "mahalle-review-1", userName: "Nihan R.", date: "09.11.2026", rating: 5, menuItem: "Mercimek Çorbası", comment: "Ev yapımı tadında ve sıcacık geldi. Ekmek de tazeydi." },
    { id: "mahalle-review-2", userName: "Emre L.", date: "03.11.2026", rating: 5, menuItem: "Kuru Fasulye & Pilav", comment: "Fasulye lokum gibi, pilavı tam kıvamındaydı. Porsiyon yeterli." },
    { id: "mahalle-review-3", userName: "Duru F.", date: "30.10.2026", rating: 4, menuItem: "Ev Usulü Mantı", comment: "Mantı taze ve lezzetliydi, tereyağlı sosu da çok dengeliydi." },
    { id: "mahalle-review-4", userName: "Bora H.", date: "24.10.2026", rating: 5, menuItem: "Anne Usulü Karnıyarık", comment: "Özenli paketlenmişti ve tam zamanında teslim edildi." },
  ],
  "food-citir-antep": [
    { id: "antep-review-1", userName: "Murat C.", date: "07.11.2026", rating: 5, menuItem: "Adana Kebap", comment: "Kebap tam kıvamında pişmiş, köz sebzeler çok yakışmış." },
    { id: "antep-review-2", userName: "Gizem O.", date: "02.11.2026", rating: 5, menuItem: "Antep Lahmacun", comment: "İncecik hamur ve bol iç harç, yanında yeşillikler de tazeydi." },
    { id: "antep-review-3", userName: "Tolga N.", date: "28.10.2026", rating: 4, menuItem: "Gavurdağı Salata", comment: "Ceviz ve nar ekşisi dengesi güzel, taze teslim edildi." },
    { id: "antep-review-4", userName: "Pelin A.", date: "21.10.2026", rating: 5, menuItem: "Fındık Lahmacun 4'lü", comment: "Baharat dengesi çok iyi, sıcak ve çıtır geldi." },
  ],
  "food-tavuk-kralligi": [
    { id: "tavuk-review-1", userName: "Eren D.", date: "09.11.2026", rating: 5, menuItem: "Çıtır Tavuk Sepeti", comment: "Tavuklar çıtır kaldı, dip soslar da çok lezzetliydi." },
    { id: "tavuk-review-2", userName: "Melis T.", date: "04.11.2026", rating: 4, menuItem: "Barbekü Kanat", comment: "Sosu güzel ve kanatlar iyi pişmişti. Hızlı teslimat." },
    { id: "tavuk-review-3", userName: "Kaan V.", date: "31.10.2026", rating: 5, menuItem: "Izgara Tavuk Dürüm", comment: "Taze yeşillikler ve hafif sosla dengeli bir dürüm olmuş." },
    { id: "tavuk-review-4", userName: "Aylin Ş.", date: "26.10.2026", rating: 5, menuItem: "Çıtır Tavuk Sepeti", comment: "Porsiyon bol, paketleme özenliydi. Tekrar söylerim." },
  ],
  "food-burger-house-48": [
    { id: "house-review-1", userName: "Büşra A.", date: "09.11.2026", rating: 5, menuItem: "House 48 Burger", comment: "Köftesi sulu, sosu dengeli ve ekmeği çok tazeydi." },
    { id: "house-review-2", userName: "Yiğit K.", date: "06.11.2026", rating: 4, menuItem: "Mantar Soslu Burger", comment: "Mantar sosu boldu, patatesler de çıtır geldi." },
    { id: "house-review-3", userName: "Derya M.", date: "02.11.2026", rating: 5, menuItem: "Big House Menü", comment: "Porsiyon doyurucu, paketleme tertemizdi." },
    { id: "house-review-4", userName: "Sarp E.", date: "28.10.2026", rating: 4, menuItem: "Izgara Tavuk Burger", comment: "Hafif ve lezzetli bir burger, teslimat da zamanındaydı." },
  ],
  "food-napoli-pizza": [
    { id: "napoli-review-1", userName: "Meltem S.", date: "09.11.2026", rating: 5, menuItem: "Napoli Margherita", comment: "Hamurun kenarları hafif kabarık ve çok lezzetliydi." },
    { id: "napoli-review-2", userName: "Umut D.", date: "05.11.2026", rating: 5, menuItem: "Napoli Diavola", comment: "Acısı tam kararında, odun ateşi aroması çok güzel." },
    { id: "napoli-review-3", userName: "Ceren P.", date: "01.11.2026", rating: 4, menuItem: "Burrata & Roka Pizza", comment: "Malzemeler taze, burrata pizzaya çok yakışmış." },
    { id: "napoli-review-4", userName: "Baran T.", date: "26.10.2026", rating: 5, menuItem: "Odun Ateşi Sebzeli", comment: "Sebzeleri bol ve sıcak geldi; focaccia da çok iyiydi." },
  ],
  "food-usta-yaprak-doner": [
    { id: "usta-review-1", userName: "Hakan Y.", date: "09.11.2026", rating: 5, menuItem: "Tereyağlı İskender", comment: "Sosu ve yoğurdu ayrı gelmiş, döneri yumuşacıktı." },
    { id: "usta-review-2", userName: "Özge C.", date: "04.11.2026", rating: 5, menuItem: "Usta Yaprak Döner Porsiyon", comment: "Etin lezzeti çok iyi, porsiyon da oldukça doyurucu." },
    { id: "usta-review-3", userName: "Efe G.", date: "30.10.2026", rating: 4, menuItem: "Et Döner Tombik", comment: "Ekmek taze, turşu ve döner oranı dengeliydi." },
    { id: "usta-review-4", userName: "Nazlı R.", date: "23.10.2026", rating: 5, menuItem: "Zurna Tavuk Dürüm", comment: "Bol malzemeli ve hızlı teslim edildi." },
  ],
  "food-anne-eli": [
    { id: "anne-review-1", userName: "Şule N.", date: "09.11.2026", rating: 5, menuItem: "Zeytinyağlı Yaprak Sarma", comment: "Tam ev yapımı tadında, iç harcı çok dengeliydi." },
    { id: "anne-review-2", userName: "Mehmet B.", date: "06.11.2026", rating: 4, menuItem: "Anne Eli Sebze Çorbası", comment: "Sıcacık ve taze geldi, porsiyon gayet yeterli." },
    { id: "anne-review-3", userName: "Eda T.", date: "31.10.2026", rating: 5, menuItem: "Etli Nohut & Pilav", comment: "Nohut lokum gibi pişmiş, pilavı tane taneydi." },
    { id: "anne-review-4", userName: "Okan F.", date: "25.10.2026", rating: 5, menuItem: "Ispanaklı Ev Böreği", comment: "İncecik ve çıtır börek, yanındaki cacık da çok tazeydi." },
  ],
  "food-ocakbasi-urfa": [
    { id: "urfa-review-1", userName: "Serkan A.", date: "08.11.2026", rating: 5, menuItem: "Urfa Kebap Porsiyon", comment: "Köz tadı belirgin, kebap yumuşak ve baharatı yerindeydi." },
    { id: "urfa-review-2", userName: "Aysu K.", date: "03.11.2026", rating: 4, menuItem: "Kuzu Şiş", comment: "Et güzel marine edilmiş, köz sebzeler de tazeydi." },
    { id: "urfa-review-3", userName: "Uğur M.", date: "29.10.2026", rating: 5, menuItem: "Urfa Dürüm", comment: "Lavaşı sıcak, içi bol ve sumaklı soğanı çok lezzetli." },
    { id: "urfa-review-4", userName: "İlayda E.", date: "22.10.2026", rating: 5, menuItem: "Karışık Ocakbaşı Tabağı", comment: "Üç çeşit et de başarılıydı, mezeler özenle hazırlanmış." },
  ],
  "food-kore-tavuk": [
    { id: "kore-review-1", userName: "Mina D.", date: "09.11.2026", rating: 5, menuItem: "Kore Soslu Çıtır Tavuk", comment: "Tatlı-acı sosu ve susamı çok yakışmış, tavuk çıtırdı." },
    { id: "kore-review-2", userName: "Aras P.", date: "05.11.2026", rating: 4, menuItem: "Kore Tavuk Burger", comment: "Lahana salatası ferahlatıcı, porsiyonu da doyurucuydu." },
    { id: "kore-review-3", userName: "Lara Ş.", date: "01.11.2026", rating: 5, menuItem: "Korean Chicken Bowl", comment: "Pirinç ve sos dengesi çok güzel, sıcak teslim edildi." },
    { id: "kore-review-4", userName: "Berkay O.", date: "27.10.2026", rating: 5, menuItem: "Sarımsaklı Soya Kanat", comment: "Kanatlar iyi pişmişti, kimchi de güzel bir eşlikçi oldu." },
  ],
  "food-tatlici-kosk": [
    { id: "kosk-review-1", userName: "Pınar V.", date: "09.11.2026", rating: 5, menuItem: "Belçika Çikolatalı Waffle", comment: "Waffle sıcacık, çikolatası bol ve meyveleri tazeydi." },
    { id: "kosk-review-2", userName: "Ekin L.", date: "04.11.2026", rating: 5, menuItem: "Çilekli Waffle", comment: "Çilek ve fındık uyumu harika, porsiyon paylaşmaya uygun." },
    { id: "kosk-review-3", userName: "Suat H.", date: "30.10.2026", rating: 4, menuItem: "Sıcak Çikolatalı Brownie", comment: "Brownie yoğun ve tazeydi, dondurmayla çok iyi gitti." },
    { id: "kosk-review-4", userName: "Cansu G.", date: "24.10.2026", rating: 5, menuItem: "Frambuazlı Cheesecake", comment: "Hafif ve dengeli bir tatlı, paketleme çok özenliydi." },
  ],
  "food-antep-baklava": [
    { id: "baklava-review-1", userName: "Fatih E.", date: "08.11.2026", rating: 5, menuItem: "Fıstıklı Baklava 4 Dilim", comment: "Fıstığı bol, şerbeti tam kararındaydı." },
    { id: "baklava-review-2", userName: "Sevgi M.", date: "03.11.2026", rating: 5, menuItem: "Sıcak Fıstıklı Künefe", comment: "Peyniri uzayan, dışı çıtır çok güzel bir künefe." },
    { id: "baklava-review-3", userName: "Yalın C.", date: "28.10.2026", rating: 4, menuItem: "Soğuk Baklava 4 Dilim", comment: "Kakao ve süt dengesi iyi, soğuk servis çok ferah." },
    { id: "baklava-review-4", userName: "Zehra B.", date: "21.10.2026", rating: 5, menuItem: "Fıstık Sarma 4 Dilim", comment: "Fıstık aroması yoğun, her dilim taze ve çıtırdı." },
  ],
};

type MenuSeed = Omit<Product, "service" | "storeName" | "storeId" | "id" | "image"> & {
  restaurantId: string;
  id: string;
  imageUrl: string;
};
type MenuOption = readonly [name: string, description: string, price: number];
type RestaurantMenuSeed = {
  restaurantId: string;
  mains: readonly MenuOption[];
  sides: readonly MenuOption[];
};

const restaurantMenus: RestaurantMenuSeed[] = [
  {
    restaurantId: "food-crispy-co",
    mains: [
      ["Klasik Smash Burger", "İki ince dana köfte, cheddar, karamelize soğan ve özel sos.", 245],
      ["Çıtır Tavuk Burger", "Çıtır tavuk, turşu, marul ve ballı hardal sos.", 215],
      ["Double Cheddar Menü", "Çift köfte, cheddar, baharatlı patates ve içecek.", 325],
      ["BBQ Bacon Burger", "Izgara dana köfte, isli barbekü sos ve çıtır soğan.", 295],
    ],
    sides: [
      ["Baharatlı Patates", "Kekik ve tatlı toz biberle hazırlanan çıtır patates.", 85],
      ["Soğan Halkası 8'li", "Altın renginde kızarmış soğan halkaları.", 95],
      ["Coleslaw Salata", "Lahana, havuç ve hafif mayonezli taze salata.", 75],
    ],
  },
  {
    restaurantId: "food-burger-house-48",
    mains: [
      ["House 48 Burger", "Dana köfte, cheddar, ev yapımı turşu ve House 48 sos.", 255],
      ["Mantar Soslu Burger", "Izgara mantar, cheddar ve kremalı mantar sosu.", 275],
      ["Big House Menü", "Çift dana köfte, patates ve soğuk içecekle doyurucu menü.", 335],
      ["Izgara Tavuk Burger", "Izgara tavuk göğsü, roka ve yoğurtlu hardal sos.", 225],
    ],
    sides: [
      ["Çıtır Parmak Patates", "Dışı çıtır, içi yumuşak altın patates.", 80],
      ["Mozzarella Sticks 6'lı", "Eriyen mozzarella, çıtır pane kaplamasıyla.", 110],
      ["Turşulu House Salata", "Mevsim yeşillikleri, turşu ve hafif sos.", 85],
    ],
  },
  {
    restaurantId: "food-meydan-pizza",
    mains: [
      ["Büyük Boy Karışık Pizza Menüsü", "Büyük boy taş fırın pizzası, mozzarella ve seçili taze malzemeler.", 355],
      ["Margherita Pizza", "Domates sosu, mozzarella ve taze fesleğen.", 265],
      ["Akdeniz Pizza", "Renkli biber, zeytin, mantar ve mozzarella.", 285],
      ["Sucuklu Pizza", "Fırınlanmış sucuk, mozzarella ve özel domates sosu.", 310],
      ["Dört Peynirli Pizza", "Mozzarella, cheddar, rokfor ve parmesan dengesi.", 325],
    ],
    sides: [
      ["Mevsim Salata", "Mevsim yeşillikleri, domates ve hafif limon sosu.", 95],
      ["Sarımsaklı Ekmek", "Fırından sıcak çıkan sarımsaklı ve otlu ekmek.", 80],
      ["Patates Dilimleri", "Kekik ve biberiye ile fırınlanmış patates.", 85],
    ],
  },
  {
    restaurantId: "food-napoli-pizza",
    mains: [
      ["Napoli Margherita", "Uzun mayalı hamur, San Marzano domatesi ve mozzarella.", 295],
      ["Napoli Diavola", "Acı salam, mozzarella ve hafif acılı domates sosu.", 335],
      ["Burrata & Roka Pizza", "Kremamsı burrata, roka ve zeytinyağı.", 345],
      ["Odun Ateşi Sebzeli", "Köz biber, mantar, enginar ve mozzarella.", 305],
    ],
    sides: [
      ["Roka Parmesan Salata", "Taze roka, parmesan ve balzamik sos.", 110],
      ["Focaccia Dilimleri", "Zeytinyağı ve biberiyeyle fırınlanmış ekmek.", 90],
      ["Domatesli Bruschetta", "Kızarmış ekmek üzerinde fesleğenli domates.", 100],
    ],
  },
  {
    restaurantId: "food-gultepe-doner",
    mains: [
      ["Et Döner Dürüm", "İnce lavaşta dana döner, domates ve soğan.", 250],
      ["Pilav Üstü Döner", "Tereyağlı pirinç pilavı üzerinde günlük dana döner.", 290],
      ["Tombik Et Döner", "Yumuşak tombik ekmekte yaprak döner ve turşu.", 260],
      ["Zurna Tavuk Dürüm", "Izgara tavuk, taze yeşillik ve özel soslu büyük dürüm.", 235],
    ],
    sides: [
      ["Bulgur Pilavı", "Domatesli bulgur pilavı ve taze maydanoz.", 75],
      ["Sumaklı Soğan Salatası", "Sumak, maydanoz ve limonla harmanlanmış soğan.", 65],
      ["Patates Kızartması", "Dışı çıtır, sıcak servis edilen patates.", 80],
    ],
  },
  {
    restaurantId: "food-usta-yaprak-doner",
    mains: [
      ["Tereyağlı İskender", "Yaprak döner, kızarmış pide, yoğurt ve tereyağlı sos.", 335],
      ["Usta Yaprak Döner Porsiyon", "İnce kesilmiş dana döner, pilav ve köz biber.", 320],
      ["Et Döner Tombik", "Tombik ekmekte yaprak döner, domates ve turşu.", 275],
      ["Zurna Tavuk Dürüm", "Baharatlı tavuk, lavaş ve sarımsaklı yoğurt sos.", 245],
    ],
    sides: [
      ["Yoğurtlu Pide", "Tereyağlı pide parçaları ve süzme yoğurt.", 95],
      ["Çoban Salata", "Domates, salatalık, biber ve limonlu zeytinyağı.", 85],
      ["Köz Biber & Domates", "Ocakta közlenmiş biber ve domates.", 75],
    ],
  },
  {
    restaurantId: "food-mahalle-mutfagi",
    mains: [
      ["Mercimek Çorbası", "Kırmızı mercimek, limon ve kıtır ekmekle.", 115],
      ["Kuru Fasulye & Pilav", "Güveçte pişen kuru fasulye, tereyağlı pirinç pilavı.", 225],
      ["Ev Usulü Mantı", "Yoğurt, tereyağlı pul biber ve el açması mantı.", 275],
      ["Anne Usulü Karnıyarık", "Köz patlıcan, dana kıyma ve tereyağlı pilav.", 265],
    ],
    sides: [
      ["Sebzeli Güveç", "Mevsim sebzeleriyle ağır ateşte pişirilir.", 165],
      ["Cacık", "Süzme yoğurt, salatalık, nane ve zeytinyağı.", 70],
      ["Mevsim Salata", "Taze yeşillikler ve ev yapımı limon sosu.", 85],
    ],
  },
  {
    restaurantId: "food-anne-eli",
    mains: [
      ["Günün Ev Yemeği Menüsü", "Günün tencere yemeği, pilav ve ev yapımı cacık.", 245],
      ["Zeytinyağlı Yaprak Sarma", "Asma yaprağına sarılmış pirinçli ev usulü sarma.", 195],
      ["Anne Eli Sebze Çorbası", "Günlük sebzelerle hazırlanan sıcacık çorba.", 110],
      ["Etli Nohut & Pilav", "Lokum gibi nohut, dana eti ve tereyağlı pilav.", 245],
      ["Ispanaklı Ev Böreği", "İnce yufkada ıspanaklı ve peynirli ev böreği.", 185],
    ],
    sides: [
      ["Zeytinyağlı Taze Fasulye", "Domates ve soğanla yavaşça pişirilmiş taze fasulye.", 145],
      ["Yoğurtlu Semizotu", "Taze semizotu, sarımsak ve süzme yoğurt.", 85],
      ["Bulgur Pilavı", "Domates ve biberle tane tane pişirilmiş bulgur.", 80],
    ],
  },
  {
    restaurantId: "food-citir-antep",
    mains: [
      ["Karışık Kebap & Lahmacun Menüsü", "Adana kebap, lahmacun, köz sebzeler ve sıcak tırnak pide.", 425],
      ["Adana Kebap", "Zırhta çekilmiş kıyma, köz domates ve tırnak pide.", 340],
      ["Antep Lahmacun", "İnce hamurda zengin baharatlı kıyma ve yeşillik.", 165],
      ["Fındık Lahmacun 4'lü", "Küçük boy, çıtır kenarlı Antep usulü lahmacun.", 190],
      ["Karışık Pide", "Kuşbaşı, kıyma ve kaşarlı pide çeşitleri bir arada.", 315],
    ],
    sides: [
      ["İçli Köfte 2'li", "Dışı ince bulgur, içi cevizli ve baharatlı kıyma.", 125],
      ["Gavurdağı Salata", "Domates, ceviz, nar ekşisi ve taze maydanoz.", 110],
      ["Bulgur Pilavı", "Domatesli bulgur pilavı ve taze maydanoz.", 85],
    ],
  },
  {
    restaurantId: "food-ocakbasi-urfa",
    mains: [
      ["Urfa Kebap Porsiyon", "Zırh kıyması, köz sebzeler ve sıcak lavaş.", 325],
      ["Kuzu Şiş", "Marine kuzu parçaları, pilav ve közlenmiş biber.", 345],
      ["Urfa Dürüm", "Baharatlı kebap, maydanoz ve sumaklı soğan.", 255],
      ["Karışık Ocakbaşı Tabağı", "Adana, kuzu şiş ve tavuk şişten seçki.", 350],
    ],
    sides: [
      ["Haydari & Acılı Ezme", "İki taze meze; süzme yoğurt ve köz biber.", 95],
      ["Çiğ Köfte Porsiyon", "İnce bulgur, isot, limon ve marulla servis edilir.", 120],
      ["Köz Patlıcan Salatası", "Köz patlıcan, sarımsak ve zeytinyağı.", 105],
    ],
  },
  {
    restaurantId: "food-tavuk-kralligi",
    mains: [
      ["Çıtır Tavuk Sepeti", "Çıtır tavuk parçaları, patates ve dip sos.", 275],
      ["Barbekü Kanat", "Barbekü soslu tavuk kanatları ve taze salata.", 255],
      ["Izgara Tavuk Dürüm", "Izgara tavuk, yeşillik ve yoğurtlu sos.", 235],
      ["Tavuk Şinitzel Menü", "Pane tavuk, patates ve mevsim salatası.", 295],
    ],
    sides: [
      ["Soğan Halkası 8'li", "Çıtır pane kaplamalı, altın renginde soğan halkası.", 90],
      ["Coleslaw", "Lahana ve havuçla hazırlanan hafif kremalı salata.", 75],
      ["Baharatlı Patates", "Özel baharat karışımıyla çıtır kızarmış patates.", 85],
    ],
  },
  {
    restaurantId: "food-kore-tavuk",
    mains: [
      ["Kore Soslu Çıtır Tavuk", "Gochujang, susam ve taze soğanlı çıtır tavuk.", 295],
      ["Kore Tavuk Burger", "Çıtır tavuk, lahana salatası ve tatlı-acı sos.", 255],
      ["Korean Chicken Bowl", "Susamlı pilav, çıtır tavuk ve Kore sosu.", 285],
      ["Sarımsaklı Soya Kanat", "Soya, sarımsak ve bal soslu fırın kanat.", 275],
    ],
    sides: [
      ["Kimchi Salatası", "Hafif acılı fermente lahana ve susam.", 95],
      ["Susamlı Pirinç", "Tane tane pirinç, susam ve taze soğan.", 80],
      ["Çıtır Sebzeli Gyoza 5'li", "Sebzeli iç harç ve soya dip sosuyla.", 115],
    ],
  },
  {
    restaurantId: "food-tatlici-kosk",
    mains: [
      ["Belçika Çikolatalı Waffle", "Taze waffle, Belçika çikolatası ve mevsim meyvesi.", 245],
      ["Çilekli Waffle", "Çilek, muz ve fındık parçalarıyla hazırlanan waffle.", 235],
      ["Sıcak Çikolatalı Brownie", "Yoğun çikolatalı brownie ve dondurma eşliği.", 195],
      ["Frambuazlı Cheesecake", "Kremamsı cheesecake, frambuaz sos ve bisküvi tabanı.", 185],
    ],
    sides: [
      ["Dondurma 2 Top", "Günlük vanilya ve çikolata dondurması.", 95],
      ["Meyve Tabağı", "Mevsim meyveleri, bal ve hafif çikolata sosu.", 125],
      ["Mini Profiterol", "Çikolata soslu mini profiterol porsiyonu.", 145],
    ],
  },
  {
    restaurantId: "food-antep-baklava",
    mains: [
      ["Fıstıklı Baklava 4 Dilim", "İnce yufka, boz fıstık ve dengeli şerbet.", 245],
      ["Sıcak Fıstıklı Künefe", "Tel kadayıf, uzayan peynir ve Antep fıstığı.", 265],
      ["Soğuk Baklava 4 Dilim", "Kakaolu sütlü şerbet ve bol fıstıkla.", 255],
      ["Fıstık Sarma 4 Dilim", "İncecik yufkada yoğun boz fıstık dolgusu.", 320],
    ],
    sides: [
      ["Sütlü Nuriye", "Fındık dolgulu hafif şerbetli geleneksel tatlı.", 190],
      ["Kaymaklı Ekmek Kadayıfı", "Şerbetli kadayıf, taze kaymakla servis edilir.", 175],
      ["Antep Fıstıklı Dondurma", "Sütlü dondurma ve yoğun Antep fıstığı.", 110],
    ],
  },
];

const drinkOptions: readonly MenuOption[] = [
  ["Yayık Ayran (300 ml)", "Günlük yoğurttan hazırlanan ferah yayık ayran.", 30],
  ["Coca-Cola (330 ml)", "Soğuk servis edilen klasik gazlı içecek.", 45],
  ["Coca-Cola Zero (330 ml)", "Şekersiz, soğuk Coca-Cola Zero.", 45],
  ["Fanta (330 ml)", "Portakal aromalı soğuk gazlı içecek.", 45],
  ["Su (500 ml)", "Soğuk doğal kaynak suyu.", 15],
];

function getProductImageCandidates(productName: string, cuisine: string, itemIndex: number): readonly string[] {
  const name = productName.toLocaleLowerCase("tr");
  if (name.includes("coca-cola zero")) return [productPhotos.colaZero];
  if (name.includes("coca-cola")) return [productPhotos.cola];
  if (name.includes("fanta")) return [productPhotos.fanta];
  if (name.includes("sprite") || name.includes("meyveli soda")) return [productPhotos.sprite];
  if (name.includes("ayran")) return [productPhotos.ayran];
  if (name.includes("su (")) return [productPhotos.water];
  if (name.includes("çay") || name.includes("şalgam") || name.includes("limonata")) return [productPhotos.icedTea];
  if (itemIndex >= 7) return [productPhotos.icedTea];
  if (name.includes("patates")) return productPhotos.fries.map(productPhoto);
  if (name.includes("soğan") || name.includes("mozzarella") || name.includes("içli") || name.includes("gyoza")) return productPhotos.snack.map(productPhoto);
  if (name.includes("salata") || name.includes("meze") || name.includes("cacık") || name.includes("ezme") || name.includes("kimchi")) {
    return [...productPhotos.salad, ...productPhotos.home].map(productPhoto);
  }
  if (name.includes("çorba")) return productPhotos.soup.map(productPhoto);
  if (name.includes("pizza")) return productPhotos.pizza.map(productPhoto);
  if (name.includes("döner") || name.includes("iskender") || name.includes("dürüm")) return productPhotos.doner.map(productPhoto);
  if (name.includes("kebap") || name.includes("lahmacun") || name.includes("pide") || name.includes("şiş")) return productPhotos.kebab.map(productPhoto);
  if (name.includes("waffle") || name.includes("baklava") || name.includes("künefe") || name.includes("tatlı") || name.includes("cheesecake") || name.includes("brownie") || name.includes("dondurma")) return productPhotos.dessert.map(productPhoto);
  if (name.includes("tavuk")) return productPhotos.chicken.map(productPhoto);

  const cuisinePhotos = cuisine === "Pizza" ? productPhotos.pizza
    : cuisine === "Döner" ? productPhotos.doner
      : cuisine === "Kebap & Lahmacun" ? productPhotos.kebab
        : cuisine === "Ev Yemekleri" ? productPhotos.home
          : cuisine === "Tavuk" ? productPhotos.chicken
            : cuisine === "Tatlı" ? productPhotos.dessert
              : productPhotos.burger;
  return cuisinePhotos.map(productPhoto);
}

const menuSeeds: MenuSeed[] = restaurantMenus.flatMap(({ restaurantId, mains, sides }) => {
  const cuisine = foodRestaurants.find((restaurant) => restaurant.id === restaurantId)?.cuisine ?? "Burger";
  const restaurantIndex = foodRestaurants.findIndex((restaurant) => restaurant.id === restaurantId);
  const usedImageUrls = new Set<string>();
  const entries = [
    ...mains.map((option, index) => ({ option, category: "Ana Lezzetler", index })),
    ...sides.map((option, index) => ({ option, category: "Yan Lezzetler", index: mains.length + index })),
    ...drinkOptions.map((option, index) => ({ option, category: "İçecekler", index: mains.length + sides.length + index })),
  ];
  return entries.map(({ option, category, index }) => {
    const [name, description, price] = option;
    const id = `${restaurantId}-item-${index + 1}`;
    return {
      restaurantId,
      id,
      name,
      description,
      price,
      category,
      imageUrl: (() => {
        if (name.toLocaleLowerCase("tr").includes("double cheddar menü")) {
          return productPhoto("photo-1568901346375-23c9450c58cd");
        }
        const candidates = getProductImageCandidates(name, cuisine, index);
        const preferred = getFoodProductFallbackImage(name);
        const image = [preferred, ...candidates].find((candidate) => !usedImageUrls.has(candidate))
          ?? foodPhotoReserve.find((candidate) => !usedImageUrls.has(candidate))
          ?? photoUrlFromIds(productPhotos.home, restaurantIndex + index);
        usedImageUrls.add(image);
        return image;
      })(),
    };
  });
});

const restaurantNames = new Map(foodRestaurants.map(({ id, name }) => [id, name]));

export const foodProducts: FoodMenuProduct[] = menuSeeds.map(({ restaurantId, imageUrl: image, ...product }) => {
  const coupon = foodCoupons.find((item) => item.campaignProductNames[restaurantId] === product.name);
  const campaignOriginalPrice = coupon ? Number((product.price / 0.9).toFixed(2)) : undefined;
  return {
    ...product,
    image,
    storeId: restaurantId,
    storeName: restaurantNames.get(restaurantId) ?? "Restoran",
    service: "food",
    ...(campaignOriginalPrice ? { campaignOriginalPrice, campaignCouponCode: coupon?.code } : {}),
  };
});

export function getFoodCouponCampaignProducts(coupon: FoodCoupon, restaurantId: string): FoodMenuProduct[] {
  if (!coupon.restaurantIds.includes(restaurantId)) return [];
  const featuredName = coupon.campaignProductNames[restaurantId];
  return foodProducts.filter((product) =>
    product.storeId === restaurantId &&
    product.category === "Ana Lezzetler" &&
    product.name === featuredName
  );
}

export type FoodCouponApplication = {
  discount: number;
  applicable: boolean;
  message: string;
};

export function calculateFoodCouponDiscount(
  coupon: FoodCoupon | null,
  lines: { product: Product; quantity: number }[],
): FoodCouponApplication {
  if (!coupon) return { discount: 0, applicable: false, message: "Kupon seçerek indirimden yararlan." };
  if (!lines.length) return { discount: 0, applicable: false, message: `${coupon.code} kuponu için önce ürün ekle.` };

  const restaurantId = lines[0].product.storeId;
  if (!coupon.restaurantIds.includes(restaurantId)) {
    return { discount: 0, applicable: false, message: `${coupon.code} yalnızca ilgili restoranlarda kullanılabilir.` };
  }

  const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  if (subtotal < coupon.minimumSubtotal) {
    return {
      discount: 0,
      applicable: false,
      message: `${coupon.code} için en az ${coupon.minimumSubtotal} TL sepet tutarı gerekli.`,
    };
  }

  const campaignProducts = getFoodCouponCampaignProducts(coupon, restaurantId);
  const eligibleSubtotal = lines.reduce((sum, line) => {
    const isEligible = campaignProducts.some((product) =>
      line.product.id === product.id || line.product.id.startsWith(`${product.id}-custom-`)
    );
    return sum + (isEligible ? line.product.price * line.quantity : 0);
  }, 0);

  if (eligibleSubtotal === 0) {
    return { discount: 0, applicable: false, message: `${coupon.code} kampanyalı menü ürünlerinde geçerlidir.` };
  }

  const discount = coupon.discountType === "percentage"
    ? Number((eligibleSubtotal * coupon.discountValue / 100).toFixed(2))
    : Math.min(coupon.discountValue, eligibleSubtotal);
  return {
    discount,
    applicable: true,
    message: `${coupon.code} kampanyalı menüye uygulandı.`,
  };
}

export const cuisineOptions = [
  { name: "Tümü", icon: "🍽️" },
  { name: "Burger", icon: "🍔" },
  { name: "Pizza", icon: "🍕" },
  { name: "Döner", icon: "🌯" },
  { name: "Kebap & Lahmacun", icon: "🥩" },
  { name: "Ev Yemekleri", icon: "🍲" },
  { name: "Tavuk", icon: "🍗" },
  { name: "Tatlı", icon: "🍰" },
];

export const foodCampaigns: { id: FoodCampaign; title: string; description: string }[] = [
  { id: "selected-menu", title: "Seçili menülerde indirim fırsatı", description: "İndirimli lezzetleri keşfet" },
  { id: "free-delivery", title: "Ücretsiz teslimat", description: "Teslimat ücreti olmayan restoranlar" },
  { id: "value-menu", title: "Ekonomik ikili menüler", description: "Paylaşmalık menüleri keşfet" },
];
