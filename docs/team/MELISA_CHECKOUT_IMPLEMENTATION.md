# Ortak sipariş akışı — uygulama ve doğrulama raporu

Son güncelleme: 10 Kasım 2026. Temel: `main` / `d50e2ad`. Dal: `feat/melisa-checkout`. Adres/özet, ödeme, sipariş onayı ve durum ekranları tamamlandı. İlk bölüm `97315f3`, ödeme bölümü `aaeff61` commit'inde kayıtlıdır; sonuç/durum bölümü bunların üzerine eklenmiştir. Güncel doğrulama: **53/53 test**, başarılı derleme ve iki servis için masaüstü tarayıcı kontrolleri. Katılımcı testi ve ekip merge işlemi bekliyor.

## Değişiklik ve gerekçe

| Davranış | HCI karşılığı |
| --- | --- |
| Yemek/Market için ortak form, adım göstergesi ve özet | K1: tutarlılık |
| Kötekli'deki kurgu Ev adresini tek tıkla kullanma | K2: deneyimli kullanıcıya kısayol |
| Seçili adım, alan hatası, toplam ve minimum tutar açıklaması | K3: bilgilendirici geri bildirim |
| Açık son onay, sipariş numarası/özeti ve “Siparişin alındı” mesajı | K4: sipariş verme işleminin tamamlandığının anlaşılması |
| Alan doğrulaması, ilk hatalı alana odak, boş/minimum altı sepet engeli | K5: basit hata yönetimi |
| Sepete/adrese dönme, taslağı koruma | K6: onay öncesi geri dönüş |
| Adres/sepet düzenleme ve ayrı son sipariş onayı | K7: kullanıcı kontrolü |
| Ürün, adet, birim fiyat ve ücretlerin görünürlüğü | K8: kısa süreli hafıza yükünü azaltma |

Yararlar hipotezdir; gerçek kullanıcı araştırması sonucu değildir. Başlangıç kodundaki hatalar orijinal Yemeksepeti'ne atfedilmez.

## Kart markası logoları — 10 Kasım 2026

Ortak `PaymentForm` içindeki “VISA · Mastercard · Troy” metni, markaların kendi kaynaklarından alınan üç özgün görselle değiştirildi. Yemek ve Market aynı bileşeni kullanır. Logolar “Kart bilgileri” başlığının sağında, oranları ve renkleri korunarak hizalanır; bağlantı veya düğme değildir. `alt` metinleri Visa, Mastercard ve Troy olarak korunur. Amaç, özgün ödeme ekranındaki tanıdık görsel ipuçlarını korumaktır (K1/K8); ölçülmüş bir kullanılabilirlik kazanımı iddia edilmez.

Dosyalar `public/logos/payments/` altındadır; çalışma sırasında haricî görsel isteği yapılmaz. Kaynaklar ve üçüncü taraf hakları aynı klasörün [README dosyasında](../../public/logos/payments/README.md) kayıtlıdır. Ödeme yöntemleri, doğrulama ve sipariş mantığı değişmedi. Figma/ZIP bu kod değişikliğinde güncellenmedi.

**Doğrulama:** TypeScript/Vite derlemesi geçti. 1363px masaüstü ödeme ekranında üç görsel yüklendi; en-boy oranları korundu ve yatay taşma görülmedi. Erişilebilirlik ağacında üç marka adı ayrı görseller olarak mevcut; ek klavye durakları yok. Bu küçük görsel değişiklik için yeni otomatik test eklenmedi ve katılımcı testi yapılmış sayılmadı.

## BİM ve CarrefourSA ödeme kapsamı düzeltmesi — 10 Kasım 2026

Kullanıcının BİM ödeme ekranında yalnız online kart görünüyordu. Sebep checkout'ın satıcı eşlemesiydi: önceki değişiklik üç yöntemi yalnız Y-Market'e açmış, BİM/CarrefourSA'yı online kartla sınırlı bırakmıştı. Bu sorun `delivery.ts` birleştirme çakışmasından bağımsızdır.

Artık mevcut üç Market senaryosunda (`ymarket-1`, `bim-1`, `carrefour-1`) online kart, nakit ve kapıda temassız kart birlikte sunulur. Bu, ortak ödeme akışı için seçilen prototip kapsamıdır; gerçek şubelerin ödeme politikası araştırılmış gibi sunulmaz. Tanımlanmamış satıcılarda mevcut online kart varsayılanı korunur. Yemek kartları Market seçeneklerine eklenmez.

**Doğrulama:** 53/53 test ve TypeScript/Vite derlemesi geçti. Mevcut regresyon testleri üç mağazanın seçeneklerini, nakit/kapıda kart tercihinin normalleştirmede kaybolmamasını ve altı mağaza-yöntem birleşiminin sipariş kaydında korunmasını kapsayacak şekilde genişletildi. Kart verisi saklama beyaz listesi değişmedi.

