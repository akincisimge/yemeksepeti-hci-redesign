import type { Product } from "../../../types/domain";
import { getFoodCustomization } from "../data/foodData";

export default function FoodCustomizationDetails({ product }: { product: Product }) {
  const customization = getFoodCustomization(product);
  if (!customization) return null;

  const details = [
    customization.removedIngredients.length
      ? `Çıkarılanlar: ${customization.removedIngredients.join(", ")}`
      : "",
    customization.extras.length ? `Ekstra: ${customization.extras.join(", ")}` : "",
    `Tercih: ${customization.preference}`,
    customization.note ? `Not: ${customization.note}` : "",
  ].filter(Boolean);

  return (
    <ul aria-label="Ürün özelleştirmeleri" className="mt-2 flex flex-wrap gap-1.5">
      {details.map((detail) => (
        <li key={detail} className="rounded-full bg-rose-50 px-2.5 py-1 text-xs leading-4 text-[#9F1239]">
          {detail}
        </li>
      ))}
    </ul>
  );
}
