import { useEffect, useRef } from "react";
import type { Product } from "../types/domain";

type StoreSwitchDialogProps = {
  pendingProduct: Product | null;
  currentStoreName: string;
  serviceLabel: "restoran" | "market";
  onCancel: () => void;
  onConfirm: () => void;
};

export default function StoreSwitchDialog({
  pendingProduct,
  currentStoreName,
  serviceLabel,
  onCancel,
  onConfirm,
}: StoreSwitchDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const element = dialogRef.current;
    if (!element) return;
    if (pendingProduct && !element.open) {
      element.showModal();
      cancelRef.current?.focus();
    }
    if (!pendingProduct && element.open) {
      element.close();
    }
  }, [pendingProduct]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="store-switch-title"
      aria-describedby="store-switch-desc"
      onCancel={(event) => {
        event.preventDefault();
        onCancel();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
      className="fixed inset-0 m-auto w-[calc(100%_-_24px)] max-w-lg rounded-2xl border border-[#CBD5E1] bg-white p-6 shadow-2xl backdrop:bg-[#0F172A]/50"
    >
      <h2 id="store-switch-title" className="text-xl font-bold text-[#0F172A]">
        {serviceLabel === "restoran" ? "Restoran değişikliğini onayla" : "Market değişikliğini onayla"}
      </h2>
      <p id="store-switch-desc" className="mt-3 leading-6 text-[#475569]">
        Sepetinizde başka bir {serviceLabel === "restoran" ? "restorana" : "markete"} (
        <strong className="text-[#0F172A]">{currentStoreName}</strong>) ait ürünler var. Aynı anda yalnızca tek bir{" "}
        {serviceLabel === "restoran" ? "restorandan" : "marketten"} sipariş verebilirsiniz.
      </p>
      {pendingProduct && (
        <p className="mt-2 text-sm text-[#475569]">
          Yeni seçilen: <strong className="text-[#0F172A]">{pendingProduct.storeName}</strong> — {pendingProduct.name}
        </p>
      )}
      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          ref={cancelRef}
          type="button"
          onClick={onCancel}
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#CBD5E1] px-4 py-3 font-semibold text-[#0F172A] hover:border-[#D90049]"
        >
          Vazgeç / Mevcut Sepeti Koru
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#D90049] px-4 py-3 font-semibold text-white hover:bg-[#B6003C]"
        >
          Sepeti Temizle ve Bu Ürünü Ekle
        </button>
      </div>
    </dialog>
  );
}
