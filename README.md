# Yemeksepeti HCI Redesign

Dört kişilik HCI (İnsan-Bilgisayar Etkileşimi) projemiz kapsamında React, TypeScript ve Tailwind CSS ile geliştirilecek etkileşimli Yemeksepeti simülasyonu.

## Amaç

Kullanıcıların yemek ve market alışverişi akışlarını daha anlaşılır, tutarlı ve erişilebilir hâle getirmek; tasarım kararlarını HCI ilkeleri ve kullanılabilirlik değerlendirmeleriyle açıklamak.

## Planlanan teknoloji yığını

- **React:** bileşen tabanlı kullanıcı arayüzü.
- **TypeScript:** veri modelleri ve bileşenler için tip güvenliği.
- **Tailwind CSS:** ortak tasarım kuralları ve duyarlı arayüz.

## Planlanan kapsam

- Açılış ekranında belirgin **YEMEK** ve **MARKET** seçenekleri.
- Yemek bölümünde restoran listeleme, arama, filtreleme ve menü görüntüleme.
- Market bölümünde kategori ve ürün görüntüleme.
- Sepete ekleme, miktar değiştirme, ürün kaldırma ve örnek sipariş tamamlama.
- Yüklenme, boş sonuç, hata ve işlem başarısı için anlaşılır geri bildirim.
- Mobil ve masaüstü ekranlara uyum; klavye kullanımı ve görünür odak durumları.

Bu proje eğitim amaçlı bir simülasyondur; Yemeksepeti'nin resmî ürünü değildir. Örnek veriler kullanılacak, gerçek ödeme veya sipariş alınmayacaktır.

## Tasarım yaklaşımı

Ders kapsamında belirlenen sekiz HCI kuralı, tasarım ve değerlendirme çalışmalarının temelini oluşturacaktır. Her iyileştirme için mevcut sorun, ilgili kural, önerilen çözüm ve doğrulama senaryosu belgelenecektir.

Ortak bileşenlerde renk, yazı boyutu, boşluk, buton, form ve geri bildirim davranışları tutarlı uygulanacaktır. İşlemlerin geri alınabilmesi, hataların önlenmesi ve kullanıcının kontrolü önceliklidir.

## Dört kişilik ekip çalışma düzeni

- İşler GitHub Issues üzerinden tanımlanır; sorumlu ve kabul ölçütleri belirtilir.
- Her görev için `feat/gorev-adi`, `fix/hata-adi` veya `docs/konu` biçiminde ayrı branch açılır.
- Değişiklikler Pull Request ile sunulur ve bir ekip arkadaşı tarafından incelenir.
- Ortak bileşen veya tasarım kuralı değişiklikleri diğer ekip üyeleriyle koordine edilir.
- Birleştirmeden önce ilgili kullanıcı akışı ve farklı ekran boyutları kontrol edilir.

Kişi bazlı görevler ve ekran sahipliği, ekip tarafından netleştirildikçe eklenecektir.

## Mevcut durum

Repository ve proje açıklaması hazırdır. Uygulama kodu henüz eklenmemiştir; bu nedenle şu anda çalıştırılabilir bir arayüz yoktur. Proje kurulunca kurulum, geliştirme ve derleme komutları bu bölüme eklenecektir.
