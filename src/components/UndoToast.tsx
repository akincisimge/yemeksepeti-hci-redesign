import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useCart } from "../state/CartContext";

export default function UndoToast() {
  const { pending, undoRemoval, dismissUndo } = useCart();
  const [host, setHost] = useState<HTMLElement | null>(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const remaining = useRef(5000);
  const dismissRef = useRef(dismissUndo);
  dismissRef.current = dismissUndo;
  useEffect(() => {
    const update = () => setHost(document.querySelector<HTMLElement>("dialog[open] [data-toast-host]") ?? document.body);
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["open"] });
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    remaining.current = 5000;
    if (!pending) { setHovered(false); setFocused(false); }
  }, [pending?.token]);
  useEffect(() => { setHovered(false); setFocused(false); }, [host]);
  useEffect(() => {
    if (!pending || hovered || focused) return;
    const started = Date.now();
    const timer = window.setTimeout(() => dismissRef.current(pending.token), remaining.current);
    return () => {
      window.clearTimeout(timer);
      remaining.current = Math.max(0, remaining.current - (Date.now() - started));
    };
  }, [pending?.token, hovered, focused]);
  if (!pending || !host) return null;
  const names = [...new Set(pending.entries.map(line => line.product.name))];
  const message = names.length === 1 ? `${names[0]} ürünü sepetten çıkarıldı.` : `${names.length} farklı ürün sepetten çıkarıldı.`;
  return createPortal(<div role="alert" aria-live="assertive" aria-atomic="true"
    onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
    onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
    className="fixed inset-x-3 bottom-24 z-[70] mx-auto flex max-w-xl flex-wrap items-center gap-3 rounded-2xl border border-slate-300 bg-white p-4 text-slate-900 shadow-xl lg:bottom-6">
    <p className="min-w-0 flex-1 text-sm font-medium break-words">{message}</p>
    <button type="button" className="btn-primary" onClick={undoRemoval}>Geri Al</button>
    <button type="button" className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-300" onClick={() => dismissUndo()}><span aria-hidden="true">×</span><span className="sr-only">Geri alma bildirimini kapat</span></button>
  </div>, host);
}
