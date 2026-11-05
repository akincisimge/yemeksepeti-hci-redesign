
import { useNavigate } from "react-router-dom";
import { formatTRY, type Product } from "../../../types/domain";

interface MarketProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

export default function MarketProductCard({
  product,
  onAdd,
}: MarketProductCardProps) {
  const navigate = useNavigate();

  const goToProduct = () => {
    navigate(`/market/product/${product.id}`);
  };

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-pink-200 hover:shadow-xl">

      {/* Product Image */}
      <div
        onClick={goToProduct}
        className="relative flex h-40 cursor-pointer items-center justify-center overflow-hidden bg-white p-4 sm:h-52 sm:p-5"
      >
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <span className="text-6xl">🛒</span>
        )}

        <span className="absolute left-3 top-3 rounded-md bg-pink-50 px-2 py-1 text-[10px] font-bold text-[#D90049]">
          MARKET
        </span>
      </div>

      {/* Product Information */}
      <div className="flex flex-1 flex-col border-t border-slate-100 p-3 sm:p-4">
        <span className="mb-2 line-clamp-1 text-[11px] font-medium text-slate-400 sm:text-xs">
          {product.storeName}
        </span>

        <h3
          onClick={goToProduct}
          className="mb-2 line-clamp-2 min-h-10 cursor-pointer text-sm font-semibold leading-5 text-slate-900 transition-colors hover:text-[#D90049] sm:text-base"
        >
          {product.name}
        </h3>

        <p className="mb-4 line-clamp-2 min-h-8 text-xs leading-4 text-slate-500 sm:text-sm sm:leading-5">
          {product.description}
        </p>

        {/* Price and Add Button */}
        <div className="mt-auto flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
          <div>
            <span className="block text-[10px] text-slate-400 sm:text-xs">
              Fiyat
            </span>
            <span className="text-base font-extrabold tracking-tight text-slate-900 sm:text-lg">
              {formatTRY(product.price)}
            </span>
          </div>

          <button
            onClick={(event) => {
              event.stopPropagation();
              onAdd(product);
            }}
            aria-label={`${product.name} sepete ekle`}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D90049] text-2xl font-medium text-white shadow-sm transition-all hover:bg-[#B6003C] hover:shadow-md active:scale-90 sm:h-11 sm:w-11"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

