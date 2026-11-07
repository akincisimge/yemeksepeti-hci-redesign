import { useEffect, useId, useState } from "react";
import { normalizePlace } from "../data/delivery";
type Props = { label: string; value: string; options: string[]; onChange: (value: string) => void; disabled?: boolean; placeholder?: string };
export default function SearchSelect({ label, value, options, onChange, disabled, placeholder }: Props) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const [active, setActive] = useState(-1);
  const matches = options.filter(option => normalizePlace(option).includes(normalizePlace(query)));
  useEffect(() => { if (!open) setQuery(value); }, [value, open]);
  useEffect(() => { setActive(-1); }, [query]);
  useEffect(() => { if (open) document.getElementById(`${id}-option-${active}`)?.scrollIntoView({ block: "nearest" }); }, [active, open, id]);
  function select(option: string) { onChange(option); setQuery(option); setOpen(false); }
  return <div className="relative min-w-0">
    <label htmlFor={id} className="mb-2 block text-sm font-semibold text-slate-800">{label}</label>
    <div className="relative"><input id={id} role="combobox" type="text" autoComplete="off" maxLength={80}
      aria-expanded={open} aria-autocomplete="list" aria-controls={`${id}-options`} aria-activedescendant={open && matches[active] ? `${id}-option-${active}` : undefined}
      className="field min-h-12 pr-10 disabled:bg-slate-100 disabled:text-slate-600" disabled={disabled} value={query} placeholder={placeholder}
      onClick={() => setOpen(true)}
      onFocus={event => { setOpen(true); event.currentTarget.select(); }}
      onBlur={() => { setOpen(false); setQuery(value); }}
      onChange={event => { setQuery(event.target.value); setOpen(true); if (value) onChange(""); }}
      onKeyDown={event => {
        if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); setOpen(false); setQuery(value); return; }
        if (event.key === "ArrowDown" || event.key === "ArrowUp") { event.preventDefault(); setOpen(true); setActive(index => Math.max(0, Math.min(matches.length - 1, index + (event.key === "ArrowDown" ? 1 : -1)))); }
        if (event.key === "Home" && open) { event.preventDefault(); setActive(0); }
        if (event.key === "End" && open) { event.preventDefault(); setActive(matches.length - 1); }
        if (event.key === "Enter" && open) { event.preventDefault(); if (matches[Math.max(0, active)]) select(matches[Math.max(0, active)]); }
      }} /><span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-500" aria-hidden="true">⌄</span></div>
    <ul id={`${id}-options`} role="listbox" aria-label={`${label} seçenekleri`} hidden={!open} className="absolute z-20 mt-2 max-h-48 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
      {matches.map((option, index) => <li key={option} id={`${id}-option-${index}`} role="option" aria-selected={option === value} className={`cursor-pointer rounded-lg px-3 py-3 text-sm ${index === active ? "bg-[#FFF1F6] font-semibold text-brand" : "text-slate-800 hover:bg-slate-50"}`} onMouseDown={event => event.preventDefault()} onClick={() => select(option)}>{option}</li>)}
      {!matches.length && <li role="presentation" className="p-3 text-sm text-slate-600">Sonuç yok. Başka bir yazımla ara.</li>}
    </ul>
  </div>;
}
