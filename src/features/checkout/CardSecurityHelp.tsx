export default function CardSecurityHelp() {
  return <details className="mt-1 text-sm text-slate-600">
    <summary className="flex min-h-11 cursor-pointer items-center gap-2 rounded-lg font-medium text-brand underline underline-offset-4">
      <span aria-hidden="true">ⓘ</span> Güvenlik kodu nerede?
    </summary>
    <div className="space-y-3 rounded-xl border border-slate-300 bg-slate-50 p-3">
      <svg aria-hidden="true" viewBox="0 0 248 76" className="h-auto w-full max-w-[248px]">
        <rect x="1" y="1" width="112" height="72" rx="8" fill="white" stroke="#64748b" />
        <path d="M2 17h110" stroke="#475569" strokeWidth="12" />
        <rect x="12" y="38" width="87" height="20" rx="3" fill="#e2e8f0" />
        <rect x="65" y="36" width="36" height="24" rx="4" fill="white" stroke="#d90049" strokeWidth="2" />
        <text x="83" y="53" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fill="#0f172a">123</text>
        <rect x="131" y="1" width="112" height="72" rx="8" fill="white" stroke="#64748b" />
        <rect x="143" y="21" width="20" height="16" rx="4" fill="#cbd5e1" />
        <rect x="193" y="18" width="42" height="23" rx="4" fill="white" stroke="#d90049" strokeWidth="2" />
        <text x="214" y="34" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fill="#0f172a">1234</text>
        <path d="M143 53h85M143 62h39" stroke="#94a3b8" strokeWidth="3" />
      </svg>
      <p className="leading-5">Çoğu kartta arka yüzdeki 3 haneli koddur. Bazı kartlarda ön yüzde 4 hane bulunur. Kart şifren değildir.</p>
    </div>
  </details>;
}
