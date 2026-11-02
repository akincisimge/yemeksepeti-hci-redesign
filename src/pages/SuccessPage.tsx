import { Link, useLocation } from "react-router-dom";
import { formatTRY, type Service } from "../types/domain";

type Receipt = { orderId: string; amount: number; service: Service };
export default function SuccessPage() {
  const location = useLocation();
  const receipt = location.state as Receipt | null;
  if (!receipt) return <div className="mx-auto max-w-lg rounded-2xl bg-white p-8"><h1 className="text-2xl font-bold">Sipariş sonucu</h1><p className="my-4">Bu sayfa yalnızca demo siparişi tamamlandıktan sonra gösterilir.</p><Link to="/" className="btn-primary">Ana sayfaya dön</Link></div>;
  return <section className="mx-auto max-w-lg rounded-2xl border border-green-200 bg-white p-8 text-center" role="status">
    <div className="text-6xl" aria-hidden="true">✅</div>
    <h1 className="mt-5 text-3xl font-bold">Demo sipariş tamamlandı!</h1>
    <p className="mt-3 text-slate-600">Gerçek sipariş oluşturulmadı ve ödeme alınmadı.</p>
    <dl className="mt-6 space-y-2 rounded-xl bg-slate-50 p-5 text-left">
      <div className="flex justify-between gap-3"><dt>Sipariş numarası</dt><dd className="font-bold">{receipt.orderId}</dd></div>
      <div className="flex justify-between gap-3"><dt>Bölüm</dt><dd>{receipt.service === "food" ? "Yemek" : "Market"}</dd></div>
      <div className="flex justify-between gap-3"><dt>Simüle edilen toplam</dt><dd className="font-bold">{formatTRY(receipt.amount)}</dd></div>
    </dl>
    <Link to="/" className="btn-primary mt-6 inline-block">Ana sayfaya dön</Link>
  </section>;
}
