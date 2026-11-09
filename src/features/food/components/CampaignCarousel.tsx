import { useEffect, useState } from "react";
import type { FoodCampaign } from "../data/foodData";

type CampaignSlide = {
  id: FoodCampaign;
  badge: string;
  title: string;
  image: string;
  imageAlt: string;
};

const slides: CampaignSlide[] = [
  {
    id: "selected-menu",
    badge: "%25 İndirim",
    title: "Seçili menülerde lezzet fırsatı",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=85",
    imageAlt: "Peynirli burger ve çıtır patates",
  },
  {
    id: "value-menu",
    badge: "165 TL'den başlayan",
    title: "Ekonomik menülerle doyurucu seçimler",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=85",
    imageAlt: "Fırından yeni çıkmış pizza",
  },
  {
    id: "free-delivery",
    badge: "Ücretsiz Teslimat",
    title: "İlk siparişine teslimat fırsatı",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=85",
    imageAlt: "Izgara kebap ve közlenmiş sebzeler",
  },
];

type CampaignCarouselProps = {
  activeCampaign: FoodCampaign | "";
  onSelectCampaign: (campaign: FoodCampaign) => void;
};

export default function CampaignCarousel({
  activeCampaign,
  onSelectCampaign,
}: CampaignCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

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
            key={slide.id}
            tabIndex={index === activeIndex ? 0 : -1}
            aria-label={`${slide.badge}: ${slide.title}. Kampanyayı filtrele`}
            aria-pressed={activeCampaign === slide.id}
            onClick={() => onSelectCampaign(slide.id)}
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
            <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />
            <span className="absolute left-4 top-4 rounded-lg bg-[#D90049] px-3 py-2 text-sm font-bold text-white">
              {slide.badge}
            </span>
            <span className="absolute bottom-4 left-4 right-4 text-lg font-bold leading-6 text-white">
              {slide.title}
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
              key={slide.id}
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
