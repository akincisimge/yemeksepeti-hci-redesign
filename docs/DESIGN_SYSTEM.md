# Design System v0.1 — Figma + kod ortak standardı

**Durum:** Başlangıç önerisi; ekip toplantısında onaylanacak. Bu dosya Figma değişkenleri, React bileşenleri ve Tailwind token'ları için tek referanstır.

## 1. Görsel dil ve token'lar
- Primary: #D90049 (demo erişilebilirlik için koyulaştırılmış pembe)
- Primary hover: #B6003C
- Text primary: #0F172A
- Text secondary: #475569
- Surface: #FFFFFF
- Background: #F8FAFC
- Border: #CBD5E1
- Success text: #166534
- Error text: #991B1B
- Font ailesi: Inter, sistem sans-serif yedeği.
- Tipografi: H1 36–48 px; H2 24–30 px; H3 18–20 px; body 16 px / 24 px; yardımcı metin 14 px.
- Spacing: 4, 8, 12, 16, 24, 32, 48 px; aralıklar keyfî seçilmez.
- Radius: input/button 12 px, kartlar 16–24 px.
- Kutu genişliği: 1152 px max; 1440 px Figma desktop artboard, 390 px mobile artboard.
- Desktop: 12 kolon düşünülür; mobil: tek kolon; içerik ölçeklenir.

## 2. Bileşen sözleşmeleri
**Button:** primary, secondary ve destructive varyantları; default/hover/focus/disabled/loading durumları. Metin eylemi açıklamalı: “Sepete ekle”, “Siparişi tamamla”. Yalnız ikona dayalı butonda aria-label gerekir. Minimum görsel yükseklik 44 px proje tercihi.

**Input:** Kalıcı etiket, isteğe bağlı placeholder, gerekli alan işareti, geçerli/hatalı durum, hata metni. Hata mesajı alanla ilişkilendirilir.

**Search + Filter:** Görev odaklı arama; seçili filtre açık, temizleme görünür, sonuç sayısı metin olarak verilir; boş sonuç ekranı öneri içerir.

**Product/Restaurant Card:** Başlık, açıklama, fiyat/puan/teslimat bilgisi sabit sırada; kritik metin kırpılmaz. Promosyon kartı ana eylemi bastırmamalı.

**Cart:** Ürün adı, birim fiyat, miktar, ara toplam ve eksik koşul açık; miktar değişimi anında görüntülenir. Negatif miktar olmaz.

**Checkout:** Gerçek kart verisi yok; demo yöntemi açık; gider kalemleri görünür; geri dönüş bağlantısı var; başarı ekranı ayrı.

**Toast/Status:** Olayın sonucunu söyleyen metin: “Ürün sepete eklendi”; yalnız renk/ikon yeterli değil. Ekran okuyucu için gerekirse role=status/alert.

## 3. Erişilebilirlik (test zorunlu)
- Hedef WCAG 2.2 AA; normal metin en az 4.5:1, büyük metin 3:1 kontrast (uygun istisnalar saklı).
- Klavye odağı görünür; erişilebilir isimler; doğru başlık hiyerarşisi; form hataları metinsel.
- Normal etkileşimler klavyeyle erişilebilir; hover'a bağımlı işlev yok.
- Zoom 200% ve 390 px mobilde yatay taşma kontrolü.
- Renk tek başına durum belirtmez; kırmızı yanında hata metni bulunur.

## 4. Figma organizasyonu
Ortak Figma dosyasında:
- 00 Foundations — renk, typography, grid, spacing.
- 01 Components — Button, Input, Search, Header, Card, CartItem, Modal, Toast.
- 02 Simge — giriş ekranı.
- 03 Hakan — yemek ekranları.
- 04 Beyda — market ekranları.
- 05 Melisa — checkout/onay ekranları.
- 06 Prototype — tüm bağlantılar.
- 07 Research & Tests — bulgular, senaryolar.

Başlamadan önce ortak component adlarını ve token'ları seçin. Tüm ekranlarda aynı component'a yerel kopya yerine ortak component kullanın.

## 5. Kod standardı
Tailwind renkleri src/index.css içindeki @theme ile tanımlanır. Ortak komponent değişikliği ayrı PR'da incelenir. Varsayılan durum yanında hover, focus, disabled, empty, error, success varyantları düşünülür. Tasarım kararları PR açıklamasında HCI kuralı ile gerekçelendirilir.

## 6. Ekipçe onay gerektiren noktalar
Marka görselleri, gerçek Yemeksepeti fontu ve logoyu birebir kullanma gerekliliği, ürün kartı boşlukları, demo fiyat/teslimat ücretleri ve mobil grid. Başlangıç token'ları nihai karar değildir.
