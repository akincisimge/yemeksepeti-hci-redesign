import { useState, type FormEvent } from "react";
import { useDelivery } from "../state/DeliveryContext";

const QUICK_COURIER_NOTES = [
  { icon: "🚪", text: "Kapıya bırakınız" },
  { icon: "🔕", text: "Zile basmayınız" },
  { icon: "📞", text: "Gelince telefonla arayınız" },
  { icon: "🏢", text: "Apartman girişinde teslim" },
] as const;

export default function CourierNoteForm({ onDone }: { onDone: () => void }) {
  const { courierNote, saveCourierNote } = useDelivery();
  const [note, setNote] = useState(courierNote);

  function toggleQuickNote(snippet: string) {
    setNote((prev) => {
      const parts = prev
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
      const exists = parts.some((item) => item.toLocaleLowerCase("tr") === snippet.toLocaleLowerCase("tr"));
      const next = exists
        ? parts.filter((item) => item.toLocaleLowerCase("tr") !== snippet.toLocaleLowerCase("tr")).join(", ")
        : [...parts, snippet].join(", ");
      return next.slice(0, 160);
    });
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    saveCourierNote(note);
    onDone();
  }

  const partsLower = note
    .split(",")
    .map((item) => item.trim().toLocaleLowerCase("tr"))
    .filter(Boolean);

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-600">Tek dokunuşla ekle</p>
        <div className="flex flex-wrap gap-2">
          {QUICK_COURIER_NOTES.map((item) => {
            const active = partsLower.includes(item.text.toLocaleLowerCase("tr"));
            return (
              <button
                key={item.text}
                type="button"
                aria-pressed={active}
                onClick={() => toggleQuickNote(item.text)}
                className={
                  active
                    ? "inline-flex min-h-11 items-center gap-1.5 rounded-full border-2 border-brand bg-[#FFF1F6] px-3.5 py-2 text-sm font-bold text-brand-dark"
                    : "inline-flex min-h-11 items-center gap-1.5 rounded-full border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-800 hover:border-brand hover:bg-[#FFF1F6]"
                }
              >
                <span aria-hidden="true">{item.icon}</span>
                <span>{item.text}</span>
              </button>
            );
          })}
        </div>
      </div>

      <label className="block">
        <span className="mb-1.5 flex items-center justify-between text-sm font-bold text-slate-900">
          <span>Kuryeye iletilecek not</span>
          <span className="text-xs font-medium text-slate-500">{note.length} / 160</span>
        </span>
        <textarea
          data-autofocus
          rows={3}
          maxLength={160}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Ör. Mavi bina, zile basmadan kapıya bırakabilirsiniz..."
          className="field text-sm"
        />
      </label>

      <div className="flex flex-col-reverse gap-2 sm:flex-row">
        {note.trim() ? (
          <button
            type="button"
            onClick={() => {
              saveCourierNote("");
              onDone();
            }}
            className="min-h-11 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-[#991B1B] hover:text-[#991B1B]"
          >
            Notu Sil
          </button>
        ) : (
          <button
            type="button"
            onClick={onDone}
            className="min-h-11 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-brand"
          >
            Vazgeç
          </button>
        )}
        <button type="submit" className="btn-primary min-h-12 flex-1 text-base">
          Notu Kaydet ✓
        </button>
      </div>
    </form>
  );
}