Masaüstü tarayıcı kontrolünde BİM'in üç seçeneği görüldü; kart bilgisi girmeden **234,90 + 24,99 = 259,89 TL nakit** sipariş tamamlandı. CarrefourSA'da üç seçenek görüldü; kapıda kart tercihi ödeme sayfası yenilendiğinde korundu ve **278,00 + 39,99 = 317,99 TL kapıda temassız kart** siparişi tamamlandı. Sonuçta mağaza, toplam ve ödeme yöntemi doğru gösterildi. Bunlar teknik kontrollerdir; katılımcı testi değildir. Figma/ZIP güncellenmedi.

## Yeni Market referansı ve ödeme UX düzeltmesi — 9 Kasım 2026

**Uygulama öncesi bulgu:** Kullanıcının 23.00 tarihli özgün Market ekranında online kart, nakit ve kapıda temassız kart görülüyor. Önceki yalnız-online varsayımı bu örnek için yanlıştır; tüm gerçek mağazalar hakkında genelleme yapılmaz. Çalışan prototipte 1363 × 936 görünümünde tek ürünle bile onay düğmesi ilk ekranın altında kalıyor. Ödeme ekranında teslimat tahmini yok; yemek kartı kapsamı belirsiz; CVV'nin yeri açıklanmıyor.

**Uygulanan çözüm:** İlgili mağaza için doğrulanan seçenekleri sipariş kaydına kadar desteklemek (K7), ücretlerle onay düğmesini birlikte tutmak (K8), formu kalıcı etiketleri koruyarak kısaltmak (gruplama/hiyerarşi), teslimat tahminini onaydan önce göstermek (K3/K8), yemek kartı kapsamı ve CVV yardımını açıklamak (K5). Sipariş onayına kısa, bir kez oynayan ve hareketi azalt tercihine uyan bir görsel eklemek (K3/K4). Durum “Sipariş alındı” olarak sabit kalır. Bu hedeflerin kullanıcı başarısını artırdığı henüz ölçülmedi.

Çalışma React/PR kapsamındadır. Önceki Figma/ZIP bu aşamada güncellenmiş sayılmaz. Aşağıdaki eski test kayıtları tarihsel sonuçlardır; bu düzeltmenin doğrulaması bu bölümün sonunda ayrı verilir.



**9 Kasım kapsamı (tarihsel):** Bu aşamada Y-Market (`ymarket-1`) online kart, nakit ve kapıda temassız kart sunarken BİM/CarrefourSA önceki online kart kapsamındaydı. 10 Kasım düzeltmesi mevcut üç Market senaryosunu aynı üç yönteme geçirdi; tanımlanmamış satıcıların online kart varsayılanı korundu. `paymentModel.ts` içindeki satıcı eşlemesi yeni katalog kimlikleri eklenirse güncellenmelidir. Ortak sipariş parser'ı Market nakit/kapıda kart kayıtlarını kabul eder, Market yemek kartını reddeder.

İki kurgu restoranın yemek kartı listeleri açıkça gösterilir: Mahalle Mutfağı için Ticket Restaurant, Pluxee, Multinet; Meydan Pizza için Ticket Restaurant, Multinet. Bu listeler ders senaryosu verisidir; gerçek işletmelerin anlaşmaları araştırılmış gibi sunulmaz. Kart sağlayıcı entegrasyonu veya ek kart numarası alanı yoktur.

Ödeme seçenekleri kompakt seçim kartlarıdır; seçili yöntemin alanları hemen altında açılır. Kart alanları iki sütunda ve kalıcı etiketlerle gösterilir. Hata satırına yer ayrıldığı için CVV hatası oluşurken yardım bağlantısı aşağı kaçmaz. CVV yardımı yerel `<details>` içinde iki yüzü gösteren basit kart çizimi ve metin içerir. Kayıt tercihi “Bu kartı sonraki siparişlerim için kaydet” olarak açıklanır; zaten seçili kayıtlı kartta yeniden kayıt kutusu gösterilmez.

Özetin ödeme görünümünde toplam ve tek onay düğmesi aynı karttadır; masaüstünde sağ sütun kaydırmada takip eder. İlk iki ürün çeşidi görünür, kalanlar düğmenin altındaki açılabilir ayrıntılardadır; toplam her zaman bütün ürünleri içerir. Adres daha kısa ayrı bir kartta ve düzenleme bağlantısıyla korunur. Tahmini dakika aralığı adres/ödemede gösterilir ve aynı ortak hesapla sipariş kopyasına alınır. Katalogda süre yoksa önceden kullanılan 20–35 dakikalık kurgu aralık kullanılır; canlı lojistik hesabı değildir.

Onayda marka pembesiyle çizilen küçük paket ve yeşil tik bulunur. Giriş 360 ms, tik 420 ms (80 ms gecikme) sürer; her açılışta bir kez oynar. Hareket yalnız `prefers-reduced-motion: no-preference` içinde etkinleşir; diğer durumda tik doğrudan görünür. Gerçek kurye hareketi/konumu ve otomatik durum ilerlemesi yoktur.

**Güncel doğrulama:** 53/53 otomatik test (önceki 49 + dört regresyon testi), TypeScript/Vite derlemesi ve `git diff --check` başarılı. Testler satıcı kapsamı, açık yemek kartı listeleri, tahmin aralığı ve Market nakit/kapıda kart siparişinin yenilemede korunmasını kapsar. 1363 × 936 masaüstünde:

