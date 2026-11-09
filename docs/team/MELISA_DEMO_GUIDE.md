# Melisa — masaüstü sunum rehberi

Dal: `feat/melisa-checkout`. İnceleme: [PR #11](https://github.com/akincisimge/yemeksepeti-hci-redesign/pull/11). Ana dala birleştirme Simge/ekip koordinasyonundadır. Bu rehber adres, ödeme, onay ve durum bölümünü kapsar.

## Çalıştırma

1. Kendi checkout dalındaki güncel kodu aç. Yerel değişiklik varsa önce koru; sunum hazırlığında `reset --hard` kullanma veya başka dala zorla geçme.
2. İlk kurulumda veya kilit dosyası değiştiyse `npm ci` çalıştır. Kontroller Node 24.22.1 ile yapıldı; testler TypeScript dosyalarını doğrudan çalıştırdığı için Node 24 kullan.
3. `npm run dev` çalıştır; terminalde Vite'ın verdiği adresi masaüstü tarayıcıda aç.
4. Teknik kontrol gerekirse `npm run build` ve `node --test tests/*.test.mjs` çalıştır. Bu teslimde derleme ve 49 test başarılıdır; sonraki ekip değişikliklerinden sonra yeniden kontrol et.

Sunumdan önce Kötekli konumunu seç, ekranı normal yakınlaştırmada aç ve sepetleri gözden geçir. Tek tarayıcı sekmesinde ilerle. Son sipariş kaydı ve adres taslakları aynı sekmede tutulur; başka bilgisayarda otomatik görünmez. Sekmeyi kapatıp açmayı kalıcılık garantisi olarak sunma.

## Başta söylenecek açıklama

“Bu çalışma Yemeksepeti'nin masaüstü sipariş deneyimini HCI kurallarına göre değerlendiren bağımsız bir ders prototipi. Ödeme, sipariş iletimi ve kurye durumları yerel olarak simüle ediliyor. Gerçek kart, ödeme servisi, restoran veya canlı GPS bağlantısı yok.”

Ürün ekranlarına demo etiketi eklenmedi; bu kapsam sunumda açıkça anlatılır. Kurgu kartları yalnız bu yerel projede kullan, gerçek Yemeksepeti'nde kullanma.

## Kullanılacak kurgu bilgiler

| Alan | Değer / davranış |
| --- | --- |
| Ad soyad | Deniz Yılmaz |
| Adres | Kötekli'deki hazır kurgu Ev adresi veya Örnek Sokak No: 12 Daire: 3 |
| Not | Zile basma. |
| Başarılı kart | `0000 0000 0000 0000` |
| Hata ve tekrar deneme kartı | `0000 0000 0000 0002` — aynı açık checkout'ta ilk tamamlanan deneme başarısız, sonraki başarılı |
| Son kullanma / CVV | `12/30` / `000` |

Bu numaralar ödeme sağlayıcısına ait test kartları değildir. Kart adı, 16 haneli numara, geçerli AA/YY ve 3–4 haneli CVV girildiğinde yerel ödeme ilerler; numaranın iki örnekten biri olması gerekmez. Örneğin `1234 5678 9012 3456` da kullanılabilir. Banka, kart markası veya Luhn doğrulaması yapılmaz. Hata senaryosunda sayfayı yenileme; yenileme deneme durumunu sıfırlar. Kart alanları yenilemede silinir, adres taslağı korunur. Bahşiş de yenilemede sıfırlanır.

## 1. Yemek: adres ve başarılı sipariş

1. Yemek'te Mercimek Çorbası'nı 2 adet ekle; güncel katalogda ürün toplamı 190 TL.
2. Sepetten devam et. Boş zorunlu alanla devam edip alan mesajını ve ilk hatalı alana odağı göster.
3. Hazır Ev adresini seç, not ekle. Gerekirse sepete dönüp adedi değiştirerek adres/notun korunduğunu göster.
4. Ödeme adımında dört yöntemi göster: online kart, nakit, kapıda kredi kartı, yemek kartları. Sunumun bu akışında nakit ve 30 TL bahşiş seç.
5. Özette 220 TL'yi doğrula ve siparişi tamamla. Yemek ücretleri mevcut katalogdan gelir; ayrıca teslimat/poşet ücreti uydurulmadı.
6. Onay numarası, ürün/adet, tutar, teslimat adresi/not ve yöntemi göster. İlk 60 saniyede durumları izle.

## 2. Market: hata, toparlanma ve sepet ayrımı

1. Alışverişe dön. İki sepetin ayrılığını göstermek için Yemek'te bir Tavuklu Pilav bırak.
2. Market'te Sütaş Süzme Peynir 190,90 TL ve Ekmek 15 TL ekle. Ürün toplamı 205,90 TL, teslimat 29,99 TL; minimum 150 TL aşılmış olur.
3. Checkout'ta kurgu adresi kullan. Market'te yalnız online kart sunulduğunu göster.
4. Hata kartını, `12/30`, `000` ve 50 TL bahşişi kullan. Toplam 285,89 TL.
5. İlk denemede hatayı ve korunan bilgileri göster. Aynı açık formda tekrar dene; sipariş oluşur.
6. Alışverişe dön: Market sepeti boş, Yemek sepetindeki ürün yerinde olmalı. Profil → Önceki siparişlerim → Sipariş takibini aç üzerinden son kaydı yeniden açabilirsin.

Fiyatlar ekip tarafından değiştirilirse ezberlenen tutar yerine canlı özeti esas al. Yemek/Market sepetlerini karıştırarak tek sipariş oluşturulmaz; ortak ekranlar ilgili servisin verisini alır.

## 3. Sipariş sonucu ve durum sunumu

| Oluşturulmadan sonra | Gösterilen durum |
| --- | --- |
| 0 saniye | Sipariş alındı |
| 12 saniye | Hazırlanıyor |
| 30 saniye | Kurye siparişini teslim aldı |
| 60 saniye | Teslim edildi |

Zaman çizelgesi hızlandırılmıştır. Arayüzdeki tahmini zaman, katalogdaki örnek dakika aralığına dayanır; 60 saniyede teslim edildi gösterilmesi gerçek teslimat performansı değildir. Saat dilimi İstanbul'dur. Başka sayfaya geçip dönmek veya yenilemek çizelgeyi başlatmaz; geçen süreye göre ilerler. Tekrar başlangıcı göstermek için yeni kurgu sipariş oluştur.

- “Sipariş ayrıntıları” ile adres/yönteme git; Tab/Enter odağını göster.
- “Yardım al” yerel bilgi alanını açar; gerçek temsilciye bağlanmaz.
- Yenileyip bilgilerin ve durumun korunduğunu göster.
- Yeni alışveriş sepetini veya üstteki alışveriş konumunu değiştirmek, tamamlanan siparişin adresini/ürünlerini değiştirmez.
- Onaydan sonra gerçek iptal/iade yoktur. Geri alma örneğini onay öncesi adres/sepet/bahşiş düzeltme veya 1,2 saniyelik ödeme işlemini iptal üzerinden anlat.

## Sunumda gerekçeyi bağlama

K1 ortak bileşenler; K2 adres/kart kısayolları; K3 hata/işleniyor/durum geri bildirimi; K4 onay ve teslim edildi; K5 alan düzeltme/tekrar deneme; K6 onay öncesi geri dönüş; K7 yöntem ve bahşiş tercihi; K8 görünür sipariş özeti.

“Daha kullanışlı olduğunu kanıtladık” deme. Şu an kanıtlanan teknik davranışlardır. Tasarımın anlaşılabilirliği [katılımcı test protokolü](MELISA_USABILITY_TEST.md) ile ölçülecek. Orijinal sitede zaten bulunan özet/onay özelliklerini yeni icat edilmiş veya orijinalde eksikmiş gibi sunma. Önce/sonra karşılaştırmasını onaylı Figma ekranlarından göster; [uygulama raporundaki farkları](MELISA_CHECKOUT_IMPLEMENTATION.md) açıkla.
