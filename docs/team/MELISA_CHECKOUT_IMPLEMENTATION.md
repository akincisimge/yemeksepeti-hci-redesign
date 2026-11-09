# Adres, sipariş özeti ve ödeme — uygulama raporu

Tarih: 9 Kasım 2026. Temel: `main` / `d50e2ad`. Dal: `feat/melisa-checkout`. Adres/özet ve ödeme bölümleri tamamlandı. Yeni sonuç/kurye ekranı henüz uygulanmadı. İlk bölüm `97315f3` commit'inde kayıtlıdır; aşağıdaki ödeme bölümü onun üzerine eklenmiştir.

## Değişiklik ve gerekçe

| Davranış | HCI karşılığı |
| --- | --- |
| Yemek/Market için ortak form, adım göstergesi ve özet | K1: tutarlılık |
| Kötekli'deki kurgu Ev adresini tek tıkla kullanma | K2: deneyimli kullanıcıya kısayol |
| Seçili adım, alan hatası, toplam ve minimum tutar açıklaması | K3: bilgilendirici geri bildirim |
| Sonraki adımın açık adı ve mevcut sipariş sonucuna geçiş | K4: kapanış; yeni sonuç tasarımı sonraki bölümde |
| Alan doğrulaması, ilk hatalı alana odak, boş/minimum altı sepet engeli | K5: basit hata yönetimi |
| Sepete/adrese dönme, taslağı koruma | K6: onay öncesi geri dönüş |
| Adres/sepet düzenleme ve ayrı son sipariş onayı | K7: kullanıcı kontrolü |
| Ürün, adet, birim fiyat ve ücretlerin görünürlüğü | K8: kısa süreli hafıza yükünü azaltma |

Yararlar hipotezdir; gerçek kullanıcı araştırması sonucu değildir. Başlangıç kodundaki hatalar orijinal Yemeksepeti'ne atfedilmez.

## Dosyalar ve ortak alanlar

- `src/features/checkout`: AddressForm, CheckoutSteps, OrderSummary ve doğrulama/tutar/taslak modeli.
- `src/pages/CheckoutPage.tsx`: ortak akış, servis/bölgeye ayrılmış taslak, geri dönüşler ve mevcut yerel sipariş simülasyonu.
- `src/components/Layout.tsx`: yalnız checkout yollarında resmî SVG logo, 1184px içerik sınırı, sade üst alan ve ekran içi demo alt bilgisinin kaldırılması. Diğer ekranların görünümü korunur.
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
- Kart alanları, bahşiş ve ödeme hata durumları ikinci bölümde uygulandı. Yemek dört yöntem, Market yalnız online kart sunar. Yemek kartları bu kapsamda teslimatta ödeme seçeneğidir; sağlayıcı/şirket bazında entegrasyon yoktur.
- Kurgu kayıtlı kartı seçme/kaldırma ve işlem sürerken iptal etme kontrolleri kısayol ve kullanıcı kontrolünü çalışır hâle getirir.
- `SuccessPage.tsx` görünümü henüz yenilenmedi; yeni ödeme yöntemlerinin etiketleri ve kart tercihi kaydedilememe mesajı eklendi. Eski demo etiketleri yeni sonuç ekranıyla sonraki bölümde ele alınacaktır.
- Figma'da üç adres ekranına kısayol kartı eklendi; kurye başlığı ve tek yöntemli Market hata metni düzeltildi; K2 panosu güncellendi. Önce ekranları korundu. Tıklanabilir Figma prototipi/Auto Layout kurulmadı.
- İkinci bölüm mevcut onaylı tasarım paketinin 4. sürümünü uygular. Bu kod aşamasında Figma veya ZIP dosyası değiştirilmedi.

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
- `paymentModel.ts` yalnız iki kurgu kart tanır. `0000 0000 0000 0000` başarılı olur. `0000 0000 0000 0002` aynı açık checkout'taki ilk tamamlanmış denemede hata verir, tekrar denemede başarılı olur. İptal edilen deneme bu senaryoyu tüketmez. Sunum için ad: Deniz Yılmaz, tarih: `12/30`, CVV: `000`. Bunlar banka test kartı değildir; gerçek kart/banka/ödeme servisi kullanılmaz.
- Yemek yöntemleri: online kart, nakit, kapıda kredi kartı, yemek kartları. Market yalnız online kart. Teslimatta ödeme seçimlerinde online kart alanları aranmaz.
- Bahşiş seçenekleri 0/30/50/75/100 TL'dir. Toplama eklenir; teslimat ücreti gibi minimum ürün tutarını tamamlamaz. “Şimdi değil” toplamı geri alır.
- Kart alanları React belleğindedir; saklama alanına veya route state'e yazılmaz. Aynı checkout içinde adrese dönüp gelince korunur; sayfadan ayrılma/yenileme sonrasında temizlenir. Bahşiş de yalnız açık akışta tutulur ve yenilemede 0'a döner. Adres taslağı korunur.
- “Sonraki siparişlerimde bu kartı kullan”, başarılı işlemden sonra yalnız `presentation-card` veya `retry-card` kimliğini aynı sekmenin sessionStorage alanına yazar. Kısayol önceden tanımlı kurgu bilgileri doldurur; CVV boş kalır ve odağı alır. Kaydı kaldırmak bu tercihi siler. Kart saklama/ödeme tokenizasyon hizmeti değildir.
- Yerel işlem 1,2 saniyelik gecikmeyle sonuçlanır. Senkron işlem kilidi ikinci denemeyi engeller. İptal, tarayıcı Geri, checkout'tan ayrılma, bölge veya sepet değişimi bekleyen sonucu geçersiz kılar. İptal düğmesi odağı yeniden etkinleşen devam düğmesine döndürür.
- Başarısızlıkta sipariş oluşturulmaz; alanlar, adres, sepet ve bahşiş korunur. Hata mesajı odaklanır. Başarıda bahşiş dahil tutar mevcut sipariş sonucuna gider ve yalnız ilgili sepet/taslak temizlenir.

