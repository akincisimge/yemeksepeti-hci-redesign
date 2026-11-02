import { useCallback, useEffect, useRef, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useCart } from "../state/CartContext";
import SidePanel, { type DemoAccount, type PanelView } from "./SidePanel";

export type LayoutContext = {
  address: string | null;
  openAddress: () => void;
};

export default function Layout() {
  const { count } = useCart();
  const location = useLocation();
  const [panel, setPanel] = useState<PanelView>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [account, setAccount] = useState<DemoAccount | null>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const open = useCallback((view: Exclude<PanelView, null>) => {
    if (document.activeElement instanceof HTMLElement) {
      returnFocusRef.current = document.activeElement;
    }
    setPanel(view);
  }, []);
  const close = useCallback(() => {
    setPanel(null);
    window.requestAnimationFrame(() => returnFocusRef.current?.focus());
  }, []);
  const navigatePanel = useCallback((view: Exclude<PanelView, null>) => setPanel(view), []);

  useEffect(() => { setPanel(null); }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <a className="skip-link" href="#main-content">Ana içeriğe geç</a>
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex min-h-[80px] max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:gap-6">
          <Link to="/" className="text-2xl font-extrabold tracking-tight text-brand sm:text-[28px]" aria-label="Yemeksepeti ana sayfasına dön">
            yemeksepeti
          </Link>
          <nav aria-label="Hesap ve teslimat işlemleri" className="flex items-center gap-2 sm:gap-3">
            <button type="button" onClick={() => open("address")} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 font-semibold text-slate-800 transition hover:border-brand hover:bg-pink-50 sm:px-4" aria-label={"Teslimat konumu: " + (address ?? "Adres seç") + ". Değiştirmek için aç"}>
              <svg aria-hidden="true" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>
              <span className="max-w-28 truncate text-sm sm:max-w-48">{address ?? "Adres seç"}</span>
            </button>
            <button type="button" onClick={() => open("profile")} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand px-3 py-2 font-semibold text-white transition hover:bg-brand-dark sm:px-5" aria-label="Profil ve hesap menüsünü aç">
              <svg aria-hidden="true" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.5 3-7 8-7s8 2.5 8 7"/></svg>
              <span className="text-sm">Profil</span>
            </button>
          </nav>
        </div>
      </header>
      <main id="main-content" className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <Outlet context={{ address, openAddress: () => open("address") } satisfies LayoutContext} />
      </main>
      <footer className="mt-12 border-t border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-600">
        Bağımsız HCI öğrenci projesidir. Gerçek sipariş, ödeme veya canlı destek hizmeti sunulmaz.
      </footer>
      {panel && <SidePanel
        view={panel}
        onClose={close}
        onNavigate={navigatePanel}
        address={address}
        onAddressChange={setAddress}
        account={account}
        onSaveAccount={setAccount}
        foodCount={count("food")}
        marketCount={count("market")}
      />}
    </div>
  );
}
