
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { marketProducts } from "../data/marketData";
import { useCart } from "../../../state/CartContext";
import { formatTRY } from "../../../types/domain";

export default function MarketProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { add } = useCart();

  const product = marketProducts.find((p) => p.id === id);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-gray-600">Ürün bulunamadı.</p>
        <button
          onClick={() => navigate("/market")}
          className="mt-4 rounded-xl bg-red-500 px-5 py-2 text-white"
        >
          Market'e dön
        </button>
      </div>
    );
  }

  const handleAdd = () => {
    add(product);
    setAdded(true);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-5 text-sm text-gray-500 hover:text-red-500"
      >
        ← Geri dön
      </button>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Product Image */}
        <div className="flex items-center justify-center rounded-3xl bg-white p-8 shadow-sm">
          <img
            src={product.image}
            alt={product.name}
            className="max-h-[400px] w-full object-contain"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-center">
          <span className="mb-3 w-fit rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-500">
            YEMEKSEPETİ MARKET
          </span>

          <h1 className="text-3xl font-bold text-gray-900">
            {product.name}
          </h1>

          <p className="mt-3 text-gray-500">
            {product.description}
          </p>

          <p className="mt-6 text-3xl font-bold text-gray-900">
            {formatTRY(product.price)}
          </p>

          <button
            onClick={handleAdd}
            className={`mt-6 w-full rounded-2xl py-4 font-semibold transition ${
              added
                ? "bg-green-600 text-white"
                : "bg-red-500 text-white hover:bg-red-600"
            }`}
          >
            {added ? "✓ Sepete eklendi" : "Sepete ekle"}
          </button>

          <button
            onClick={() => navigate("/cart/market")}
            className="mt-3 w-full rounded-2xl border border-gray-200 py-3 font-semibold text-gray-700 hover:bg-gray-50"
          >
            Sepeti görüntüle
          </button>
        </div>
      </div>
    </div>
  );
}



