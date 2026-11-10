# Yemeksepeti HCI Redesign — Çalışan eğitim simülasyonu

**ÖNCE BURADAN BAŞLAYIN:** [EKİP BAŞLANGIÇ REHBERİ — her üyenin görevleri, değiştirilecek ekranlar ve Figma kuralları](docs/START_HERE.md)

Bu repository HCI dersi kapsamında dört kişilik ekipçe geliştirilen **React + TypeScript + Tailwind CSS** simülasyonudur. **Resmî Yemeksepeti ürünü değildir. Gerçek ödeme veya sipariş alınmaz.**

## 1. Ekibe özel — kendi görevinize tıklayın

| Sorumlu | Sizin sorumlu olduğunuz tasarımlar | Görev rehberi |
|---|---|---|
| **Simge** | UX araştırması, 8 HCI kuralı incelemesi, YEMEK/MARKET giriş | [Simge'nin görevleri](docs/team/SIMGE.md) |
| **Hakan** | Yemek ana sayfa, restoran liste/filtre, detay/menü, yemek sepeti | [Hakan'ın görevleri](docs/team/HAKAN.md) |
| **Beyda** | Market ana sayfa, mağaza/ürün liste, ürün detay, market sepeti | [Beyda'nın görevleri](docs/team/BEYDA.md) |
| **Melisa** | Adres/özet, ödeme simülasyonu, onay ekranı ve kullanılabilirlik testleri | [Melisa'nın görevleri](docs/team/MELISA.md) |

Her kişisel rehberde **mevcut Yemeksepeti'nden gözlenen UX riski → ilgili HCI ilkesi → Figma'da değiştirilecek tasarım → React davranışı → test/kabul koşulu** yazıyor. Görüntü bazlı tespitler test edilene kadar kullanılabilirlik *hipotezidir*.

## 2. Ortak kurallar — herkes bunları okumalı

- **[Figma Design System](docs/DESIGN_SYSTEM.md):** renk kodları, font ve yazı boyutları, grid, spacing, Auto Layout, buton, input, kart, modal, durumlar ve responsive tasarım.
- **[Hocanın 8 HCI kuralı](docs/HCI_8_RULES.md):** Shneiderman'ın 8 kuralı, mevcut ekran örnekleri ve test.
- **[12 ekran ve kabul kriterleri](docs/SCREEN_REQUIREMENTS.md):** neyi, kimin tasarlaması ve geliştirmesi gerektiği.
- **[UX araştırması](docs/UX_AUDIT.md):** Simge'nin ekran görüntülerine dayalı ön analizi.
- **[Proje kapsamı](docs/PROJECT_SCOPE.md):** yapılacak/yapılmayacak özellikler.
- **[Kullanıcı akışları](docs/USER_FLOWS.md):** ayrı Yemek/Market sepetleri, ortak checkout.
- **[AI agent kuralları](docs/AI_AGENT_RULES.md):** farklı AI araçlarıyla tutarlı kod yazma.
- **[Test planı](docs/TEST_PLAN.md):** Melisa'nın görev bazlı testi.

**Başlangıç tasarım standartları ekip onayına sunulmuş önerilerdir;** herkes kendi başına farklı buton, font veya renk tanımlamamalıdır. Ortak kararlar [Issue #6](https://github.com/akincisimge/yemeksepeti-hci-redesign/issues/6) üzerinden netleştirilir.

## 3. Projeyi bilgisayarınızda çalıştırma

Node.js 20.19+ veya Vite 7 uyumlu güncel Node.js sürümü önerilir.

~~~bash
git clone https://github.com/akincisimge/yemeksepeti-hci-redesign.git
cd yemeksepeti-hci-redesign
npm install
npm run dev
~~~

Tarayıcıda terminalin gösterdiği yerel adresi açın (genellikle http://localhost:5173). Kontrol komutu: npm run build.

Mevcut başlangıç iskeleti iki hizmetli giriş, örnek arama/ürün kataloğu, ayrı sepetler ve **demo ödeme** içeren ortak checkout'u çalıştırır. **Nihai 12 ekranın tamamı henüz geliştirilmedi.**

## 4. Nasıl birlikte çalışacağız?

1. Kendi GitHub Issue ve görev rehberinizi okuyun, Figma ekranını wireframe olarak tasarlayın.
2. Aynı kurallarla yüksek detaylı Figma ekranı üretip React bileşenine dönüştürün.
3. Kendi branch'inizde çalışın: ör. feat/hakan-food-list, feat/beyda-market, feat/melisa-checkout.
4. Değişiklikten sonra npm run build çalıştırıp Pull Request açın. HCI kuralı, ekran görüntüsü ve test sonucunu açıklayın.
5. En az bir ekip üyesi incelemeden main'e birleştirmeyin.

**Public repo herkese görüntüleme izni verir; doğrudan kod yazma yetkisi vermez.** Ekip üyeleri için Write collaborator daveti veya fork + PR gerekir.

## 5. Güvenlik, veri kaynakları ve kapsam

- **İl, ilçe ve mahalle verisi:** Türkiye'nin 81 il, 973 ilçe ve gerçek mahalle verileri (`src/data/turkeyRegions.json`), PTT resmî posta kodu veri tabanından (`postakodu.ptt.gov.tr`) derlenen **MIT lisanslı** [`turkey-neighbourhoods`](https://github.com/muratgozel/turkey-neighbourhoods) (`v4.0.3`) paketinden üretilmiştir.
- **Kapsam:** Gerçek kişisel bilgiler, gerçek ödeme, banka/kart verileri veya canlı restoran teslimatı sunulmaz; sipariş takibi, sepet, profil ve canlı destek tarayıcı depolaması üzerinde çalışır.
