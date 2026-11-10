import { DEMO_TRACKING_STEPS, type DemoOrder } from "../state/demoOrder.ts";

export type SupportContextInfo = {
  order: DemoOrder | null;
  locationText: string | null;
  accountName: string | null;
};

export type SupportAction = {
  label: string;
  to?: string;
  actionType?: "open-address" | "open-coupons";
};

export type SupportReply = {
  text: string;
  action?: SupportAction;
};

export const SUPPORT_TOPICS = [
  "Siparişim nerede? Takip etmek istiyorum",
  "Teslimat adresimi değiştirmek istiyorum",
  "Kuponumla ilgili yardım istiyorum",
  "Siparişimi iptal veya iade etmek istiyorum",
  "Demo hesap oluşturma hakkında sorum var",
] as const;

export function buildSupportReply(question: string, context: SupportContextInfo): SupportReply {
  const normalized = question.toLocaleLowerCase("tr").trim();

  if (/(sipariş|siparis|nerede|takip|kurye|durum|aşama|asama)/.test(normalized) && !/(iptal|iade)/.test(normalized)) {
    if (context.order) {
      const stage = DEMO_TRACKING_STEPS[context.order.stage];
      return {
        text: `${context.order.orderId} numaralı ${context.order.service === "food" ? "YEMEK" : "MARKET"} demo siparişin şu anda ${context.order.stage + 1}. aşamada (${stage.title}). Bu bir eğitim simülasyonudur; aşamaları takip sayfasından kendin ilerletebilirsin.`,
        action: { label: "Sipariş takibini aç", to: "/track" },
      };
    }
    return {
      text: "Bu tarayıcı sekmesinde henüz aktif bir demo sipariş bulunmuyor. Restoran veya marketten demo sipariş oluşturduktan sonra 4 aşamalı takip ekranını izleyebilirsin.",
      action: { label: "Restoranları keşfet", to: "/food" },
    };
  }

  if (/(adres|konum|ilçe|ilce|mahalle|şehir|sehir|bölge|bolge)/.test(normalized)) {
    const current = context.locationText
      ? `Şu anki demo konumun: ${context.locationText}.`
      : "Henüz teslimat konumu seçmedin.";
    return {
      text: `${current} 81 il arasından ilini arayabilir, örnek demo bölgeleri olan Muğla (Yemek & Market) veya Adana (yalnız Yemek) konumlarını seçebilirsin. Sepetini etkileyen değişimde önceden onay istenir.`,
      action: { label: "Teslimat konumunu aç", actionType: "open-address" },
    };
  }

  if (/(kupon|indirim|kampanya|kod|burger75|pizza25)/.test(normalized)) {
    return {
      text: "BURGER75, PIZZA25, DONER50, KEBAP60, EVYEMEGI40 ve TATLI35 örnek yemek kuponlarını Kuponlarım veya sepet alanından seçebilirsin. İndirim yalnızca ilgili restoranın kampanyalı ürünü ve minimum sepet tutarı sağlandığında uygulanır.",
      action: { label: "Kuponları incele", actionType: "open-coupons" },
    };
  }

  if (/(iptal|iade|para|ödeme|odeme|kart|ücret|ucret)/.test(normalized)) {
    return {
      text: "Bu uygulama HCI dersi için hazırlanmış bir öğrenci prototipidir; gerçek ödeme, kart çekimi, para iadesi veya canlı sipariş iptali yapılmaz. Sepetindeki ürünleri sepet ekranından tek tıkla azaltabilir veya temizleyebilirsin.",
      action: context.order ? { label: "Demo sipariş takibine git", to: "/track" } : { label: "Yemek sepetini aç", to: "/cart/food" },
    };
  }

  if (/(hesap|profil|kayıt|kayit|giriş|giris|üye|uye)/.test(normalized)) {
    const info = context.accountName
      ? `Şu anda "${context.accountName}" demo profiliyle işlem yapıyorsun.`
      : "Şu anda misafir kullanıcı olarak geziniyorsun.";
    return {
      text: `${info} Demo hesap bilgileri yalnızca kendi tarayıcının yerel depolamasında saklanır; sunucuya gönderilmez. Gerçek şifre veya kişisel veri girmeden hızlıca demo profili oluşturabilirsin.`,
      action: { label: "Demo hesap sayfasını aç", to: "/account" },
    };
  }

  if (/(merhaba|selam|teşekkür|tesekkur|sağol|sagol|yardım|yardim)/.test(normalized)) {
    return {
      text: "Merhaba! Ben otomatik demo destek asistanıyım. Sipariş takibi, teslimat bölgesi, örnek kuponlar veya demo hesap oluşturma konularında yukarıdaki başlıklardan birini seçebilir ya da sorunu kısaca yazabilirsin.",
    };
  }

  return {
    text: "Mesajın demo sohbet geçmişine eklendi. Bu öğrenci prototipinde gerçek müşteri temsilcisi bulunmuyor; ancak sipariş takibi, teslimat adresi, kuponlar ve demo hesap konularındaki hızlı butonları kullanarak ilgili ekrana doğrudan geçebilirsin.",
    action: context.order ? { label: "Sipariş takibini aç", to: "/track" } : undefined,
  };
}
