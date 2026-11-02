import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { formatTRY } from "../types/domain";
import { readDemoOrder, saveDemoOrder, type DemoOrder, type DemoOrderStage } from "../state/demoOrder";

const TRACKING_STEPS = [
  { title: "Sipariş alındı", detail: "Demo siparişin oluşturuldu ve kaydedildi." },
  { title: "Hazırlanıyor", detail: "Örnek hazırlık aşaması gösteriliyor." },
  { title: "Yola çıktı", detail: "Örnek teslimat yolculuğu gösteriliyor." },
  { title: "Teslim edildi", detail: "Demo sipariş süreci tamamlandı." }
] as const;

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

  if (!order) {
    return (
      <section className="mx-auto max-w-2xl rounded-2xl border border-slate-300 bg-white p-6 sm:p-8">
        <h1 className="text-2xl font-bold">Sipariş takibi</h1>
        <p className="my-5 text-slate-700">Bu sekmede henüz bir demo sipariş yok. Sipariş takibi için önce bir demo sipariş tamamlamalısın.</p>
        <Link to="/" className="btn-primary">Sipariş oluşturmaya başla</Link>
      </section>
    );
  }

  const activeStep = TRACKING_STEPS[order.stage];
  const completed = order.stage === TRACKING_STEPS.length - 1;
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <section className="rounded-2xl border border-slate-300 bg-white p-6 sm:p-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#FFF1F6] px-4 py-2 text-sm font-semibold text-brand-dark">
          <span aria-hidden="true">✓</span>
          Demo sipariş oluşturuldu
        </div>
        <h1 className="mt-5 text-[32px] font-bold leading-10 text-[#0F172A] sm:text-[40px] sm:leading-[48px]">Siparişini takip et</h1>
        <p className="mt-3 text-base leading-6 text-[#475569]">
          Sipariş numaran ve takip adımları burada. Bu yalnızca eğitim simülasyonudur; gerçek sipariş, kurye veya teslimat yoktur.
        </p>
        <dl className="mt-6 grid gap-4 rounded-xl bg-[#F8FAFC] p-5 sm:grid-cols-2">
          <div><dt className="text-sm text-[#475569]">Demo sipariş numarası</dt><dd className="mt-1 font-bold text-[#0F172A]">{order.orderId}</dd></div>
          <div><dt className="text-sm text-[#475569]">Bölüm</dt><dd className="mt-1 font-semibold">{order.service === "food" ? "YEMEK" : "MARKET"}</dd></div>
          <div><dt className="text-sm text-[#475569]">Demo sipariş tutarı</dt><dd className="mt-1 font-semibold">{formatTRY(order.amount)}</dd></div>
          <div><dt className="text-sm text-[#475569]">Ödeme yöntemi</dt><dd className="mt-1 font-semibold">{order.method === "cash-demo" ? "Teslimatta ödeme (demo)" : "Kartla ödeme (demo)"}</dd></div>
          <div className="sm:col-span-2"><dt className="text-sm text-[#475569]">Oluşturulma zamanı</dt><dd className="mt-1 font-semibold">{new Date(order.createdAt).toLocaleString("tr-TR")}</dd></div>
        </dl>
      </section>

      <section className="rounded-2xl border border-slate-300 bg-white p-6 sm:p-8" aria-labelledby="tracking-title">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h2 id="tracking-title" className="text-[28px] font-bold leading-9">Sipariş takip durumu</h2>
            <p className="mt-1 text-sm text-[#475569]">Dört örnek aşamadan {order.stage + 1}. aşamadasın.</p>
          </div>
          <span className="w-fit rounded-lg border border-[#CBD5E1] bg-white px-3 py-2 text-sm font-semibold text-[#475569]">DEMO TAKİP</span>
        </div>

        <div role="status" aria-live="polite" className="mt-6 rounded-xl border border-[#CBD5E1] bg-[#FFF1F6] p-5">
          <p className="text-sm font-semibold text-[#B6003C]">Şu anki aşama</p>
          <p className="mt-1 text-xl font-bold text-[#0F172A]">{activeStep.title}</p>
          <p className="mt-2 text-sm leading-5 text-[#475569]">{activeStep.detail}</p>
        </div>

        <ol className="mt-7 space-y-0">
          {TRACKING_STEPS.map((step, index) => {
            const past = index < order.stage;
            const active = index === order.stage;
            return (
              <li key={step.title} aria-current={active ? "step" : undefined} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <span className={"flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 text-base font-bold " + (past ? "border-[#166534] bg-[#166534] text-white" : active ? "border-[#D90049] bg-[#D90049] text-white" : "border-[#CBD5E1] bg-white text-[#475569]")}>
                    {past ? "✓" : index + 1}
                  </span>
                  {index < TRACKING_STEPS.length - 1 && <span aria-hidden="true" className={"h-12 w-0.5 " + (past ? "bg-[#166534]" : "bg-[#CBD5E1]")} />}
                </div>
                <div className="pt-1">
                  <h3 className={"font-semibold " + (active ? "text-[#D90049]" : "text-[#0F172A]")}>{step.title}</h3>
                  <p className="mt-1 text-sm text-[#475569]">{past ? "Demo aşaması tamamlandı" : active ? "Şu an gösterilen aşama" : "Henüz başlanmadı"}</p>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-6 border-t border-[#CBD5E1] pt-6">
          <h3 className="font-semibold text-[#0F172A]">Takip akışını test et</h3>
          <p className="mt-1 text-sm text-[#475569]">Aşamalar yalnızca butona basıldığında ilerler; gerçek zamanlı teslimat verisi değildir.</p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={() => moveStage(1)} disabled={completed} className="btn-primary flex-1">{completed ? "Tüm demo aşamaları tamamlandı" : "Sonraki demo aşamasına geç →"}</button>
            <button type="button" onClick={() => moveStage(-1)} disabled={order.stage === 0} className="min-h-11 rounded-xl border border-[#CBD5E1] bg-white px-5 py-3 font-semibold text-[#0F172A] transition hover:bg-[#F8FAFC] disabled:opacity-50">Önceki aşamaya dön</button>
          </div>
          {completed && <p className="mt-4 font-semibold text-[#166534]" role="status">Demo teslimat akışı başarıyla tamamlandı.</p>}
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link to="/" className="btn-primary">Ana sayfaya dön</Link>
        <Link to={order.service === "food" ? "/food" : "/market"} className="inline-flex min-h-11 items-center rounded-xl border border-[#CBD5E1] bg-white px-5 py-3 font-semibold hover:border-brand">Yeni demo sipariş oluştur</Link>
      </div>
    </div>
  );
}
