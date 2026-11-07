# MARKET alışveriş deneyimi

## Amaç
Mock verilerle ürün bulma, filtreleme ve sepet kontrolünü kolaylaştırmak. Gerçek fiyat/stok entegrasyonu veya gerçek sipariş gönderimi kapsam dışıdır. Mevcut mağazalar ve ürün bağlantıları korunur; her mağazaya filtrelerin denenebileceği örnek ürünler eklenir. Kurgusal marka ve beslenme etiketleri gerçek ürün beyanı değildir.

## Akış
Konum → MARKET → mağaza → kategori/arama/filtre → ürün → görünür sepet → ortak demo checkout.

- Market ana sayfası: konum, konumu değiştirme, uygun marketler, ücret/minimum sepet bilgisi.
- Ürünler: kategori sayıları, Türkçe karakter toleranslı çok kelimeli arama, marka, maksimum fiyat, paket miktarı, kategoriye bağlı beslenme tercihi, ölçü birimi filtresi.
- Sıralama: paket fiyatı artan/azalan, ürün adı; ortak birim seçilince birim fiyat artan. Litre/kg/adet fiyatları aynı sıralamada karıştırılmaz.
- Filtreler URL içinde tutulur; ürün detayından dönüşte arama/filtreler korunur ve filtreli bağlantı paylaşılabilir.
- Filtreler tek tek kaldırılır veya tümü sıfırlanır. Kategori değişiminde kategoriye bağlı filtreler sıfırlanır. Sonuç sayısı ve boş sonuç açıklaması vardır.
- Masaüstü (1024px+): sağda sticky sepet; boş durum, miktar, silme, teslimat ücreti, genel toplam, minimum sepet uyarısı ve checkout.
- Mobil/tablet: alttaki sepet çubuğu native dialog açar; kapatınca tetikleyiciye odak döner. Native dialog klavye odağını ve Escape davranışını sağlar.
- Ürün detayında gerçek bağlantıyla mağazaya dönüş, gramaj, birim fiyat, geri bildirim ve masaüstü sepeti.
- Ortak üst menüde YEMEK/MARKET ve ayrı sepet adetleri.

## HCI karşılıkları
| İlke | Uygulama |
|---|---|
| Tutarlılık | Ortak brand/button/field/quantity stilleri; aynı sepet durumu |
| Evrensel kullanılabilirlik | Kalıcı alan etiketleri, gerçek bağlantılar, 44px adet düğmeleri, görünür odak |
| Geri bildirim | Sonuç sayısı, sepetteki adet, canlı durum mesajları |
| Tamamlanma | Ortak checkout ve mevcut başarı ekranına bağlantı |
| Hata önleme | Minimum tutar uyarısı; mağaza değişim onayına göre doğru mesaj |
| Geri alma | Adet azaltma, silme, filtre chip kaldırma, filtreleri temizleme |
| Kullanıcı kontrolü | Kendiliğinden checkout'a yönlendirmeyen görünür sepet |
| Hafıza yükü | Ürün, adet, ücret ve toplamı birlikte gösterme |

## Doğrulama
- `npm run build`: TypeScript ve üretim derlemesi.
- Node 22.18+ veya 24+ ile `node --test tests/*.test.mjs`: konum/filtre iş kuralları.
- Geçici JSDOM ortamında React etkileşim kontrolü: arama, fiyat/kategori/birim filtreleri, sıfırlama, ekleme/adet/silme/toplam senkronizasyonu, boş sonuç, mağaza değişimini iptal, mobil dialog aç/kapat.
- JSDOM görsel tarayıcı testi değildir; native dialog odağı ve responsive yerleşim gerçek tarayıcıda ayrıca doğrulanmalıdır.

## Ekip tarafından tarayıcıda kontrol edilecekler
- [ ] 390px, 768px, 1440px: yatay taşma, sepet/ürünlerin örtüşmesi ve sticky header.
- [ ] Tab/Shift+Tab/Enter/Escape: filtreler, ürün detayları, mobil sepet ve odak dönüşü.
- [ ] Ekran okuyucu: arama sonucu, ürün ekleme mesajı, alan etiketleri.
- [ ] Renk kontrastı ve görsel/marka varlıklarının teslim öncesi kontrolü.
- [ ] Figma ekranları ve Design System belgesiyle ekip incelemesi.

## Kullanılabilirlik görevleri
En az 5 gönüllüye aynı görevleri verin; süreyi, tamamlanmayı ve yanlış tıklamaları kaydedin. Ölçülmeden iyileşme iddiasında bulunmayın.
1. Bir markette 1 L laktozsuz süt bul.
2. Litre başına fiyatı en düşük sütü seç; paket fiyatı ile birim fiyat arasındaki farkı açıkla.
3. Bütçeyi 50 TL ile sınırla; ardından yalnız bütçe filtresini kaldır.
4. Sepete iki farklı ürün ekle, miktarı artır ve bir ürünü sil.
5. Minimum sepet tutarına ulaşıp demo checkout'a ilerle; teslimat dahil toplamı kontrol et.
