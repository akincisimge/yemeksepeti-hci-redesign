# Kullanıcı akışları ve uygulama sözleşmesi

## Hizmet seçimi
Giriş (/)
  -> YEMEK (/food)
       -> Restoran + ürün seçimi -> Yemek sepeti (/cart/food)
       -> Ortak checkout (/checkout/food) -> Demo başarı (/success)
  -> MARKET (/market)
       -> Yemeksepeti Market | Diğer Marketler
       -> Mağaza + ürün seçimi -> Market sepeti (/cart/market)
       -> Ortak checkout (/checkout/market) -> Demo başarı (/success)

## Sepet kuralları
- Yemek ve Market için ayrı sepet tutulur; birleştirilmez.
- Aynı servis içinde iki farklı mağazadan ürün karıştırılmaz.
- Mağaza değiştirmek mevcut sepeti silecekse kullanıcıya onay sorulur.
- Ürün adedi sıfır olunca satır kaldırılır.
- Sepet boşsa checkout engellenir ve neden açıklanır.
- Gerçek teslimat/kart/sipariş verisi gönderilmez.

## Ödeme simülasyonu
- Demo adres, demo kullanıcı ve demo ödeme tipi.
- Kart numarası, CVV, telefon gibi hassas bilgiler istenmez.
- Son aşamada sipariş özeti ve toplam gösterilir.
- Tamamla ile örnek sipariş kimliği ve başarı durumu sunulur; para çekilmez.
- Başarı sayfası yenilenince saklanan bir sipariş kaydı gösterilmez; bu ilk MVP için kabul edilen sınırdır.

## Boş/hata durumları
- Aramada sonuç yok: “Aradığın ürün bulunamadı”.
- Sepet boş: Ürünlere dön bağlantısı, checkout'a geçilemez.
- Formda eksik bilgi: Alanlarla birlikte açıklayıcı uyarı.
- Mağaza değişimi: İptal veya onay seçeneği.
- Başarılı sepete ekleme: Metin geri bildirimi.

## Entegrasyon testleri
1. Giriş > Yemek > ürün ekle > sepet > checkout > demo başarı.
2. Giriş > Market > Y-Market ürün ekle > checkout > demo başarı.
3. Market mağazasını değiştirirken onay penceresini test et.
4. Yanlış form / boş sepet koşullarını doğrula.
5. İki servis sepetinin birbirinden bağımsız kaldığını doğrula.