### Ödeme için HCI eşleştirmesi

| Kural | Uygulanan karşılık |
| --- | --- |
| K1 Tutarlılık | Ortak form, hata biçimi ve ödeme etiketleri; servis farkı yalnız uygun yöntemlerde |
| K2 Kısayollar | Kurgu kayıtlı kartı tek tıkla kullanma; CVV yeniden istenir |
| K3 Geri bildirim | İşleniyor, başarısızlık ve iptal mesajları; anlık toplam |
| K4 Kapanış | Başarıda mevcut sipariş numarası/tutarı ekranına geçiş; yeni sonuç tasarımı bekliyor |
| K5 Hata yönetimi | Alan doğrulaması, açıklamalı pasif düğme, çift gönderim kilidi, tekrar deneme |
| K6 Geri dönüş | Ödeme öncesi adres/sepet düzenleme, bahşiş kaldırma, bekleyen işlemi iptal |
| K7 Kullanıcı kontrolü | Ödeme tercihi, isteğe bağlı kayıt/bahşiş, kayıt kaldırma |
| K8 Hafıza yükü | Seçili yöntem, teslimat adresi ve ücretlerin aynı ekranda görünmesi |

### Ödeme bölümünün teknik kontrolleri

Son kodda `npm run build`, `node --test tests/*.test.mjs` ve `git diff --check` geçti. Toplam **32/32 test**: önceki 16 + 16 yeni ödeme testi. Yeni testler yöntem kısıtları, alan/tarih doğrulaması, bahşiş/minimum ilişkisi, yalnız kurgu kimliği saklama, bozuk/engelli storage, çift gönderim, iptal ve tekrar denemeyi kapsar.

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

## PR #10 ile birleştirme notu

İlk bölümde `feat/hci-responsive-a11y-undo-search` / `65e7641` ayrı geçici çalışma alanında kontrol edildi. Adres/özet özellikleri o dalın ortak Layout'u üzerine eklenince derleme ve 37 test geçti. Bu tarihsel kontrol ödeme bölümünü kapsamaz ve iki dalın otomatik/görsel olarak eksiksiz birleştiği anlamına gelmez.

Ödeme bölümünde aynı `65e7641` tabanındaki ayrı çalışma alanına güncel checkout, ödeme modeli, domain/sipariş modeli ve testler aktarıldı; PR #10'un `Layout.tsx` dosyası korundu. Derleme ve **53/53 test** geçti. Bu yalnız kod/veri uyumluluğu kontrolüdür; gerçek merge yapılmadı ve birleşik görünüm tarayıcıda doğrulanmadı.

Her iki dal `Layout.tsx` ve `CheckoutPage.tsx` dosyalarını değiştiriyor. Birleştirirken PR #10'daki UndoToast, ana içerik tabIndex, sepet erişilebilir isimleri ve diğer sayfaların genişlik/uyarlanabilirlik değişiklikleri korunmalı. Checkout için 1184px sınırı ve resmî logo koşulu bunların üzerine uygulanmalı. Bu akış bölgeyi DeliveryContext'ten zaten ayrı gösterir; PR #10'un bölge etiketini açık adres alanına başlangıç değeri olarak yazması tekrar eklenmemeli. PR #10 birleştirilmedi ve dalına değişiklik gönderilmedi.
