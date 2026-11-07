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
- Chromium ile gerçek tarayıcı testleri tamamlandı: 390/768/1440px yatay taşma ve sütun sayıları, maksimum içerik genişliği, filtre/sepet modalı, odak döngüsü ve ESC/odak dönüşü.
- axe-core ile WCAG etiketli otomatik tarama: üç katalog boyutu, mobil sepet, ana sayfa, market seçimi, yemek kataloğu, ürün detayı, market sepeti ve checkout için ihlal bulunmadı. Bu sonuç manuel ekran okuyucu denemesinin yerine geçmez.

## Ekip tarafından tarayıcıda kontrol edilecekler
- [x] 390px, 768px, 1440px: yatay taşma, sepet/ürünlerin örtüşmesi ve sticky header.
- [x] Tab/Shift+Tab/Enter/Escape: filtreler, ürün detayları, mobil sepet ve odak dönüşü.
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


## Responsive, erişilebilirlik, geri alma ve arama güncellemesi
- Mobil sepet 390px'de ekranı kaplar; tablet için alt paneldir. Ortak native dialog; arka plan etkileşimi kapalıdır, fiziksel DOM üzerinden odak döngüsü portalla taşınan toast düğmelerini de kapsar.
- Tablet/mobil filtreleri “Filtrele” ile açılır, masaüstünde sol paneldir. Grid mobilde 2, tablette 3, dar masaüstünde 2, geniş masaüstünde 3 sütundur. Ürün adı/açıklaması iki satırla sınırlanır; tam ad erişilebilir bağlantıda ve detay sayfasında bulunur.
- Konteyner max-w-7xl; ortak primary odak halkası, ikon düğmelerinde erişilebilir adlar ve sepet adedinde polite canlı bildirim vardır.
- Silinen ürünler görünür sepetten hemen kalkar, ürün/adet/konum bilgisi geçici bellekte saklanır. Peş peşe silmeler tek geri alma grubunda korunur. 5 saniyelik toast fare veya odak üzerindeyken kalan süresini duraklatır. Süresi bitince yalnız geri alma imkânı kapanır.
- Geri alma başka eklemeleri ezmez; kaldırılan adedi ekler, özgün sırayı mümkün olduğunca geri getirir. Mağaza değişimi, konum değişimi ve sipariş tamamlama eski ürünlerin uygunsuz biçimde geri getirilmesini engeller.
- Yazım önerisi yalnız sonuç yoksa görünür; bütçe/kategori/marka gibi filtrelere uyar. Kullanıcı öneriyi seçmeden sorgu değiştirilmez. Örnek: “çklata” → “Sütlü Çikolata”. Örnek çikolata ürünleriyle katalog 631 ürüne genişletildi.

### Tekrarlanabilir testler
İş kuralları: `node --test tests/*.test.mjs` (20 test), derleme: `npm run build`.

Gerçek tarayıcı kontrolü isteğe bağlı geliştirme araçları ister. Çalışma bağımlılıkları değiştirilmeden yerel test ortamına kurulum:

```bash
npm install --no-save --package-lock=false playwright axe-core
npx playwright install chromium
node tests/browser/hci-responsive.cjs
```

Kurulu farklı Chromium kullanılacaksa `HCI_CHROMIUM_EXECUTABLE` ortam değişkeni verilebilir. Test geçici klasöre ekran görüntüleri üretir; uygulamayı 5175 portunda kendi başlatıp kapatır. Normal kullanıcı akışına gerçek kişisel veya ödeme verisi eklenmez.


## Yeni konum paneli ve geniş katalog
- Panelde mevcut cihaz konumunu kullanma ve başka adrese manuel gönderme ayrı, açık eylemlerdir. İzin ve servis hataları manuel seçimle telafi edilir.
- Aranabilir il/ilçe alanları 81 il / 973 ilçe içerir. Mahalle serbestçe yazılır. Seçim önizlenir ve “Bu adrese getir” ile onaylanır.
- GPS işlemi sürerken manuel seçime geçilirse geç gelen GPS yanıtı formu ezmez. Ham koordinatlar tarayıcı depolamasına yazılmaz.
- Ürün sayısı 631, kategori sayısı 12; mağaza başına en az 200 örnek ürün. Tüm kataloğu tek sayfada yüklemek yerine 24 ürünlük sayfalama uygulanır. Filtre değişince ilk sayfa, detaydan dönüşte önceki filtre/sayfa gösterilir.
- `node --test tests/*.test.mjs`: 29 test. `tests/browser/location-catalog.cjs`: manuel/GPS/izin reddi/servis hatası/geç yanıt/yenileme/sayfalama ve 390/768/1440px axe kontrolleri.
- GPS tarayıcı testi cihaz koordinatını taklit eder ve sağlayıcı yanıtını yakalayarak döndürür. Gerçek kullanıcı koordinatları test amacıyla servise gönderilmez. Canlı sağlayıcının her cihazda adres kesinliği garanti edilmez.
- Kaynak ve lisans ayrıntıları: docs/DATA_SOURCES.md.
