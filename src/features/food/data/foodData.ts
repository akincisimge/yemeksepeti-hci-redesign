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

const productPhoto = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=80`;

const productPhotos = {
  cola: productPhoto("photo-1554866585-cd94860890b7"),
  colaZero: productPhoto("photo-1622483767028-3f66f32aef97"),
  fanta: productPhoto("photo-1624517452488-04869289c4ca"),
  sprite: productPhoto("photo-1625772299848-391b6a87d7b3"),
  ayran: productPhoto("photo-1563636619-e9143da7973b"),
  water: productPhoto("photo-1560023907-5f339617ea30"),
  icedTea: productPhoto("photo-1556679343-c7306c1976bc"),
  burger: [
    "photo-1568901346375-23c9450c58cd",
    "photo-1586190848861-99aa4a171e90",
    "photo-1606755962773-d324e0a13086",
    "photo-1553979459-d2229ba7433b",
    "photo-1550547660-d9450f859349",
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
    rating: 4.6,
    ratingCount: "185+",
    deliveryMinutes: 32,
    deliveryTime: "30-40 dk",
    deliveryFee: 16.99,
    minBasket: 190,
    image: foodImage("photo-1550547660-d9450f859349"),
    imageLabel: "Doyurucu ev yapımı burger",
    highlight: "Ev Yapımı",
    discount: "%15 indirim",
    campaigns: ["selected-menu"],
  },
  {
    id: "food-meydan-pizza",
    name: "Meydan Pizza",
    description: "Taş fırında pişen ince hamurlu pizzalar ve günlük hazırlanan salatalar.",
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
    id: "food-napoli-pizza",
    name: "Napoli Odun Ateşi Pizza",
    description: "Uzun mayalı hamur, İtalyan domatesi ve odun ateşinde pişirme.",
    service: "food",
    cuisine: "Pizza",
    rating: 4.9,
    ratingCount: "340+",
    deliveryMinutes: 38,
    deliveryTime: "35-45 dk",
    deliveryFee: 19.99,
    minBasket: 230,
    image: foodImage("photo-1571407970349-bc81e7e96d47"),
    imageLabel: "Odun ateşinde pişmiş Napoli usulü pizza",
    highlight: "Odun Ateşi",
    discount: "%10 indirim",
    campaigns: ["selected-menu", "value-menu"],
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
    discount: "%10 indirim",
    campaigns: ["free-delivery"],
  },
  {
    id: "food-usta-yaprak-doner",
    name: "Usta Yaprak Döner & İskender",
    description: "Günlük kesilen yaprak döner, tereyağlı sos ve taze pide.",
    service: "food",
    cuisine: "Döner",
    rating: 4.7,
    ratingCount: "275+",
    deliveryMinutes: 34,
    deliveryTime: "30-40 dk",
    deliveryFee: 18.99,
    minBasket: 220,
    image: foodImage("photo-1561651823-34feb02250e4"),
    imageLabel: "Taze lavaşta yaprak döner",
    highlight: "Usta İşi",
    discount: "%10 indirim",
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
    deliveryFee: 14.99,
    minBasket: 150,
    image: foodImage("photo-1547592180-85f173990554"),
    imageLabel: "Renkli ev yemeği ve taze sebzeler",
    highlight: "Ev Usulü",
    discount: "%15 indirim",
    campaigns: ["selected-menu", "value-menu"],
  },
  {
    id: "food-anne-eli",
    name: "Anne Eli Zeytinyağlı & Çorba",
    description: "Mevsim sebzeleriyle zeytinyağlılar ve her gün taze çorba.",
    service: "food",
    cuisine: "Ev Yemekleri",
    rating: 4.8,
    ratingCount: "230+",
    deliveryMinutes: 29,
    deliveryTime: "25-35 dk",
    deliveryFee: 14.99,
    minBasket: 160,
    image: foodImage("photo-1547592180-85f173990554"),
    imageLabel: "Taze sebzelerle hazırlanmış ev yemeği",
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
    deliveryFee: 24.99,
    minBasket: 200,
    image: foodImage("photo-1544025162-d76694265947"),
    imageLabel: "Izgara kebap ve közlenmiş sebzeler",
    highlight: "Usta İşi",
    discount: "%15 indirim",
    campaigns: ["value-menu"],
  },
  {
    id: "food-ocakbasi-urfa",
    name: "Ocakbaşı Öz Urfa Kebap",
    description: "Köz ateşinde hazırlanan kebaplar, zırh kıyması ve taze mezeler.",
    service: "food",
    cuisine: "Kebap & Lahmacun",
    rating: 4.6,
    ratingCount: "195+",
    deliveryMinutes: 40,
    deliveryTime: "35-45 dk",
    deliveryFee: 24.99,
    minBasket: 280,
    image: foodImage("photo-1544025162-d76694265947"),
    imageLabel: "Közlenmiş sebzelerle ocakbaşı kebabı",
    highlight: "Köz Ateşi",
    discount: "%12 indirim",
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
    image: foodImage("photo-1626082927389-6cd097cdc6ec"),
    imageLabel: "Kore usulü çıtır tavuk parçaları",
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
    deliveryTime: "25-35 dk",
    deliveryFee: 12.99,
    minBasket: 140,
    image: foodImage("photo-1488477181946-6428a0291777"),
    imageLabel: "Taze meyvelerle hazırlanan tatlı",
    highlight: "Tatlı Molası",
    discount: "%15 indirim",
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
    discount: "%10 indirim",
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

export const foodProducts: Product[] = menuSeeds.map(({ restaurantId, imageUrl: image, ...product }) => ({
  ...product,
  image,
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
