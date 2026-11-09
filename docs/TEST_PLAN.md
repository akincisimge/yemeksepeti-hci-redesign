# Kullanılabilirlik testi — Melisa koordinasyonu

## Amaç
Ön UX hipotezlerini gerçek kullanıcı görevleriyle sınamak. En az 5 gönüllü katılımcıyla başlangıç testi önerilir; küçük örneklemden genel nüfus hakkında sonuç çıkarılmaz.

## Test yaklaşımı
Karşılaştırma yapılacaksa iki etkileşimli prototipte eşdeğer görevleri ver; sıralamayı katılımcılar arasında dengele. Canlı Yemeksepeti'ne kurgu kart/adres gönderme veya test için gerçek sipariş oluşturma. Mevcut site ekran kaydı yalnız görsel/anlama karşılaştırmasında kullanılabilir; etkileşimli görev süresiyle eşdeğer ölçüm sayılmaz. Projede yalnızca kurgu veriler kullanılmalı.

## Görev senaryoları
- T1: Restorandan yemek sipariş edeceğin bölümü bul.
- T2: Bir restoranı veya ürünü filtrelerle bul.
- T3: Ürün ekle, adedini değiştir, yanlış ürünü sil.
- T4: Marketler ile Yemeksepeti Market arasındaki farkı bul ve ilgili akışa geç.
- T5: Eksik adresle demo siparişini tamamlamaya çalış; sistemin mesajını yorumla.
- T6: Ödemeyi simüle et ve tamamlandığını doğrula.
- T7: Yanlış bölüme geçtikten sonra geri dön.

## Her görev için kayıt tablosu
Katılımcı kodu | Tasarım | Görev kodu | Başarı 0/1 | Süre sn | Hata sayısı | Gözlem / yorum.
Kişisel ad, telefon, gerçek adres ya da ödeme bilgisi kaydetme.

## Analiz
- Görev başarı oranı = başarılı görev / tüm görev.
- Medyan tamamlanma süresi (yalnızca tamamlanan görevler için ayrıca işaretle).
- İlk seçim hatası ve geri dönüş sayısı.
- Soru: “Hangi adımda ne yapacağından emin olamadın?”
- Hata türünü ilgili HCI kuralı ve ekran sahibiyle eşleştir.

## Testte özellikle gözlenecekler
K1 hizmetler tutarlı mı? K2 deneyimli kullanıcı için kayıtlı adres gibi kısayollar işe yarıyor mu? K3 geri bildirim anlaşılıyor mu? K4 işlem sonucu açık mı? K5 yanlış girişi önlüyor mu? K6 silme/geri alma kolay mı? K7 kullanıcı kontrolü sürüyor mu? K8 tutar ve seçili ürünler görünür mü?


## Melisa'nın adres bölümü için ek görevler

Derste kullanılan Shneiderman sürümünde K2 deneyimli kullanıcıya kısayol sağlar. Klavye, görünür odak ve kontrast ayrıca kontrol edilir.

- Kötekli'yi seçip hazır kurgu Ev adresini kullan; bilgiyi yeniden yazman gerekip gerekmediğini anlat.
- Adresin bir zorunlu alanını boş bırak; çıkan mesaj yardımıyla düzelt.
- Teslimat notu yaz, sepete dönüp adedi değiştir ve geri gel; hangi bilgilerin korunduğunu kontrol et.
- Minimum tutarın altındaki Market sepetiyle devam etmeyi dene; devam edememe nedenini ve gereken ek tutarı açıkla.

Bu görevler masaüstünde kurgu verilerle uygulanacaktır. Henüz katılımcı testi yapılmadı. Otomatik/tarayıcı kontrolleri [teknik uygulama raporunda](team/MELISA_CHECKOUT_IMPLEMENTATION.md) ayrı tutulur.

## Melisa'nın ödeme bölümü için ek görevler

- Verilen kurgu kartla devam et; CVV eksik olduğunda düğmenin neden pasif olduğunu açıklayıp alanı düzelt.
- 50 TL bahşiş seç, toplamı söyle, ardından bahşişten vazgeç ve yeni toplamı kontrol et.
- Başarısız ödeme sonrasında hangi bilgilerin korunduğunu anlat; aynı bilgilerle tekrar dene.
- Yemek siparişinde teslimatta nakit ödemeyi seç; hangi alanların değiştiğini anlat. Market akışında sunulan yöntemi kontrol et.
- İşlem sürerken iptal et; sipariş oluşup oluşmadığını ve bir sonraki adımını açıkla.
- Kurgu kart tercihini kaydet, sonraki siparişte kısayolu kullan, güvenlik kodunu gir ve sonra kaydı kaldır.

Moderatör için standart örnekler: `1234 5678 9012 3456` veya `0000 0000 0000 0000` (başarı), `0000 0000 0000 0002` (aynı checkout'ta önce hata, sonra başarı), `12/30`, `000`. Uygulama biçimi doğru diğer kurgu numaraları da kabul eder; testte tutarlılık için aynı örnekleri kullan. Katılımcının gerçek kart bilgisi istenmez. Sonuçlar henüz toplanmadı; her görev ilgili ekran sahibi tarafından yürütülüp ortak tabloya kaydedilir.

## Melisa'nın sipariş sonucu ve takip bölümü

- Siparişi tamamladıktan sonra oluşup oluşmadığını, hangi ürünlerin hangi adrese gideceğini, ödeme yöntemini ve toplamı açıkla.
- Şu anda hangi aşamada olduğunu ve teslimatla ilgili hangi bilgilerin bulunduğunu söyle.
- Sipariş hakkında yardıma ihtiyaç duyduğunda uygun bilgiye ulaş; sonra alışverişe geri dön.
- Yeni alışverişe ürün ekledikten veya konum değiştirdikten sonra önceki siparişin bilgilerini kontrol et.

Uygulama katılımcıya gerçek ödeme/GPS içermeyen bir prototip olarak tanıtılır. Aktif durum “Sipariş alındı” olarak sabittir; katılımcının aktif aşama ile sonraki aşamaları ayırt etmesi değerlendirilir. Kurye ilerlemesi beklenmez. Ödeme sırasında sistem beklemesi varsa görev süresinden ayrı kaydedilir.

[Ayrıntılı protokol ve boş kayıt tablosu](team/MELISA_USABILITY_TEST.md) hazırdır. Simge ana sayfa/araştırma, Hakan Yemek, Beyda Market, Melisa ortak checkout/sonuç görevlerini yürütür; herkes kendi bölümündeki bulguyu ortak biçimde raporlar. Melisa sonuçları koordine eder; tüm testleri tek başına üstlenmez. Henüz katılımcı verisi yoktur.
