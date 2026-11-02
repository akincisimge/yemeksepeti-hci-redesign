# UX Audit — Simge, 2 Kasım 2026

## Yöntem ve sınırlar
Mevcut Yemeksepeti masaüstü arayüzünün 13 kullanıcı ekran görüntüsünün, hocanın Shneiderman 8 Golden Rules ilkeleriyle uzman ön değerlendirmesi. Kullanıcı testi yapılmadı. Kişisel adres, telefon veya ödeme bilgisi gösterebilecek ham ekran görüntüleri bu repoya yüklenmemelidir.

## İncelenen akışlar
- Restoran giriş, liste, kategori/filtre, kampanyalar.
- Gel Al hizmeti ve harita üzerinden keşif.
- Y-Market doğrudan ürün kataloğu, kategori ve sepet.
- Marketler mağaza keşfi/listesi.
- Sepet onayı ve ek ürün önerisi penceresi.
- Adres, ödeme yöntemi, isteğe bağlı bahşiş ve tamamla butonu.

## Görsel gözlemler (kanıtlanabilir)
- Üst navigasyonda dört hizmet: Restoran, Gel Al, Y-Market, Marketler.
- Y-Market önce ürünleri; Marketler önce mağazaları sunuyor.
- Restoran ekranında kampanyalar, QR uygulama tanıtımı, filtreler ve çok sayıda rozet var.
- Sepette ürün miktarı artırma/azaltma ve tutar özeti var — olumlu.
- Sepet sonrası ek ürün önerisi açılıyor; “Şimdilik atla” seçeneği var — olumlu kontrol.
- Adres ve ödeme ekranlarında form alanları, ödeme tercihi, isteğe bağlı bahşiş var.
- Son butonun pasif göründüğü durum var; bunun gerçek sebebi görüntüden belirlenemiyor.
- Sipariş sonrası başarı ekranı paylaşılmadığı için mevcut başarı deneyimi değerlendirilmedi.

## Araştırma hipotezleri
H1: İki net ana seçim hizmet seçimini kolaylaştırabilir fakat fazladan adım yaratabilir (K1, K7, K8).
H2: Y-Market ve Marketler adları arasında ilk seferde seçim güç olabilir (K1, K5, K8).
H3: Kampanya ve QR alanı, ilk restorana ulaşma süresini artırabilir (K7, K8).
H4: Çok sayıda kart/rozet, restoranda ürün seçmeyi yavaşlatabilir (K2, K8).
H5: Sepet sonrası öneri penceresi ana akışta kesinti yaratabilir; atlama kontrolü bunu hafifletebilir (K7).
H6: Pasif devam butonunun nedeninin yeterince açık olup olmadığı test edilmeli (K3, K5).

Bu hipotezler kullanıcı davranışına ilişkin **kanıtlanmış problem veya gerçek kullanıcı şikâyeti değildir**.

## HCI eşleştirmesi ve görev sahipliği
- K1 Tutarlılık: Simge + Beyda; hizmet isimleri ve ortak component'lar.
- K2 Evrensel kullanılabilirlik: herkes; bilgi okunurluğu ve erişilebilirlik.
- K3 Bilgilendirici geri bildirim: Hakan/Beyda/Melisa; filtre, sepet, form.
- K4 Tamamlanma hissi: Melisa; sipariş onayı.
- K5 Hata önleme: Hakan/Beyda/Melisa; sepet/checkout.
- K6 Geri alma: Hakan/Beyda; sepetten silme; Melisa; geri dönüş.
- K7 Kullanıcı kontrolü: Simge + Melisa; hizmet geçişi, öneri atlama.
- K8 Bellek yükünü azaltma: herkes; kart/filtre/checkout özeti.

## Araştırma sonunda doğrulama
Mevcut tasarım ile yeniden tasarım için aynı görevleri kullanarak karşılaştırma yapılacak: ilk hizmeti bulma, ürün arama, sepete ekleme, hatalı ürünü kaldırma, demo checkout'u tamamlama. Başarı, süre, hata sayısı ve kullanıcı yorumu raporlanmalı. Doğrulanmamış “daha hızlı/daha iyi” iddiaları sonuç bölümüne yazılmamalı.

Ayrıntılı uygulama önerileri: docs/HCI_8_RULES.md, docs/SCREEN_REQUIREMENTS.md.
