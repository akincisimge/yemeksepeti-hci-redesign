# Hakan — Yemek bölümü (4 ana ekran)

## Mevcut Yemeksepeti'nde gözlenen / düzeltilecek riskler
- Kampanya bannerları, QR uygulama tanıtımı ve kayıt çağrıları restoran keşfiyle aynı sayfada dikkat çekiyor; **K7/K8**: arama ve restoran bulmayı öne çıkar, promosyonu ikincil tut.
- Kartlarda puan, süre, ücret, kampanya vb. çok bilgi bir arada; bazı satırlar kesilebiliyor; **K2/K8**: kritik bilgiyi okunabilir sırayla göster.
- Uzun kategori/filtre listesi ve yalnız ₺ sembolleriyle fiyat seviyesi; **K2/K5**: anlaşılır metin etiketi ve filtre geri bildirimi ekle.
- Bunlar kullanıcı testiyle doğrulanacak kullanılabilirlik riskleri; mevcut sitenin bütün filtrelerinin bozuk olduğu iddia edilmiyor.

## Dört ekran, ne yapmalısın?
1. **Yemek ana sayfası** — üstte restoran/yemek araması, anlaşılır mutfak kategorileri, restoran kartları. Kampanya varsa arama eyleminden daha baskın olmasın.
2. **Restoran listesi + filtre** — puan/süre/tür gibi örnek filtreler, aktif filtre chip'i, temizleme, sonuç sayısı, sıfır sonuç mesajı, sıralama.
3. **Restoran detay/menü** — seçilen restoran adı, yemek listesi, açık fiyat, ürün açıklaması, adet/sepete ekleme; başarılı ekleme mesajı.
4. **Yemek sepeti** — seçili ürünler, birim ve satır tutarı, +/- adet, sil, ara toplam, boş sepet mesajı, "/checkout/food" geçişi.

## Figma kuralları
- "03 – Hakan" sayfasında dört ekranı Desktop 1440px ve Mobile 390px tasarla. Tablet 768px kontrolünü yap.
- RestaurantCard, Search/Filter, Button, CartItem ve OrderSummary ortak component instance'ları kullanılmalı.
- Font, renk, padding ve radius için [DESIGN_SYSTEM.md](../DESIGN_SYSTEM.md). Kart sırası: restoran adı → mutfak → puan/teslimat → koşullar → eylem.
- Filtre seçili, hiçbir sonuç yok ve sepet boş durumları ayrıca gösterilmeli.

## Kod/sınırlar
- Başlangıç "/food" route'u src/pages/CatalogPage.tsx içinde örnek katalog olarak mevcut, nihai yemek ekranı değil.
- Yeni yemek UI'ını src/features/food altında düzenleyebilirsin; ortak route ve türleri değiştirmek için ekip koordinasyonu yap.
- Sepet verisi src/state/CartContext.tsx içindeki food anahtarını kullanır; market sepetine karışmaz.
- Backend, gerçek restoran API'si veya kurye takibi ekleme.

## Test/kabul
- Kullanıcı yemek bölümü → restoran filtre → menüden ekleme → yemek sepeti → ortak checkout yapabilir.
- Filtre sonucunun değiştiği görülür (K3); hiçbir sonuç mesajı vardır.
- Sepette yanlış ürünü silebilir/miktar düşürebilir (K6).
- Kartlar okunur, mobilde taşmaz ve klavyeyle kullanılabilir (K2/K8).
- İlgili issue: https://github.com/akincisimge/yemeksepeti-hci-redesign/issues/3