| Kontrol | Gözlenen sonuç |
| --- | --- |
| Y-Market ödeme yöntemleri | Online kart/nakit/kapıda kart görünür; teslimatta ödeme kart alanı istemez |
| Tek ürünlü özet | Önce düğme y=1149, sonra y=738–786; ilk görünümde erişilebilir; yatay taşma yok |
| CVV iki hane + yardım | Alan hatası ve pasif düğme; yardım ilk tıklamada açıldı; Tab/Enter ile de çalıştı |
| Online → nakit → online | Açık formdaki kurgu kart bilgileri korundu |
| 30 TL bahşiş + Market nakit | 190,90 + 29,99 + 30 = 250,89 TL; sonuçta Nakit; yenilemede aynı sipariş |
| Dört ürünlü özet | İlk iki çeşide ek olarak Ekmek/Muz ayrıntısı açıldı; toplam 385,69 TL, düğmenin yeri değişmedi |
| Market kapıda kart | Tercih ödeme ekranı yenilendiğinde korundu; boş online form ile 385,69 TL sonuç; yöntem etiketi doğru |
| Yemek kartları | Mahalle Mutfağı'nın üç örnek sağlayıcısı açıkça görünür |
| Yemek online hata/tekrar | Kurgu 0002 ilk denemede hata, odak mesaja taşındı; aynı bilgilerle 180 TL sipariş tamamlandı |
| Onay animasyonu | Tarayıcıda tek tekrar ve tamamlanan tik görüldü; aktif aşama Sipariş alındı |

Azaltılmış hareket için medya kuralı kodda kontrol edildi; işletim sistemi tercihi değiştirilerek ikinci bir tarayıcı deneyi yapılmadı. Mobil, ekran okuyucu ve gerçek katılımcı testleri yapılmış sayılmaz. Figma/ZIP bu aşamada değiştirilmedi; yeni kompakt ödeme/CVV/animasyon React uygulamasındadır. Önce/sonra sunumunda bu fark açıkça belirtilmelidir.

## Dosyalar ve ortak alanlar

- `src/features/checkout`: AddressForm, PaymentForm, CheckoutSteps, OrderSummary, OrderStatus, OrderHelp ve doğrulama/tutar/taslak/ödeme/durum modelleri.
- `src/pages/CheckoutPage.tsx`: ortak akış, servis/bölgeye ayrılmış taslak, geri dönüşler ve mevcut yerel sipariş simülasyonu.
- `src/pages/SuccessPage.tsx`: tamamlanan sipariş, sabit onay durumu, yardım, boş kayıt ve eski kayıt durumları.
- `src/state/demoOrder.ts`: tamamlanma anındaki bilgilerin bağımsız kopyası, doğrulanan kayıt ve eski kayıt uyumluluğu.
- `src/components/Layout.tsx`: yalnız checkout ve `/success` yollarında resmî SVG logo, 1184px içerik sınırı, sade üst alan ve ekran içi demo alt bilgisinin kaldırılması. Kayıtlı sonuç için güncel konum seçimi zorunlu tutulmaz. Diğer ekranların görünümü korunur.
- `public/logos/yemeksepeti-official.svg`: onaylanan referans paketindeki resmî wordmark, oranı korunarak 180 × 46,5px. Eğitim amaçlı bağımsız yeniden tasarım; marka üzerinde mülkiyet iddiası yoktur.
- `vite.config.ts`: geliştirme önizlemesi için yalnız `terminal.local` izinli host eklenir; tüm hostlara izin verilmez.
- İlk bölüm domain/context sözleşmelerini değiştirmedi. İkinci bölüm `PaymentMethod` birliğine `door-card-demo` ve `meal-card-demo` ekler; eski değerler korunur. `PAYMENT_METHOD_LABELS` ortak etiketleri sağlar. Context'ler ve diğer ekip üyelerinin sayfaları değiştirilmedi. Yeni bağımlılık eklenmedi.

## Veri davranışı

Adres taslağı aynı sekmenin sessionStorage alanında servis + bölge anahtarıyla saklanır. Yenileme ve sepet düzenleme sonrası korunur; başka bölge/servise karışmaz. Bozuk veya erişilemeyen saklama alanı formu çökertmez. İsim/adres/not/yöntem dışındaki alanlar taslağa alınmaz. Kart numarası/CVV saklanmaz. Testlerde kurgu bilgiler kullanılmıştır.

Tutarlar kuruş cinsinden toplanır. Minimum sepet tutarına teslimat ücreti katılmaz. Market ücret/minimum bilgisi mevcut mağaza verisinden gelir. Yemek tarafında mevcut model bu değerleri tanımlamadığı için ek ücret uydurulmaz.

## Figma ile uygulama arasındaki farklar

