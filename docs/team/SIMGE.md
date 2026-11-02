# Simge — UX araştırması ve YEMEK / MARKET giriş ekranı

## Mevcut Yemeksepeti'nde gözlenen
Üst gezinmede Restoran, Gel Al, Y-Market ve Marketler birlikte yer alıyor. Y-Market doğrudan ürünleri açarken Marketler mağaza seçtiriyor. İlk kez kullanan biri için farkların anlaşılması gerektiği **test edilmesi gereken hipotezdir**, kesin ihlal değildir.

**HCI:** K1 tutarlılık, K7 kullanıcı kontrolü, K8 bellek yükünü azaltma; bütün ekranlar için K2 erişilebilirlik denetimi.

## Tasarlaman gereken ekran
1. **YEMEK/MARKET başlangıç sayfası**: iki büyük, eşit görünürlükte kart; hizmeti açıklayan başlık/yardımcı metin/ikon; açık yönlendirme.
2. Tasarımın desktop (1440) ve mobile (390) varyantı; tablet düzen kontrolü.
3. Kullanıcı YEMEK'e basınca Hakan'ın "/food" sayfasına, MARKET'e basınca Beyda'nın "/market" sayfasına gider.
4. Her sayfada menü üzerinden diğer bölüme geçiş mümkün olmalı. Girişte gereksiz hesap veya adres zorunluluğu koyma.

## Araştırma sorumluluğu
- [UX_AUDIT.md](../UX_AUDIT.md) ile ekran görüntülerinden ön bulgu ve olumlu özellikleri kaydet.
- [HCI_8_RULES.md](../HCI_8_RULES.md) ilkelerinin her sayfada uygulanmasını incele.
- Diğerlerinin kendi sayfalarını onların yerine tasarlama: HCI geri bildirimleri issue/PR'da ver.
- Önce/sonra karşılaştırmasında "iki kart daha anlaşılır mı, yoksa gereksiz adım mı?" sorusunu test et.

## Figma kontrolü
- Figma page: "02 – Simge"; frame "Simge / Home / Desktop / Default" ve Mobile.
- Ortak renk, font, spacing, radius ve Button/Card instance kullan.
- Her karta klavye odağı ve açıklayıcı erişilebilir ad ver.
- Uzun açıklamalar mobilde kırılmasın; ana eylemler aynı görsel önemde olsun.

## Kod ve kabul
- Ana sayfa: src/pages/HomePage.tsx; ortak header için ekipten onay.
- "/" → "/food" ve "/" → "/market" doğru çalışır.
- 390px ve 1440px'de taşma yok; Tab ve Enter ile kartlar açılır.
- UX ön hipotezi ve ilgili K1/K7/K8 gerekçesini PR'a yaz.
- İlgili issue: https://github.com/akincisimge/yemeksepeti-hci-redesign/issues/2
