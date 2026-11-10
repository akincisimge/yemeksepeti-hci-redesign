import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import LocationPicker from "./LocationPicker";
import AccountForm from "./AccountForm";
import { useAccount } from "../state/AccountContext";
import { DEMO_TRACKING_STEPS, useDemoOrders } from "../state/demoOrder";
import { formatTRY } from "../types/domain";
import { foodCoupons } from "../features/food/data/foodData";
import { useFoodCoupon } from "../features/food/state/FoodCouponContext";

export type PanelView = "address" | "profile" | "account" | "orders" | "coupons" | null;

type PanelProps = {
  view: Exclude<PanelView, null>;
  onClose: () => void;
  onNavigate: (view: Exclude<PanelView, null>) => void;
  address: string | null;
  foodCount: number;
  marketCount: number;
};

function PanelRow({ label, detail, onClick }: { label: string; detail?: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-14 w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left transition hover:border-brand hover:bg-[#FFF1F6]"
    >
      <span>
        <span className="block font-semibold text-slate-900">{label}</span>
        {detail && <span className="mt-1 block text-sm text-slate-600">{detail}</span>}
      </span>
      <span className="text-xl text-brand" aria-hidden="true">›</span>
    </button>
  );
}

export default function SidePanel({ view, onClose, onNavigate, address, foodCount, marketCount }: PanelProps) {
  const navigate = useNavigate();
  const { account } = useAccount();
  const { activeFoodCoupon, setActiveFoodCoupon } = useFoodCoupon();
  const panelRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const target =
      panelRef.current?.querySelector<HTMLElement>("[data-autofocus]") ??
      panelRef.current?.querySelector<HTMLElement>("[data-back]") ??
      panelRef.current?.querySelector<HTMLElement>("[data-close]");
    target?.focus();

    function keyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const nodes = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          "button:not(:disabled), a[href], input:not(:disabled), textarea:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex='-1'])",
        ),
      ).filter((element) => element.getClientRects().length > 0);
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement;
      if (!panelRef.current.contains(active) || active === panelRef.current) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
        return;
      }
      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", keyDown);
    return () => {
      document.body.style.overflow = oldOverflow;
      document.removeEventListener("keydown", keyDown);
    };
  }, [onClose, view]);

  const title: Record<Exclude<PanelView, null>, string> = {
    address: "Teslimat Adresini Seç",
    profile: "Profil ve hesabım",
    account: account ? "Profil bilgilerim" : "Hesap oluştur",
    orders: "Aktif Siparişlerim",
    coupons: "Kuponlarım",
  };
  const isCenteredModal = view === "address" || view === "orders";
  const subpage = account !== null && view !== "profile" && view !== "address" && view !== "orders";
  const orders = useDemoOrders();
  const lastOrder = orders[0] ?? null;

  return (
    <div className={isCenteredModal ? "fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6" : "fixed inset-0 z-50"}>
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        onClick={onClose}
        className={
          isCenteredModal
            ? "absolute inset-0 h-full w-full cursor-default bg-slate-900/50 backdrop-blur-[2px]"
            : "absolute inset-0 h-full w-full cursor-default bg-slate-900/40"
        }
      />
      <section
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="panel-title"
        className={
          isCenteredModal
            ? "relative flex max-h-[92dvh] w-full max-w-[580px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
            : "absolute inset-y-0 right-0 flex w-full flex-col bg-white shadow-2xl sm:max-w-[440px]"
        }
      >
        <header className="flex min-h-[76px] shrink-0 items-center gap-3 border-b border-slate-200 px-5 sm:px-6">
          {subpage && (
            <button
              data-back
              type="button"
              onClick={() => onNavigate("profile")}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-300 hover:bg-slate-50"
              aria-label="Profil menüsüne dön"
            >
              ←
            </button>
          )}
          {isCenteredModal && (
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FFF1F6] text-brand" aria-hidden="true">
              {view === "address" ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                  <rect x="9" y="3" width="6" height="4" rx="1" />
                  <path d="M9 12h6M9 16h4" />
                </svg>
              )}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <h2 id="panel-title" className="text-xl font-bold text-slate-900">{title[view]}</h2>
            {view === "address" && (
              <p className="mt-0.5 text-sm text-slate-600">Önce şehrini seç, ardından gerçek ilçe ve mahalleni belirle.</p>
            )}
            {view === "orders" && (
              <p className="mt-0.5 text-sm text-slate-600">Sipariş aşamaların otomatik olarak canlı güncellenir.</p>
            )}
          </div>
          <button
            data-close
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-300 text-xl text-slate-700 transition hover:border-brand hover:bg-[#FFF1F6] hover:text-brand"
            aria-label="Pencereyi kapat"
          >
            ×
          </button>
        </header>
        <div className={isCenteredModal ? "min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6" : "min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6"}>
          {view === "address" && <LocationPicker variant="modal" onDone={onClose} />}
          {view === "profile" && (
            <div className="space-y-3">
              <div className="mb-5 rounded-2xl bg-[#FFF1F6] p-5">
                <p className="text-sm font-semibold text-brand-dark">HOŞ GELDİN</p>
                <p className="mt-2 text-xl font-bold text-slate-900">{account?.name ?? "Misafir kullanıcı"}</p>
                <p className="mt-1 text-sm text-slate-700">
                  {account ? account.email : "Adreslerini, siparişlerini ve kuponlarını tek yerden yönet."}
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate("account")}
                  className="mt-4 min-h-11 rounded-xl border border-brand px-4 font-semibold text-brand-dark hover:bg-white"
                >
                  {account ? "Profil bilgilerimi düzenle" : "Hesap oluştur"}
                </button>
              </div>
              <PanelRow label="Kayıtlı adreslerim" detail={address ?? "Henüz adres seçilmedi"} onClick={() => onNavigate("address")} />
              <PanelRow
                label="Siparişlerim"
                detail={lastOrder ? `${lastOrder.orderId} · ${DEMO_TRACKING_STEPS[lastOrder.stage].title}` : "Aktif ve geçmiş siparişlerin"}
                onClick={() => onNavigate("orders")}
              />
              <PanelRow label="Tanımlı kuponlarım" detail="Kupon durumlarını incele" onClick={() => onNavigate("coupons")} />
              <div className="border-t border-slate-200 pt-4">
                <p className="mb-3 text-sm font-semibold text-slate-700">Sepetlerim</p>
                <div className="grid grid-cols-2 gap-3">
                  <Link onClick={onClose} to="/cart/food" className="flex min-h-11 items-center justify-center rounded-xl border border-slate-300 px-2 text-center text-sm font-semibold hover:border-brand">
                    Yemek ({foodCount})
                  </Link>
                  <Link onClick={onClose} to="/cart/market" className="flex min-h-11 items-center justify-center rounded-xl border border-slate-300 px-2 text-center text-sm font-semibold hover:border-brand">
                    Market ({marketCount})
                  </Link>
                </div>
              </div>
            </div>
          )}
          {view === "account" && (
            <AccountForm autofocus onSaved={onClose} />
          )}
          {view === "orders" && (
            <div className="space-y-4">
              {orders.length > 0 ? (
                <>
                  {orders.map((item) => {
                    const step = DEMO_TRACKING_STEPS[item.stage];
                    const done = item.stage === DEMO_TRACKING_STEPS.length - 1;
                    const percent = ((item.stage + 1) / DEMO_TRACKING_STEPS.length) * 100;
                    return (
                      <article
                        key={item.orderId}
                        className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/75 p-4 sm:p-5"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-lg bg-[#FFF1F6] px-2.5 py-1 text-xs font-bold text-brand-dark">
                              {item.service === "food" ? "YEMEK" : "MARKET"}
                            </span>
                            <span className="font-bold text-slate-900">{item.orderId}</span>
                          </div>
                          <span className="text-sm font-bold text-slate-900">{formatTRY(item.amount)}</span>
                        </div>

                        <div className="space-y-1 text-sm text-slate-700">
                          <p className="font-semibold text-slate-900">
                            {item.storeName ?? (item.service === "food" ? "Restoran siparişi" : "Market siparişi")}
                            {item.itemCount ? ` · ${item.itemCount} ürün` : ""}
                          </p>
                          {item.locationLabel && <p className="text-xs text-slate-600">Teslimat: {item.locationLabel}</p>}
                          <p className="text-xs text-slate-500">
                            {new Date(item.createdAt).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>

                        <div
                          role="status"
                          aria-live="polite"
                          className={
                            done
                              ? "flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-sm text-emerald-950"
                              : "flex items-center gap-2.5 rounded-xl border border-rose-200 bg-[#FFF1F6] px-3.5 py-2.5 text-sm text-slate-900"
                          }
                        >
                          {done ? (
                            <span className="font-bold text-emerald-700" aria-hidden="true">✓</span>
                          ) : (
                            <span className="h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-brand" aria-hidden="true" />
                          )}
                          <div className="min-w-0">
                            <p className="font-bold">{step.title}</p>
                            <p className="text-xs text-slate-700">{step.detail}</p>
                          </div>
                        </div>

                        <div
                          role="progressbar"
                          aria-label={`${item.orderId} sipariş ilerleme durumu`}
                          aria-valuemin={1}
                          aria-valuemax={DEMO_TRACKING_STEPS.length}
                          aria-valuenow={item.stage + 1}
                          aria-valuetext={`${item.stage + 1}/4: ${step.title}`}
                          className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200"
                        >
                          <div
                            className={done ? "h-full rounded-full bg-emerald-600 transition-all duration-500" : "h-full rounded-full bg-brand transition-all duration-500"}
                            style={{ width: `${percent}%` }}
                          />
                        </div>

                        <ol className="grid grid-cols-4 gap-1.5 text-center text-[11px] leading-tight">
                          {DEMO_TRACKING_STEPS.map((s, idx) => {
                            const reached = idx <= item.stage;
                            const isCurrent = idx === item.stage;
                            return (
                              <li
                                key={s.title}
                                className={
                                  isCurrent
                                    ? "rounded-lg bg-[#FFF1F6] px-1.5 py-1.5 font-bold text-brand-dark"
                                    : reached
                                      ? "rounded-lg bg-emerald-50 px-1.5 py-1.5 font-semibold text-emerald-800"
                                      : "rounded-lg bg-white px-1.5 py-1.5 text-slate-500"
                                }
                              >
                                {idx < item.stage ? "✓ " : `${idx + 1}. `}
                                {s.title}
                              </li>
                            );
                          })}
                        </ol>
                      </article>
                    );
                  })}
                  <div className="flex flex-wrap gap-3 pt-1">
                    <Link to="/track" onClick={onClose} className="btn-primary flex-1">
                      Tam sayfa sipariş takibini aç
                    </Link>
                    <button
                      type="button"
                      onClick={onClose}
                      className="min-h-11 rounded-xl border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-800 hover:border-brand"
                    >
                      Kapat
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-4 py-2 text-center">
                  <p className="rounded-2xl bg-slate-50 p-5 text-slate-700">
                    Henüz aktif siparişin yok. Yemek veya market siparişi verdiğinde sipariş durumlarını buradan canlı izleyebilirsin.
                  </p>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Link to="/food" onClick={onClose} className="btn-primary flex-1">
                      Yemekleri keşfet
                    </Link>
                    <Link
                      to="/market"
                      onClick={onClose}
                      className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-900 hover:border-brand"
                    >
                      Marketlere git
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
          {view === "coupons" && (
            <div className="space-y-4">
              <p className="rounded-xl bg-[#FFF1F6] p-4 text-sm leading-5 text-slate-700">
                Yemek kuponunu seç; ilgili restoranın kampanyalı menüsüne gidip indirimi sepetinde kullan.
              </p>
              {foodCoupons.map((coupon) => {
                const isActive = activeFoodCoupon?.code === coupon.code;
                return (
                  <article key={coupon.code} className={`rounded-2xl border p-4 ${isActive ? "border-[#D90049] bg-[#FFF0F5]" : "border-slate-200 bg-white"}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900">{coupon.title}</p>
                        <p className="mt-2 text-sm leading-5 text-slate-600">{coupon.description}</p>
                      </div>
                      <span className="shrink-0 rounded-lg border border-dashed border-[#D90049] bg-white px-2.5 py-1.5 font-mono text-sm font-bold text-[#B6003C]">
                        {coupon.code}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
                      <strong className="text-[#B6003C]">
                        {coupon.discountType === "percentage" ? `%${coupon.discountValue} indirim` : `${coupon.discountValue} TL indirim`}
                      </strong>
                      <span className="text-slate-600">Min. {coupon.minimumSubtotal} TL</span>
                    </div>
                    <button
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => {
                        setActiveFoodCoupon(coupon.code);
                        onClose();
                        navigate(`/food/${coupon.primaryRestaurantId}?campaign=true`);
                      }}
                      className={`mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-xl px-4 py-2 font-semibold ${
                        isActive ? "border border-emerald-200 bg-emerald-50 text-emerald-800" : "bg-[#D90049] text-white hover:bg-[#B6003C]"
                      }`}
                    >
                      {isActive ? "Aktif ✓" : "Kuponu Seç & Restorana Git"}
                    </button>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
