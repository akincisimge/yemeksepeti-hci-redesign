# Yemeksepeti HCI — Figma + React Design System v1.0

**Durum: Ekip onayı bekleyen ortak tasarım standardı.** UX koordinasyonu: Simge. Güncelleme: 02.11.2026.
Bu belge Figma tasarımları ve React arayüzü için tek referans olarak önerilir. Hocanın Shneiderman 8 Golden Rules çerçevesi uygulanır. Mevcut siteden türetilen sorunlar kullanıcı testi yapılana kadar hipotezdir.

## 1. Değişmez ilkeler
- Aynı işlev için aynı buton, renk, ikon ve terim; hizmetler arası tutarlı gezinme (K1).
- Metinler okunur, klavyeyle erişilebilir ve yalnız renkle bilgi verilmez (K2).
- Sepete ekleme, filtre, adres ve ödeme işlemleri görünür geri bildirim verir (K3).
- İşlemin sonunda açık başarı/onay durumu bulunur (K4).
- Eksik alan, boş sepet, farklı mağazaya geçiş hataları önlenir (K5).
- Ürün miktarı, silme ve geri dönme işlemleri kolaydır (K6).
- Kampanya ve ürün önerileri zorunlu adım olmaz (K7).
- Sepet, aktif filtreler, ücretler ve toplam kullanıcıya görünür kalır (K8).
- Yemek ve Market sepetleri ayrıdır; aynı checkout bileşeninde tamamlanır.

## 2. Renk standartları
| Figma değişken adı | HEX | Amaç |
|---|---|---|
| color/brand/primary | #D90049 | Ana buton, aktif seçim, bağlantı |
| color/brand/hover | #B6003C | Primary hover |
| color/text/primary | #0F172A | Başlık ve ana metin |
| color/text/secondary | #475569 | Yardımcı metin |
| color/surface/page | #F8FAFC | Sayfa arka planı |
| color/surface/card | #FFFFFF | Kart ve form arka planı |
| color/border/default | #CBD5E1 | Input ve kart sınırı |
| color/state/success | #166534 | Başarı mesajı |
| color/state/error | #991B1B | Hata mesajı |
| color/state/warning | #92400E | Uyarı metni |
| color/surface/brand-soft | #FFF1F6 | Hafif pembe vurgu |

Kurallar: Yeni pembe tonu, rastgele gradyan veya başka başarı/hata rengi seçme. Primary butonda beyaz metin kullan. Durumu yalnız kırmızı/yeşil ile anlatma; ikon ve metin ekle.

**Ölçülmüş kontrast örneği:** #D90049 üzerinde beyaz metin yaklaşık 5.19:1; normal metin için WCAG AA hedefi 4.5:1'i geçer. Ancak #D90049 metin / #FCE7F3 zemin yaklaşık 4.41:1 olduğundan normal metin için uygun değildir. Her yeni renk çifti ayrıca kontrol edilir.

## 3. Font ve tipografi
- Font: Inter; React tarafında henüz webfont paketi kurulmadığından sistem sans-serif yedeği kullanılabilir. Tam eşleşme için font yüklemesi ayrıca planlanır.
- Ağırlık: 400 Regular, 500 Medium, 600 Semibold, 700 Bold.
- H1: masaüstü 40px / 48px line-height; mobil 32px / 40px; Bold.
- H2: masaüstü 28px / 36px; mobil 24px / 32px; Bold.
- H3: 20px / 28px; Semibold.
- Body: 16px / 24px; Regular.
- Button ve form label: 16px / 24px; Semibold.
- Yardımcı metin: 14px / 20px; Regular. Kritik fiyat ve hata bilgisi 14px altına düşmez.
- Her sayfada bir H1 ve mantıklı başlık sırası. Ürün/restoran adının kritik kısmını üç noktayla saklama; iki satıra yay veya detay bağlantısı sun.

## 4. Frame, grid, responsive
| Hedef | Figma Frame | İçerik | Grid | Yerleşim |
|---|---|---|---|---|
| Desktop | 1440px | max 1152px, ortalanmış | 12 sütun, gutter 24px | Girişte iki hizmet kartı yan yana |
| Tablet | 768px | yanlarda 32px | 8 sütun, gutter 16px | Kartlar çoğunlukla iki sütun |
| Mobile | 390px | yanlarda 16px | 4 sütun, gutter 12px | Tek kolon; CTA tam genişlik |

Başlangıç breakpoint: mobil 767px ve altı; tablet 768–1023px; desktop 1024px ve üstü. Gerçek tarayıcıda taşma görülürse esnek düzen uyarlanır.

