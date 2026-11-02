# Beyda — Market bölümü (4 ana ekran)

## Mevcut Yemeksepeti'nde gözlenen / düzeltilecek riskler
- **Y-Market** doğrudan ürün listesine; **Marketler** önce mağaza seçimine gidiyor. Kullanıcının iki hizmeti ayırt etmesi gerekebilir (K1/K8).
- Kartlarda indirim/uzun ürün adları, yoğun fiyat etiketleri var; kritik bilgiler kolay okunmalı (K2/K8).
- Türkçe akışta bazı bilgi etiketleri İngilizce görünüyor; terminoloji tek dilde ve tutarlı kalmalı (K1).
- Mevcut sepette +/- ve silme var, bu **olumlu** özelliği koru (K3/K6).
- Kullanıcının fiilen zorlandığı henüz test edilmedi.

## Dört ekran, ne yapmalısın?
1. **Market ana sayfası** — "Yemeksepeti Market" (doğrudan ürün) ve "Diğer Marketler" (mağaza seçimi) etiketlerini açık ve ayrı göster.
2. **Mağaza/kategori/ürün listeleme** — seçili mağaza görünür; kategori, arama, filtre, sıfır sonuç ve filtre temizle.
3. **Ürün detay** — ürün adı, görsel, miktar/birim, yeni/eski fiyat (varsa), indirim, ekleme ve geri bildirim.
4. **Market sepeti** — ürün listesi, +/- adet, silme, minimum sepet koşulu (simüle ediliyorsa açıklaması), ara toplam ve "/checkout/market" yönlendirmesi.

## Figma kuralları
- "04 – Beyda" sayfasında dört ekran Desktop 1440px + Mobile 390px, Tablet 768px kontrolü.
- Aynı ProductCard, Search/Filter, CartItem, Header ve Button component'larını kullan.
- Ürün adı → birim → fiyat → sepete ekle sırası; kritik metni kesme; yalnız renkle indirim anlatma.
- Bir ürün eklendiğinde "Sepete eklendi" mesajı; boş sepet, farklı mağazaya geçiş onayı gibi durumları da tasarla.

## Kod/sınırlar
- Başlangıç "/market" route'u src/pages/CatalogPage.tsx içindeki örnek katalogdur, nihai ekran değil.
- Yeni market UI'ını src/features/market altında düzenleyebilirsin. src/types/domain.ts ve src/state/CartContext.tsx ortak sözleşmeler; koordine etmeden değiştirme.
- Market sepeti food sepetinden bağımsızdır; **bir market sepetine farklı mağazaların ürünleri sessizce karışmamalı**.
- Gerçek market API'si, ödeme veya gerçek kişisel veri yok.

## Test/kabul
- Kullanıcı Market → market türü/mağaza → ürün → market sepeti → checkout geçer.
- Market türleri arasındaki farkı kullanıcı ekrandan anlayabilir (K1/K8, test hipotezi).
- Sepetten miktar değiştir/sil işlevleri çalışır (K6).
- Metin okunur, filtre ve ekleme geri bildirimi net, klavye/mobil uyumlu.
- İlgili issue: https://github.com/akincisimge/yemeksepeti-hci-redesign/issues/4
