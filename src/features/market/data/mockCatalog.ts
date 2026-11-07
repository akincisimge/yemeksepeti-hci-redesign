import type { Product, Store } from "../../../types/domain";

type Group = { slug: string; category: string; names: string[]; brands: string[]; sizes: [number, number]; basis: "kg" | "L" | "adet"; unitPrice: number };
// Fictional catalog for usability tasks. These are not live merchant assortments or dietary claims.
const groups: Group[] = [
  { slug: "dairy", category: "Süt ve Kahvaltılık", names: ["Beyaz Peynir", "Taze Kaşar", "Süzme Yoğurt", "Tereyağı", "Labne", "Çökelek", "Tulum Peyniri", "Krem Peynir"], brands: ["Günlük", "Sofra", "Yayla Evi"], sizes: [.25, .5], basis: "kg", unitPrice: 240 },
  { slug: "bakery", category: "Fırın", names: ["Çavdar Ekmeği", "Kepekli Ekmek", "Siyez Ekmeği", "Tost Ekmeği", "Sandviç Ekmeği", "Lavaş", "Hamburger Ekmeği", "Yufka"], brands: ["Fırından", "Taş Fırın", "Günün Lezzeti"], sizes: [.3, .6], basis: "kg", unitPrice: 100 },
  { slug: "produce", category: "Meyve ve Sebze", names: ["Armut", "Portakal", "Mandalina", "Salatalık", "Patates", "Kuru Soğan", "Havuç", "Kabak"], brands: ["Bahçeden", "Dalından", "Yeşil Bahçe"], sizes: [.5, 1], basis: "kg", unitPrice: 50 },
  { slug: "pantry", category: "Temel Gıda", names: ["Kırmızı Mercimek", "Yeşil Mercimek", "Pilavlık Bulgur", "İnce Bulgur", "Nohut", "Kuru Fasulye", "İrmik", "Tam Buğday Unu"], brands: ["Sofra", "Anadolu Harmanı", "Bereket"], sizes: [.5, 1], basis: "kg", unitPrice: 80 },
  { slug: "drinks", category: "İçecek", names: ["Portakal Suyu", "Elma Suyu", "Şeftali Nektarı", "Vişne Nektarı", "Limonata", "Soğuk Çay", "Gazoz", "Ayran"], brands: ["Kaynak", "Serin", "Meyve Zamanı"], sizes: [.33, 1], basis: "L", unitPrice: 50 },
  { slug: "snacks", category: "Atıştırmalık", names: ["Kakaolu Bisküvi", "Yulaflı Bisküvi", "Tuzlu Kraker", "Çubuk Kraker", "Patates Cipsi", "Mısır Cipsi", "Kavrulmuş Fındık", "Karışık Kuruyemiş"], brands: ["Tatlı Mola", "Çıtır", "Keyif"], sizes: [.08, .16], basis: "kg", unitPrice: 280 },
  { slug: "cleaning", category: "Temizlik", names: ["Sıvı Çamaşır Deterjanı", "Yumuşatıcı", "Sıvı Bulaşık Deterjanı", "Yüzey Temizleyici", "Cam Temizleyici", "Ahşap Temizleyici", "Banyo Temizleyici", "Mutfak Temizleyici"], brands: ["Temiz", "Işıltı", "Ev Rahatı"], sizes: [1, 2], basis: "L", unitPrice: 65 },
  { slug: "care", category: "Kişisel Bakım", names: ["Şampuan", "Duş Jeli", "El Sabunu", "Saç Kremi", "Ağız Bakım Suyu", "Kolonya", "Yüz Yıkama Jeli", "Vücut Losyonu"], brands: ["Duru Gün", "Bakım Saati", "Ferahlık"], sizes: [.25, .5], basis: "L", unitPrice: 180 },
  { slug: "frozen", category: "Dondurulmuş", names: ["Dondurulmuş Bezelye", "Dondurulmuş Patates", "Dondurulmuş Mısır", "Dondurulmuş Ispanak", "Dondurulmuş Pizza", "Dondurulmuş Mantı", "Dondurulmuş Börek", "Dondurulmuş Çilek"], brands: ["Taze Kalsın", "Buz Bahçesi", "Hazır Sofra"], sizes: [.4, .8], basis: "kg", unitPrice: 150 },
  { slug: "meat", category: "Et ve Tavuk", names: ["Tavuk Göğsü", "Tavuk But", "Tavuk Kanat", "Hindi Göğsü", "Dana Kıyma", "Dana Kuşbaşı", "Kasap Köfte", "Tavuk Şiş"], brands: ["Çiftlikten", "Sofra Eti", "Güzel Çiftlik"], sizes: [.4, .8], basis: "kg", unitPrice: 300 },
  { slug: "pets", category: "Evcil Dostlar", names: ["Yetişkin Kedi Maması", "Yavru Kedi Maması", "Kısır Kedi Maması", "Tavuklu Kedi Maması", "Yetişkin Köpek Maması", "Yavru Köpek Maması", "Küçük Irk Köpek Maması", "Balıklı Kedi Maması"], brands: ["Pati", "Dost Mama", "Mutlu Kuyruk"], sizes: [.5, 1], basis: "kg", unitPrice: 180 },
  { slug: "baby", category: "Anne ve Bebek", names: ["Bebek Bezi 3 Numara", "Bebek Bezi 4 Numara", "Bebek Bezi 5 Numara", "Bebek Bezi 6 Numara", "Bebek Islak Mendili", "Bebek Bakım Mendili", "Alt Değiştirme Örtüsü", "Bebek Temizleme Pamuğu"], brands: ["Minik", "Yumuşak Dokunuş", "Bebek Günü"], sizes: [20, 40], basis: "adet", unitPrice: 6 },
];
export function expandedCatalog(store: Store, storeIndex: number): Product[] {
  return groups.flatMap(group => group.names.flatMap((name, index) => group.sizes.map((amount, variant) => {
    const brand = group.brands[(index + storeIndex) % group.brands.length];
    const price = Math.round(group.unitPrice * amount * (1 + index * .08 + storeIndex * .04 - variant * .035) * 100) / 100;
    const unitLabel = group.basis === "kg" ? amount < 1 ? `${amount * 1000} g` : `${amount} kg`
      : group.basis === "L" ? amount < 1 ? `${amount * 1000} ml` : `${amount} L` : `${amount} adet`;
    return {
      id: `${store.id}-catalog-${group.slug}-${index}-${variant}`, name, brand, description: unitLabel,
      category: group.category, storeId: store.id, storeName: store.name, service: "market" as const,
      price, unitLabel, unitBasis: group.basis, unitPrice: price / amount, tags: [],
    };
  })));
}