Spacing token'ları: 4, 8, 12, 16, 24, 32, 48, 64px. Kart padding desktop 24px, mobile 16px. Büyük bölüm araları 32–48px. Rastgele boşluklar kullanılmaz.

Corner radius: buton ve input 12px; normal kart 16px; girişteki YEMEK/MARKET kartı 24px; küçük badge 8px. Görsel oranları: restoran 16:9, ürün 1:1.

**Figma Auto Layout:** Button, Search, Filter, Header, Card, CartItem, OrderSummary ve Form bileşenlerinde zorunlu; Mac kısayolu Shift+A. Metne göre Hug contents, mevcut alana göre Fill container kullan. Sabit konum ve gereksiz sabit yükseklik responsive tasarımı bozmamalı.

## 5. Zorunlu ortak bileşenler ve durumları

### Header
- Aynı logo, aktif YEMEK/MARKET göstergesi ve sepet adedi tüm sayfalarda.
- Desktop hedef minimum 72px; mobil minimum 64px; mobilde taşma olmayacak.
- Üst menü ile diğer hizmete geçiş ve ana sayfaya dönüş mümkün (K1/K7).

### Button
- Variants: Primary / Secondary / Destructive.
- States: Default / Hover / Focus / Disabled / Loading.
- Min yükseklik 44px; yatay padding normal 20px, büyük 24px; radius 12px.
- Eylem yazısı açık: Sepete ekle, Ürünleri görüntüle, Demo siparişi tamamla.
- Disabled butonun yakınında devam edememe nedeni açıklanmalı.
- Sadece ikon bulunan düğmenin erişilebilir adı olmalı.

### Form Input / Radio / Select
- Tek satır input minimum 48px yükseklik; textarea içerikle büyür.
- States: Default / Focus / Filled / Error / Disabled.
- Kalıcı label, gerekli alan göstergesi ve alanın yanında metinsel hata.
- Placeholder label yerine geçmez; ödeme radio seçenekleri grup başlığıyla verilir.
- Gerçek kart, CVV, adres/telefon gibi kişisel veri girilmesi istenmez; sahte demo örnekleri.

### Search / Filter
- Arama alanı, seçili filtre chip'i ve Filtreleri temizle görünür.
- Kaç sonuç bulunduğu metinle bildirilecek. Sonuç sıfırsa açıklama ve alternatif öneri verilecek.

### Restaurant Card
- Sıralama: görsel → restoran adı → mutfak türü → demo puan/teslimat → varsa ücret/koşullar → inceleme eylemi.
- Kritik teslimat veya ücret bilgisi kırpılmaz. Kampanya kartın ana bilgisini gölgelemez. Gerçek süre/puan uydurulmaz.

### Product Card
- Sıralama: görsel → ürün adı → birim/miktar → fiyat/indirim → Sepete ekle.
- İndirim varsa güncel/eski fiyat ayrımı okunur. Mock fiyatlar gerçek fiyat diye sunulmaz.

### CartItem / OrderSummary
- Ürün adı, birim fiyat, adet azalt/artır, satır tutarı ve sil.
- Ara toplam, teslimat/poşet (varsa), indirim ve genel toplam etiketleri açık.
- Servisler ayrı sepet taşır; ortak CartItem tasarımı kullanır. Farklı mağazaya geçişte onay gerekir.
- Sepet boşsa mesaj ve ürünlere dönüş bağlantısı sunulur.

### Modal / Toast / Status
- Modal yalnız kritik işlem onayında; örn. mağaza değiştirirken sepet temizleme.
- İptal ve onay görünür; modal açıldığında focus yönetimi yapılır.
- Sepete eklendi, ürün silindi, form geçersiz, ödeme demo tamamlandı gibi metinler bulunur.
- Kritik hata yalnız geçici toast ile bildirilmez; ilgili alanın yanında kalıcı uyarı.

### Checkout / Success
- Adres ve sipariş özeti → ödeme yöntemi (demo) → işlem sonucu.
- Aynı checkout her iki hizmet için kullanılır; toplam ve ürün özeti kaybolmaz.
- Başarı ekranında demo sipariş numarası, tutar, gerçek işlem yapılmadı notu ve ana sayfaya dönüş olur (K4).

### Icon / Image
- Figma ve kodda tek görsel ikon dili (öneri Lucide, 20/24px).
- İkonun yanında açıklama metni; yalnız ikonla karmaşık yönlendirme yapılmaz.
- Gerçek kullanıcılara ait ekran görüntüleri, adresler, telefonlar ve ödeme bilgilerinin paylaşılması yasaktır; örnek/lisansı uygun varlıklar kullanılır.