- [Figma](https://www.figma.com/design/i6MQxPs8Ne0n8KucRnZlXk) 1440px tasarım referansıdır. Kod mevcut ortak tipografi ve renk token'larını kullanır.
- Örnek ürün/fiyat yerine güncel sepet verisi gösterilir. Modelde poşet ücreti bulunmadığı için Figma'daki örnek ücret koda sabitlenmez.
- Üst alanda Figma'nın örnek Yardım/Deniz kontrolleri yerine mevcut çalışan bölge/profil paneli korunur.
- Kart alanları, bahşiş ve ödeme hata durumları ikinci bölümde uygulandı. İki kurgu restoran dört yöntem; Yemeksepeti Market, BİM ve CarrefourSA senaryoları aynı üç yöntemi sunar. Yemek kartları bu kapsamda teslimatta ödeme seçeneğidir; sağlayıcı/şirket bazında entegrasyon yoktur.
- Kurgu kayıtlı kartı seçme/kaldırma ve işlem sürerken iptal etme kontrolleri kısayol ve kullanıcı kontrolünü çalışır hâle getirir.
- `SuccessPage.tsx` onaylı sipariş alındı/kurye/teslim edildi düzenine geçirildi. Aradaki hazırlanıyor durumu aynı bileşenleri kullanır. Durum, sipariş bilgileri, özet ve yardım alanları çalışır; ürün ekranında demo/HCI etiketi veya elle durum ilerletme düğmesi yoktur.
- Figma'da üç adres ekranına kısayol kartı eklendi; kurye başlığı ve tek yöntemli Market hata metni düzeltildi; K2 panosu güncellendi. Önce ekranları korundu. Tıklanabilir Figma prototipi/Auto Layout kurulmadı.
- İkinci ve üçüncü bölümler mevcut onaylı tasarım paketinin 4. sürümünü uygular. Bu kod aşamalarında Figma veya ZIP dosyası değiştirilmedi. Üçüncü bölümde Figma bağlantısı Starter MCP çağrı sınırına ulaştığı için canlı katman denetimi yapılamadı; güncel paket yeniden alınıp onay/kurye ekranları görsel olarak incelendi. ZIP SHA-256: `f7c2d45c6d33fe571f003bf384431b1e4ca8ad67afc13cab678df867dffc84a9`.

## İlk bölümün teknik kontrolleri

`npm run build`, `node --test tests/*.test.mjs` ve `git diff --check` başarılı. Ana dal tabanında 16 test (8 yeni checkout + 8 mevcut) geçti. Node 24.22.1 kullanıldı; TypeScript modelini doğrudan çalıştıran test komutu modern Node gerektirir.

Tarayıcı kontrolü 1363px masaüstü görünümünde, normal kullanıcı etkileşimleriyle yapıldı. 1440px ayrıca test edilmiş değildir; mobil test/tasarım kapsam dışıdır.

| Senaryo | Gözlenen sonuç |
| --- | --- |
| Boş adresle devam | Alan hataları; ilk geçersiz alana odak |
| Kayıtlı kurgu adresi seçme | İsim/adres doldu, seçili durum gösterildi |
| Ödemeye geçip adrese dönme | Alanlar/not korundu; başlık odaklandı |
| Sepete dönüp adet değiştirme, yeniden giriş ve yenileme | Adres/not korundu; Yemek toplamı 370,00 TL |
| Market 15,00 TL sepet, 150,00 TL minimum | Devam pasif; 135,00 TL eksik açıklandı; teslimat dahil 44,99 TL |
| Market sepetini 205,90 TL'ye çıkarma | 29,99 TL teslimat ile 235,89 TL toplam; kart seçimi |
| Market sipariş simülasyonunu tamamlama | Market temizlendi; Yemek sepetinde 3 ürün korundu |
| Boş Market checkout | Ürünlere yönlendiren boş durum |
| Klavye Tab/Enter | Görünür odak; bölge paneli açıldı |
| Kötekli'den Orhaniye'ye geçme | Yeni bölge taslağı boş; Kötekli kısayolu gizli; sepet korundu |
| Geçersiz taslakla doğrudan ödeme URL'si | Adres adımına yönlendi |
| Kötekli'ye geri dönme | Önceki bölgenin düzenlenmiş taslağı geri geldi |
| Logo ve taşma | SVG yüklendi, oranı doğru; 1363px'de yatay taşma yok |

Bu kontroller teknik doğrulamadır. Katılımcı, görev süresi veya kullanılabilirlik başarı oranı üretilmedi.

## Ödeme bölümünün davranışı ve sunum verileri

- `PaymentForm.tsx` kart sahibi, numara, AA/YY ve gizlenmiş CVV alanlarını; yöntem ve bahşiş seçimlerini içerir. Etiketler ve alan hataları erişilebilir ad/açıklamalarla bağlıdır. Geçersiz formda devam düğmesi pasif olur ve nedeni yanında yazılır.
- `paymentModel.ts` kart sahibi, 16 haneli numara, geçerli tarih ve 3–4 haneli CVV biçimini kontrol eder. İki numaralık izin listesi kaldırıldı; uygun biçimdeki kurgu bilgilerle yerel işlem başarılı olur. Gerçek kart/banka veya Luhn doğrulaması yapılmaz. `0000 0000 0000 0000` başarılı olur. `0000 0000 0000 0002` aynı açık checkout'taki ilk tamamlanmış denemede hata verir, tekrar denemede başarılı olur. İptal edilen deneme bu senaryoyu tüketmez. Sunum için ad: Deniz Yılmaz, tarih: `12/30`, CVV: `000`. Bunlar banka test kartı değildir; gerçek kart/banka/ödeme servisi kullanılmaz.
- Yemek yöntemleri: online kart, nakit, kapıda kredi kartı, yemek kartları. Yemeksepeti Market, BİM ve CarrefourSA senaryoları online kart, nakit ve kapıda temassız kart sunar. Teslimatta ödeme seçimlerinde online kart alanları aranmaz.
- Bahşiş seçenekleri 0/30/50/75/100 TL'dir. Toplama eklenir; teslimat ücreti gibi minimum ürün tutarını tamamlamaz. “Şimdi değil” toplamı geri alır.
- Kart alanları React belleğindedir; saklama alanına veya route state'e yazılmaz. Aynı checkout içinde adrese dönüp gelince korunur; sayfadan ayrılma/yenileme sonrasında temizlenir. Bahşiş de yalnız açık akışta tutulur ve yenilemede 0'a döner. Adres taslağı korunur.
- “Bu kartı sonraki siparişlerim için kaydet”, başarılı işlemden sonra yalnız son dört haneyi ve yerel `presentation-card` / `retry-card` senaryo kimliğini aynı sekmenin sessionStorage alanına yazar. Kısayol maskeli kartı seçer; tam numara, ad ve tarih yeniden doldurulmaz. CVV boş başlar ve odağı alır. “Başka kart kullan” boş formu açar; “Kaydı kaldır” tercihi siler. Eski yalnız kimlik içeren kayıtlar okunur. Gerçek kart saklama/tokenizasyon hizmeti değildir.
- Yerel işlem 1,2 saniyelik gecikmeyle sonuçlanır. Senkron işlem kilidi ikinci denemeyi engeller. İptal, tarayıcı Geri, checkout'tan ayrılma, bölge veya sepet değişimi bekleyen sonucu geçersiz kılar. İptal düğmesi odağı yeniden etkinleşen devam düğmesine döndürür.
- Başarısızlıkta sipariş oluşturulmaz; alanlar, adres, sepet ve bahşiş korunur. Hata mesajı odaklanır. Başarıda bahşiş dahil tutar mevcut sipariş sonucuna gider ve yalnız ilgili sepet/taslak temizlenir.

### Ödeme için HCI eşleştirmesi

| Kural | Uygulanan karşılık |
| --- | --- |
| K1 Tutarlılık | Ortak form, hata biçimi ve ödeme etiketleri; servis farkı yalnız uygun yöntemlerde |
| K2 Kısayollar | Kurgu kayıtlı kartı tek tıkla kullanma; CVV yeniden istenir |
| K3 Geri bildirim | İşleniyor, başarısızlık ve iptal mesajları; anlık toplam |
| K4 Kapanış | Başarıda sipariş numarası, tutar, adres ve yöntem içeren sonuç ekranına geçiş |
| K5 Hata yönetimi | Alan doğrulaması, açıklamalı pasif düğme, çift gönderim kilidi, tekrar deneme |
| K6 Geri dönüş | Ödeme öncesi adres/sepet düzenleme, bahşiş kaldırma, bekleyen işlemi iptal |
| K7 Kullanıcı kontrolü | Ödeme tercihi, isteğe bağlı kayıt/bahşiş, kayıt kaldırma |
| K8 Hafıza yükü | Seçili yöntem, teslimat adresi ve ücretlerin aynı ekranda görünmesi |

### Ödeme bölümünün teknik kontrolleri

Ödeme bölümü tamamlandığında `npm run build`, `node --test tests/*.test.mjs` ve `git diff --check` geçti. O aşamada **32/32 test**: önceki 16 + 16 yeni ödeme testi. Yeni testler yöntem kısıtları, alan/tarih doğrulaması, bahşiş/minimum ilişkisi, yalnız kurgu kimliği saklama, bozuk/engelli storage, çift gönderim, iptal ve tekrar denemeyi kapsar.

Tarayıcı kontrolü 1363 × 936 masaüstü görünümünde yapıldı:

| Senaryo | Gözlenen sonuç |
| --- | --- |
| CVV'yi iki hane girip alanı terk etme | Alana özel hata; devam düğmesi pasif; düzeltince etkin |
| Yemek yöntemleri arasında geçiş | Dört seçenek çalıştı; teslimatta ödemede kart formu kalktı; online'a dönüşte alanlar korundu |
| 50 TL bahşiş ekleme/kaldırma | Market toplamı 235,89 → 285,89 → 235,89 TL |
| İşlem sırasında iptal ve tarayıcı Geri | Sipariş oluşmadı; sepet/adres korundu; iptalde devam düğmesine odak geri geldi |
| Kurgu başarısız kartla deneme ve tekrar deneme | İlk denemede hata odaklandı; 370 + 50 TL korundu; tekrar denemede 420 TL sonuç oluştu |
| Sonraki Market checkout'unda kayıtlı kartı kullanma | Kurgu bilgiler geldi; CVV boş kaldı ve odaklandı |
| Ödeme sayfasını yenileme | Kart alanları temizlendi; adres ve sepet korundu |
| Kayıtlı kart tercihini kaldırma | Kısayol kaydı kaldırıldı |
| Market için online kartla tamamlama | 235,89 TL sonuç; Market sepeti boşaldı, Yemek'teki 1 ürün korundu |
| Klavye ile kart alanından checkbox'a geçiş | 3px görünür odak; 1363px'de yatay taşma yok |

Bu sonuçlar teknik kontrol bulgularıdır; katılımcı kullanılabilirlik testi veya tasarımın daha iyi olduğuna dair ölçülmüş sonuç değildir.

## Sipariş sonucu ve durum bölümünün davranışı

- Onay anında ürünler/adetler/birim fiyatlar, mağaza, adres/not/bölge, teslimat ücreti, bahşiş ve yöntem kopyalanır. Sepet temizlendikten veya yeni alışveriş/konum değişikliğinden sonra bu bilgiler değişmez. Sipariş toplamı aynı kuruş hesabıyla yeniden doğrulanır.
- `hci-yemeksepeti-last-demo-order-v1` anahtarı korunur. Aynı sekmede yalnız son sipariş saklanır; sekmeler/cihazlar arası senkronizasyon ya da gerçek sipariş geçmişi yoktur. Eski, ürün/adres içermeyen kayıtlar okunur; eksik ayrıntılar uydurulmaz.
- Saklanan nesne izin verilen alanlardan yeniden oluşturulur. Kart numarası/CVV veya bilinmeyen iç içe alanlar kayda girmez. Bozuk kayıt boş sonuç olarak ele alınır. Başarısız yazma önceki geçerli kaydı bozmaz; yeni sipariş açık sonuç ekranında gösterilir ve kullanıcıya kaydın saklanamadığı bildirilir.
- Yeni sipariş numaraları Yemek için `YMK-`, Market için `MKT-` ile başlar. Siparişin oluşma zamanı değişmez. Görselde eski `DEMO-` numaraları servis önekiyle gösterilir; mevcut kayıt yapısı okunmaya devam eder.
- Aktif durum **“Sipariş alındı” olarak sabittir**. Önceki 0/12/30/60 saniyelik ilerleme kaldırıldı; ekranda kalmak, yenilemek veya başka sayfadan dönmek durumu ilerletmez. Eski hızlandırılmış örnek kayıtlar da ürün/adres/tutar/numara korunarak onay durumunda gösterilir ve saklanır. Tahmini zaman katalogdaki örnek dakika aralığıdır; gerçek kurye tahmini veya teslim edildi saati üretilmez. Saatler Europe/Istanbul ile gösterilir.
- Sonuç başlığı ilk açılışta odaklanır. Onay mesajı metinle ve durum alanıyla görünürdür; otomatik değişim veya odak sıçraması yoktur. Tamamlanan adres/ödeme adımları değişiklik bağlantısı değildir. Sipariş ayrıntıları düğmesi ilgili başlığı odaklar.
- Yardım, sipariş durumu/ödeme/adres hakkında sayfa içinde açılan bilgi alanıdır. Destek temsilcisi, mesaj gönderimi, gerçek iptal veya iade servisi yoktur. Onay sonrası iptal kapsam dışıdır; K6 onay öncesi geri dönüş ve bekleyen işlemi iptal ile karşılanır.
- `/success` kayıtsız açıldığında açıklamalı boş durum ve alışverişe dönüş gösterilir. Tamamlanan siparişte alışverişe dönüş ilgili servisi açar.

### Ders içeriğiyle eşleştirme

Kaynaklar: yüklenen **Lec6-Design Rules.pdf**, özellikle s.7–10, 15–16, 18, 22–28 ve 34–37; **Lec5-Interaction design - III Prototyping.pdf**, s.2 ve 4–9; verilen Shneiderman sekiz kural görseli. Aşağıdaki eşleştirme tasarım gerekçesidir, kullanıcı başarısının ölçülmüş kanıtı değildir.

| Kural / ders kavramı | Bu akıştaki karşılığı |
| --- | --- |
| K1; tutarlılık ve gruplama | İki serviste aynı adım, özet, form ve durum bileşenleri; solda işlem/durum, sağda özet |
| K2; deneyimli kullanıcıya kısayol | Hazır kurgu adres ve kayıtlı kurgu kart tercihi; tekrar yazmayı azaltma |
| K3; observability, responsiveness, microinteractions | Alan/işlem hataları, işleniyor, iptal ve açık sipariş onayı |
| K4; synthesizability ve işlem kapanışı | Onay numarası, sabit sipariş ayrıntıları ve siparişin alındığını belirten sonuç; K4 için teslimatı canlandırmak gerekmez |
| K5; recoverability | Geçersiz alanı bulma, açıklama, sepeti kaybetmeden yeniden deneme |
| K6; geri alınabilirlik | Onaydan önce adres/sepet düzeltme, bahşiş kaldırma ve bekleyen işlemi iptal |
| K7; dialog initiative | Yöntem/bahşiş/kayıt tercihi; geri dönüş, yardım ve ayrıntılara erişim |
| K8; görünürlük, yakınlık ve bilişsel yük | Ürün, adet, toplam, adres ve yöntemin aynı akışta görünmesi; sonradan hatırlamayı gerektirmeyen sonuç |

### Sonuç/durum bölümünün teknik kontrolleri — ilk sürüm

`npm run build`, `node --test tests/*.test.mjs` ve `git diff --check` başarılı. Toplam **44/44 test**: önceki 32 + 12 yeni sipariş testi. Yeni testler bağımsız sipariş kopyası, tutar tutarlılığı, saklama alanının izinli alanları, eski/bozuk kayıt, başarısız yazma, eski kayıt yerine yeni sonucun seçilmesi, yenilemede ilerleme, dört zaman sınırı ve İstanbul saatini kapsar. Mevcut ödeme kaydı testi, geçersiz yazmanın önceki geçerli siparişi korumasına göre güncellendi.

Normal kullanıcı etkileşimleriyle **1363 × 936 masaüstünde** yapılan kontroller:

| Senaryo | Gözlenen sonuç |
| --- | --- |
| Yemek adresine not yazıp sepette adedi değiştirme | Not korundu; 2 Mercimek + 30 TL bahşiş = 220 TL nakit sipariş |
| Yemek sonucunu izleme, yenileme | Alındı/hazırlanıyor/kurye/teslim edildi gözlendi; numara, tutar, not ve adres aynı kaldı |
| Yardım ve sipariş bilgilerine klavyeyle erişme | Bilgi alanı açıldı; ayrıntı başlığı odaklandı, 3px görünür odak; durum değişimi odağı taşımadı |
| Yeni Yemek sepetine Tavuklu Pilav ekleyip önceki siparişi açma | Önceki sonuç hâlâ 2 Mercimek ve 220 TL; yeni sepet sipariş kopyasını değiştirmedi |
| Market adresini boş gönderme | Alan hataları ve ilk geçersiz alana odak |
| Market kurgu kartıyla ilk başarısız deneme | Ürünler/adres/bahşiş korundu; tekrar deneme çalıştı |
| Market siparişini tamamlama | Peynir 190,90 + ekmek 15 + teslimat 29,99 + bahşiş 50 = 285,89 TL; online yöntem ve adres doğru |
| Sipariş sonrası iki sepeti kontrol etme | Market boşaldı; Yemek'teki 1 ürün korundu |
| Market sonucunda Kötekli → Orhaniye seçme | Sipariş adresi Kötekli kaldı; durum ilerledi. Kontrol sonrası alışveriş konumu Kötekli'ye döndürüldü |
| Ayrı boş sekmede sonuç yolunu açma | Açıklamalı boş durum, başlık odağı ve alışverişe dönüş |
| Logo, ürün metni ve yerleşim | Resmî SVG yüklendi; ana sonuç içeriğinde demo/simülasyon etiketi ve 1363px'de yatay taşma yok |

Tarayıcıda gözlenen uygulama hatası yoktu. Ekran okuyucuyla duyuru testi, 1440px'de ayrı tarayıcı testi ve mobil test yapılmadı. Katılımcı başarısı/süresi ölçülmedi; hazırlanmış [test protokolü](MELISA_USABILITY_TEST.md) bu sonraki insan çalışması içindir. [Sunum rehberi](MELISA_DEMO_GUIDE.md) çalıştırma, kurgu veriler ve sabit onay akışını açıklar.

## Kart numarası engeli düzeltmesi — 9 Kasım 2026

Kullanıcı provasındaki “Bu kartla devam edilemiyor” mesajının nedeni iki kurgu numarayla sınırlı doğrulamaydı. Form doğrulaması ve ödeme çalıştırıcısı güncellendi: uygun biçimdeki başka bir örnek numara da başarılı yerel ödeme oluşturur. Eksik numara, geçersiz/geçmiş tarih ve CVV doğrulaması korunur. Bilinçli hata senaryosu yalnız `0000 0000 0000 0002` için sürer.

Kayıtlı kart akışı da yeni girişleri destekler: sadece son dört hane ve senaryo kimliği saklanır; kısayolda maskeli kart + yeniden CVV, başka karta geçişte boş alanlar gösterilir. Tam numara/CVV/ad/tarih tercihe kaydedilmez. Bu görsel kısayol güncellemesi React uygulamasındadır; mevcut Figma/ZIP bu düzeltmede değiştirilmedi.

Derleme, **49/49 test** ve `git diff --check` geçti. Beş yeni test; iki örnek dışındaki numarayla tamamlama, temel numara hatalarının korunması, maskeli kayıt/CVV davranışı, eski kayıt uyumluluğu ve geçersiz kayıt son ekini kapsar. Masaüstü tarayıcıda 15 haneli numara engellendi; `1234 5678 9012 3456`, `11/29`, dört haneli kurgu CVV ile **220,89 TL Market** siparişi tamamlandı. Sonraki Yemek akışında kayıt `•••• 3456` olarak göründü, eksik CVV engellendi, “Başka kart kullan” odağı boş ad alanına taşıdı ve kayıtlı kart + yeni CVV ile **180 TL Yemek** siparişi tamamlandı. Gerçek kart veya kullanıcı ekran görüntüsündeki numara test verilerine alınmadı. Önceki PR #10 kontrolü bu son düzeltmeden öncedir; tekrar merge/uyumluluk testi yapılmadı.

## Son kapsam değişikliği: sunumda sabit onay

Kullanıcının 9 Kasım provasındaki geri bildirimine göre hızlı kurye ilerlemesi sunumdan çıkarıldı. Yeni ve önceki örnek siparişler “Siparişin alındı” durumunda kalır. Alt aşamalar yol haritası olarak görünür; zamanlayıcı, arka planda ilerleme, elle ilerletme düğmesi ve uydurma tamamlanma saati yoktur. Sipariş ürünleri, adresi, yöntemi, tutarı ve numarası korunur. Yenilemede eski route state içindeki ilerlemiş durumun tekrar görünmesi de engellenir.

Bu karar sunum kapsamıdır; gerçek bir sipariş sisteminde durum güncellemelerinin gereksiz olduğu anlamına gelmez. K4, bu görevde sipariş verme işleminin onaylanmasıyla karşılanır; fiziksel teslimatı canlandırmak zorunlu değildir.

### Onay ekranının tasarım gerekçesi ve sınırı

Orijinal kayıtların yeniden çiziminde mevcut aşama, teslimat zamanı, kurye görseli, yardım ve açılabilen sipariş ayrıntıları zaten vardır. Bunların yokluğu iddia edilmez. Kullanıcının belirttiği animasyonu kaldırmak tek başına bir HCI iyileştirmesi değildir; hareketli kurye görseli durumun anlaşılmasına ve marka hissine katkı sağlayabilir. Önceki prototipte hareketli görselin uygulanmamış olması, orijinal animasyonun hatalı veya kullanılabilirliğinin düşük olduğuna dair bulgu değildir.

Yeni tasarımın amacı: K3 için aktif ve sonraki aşamaları metinle açıklamak; K4 için siparişin oluştuğunu başlık ve numarayla belirtmek; K8 için ürün/ücret özetini ayrı bir açma işlemi gerektirmeden göstermek; K1 için adres/ödeme/sonuçta aynı özet bileşenini korumak. Dikey liste daha fazla alan kullanır ve görsel karakteri sadeleştirir; bunun kullanıcıya faydası henüz ölçülmedi. Orijinalin kurye görseli/animasyonu korunarak da bu bilgi düzeni uygulanabilir. Sabit onay düzeltmesi animasyon eklememişti; sonraki ödeme UX düzeltmesinde küçük onay animasyonu eklendi. Orijinal kurye animasyonu kopyalanmadı; Figma/ZIP içindeki diğer durum örnekleri korunmuştur.

### Doğrulama

Derleme, **49/49 test** ve `git diff --check` geçti. Eski zaman çizelgesi testleri; önceki aşamaları sipariş ayrıntılarını değiştirmeden onaya alma ve eski gezinme kaydıyla yenilemede onayı koruma testleriyle değiştirildi. Masaüstü tarayıcıda önceki 180 TL siparişin numarası/ürünleri/adresi korunarak “Siparişin alındı” göründü; **101 saniye sonra** ve sayfa yenilendikten sonra aynı durumda kaldı. Bu, durumun otomatik ilerlemediğine dair teknik kontroldür; katılımcı kullanılabilirlik sonucu değildir.

## PR #10 ile birleştirme notu

İlk bölümde `feat/hci-responsive-a11y-undo-search` / `65e7641` ayrı geçici çalışma alanında kontrol edildi. Adres/özet özellikleri o dalın ortak Layout'u üzerine eklenince derleme ve 37 test geçti. Bu tarihsel kontrol ödeme bölümünü kapsamaz ve iki dalın otomatik/görsel olarak eksiksiz birleştiği anlamına gelmez.

Ödeme bölümünde aynı `65e7641` tabanındaki ayrı çalışma alanına güncel checkout, ödeme modeli, domain/sipariş modeli ve testler aktarıldı; PR #10'un `Layout.tsx` dosyası korundu. Derleme ve **53/53 test** geçti. Bu yalnız kod/veri uyumluluğu kontrolüdür; gerçek merge yapılmadı ve birleşik görünüm tarayıcıda doğrulanmadı.

Sonuç/durum bölümünde aynı kontrol güncel dosyalarla tekrarlandı: PR #10'un `Layout.tsx` dosyası yine değiştirilmeden **derleme ve 65/65 test** geçti. Bu sonuç ortak veri/kod uyumluluğunu destekler; Layout birleşiminin veya birleşik arayüzün doğrulandığı anlamına gelmez. O aşamada bu dalın kendi ana dal tabanındaki test sayısı 44'tü; 65 sayısı PR #10'un ek testlerini de içerir.

Her iki dal `Layout.tsx` ve `CheckoutPage.tsx` dosyalarını değiştiriyor. Birleştirirken PR #10'daki UndoToast, ana içerik tabIndex, sepet erişilebilir isimleri ve diğer sayfaların genişlik/uyarlanabilirlik değişiklikleri korunmalı. Checkout **ve sonuç** için 1184px sınırı/resmî logo koşulu, sonuçta güncel konum zorunluluğunun kaldırılması bunların üzerine uygulanmalı. Bu akış bölgeyi DeliveryContext'ten zaten ayrı gösterir; PR #10'un bölge etiketini açık adres alanına başlangıç değeri olarak yazması tekrar eklenmemeli. PR #10 birleştirilmedi ve dalına değişiklik gönderilmedi.
