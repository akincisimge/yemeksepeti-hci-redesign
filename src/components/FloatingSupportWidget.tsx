import { useEffect, useRef, useState } from "react";
import LiveSupportChat from "./LiveSupportChat";

type FloatingSupportWidgetProps = {
  onOpenAddress: () => void;
  onOpenCoupons: () => void;
  liftForMobileBar: boolean;
  hidden?: boolean;
};

export default function FloatingSupportWidget({
  onOpenAddress,
  onOpenCoupons,
  liftForMobileBar,
  hidden = false,
}: FloatingSupportWidgetProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (hidden && open) {
      setOpen(false);
    }
  }, [hidden, open]);

  useEffect(() => {
    if (open) {
      wasOpenRef.current = true;
      window.requestAnimationFrame(() => closeRef.current?.focus());
    } else if (wasOpenRef.current) {
      wasOpenRef.current = false;
      window.requestAnimationFrame(() => triggerRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  if (hidden) return null;

  const triggerPosition = liftForMobileBar ? "bottom-24 lg:bottom-6" : "bottom-5 sm:bottom-6";
  const panelPosition = liftForMobileBar ? "bottom-40 lg:bottom-24" : "bottom-24";

  return (
    <>
      {open && (
        <section
          role="dialog"
          aria-modal="false"
          aria-labelledby="floating-support-title"
          className={`fixed right-4 z-50 flex max-h-[min(540px,calc(100dvh-8.5rem))] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl sm:right-6 ${panelPosition}`}
        >
          <header className="flex items-center justify-between gap-3 bg-brand px-5 py-4 text-white">
            <div>
              <h2 id="floating-support-title" className="text-base font-bold leading-tight">
                Canlı Destek
              </h2>
              <p className="mt-0.5 text-xs text-pink-100">Size nasıl yardımcı olabiliriz?</p>
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Canlı desteği kapat"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 text-xl font-bold text-white transition hover:bg-white/25"
            >
              ×
            </button>
          </header>
          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            <LiveSupportChat
              compact
              onOpenAddress={() => {
                setOpen(false);
                onOpenAddress();
              }}
              onOpenCoupons={() => {
                setOpen(false);
                onOpenCoupons();
              }}
              onNavigateAway={() => setOpen(false)}
            />
          </div>
        </section>
      )}

      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "Canlı desteği kapat" : "Canlı destek sohbetini aç"}
        aria-expanded={open}
        aria-haspopup="dialog"
        className={`fixed right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-xl ring-4 ring-white transition hover:scale-105 hover:bg-brand-dark sm:right-6 ${triggerPosition}`}
      >
        {open ? (
          <span aria-hidden="true" className="text-2xl font-bold leading-none">×</span>
        ) : (
          <svg
            aria-hidden="true"
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
          </svg>
        )}
      </button>
    </>
  );
}