## 6. Figma dosyası sayfa düzeni
Tüm ekip **tek ortak Figma dosyasında** çalışır:
- 00 Foundations — Colors, Typography, Grid, Spacing, Radius, Icons.
- 01 Components — master Button, Input, Search, FilterChip, Header, RestaurantCard, ProductCard, CartItem, OrderSummary, Modal, Toast.
- 02 Simge — YEMEK/MARKET giriş (desktop+mobile).
- 03 Hakan — Yemek ana sayfası, restoran listeleme, restoran detay/menü, yemek sepeti.
- 04 Beyda — Market ana sayfası, mağaza/ürün liste, ürün detay, market sepeti.
- 05 Melisa — Adres/özet, demo ödeme, sipariş onayı.
- 06 Prototype — bağlı kullanıcı akışları.
- 07 Research & Tests — UX bulguları ve test sonuçları.

Frame adı biçimi: Sahip / Ekran / Desktop|Tablet|Mobile / State.
Örnek: Hakan / RestaurantList / Desktop / Empty.
Master component bir kez oluşturulur; ekranlarda component instance kullanılır.

## 7. Sekiz HCI ilkesi ile görev eşleştirmesi
| Kural | Tasarımdaki karşılığı | Öncelikli sorumlu |
|---|---|---|
| K1 Tutarlılık | Ortak nav, kart, sepet, ödeme etiketleri | Simge + herkes |
| K2 Evrensel kullanılabilirlik | Kontrast, font, klavye, açıklamalı ikonlar | Herkes |
| K3 Bilgilendirici geri bildirim | Filtre, sepete ekle, form uyarıları | Hakan, Beyda, Melisa |
| K4 Tamamlanma hissi | Demo sipariş onay ekranı | Melisa |
| K5 Hata önleme | Form validation, boş sepet, mağaza değiştirme onayı | Beyda, Melisa |
| K6 Kolay geri alma | Sil, miktar değiştir, geri dön | Hakan, Beyda, Melisa |
| K7 Kullanıcı kontrolü | YEMEK/MARKET seçimi, öneri atlama | Simge, Melisa |
| K8 Hafıza yükünü azaltma | Seçili filtre, ürün ve toplam görünürlüğü | Herkes |

Detaylı gözlemler: docs/HCI_8_RULES.md ve docs/UX_AUDIT.md.

## 8. Teslim kontrol listesi
- [ ] 1440px, 768px ve 390px ekranlar kontrol edildi; yatay taşma yok.
- [ ] Ortak Figma Color Styles/Text Styles ve main component instance kullanıldı.
- [ ] Auto Layout uygulandı; içerik değişince tasarım bozulmuyor.
- [ ] Default/Hover/Focus/Disabled ve gereken Empty/Error/Success durumları var.
- [ ] Normal metin kontrastı WCAG 2.2 AA hedefi 4.5:1, büyük metin 3:1; istisnalar dikkate alınıyor.
- [ ] Klavye ile Tab/Shift+Tab/Enter çalışıyor, odak görünür.
- [ ] Hangi HCI kuralının hangi soruna çözüm getirdiği PR açıklamasında yazıyor.
- [ ] Kullanıcı arayüzü demo olduğunun farkında; gerçek kişisel/ödeme verisi yok.
- [ ] Figma tasarımı ve React ekranı arasındaki farklar kontrol edildi.
- [ ] npm run build geçti, PR bir ekip arkadaşı tarafından incelendi.

## 9. Karar, onay ve değişiklik yönetimi
- Bu belge ekip tarafından onaylanana kadar **v1.0 öneri** statüsünde.
- Renk, font, ortak component veya spacing değişirse GitHub PR ile bu dosya, Figma master ve React kodu birlikte güncellenir.
- Mevcut React başlangıç uygulaması ile bu Figma hedeflerinin tamamı henüz birebir karşılaştırılmadı; tasarım/kod eşleştirme ayrı iş.
- 44px buton yüksekliği proje tercihidir. WCAG 2.2 AA minimum pointer target kuralı 2.5.8, istisnaları olan 24×24 CSS px gereksinimi olarak ayrıca değerlendirilir.
- Tek tasarım sistemi için ücretsiz Figma kullanılıyorsa component'lar aynı dosyada tutulur; ayrı dosyalarda yayımlanmış library varsayılmaz.

## Kaynaklar
- Shneiderman: https://www.cs.umd.edu/~ben/goldenrules.html
- W3C WCAG 2.2: https://www.w3.org/TR/WCAG22/
- Figma Auto Layout: https://help.figma.com/hc/en-us/articles/360040451373-Guide-to-auto-layout-in-Figma
