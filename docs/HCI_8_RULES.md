# Hocanın 8 HCI ilkesi — uygulanabilir tasarım kuralları

Metodoloji: Shneiderman'ın 8 Golden Rules. Kanıt kaynağı: 02.11.2026'da Simge'nin gönderdiği 13 masaüstü ekran görüntüsü (Restoran, Gel Al, Y-Market, Marketler, sepet, adres, ödeme). Görüntü temelli ön incelemedir, kullanıcı testi değildir. “İhlal” ifadesi yerine kanıtlanmadığında “potansiyel kullanılabilirlik riski” kullanılır.

## 1. Strive for Consistency — Tutarlılık
**Gözlem:** Üstte Restoran/Gel Al/Y-Market/Marketler hizmetleri var; aynı market hizmetine giriş yolu iki ayrı akışta farklı (doğrudan ürün vs mağaza listesi). Checkout kartları ve sepetleri ayrı görsel bağlamlarda sunuluyor.
**Risk:** Kullanıcı Marketler ile Y-Market farkını öğrenmek zorunda kalabilir.
**Kural:** Aynı anlama gelen eylemler aynı renk, metin, etiket, yerleşim ve davranışı kullanır. İki ana hizmet kartı; MARKET altında iki açık alt seçenek. Sepete ekle, miktar değiştir, geri dön ve ücret özetleri tutarlı.
**Sorumlu:** Simge (giriş), Beyda (market); Hakan/Melisa ortak bileşenleri izler.
**Test:** Market ve Y-Market seçenekleri ilk bakışta açıklanabiliyor mu?

## 2. Seek Universal Usability — Evrensel kullanılabilirlik
**Gözlem:** Kartlarda küçük ve kesilebilen açıklamalar, yoğun fiyat/indirim etiketleri ve ₺ işaretleriyle fiyat seviyesi bulunuyor.
**Risk:** Yeni kullanıcılar, düşük görme veya klavye kullananlar bilgiyi güçlükle okuyabilir. Statik görüntü WCAG uyumunu kanıtlamaz.
**Kural:** Normal metinde hedef en az 4.5:1 kontrast; görünür klavye odağı; gerçek label; ikonun yanında metin; kısa ama anlamlı buton adları; bilgi yalnız renkle verilmez; mobilde yatay taşma olmaz.
**Sorumlu:** Tüm ekip; Simge ortak kontrol listesi.
**Test:** Klavyeyle başlangıçtan checkout'a kadar yol; 200% zoom; kontrast aracı.

## 3. Offer Informative Feedback — Bilgilendirici geri bildirim
**Gözlem:** Sepet miktarları ve fiyatlar görünür; ödeme son butonunun pasif olduğu bir durum görülüyor ama nedeninin açıklanıp açıklanmadığı bilinmiyor.
**Risk:** Kullanıcı işlemin neden ilerlemediğini anlamayabilir.
**Kural:** Sepete ekle / sil / filtre / ödeme denemesi sonrası görünür metin; boş sonuç ve hata durumları; form hataları hatalı alanla bağlantılı açıklanır; devam edememe nedeni açıkça gösterilir.
**Sorumlu:** Hakan + Beyda (ürün/sepet); Melisa (form/checkout).
**Test:** Yanlış adres girince kullanıcı neyi düzeltmesi gerektiğini söyleyebiliyor mu?

## 4. Design Dialogs to Yield Closure — Tamamlanma hissi
**Gözlem:** Siparişi tamamlama öncesi adımlar var, gerçek başarı ekranı gönderilmedi.
**Risk:** Siparişin alınıp alınmadığı belirsiz kalabilir; mevcut sitenin gerçek başarı ekranı hakkında iddia yok.
**Kural:** Demo işlem sonunda ayrı başarı ekranı, sahte sipariş numarası, toplam ve “gerçek sipariş değil” açıklaması; geri dönüş eylemi.
**Sorumlu:** Melisa.
**Test:** İşlemden sonra kullanıcı siparişin demo olarak tamamlandığını söyleyebiliyor mu?

## 5. Prevent Errors — Hataları önleme
**Gözlem:** Adres ekranında birden fazla alan ve ödeme seçenekleri var; bazı devam butonları pasif.
**Risk:** Zorunlu alanlar ve pasif buton açıklamaları belirsizse yanlış girişler artabilir.
**Kural:** Adres girişinde açık etiket/zorunlu alan; doğrulama mesajı; boş sepet checkout'u engellenir; demo ödeme gerçek kart bilgisi istemez; farklı mağaza ürününe geçiş için sepet temizleme onayı.
**Sorumlu:** Melisa (adres/ödeme), Beyda/Hakan (sepet).
**Test:** Eksik alanla gönderim yap; hatanın anlaşılır ve düzeltilebilir olduğunu kontrol et.

## 6. Permit Easy Reversal of Actions — Kolay geri alma
**Gözlem:** Mevcut sepet ürün miktarını azaltma ve silme işlevlerini sunuyor; bunu korumalıyız.
**Kural:** Miktarı artır/azalt; ürünü kaldır; önceki sayfaya dönebil; seçim yanlışsa hizmet değiştir. Geri dönüş mümkün olmayan eylemlere onay veya açık açıklama ekle.
**Sorumlu:** Hakan ve Beyda (sepet), Melisa (geri dönüş).
**Test:** Yanlış eklenen ürünü 1–2 işlemde kaldır.

## 7. Support Internal Locus of Control — Kullanıcı kontrolü
**Gözlem:** Sepet onayından sonra “Unutmuş olabilirsiniz” öneri penceresi açılıyor, “Şimdilik atla” mevcut.
**Risk:** İsteğe bağlı öneriler sipariş akışına fazladan adım ekleyebilir. Atlama seçeneği olumlu.
**Kural:** Promosyon/çapraz satış zorunlu aşama olmamalı; kullanıcı istediğinde atlayabilmeli. YEMEK ↔ MARKET geçişi belirgin; siparişte son karar kullanıcıda.
**Sorumlu:** Simge (hizmet geçişi), Melisa (checkout).
**Test:** Önerileri kullanmadan checkout'a geçiş mümkün mü?

## 8. Reduce Short-Term Memory Load — Kısa süreli bellek yükünü azaltma
**Gözlem:** Ürün/kartlarda çeşitli fiyat ve bilgi rozetleri var. Checkout özetinde ürünler ve toplamın gösterilmesi olumlu.
**Risk:** Kırpılmış bilgi ve karmaşık etiketler zihinsel karşılaştırmayı zorlaştırabilir.
**Kural:** Her kartta adı/fiyatı/teslimat bilgisini aynı sırada göster; uzun bilgilerin detayına erişim ver; aktif filtreleri görünür tut; checkout'ta ürün listesi ve toplam tutar kaybolmaz.
**Sorumlu:** Hakan, Beyda, Melisa.
**Test:** Kullanıcı siparişin toplamını ve seçtiği mağazayı hafızadan değil, ekrandan okuyabiliyor mu?

## Minimum kabul kontrolü
- Ekranlar arasında ortak tasarım token'ları ve aynı etkileşim terimleri.
- En az bir görünür hata, boş durum ve başarı durumu.
- Klavye Tab/Enter/Shift+Tab ile temel akış.
- Ücretler, ürün sayısı ve sipariş özeti açık.
- Her geliştirme PR'ında “mevcut sorun → HCI kuralı → çözüm → test” yazılır.

Kaynak: https://www.cs.umd.edu/~ben/goldenrules.html ve https://www.w3.org/TR/WCAG22/
