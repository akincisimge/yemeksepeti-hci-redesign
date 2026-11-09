export default function CheckoutSteps({ payment = false, complete = false, onAddress, disabled = false }: { payment?: boolean; complete?: boolean; onAddress?: () => void; disabled?: boolean }) {
  return <nav aria-label="Sipariş adımları">
    <ol className="flex max-w-[600px] items-center gap-8">
      {["Adres", "Ödeme", "Onay"].map((label, index) => {
        const current = index === (complete ? 2 : payment ? 1 : 0);
        const completed = complete ? index < 2 : payment && index === 0;
        const content = <><span aria-hidden="true" className={"flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-semibold " + (current || completed ? "border-brand bg-brand text-white" : "border-slate-300 bg-white text-slate-600")}>{completed ? "✓" : index + 1}</span><span>{label}</span></>;
        return <li key={label} aria-current={current ? "step" : undefined} className={"flex-1 " + (current || completed ? "font-semibold text-brand" : "text-slate-600")}>
          {completed && !complete && onAddress ? <button type="button" onClick={onAddress} disabled={disabled} className="flex min-h-11 items-center gap-2 rounded-lg" aria-label="Adres adımına dön">{content}</button> : <span className="flex min-h-11 items-center gap-2">{content}</span>}
        </li>;
      })}
    </ol>
  </nav>;
}
