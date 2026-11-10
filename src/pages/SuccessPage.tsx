import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { formatTRY } from "../types/domain";
import {
  DEMO_TRACKING_STEPS,
  getAutoOrderStage,
  useDemoOrder,
  type DemoOrder,
} from "../state/demoOrder";

export default function SuccessPage() {
  const location = useLocation();
  const navigationOrder = location.state as DemoOrder | null;
  const storedOrder = useDemoOrder();
  const [fallbackTick, setFallbackTick] = useState(0);

  useEffect(() => {
    if (storedOrder || !navigationOrder?.createdAt) return;
    const timer = window.setInterval(() => setFallbackTick((t) => t + 1), 1000);
    return () => window.clearInterval(timer);
  }, [storedOrder, navigationOrder?.createdAt]);

  const fallbackOrder =
    !storedOrder && navigationOrder?.orderId
      ? {
          ...navigationOrder,
          stage: Math.max(
            navigationOrder.stage,
            getAutoOrderStage(navigationOrder.createdAt, Date.now() + fallbackTick * 0),
          ) as DemoOrder["stage"],
        }
      : null;

  const order = storedOrder ?? fallbackOrder;

  if (!order) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <Link to="/" className="inline-flex min-h-11 items-center font-semibold text-slate-600 hover:text-brand">
          ← Ana sayfaya dön
        </Link>
        <section className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="font-semibold text-brand">SİPARİŞ TAKİBİ</p>
          <h1 className="text-3xl font-bold text-[#0F172A]">Henüz aktif siparişin yok</h1>
          <p className="max-w-2xl text-base leading-6 text-slate-600">
            Restoran veya marketlerden bir sipariş oluşturduktan sonra teslimat adımlarını buradan canlı takip edebilirsin.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link to="/food" className="btn-primary">
              Restoranları keşfet
            </Link>
            <Link
              to="/market"
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-900 hover:border-brand hover:text-brand"
            >
              Marketlere git
            </Link>
          </div>
        </section>
      </div>
    );
  }

  const activeStep = DEMO_TRACKING_STEPS[order.stage];
  const completed = order.stage === DEMO_TRACKING_STEPS.length - 1;
  const progressPercent = ((order.stage + 1) / DEMO_TRACKING_STEPS.length) * 100;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link to="/" className="inline-flex min-h-11 items-center font-semibold text-slate-600 hover:text-brand">
        ← Ana sayfaya dön
      </Link>

      <section className="rounded-2xl border border-slate-300 bg-white p-6 sm:p-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#FFF1F6] px-4 py-2 text-sm font-semibold text-brand-dark">
          <span aria-hidden="true">✓</span>
          Siparişin alındı
        </div>
        <h1 className="mt-5 text-[32px] font-bold leading-10 text-[#0F172A] sm:text-[40px] sm:leading-[48px]">
          Siparişini takip et
        </h1>
        <p className="mt-3 text-base leading-6 text-[#475569]">
          Sipariş numaran ve güncel teslimat durumun otomatik olarak güncellenir.
        </p>
        <dl className="mt-6 grid gap-4 rounded-xl bg-[#F8FAFC] p-5 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-[#475569]">Sipariş numarası</dt>
            <dd className="mt-1 font-bold text-[#0F172A]">{order.orderId}</dd>
          </div>
          <div>
            <dt className="text-sm text-[#475569]">Bölüm</dt>
            <dd className="mt-1 font-semibold">{order.service === "food" ? "YEMEK" : "MARKET"}</dd>
          </div>
          {order.storeName && (
            <div>
              <dt className="text-sm text-[#475569]">İşletme</dt>
              <dd className="mt-1 font-semibold">
                {order.storeName}
                {order.itemCount ? ` · ${order.itemCount} ürün` : ""}
              </dd>
            </div>
          )}
          <div>
            <dt className="text-sm text-[#475569]">Sipariş tutarı</dt>
            <dd className="mt-1 font-semibold">{formatTRY(order.amount)}</dd>
          </div>
          <div>
            <dt className="text-sm text-[#475569]">Ödeme yöntemi</dt>
            <dd className="mt-1 font-semibold">
              {order.method === "cash-demo" ? "Kapıda ödeme" : "Online kart ile ödeme"}
            </dd>
          </div>
          {order.customerName && (
            <div>
              <dt className="text-sm text-[#475569]">Alıcı</dt>
              <dd className="mt-1 font-semibold">{order.customerName}</dd>
            </div>
          )}
          {order.locationLabel && (
            <div className="sm:col-span-2">
              <dt className="text-sm text-[#475569]">Teslimat bölgesi</dt>
              <dd className="mt-1 font-semibold">{order.locationLabel}</dd>
            </div>
          )}
          {order.courierNote && (
            <div className="sm:col-span-2">
              <dt className="text-sm text-[#475569]">Kuryeye not</dt>
              <dd className="mt-1 font-semibold">{order.courierNote}</dd>
            </div>
          )}
          <div className="sm:col-span-2">
            <dt className="text-sm text-[#475569]">Sipariş zamanı</dt>
            <dd className="mt-1 font-semibold">{new Date(order.createdAt).toLocaleString("tr-TR")}</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-2xl border border-slate-300 bg-white p-6 sm:p-8" aria-labelledby="tracking-title">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h2 id="tracking-title" className="text-[28px] font-bold leading-9">Sipariş durumu</h2>
            <p className="mt-1 text-sm text-[#475569]">
              Dört aşamadan {order.stage + 1}. aşamadasın.
            </p>
          </div>
          <span className="w-fit rounded-lg border border-[#CBD5E1] bg-white px-3 py-2 text-sm font-semibold text-[#475569]">
            {order.stage + 1} / {DEMO_TRACKING_STEPS.length}
          </span>
        </div>

        <div
          role="progressbar"
          aria-label="Sipariş ilerleme durumu"
          aria-valuemin={1}
          aria-valuemax={DEMO_TRACKING_STEPS.length}
          aria-valuenow={order.stage + 1}
          aria-valuetext={`${order.stage + 1} / ${DEMO_TRACKING_STEPS.length}: ${activeStep.title}`}
          className="mt-5 h-3 w-full overflow-hidden rounded-full bg-slate-200"
        >
          <div
            className="h-full rounded-full bg-[#D90049] transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div role="status" aria-live="polite" className="mt-6 rounded-xl border border-[#CBD5E1] bg-[#FFF1F6] p-5">
          <p className="text-sm font-semibold text-[#B6003C]">Şu anki aşama</p>
          <p className="mt-1 text-xl font-bold text-[#0F172A]">{activeStep.title}</p>
          <p className="mt-2 text-sm leading-5 text-[#475569]">{activeStep.detail}</p>
        </div>

        <ol className="mt-7 space-y-0">
          {DEMO_TRACKING_STEPS.map((step, index) => {
            const past = index < order.stage;
            const active = index === order.stage;
            return (
              <li key={step.title} aria-current={active ? "step" : undefined} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <span
                    className={
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 text-base font-bold " +
                      (past
                        ? "border-[#166534] bg-[#166534] text-white"
                        : active
                          ? "border-[#D90049] bg-[#D90049] text-white"
                          : "border-[#CBD5E1] bg-white text-[#475569]")
                    }
                  >
                    {past ? "✓" : index + 1}
                  </span>
                  {index < DEMO_TRACKING_STEPS.length - 1 && (
                    <span aria-hidden="true" className={"h-12 w-0.5 " + (past ? "bg-[#166534]" : "bg-[#CBD5E1]")} />
                  )}
                </div>
                <div className="pt-1">
                  <h3 className={"font-semibold " + (active ? "text-[#D90049]" : "text-[#0F172A]")}>{step.title}</h3>
                  <p className="mt-1 text-sm text-[#475569]">
                    {past ? "Tamamlandı" : active ? "Güncel aşama" : "Sıradaki aşama"}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>

        <div
          role="status"
          className={
            completed
              ? "mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-900"
              : "mt-6 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-700"
          }
        >
          {!completed && <span className="h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-brand" aria-hidden="true" />}
          <span>
            {completed
              ? "✓ Siparişin başarıyla teslim edildi. Afiyet olsun!"
              : "Sipariş durumun canlı olarak otomatik güncelleniyor."}
          </span>
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <Link to="/" className="btn-primary">Ana sayfaya dön</Link>
        <Link
          to={order.service === "food" ? "/food" : "/market"}
          className="inline-flex min-h-11 items-center rounded-xl border border-[#CBD5E1] bg-white px-5 py-3 font-semibold hover:border-brand"
        >
          Yeni sipariş oluştur
        </Link>
      </div>
    </div>
  );
}
