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
2. **Sonraki bölüm:** Figma'daki kart alanları, isteğe bağlı tercihler, işleniyor/başarısızlık/tekrar deneme durumları; yalnız dummy verilerle ödeme simülasyonu. Mevcut basit ödeme seçimi şimdilik geçiş olarak korunur.
3. **Sonraki bölüm:** Yeni sipariş onayı ve durum ekranları. Canlı kurye, GPS, gerçek ödeme veya restoran bağlantısı kurulmaz. `SuccessPage.tsx` bu ilk bölümde yeniden tasarlanmadı.

## Veri ve ortak çalışma

- Yemek ve Market sepetleri ayrıdır. Tamamlanan sipariş yalnız ilgili sepeti temizler.
- Adres taslağı aynı sekmenin `sessionStorage` alanında servis ve bölgeye göre ayrılır; yalnız kurgu test verileri kullanılır. Kart numarası/CVV saklanmaz.
- Kötekli için hazır Ev adresi kurgudur; başka bölgeye sessizce taşınmaz.
- `CartContext`, `DeliveryContext` ve `domain.ts` sözleşmeleri değiştirilmez.
- Ortak `Layout.tsx` değişikliği checkout görünümüyle sınırlıdır; PR açıklamasında ve uygulama raporunda belirtilir.

## HCI ve doğrulama

Dersin kullandığı Shneiderman sürümünde K2 **deneyimli kullanıcıya kısayol** anlamındadır. Klavye ve kontrast ayrıca kontrol edilir. [Uygulama raporu](MELISA_CHECKOUT_IMPLEMENTATION.md) tamamlanan davranışları, teknik kontrolleri ve Figma farklarını kaydeder. [TEST_PLAN.md](../TEST_PLAN.md) gerçek katılımcı çalışması içindir; otomatik testler kullanılabilirlik testi sonucu sayılmaz.

İlgili görev: [Issue #5](https://github.com/akincisimge/yemeksepeti-hci-redesign/issues/5).
