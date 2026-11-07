import { useEffect, useId, useRef, type ReactNode } from "react";

type Props = { open: boolean; title: string; onClose: () => void; children: ReactNode };
export default function Modal({ open, title, onClose, children }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const closeRef = useRef(onClose);
  const titleId = useId();
  closeRef.current = onClose;
  useEffect(() => {
    if (!open || !dialog.current) return;
    const element = dialog.current;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const keyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); closeRef.current(); return; }
      if (event.key !== "Tab" || !element) return;
      const nodes = Array.from(element.querySelectorAll<HTMLElement>("button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex='-1'])"))
        .filter(node => !node.closest("[hidden], [inert]") && node.getClientRects().length > 0);
      if (!nodes.length) { event.preventDefault(); return; }
      const first = nodes[0], last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    element.addEventListener("keydown", keyDown);
    element.showModal();
    element.querySelector<HTMLButtonElement>("[data-modal-close]")?.focus();
    return () => {
      element.removeEventListener("keydown", keyDown);
      if (element.open) element.close();
      document.body.style.overflow = oldOverflow;
      if (previous?.isConnected) previous.focus();
    };
  }, [open, title]);
  if (!open) return null;
  return <dialog ref={dialog} aria-modal="true" aria-labelledby={titleId}
    onCancel={event => { event.preventDefault(); closeRef.current(); }}

    className="fixed inset-0 z-50 m-0 h-dvh max-h-none w-screen max-w-none border-0 bg-white p-0 text-slate-900 backdrop:bg-slate-900/40 sm:inset-x-0 sm:inset-y-auto sm:bottom-0 sm:mx-auto sm:h-auto sm:max-h-[90dvh] sm:max-w-xl sm:rounded-t-3xl">
    <div className="flex h-full max-h-[inherit] flex-col">
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 p-4">
        <h2 id={titleId} className="text-xl font-bold">{title}</h2>
        <button data-modal-close type="button" onClick={onClose} className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-300"><span aria-hidden="true">×</span><span className="sr-only">{title} penceresini kapat</span></button>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto p-4 pb-40">{children}</div>
      <div data-toast-host />
    </div>
  </dialog>;
}
