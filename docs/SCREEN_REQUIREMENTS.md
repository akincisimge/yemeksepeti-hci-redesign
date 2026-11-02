# Ekranlar, sorumlular ve kabul kriterleri

## 12 ana ekran hedefi
Not: İlk kod iskeleti bu on iki ekranın tamamını ayrı route olarak içermez; kapsam ekipçe netleşince ekranlar sorumluları tarafından açılacaktır. Sepet ve checkout ortak bileşenleri tekrar kullanılmalıdır.

| No | Sahip | Ekran | En az olması gerekenler |
|---|---|---|---|
| 01 | Simge | YEMEK / MARKET giriş | Eş ağırlıklı iki kart, net açıklama, yönlendirme, klavye odağı |
| 02 | Hakan | Yemek ana sayfası | Restoran keşfi, arama, düzenli kategori alanı |
| 03 | Hakan | Restoran listesi/filtre | Filtre, seçili etiket, sıfır sonuç, sıralama |
| 04 | Hakan | Restoran detay/menü | Menü, fiyat, içerik, sepete ekle, feedback |
| 05 | Hakan | Yemek sepeti | Miktar/sil, toplam, geri dön, checkout |
| 06 | Beyda | Market ana sayfası | Y-Market / Diğer Marketler seçimi |
| 07 | Beyda | Mağaza/kategori/ürün listesi | Mağaza seçimi, arama, filtre |
| 08 | Beyda | Ürün detay | Ölçü/birim, fiyat, indirim, adet, sepete ekle |
| 09 | Beyda | Market sepeti | Miktar, sil, mağaza kuralı, ücretler, checkout |
| 10 | Melisa | Adres + sipariş özeti | Etiketli alanlar, düzeltilebilir hata, özet |
| 11 | Melisa | Ödeme simülasyonu | Demo yöntemleri, son toplam, gerçek kart verisi yok |
| 12 | Melisa | Sipariş sonucu | Başarı bildirimi, demo sipariş ID'si, geri dönüş |

## Sahiplere özel dikkat noktaları

### Simge — UX araştırması + giriş deneyimi
Kanıt: dört farklı hizmet etiketi (Restoran, Gel Al, Y-Market, Marketler).
HCI: K1 tutarlılık, K7 kullanıcı kontrolü, K8 hafıza yükünü azaltma.
Çözüm: İki net ana yol; market alt farkını silmeden Beyda'ya devret. Hipotezi kullanıcı testiyle doğrula.
Teslim: docs/UX_AUDIT.md, Figma 02 sayfası, HomePage ve HCI review checklist.

### Hakan — yemek deneyimi
Kanıt: kampanya/QR alanları; yoğun restoran kartları, filtreler ve fiyat sembolleri.
HCI: K2 erişilebilirlik, K3 geri bildirim, K6 kolay geri alma, K8 bilgiyi hafızada tutmama.
Çözüm: Arama ve filtreler görünür; restoran/menü farkı açık; kartlarda doğru bilgi hiyerarşisi; sepette miktar/sil; boş sonuç.
Teslim: Figma 03 ve food route'ları.

### Beyda — market deneyimi
Kanıt: Y-Market doğrudan ürün, Marketler önce mağaza; kartlarda yoğun etiketler; sepet ve ücretler.
HCI: K1 tutarlılık, K3 geri bildirim, K5 hata önleme, K6 geri alma, K8 kısa süreli bellek.
Çözüm: İki alt giriş; mağaza değişince sepet uyarısı; ürün/kategori araması; açık indirim/birim; miktar/sil.
Teslim: Figma 04 ve market route'ları.

### Melisa — checkout ve kullanılabilirlik testi
Kanıt: sepet sonrası “Unutmuş olabilirsiniz” penceresi; adres formu; ödeme seçenekleri; pasif final butonu.
HCI: K3 geri bildirim, K4 closure, K5 hata önleme, K7 kontrol, K8 sipariş özetini koruma.
Çözüm: Ek satış zorunlu değil; alan etiketleri; eksik bilgi açıklaması; demo ödeme; sipariş onayı.
Teslim: Figma 05, ortak checkout ve docs/TEST_PLAN.md.

## Ortak teknik sözleşme
- Veri türleri: src/types/domain.ts (Product, Store, Service, CartLine, Carts).
- İki servis: food ve market.
- Sepetler ayrı, her servis sepetinde en fazla bir aktif mağaza.
- Checkout aynı bileşeni kullanır: /checkout/food ve /checkout/market.
- Fiyat verileri sayısal TL, ekranda Intl.NumberFormat('tr-TR') ile gösterilir.
- mock data: src/data/catalog.ts. Kişisel bilgi/gerçek kart girdisi gönderilmez.
- Ortak layout, header ve token'lar ortak inceleme sonrası değiştirilir.

## Her ekran için teslim kontrolü
1. Tasarımın hangi HCI kuralını nasıl uyguladığı belgelendi.
2. Normal, hover, focus, disabled ve hata/boş durumlar düşünüldü.
3. Ekran 390 px ve 1440 px genişliklerde kontrol edildi.
4. Temel akış klavyeyle mümkün.
5. Diğer ekranlara yönlendirme ve ortak data sözleşmesi bozulmadı.
6. Ekranla birlikte test senaryosu veya manuel doğrulama adımları verildi.
