# EKİP BAŞLANGIÇ REHBERİ — İlk bunu okuyun

Bu sayfa Figma tasarımı ve çalışan React simülasyonu için ortak başlangıç noktasıdır. **GitHub Public olduğundan herkes görebilir; doğrudan push için Write izni, aksi hâlde fork + pull request gerekir.**

## İlk 10 dakikada yapılacaklar
1. [Kendi görev dosyanı aç](#kişi-bazlı-başlangıç-linkleri).
2. [Tasarım standardını oku](DESIGN_SYSTEM.md): renk, tipografi, grid, buton, form, kart, mobil, geri bildirim.
3. [8 HCI kuralını oku](HCI_8_RULES.md): mevcut Yemeksepeti'nden örnek, iyileştirme ve nasıl test edileceği.
4. [MVP kapsamını oku](PROJECT_SCOPE.md): gerçek ödeme, API veya backend yok.
5. Figma'da görev sayfalarını **önce wireframe**, sonra high-fidelity yap; React ekranına uygula.
6. Her ekran için "mevcut durum → HCI kuralı → önerdiğim düzeltme → nasıl test ederim" notunu hazırla.
7. Kodunu kendi feature branch'inde geliştir, PR aç; ana dala doğrudan push yapma.

## Kişi bazlı başlangıç linkleri
| Sorumlu | Ekranlar | Ayrıntılı görev dosyası | GitHub görevi |
|---|---|---|---|
| **Simge** | YEMEK / MARKET giriş + UX araştırması | [SIMGE.md](team/SIMGE.md) | [#2](../issues/2) |
| **Hakan** | Yemek ana sayfa, restoran filtre/liste, detay/menü, sepet | [HAKAN.md](team/HAKAN.md) | [#3](../issues/3) |
| **Beyda** | Market ana sayfa, mağaza/ürün liste, ürün detay, sepet | [BEYDA.md](team/BEYDA.md) | [#4](../issues/4) |
| **Melisa** | Adres/özet, demo ödeme, sipariş onayı, test | [MELISA.md](team/MELISA.md) | [#5](../issues/5) |

> Bu yolları GitHub dosya bağlantılarıyla açabilirsiniz. Hedef 12 ana ekran: Simge 1, Hakan 4, Beyda 4, Melisa 3. Simge ayrıca araştırma ve ortak UX incelemesinden sorumlu.

## Herkesin uyacağı HCI kuralları
| Kural | Kodda / Figma'da somut gereksinim |
|---|---|
| K1 — Tutarlılık | Aynı renk, buton, header ve sepet etkileşimi |
| K2 — Evrensel kullanım | Kontrast, okunabilir metin, klavye odağı, mobil |
| K3 — Bilgilendirici geri bildirim | Ekle/filtrele/hata sonuçlarını metinle göster |
| K4 — Tamamlanma hissi | Demo siparişte ayrı başarı özeti |
| K5 — Hata önleme | Gerekli alan doğrulama ve açık pasif buton nedeni |
| K6 — Kolay geri alma | Sepette miktar düzeltme, sil, geri dön |
| K7 — Kullanıcı kontrolü | Açık bölüm geçişi, atlanabilir öneriler |
| K8 — Kısa süreli bellek yükü | Filtre/ürün/ücret/toplamı görünür tut |

## Tasarım standardı — hızlı referans
- **Figma frame:** Desktop 1440px, Tablet 768px, Mobile 390px.
- **Font:** Inter, yedek sistem sans-serif. Body 16/24, açıklama 14/20, H1 desktop 40/48.
- **Renk:** Primary #D90049, hover #B6003C, sayfa #F8FAFC, kart #FFFFFF, ana yazı #0F172A, border #CBD5E1.
- **Spacing:** 4, 8, 12, 16, 24, 32, 48, 64px. Buton/input radius 12px, kart 16px.
- **Bileşen:** Button, Input, Search, Filter, Header, RestaurantCard, ProductCard, CartItem, OrderSummary, Toast/Modal.
- **States:** Default, hover, focus, disabled; gerektiğinde empty/error/success.
- **Figma Auto Layout kullan**, ortak component instance'larını tercih et. Ayrıntı ve istisnalar [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) dosyasında.
- **Not:** Bunlar ekibin son onayına sunulan ortak başlangıç değerleridir; aynı anda herkesin ayrı renk/font belirlemesi kabul edilmez.

## Çalışan kod mimarisi
- Stack: React + TypeScript + Vite + Tailwind 4 + React Router.
- Ana yollar: giriş "/" → "/food" veya "/market" → "/cart/food" veya "/cart/market" → "/checkout/food" veya "/checkout/market" → "/success".
- Başlangıç kodu **nihai 12 ekran değildir**. Katalog ve checkout ilk örnekleri ortak iskelet olarak eklenmiştir.
- Ortak türler: [src/types/domain.ts](../src/types/domain.ts). Örnek veri: [src/data/catalog.ts](../src/data/catalog.ts). Sepet: [src/state/CartContext.tsx](../src/state/CartContext.tsx). Uygulama rotaları: [src/App.tsx](../src/App.tsx).
- **İki ayrı sepet, ortak checkout.** Gerçek ödeme, kart verisi, gerçek teslimat, SMS, kullanıcı hesabı ve API yoktur.
- Herkes kendi UI bileşen ve ekranını geliştirsin; ortak dosya değiştirecekse önce PR açıklamasında ekibe duyursun.

## Ekip çalışma akışı
- GitHub Issue içeriğini oku → kendi branch'in → kendi Figma frame'in → React kodu → npm run build → PR.
- PR'da hangi HCI sorununun çözüldüğünü, önce/sonra ekran görselini ve nasıl test edildiğini yaz.
- [Ortak kapsam ve Design System onayı #6](../issues/6) herkesçe tamamlanmalı.
- Test raporunu Melisa koordine eder; Simge HCI bulgularını günceller.
- Kişisel bilgiler içeren gerçek ekran görüntülerini Public GitHub'a yüklemeyin.

## Kurulum
Node.js güncel sürüm (Vite 7 uyumlu) kurulu olmalı:
~~~bash
git clone https://github.com/akincisimge/yemeksepeti-hci-redesign.git
cd yemeksepeti-hci-redesign
npm install
npm run dev
~~~
İlk geliştirme sürümü örnek etkileşimleri gösterir; bitmiş ürün iddiasında bulunulmaz.
