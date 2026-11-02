# Yemeksepeti HCI Redesign — Eğitim Simülasyonu

Muğla Sıtkı Koçman Üniversitesi HCI dersi için dört kişilik ekip tarafından geliştirilen **çalışan web simülasyonu**. Resmî Yemeksepeti ürünü değildir. Gerçek sipariş veya ödeme alınmaz.

## Projeyi çalıştırma

Gereksinim: Node.js 20.19+ (veya Vite 7 ile uyumlu güncel Node.js).

1. Bu repoyu bilgisayarına klonla.
2. Terminalde npm install çalıştır.
3. npm run dev komutunu çalıştır.
4. Terminalde gösterilen yerel adresi tarayıcıda aç (genellikle http://localhost:5173).
5. Kontrol: npm run build.

## İlk demo akışları
- Giriş ekranından **YEMEK** veya **MARKET** seç.
- Örnek restoran/market ürünlerini ara, filtrele ve sepete ekle.
- Yemek ve Market sepetlerinin ayrı kaldığını gör.
- Ortak checkout'ta yalnız **sahte** isim ve adres gir; demo ödeme yöntemi seç.
- Demo sipariş onayını görüntüle. Kart numarası veya gerçek veri girme.

**Önemli:** İlk sürüm çalışan bir başlangıç iskeletidir; nihai 12 ekranın tamamının bitmiş hâli değildir. Hakan, Beyda ve Melisa kendilerine ait sayfaları geliştirerek bu akışları genişletecektir.

## Teknoloji
React 19, TypeScript, Vite, Tailwind CSS 4 ve React Router. Backend/database yok; örnek katalog verileri ve localStorage ile demo sepeti.

## Başlangıç belgeleri
- docs/PROJECT_SCOPE.md — MVP, kapsam dışı özellikler, kararlar.
- docs/UX_AUDIT.md — Simge'nin ekran görüntülerine dayalı ön araştırması.
- docs/HCI_8_RULES.md — 8 kuralın örnekleri, çözüm ve test ölçütleri.
- docs/DESIGN_SYSTEM.md — Figma ve React için ortak tasarım standardı.
- docs/SCREEN_REQUIREMENTS.md — 12 ekran ve sahipleri.
- docs/USER_FLOWS.md — iki sepet ve tek checkout sözleşmesi.
- docs/TEST_PLAN.md — Melisa için kullanılabilirlik testleri.
- docs/AI_AGENT_RULES.md — farklı AI agent'larıyla çalışırken değişmeyen kurallar.

## Görev dağılımı
| Sorumlu | Alan |
|---|---|
| **Simge** | UX araştırması, HCI denetimi, YEMEK/MARKET giriş sayfası |
| **Hakan** | Yemek keşfi, restoran/menü, yemek sepeti |
| **Beyda** | Market mağaza/ürün keşfi, market sepeti |
| **Melisa** | Teslimat adresi, ödeme simülasyonu, sipariş onayı, testler |

## GitHub çalışma düzeni
Her üye ayrı feature branch'inde çalışır. Pull Request açılır, en az bir ekip üyesi inceler. Main'e doğrudan push yapılmaz. PR şablonunda HCI kuralı, test ve ekran görüntüsü bulunur. Ortak tip ve token değişikliği ekip onayı gerektirir.

## Sınırlamalar ve güvenlik
Test amaçlı kurgu veri kullanılır; gerçek kişisel bilgiler, kart bilgileri ve ödeme işlenmez. Kullanıcı ekran görüntülerindeki hassas bilgiler GitHub'a yüklenmez. Gerçek ödeme entegrasyonu veya Yemeksepeti API'si bulunmaz.
