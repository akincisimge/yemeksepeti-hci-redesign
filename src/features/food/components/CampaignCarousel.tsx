import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFoodCoupon } from "../state/FoodCouponContext";

type CampaignSlide = {
  code: string;
  restaurantId: string;
  restaurantName: string;
  badge: string;
  title: string;
  image: string;
  imageAlt: string;
};

const slides: CampaignSlide[] = [
  {
    code: "BURGER75",
    restaurantId: "food-crispy-co",
    restaurantName: "Crispy Co Burger",
    badge: "75 TL ekstra indirim",
    title: "Double Cheddar Menü + BURGER75 ile 75 TL Ekstra İndirim",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=85",
    imageAlt: "Peynirli burger ve çıtır patates",
  },
  {
    code: "PIZZA25",
    restaurantId: "food-meydan-pizza",
    restaurantName: "Meydan Pizza",
    badge: "%25 kupon indirimi",
    title: "%25 Kupon İndirimi: Büyük Boy Karışık Pizza Menüsü (PIZZA25)",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=85",
    imageAlt: "Fırından yeni çıkmış karışık pizza",
  },
  {
    code: "DONER50",
    restaurantId: "food-usta-yaprak-doner",
    restaurantName: "Usta Yaprak Döner",
    badge: "50 TL kupon indirimi",
    title: "Tereyağlı İskender Menüsünde 50 TL Kupon Fırsatı (DONER50)",
    image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=800&q=85",
    imageAlt: "Lavaşta döner ve taze sebzeler",
  },
  {
    code: "KEBAP60",
    restaurantId: "food-citir-antep",
    restaurantName: "Çıtır Çıtır Antep Sofrası",
    badge: "60 TL kupon indirimi",
    title: "Karışık Kebap & Lahmacun Menüsünde 60 TL Kupon (KEBAP60)",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=85",
    imageAlt: "Izgara kebap ve közlenmiş sebzeler",
  },
  {
    code: "EVYEMEGI40",
    restaurantId: "food-anne-eli",
    restaurantName: "Anne Eli Zeytinyağlı",
    badge: "40 TL kupon indirimi",
    title: "Günün Ev Yemeği Menüsünde 40 TL Kupon (EVYEMEGI40)",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=85",
    imageAlt: "Ev usulü taze yemek ve sebzeler",
  },
  {
    code: "TATLI35",
    restaurantId: "food-tatlici-kosk",
    restaurantName: "Tatlıcı Köşk & Waffle",
    badge: "35 TL kupon indirimi",
    title: "Waffle & Tatlı Molası (TATLI35)",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=85",
    imageAlt: "Taze meyveli tatlı ve waffle",
  },
];

export default function CampaignCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const navigate = useNavigate();
  const { setActiveFoodCoupon } = useFoodCoupon();

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % slides.length);
    }, 3500);
    return () => window.clearInterval(timer);
  }, [paused]);

  const showSlide = (index: number) => {
    setActiveIndex((index + slides.length) % slides.length);
  };

  const openCampaign = (slide: CampaignSlide) => {
    setActiveFoodCoupon(slide.code);
    navigate(`/food/${slide.restaurantId}?campaign=true`);
  };

  return (
    <section
      aria-label="Günün Kampanyaları"
      className="min-w-0 overflow-hidden rounded-2xl border border-[#CBD5E1] bg-white shadow-sm"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!(event.relatedTarget instanceof Node) || !event.currentTarget.contains(event.relatedTarget)) {
          setPaused(false);
        }
      }}
    >
      <div className="flex items-center justify-between gap-2 px-4 pb-2 pt-4">
        <h2 className="min-w-0 break-words text-lg font-bold text-[#0F172A]">Günün Kampanyaları</h2>
        <span className="text-sm text-[#475569]">{activeIndex + 1} / {slides.length}</span>
      </div>
      <div className="relative aspect-[4/3] min-h-56 overflow-hidden bg-[#0F172A]">
        {slides.map((slide, index) => (
          <button
            type="button"
            key={slide.code}
            tabIndex={index === activeIndex ? 0 : -1}
            aria-label={`${slide.badge}: ${slide.title}. Kampanyalı menüyü gör ve kuponu kullan`}
            onClick={() => openCampaign(slide)}
            className={`absolute inset-0 h-full w-full text-left transition-opacity duration-700 ease-in-out focus-visible:outline-4 focus-visible:outline-inset focus-visible:outline-white ${
              index === activeIndex ? "z-10 opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.imageAlt}
              className="absolute inset-0 h-full w-full object-cover"
              loading={index === 0 ? "eager" : "lazy"}
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />
            <span className="absolute left-4 top-4 rounded-lg bg-[#D90049] px-3 py-2 text-sm font-bold text-white">
              {slide.badge}
            </span>
            <span className="absolute bottom-4 left-4 right-4">
              <span className="block text-lg font-bold leading-6 text-white">{slide.title}</span>
              <span className="mt-1 block text-sm font-medium text-white/90">{slide.restaurantName}</span>
              <span className="mt-3 inline-flex min-h-11 items-center justify-center rounded-xl bg-white px-3 py-2 text-center text-sm font-bold text-[#D90049]">
                Kampanyalı Menüyü Gör &amp; Kuponu Kullan
              </span>
            </span>
          </button>
        ))}

        <button
          type="button"
          onClick={() => showSlide(activeIndex - 1)}
          aria-label="Önceki kampanya"
          className="absolute left-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-xl font-bold text-[#0F172A] shadow hover:bg-white"
        >
          <span aria-hidden="true">‹</span>
        </button>
        <button
          type="button"
          onClick={() => showSlide(activeIndex + 1)}
          aria-label="Sonraki kampanya"
          className="absolute right-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-xl font-bold text-[#0F172A] shadow hover:bg-white"
        >
          <span aria-hidden="true">›</span>
        </button>

        <div className="absolute bottom-1 right-4 z-20 flex gap-2">
          {slides.map((slide, index) => (
            <button
              type="button"
              key={slide.code}
              onClick={() => showSlide(index)}
              aria-label={`${index + 1}. kampanyayı göster`}
              aria-current={index === activeIndex ? "true" : undefined}
              className={`h-3 w-3 rounded-full border border-white ${
                index === activeIndex ? "bg-white" : "bg-black/30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
