# Adres ve sipariş özeti — uygulama raporu

Tarih: 9 Kasım 2026. Temel: `main` / `d50e2ad`. Dal: `feat/melisa-checkout`. Bu rapor ilk uygulama bölümünü kapsar; ödeme formu ve sonuç ekranının tamamlandığını iddia etmez.

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
- Domain/context sözleşmeleri ve diğer ekip üyelerinin sayfaları değiştirilmedi. Yeni bağımlılık eklenmedi.

## Veri davranışı

Adres taslağı aynı sekmenin sessionStorage alanında servis + bölge anahtarıyla saklanır. Yenileme ve sepet düzenleme sonrası korunur; başka bölge/servise karışmaz. Bozuk veya erişilemeyen saklama alanı formu çökertmez. İsim/adres/not/yöntem dışındaki alanlar taslağa alınmaz. Kart numarası/CVV saklanmaz. Testlerde kurgu bilgiler kullanılmıştır.

Tutarlar kuruş cinsinden toplanır. Minimum sepet tutarına teslimat ücreti katılmaz. Market ücret/minimum bilgisi mevcut mağaza verisinden gelir. Yemek tarafında mevcut model bu değerleri tanımlamadığı için ek ücret uydurulmaz.

## Figma ile uygulama arasındaki farklar

- [Figma](https://www.figma.com/design/i6MQxPs8Ne0n8KucRnZlXk) 1440px tasarım referansıdır. Kod mevcut ortak tipografi ve renk token'larını kullanır.
- Örnek ürün/fiyat yerine güncel sepet verisi gösterilir. Modelde poşet ücreti bulunmadığı için Figma'daki örnek ücret koda sabitlenmez.
- Üst alanda Figma'nın örnek Yardım/Deniz kontrolleri yerine mevcut çalışan bölge/profil paneli korunur.
- Kart alanları, bahşiş ve ödeme hata durumları henüz uygulanmadı. Mevcut ödeme/sipariş simülasyonu geçiş olarak çalışır; Food nakit/kart, Market kart seçimi sunar.
- `SuccessPage.tsx` mevcut hâlindedir; eski demo etiketleri yeni sonuç ekranıyla sonraki bölümde ele alınacaktır.
- Figma'da üç adres ekranına kısayol kartı eklendi; kurye başlığı ve tek yöntemli Market hata metni düzeltildi; K2 panosu güncellendi. Önce ekranları korundu. Tıklanabilir Figma prototipi/Auto Layout kurulmadı.

## Tamamlanan teknik kontroller

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

## PR #10 ile birleştirme notu

`feat/hci-responsive-a11y-undo-search` / `65e7641` ayrı geçici çalışma alanında kontrol edildi. Checkout özellikleri o dalın ortak Layout'u üzerine eklenince derleme ve 37 test geçti. Bu kontrol veri/tip uyumluluğunu gösterir; iki dalın otomatik ve görsel olarak eksiksiz birleştiği anlamına gelmez.

Her iki dal `Layout.tsx` ve `CheckoutPage.tsx` dosyalarını değiştiriyor. Birleştirirken PR #10'daki UndoToast, ana içerik tabIndex, sepet erişilebilir isimleri ve diğer sayfaların genişlik/uyarlanabilirlik değişiklikleri korunmalı. Checkout için 1184px sınırı ve resmî logo koşulu bunların üzerine uygulanmalı. Bu akış bölgeyi DeliveryContext'ten zaten ayrı gösterir; PR #10'un bölge etiketini açık adres alanına başlangıç değeri olarak yazması tekrar eklenmemeli. PR #10 birleştirilmedi ve dalına değişiklik gönderilmedi.
