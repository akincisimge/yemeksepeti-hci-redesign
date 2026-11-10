import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { formatTRY } from "../types/domain";
import {
  clearDemoOrder,
  DEMO_TRACKING_STEPS,
  readDemoOrder,
  saveDemoOrder,
  type DemoOrder,
  type DemoOrderStage,
} from "../state/demoOrder";

export default function SuccessPage() {
  const location = useLocation();
  const navigationOrder = location.state as DemoOrder | null;
  const [order, setOrder] = useState<DemoOrder | null>(() => {
    const saved = readDemoOrder();
    return saved ?? (navigationOrder?.orderId ? navigationOrder : null);
  });

  function moveStage(direction: -1 | 1) {
    if (!order) return;
    const stage = Math.max(0, Math.min(3, order.stage + direction)) as DemoOrderStage;
    const next = { ...order, stage };
    setOrder(next);
    saveDemoOrder(next);
  }

  function resetTracking() {
    clearDemoOrder();
    setOrder(null);
  }

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
            Restoran veya marketlerden bir sipariş oluşturduktan sonra teslimat adımlarını buradan takip edebilirsin.
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
          Sipariş numaran ve güncel teslimat durumun aşağıda yer alıyor.
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
            className="h-full rounded-full bg-[#D90049] transition-all duration-300"
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

        <div className="mt-6 border-t border-[#CBD5E1] pt-6">
          <h3 className="font-semibold text-[#0F172A]">Teslimat aşamasını güncelle</h3>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={() => moveStage(1)} disabled={completed} className="btn-primary flex-1">
              {completed ? "Sipariş teslim edildi" : "Sonraki aşamaya geç →"}
            </button>
            <button
              type="button"
              onClick={() => moveStage(-1)}
              disabled={order.stage === 0}
              className="min-h-11 rounded-xl border border-[#CBD5E1] bg-white px-5 py-3 font-semibold text-[#0F172A] transition hover:bg-[#F8FAFC] disabled:opacity-50"
            >
              Önceki aşamaya dön
            </button>
          </div>
          {completed && (
            <p className="mt-4 font-semibold text-[#166534]" role="status">
              Siparişin başarıyla teslim edildi.
            </p>
          )}
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
        <Link
          to="/support"
          className="inline-flex min-h-11 items-center rounded-xl border border-brand bg-[#FFF1F6] px-5 py-3 font-semibold text-brand-dark hover:bg-white"
        >
          Bu siparişle ilgili canlı destek al
        </Link>
        <button
          type="button"
          onClick={resetTracking}
          className="min-h-11 rounded-xl px-3 py-2 text-sm font-semibold text-[#991B1B] underline underline-offset-2 hover:bg-red-50"
        >
          Siparişi gizle
        </button>
      </div>
    </div>
  );
}
