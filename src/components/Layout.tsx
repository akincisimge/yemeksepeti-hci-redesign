import { useCallback, useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useCart } from "../state/CartContext";
import { useDelivery } from "../state/DeliveryContext";
import { useAccount } from "../state/AccountContext";
import { locationLabel } from "../data/delivery";
import { foodRestaurants } from "../features/food/data/foodData";
import { marketProducts } from "../features/market/data/marketData";
import LocationPicker from "./LocationPicker";
import SidePanel, { type PanelView } from "./SidePanel";

export type LayoutContext = {
  address: string | null;
  openAddress: () => void;
  openPanel: (view: Exclude<PanelView, null>) => void;
};

export default function Layout() {
  const { count, carts } = useCart();
  const { delivery, available, statusMessage, clearStatusMessage } = useDelivery();
  const { account } = useAccount();
  const address = delivery ? locationLabel(delivery) : null;
  const location = useLocation();
  const [panel, setPanel] = useState<PanelView>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const returnTriggerAttrRef = useRef<string | null>(null);
  const shellRef = useRef<HTMLDivElement | null>(null);

  const open = useCallback((view: Exclude<PanelView, null>) => {
    if (document.activeElement instanceof HTMLElement) {
      returnFocusRef.current = document.activeElement;
      returnTriggerAttrRef.current = document.activeElement.getAttribute("data-address-trigger");
    } else {
      returnFocusRef.current = null;
      returnTriggerAttrRef.current = null;
    }
    setPanel(view);
  }, []);

  const close = useCallback(() => {
    setPanel(null);
    window.requestAnimationFrame(() => {
      if (returnFocusRef.current?.isConnected) {
        returnFocusRef.current.focus();
        return;
      }
      if (returnTriggerAttrRef.current) {
        const replacement = document.querySelector<HTMLElement>(
          `[data-address-trigger="${returnTriggerAttrRef.current}"]`,
        );
        if (replacement) {
          replacement.focus();
          return;
        }
      }
      document.getElementById("main-content")?.focus();
    });
  }, []);

  const navigatePanel = useCallback((view: Exclude<PanelView, null>) => setPanel(view), []);

  useEffect(() => {
    setPanel(null);
  }, [location.pathname]);

  useEffect(() => {
    const shell = shellRef.current as (HTMLDivElement & { inert?: boolean }) | null;
    if (!shell) return;
    shell.inert = Boolean(panel);
  }, [panel]);

  const path = location.pathname.replace(/\/+$/, "") || "/";
  const isHome = path === "/";
  const productId = path.startsWith("/market/product/") ? (path.split("/")[3] ?? "") : null;
  const routeStore = productId
    ? marketProducts.find((p) => p.id.toLowerCase() === productId.trim().toLowerCase())?.storeId
    : /^\/market\/[^/]+$/.test(path)
      ? path.split("/")[2]
      : /^\/food\/[^/]+$/.test(path) && foodRestaurants.some((r) => r.id === path.split("/")[2])
        ? path.split("/")[2]
        : undefined;
  const checkoutService = path.startsWith("/checkout/") ? (path === "/checkout/market" ? "market" : "food") : null;
  const requiresLocation = !delivery && !isHome && !["/success", "/track", "/account", "/support"].includes(path);
  const blocked =
    (routeStore && !available(routeStore)) ||
    (checkoutService && carts[checkoutService].some((line) => !available(line.product.storeId)));

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <div ref={shellRef} className="flex min-h-screen flex-col">
        <a className="skip-link" href="#main-content">Ana içeriğe geç</a>
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex min-h-[76px] max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:gap-6">
            <Link to="/" className="text-2xl font-extrabold tracking-tight text-brand sm:text-[28px]" aria-label="Yemeksepeti ana sayfasına dön">
              yemeksepeti
            </Link>
            <nav aria-label="Hesap ve teslimat işlemleri" className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-3">
              <button
                type="button"
                data-address-trigger="header"
                onClick={() => open("address")}
                className="inline-flex min-h-11 max-w-full items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 font-semibold text-slate-800 transition hover:border-brand hover:bg-[#FFF1F6] sm:px-4"
                aria-label={"Teslimat konumu: " + (address ?? "Adres seç") + ". Değiştirmek için aç"}
              >
                <svg className="shrink-0" aria-hidden="true" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
                <span className="min-w-0 break-words text-left text-sm leading-tight" aria-hidden="true">
                  {address ?? "Adres seç"}
                </span>
              </button>
              <button
                type="button"
                onClick={() => open("profile")}
                className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl bg-brand px-3 py-2 font-semibold text-white transition hover:bg-brand-dark sm:px-5"
                aria-label="Profil ve hesap menüsünü aç"
              >
                <svg className="shrink-0" aria-hidden="true" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21c0-4.5 3-7 8-7s8 2.5 8 7" />
                </svg>
                <span className="text-sm">{account ? account.name.split(" ")[0] : "Profil"}</span>
              </button>
            </nav>
          </div>
          {delivery && (
            <nav aria-label="Hizmetler ve sepetler" className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 border-t border-slate-100 px-4 py-2 text-sm">
              <NavLink to="/food" className={({ isActive }) => (isActive ? "nav-link nav-link-active font-bold" : "nav-link font-semibold")}>
                YEMEK
              </NavLink>
              <NavLink to="/market" className={({ isActive }) => (isActive ? "nav-link nav-link-active font-bold" : "nav-link font-semibold")}>
                MARKET
              </NavLink>
              <div className="ml-auto flex flex-wrap gap-1">
                <Link to="/cart/food" className="nav-link">Yemek sepeti ({count("food")})</Link>
                <Link to="/cart/market" className="nav-link">Market sepeti ({count("market")})</Link>
              </div>
            </nav>
          )}
        </header>

        <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 outline-none sm:py-10">
          {statusMessage && (
            <div
              role="status"
              aria-live="polite"
              className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-950"
            >
              <p>{statusMessage}</p>
              <button
                type="button"
                onClick={clearStatusMessage}
                className="min-h-11 rounded-xl border border-emerald-300 bg-white px-3 py-1.5 text-sm font-semibold text-emerald-900 hover:border-emerald-500"
              >
                Tamam
              </button>
            </div>
          )}
          {requiresLocation ? (
            <div className="space-y-4">
              <div role="status" className="mx-auto max-w-xl rounded-2xl border border-slate-300 bg-white p-4 text-sm leading-6 text-slate-700">
                <strong className="text-slate-900">Önce teslimat bölgesi seçmelisin:</strong>{" "}
                Restoran ve market kapsamını gösterebilmek için 81 il arasından demo destekli bir mahalle seç.
              </div>
              <LocationPicker />
            </div>
          ) : blocked ? (
            <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-8">
              <h1 className="text-2xl font-bold">Bu mağaza konumuna teslimat yapmıyor</h1>
              <p className="text-slate-700">Seçili konum: <strong>{address}</strong>. Uygun işletmeleri seçebilir veya konumunu değiştirebilirsin.</p>
              <div className="flex flex-wrap gap-3">
                <button type="button" className="btn-primary" onClick={() => open("address")}>Konumu değiştir</button>
                <Link className="nav-link border border-slate-300 bg-white font-semibold" to="/">Ana sayfaya ve uygun işletmelere dön</Link>
              </div>
            </section>
          ) : (
            <Outlet key={delivery?.id ?? "no-delivery"} context={{ address, openAddress: () => open("address"), openPanel: open } satisfies LayoutContext} />
          )}
        </main>

        <footer className="mt-12 border-t border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-600">
          Bağımsız HCI öğrenci projesidir. Gerçek sipariş, ödeme veya canlı destek hizmeti sunulmaz.
        </footer>
      </div>

      {panel && (
        <SidePanel
          view={panel}
          onClose={close}
          onNavigate={navigatePanel}
          address={address}
          foodCount={count("food")}
          marketCount={count("market")}
        />
      )}
    </div>
  );
}
