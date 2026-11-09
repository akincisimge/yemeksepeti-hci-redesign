import type { Product, Store } from "../../../types/domain";

export type FoodCampaign = "selected-menu" | "free-delivery" | "value-menu";
export type FoodSort = "recommended" | "delivery" | "rating";

export type FoodRestaurant = Store & {
  cuisine: string;
  rating: number;
  ratingCount: string;
  deliveryMinutes: number;
  deliveryTime: string;
  deliveryFee: number;
  minBasket: number;
  image: string;
  imageLabel: string;
  highlight: string;
  discount: string;
  campaigns: FoodCampaign[];
};

const foodImage = (id: string, width = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;

export const foodRestaurants: FoodRestaurant[] = [
  {
    id: "food-crispy-co",
    name: "Crispy Co Burger",
    description: "Özenle hazırlanan smash burgerler ve çıtır patatesler.",
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
    id: "food-meydan-pizza",
    name: "Meydan Pizza",
    description: "Taş fırından çıkan ince hamurlu pizzalar.",
    service: "food",
    cuisine: "Pizza",
    rating: 4.7,
    ratingCount: "180+",
    deliveryMinutes: 32,
    deliveryTime: "30-40 dk",
    deliveryFee: 19.99,
    minBasket: 180,
    image: foodImage("photo-1574071318508-1cdbab80d002"),
    imageLabel: "Fırından yeni çıkmış pizza",
    highlight: "Çok Sevilen",
    discount: "%20 indirim",
    campaigns: ["selected-menu"],
  },
  {
    id: "food-gultepe-doner",
    name: "Gültepe Dönercisi",
    description: "Günlük hazırlanan döner, taze lavaş ve ev yapımı soslar.",
    service: "food",
    cuisine: "Döner",
    rating: 4.6,
    ratingCount: "320+",
    deliveryMinutes: 24,
    deliveryTime: "20-30 dk",
    deliveryFee: 0,
    minBasket: 140,
    image: foodImage("photo-1561651823-34feb02250e4"),
    imageLabel: "Lavaş içinde döner ve taze sebzeler",
    highlight: "Hızlı Teslimat",
    discount: "",
    campaigns: ["free-delivery"],
  },
  {
    id: "food-mahalle-mutfagi",
    name: "Mahalle Mutfağı",
    description: "Günün taze ev yemekleri ve sıcacık çorbalar.",
    service: "food",
    cuisine: "Ev Yemekleri",
    rating: 4.9,
    ratingCount: "410+",
    deliveryMinutes: 35,
    deliveryTime: "30-40 dk",
    deliveryFee: 14.99,
    minBasket: 150,
    image: foodImage("photo-1547592180-85f173990554"),
    imageLabel: "Renkli ev yemeği ve taze sebzeler",
    highlight: "Ev Usulü",
    discount: "%15 indirim",
    campaigns: ["selected-menu", "value-menu"],
  },
  {
    id: "food-citir-antep",
    name: "Çıtır Çıtır Antep",
    description: "Ustalıkla hazırlanan kebaplar ve incecik lahmacun.",
    service: "food",
    cuisine: "Kebap & Lahmacun",
    rating: 4.8,
    ratingCount: "290+",
    deliveryMinutes: 38,
    deliveryTime: "35-45 dk",
    deliveryFee: 24.99,
    minBasket: 200,
    image: foodImage("photo-1544025162-d76694265947"),
    imageLabel: "Izgara kebap ve közlenmiş sebzeler",
    highlight: "Usta İşi",
    discount: "",
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
    id: "food-sekerli-hayal",
    name: "Şekerli Hayal",
    description: "Günlük tatlılar, pastalar ve kahve yanı lezzetler.",
    service: "food",
    cuisine: "Tatlı",
    rating: 4.7,
    ratingCount: "150+",
    deliveryMinutes: 30,
    deliveryTime: "25-35 dk",
    deliveryFee: 12.99,
    minBasket: 120,
    image: foodImage("photo-1488477181946-6428a0291777"),
    imageLabel: "Taze meyveli pasta ve tatlı",
    highlight: "Tatlı Molası",
    discount: "%15 indirim",
    campaigns: ["selected-menu"],
  },
  {
    id: "food-ikili-mutfak",
    name: "İkili Mutfak",
    description: "Paylaşmaya uygun burger ve tavuk menüleri.",
    service: "food",
    cuisine: "Burger",
    rating: 4.6,
    ratingCount: "95+",
    deliveryMinutes: 29,
    deliveryTime: "25-35 dk",
    deliveryFee: 17.99,
    minBasket: 170,
    image: foodImage("photo-1550547660-d9450f859349"),
    imageLabel: "İkili burger menüsü",
    highlight: "İkili Menü",
    discount: "",
    campaigns: ["value-menu"],
  },
];

type MenuSeed = Omit<Product, "service" | "storeName" | "storeId"> & {
  restaurantId: string;
};

const menuSeeds: MenuSeed[] = [
  { id: "food-burger-classic", name: "Klasik Smash Burger", description: "İki ince dana köfte, cheddar, marul ve özel sos.", price: 245, image: foodImage("photo-1568901346375-23c9450c58cd", 500), category: "Burgerler", restaurantId: "food-crispy-co" },
  { id: "food-burger-crispy", name: "Çıtır Tavuk Burger", description: "Çıtır tavuk, turşu, marul ve ballı hardal sos.", price: 215, image: foodImage("photo-1606755962773-d324e0a13086", 500), category: "Burgerler", restaurantId: "food-crispy-co" },
  { id: "food-burger-fries", name: "Baharatlı Patates", description: "Kekik ve tatlı toz biberle fırınlanmış patates.", price: 95, image: foodImage("photo-1573080496219-bb080dd4f877", 500), category: "Yan Lezzetler", restaurantId: "food-crispy-co" },
  { id: "food-pizza-margherita", name: "Margherita Pizza", description: "Domates sosu, mozzarella ve taze fesleğen.", price: 265, image: foodImage("photo-1574071318508-1cdbab80d002", 500), category: "Pizzalar", restaurantId: "food-meydan-pizza" },
  { id: "food-pizza-veggie", name: "Akdeniz Pizza", description: "Renkli biberler, zeytin, mantar ve mozzarella.", price: 285, image: foodImage("photo-1571407970349-bc81e7e96d47", 500), category: "Pizzalar", restaurantId: "food-meydan-pizza" },
  { id: "food-pizza-salad", name: "Mevsim Salata", description: "Mevsim yeşillikleri, domates ve hafif sos.", price: 125, image: foodImage("photo-1512621776951-a57141f2eefd", 500), category: "Yan Lezzetler", restaurantId: "food-meydan-pizza" },
  { id: "food-doner-wrap", name: "Et Döner Dürüm", description: "İnce lavaşta et döner, domates ve soğan.", price: 230, image: foodImage("photo-1561651823-34feb02250e4", 500), category: "Dönerler", restaurantId: "food-gultepe-doner" },
  { id: "food-doner-rice", name: "Pilav Üstü Döner", description: "Tereyağlı pilav üzerinde dana döner.", price: 275, image: foodImage("photo-1512058564366-18510be2db19", 500), category: "Dönerler", restaurantId: "food-gultepe-doner" },
  { id: "food-doner-ayran", name: "Ev Yapımı Ayran", description: "Günlük yoğurttan hazırlanır.", price: 45, image: foodImage("photo-1553909489-cd47e0ef937f", 500), category: "İçecekler", restaurantId: "food-gultepe-doner" },
  { id: "food-home-soup", name: "Mercimek Çorbası", description: "Kırmızı mercimek, limon ve kıtır ekmek.", price: 105, image: foodImage("photo-1547592180-85f173990554", 500), category: "Çorbalar", restaurantId: "food-mahalle-mutfagi" },
  { id: "food-home-chicken", name: "Tavuklu Pilav", description: "Tereyağlı pirinç pilavı ve didiklenmiş tavuk.", price: 195, image: foodImage("photo-1512058564366-18510be2db19", 500), category: "Ana Yemekler", restaurantId: "food-mahalle-mutfagi" },
  { id: "food-home-stew", name: "Sebzeli Güveç", description: "Mevsim sebzeleriyle ağır ateşte pişirilir.", price: 185, image: foodImage("photo-1476124369491-e7addf5db371", 500), category: "Ana Yemekler", restaurantId: "food-mahalle-mutfagi" },
  { id: "food-kebab-adana", name: "Adana Kebap", description: "Izgara kebap, közlenmiş domates ve lavaş.", price: 340, image: foodImage("photo-1544025162-d76694265947", 500), category: "Kebaplar", restaurantId: "food-citir-antep" },
  { id: "food-kebab-lahmacun", name: "Antep Lahmacun", description: "İnce hamur, zengin baharatlı kıyma ve yeşillik.", price: 145, image: foodImage("photo-1601050690597-df0568f70950", 500), category: "Lahmacunlar", restaurantId: "food-citir-antep" },
  { id: "food-kebab-bulgur", name: "Bulgur Pilavı", description: "Domatesli bulgur pilavı ve taze maydanoz.", price: 90, image: foodImage("photo-1512058564366-18510be2db19", 500), category: "Yan Lezzetler", restaurantId: "food-citir-antep" },
  { id: "food-chicken-crispy", name: "Çıtır Tavuk Sepeti", description: "Çıtır tavuk parçaları, patates ve dip sos.", price: 255, image: foodImage("photo-1626082927389-6cd097cdc6ec", 500), category: "Tavuk Menüler", restaurantId: "food-tavuk-kralligi" },
  { id: "food-chicken-wings", name: "Barbekü Kanat", description: "Barbekü soslu tavuk kanatları ve salata.", price: 235, image: foodImage("photo-1527477396000-e27163b481c2", 500), category: "Tavuk Menüler", restaurantId: "food-tavuk-kralligi" },
  { id: "food-chicken-wrap", name: "Izgara Tavuk Dürüm", description: "Izgara tavuk, taze yeşillik ve yoğurtlu sos.", price: 210, image: foodImage("photo-1606755962773-d324e0a13086", 500), category: "Dürümler", restaurantId: "food-tavuk-kralligi" },
  { id: "food-dessert-cheesecake", name: "Frambuazlı Cheesecake", description: "Kremamsı cheesecake ve frambuaz sosu.", price: 155, image: foodImage("photo-1488477181946-6428a0291777", 500), category: "Tatlılar", restaurantId: "food-sekerli-hayal" },
  { id: "food-dessert-brownie", name: "Sıcak Çikolatalı Brownie", description: "Yoğun çikolatalı brownie, günlük hazırlanır.", price: 135, image: foodImage("photo-1606313564200-e75d5e30476c", 500), category: "Tatlılar", restaurantId: "food-sekerli-hayal" },
  { id: "food-dessert-tiramisu", name: "Ev Yapımı Tiramisu", description: "Kahve aromalı krema ve kakao.", price: 145, image: foodImage("photo-1571877227200-a0d98ea607e9", 500), category: "Tatlılar", restaurantId: "food-sekerli-hayal" },
  { id: "food-pair-burger", name: "İkili Burger Menü", description: "İki burger, iki patates ve iki içecek.", price: 520, image: foodImage("photo-1550547660-d9450f859349", 500), category: "Paylaşım Menüleri", restaurantId: "food-ikili-mutfak" },
  { id: "food-pair-chicken", name: "İkili Tavuk Menü", description: "İki çıtır tavuk menü ve iki dip sos.", price: 465, image: foodImage("photo-1626082927389-6cd097cdc6ec", 500), category: "Paylaşım Menüleri", restaurantId: "food-ikili-mutfak" },
];

const restaurantNames = new Map(foodRestaurants.map(({ id, name }) => [id, name]));

export const foodProducts: Product[] = menuSeeds.map(({ restaurantId, ...product }) => ({
  ...product,
  storeId: restaurantId,
  storeName: restaurantNames.get(restaurantId) ?? "Restoran",
  service: "food",
}));

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
