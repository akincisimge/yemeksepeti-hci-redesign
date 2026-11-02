# Melisa — Ortak sipariş süreci (3 ekran) + kullanılabilirlik testleri

## Mevcut Yemeksepeti'nde gözlenen / düzeltilecek riskler
- "Sepeti Onayla" sonrasında "Unutmuş olabilirsiniz" öneri penceresi açılıyor; "Şimdilik atla" olumlu bir kullanıcı kontrolü (K7). Önerileri siparişe zorunlu adım yapma.
- Adres formunda birden fazla alan, ödeme ekranında radyo seçenekleri ve isteğe bağlı bahşiş bulunuyor (K5/K8).
- "Siparişi Tamamla" butonu görüntüde pasif; **neden pasif olduğu görüntüden kanıtlanamıyor**. K3/K5 kapsamında form hatalarını açık göster.
- Mevcut başarı ekranı gönderilmedi. K4 açısından mevcut sisteme kusur atfetme; bizim demoda açık başarı ekranı tasarla.

## Üç ekran, ne yapmalısın?
1. **Teslimat adresi + sipariş özeti** — örnek isim/adres, zorunlu alanlar, düzeltilebilir hata, seçili ürünler ve ara toplam; adrese geri dönme.
2. **Ödeme simülasyonu** — seçenekler "Teslimatta ödeme (Demo)" ve "Kartla ödeme (Demo)" (kart verisi girilmez), toplam ücret ve son kullanıcı onayı. Bahşiş varsa isteğe bağlı ve başlangıçta 0.
3. **Sipariş onayı** — açık başarı durumu, demo sipariş numarası, hangi hizmetin seçildiği, tutar ve "Gerçek sipariş değildir" mesajı.

## Figma kuralları
- "05 – Melisa" sayfasında üç ekran Desktop 1440px + Mobile 390px; Tablet 768px kontrolü.
- Ortak FormInput, RadioGroup, Button, OrderSummary, Error/Success components; fiyat ve ürün özeti aynı bilgi düzeninde.
- Formun error state'i ve pasif buton nedeni tasarlanır; kullanıcı geri dönüp bilgiyi düzeltebilir.
- Gerçek kişisel veri, gerçek kart numarası, CVV veya ödeme API'si isteme/ekleme.

## Kod/sınırlar
- Başlangıç src/pages/CheckoutPage.tsx, src/pages/SuccessPage.tsx; her servis için "/checkout/food" ve "/checkout/market" aynı checkout'u kullanır.
- Demo sipariş tamamlanınca uygun servis sepeti temizlenir, başarı sayfası görünür.
- Yeni alanlar domain.ts ve CartContext değişikliği gerektiriyorsa diğer geliştiricilerle planla.

## Test ve kabul
- Food ve Market sepetinden checkout tamamlanabilir, diğer servisin sepeti bozulmaz.
- Eksik adres hatası görünür; son toplam sipariş boyunca ekrandadır.
- Başarı ekranı ve demo numarası anlaşılır (K4), kullanıcı geri dönebilir.
- [TEST_PLAN.md](../TEST_PLAN.md) senaryolarıyla görev başarısı/süre/hata sayısı kaydedilir.
- En az 5 gönüllüyle başlangıç testi önerisi; sonuçların genellenmesi iddia edilmez.
- İlgili issue: https://github.com/akincisimge/yemeksepeti-hci-redesign/issues/5
