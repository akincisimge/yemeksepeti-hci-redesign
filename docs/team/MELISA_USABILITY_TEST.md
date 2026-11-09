# Ortak sipariş akışı — katılımcı test protokolü

Durum: **Hazırlandı; henüz uygulanmadı.** Katılımcı, süre, başarı oranı veya alıntı üretilmedi. Otomatik 44 test ve tarayıcı kontrolleri bu çalışmanın sonucu değildir.

## Amaç ve ekip sorumluluğu

Adres/ödeme hatalarının anlaşılması, geri dönüşte bilgi korunması, toplam/yöntem farklarının görünürlüğü ve siparişin tamamlandığının anlaşılmasını sınamak. İlk keşif için 5 gönüllüyle çalışma planlanabilir; bu sayı istatistiksel temsil veya tüm sorunları bulma garantisi değildir.

Simge giriş/ana sayfa ve araştırma, Hakan Yemek, Beyda Market, Melisa ortak checkout/sonuç görevlerini yürütür. Ortak kayıt biçimi kullanılır. Melisa birleşik raporu koordine edebilir; diğer üyelerin görev ve bulgu kayıtlarını da onların hazırlaması gerekir.

## Hazırlık

- Masaüstü, aynı tarayıcı/yakınlaştırma; yaklaşık 20–25 dakika. Görülen commit, tarih, ekran boyutu ve kullanılan senaryoyu kaydet.
- Gerçek isim/adres/kart isteme. [Sunum rehberindeki](MELISA_DEMO_GUIDE.md) kurgu bilgileri ayrı görev kartı olarak ver. Katılımcıya arayüzde nerede tıklayacağını söyleme.
- Her oturumun başlangıcında aynı konumu ve sepet içeriğini normal arayüz üzerinden hazırla. Önceki oturumdan kalan kart kısayolunu kaldır; varsa hazır kısayolu test notuna yaz. Sepet ve adres başlangıçlarını standartlaştır.
- Kayıt alınacaksa önceden izin iste; istemeyen kişiyi kayıtsız notlarla dahil et. Kimlik yerine P01 gibi kod kullan. Katılımcı istediği an bırakabilir.
- Sadece prototipte çalış. Canlı Yemeksepeti'ne dummy veri gönderme veya test için gerçek ödeme/sipariş yaptırma.

Başlangıç açıklaması: “Seni değil tasarımı değerlendiriyoruz. Bu prototip gerçek ödeme yapmıyor ve kurye durumları hızlandırılmış olarak değişiyor. Görevleri yaparken ne düşündüğünü söyleyebilirsin. Takıldığında önce nasıl ilerleyeceğini görmek istiyoruz; istediğin an durabilirsin.”

## Görevler

Aşağıdaki ilk sütun katılımcıya okunur. Başlangıç ve başarı ölçütleri moderatör içindir; katılımcıya çözüm olarak gösterilmez.

| Kod | Katılımcıya okunacak görev | Başlangıç / gözlem ölçütü |
| --- | --- | --- |
| M1 | “Bu yemekleri evine söylemek istiyorsun. Verilen kurgu teslimat bilgileriyle ilerle; sistem bir düzeltme isterse yap.” | Food sepeti hazır, adres boş. Verilen form kartında önce yalnız ad bulunur; adres gereksinimi fark edilince kurgu adres kartı verilir. Kullanıcının hatanın yerini/nedenini anlaması ve düzelterek ilerlemesi gözlenir. |
| M2 | “Kurye için ‘Zile basma.’ notunu ekle. Sonra ürün adedini değiştirip siparişine devam et.” | M1'in adres adımı. Kullanıcı sepeti düzenleyip dönebilir; not/adres korunduğunu fark eder. Kısayol denemesinde alternatif görev: “Bir sonraki alışverişinde yine Ev adresine sipariş vermek istiyorsun; teslimat bilgilerini hazırla.” |
| M3 | “Yemek siparişini nakit ödemek ve 30 TL bahşiş bırakmak istiyorsun. Ödeyeceğin toplamı söyle ve siparişini tamamla.” | İki Mercimek 190 TL. Nakit ve 30 TL seçer; toplam 220 TL'yi doğru açıklar. Yöntem ve toplamı bulmak için yardım gerekip gerekmediği kaydedilir. |
| M4 | “Siparişinin oluştuğunu nasıl anlıyorsun? Neler hangi adrese gidecek, ödeme nasıl olacak ve şu an hangi aşamada?” | Yeni sonuç ekranı. Sipariş numarası/ürün/adres/yöntem/durumu doğru açıklar. 60 saniyelik hızlandırma nedeniyle ilk durum kaçırılırsa hata sayılmaz; gerekirse durum incelemesi ayrı yeni siparişte yapılır. |
| M5 | “Market sepetini verilen kurgu kartla tamamlamak istiyorsun. Bir sorunla karşılaşırsan nasıl ilerleyeceğine karar ver.” | Peynir+ekmek, kart `0000 0000 0000 0002`, tarih `12/30`, CVV `000`, bahşiş 50 TL. İlk deneme hata verir. Kullanıcı açıklamayı anlar, korunan bilgilerle tekrar deneyerek 285,89 TL sipariş oluşturur. |
| M6 | “Siparişinin adresi ve ödeme bilgisi hakkında yardım arıyorsun. İlgili bilgiye ulaş, sonra yeni bir alışverişe dön.” | Market sonucu. Yardım/ayrıntılar bulunur, ilgili servise dönülür. Yeni sepetteki değişikliğin eski siparişi değiştirmediğini açıklama ek gözlem olabilir. |

