# Proje kapsamı ve teknik kararlar — ekip onayı bekleyen taslak

## Amaç
Yemeksepeti'nin tüm özelliklerini kopyalamak yerine, temel yemek/market keşfi, sepet ve sipariş tamamlama akışlarını Shneiderman'ın 8 HCI ilkesiyle iyileştiren çalışan web simülasyonu üretmek. Bu bağımsız öğrenci projesidir.

## Çıktılar
1. GitHub'da React + TypeScript + Tailwind CSS uygulaması.
2. Figma'da ortak tasarım sistemi ve 12 ana ekran hedefi.
3. Ön UX analizi: mevcut ekran / HCI ilkesi / önerilen çözüm / test.
4. En az 5 gönüllüyle görev bazlı başlangıç kullanılabilirlik testi ve raporu.

## MVP dahil
- Giriş: YEMEK ve MARKET için açıklamalı iki seçim.
- YEMEK: restoran keşfi, arama, filtre, restoran menüsü, yemek sepeti.
- MARKET: Yemeksepeti Market ve diğer marketler ayrımı; ürün arama, filtre, detay ve market sepeti.
- Sepete ekle, miktar değiştir, sil, toplam göster ve ayrı sepetleri koru.
- Ortak checkout: örnek adres, demo ödeme yöntemi, sipariş özeti, başarı ekranı.
- Erişilebilir form etiketleri, klavye odağı, hata/başarı geri bildirimi.
- Responsive masaüstü ve mobil deneyimi.

## MVP dışında
- Gerçek banka/ödeme sağlayıcısı, kart numarası toplama, gerçek sipariş veya kurye.
- Yemeksepeti API'si, kullanıcı hesabı, gerçek SMS, harita/konum servisi.
- Canlı restoran verileri, indirim kuponu motoru, sadakat sistemi.
- Gel Al için tam ayrı sipariş akışı (ekip kararına açık).

## İlk uygulama iskeletinin sınırları
- Başlangıç kataloğu ve checkout çalışacak temel demonstrasyondur; 12 nihai ekran değildir.
- Ürünler ve fiyatlar kurgu/mock veridir; gerçek Yemeksepeti fiyatları değildir.
- Aynı servis sepetinde tek mağazanın ürünleri bulunur; mağaza değişince onay istenir.
- Yemek ve Market sepetleri karışmaz; checkout aynı bileşeni kullanır.
- Demo kart seçeneğinde gerçek kart bilgisi kesinlikle istenmez.
- localStorage yalnızca demo sepetini saklar. Gerçek kişisel bilgi kaydı yapılmaz.

## Ekip karar toplantısında kilitlenecek maddeler
- 12 ekranın nihai listesi ve Figma frame düzeni.
- Gel Al kapsamı ve Marketler alt akışının derinliği.
- Marka renkleri / font / erişilebilirlik testlerinin sonuçları.
- Ortak geliştirme branch/PR ve inceleme sorumluları.
- Son teslim tarihi, öğretmenin değerlendirme rubriği, demo barındırma yöntemi.

## Geliştirme komutları
Node.js 20.19+ veya uyumlu sürüm önerilir.
- npm install
- npm run dev
- npm run build
- npm run preview

İlk geliştirme dalında hazırlanan uygulama, diğer ekip üyelerinin ekranları için entegrasyon sözleşmesi sağlar; herkes kendi modülünü ayrı PR ile geliştirecek.
