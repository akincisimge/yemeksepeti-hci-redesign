

import { useNavigate } from "react-router-dom";
import { formatTRY, type Product } from "../../../types/domain";
import { useCart } from "../../../state/CartContext";

interface MarketProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

export default function MarketProductCard({
  product,
  onAdd,
}: MarketProductCardProps) {
  const navigate = useNavigate();
  const { carts, change } = useCart();

  const cartLine = carts.market.find(
    (line) => line.product.id === product.id
  );

  const quantity = cartLine?.quantity ?? 0;

  const goToProduct = () => {
    navigate(`/market/product/${product.id}`);
  };

  const increase = () => {
    if (quantity === 0) {
      onAdd(product);
    } else {
      change("market", product.id, 1);
    }
  };

  const decrease = () => {
    change("market", product.id, -1);
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

        {/* Cart Quantity Badge */}
        {quantity > 0 && (
          <span className="absolute right-3 top-3 flex h-8 min-w-8 items-center justify-center rounded-full bg-[#D90049] px-2 text-sm font-bold text-white shadow-md">
            {quantity}
          </span>
        )}
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

        {/* Price and Quantity Controls */}
        <div className="mt-auto flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
          <div>
            <span className="block text-[10px] text-slate-400 sm:text-xs">
              Fiyat
            </span>
            <span className="text-base font-extrabold tracking-tight text-slate-900 sm:text-lg">
              {formatTRY(product.price)}
            </span>
          </div>

          {quantity === 0 ? (
            <button
              onClick={increase}
              aria-label={`${product.name} sepete ekle`}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D90049] text-2xl font-medium text-white shadow-sm transition-all hover:bg-[#B6003C] hover:shadow-md active:scale-90 sm:h-11 sm:w-11"
            >
              +
            </button>
          ) : (
            <div className="flex items-center gap-2 rounded-xl bg-pink-50 p-1">
              <button
                onClick={decrease}
                aria-label={`${product.name} miktarını azalt`}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-lg font-bold text-[#D90049] shadow-sm transition hover:bg-pink-100"
              >
                −
              </button>

              <span className="min-w-5 text-center text-sm font-bold text-[#D90049]">
                {quantity}
              </span>

              <button
                onClick={increase}
                aria-label={`${product.name} miktarını artır`}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D90049] text-lg font-bold text-white shadow-sm transition hover:bg-[#B6003C]"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


