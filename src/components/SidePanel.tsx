import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import LocationPicker from "./LocationPicker";
import AccountForm from "./AccountForm";
import LiveSupportChat from "./LiveSupportChat";
import { useAccount } from "../state/AccountContext";
import { readDemoOrder } from "../state/demoOrder";
import { foodCoupons } from "../features/food/data/foodData";
import { useFoodCoupon } from "../features/food/state/FoodCouponContext";

export type PanelView = "address" | "profile" | "account" | "orders" | "coupons" | "help" | null;

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
    address: "Teslimat konumu",
    profile: "Profil ve hesabım",
    account: "Demo hesabım",
    orders: "Önceki siparişlerim",
    coupons: "Kuponlarım",
    help: "Yardım ve canlı destek",
  };
  const subpage = view !== "profile" && view !== "address";
  const lastOrder = view === "orders" ? readDemoOrder() : null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-slate-900/40"
      />
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="panel-title"
        className="absolute inset-y-0 right-0 flex w-full flex-col bg-white shadow-2xl sm:max-w-[440px]"
      >
        <header className="flex min-h-[76px] shrink-0 items-center gap-3 border-b border-slate-200 px-4 sm:px-6">
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
          <h2 id="panel-title" className="min-w-0 flex-1 text-xl font-bold text-slate-900">{title[view]}</h2>
          <button
            data-close
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-300 text-xl text-slate-700 hover:bg-slate-50"
            aria-label="Paneli kapat"
          >
            ×
          </button>
        </header>
        <div className={"min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6 " + (view === "help" ? "flex flex-col" : "")}>
          {view === "address" && <LocationPicker onDone={onClose} />}
          {view === "profile" && (
            <div className="space-y-3">
              <div className="mb-5 rounded-2xl bg-[#FFF1F6] p-5">
                <p className="text-sm font-semibold text-brand-dark">HOŞ GELDİN</p>
                <p className="mt-2 text-xl font-bold text-slate-900">{account?.name ?? "Misafir kullanıcı"}</p>
                <p className="mt-1 text-sm text-slate-700">
                  {account ? "Demo profilin oluşturuldu." : "Adreslerini, siparişlerini ve kuponlarını tek yerden yönet."}
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate("account")}
                  className="mt-4 min-h-11 rounded-xl border border-brand px-4 font-semibold text-brand-dark hover:bg-white"
                >
                  {account ? "Profil bilgilerimi düzenle" : "Demo profil oluştur"}
                </button>
              </div>
              <PanelRow label="Kayıtlı adreslerim" detail={address ?? "Henüz adres seçilmedi"} onClick={() => onNavigate("address")} />
              <PanelRow label="Önceki siparişlerim" detail="Demo sipariş geçmişi" onClick={() => onNavigate("orders")} />
              <PanelRow label="Tanımlı kuponlarım" detail="Kupon durumlarını incele" onClick={() => onNavigate("coupons")} />
              <PanelRow label="Yardım / Canlı destek" detail="Otomatik örnek destek sohbeti" onClick={() => onNavigate("help")} />
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
          {view === "account" && <AccountForm onSaved={() => onNavigate("profile")} />}
          {view === "orders" && (
            <div className="space-y-4">
              {lastOrder ? (
                <>
                  <p className="rounded-xl bg-[#FFF1F6] p-4 text-slate-700">Bu tarayıcı sekmesinde son oluşturduğun demo sipariş:</p>
                  <dl className="space-y-3 rounded-xl border border-slate-300 bg-white p-4">
                    <div><dt className="text-sm text-slate-600">Sipariş numarası</dt><dd className="font-bold">{lastOrder.orderId}</dd></div>
                    <div><dt className="text-sm text-slate-600">Hizmet</dt><dd className="font-semibold">{lastOrder.service === "food" ? "YEMEK" : "MARKET"}</dd></div>
                    {lastOrder.locationLabel && <div><dt className="text-sm text-slate-600">Teslimat bölgesi</dt><dd className="font-semibold">{lastOrder.locationLabel}</dd></div>}
                  </dl>
                  <Link to="/success" onClick={onClose} className="btn-primary w-full">Sipariş takibini aç</Link>
                </>
              ) : (
                <>
                  <p className="rounded-xl bg-slate-50 p-4 text-slate-700">
                    Henüz demo sipariş oluşturmadın. Sipariş tamamlandıktan sonra takip ekranına buradan tekrar erişebilirsin.
                  </p>
                  <Link to="/food" onClick={onClose} className="btn-primary w-full">Yemekleri keşfet</Link>
                </>
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
          {view === "help" && (
            <div className="flex min-h-0 flex-1 flex-col gap-3">
              <Link
                to="/support"
                onClick={onClose}
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm font-semibold text-brand-dark hover:border-brand hover:bg-[#FFF1F6]"
              >
                Canlı destek tam sayfasını aç →
              </Link>
              <LiveSupportChat
                compact
                onOpenAddress={() => onNavigate("address")}
                onOpenCoupons={() => onNavigate("coupons")}
                onNavigateAway={onClose}
              />
            </div>
          )}
        </div>
        <div className="shrink-0 border-t border-slate-200 bg-slate-50 px-4 py-3 text-center text-xs text-slate-600 sm:px-6">
          Bağımsız HCI öğrenci projesi · Gerçek müşteri desteği değildir.
        </div>
      </aside>
    </div>
  );
}
