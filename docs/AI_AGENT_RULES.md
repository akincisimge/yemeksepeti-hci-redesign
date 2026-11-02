# AI Agent ortak talimatları — tüm geliştiriciler için

Bu dosyayı kod üreten araca bağlam olarak verin; yalnızca kendi görev dosyalarınızı değiştirin.

## Projenin değişmezleri
- Öğrenci HCI simülasyonu; resmî Yemeksepeti değildir, gerçek ödeme veya sipariş yoktur.
- React + TypeScript + Vite + Tailwind v4.
- Shneiderman 8 Golden Rules ve docs/DESIGN_SYSTEM.md geçerli.
- Ortak türleri src/types/domain.ts içinde tut; sebepsiz alan adı değiştirme.
- Yemek/Market sepetleri ayrı; tek servis sepetine farklı mağazaları sessizce karıştırma.
- Checkout tek ortak bileşen: /checkout/food ve /checkout/market.
- Fiyatlar TL sayısal veri; gösterim formatTRY ile.
- Dış servis, gerçek hesap/konum, kart numarası, CVV ve erişim anahtarı ekleme.
- Ekran okuyucu ve klavyeyi destekle; ikonların erişilebilir isimleri olsun.

## Dosya sahipliği
- Simge: docs/UX_AUDIT.md, docs/HCI_8_RULES.md, src/pages/HomePage.tsx, ortak tasarım denetimi.
- Hakan: food katalog/arama/menü/sepet bileşenleri.
- Beyda: market katalog/mağaza/ürün/sepet bileşenleri.
- Melisa: ortak checkout, sonuç ekranı, docs/TEST_PLAN.md.
- Ortak dosya değişikliği: önce PR açıklamasıyla ekibe bildir, başka kişinin sayfasını izinsiz yeniden yazma.

## Kod ve PR kriterleri
- Önce ekranın hangi HCI problemine çözüm ürettiğini yaz.
- Küçük değişiklik, ayrı branch, anlaşılır commit, PR.
- npm run build hatasız çalışmalı.
- Arama için sıfır sonuç, formlar için error, sepet için empty ve sipariş için success durumlarını göster.
- Mobile 390px, desktop 1440px, klavye Tab/Enter ve odak testi.
- Tasarım token'larını keyfî değiştirme; gerekirse DESIGN_SYSTEM.md de güncellenir.
- Haricî asset / marka içeriğinde lisans ve mahremiyet kontrolü.

## AI çıktısı kontrol listesi
AI'nin ürettiği kod ekip üyesi tarafından okunmalı; route'lar, semantik HTML, keyboard, hata mesajları ve veri modelleri gözden geçirilmeden merge edilmez.