M1 için eksik bilgiyi moderatörün kontrollü vermesi, doğal hata oranı ölçümü değildir; hata mesajı ve toparlanma değerlendirmesidir. M2'nin kısayol varyantını kullandıysan ayrı kod `M2-K` ile kaydet. M3/M5'te fiyat değişmişse güncel doğru tutarı oturum başlamadan kaydet.

## Ölçüm ve müdahale

- Süre görev okunup başlandığında başlar, gözlem ölçütü sağlandığında biter. Sistem/kurye bekleme süresini ayrı yaz; aktif görev süresine katma.
- **B**: bağımsız tamamlandı; **Y**: moderatör yardımıyla tamamlandı; **T**: tamamlanmadı. İlk açıklama dışındaki yönlendirmeyi yardım olarak kaydet.
- Hata: görevin tamamlanmasını engelleyen yanlış giriş/seçim/geri dönüş. Tek olayı tekrar sayma; ekran ve davranışı tarif et. Bir kontrolü incelemek tek başına hata değildir.
- Katılımcı takılırsa önce “Şu an ne yapmayı düşünüyorsun?” de. Gerekli yardımı verdiğinde zamanı ve yardım içeriğini kaydet. Katılımcının isteği veya makul görev sınırı (örneğin 3 dakika aktif süre) sonrası görevi sonlandırıp T yaz.
- Her görevden sonra “Bu görevi yapmak ne kadar kolaydı?” sor: 1 çok zor, 5 çok kolay. Bu basit proje sorusudur; standartlaştırılmış SUS/SEQ puanı değildir.
- Sonunda “En kararsız kaldığın adım hangisiydi?”, “Hangi bilgi eksikti?”, “Ne değişmesini isterdin?” sor. Kendi yorumunu katılımcı alıntısı diye yazma.

## Boş oturum kaydı

Katılımcı kodu: ____ · Tarih: ____ · Commit: ____ · Ekran/tarayıcı: ____ · Moderatör: ____

| Görev | Sonuç B/Y/T | Aktif sn | Bekleme sn | Hata sayısı | Yardım / gözlem | Kolaylık 1–5 |
| --- | --- | --- | --- | --- | --- | --- |
| M1 | | | | | | |
| M2 / M2-K | | | | | | |
| M3 | | | | | | |
| M4 | | | | | | |
| M5 | | | | | | |
| M6 | | | | | | |

## Bulguyu raporlama

Her bulgu için ekran, gözlenen davranış, katılımcı/görev kodu, etki, ilgili HCI kuralı, öneri ve sorumlu kişi yaz. Öncelik: görevi engelliyor / yardım veya belirgin gecikme yaratıyor / küçük anlaşılma sorunu. Çözüm sonrası aynı görevi yeniden dene; eski ve yeni sürümü belirt.

Bağımsız başarı = B / uygulanan görev sayısı. Yardımlı başarıyı ayrıca göster; T'yi sessizce dışlama. Tamamlanan görevlerin medyan aktif süresini örneklem sayısıyla yaz. Küçük grubun sonuçlarını tüm kullanıcılara genelleme. Sonuç yoksa “henüz test edilmedi” yaz; boş hücreyi sıfır olarak yorumlama.

## Orijinal tasarımla karşılaştırmanın sınırı

Orijinal ekran kaydı ve önce/sonra Figma kareleri üzerinden bilgi bulma/anlama görüşleri toplanabilir. Video izleme süresi ile etkileşimli prototipte görev tamamlama süresini karşılaştırarak “yüzde X daha hızlı” deneme. Böyle bir ölçüm için iki etkileşimli sürümde eşdeğer görev/başlangıç ve dengelenmiş sunum sırası gerekir. Bu teslimde böyle bir karşılaştırmalı çalışma yapılmadı.
