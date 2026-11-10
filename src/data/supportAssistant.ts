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
  "Hesap oluşturma hakkında sorum var",
] as const;

export function buildSupportReply(question: string, context: SupportContextInfo): SupportReply {
  const normalized = question.toLocaleLowerCase("tr").trim();

  if (/(sipariş|siparis|nerede|takip|kurye|durum|aşama|asama)/.test(normalized) && !/(iptal|iade)/.test(normalized)) {
    if (context.order) {
      const stage = DEMO_TRACKING_STEPS[context.order.stage];
      return {
        text: `${context.order.orderId} numaralı ${context.order.service === "food" ? "YEMEK" : "MARKET"} siparişin şu anda ${context.order.stage + 1}. aşamada (${stage.title}). Güncel durumu sipariş takibi ekranından inceleyebilirsin.`,
        action: { label: "Sipariş takibini aç", to: "/track" },
      };
    }
    return {
      text: "Şu anda aktif bir siparişin bulunmuyor. Restoran veya marketten sipariş oluşturduktan sonra teslimat aşamalarını canlı olarak takip edebilirsin.",
      action: { label: "Restoranları keşfet", to: "/food" },
    };
  }

  if (/(adres|konum|ilçe|ilce|mahalle|şehir|sehir|bölge|bolge)/.test(normalized)) {
    const current = context.locationText
      ? `Şu anki teslimat konumun: ${context.locationText}.`
      : "Henüz teslimat konumu seçmedin.";
    return {
      text: `${current} 81 il arasından ilini arayabilir, teslimat kapsamındaki ilçe ve mahallelerden birini seçebilirsin. Sepetini etkileyen bir adres değişikliğinde onay istenir.`,
      action: { label: "Teslimat konumunu aç", actionType: "open-address" },
    };
  }

  if (/(kupon|indirim|kampanya|kod|burger75|pizza25)/.test(normalized)) {
    return {
      text: "BURGER75, PIZZA25, DONER50, KEBAP60, EVYEMEGI40 ve TATLI35 kuponlarını Kuponlarım veya sepet alanından seçebilirsin. İndirim, ilgili restoranın kampanyalı ürünü ve minimum sepet tutarı sağlandığında uygulanır.",
      action: { label: "Kuponları incele", actionType: "open-coupons" },
    };
  }

  if (/(iptal|iade|para|ödeme|odeme|kart|ücret|ucret)/.test(normalized)) {
    return {
      text: "Bu arayüzde gerçek kart tahsilatı yapılmadığı için ödeme veya iade işlemi oluşmaz. Sepetindeki ürünleri sepet ekranından düzenleyebilir veya temizleyebilirsin.",
      action: context.order ? { label: "Sipariş takibine git", to: "/track" } : { label: "Yemek sepetini aç", to: "/cart/food" },
    };
  }

  if (/(hesap|profil|kayıt|kayit|giriş|giris|üye|uye)/.test(normalized)) {
    const info = context.accountName
      ? `Şu anda "${context.accountName}" profiliyle işlem yapıyorsun.`
      : "Şu anda misafir kullanıcı olarak geziniyorsun.";
    return {
      text: `${info} Hesap bilgilerin tarayıcında güvenle tutulur; sipariş tamamlama sırasında bilgilerini tek tıkla doldurabilirsin.`,
      action: { label: "Hesap sayfasını aç", to: "/account" },
    };
  }

  if (/(merhaba|selam|teşekkür|tesekkur|sağol|sagol|yardım|yardim)/.test(normalized)) {
    return {
      text: "Merhaba! Sipariş takibi, teslimat bölgesi, kuponlar veya hesabınla ilgili yukarıdaki başlıklardan birini seçebilir ya da sorunu kısaca yazabilirsin.",
    };
  }

  return {
    text: "Mesajın alındı. Sipariş takibi, teslimat adresi, kuponlar ve hesap konularında hızlı erişim düğmelerini kullanarak ilgili sayfaya doğrudan geçebilirsin.",
    action: context.order ? { label: "Sipariş takibini aç", to: "/track" } : undefined,
  };
}
