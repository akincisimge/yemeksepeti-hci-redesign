# Melisa — Ortak sipariş süreci

## Güncel kapsam

9 Kasım 2026: yalnız masaüstü; Yemek ve Market için ortak adres, ödeme ve sipariş sonucu akışı. Mobil tasarım kapsam dışı. Kişisel [Figma dosyası](https://www.figma.com/design/i6MQxPs8Ne0n8KucRnZlXk) kullanılır. Ürün ekranlarına demo/HCI etiketi eklenmez; gerçek sipariş ve ödeme olmadığı sunumda ve proje belgelerinde açıklanır. Bu tercih, önceki görev metnindeki mobil ve ekran içi demo etiketi talebini bu çalışma için günceller.

## Referans ve iddiaların sınırı

- Orijinal site değerlendirmesi ekran kayıtlarına dayanır. Adres, ödeme, sipariş onayı ve kurye durumu kayıtları artık mevcuttur; önceki “başarı ekranı gönderilmedi” notu güncel değildir.
- Orijinal sitede sipariş özeti, düzenleme ve başarı geri bildirimi zaten vardır. Bunların yokluğu iddia edilmez.
- Başlangıç React kodundaki genel form hatası ve geri dönüşte adresin sıfırlanması, orijinal Yemeksepeti hakkında bulgu değildir.
- Yeni düzenin daha anlaşılır olacağı bir hipotezdir; gerçek katılımcı testi henüz yapılmamıştır.

## Uygulama sırası

1. **Tamamlanan ilk bölüm:** `/checkout/food` ve `/checkout/market` için ortak adres ve sipariş özeti. Kayıtlı kurgu adres kısayolu, alan hataları, geri dönüşte bilgi koruma, sepetteki ürün/toplam bilgisi ve minimum tutar açıklaması.
2. **Tamamlanan ikinci bölüm:** Kart alanları ve alan doğrulaması; Yemek için dört yöntem, Market için online kart; bahşiş, kurgu kayıtlı kart kısayolu, işleniyor/iptal/başarısızlık/tekrar deneme durumları. Yalnız dummy verilerle yerel ödeme simülasyonu çalışır.
3. **Tamamlanan üçüncü bölüm:** Onaylı tasarıma göre sipariş sonucu, ürün/ücret/adres/yöntem özeti, yardım bölümü ve dört aşamalı sipariş durumu. Durumlar sunum için 0/12/30/60 saniyede ilerler; canlı kurye, GPS, gerçek ödeme veya restoran bağlantısı kurulmaz.
4. **Hazırlanan teslim belgeleri:** [Sunum rehberi](MELISA_DEMO_GUIDE.md), [katılımcı test protokolü ve boş kayıt tablosu](MELISA_USABILITY_TEST.md). Teknik doğrulama tamamlandı; gerçek katılımcı çalışması henüz yapılmadı. Ana dala birleştirme ekip/Simge koordinasyonundadır.

## Veri ve ortak çalışma

- Yemek ve Market sepetleri ayrıdır. Tamamlanan sipariş yalnız ilgili sepeti temizler.
- Adres taslağı aynı sekmenin `sessionStorage` alanında servis ve bölgeye göre ayrılır; yalnız kurgu test verileri kullanılır. Girilen kart alanları sadece açık formun belleğinde tutulur. Tam kart numarası/CVV saklama alanına yazılmaz; kayıtlı kart kısayolu yalnız son dört haneyi ve yerel başarı/tekrar deneme senaryosunun kimliğini saklar. İki kurgu numarayla sınırlama kaldırıldı; biçimi doğru örnek bilgilerle akış ilerler.
- Kötekli için hazır Ev adresi kurgudur; başka bölgeye sessizce taşınmaz.
- `CartContext` ve `DeliveryContext` değiştirilmedi. `domain.ts` içindeki `PaymentMethod` mevcut değerleri koruyarak `door-card-demo` ve `meal-card-demo` ile genişletildi; ortak yöntem etiketleri eklendi. Bu ortak sözleşme değişikliği PR açıklamasında belirtilir.
- Ortak `Layout.tsx` değişikliği checkout ve `/success` görünümüyle sınırlıdır; PR açıklamasında ve uygulama raporunda belirtilir. Sonuç ekranı, kayıtlı siparişin adresini güncel alışveriş konumundan bağımsız gösterir.
- Sipariş modeli, tamamlanma anındaki ürün/adet/fiyat, adres/not, bölge, teslimat ücreti, bahşiş ve yöntemin bağımsız kopyasını saklar. Sonradan sepet/konum değişimi tamamlanan siparişi değiştirmez. Aynı sekmede yalnız son sipariş tutulur; çoklu sipariş geçmişi yapılmadı.

## HCI ve doğrulama

Dersin kullandığı Shneiderman sürümünde K2 **deneyimli kullanıcıya kısayol** anlamındadır. Klavye ve kontrast ayrıca kontrol edilir. [Uygulama raporu](MELISA_CHECKOUT_IMPLEMENTATION.md) tamamlanan davranışları, teknik kontrolleri ve Figma farklarını kaydeder. Bu dalda derleme ve **49/49 otomatik test** geçti; iki servis masaüstünde uçtan uca kontrol edildi. [TEST_PLAN.md](../TEST_PLAN.md) gerçek katılımcı çalışması içindir; otomatik testler kullanılabilirlik testi sonucu sayılmaz.

İlgili görev: [Issue #5](https://github.com/akincisimge/yemeksepeti-hci-redesign/issues/5).
