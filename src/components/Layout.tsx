import { useCallback, useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useCart } from "../state/CartContext";
import { useDelivery } from "../state/DeliveryContext";
import { useAccount } from "../state/AccountContext";
import { DEMO_TRACKING_STEPS, useDemoOrder } from "../state/demoOrder";
import { locationLabel } from "../data/delivery";
import { foodRestaurants } from "../features/food/data/foodData";
import { marketProducts } from "../features/market/data/marketData";
import LocationPicker from "./LocationPicker";
import SidePanel, { type PanelView } from "./SidePanel";
import FloatingSupportWidget from "./FloatingSupportWidget";

export type LayoutContext = {
  address: string | null;
  openAddress: () => void;
  openPanel: (view: Exclude<PanelView, null>) => void;
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toLocaleUpperCase("tr") ?? "").join("") || "P";
}

export default function Layout() {
  const { count, carts } = useCart();
  const { delivery, available, statusMessage, clearStatusMessage } = useDelivery();
  const { account, resetAccount } = useAccount();
  const activeOrder = useDemoOrder();
  const address = delivery ? locationLabel(delivery) : null;
  const location = useLocation();
  const [panel, setPanel] = useState<PanelView>(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const returnFocusRef = useRef<HTMLElement | null>(null);
  const returnTriggerAttrRef = useRef<string | null>(null);
  const profileTriggerRef = useRef<HTMLButtonElement | null>(null);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);
  const shellRef = useRef<HTMLDivElement | null>(null);

  const open = useCallback((view: Exclude<PanelView, null>) => {
    setProfileMenuOpen(false);
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
    setProfileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const shell = shellRef.current as (HTMLDivElement & { inert?: boolean }) | null;
    if (!shell) return;
    shell.inert = Boolean(panel);
  }, [panel]);

  useEffect(() => {
    if (!profileMenuOpen) return;
    function handleOutsideClick(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setProfileMenuOpen(false);
        profileTriggerRef.current?.focus();
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [profileMenuOpen]);

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
  const liftSupportForMobileBar = path === "/food" || /^\/food\/[^/]+$/.test(path) || /^\/market\/[^/]+$/.test(path);

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
                <svg className="shrink-0 text-brand" aria-hidden="true" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
                <span className="min-w-0 break-words text-left text-sm leading-tight" aria-hidden="true">
                  {address ?? "Adres seç"}
                </span>
              </button>

              {!account ? (
                <button
                  type="button"
                  onClick={() => open("account")}
                  className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl bg-brand px-4 py-2 font-semibold text-white transition hover:bg-brand-dark sm:px-5"
                  aria-label="Hesap oluştur"
                >
                  <svg className="shrink-0" aria-hidden="true" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 21c0-4.5 3-7 8-7s8 2.5 8 7" />
                  </svg>
                  <span className="text-sm">Hesap Oluştur</span>
                </button>
              ) : (
                <div ref={profileMenuRef} className="relative">
                  <button
                    ref={profileTriggerRef}
                    type="button"
                    aria-haspopup="menu"
                    aria-expanded={profileMenuOpen}
                    onClick={() => setProfileMenuOpen((prev) => !prev)}
                    className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-brand/30 bg-[#FFF1F6] px-3 py-2 font-semibold text-slate-900 transition hover:border-brand sm:px-4"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-xs font-bold text-white" aria-hidden="true">
                      {getInitials(account.name)}
                    </span>
                    <span className="text-sm">{account.name.split(" ")[0]}</span>
                    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="m4 6 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  {profileMenuOpen && (
                    <div
                      role="menu"
                      aria-label="Profil sekmesi"
                      className="absolute right-0 top-[calc(100%+8px)] z-40 w-72 max-w-[calc(100vw-2rem)] rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl"
                    >
                      <div className="mb-1 rounded-xl bg-[#FFF1F6] px-3 py-3">
                        <p className="font-bold text-slate-900">{account.name}</p>
                        <p className="truncate text-xs text-slate-600">{account.email}</p>
                      </div>
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => open("account")}
                        className="flex min-h-11 w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-semibold text-slate-800 hover:bg-slate-50"
                      >
                        <span>Profil Bilgilerim</span>
                        <span aria-hidden="true" className="text-slate-500">›</span>
                      </button>
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => open("address")}
                        className="flex min-h-11 w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-semibold text-slate-800 hover:bg-slate-50"
                      >
                        <span>Teslimat Adresim</span>
                        <span aria-hidden="true" className="text-slate-500">›</span>
                      </button>
                      {activeOrder ? (
                        <Link
                          to="/track"
                          role="menuitem"
                          onClick={() => setProfileMenuOpen(false)}
                          className="flex min-h-11 w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-semibold text-brand-dark hover:bg-[#FFF1F6]"
                        >
                          <span>Sipariş Takibi ({DEMO_TRACKING_STEPS[activeOrder.stage].title})</span>
                          <span aria-hidden="true">›</span>
                        </Link>
                      ) : (
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => open("orders")}
                          className="flex min-h-11 w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-semibold text-slate-800 hover:bg-slate-50"
                        >
                          <span>Siparişlerim</span>
                          <span aria-hidden="true" className="text-slate-500">›</span>
                        </button>
                      )}
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => open("coupons")}
                        className="flex min-h-11 w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-semibold text-slate-800 hover:bg-slate-50"
                      >
                        <span>Kuponlarım</span>
                        <span aria-hidden="true" className="text-slate-500">›</span>
                      </button>
                      <div className="my-1 border-t border-slate-100" />
                      <div className="grid grid-cols-2 gap-1 px-1 py-1">
                        <Link
                          to="/cart/food"
                          role="menuitem"
                          onClick={() => setProfileMenuOpen(false)}
                          className="flex min-h-10 items-center justify-center rounded-xl border border-slate-200 px-2 text-xs font-semibold text-slate-700 hover:border-brand"
                        >
                          Yemek ({count("food")})
                        </Link>
                        <Link
                          to="/cart/market"
                          role="menuitem"
                          onClick={() => setProfileMenuOpen(false)}
                          className="flex min-h-10 items-center justify-center rounded-xl border border-slate-200 px-2 text-xs font-semibold text-slate-700 hover:border-brand"
                        >
                          Market ({count("market")})
                        </Link>
                      </div>
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          resetAccount();
                          setProfileMenuOpen(false);
                        }}
                        className="mt-1 flex min-h-11 w-full items-center rounded-xl px-3 py-2 text-left text-sm font-semibold text-[#991B1B] hover:bg-red-50"
                      >
                        Çıkış Yap
                      </button>
                    </div>
                  )}
                </div>
              )}
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
              {activeOrder && (
                <NavLink to="/track" className={({ isActive }) => (isActive ? "nav-link nav-link-active font-bold" : "nav-link font-medium")}>
                  Sipariş Takibi
                </NavLink>
              )}
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
                Restoran ve marketleri gösterebilmek için bölgeni seç.
              </div>
              <LocationPicker />
            </div>
          ) : blocked ? (
            <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-8">
              <h1 className="text-2xl font-bold">Bu mağaza konumuna teslimat yapmıyor</h1>
              <p className="text-slate-700">Seçili konum: <strong>{address}</strong>. Uygun işletmeleri seçebilir veya konumunu değiştirebilirsin.</p>
              <div className="flex flex-wrap gap-3">
                <button type="button" className="btn-primary" onClick={() => open("address")}>Konumu değiştir</button>
                <Link className="nav-link border border-slate-300 bg-white font-semibold" to="/">Ana sayfaya dön</Link>
              </div>
            </section>
          ) : (
            <Outlet key={delivery?.id ?? "no-delivery"} context={{ address, openAddress: () => open("address"), openPanel: open } satisfies LayoutContext} />
          )}
        </main>

        <footer className="mt-12 border-t border-slate-200 bg-white px-4 py-6 text-center text-sm text-slate-600">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="font-semibold text-slate-800">yemeksepeti</p>
            <nav aria-label="Alt bağlantılar" className="flex flex-wrap justify-center gap-2">
              <Link to="/food" className="nav-link text-sm font-medium">Yemek</Link>
              <Link to="/market" className="nav-link text-sm font-medium">Market</Link>
              {activeOrder && <Link to="/track" className="nav-link text-sm font-medium">Sipariş Takibi</Link>}
            </nav>
          </div>
        </footer>
      </div>

      <FloatingSupportWidget
        onOpenAddress={() => open("address")}
        onOpenCoupons={() => open("coupons")}
        liftForMobileBar={liftSupportForMobileBar}
        hidden={Boolean(panel)}
      />

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
