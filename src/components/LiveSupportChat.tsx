import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { buildSupportReply, SUPPORT_TOPICS, type SupportAction } from "../data/supportAssistant";
import { locationLabel } from "../data/delivery";
import { useDelivery } from "../state/DeliveryContext";
import { useAccount } from "../state/AccountContext";
import { readDemoOrder } from "../state/demoOrder";

type ChatMessage = {
  id: string;
  sender: "visitor" | "assistant";
  text: string;
  time: string;
  action?: SupportAction;
};

type LiveSupportChatProps = {
  onOpenAddress?: () => void;
  onOpenCoupons?: () => void;
  onNavigateAway?: () => void;
  compact?: boolean;
};

function currentTimeLabel() {
  return new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
}

function createInitialMessage(): ChatMessage {
  return {
    id: "welcome",
    sender: "assistant",
    text: "Merhaba! Bu, HCI projesi için hazırlanmış otomatik canlı yardım demosudur. Sipariş takibi, adres seçimi, kuponlar veya demo hesabınla ilgili destek almak istediğin konuyu seçebilirsin.",
    time: currentTimeLabel(),
  };
}

export default function LiveSupportChat({
  onOpenAddress,
  onOpenCoupons,
  onNavigateAway,
  compact = false,
}: LiveSupportChatProps) {
  const { delivery } = useDelivery();
  const { account } = useAccount();
  const [messages, setMessages] = useState<ChatMessage[]>([createInitialMessage()]);
  const [input, setInput] = useState("");
  const [finished, setFinished] = useState(false);
  const [rating, setRating] = useState<"yes" | "no" | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages]);

  function send(question: string) {
    const trimmed = question.trim();
    if (!trimmed || finished) return;

    const reply = buildSupportReply(trimmed, {
      order: readDemoOrder(),
      locationText: delivery ? locationLabel(delivery) : null,
      accountName: account?.name ?? null,
    });
    const stamp = currentTimeLabel();
    const baseId = `${Date.now()}-${messages.length}`;

    setMessages((old) => [
      ...old,
      { id: `${baseId}-v`, sender: "visitor", text: trimmed, time: stamp },
      { id: `${baseId}-a`, sender: "assistant", text: reply.text, time: stamp, action: reply.action },
    ]);
    setInput("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    send(input);
  }

  function restartChat() {
    setMessages([
      {
        id: `restart-${Date.now()}`,
        sender: "assistant",
        text: "Yeni demo görüşmesi başlatıldı. Hangi konuda yardımcı olabilirim?",
        time: currentTimeLabel(),
      },
    ]);
    setFinished(false);
    setRating(null);
  }

  function renderAction(action: SupportAction) {
    if (action.actionType === "open-address" && onOpenAddress) {
      return (
        <button
          type="button"
          onClick={onOpenAddress}
          className="mt-2 inline-flex min-h-11 items-center rounded-xl border border-brand bg-white px-3 py-2 text-xs font-semibold text-brand-dark hover:bg-[#FFF1F6]"
        >
          {action.label} →
        </button>
      );
    }
    if (action.actionType === "open-coupons" && onOpenCoupons) {
      return (
        <button
          type="button"
          onClick={onOpenCoupons}
          className="mt-2 inline-flex min-h-11 items-center rounded-xl border border-brand bg-white px-3 py-2 text-xs font-semibold text-brand-dark hover:bg-[#FFF1F6]"
        >
          {action.label} →
        </button>
      );
    }
    const destination =
      action.to ??
      (action.actionType === "open-coupons" ? "/food" : "/");
    return (
      <Link
        to={destination}
        onClick={onNavigateAway}
        className="mt-2 inline-flex min-h-11 items-center rounded-xl border border-brand bg-white px-3 py-2 text-xs font-semibold text-brand-dark hover:bg-[#FFF1F6]"
      >
        {action.label} →
      </Link>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className="rounded-xl border border-slate-200 bg-[#FFF1F6] p-4">
        <p className="font-semibold text-slate-900">Canlı yardım simülasyonu (otomatik demo)</p>
        <p className="mt-1 text-sm text-slate-700">
          Sorulara anında örnek yanıtlar üretilir. Gerçek bir müşteri temsilcisiyle bağlantı kurulmaz.
        </p>
      </div>

      <div
        role="log"
        aria-label="Demo sohbet mesajları"
        aria-live="polite"
        aria-relevant="additions"
        className={
          (compact ? "min-h-48 flex-1 " : "min-h-72 max-h-[420px] ") +
          "space-y-4 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50 p-4"
        }
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={"flex flex-col " + (message.sender === "visitor" ? "items-end" : "items-start")}
          >
            <span className="mb-1 text-xs font-medium text-slate-600">
              {message.sender === "visitor" ? "Sen" : "Demo Asistan"} · {message.time}
            </span>
            <div
              className={
                "max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-6 " +
                (message.sender === "visitor"
                  ? "bg-brand text-white"
                  : "border border-slate-200 bg-white text-slate-900")
              }
            >
              <p>{message.text}</p>
              {message.action && renderAction(message.action)}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {finished ? (
        <div className="space-y-4 rounded-2xl border border-[#166534] bg-white p-4">
          <p role="status" className="font-semibold text-[#166534]">
            Demo görüşmesi sonlandırıldı.
          </p>
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-800">Bu demo destek deneyimi yardımcı oldu mu?</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                aria-pressed={rating === "yes"}
                onClick={() => setRating("yes")}
                className={
                  rating === "yes"
                    ? "min-h-11 rounded-xl border border-[#166534] bg-emerald-50 px-4 py-2 text-sm font-semibold text-[#166534]"
                    : "min-h-11 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:border-brand"
                }
              >
                Evet, yardımcı oldu
              </button>
              <button
                type="button"
                aria-pressed={rating === "no"}
                onClick={() => setRating("no")}
                className={
                  rating === "no"
                    ? "min-h-11 rounded-xl border border-brand bg-[#FFF1F6] px-4 py-2 text-sm font-semibold text-brand-dark"
                    : "min-h-11 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:border-brand"
                }
              >
                Geliştirilebilir
              </button>
            </div>
            {rating && (
              <p role="status" className="text-xs font-medium text-slate-600">
                Geri bildirimin bu oturumda kaydedildi. Teşekkürler!
              </p>
            )}
          </div>
          <button type="button" className="btn-primary w-full" onClick={restartChat}>
            Yeni demo görüşmesi başlat
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-2" aria-label="Sık kullanılan yardım başlıkları">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Hızlı konu seç</p>
            <div className={compact ? "space-y-2" : "flex flex-wrap gap-2"}>
              {SUPPORT_TOPICS.map((topic) => (
                <button
                  type="button"
                  key={topic}
                  onClick={() => send(topic)}
                  className={
                    compact
                      ? "min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-left text-sm font-medium text-slate-800 hover:border-brand hover:bg-[#FFF1F6]"
                      : "min-h-11 rounded-xl border border-slate-300 bg-white px-4 py-2 text-left text-sm font-medium text-slate-800 hover:border-brand hover:bg-[#FFF1F6]"
                  }
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex items-end gap-2">
            <label className="min-w-0 flex-1">
              <span className="mb-2 block text-sm font-semibold text-slate-900">Mesajın (demo)</span>
              <input
                className="field min-h-12"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                maxLength={240}
                placeholder="Örn. Siparişim nerede veya adres değiştirmek istiyorum..."
              />
            </label>
            <button type="submit" disabled={!input.trim()} className="btn-primary min-h-12 shrink-0">
              Gönder
            </button>
          </form>

          <button
            type="button"
            onClick={() => setFinished(true)}
            className="min-h-11 w-full rounded-xl text-sm font-semibold text-slate-700 underline underline-offset-4 hover:text-brand"
          >
            Görüşmeyi sonlandır
          </button>
        </>
      )}
    </div>
  );
}
