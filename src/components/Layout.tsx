import { Link, NavLink, Outlet } from "react-router-dom";
import { useCart } from "../state/CartContext";

export default function Layout() {
  const { count } = useCart();
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <a className="skip-link" href="#main-content">Ana içeriğe geç</a>
      <div className="bg-slate-900 px-4 py-2 text-center text-xs font-medium text-white">
        HCI dersi için hazırlanmış eğitim simülasyonu – Gerçek sipariş ve ödeme alınmaz.
      </div>
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-5">
          <Link to="/" className="text-2xl font-extrabold tracking-tight text-brand" aria-label="Giriş sayfasına dön">
            yemeksepeti <span className="text-sm font-medium text-slate-500">HCI Demo</span>
          </Link>
          <nav aria-label="Ana menü" className="flex flex-wrap items-center gap-2 text-sm font-semibold">
            <NavLink to="/food" className={({ isActive }) => isActive ? "nav-link nav-link-active" : "nav-link"}>Yemek</NavLink>
            <NavLink to="/market" className={({ isActive }) => isActive ? "nav-link nav-link-active" : "nav-link"}>Market</NavLink>
            <Link to="/cart/food" className="nav-link" aria-label={"Yemek sepeti, " + count("food") + " ürün"}>Yemek sepeti ({count("food")})</Link>
            <Link to="/cart/market" className="nav-link" aria-label={"Market sepeti, " + count("market") + " ürün"}>Market sepeti ({count("market")})</Link>
          </nav>
        </div>
      </header>
      <main id="main-content" className="mx-auto max-w-6xl px-4 py-8"><Outlet /></main>
      <footer className="mt-12 border-t border-slate-200 px-4 py-8 text-center text-xs text-slate-500">
        Bağımsız öğrenci projesidir; resmî Yemeksepeti hizmeti değildir.
      </footer>
    </div>
  );
}
