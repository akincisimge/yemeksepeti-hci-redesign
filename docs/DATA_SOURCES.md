# Adres ve demo katalog verileri

## Türkiye il/ilçe verileri
- Kaynak: Open Admin Data / turkey-administrative-divisions, https://github.com/open-admin-data/turkey-administrative-divisions
- Kaynak dosyaları: data/all-province.json ve data/all-district.json.
- Alınma tarihi: 8 Kasım 2026. 81 il ve 973 ilçe.
- Lisans: CC BY 4.0, Copyright (c) 2026 jakkrapongt. Lisans metni: docs/licenses/turkey-data.txt.
- Değişiklik: il kimliği, Türkçe adı ve ilçeleri seçilerek küçültüldü. Türkçe yazımlar talhaekrem/TurkiyeSehirVeIlcelerJSON kaynağındaki eşleşen il/ilçe adlarıyla düzeltildi; birleştirme işaretleri normalize edildi ve Türkçe sıralandı. src/data/turkey.ts içinde çevrimdışı kullanılır.
- Yazım referansı: https://github.com/talhaekrem/TurkiyeSehirVeIlcelerJSON (MIT, Copyright (c) 2021 talhaekrem); lisans docs/licenses/turkey-names.txt içindedir. Referans kaynak tek başına tüm ilçeleri içermediği için tam 973 ilçelik liste korunmuştur.
- Mahalle adları bu veri setinden gelmez. Kullanıcı mahalleyi elle yazar veya cihazın güncel konumundan gelen sonucu kontrol eder. Veri seti canlı bir resmî adres doğrulama servisi olarak sunulmaz.

## Cihaz konumu ve adres çözümleme
- Konum, yalnız kullanıcının Mevcut konumumu kullan düğmesine basmasıyla HTML Geolocation API üzerinden istenir. İzin reddedilince IP konumuna gizlice geçilmez; manuel seçim açılır.
- BigDataCloud ücretsiz client-side reverse-geocode endpoint'i kullanılır: https://www.bigdatacloud.com/docs/free-api/free-reverse-geocode-to-city-api
- Fair Use: yalnız cihazdan, izinle yeni alınmış cihaz koordinatlarıyla çağrılır. Sunucudan, toplu olarak veya kayıtlı/başka kişilere ait koordinatlarla çağrılmaz. https://www.bigdatacloud.com/docs/article/why-is-reverse-geocoding-api-free
- Koordinatlar adres çözümleme için sağlayıcıya gönderilir; uygulama localStorage'a hassas koordinat, tam sokak adresi veya kapı numarası kaydetmez. Seçilen il/ilçe/mahalle ve kaynak tipi saklanır.
- Sonuç ilçe/mahalle içermiyorsa doldurulmuş gibi gösterilmez; eksik alanlar kullanıcı tarafından tamamlanır. Türkiye dışı, izin reddi, zaman aşımı ve servis hatası durumları manuel akışa yönlendirir.
- Sağlayıcının canlı hizmet erişilebilirliği garanti edilmez. Tarayıcı testleri servis yanıtını taklit ederek gerçek kişisel koordinatların testten dışarı çıkmasını önler.

## Market ürünleri ve teslimat kapsamı
- Toplam 631 ürün, 12 kategori; market başına 200'ün üzerinde ürün. Gerçek fiyat, stok veya mağaza envanteri değildir.
- Yeni ürünler kategori, marka, paket miktarı ve birim fiyat içeren anlamlı mock varyantlardır. Rastgelelik kullanılmaz; kimlikler ve fiyatlar tekrarlanabilir.
- Eski ürün kimlikleri ve sepet bağlantıları korunur.
- Konum seçimi Türkiye geneline açılmıştır. Kötekli/Orhaniye/Bodrum demo senaryoları korunur; diğer doğrulanmış il/ilçe seçimleri örnek mağaza ağını gösterir. Bu, markaların gerçek teslimat kapsamı iddiası değildir.
- Filtreleme tüm katalogda çalışır; ekrana 24 ürünlük sayfalar getirilir. Filtre değişiminde ilk sayfaya dönülür; detaydan geri dönüşte URL'deki filtre ve sayfa korunur.
